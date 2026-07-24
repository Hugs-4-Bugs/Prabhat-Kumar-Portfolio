/**
 * Google Calendar Event + Meet Creation — Phase 5
 * Creates an event with a Google Meet link attached.
 * All logic server-side. Meet URL returned to client, never the token.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "googleapis/build/src/auth/oauth2client";
import type { MeetingFormData } from "@/lib/meeting/meeting-types";

export interface CalendarMeeting {
  eventId: string;
  meetLink: string;
  htmlLink: string;
  startIso: string;
  endIso: string;
  summary: string;
}

/**
 * Create a Google Calendar event with a Google Meet conferencing link.
 */
export async function createCalendarMeeting(
  auth: OAuth2Client,
  calendarId: string,
  form: MeetingFormData,
  durationMinutes = 60
): Promise<CalendarMeeting> {
  const calendar = google.calendar({ version: "v3", auth });

  const startIso = `${form.preferredDate}T${form.preferredTime}:00`;
  const endDate = new Date(`${form.preferredDate}T${form.preferredTime}:00`);
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);
  const endIso = endDate.toISOString().slice(0, 19);

  const guestName = `${form.firstName} ${form.lastName}`.trim();
  const summary   = `Meeting with ${guestName}`;
  const description = [
    `Guest: ${guestName}`,
    `Company: ${form.company ?? "—"}`,
    `Role: ${form.role ?? "—"}`,
    `Phone: ${form.countryCode ?? ""} ${form.phone}`,
    ``,
    `Reason: ${form.reasonForMeeting}`,
    form.additionalNotes ? `Notes: ${form.additionalNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    // Google sends the attendee the calendar invitation; Resend also sends the
    // portfolio's confirmation message to the visitor and owner.
    sendUpdates: "all",
    requestBody: {
      summary,
      description,
      start: { dateTime: startIso, timeZone: form.timezone },
      end:   { dateTime: endIso,   timeZone: form.timezone },
      attendees: [{ email: form.email, displayName: guestName }],
      conferenceData: {
        createRequest: {
          requestId: `qai-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 15 },
          { method: "email", minutes: 60 },
        ],
      },
    },
  });

  const eventData = event.data;
  const meetLink =
    eventData.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri ?? "";

  return {
    eventId:  eventData.id ?? "",
    meetLink,
    htmlLink: eventData.htmlLink ?? "",
    startIso,
    endIso,
    summary,
  };
}
