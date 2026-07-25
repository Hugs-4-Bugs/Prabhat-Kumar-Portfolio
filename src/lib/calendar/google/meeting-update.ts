/**
 * Update a Google Calendar event — Phase 5
 * Used when rescheduling is implemented in a future phase.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

export async function updateCalendarEvent(
  auth: OAuth2Client,
  calendarId: string,
  eventId: string,
  patch: {
    startIso?: string;
    endIso?: string;
    timezone?: string;
    summary?: string;
  }
): Promise<{ success: boolean; htmlLink?: string }> {
  const calendar = google.calendar({ version: "v3", auth });

  const body: Record<string, unknown> = {};
  if (patch.summary) body["summary"] = patch.summary;
  if (patch.startIso) body["start"] = { dateTime: patch.startIso, timeZone: patch.timezone };
  if (patch.endIso)   body["end"]   = { dateTime: patch.endIso,   timeZone: patch.timezone };

  const res = await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: body,
  });

  return { success: res.status === 200, htmlLink: res.data.htmlLink ?? undefined };
}
