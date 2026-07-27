/**
 * Meeting Session — Phase 4
 * Represents one isolated user scheduling session.
 * Each session has its own ID, lifecycle state, field values, and progress.
 */

import type { MeetingFormData } from "./meeting-types";
import type { MeetingLifecycleState } from "./meeting-status";
import { validateMeetingForm, getFieldError } from "./meeting-validator";
import { summariseMeetingReason } from "./meeting-summary";

/** Required fields — must all pass validation before session is "ready" */
export const REQUIRED_FIELDS: (keyof MeetingFormData)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "countryCode",
  "reasonForMeeting",
  "preferredDate",
  "preferredTime",
  "timezone",
];

/** Optional fields tracked but not blocking submission */
export const OPTIONAL_FIELDS: (keyof MeetingFormData)[] = [
  "company",
  "role",
  "additionalNotes",
];

export const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

export interface FieldStatus {
  value: string;
  completed: boolean;
  valid: boolean;
  error?: string;
  confidence: number; // 0–100, useful for voice-collected values
}

export interface MeetingSession {
  id: string;
  conversationId?: string;
  state: MeetingLifecycleState;
  fields: Record<keyof MeetingFormData, FieldStatus>;
  currentStep: keyof MeetingFormData | "complete" | null;
  completionPercent: number;
  completedFields: (keyof MeetingFormData)[];
  remainingFields: (keyof MeetingFormData)[];
  invalidFields: (keyof MeetingFormData)[];
  suggestedSlots?: { start: string; end: string }[];
  /** Candidate values awaiting the visitor's explicit correction confirmation. */
  pendingCorrection?: Partial<MeetingFormData>;
  createdAt: number;
  updatedAt: number;
}

function emptyField(): FieldStatus {
  return { value: "", completed: false, valid: false, confidence: 0 };
}

export function createSession(conversationId?: string): MeetingSession {
  const fields = Object.fromEntries(
    ALL_FIELDS.map((f) => [f, emptyField()])
  ) as Record<keyof MeetingFormData, FieldStatus>;

  return {
    id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    conversationId,
    state: "draft",
    fields,
    currentStep: REQUIRED_FIELDS[0],
    completionPercent: 0,
    completedFields: [],
    remainingFields: [...REQUIRED_FIELDS],
    invalidFields: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** Set a field value and recompute session progress */
export function applyField(
  session: MeetingSession,
  field: keyof MeetingFormData,
  value: string,
  confidence = 100
): MeetingSession {
  const data = extractData(session);
  data[field] = value;

  const error = getFieldError(field, data);
  const updatedField: FieldStatus = {
    value,
    completed: value.trim().length > 0,
    valid: !error,
    error,
    confidence,
  };

  const fields = { ...session.fields, [field]: updatedField };
  return recompute({ ...session, fields, updatedAt: Date.now() });
}

/** Extract raw form data from session fields */
export function extractData(
  session: MeetingSession
): Partial<MeetingFormData> {
  const result: Partial<MeetingFormData> = {};
  for (const key of ALL_FIELDS) {
    const val = session.fields[key]?.value;
    if (val !== undefined && val !== "") {
      (result as any)[key] = val;
    }
  }
  return result;
}

/** Recompute derived fields (progress, remaining, invalid) */
function recompute(session: MeetingSession): MeetingSession {
  const data = extractData(session);
  const errors = validateMeetingForm(data);
  const invalidFields = errors.map((e) => e.field);

  // A value is not a completed conversational slot until it is valid. This
  // prevents an invalid email/phone or incomplete name from advancing to the
  // submission recap merely because text was entered.
  const completedFields = REQUIRED_FIELDS.filter((f) => session.fields[f].valid);
  const remainingFields = REQUIRED_FIELDS.filter((f) => !session.fields[f].valid);

  const completionPercent = Math.round(
    (completedFields.length / REQUIRED_FIELDS.length) * 100
  );

  // Advance currentStep to next incomplete required field
  const currentStep =
    remainingFields[0] ?? (errors.length === 0 ? "complete" : remainingFields[0] ?? null);

  return {
    ...session,
    completedFields,
    remainingFields,
    invalidFields,
    completionPercent,
    currentStep,
  };
}

/** Returns human-readable label for a field */
export const FIELD_LABELS: Record<keyof MeetingFormData, string> = {
  firstName: "first name",
  lastName: "last name",
  email: "email address",
  phone: "phone number",
  countryCode: "country code",
  company: "company name",
  role: "your role",
  reasonForMeeting: "reason for the meeting",
  preferredDate: "preferred date",
  preferredTime: "preferred time",
  timezone: "timezone",
  additionalNotes: "additional notes",
};

/** Voice assistant: generate the next question to ask */
export function getNextQuestion(session: MeetingSession): string | null {
  const field = session.remainingFields[0];
  if (!field) return null;
  const label = FIELD_LABELS[field];
  const starters = [
    `Could you share your ${label}?`,
    `What is your ${label}?`,
    `May I have your ${label}?`,
  ];
  return starters[Math.floor(Math.random() * starters.length)];
}

/** Summarise the reason field using the speech summariser */
export function summariseReasonField(session: MeetingSession): MeetingSession {
  const raw = session.fields.reasonForMeeting?.value ?? "";
  if (!raw.trim()) return session;
  const summarised = summariseMeetingReason(raw);
  return applyField(session, "reasonForMeeting", summarised);
}
