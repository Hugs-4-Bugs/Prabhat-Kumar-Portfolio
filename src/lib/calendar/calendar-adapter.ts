/**
 * Calendar Adapter — Phase 5
 *
 * The single integration point between the Meeting Orchestration Engine
 * and Google Calendar / Google Meet.
 *
 * Future adapters (Outlook, Teams, Zoom, Calendly) implement the same
 * CalendarAdapter interface and are swapped in without changing QuantumAI.
 */

import type { MeetingSession } from "@/lib/meeting/meeting-session";
import type { MeetingFormData } from "@/lib/meeting/meeting-types";
import { buildVerifiedAuthedClient, getCalendarRefreshToken } from "./google/google-auth";
import { checkAvailability, formatAlternativesText } from "./google/availability";
import type { TimeSlot } from "./google/availability";
import { CalendarMeetingCreationError, createCalendarMeeting, type CalendarMeeting } from "./google/meeting-create";
import { cancelCalendarEvent } from "./google/meeting-cancel";
import { zonedDateTimeToUtc, isValidTimezone } from "./google/timezone";

// ── Adapter interface (extendable for Outlook, Zoom, etc.) ──────────────────

export interface ScheduleResult {
  success: boolean;
  meeting?: CalendarMeeting;
  conflictMessage?: string;
  alternatives?: TimeSlot[];
  error?: string;
  failure?: {
    stage: "CONFIGURATION" | "AVAILABILITY" | "EVENT_CREATION";
    code: string;
  };
}

function calendarFailure(
  stage: "AVAILABILITY" | "EVENT_CREATION",
  error: unknown
): NonNullable<ScheduleResult["failure"]> {
  if (error instanceof CalendarMeetingCreationError) {
    return { stage, code: error.bookingCode };
  }
  const status = getCalendarErrorStatus(error);
  const reason = getCalendarErrorReason(error);

  if (status === 401) return { stage, code: "CALENDAR_AUTH_FAILED" };
  if (status === 403) return { stage, code: "CALENDAR_ACCESS_DENIED" };
  if (status === 404) return { stage, code: "CALENDAR_NOT_FOUND" };
  if (status === 429) return { stage, code: "CALENDAR_RATE_LIMITED" };
  if (/invalid_grant|invalid credential|token.*(?:expired|revoked)|unauthenticated/i.test(reason)) {
    return { stage, code: "CALENDAR_AUTH_FAILED" };
  }
  if (/insufficient (?:authentication )?scopes?|permission denied|forbidden/i.test(reason)) {
    return { stage, code: "CALENDAR_ACCESS_DENIED" };
  }
  return { stage, code: "CALENDAR_REQUEST_FAILED" };
}

function getCalendarErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const candidate = error as { code?: unknown; response?: { status?: unknown } };
  const status = candidate.response?.status ?? candidate.code;
  return typeof status === "number" ? status : undefined;
}

function getCalendarErrorReason(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const candidate = error as { message?: unknown; response?: { data?: { error?: { message?: unknown } | unknown } } };
    const apiMessage = candidate.response?.data?.error;
    if (typeof apiMessage === "object" && apiMessage !== null && "message" in apiMessage) {
      return String((apiMessage as { message?: unknown }).message ?? "");
    }
    if (typeof candidate.message === "string") return candidate.message;
  }
  return "";
}

function calendarFailureMessage(failure: NonNullable<ScheduleResult["failure"]>): string {
  switch (failure.code) {
    case "CALENDAR_AUTH_FAILED": return "Google Calendar authorization has expired and must be renewed. No meeting was booked.";
    case "CALENDAR_ACCESS_DENIED": return "The configured Google Calendar cannot be accessed. No meeting was booked.";
    case "CALENDAR_NOT_FOUND": return "The configured Google Calendar could not be found. No meeting was booked.";
    case "CALENDAR_RATE_LIMITED": return "Google Calendar is temporarily rate-limited. No meeting was booked.";
    case "CALENDAR_EVENT_CREATE_FAILED": return "Google Calendar did not confirm event creation. No meeting was booked.";
    case "MEET_CREATE_FAILED": return "Google Meet could not be created, so the calendar event was not kept. No meeting was booked.";
    default: return failure.stage === "AVAILABILITY"
      ? "Could not check calendar availability. No meeting was booked."
      : "Could not create the calendar event. No meeting was booked.";
  }
}

// ── Environment helpers ──────────────────────────────────────────────────────

