/**
 * Availability Engine — Phase 5
 * Checks Google Calendar free/busy and returns available slots.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import { zonedDateTimeToUtc } from "./timezone";

export interface TimeSlot {
  start: string; // ISO string
  end: string;
}

export interface AvailabilityResult {
  available: boolean;
  requestedSlot: TimeSlot;
  conflicts: TimeSlot[];
  alternatives: TimeSlot[];
}

/** Working hours (configurable) */
const WORK_START_HOUR = 9;  // 9 AM
const WORK_END_HOUR   = 18; // 6 PM
const DURATION_MS     = 60 * 60 * 1000; // 60 min default
const ALT_STEP_MS     = 30 * 60 * 1000; // suggest every 30 min

function localDate(instant: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day + days));
  return result.toISOString().slice(0, 10);
}

/**
 * Check if a requested time slot is available.
 * Returns conflict list and up to 3 alternative slots.
 */
export async function checkAvailability(
  auth: OAuth2Client,
  calendarId: string,
  requestedStart: string, // ISO
  requestedEnd: string,   // ISO
  timezone: string
): Promise<AvailabilityResult> {
  const calendar = google.calendar({ version: "v3", auth });

  const requestedStartDate = new Date(requestedStart);
  const day = localDate(requestedStartDate, timezone);
  // Query the calendar day in the visitor's timezone, not the server timezone.
  const dayStart = zonedDateTimeToUtc(day, "00:00", timezone);
  const dayEnd = zonedDateTimeToUtc(addDays(day, 1), "00:00", timezone);

  const fbResp = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: timezone,
      items: [{ id: calendarId }],
    },
  });

  const busy: TimeSlot[] =
    (fbResp.data.calendars?.[calendarId]?.busy ?? []).map((b) => ({
      start: b.start ?? "",
      end: b.end ?? "",
    }));

  const reqStart = new Date(requestedStart).getTime();
  const reqEnd   = new Date(requestedEnd).getTime();

  // Find conflicts
  const conflicts = busy.filter((slot) => {
    const sStart = new Date(slot.start).getTime();
    const sEnd   = new Date(slot.end).getTime();
    return reqStart < sEnd && reqEnd > sStart;
  });

  const available = conflicts.length === 0;

  // Generate alternatives in local working hours when the requested slot is busy.
  const alternatives: TimeSlot[] = [];
  if (!available) {
    for (let dayOffset = 0; dayOffset < 7 && alternatives.length < 3; dayOffset++) {
      const candidateDay = addDays(day, dayOffset);
      for (
        let minuteOfDay = WORK_START_HOUR * 60;
        minuteOfDay + 60 <= WORK_END_HOUR * 60 && alternatives.length < 3;
        minuteOfDay += ALT_STEP_MS / 60_000
      ) {
        const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, "0");
        const minutes = String(minuteOfDay % 60).padStart(2, "0");
        const start = zonedDateTimeToUtc(candidateDay, `${hours}:${minutes}`, timezone);
        const end = new Date(start.getTime() + DURATION_MS);
        if (start.getTime() <= reqStart) continue;

        const overlap = busy.some((slot) =>
          start.getTime() < new Date(slot.end).getTime() &&
          end.getTime() > new Date(slot.start).getTime()
        );

        if (!overlap) {
          alternatives.push({ start: start.toISOString(), end: end.toISOString() });
        }
      }
    }
  }

  return {
    available,
    requestedSlot: { start: requestedStart, end: requestedEnd },
    conflicts,
    alternatives,
  };
}

/** Format alternatives into a natural language string for the AI */
export function formatAlternativesText(
  alts: TimeSlot[],
  timezone: string
): string {
  if (alts.length === 0) return "No alternatives found for that day.";
  const options = alts.map((a) => {
    const d = new Date(a.start);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  });
  return `Would ${options.slice(0, -1).join(", ")} or ${options[options.length - 1]} work instead?`;
}
