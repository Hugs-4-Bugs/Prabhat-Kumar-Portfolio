/**
 * Meeting State Hook — Phase 3
 * Manages form state, validation, and draft persistence.
 * Pure business logic — no UI imports.
 */
"use client";

import { useCallback, useReducer } from "react";
import type { MeetingFormData, MeetingDraft, MeetingValidationError } from "./meeting-types";
import { validateMeetingForm, getFieldError } from "./meeting-validator";
import { saveDraft, loadDraft, clearDraft } from "./meeting-draft";

type FormState = {
  data: Partial<MeetingFormData>;
  errors: MeetingValidationError[];
  draft: MeetingDraft | null;
  touched: Partial<Record<keyof MeetingFormData, boolean>>;
};

type Action =
  | { type: "SET_FIELD"; field: keyof MeetingFormData; value: string }
  | { type: "TOUCH_FIELD"; field: keyof MeetingFormData }
  | { type: "VALIDATE_ALL" }
  | { type: "SAVE_DRAFT" }
  | { type: "LOAD_DRAFT"; draft: MeetingDraft }
  | { type: "CLEAR" };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD": {
      const data = { ...state.data, [action.field]: action.value };
      return {
        ...state,
        data,
        errors: validateMeetingForm(data),
        touched: { ...state.touched, [action.field]: true },
      };
    }
    case "TOUCH_FIELD":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "VALIDATE_ALL":
      return { ...state, errors: validateMeetingForm(state.data) };
    case "SAVE_DRAFT": {
      const draft = saveDraft(state.data);
      return { ...state, draft };
    }
    case "LOAD_DRAFT":
      return { ...state, data: action.draft.data, draft: action.draft };
    case "CLEAR": {
      clearDraft();
      return { data: {}, errors: [], draft: null, touched: {} };
    }
    default:
      return state;
  }
}

const initialState: FormState = {
  data: {},
  errors: [],
  draft: null,
  touched: {},
};

export function useMeetingState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback((field: keyof MeetingFormData, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const touchField = useCallback((field: keyof MeetingFormData) => {
    dispatch({ type: "TOUCH_FIELD", field });
  }, []);

  const saveDraftNow = useCallback(() => {
    dispatch({ type: "SAVE_DRAFT" });
  }, []);

  const loadSavedDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) dispatch({ type: "LOAD_DRAFT", draft });
    return draft;
  }, []);

  const clearForm = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const validateAll = useCallback(() => {
    dispatch({ type: "VALIDATE_ALL" });
    return validateMeetingForm(state.data);
  }, [state.data]);

  const fieldError = useCallback(
    (field: keyof MeetingFormData): string | undefined => {
      if (!state.touched[field]) return undefined;
      return getFieldError(field, state.data);
    },
    [state.data, state.touched]
  );

  return {
    data: state.data,
    errors: state.errors,
    draft: state.draft,
    setField,
    touchField,
    saveDraftNow,
    loadSavedDraft,
    clearForm,
    validateAll,
    fieldError,
  };
}
