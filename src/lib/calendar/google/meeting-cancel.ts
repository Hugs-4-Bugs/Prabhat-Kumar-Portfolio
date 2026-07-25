/**
 * Cancel a Google Calendar event — Phase 5
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

export async function cancelCalendarEvent(
  auth: OAuth2Client,
  calendarId: string,
  eventId: string
): Promise<{ success: boolean }> {
  const calendar = google.calendar({ version: "v3", auth });
  await calendar.events.delete({ calendarId, eventId });
  return { success: true };
}
