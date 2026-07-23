/**
 * Meeting Event System — Phase 4
 * Internal pub/sub for lifecycle events.
 * Analytics adapters, Google Calendar, Gmail etc. subscribe here in Phase 5+.
 */

import type { MeetingLifecycleState } from "./meeting-status";
import type { MeetingFormData } from "./meeting-types";

export type MeetingEventType =
  | "meeting_started"
  | "field_updated"
  | "field_validated"
  | "draft_saved"
  | "draft_completed"
  | "submission_requested"
  | "meeting_cancelled"
  | "lifecycle_changed";

export interface MeetingEvent {
  type: MeetingEventType;
  sessionId: string;
  timestamp: number;
  payload?: Partial<{
    field: keyof MeetingFormData;
    value: string;
    valid: boolean;
    state: MeetingLifecycleState;
    previousState: MeetingLifecycleState;
    data: Partial<MeetingFormData>;
    error: string;
  }>;
}

export type MeetingEventListener = (event: MeetingEvent) => void;

// ── Lightweight internal event bus ───────────────────────────────────────────

const listeners = new Map<MeetingEventType | "*", Set<MeetingEventListener>>();

export function onMeetingEvent(
  type: MeetingEventType | "*",
  listener: MeetingEventListener
): () => void {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type)!.add(listener);
  return () => {
    listeners.get(type)?.delete(listener);
  };
}

export function emitMeetingEvent(event: MeetingEvent): void {
  // Notify specific listeners
  listeners.get(event.type)?.forEach((l) => { try { l(event); } catch { /**/ } });
  // Notify wildcard listeners
  listeners.get("*")?.forEach((l) => { try { l(event); } catch { /**/ } });
}

/** Helper to emit with sessionId + timestamp pre-filled */
export function emit(
  sessionId: string,
  type: MeetingEventType,
  payload?: MeetingEvent["payload"]
): void {
  emitMeetingEvent({ type, sessionId, timestamp: Date.now(), payload });
}
