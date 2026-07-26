"use client";
/**
 * Meeting Engine Hook — Phase 4
 * Single hook used by MeetingPanel, VoiceAgent, and chat.
 */

import { useCallback, useReducer, useEffect, useState } from "react";
import {
  type MeetingSession,
  extractData,
  REQUIRED_FIELDS,
} from "./meeting-session";
import {
  startSession,
  setField as wfSetField,
  confirmField as wfConfirmField,
  summariseReason as wfSummariseReason,
  validateSession,
  requestSubmission,
  cancelSession,
  getNextVoiceQuestion,
} from "./meeting-workflow";
import {
  loadPersistedSession, clearPersistedSession, loadConfirmedMeeting,
  persistConfirmedMeeting, clearConfirmedMeeting, CONFIRMED_MEETING_KEY,
} from "./meeting-storage";
import { persistSession } from "./meeting-storage";
import { emit, onMeetingEvent } from "./meeting-events";
import type { ConfirmedMeeting, MeetingFormData } from "./meeting-types";

interface EngineState {
  session: MeetingSession | null;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  meetLink: string | null;
  conflictMessage: string | null;
}

type EngineAction =
  | { type: "INIT"; session: MeetingSession }
  | { type: "UPDATE"; session: MeetingSession }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_OK"; session: MeetingSession; meetLink?: string }
  | { type: "SUBMIT_ERR"; error: string }
  | { type: "SUBMIT_CONFLICT"; session: MeetingSession; conflictMessage: string }
  | { type: "RESET" };

function reducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case "INIT":
    case "UPDATE":  return { ...state, session: action.session };
    case "SUBMIT_START": return { ...state, submitting: true, submitError: null, conflictMessage: null };
    case "SUBMIT_OK":    return { ...state, submitting: false, submitSuccess: true, session: action.session, meetLink: action.meetLink ?? null };
    case "SUBMIT_ERR":   return { ...state, submitting: false, submitError: action.error };
    case "SUBMIT_CONFLICT": return { ...state, submitting: false, session: action.session, conflictMessage: action.conflictMessage };
    case "RESET":        return { session: null, submitting: false, submitError: null, submitSuccess: false, meetLink: null, conflictMessage: null };
    default:             return state;
  }
}

const initial: EngineState = {
  session: null, submitting: false, submitError: null, submitSuccess: false, meetLink: null, conflictMessage: null,
};

