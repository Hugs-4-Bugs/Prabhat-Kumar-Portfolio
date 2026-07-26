/**
 * Meeting Types — Phase 3
 * All types for the meeting scheduling module.
 * Phase 4 (Google Calendar / Google Meet / email) will extend these.
 */

export interface MeetingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  company?: string;
  role?: string;
  reasonForMeeting: string;
  preferredDate: string;        // ISO date string YYYY-MM-DD
  preferredTime: string;        // HH:MM 24h
  timezone: string;             // IANA timezone, e.g. "Asia/Kolkata"
  additionalNotes?: string;
}

export type MeetingFormField = keyof MeetingFormData;

export type MeetingStatus = "draft" | "submitted" | "confirmed" | "cancelled";

export interface MeetingDraft {
  id: string;
  data: Partial<MeetingFormData>;
  status: MeetingStatus;
  createdAt: number;
  updatedAt: number;
}

/** A locally remembered Calendar meeting. This deliberately contains no OAuth
 * credentials and exists only so the same browser cannot create overlapping
 * requests before its confirmed meeting has ended. */
export interface ConfirmedMeeting {
  meetingId: string;
  meetingStatus: "confirmed";
  meetingStart: string;
  meetingEnd: string;
  meetLink: string;
  calendarEventId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  purpose: string;
  timezone: string;
  createdAt: number;
}

export interface MeetingValidationError {
  field: MeetingFormField;
  message: string;
}

/** Voice collection state — tracks which field is being collected */
export type VoiceCollectionField =
  | MeetingFormField
  | "confirm"
  | "complete"
  | null;

export interface VoiceCollectionState {
  active: boolean;
  currentField: VoiceCollectionField;
  pendingValue: string;
  awaitingConfirmation: boolean;
}

/** Event hooks for Phase 4 analytics / integrations */
export interface MeetingEvent {
  type:
    | "panel_opened"
    | "panel_closed"
    | "field_updated"
    | "draft_saved"
    | "draft_cleared"
    | "voice_collection_started"
    | "voice_collection_completed";
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type MeetingEventHandler = (event: MeetingEvent) => void;
