/**
 * Meeting Confirmation Emails — Phase 6
 * Triggered only after a meeting has been successfully created in Google Calendar.
 * Sends two emails: one to the visitor, one to Prabhat (owner).
 */

import type { MeetingEmailData } from "./email-types";
import {
  buildVisitorConfirmationHtml,
  buildVisitorConfirmationText,
  buildOwnerNotificationHtml,
  buildOwnerNotificationText,
} from "./email-templates";
import { sendEmail } from "./email-service";
import { summariseMeetingReason } from "@/lib/meeting/meeting-summary";
import type { MeetingSession } from "@/lib/meeting/meeting-session";
import type { CalendarMeeting } from "@/lib/calendar/google/meeting-create";
import type { ConfirmedMeeting } from "@/lib/meeting/meeting-types";

const OWNER_EMAIL  = process.env.CONTACT_TO_EMAIL ?? "mailtoprabhat72@gmail.com";
const OWNER_NAME   = "Prabhat Kumar";
const DURATION_MIN = 60;

/**
 * Build the MeetingEmailData object from a confirmed session + calendar result.
 */
function buildEmailData(
  session: MeetingSession,
  calendar: CalendarMeeting
): MeetingEmailData {
  const f = session.fields;
  const rawReason = f.reasonForMeeting?.value ?? "";
  const reasonSummary = summariseMeetingReason(rawReason);

  return {
    meetingId:        session.id,
    visitorFirstName: f.firstName?.value ?? "",
    visitorLastName:  f.lastName?.value ?? "",
    visitorEmail:     f.email?.value ?? "",
    visitorPhone:     `${f.countryCode?.value ?? ""} ${f.phone?.value ?? ""}`.trim(),
    visitorCompany:   f.company?.value || undefined,
    visitorRole:      f.role?.value || undefined,
    reasonSummary,
    preferredDate:    f.preferredDate?.value ?? "",
    preferredTime:    f.preferredTime?.value ?? "",
    timezone:         f.timezone?.value ?? "UTC",
    durationMinutes:  DURATION_MIN,
    meetLink:         calendar.meetLink,
    calendarEventId:  calendar.eventId,
    htmlLink:         calendar.htmlLink,
  };
}

/**
 * Send confirmation emails to both the visitor and Prabhat.
 * Called after successful Google Calendar + Meet creation.
 */
export async function sendMeetingConfirmationEmails(
  session: MeetingSession,
  calendar: CalendarMeeting
): Promise<{ visitorDelivered: boolean; ownerDelivered: boolean }> {
  const data = buildEmailData(session, calendar);
  const visitorEmail = data.visitorEmail;

  if (!visitorEmail) {
    console.error("[MeetingConfirmation] No visitor email — skipping visitor email.");
    return { visitorDelivered: false, ownerDelivered: false };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "QuantumAI <noreply@prabhat.online>";

  // ── Visitor confirmation ───────────────────────────────────────────────
  const visitorJob = await sendEmail(
    {
      to:       visitorEmail,
      from:     fromEmail,
      replyTo:  OWNER_EMAIL,
      subject:  `✅ Meeting Confirmed — ${data.preferredDate} with ${OWNER_NAME}`,
      html:     buildVisitorConfirmationHtml(data),
      text:     buildVisitorConfirmationText(data),
      tags:     ["meeting_confirmation", "visitor"],
    },
    "meeting_confirmation_visitor"
  );

  // ── Owner notification ─────────────────────────────────────────────────
  const ownerJob = await sendEmail(
    {
      to:      OWNER_EMAIL,
      from:    fromEmail,
      replyTo: visitorEmail,
      subject: `📅 New Meeting: ${data.visitorFirstName} ${data.visitorLastName} — ${data.preferredDate}`,
      html:    buildOwnerNotificationHtml(data),
      text:    buildOwnerNotificationText(data),
      tags:    ["meeting_confirmation", "owner"],
    },
    "meeting_notification_owner"
  );

  return {
    visitorDelivered: visitorJob.status === "delivered",
    ownerDelivered:   ownerJob.status === "delivered",
  };
}

/** Notify both parties only after Calendar has confirmed the deletion. */
export async function sendMeetingCancellationEmails(
  meeting: ConfirmedMeeting,
  reason: string
): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "QuantumAI <noreply@prabhat.online>";
  const ownerDetails = [
    `Meeting ID: ${meeting.meetingId}`,
    `Calendar Event ID: ${meeting.calendarEventId}`,
    `When: ${meeting.meetingStart} (${meeting.timezone})`,
    `Reason: ${reason}`,
    "Cancelled by: User",
  ].join("\n");
  const visitorText = `Your meeting has been cancelled.\n\n${ownerDetails}`;
  const ownerText = `A meeting was cancelled by ${meeting.participantName} (${meeting.participantEmail}).\n\n${ownerDetails}`;
  const html = (text: string) => `<div style="font-family:Arial,sans-serif;white-space:pre-line">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</div>`;

  await Promise.all([
    sendEmail({
      to: meeting.participantEmail, from, replyTo: OWNER_EMAIL,
      subject: "Meeting Cancelled", html: html(visitorText), text: visitorText,
      tags: ["meeting_cancelled", "visitor"],
    }, "meeting_cancelled"),
    sendEmail({
      to: OWNER_EMAIL, from, replyTo: meeting.participantEmail,
      subject: `Meeting Cancelled — ${meeting.participantName}`, html: html(ownerText), text: ownerText,
      tags: ["meeting_cancelled", "owner"],
    }),
  ]);
}
