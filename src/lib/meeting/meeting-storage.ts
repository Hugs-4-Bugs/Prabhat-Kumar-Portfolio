/**
 * Meeting Storage — Phase 4
 * Persists sessions and drafts across refreshes and navigation.
 * Uses localStorage (same approach as existing conversation persistence).
 * Phase 5 can swap this for a server-side store without changing callers.
 */

import type { MeetingSession } from "./meeting-session";
import type { ConfirmedMeeting } from "./meeting-types";

const SESSION_KEY = "quantumai_meeting_session_v4";
export const CONFIRMED_MEETING_KEY = "quantumai_confirmed_meeting_v1";

export function persistSession(session: MeetingSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* Storage unavailable */ }
}

export function loadPersistedSession(): MeetingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MeetingSession;
    // A submitted request must never be resumed as a new draft. Doing so leaves
    // the workflow in a non-collecting state and prevents AI-assisted filling.
    if (["submitted", "completed", "confirmed", "cancelled", "rejected"].includes(parsed.state)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPersistedSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

function isConfirmedMeeting(value: unknown): value is ConfirmedMeeting {
  if (!value || typeof value !== "object") return false;
  const meeting = value as Partial<ConfirmedMeeting>;
  return meeting.meetingStatus === "confirmed" &&
    typeof meeting.meetingId === "string" &&
    typeof meeting.calendarEventId === "string" &&
    typeof meeting.meetingStart === "string" &&
    typeof meeting.meetingEnd === "string" &&
    !Number.isNaN(new Date(meeting.meetingEnd).getTime());
}

export function persistConfirmedMeeting(meeting: ConfirmedMeeting): void {
  try {
    localStorage.setItem(CONFIRMED_MEETING_KEY, JSON.stringify(meeting));
  } catch { /* Storage unavailable */ }
}

/** Returns an unexpired meeting, clearing corrupt or elapsed local state. */
export function loadConfirmedMeeting(): ConfirmedMeeting | null {
  try {
    const raw = localStorage.getItem(CONFIRMED_MEETING_KEY);
    if (!raw) return null;
    const meeting = JSON.parse(raw) as unknown;
    if (!isConfirmedMeeting(meeting) || new Date(meeting.meetingEnd).getTime() <= Date.now()) {
      localStorage.removeItem(CONFIRMED_MEETING_KEY);
      return null;
    }
    return meeting;
  } catch {
    try { localStorage.removeItem(CONFIRMED_MEETING_KEY); } catch { /* ignore */ }
    return null;
  }
}

export function clearConfirmedMeeting(): void {
  try { localStorage.removeItem(CONFIRMED_MEETING_KEY); } catch { /* ignore */ }
}