function getConfig() {
  const refreshToken = getCalendarRefreshToken();
  const calendarId   = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  if (!refreshToken) {
    throw new Error(
      "[CalendarAdapter] GOOGLE_CALENDAR_REFRESH_TOKEN is not set. " +
      "Run the OAuth flow at /api/auth/google to authorise."
    );
  }
  return { refreshToken, calendarId };
}

// ── Main scheduling function ─────────────────────────────────────────────────

/**
 * Attempt to schedule a meeting from a completed MeetingSession.
 *  1. Validates timezone
 *  2. Checks calendar availability
 *  3. Creates Google Calendar event + Meet link if available
 *  4. Returns conflict message with alternatives if slot is taken
 */
export async function scheduleFromSession(
  session: MeetingSession
): Promise<ScheduleResult> {
  const form = extractFormData(session);
  if (!form) {
    return { success: false, error: "Incomplete meeting data." };
  }

  const timezone = form.timezone?.trim();
  const preferredDate = form.preferredDate;
  const preferredTime = form.preferredTime;
  if (!timezone || !preferredDate || !preferredTime || !isValidTimezone(timezone)) {
    return { success: false, error: `Invalid timezone: ${timezone ?? ""}` };
  }

  let config;
  try {
    config = getConfig();
  } catch (e: any) {
    console.error("[CalendarAdapter] Configuration failed:", e.message);
    return {
      success: false,
      error: "Google Calendar is not configured. No meeting was booked.",
      failure: { stage: "CONFIGURATION", code: "CALENDAR_NOT_CONFIGURED" },
    };
  }

  let auth;
  try {
    const verified = await buildVerifiedAuthedClient(config.refreshToken);
    auth = verified.auth;
    console.info("[CalendarAdapter] OAuth client verified for scheduling", {
      oauthClientSource: verified.clientSource,
      calendarIdConfigured: Boolean(process.env.GOOGLE_CALENDAR_ID),
    });
  } catch (e: any) {
    console.error("[CalendarAdapter] OAuth client setup failed:", e.message);
    return {
      success: false,
      error: "Google Calendar authorization is not configured. No meeting was booked.",
      failure: { stage: "CONFIGURATION", code: "CALENDAR_AUTH_NOT_CONFIGURED" },
    };
  }

  // Resolve the visitor's selected local time before querying free/busy. A
  // timezone-less Date string uses the server timezone and can check a
  // completely different slot from the one later inserted into Google Calendar.
  const start = zonedDateTimeToUtc(preferredDate, preferredTime, timezone);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  // Check availability
  let avail;
  try {
    avail = await checkAvailability(
      auth, config.calendarId, startIso, endIso, timezone
    );
  } catch (e: any) {
    const failure = calendarFailure("AVAILABILITY", e);
    console.error("[CalendarAdapter] Availability check failed:", {
      stage: failure.stage,
      code: failure.code,
      status: getCalendarErrorStatus(e),
      message: getCalendarErrorReason(e),
    });
    return { success: false, error: calendarFailureMessage(failure), failure };
  }

  if (!avail.available) {
    const msg = formatAlternativesText(avail.alternatives, timezone);
    return {
      success: false,
      conflictMessage: `That time is already booked. ${msg}`,
      alternatives: avail.alternatives,
    };
  }

  // Create event + Meet link
  try {
    const meeting = await createCalendarMeeting(
      auth, config.calendarId, form as MeetingFormData
    );
    return { success: true, meeting };
  } catch (e: any) {
    const failure = calendarFailure("EVENT_CREATION", e);
    console.error("[CalendarAdapter] Event creation failed:", {
      stage: failure.stage,
      code: failure.code,
      status: getCalendarErrorStatus(e),
      message: getCalendarErrorReason(e),
    });
    return { success: false, error: calendarFailureMessage(failure), failure };
  }
}

/** Delete a previously created event. Kept here so token handling remains
 * server-only and schedule/cancel use the exact same Calendar configuration. */
export async function cancelScheduledMeeting(eventId: string): Promise<void> {
  const { refreshToken, calendarId } = getConfig();
  const verified = await buildVerifiedAuthedClient(refreshToken);
  await cancelCalendarEvent(verified.auth, calendarId, eventId);
}

// ── Helper ───────────────────────────────────────────────────────────────────

function extractFormData(session: MeetingSession): Partial<MeetingFormData> | null {
  const d: Record<string, string> = {};
  for (const [k, v] of Object.entries(session.fields)) {
    if (v.value) d[k] = v.value;
  }
  const required = [
    "firstName","lastName","email","phone","countryCode",
    "reasonForMeeting","preferredDate","preferredTime","timezone",
  ];
  if (required.some((r) => !d[r])) return null;
  return d as Partial<MeetingFormData>;
}
