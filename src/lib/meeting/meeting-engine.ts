"use client";
/**
 * Meeting Engine Hook — Phase 4
 * Single hook used by MeetingPanel, VoiceAgent, and chat.
 */

import { useCallback, useReducer, useEffect } from "react";
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
import { loadPersistedSession, clearPersistedSession } from "./meeting-storage";
import { onMeetingEvent } from "./meeting-events";
import type { MeetingFormData } from "./meeting-types";

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
    dispatch({ type: "SUBMIT_START" });
    const result = await requestSubmission(state.session);
    if (result.conflictMessage) {
      dispatch({ type: "SUBMIT_CONFLICT", session: result.session, conflictMessage: result.conflictMessage });
    } else if (result.success) {
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

  return {
    session: state.session,
    data: state.session ? extractData(state.session) : {} as Partial<MeetingFormData>,
    submitting: state.submitting,
    submitError: state.submitError,
    submitSuccess: state.submitSuccess,
    meetLink: state.meetLink,
    conflictMessage: state.conflictMessage,
    open,
    cancel,
    submit,
    setField,
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