export function useMeetingEngine(conversationId?: string) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [activeMeeting, setActiveMeeting] = useState<ConfirmedMeeting | null>(null);

  useEffect(() => {
    const restore = () => setActiveMeeting(loadConfirmedMeeting());
    restore();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONFIRMED_MEETING_KEY) restore();
    };
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(restore, 60_000);
    return () => { window.removeEventListener("storage", onStorage); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    return onMeetingEvent("*", () => {
      const current = loadPersistedSession();
      if (current) {
        dispatch({ type: "UPDATE", session: current });
      } else {
        dispatch({ type: "RESET" });
      }
    });
  }, []);

  const open = useCallback(() => {
    const confirmed = loadConfirmedMeeting();
    if (confirmed) {
      setActiveMeeting(confirmed);
      return;
    }
    const existing = loadPersistedSession();
    const session = startSession(conversationId, existing);
    dispatch({ type: "INIT", session });
  }, [conversationId]);

  const setField = useCallback(
    (field: keyof MeetingFormData, value: string, confidence = 100) => {
      if (!state.session) return;
      const updated = wfSetField(state.session, field, value, confidence);
      dispatch({ type: "UPDATE", session: updated });
    },
    [state.session]
  );

  // AI extraction can return several fields from one utterance. Apply them to
  // one evolving session so React batching cannot overwrite earlier values.
  const setFields = useCallback(
    (values: Partial<MeetingFormData>, confidence = 100) => {
      if (!state.session) return null;
      let updated = state.session;
      for (const [field, value] of Object.entries(values) as [keyof MeetingFormData, string][]) {
        if (typeof value === "string" && value.trim()) {
          updated = wfSetField(updated, field, value, confidence);
        }
      }
      dispatch({ type: "UPDATE", session: updated });
      return updated;
    },
    [state.session]
  );

  const selectSuggestedSlot = useCallback((index: number) => {
    const session = state.session;
    const slot = session?.suggestedSlots?.[index];
    if (!session || !slot) return null;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: session.fields.timezone.value || "Asia/Kolkata",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date(slot.start));
    const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    let updated = wfSetField(session, "preferredDate", `${value("year")}-${value("month")}-${value("day")}`);
    updated = wfSetField(updated, "preferredTime", `${value("hour")}:${value("minute")}`);
    updated = { ...updated, suggestedSlots: [] };
    persistSession(updated);
    emit(updated.id, "draft_saved", { state: updated.state });
    dispatch({ type: "UPDATE", session: updated });
    return updated;
  }, [state.session]);

  const confirmField = useCallback(
    (field: keyof MeetingFormData) => {
      if (!state.session) return;
      const updated = wfConfirmField(state.session, field);
      dispatch({ type: "UPDATE", session: updated });
    },
    [state.session]
  );

  const summariseReason = useCallback(() => {
    if (!state.session) return;
    const updated = wfSummariseReason(state.session);
    dispatch({ type: "UPDATE", session: updated });
  }, [state.session]);

  const validateCurrentStep = useCallback(() => {
    if (!state.session) return [];
    const { session: updated, errors } = validateSession(state.session);
    dispatch({ type: "UPDATE", session: updated });
    return errors;
  }, [state.session]);

  const getRemainingFields = useCallback(() => {
    return state.session?.remainingFields ?? [...REQUIRED_FIELDS];
  }, [state.session]);

  const nextQuestion = useCallback(() => {
    if (!state.session) return null;
    return getNextVoiceQuestion(state.session);
  }, [state.session]);

  const submit = useCallback(async () => {
    if (!state.session) return;

    // Validate the exact session submitted instead of relying on a preceding
    // React state update. This prevents a completed form from submitting the
    // previous `collecting` session when validation and submit happen together.
    const { session: validatedSession, errors } = validateSession(state.session);
    dispatch({ type: "UPDATE", session: validatedSession });
    if (errors.length > 0) return;

    dispatch({ type: "SUBMIT_START" });
    const result = await requestSubmission(validatedSession);
    if (result.conflictMessage) {
      dispatch({ type: "SUBMIT_CONFLICT", session: result.session, conflictMessage: result.conflictMessage });
    } else if (result.success) {
      const meeting = result.meeting;
      if (!meeting?.eventId || !meeting.startIso || !meeting.endIso) {
        dispatch({ type: "SUBMIT_ERR", error: "Calendar did not return a complete meeting confirmation." });
        return;
      }
      const form = extractData(validatedSession);
      const confirmed: ConfirmedMeeting = {
        meetingId: validatedSession.id,
        meetingStatus: "confirmed",
        meetingStart: meeting.startIso,
        meetingEnd: meeting.endIso,
        meetLink: meeting.meetLink ?? "",
        calendarEventId: meeting.eventId,
        participantName: `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim(),
        participantEmail: form.email ?? "",
        participantPhone: `${form.countryCode ?? ""} ${form.phone ?? ""}`.trim(),
        purpose: form.reasonForMeeting ?? "",
        timezone: form.timezone ?? "UTC",
        createdAt: Date.now(),
      };
      persistConfirmedMeeting(confirmed);
      clearPersistedSession();
      setActiveMeeting(confirmed);
      dispatch({ type: "SUBMIT_OK", session: result.session, meetLink: result.meetLink });
    } else {
      dispatch({ type: "SUBMIT_ERR", error: result.error ?? "Submission failed." });
    }
  }, [state.session]);

  const cancel = useCallback(() => {
    if (state.session) cancelSession(state.session);
    clearPersistedSession();
    dispatch({ type: "RESET" });
  }, [state.session]);

  const cancelConfirmedMeeting = useCallback(async (reason: string) => {
    const meeting = activeMeeting ?? loadConfirmedMeeting();
    if (!meeting || !reason.trim()) return { success: false, error: "A cancellation reason is required." };
    try {
      const response = await fetch("/api/meeting/cancel", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting, reason: reason.trim() }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) return { success: false, error: result.error ?? "Could not cancel the meeting." };
      clearConfirmedMeeting();
      setActiveMeeting(null);
      dispatch({ type: "RESET" });
      return { success: true };
    } catch {
      return { success: false, error: "Could not reach the cancellation service. Please try again." };
    }
  }, [activeMeeting]);

  return {
    session: state.session,
    data: state.session ? extractData(state.session) : {} as Partial<MeetingFormData>,
    submitting: state.submitting,
    submitError: state.submitError,
    submitSuccess: state.submitSuccess,
    meetLink: state.meetLink,
    conflictMessage: state.conflictMessage,
    activeMeeting,
    open,
    cancel,
    cancelConfirmedMeeting,
    submit,
    setField,
    setFields,
    selectSuggestedSlot,
    confirmField,
    summariseReason,
    validateCurrentStep,
    getRemainingFields,
    nextQuestion,
    completionPercent: state.session?.completionPercent ?? 0,
    completedFields:   state.session?.completedFields ?? [],
    remainingFields:   state.session?.remainingFields ?? [],
    invalidFields:     state.session?.invalidFields ?? [],
  };
}
