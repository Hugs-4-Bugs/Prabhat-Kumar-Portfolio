/**
 * Google Calendar Event + Meet Creation — Phase 5
 * Creates an event with a Google Meet link attached.
 * All logic server-side. Meet URL returned to client, never the token.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type { MeetingFormData } from "@/lib/meeting/meeting-types";
import { zonedDateTimeToUtc } from "./timezone";

export interface CalendarMeeting {
  eventId: string;
  meetLink: string;
  htmlLink: string;
  startIso: string;
  endIso: string;
  summary: string;
}

export class CalendarMeetingCreationError extends Error {
  constructor(public readonly bookingCode: "CALENDAR_EVENT_CREATE_FAILED" | "MEET_CREATE_FAILED", message: string) {
    super(message);
    this.name = "CalendarMeetingCreationError";
  }
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

  const startDate = zonedDateTimeToUtc(
    form.preferredDate,
    form.preferredTime,
    form.timezone
  );
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

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

  const createdEventId = event.data.id;
  if (!createdEventId) {
    throw new CalendarMeetingCreationError("CALENDAR_EVENT_CREATE_FAILED", "Google Calendar did not return an event ID.");
  }

  // Read the event back from Google before reporting success. This protects
  // the booking UI from treating a partially returned insert response as a
  // confirmed calendar event.
  let eventData;
  try {
    const verifiedEvent = await calendar.events.get({
      calendarId,
      eventId: createdEventId,
    });
    eventData = verifiedEvent.data;
  } catch (verificationError) {
    try {
      await calendar.events.delete({ calendarId, eventId: createdEventId, sendUpdates: "all" });
    } catch (cleanupError) {
      console.error("[CalendarMeeting] Failed to remove an unverifiable event:", cleanupError);
    }
    throw new CalendarMeetingCreationError("CALENDAR_EVENT_CREATE_FAILED", `Google Calendar event verification failed: ${verificationError instanceof Error ? verificationError.message : "unknown error"}`);
  }
  const meetLink =
    eventData.conferenceData?.entryPoints?.find(
      (ep: { entryPointType?: string | null; uri?: string | null }) => ep.entryPointType === "video"
    )?.uri ?? "";

  if (!meetLink) {
    try {
      await calendar.events.delete({ calendarId, eventId: createdEventId, sendUpdates: "all" });
    } catch (cleanupError) {
      console.error("[CalendarMeeting] Failed to remove event without a Meet link:", cleanupError);
    }
    throw new CalendarMeetingCreationError("MEET_CREATE_FAILED", "Google Calendar created the event without a Google Meet link.");
  }

  return {
    eventId: createdEventId,
    meetLink,
    htmlLink: eventData.htmlLink ?? "",
    startIso,
    endIso,
    summary,
  };
}
