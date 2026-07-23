/**
 * Availability Engine — Phase 5
 * Checks Google Calendar free/busy and returns available slots.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "googleapis/build/src/auth/oauth2client";

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

  // Query free/busy for the day around the requested slot
  const dayStart = new Date(requestedStart);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

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

  // Generate alternatives if busy
  const alternatives: TimeSlot[] = [];
  if (!available) {
    const base = new Date(requestedStart);
    base.setHours(WORK_START_HOUR, 0, 0, 0);

    while (alternatives.length < 3) {
      base.setTime(base.getTime() + ALT_STEP_MS);
      const end = new Date(base.getTime() + DURATION_MS);

      if (base.getHours() >= WORK_END_HOUR) {
        base.setDate(base.getDate() + 1);
        base.setHours(WORK_START_HOUR, 0, 0, 0);
      }

      const overlap = busy.some((slot) => {
        const sStart = new Date(slot.start).getTime();
        const sEnd   = new Date(slot.end).getTime();
        return base.getTime() < sEnd && end.getTime() > sStart;
      });

      if (!overlap && base.getHours() < WORK_END_HOUR) {
        alternatives.push({
          start: base.toISOString(),
          end:   end.toISOString(),
        });
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
