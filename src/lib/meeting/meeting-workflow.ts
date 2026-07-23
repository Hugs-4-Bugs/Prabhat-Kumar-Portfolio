/**
 * Meeting Workflow — Phase 4
 * High-level orchestration actions. Callers (voice, chat, form) use
 * these functions instead of manipulating the session directly.
 *
 * Phase 5 adapters (Google Calendar, Meet, Teams, email) will be
 * plugged in here as drop-in async functions.
 */

import {
  type MeetingSession,
  applyField,
  extractData,
  summariseReasonField,
  getNextQuestion,
  createSession,
} from "./meeting-session";
import { transition } from "./meeting-status";
import { validateMeetingForm } from "./meeting-validator";
import { persistSession, clearPersistedSession } from "./meeting-storage";
import { emit } from "./meeting-events";
import type { MeetingFormData } from "./meeting-types";

// ── Adapter extension points (Phase 5 fills these in) ───────────────────────

export interface MeetingAdapters {
  /** Send confirmation email — Phase 5 */
  emailAdapter?: (session: MeetingSession) => Promise<void>;
  /** Create Google Calendar event — Phase 5 */
  calendarAdapter?: (session: MeetingSession) => Promise<string | null>;
  /** Create Google Meet / Teams link — Phase 5 */
  conferenceAdapter?: (session: MeetingSession) => Promise<string | null>;
}

let _adapters: MeetingAdapters = {};

/** Register adapters once at app startup (Phase 5+) */
export function registerAdapters(adapters: MeetingAdapters): void {
  _adapters = { ..._adapters, ...adapters };
}

// ── Workflow actions ─────────────────────────────────────────────────────────

/** Start a new session (or resume an existing one) */
export function startSession(
  conversationId?: string,
  existing?: MeetingSession | null
): MeetingSession {
  const session = existing ?? createSession(conversationId);
  const next = transition(session.state, "collecting");
  const updated = { ...session, state: next, updatedAt: Date.now() };
  persistSession(updated);
  emit(updated.id, "meeting_started", { state: next });
  return updated;
}

/** Set a single field value */
export function setField(
  session: MeetingSession,
  field: keyof MeetingFormData,
  value: string,
  confidence = 100
): MeetingSession {
  const updated = applyField(session, field, value, confidence);
  persistSession(updated);
  emit(updated.id, "field_updated", { field, value, valid: updated.fields[field].valid });
  return updated;
}

/** Confirm the current pending value (voice flow) */
export function confirmField(
  session: MeetingSession,
  field: keyof MeetingFormData
): MeetingSession {
  // Already set — just persist and emit
  persistSession(session);
  emit(session.id, "field_validated", { field, valid: session.fields[field].valid });
  return session;
}

/** Summarise the reason field from raw speech */
export function summariseReason(session: MeetingSession): MeetingSession {
  const updated = summariseReasonField(session);
  persistSession(updated);
  return updated;
}

/** Advance to validation phase and return errors */
export function validateSession(session: MeetingSession): {
  session: MeetingSession;
  errors: ReturnType<typeof validateMeetingForm>;
} {
  const data = extractData(session);
  const errors = validateMeetingForm(data);
  const nextState = errors.length === 0 ? "ready" : "collecting";
  const updated = {
    ...session,
    state: transition(session.state, nextState),
    updatedAt: Date.now(),
  };
  persistSession(updated);
  if (errors.length === 0) {
    emit(updated.id, "draft_completed", { state: "ready" });
  }
  return { session: updated, errors };
}

/**
 * Request submission. Calls /api/meeting/schedule which runs the
 * Google Calendar adapter server-side.
 * Falls back to "submitted" (draft saved) if the calendar API is not yet configured.
 */
export async function requestSubmission(
  session: MeetingSession
): Promise<{ session: MeetingSession; success: boolean; meetLink?: string; error?: string; conflictMessage?: string }> {
  if (session.state !== "ready") {
    return { session, success: false, error: "Session is not ready for submission." };
  }

  const pending = {
    ...session,
    state: transition(session.state, "pending_submission") as MeetingSession["state"],
    updatedAt: Date.now(),
  };
  persistSession(pending);
  emit(pending.id, "submission_requested");

  // Call the server-side scheduling API
  try {
    const res = await fetch("/api/meeting/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      const confirmed = {
        ...pending,
        state: transition(pending.state, "submitted") as MeetingSession["state"],
        updatedAt: Date.now(),
      };
      persistSession(confirmed);
      emit(confirmed.id, "draft_saved", { state: "submitted" });
      return { session: confirmed, success: true, meetLink: json.meeting?.meetLink };
    }

    if (res.status === 409 && json.conflictMessage) {
      // Conflict — revert to ready so user can pick a new time
      const reverted = { ...pending, state: transition(pending.state, "ready") as MeetingSession["state"], updatedAt: Date.now() };
      persistSession(reverted);
      return { session: reverted, success: false, conflictMessage: json.conflictMessage };
    }

    // Calendar not configured yet — still save locally
    console.warn("[Workflow] Calendar API unavailable:", json.error ?? res.status);
  } catch (e: any) {
    console.warn("[Workflow] Schedule fetch failed:", e.message);
  }

  // Graceful fallback: save as draft without calendar event
  const submitted = {
    ...pending,
    state: transition(pending.state, "submitted") as MeetingSession["state"],
    updatedAt: Date.now(),
  };
  persistSession(submitted);
  emit(submitted.id, "draft_saved", { state: "submitted" });
  return { session: submitted, success: true };
}

/** Cancel the current session */
export function cancelSession(session: MeetingSession): MeetingSession {
  const updated = {
    ...session,
    state: transition(session.state, "cancelled") as MeetingSession["state"],
    updatedAt: Date.now(),
  };
  clearPersistedSession();
  emit(updated.id, "meeting_cancelled");
  return updated;
}

/** Get the next voice question for the current session state */
export function getNextVoiceQuestion(session: MeetingSession): string | null {
  return getNextQuestion(session);
}
