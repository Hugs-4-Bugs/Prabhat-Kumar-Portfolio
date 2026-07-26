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
import { buildAuthedClient } from "./google/google-auth";
import { checkAvailability, formatAlternativesText } from "./google/availability";
import type { TimeSlot } from "./google/availability";
import { createCalendarMeeting, type CalendarMeeting } from "./google/meeting-create";
import { cancelCalendarEvent } from "./google/meeting-cancel";
import { zonedDateTimeToUtc, isValidTimezone } from "./google/timezone";

// ── Adapter interface (extendable for Outlook, Zoom, etc.) ──────────────────

export interface ScheduleResult {
  success: boolean;
  meeting?: CalendarMeeting;
  conflictMessage?: string;
  alternatives?: TimeSlot[];
  error?: string;
}

// ── Environment helpers ──────────────────────────────────────────────────────

function getConfig() {
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  const calendarId   = process.env.GOOGLE_CALENDAR_ID ?? "primary";
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
    return { success: false, error: e.message };
  }

  const auth = buildAuthedClient(config.refreshToken);

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
    console.error("[CalendarAdapter] Availability check failed:", e.message);
    return { success: false, error: "Could not check calendar availability." };
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
    console.error("[CalendarAdapter] Event creation failed:", e.message);
    return { success: false, error: "Failed to create the calendar event." };
  }
}

/** Delete a previously created event. Kept here so token handling remains
 * server-only and schedule/cancel use the exact same Calendar configuration. */
export async function cancelScheduledMeeting(eventId: string): Promise<void> {
  const { refreshToken, calendarId } = getConfig();
  await cancelCalendarEvent(buildAuthedClient(refreshToken), calendarId, eventId);
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
