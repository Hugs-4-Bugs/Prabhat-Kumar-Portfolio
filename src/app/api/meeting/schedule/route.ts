/**
 * Meeting Schedule API — Phase 5 + 6
 * POST /api/meeting/schedule
 *
 * 1. Calls calendar adapter (Phase 5) — checks availability + creates event + Meet link
 * 2. On success, sends confirmation emails (Phase 6) — visitor + owner
 * All Google credentials and email keys stay server-side.
 */

import { NextRequest, NextResponse } from "next/server";
import { scheduleFromSession } from "@/lib/calendar/calendar-adapter";
import { sendMeetingConfirmationEmails } from "@/lib/notifications/meeting-confirmation";
import { extractData, type MeetingSession } from "@/lib/meeting/meeting-session";
import { validateMeetingForm } from "@/lib/meeting/meeting-validator";

export async function POST(req: NextRequest) {
  let session: MeetingSession;

  try {
    session = (await req.json()) as MeetingSession;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!session?.id || !session?.fields) {
    return NextResponse.json({ error: "Incomplete session data." }, { status: 422 });
  }

  // Never trust the client-side meeting state. A public endpoint can be called
  // directly, so validate the raw field values again before Calendar is touched.
  const validationErrors = validateMeetingForm(extractData(session));
  if (validationErrors.length > 0) {
    return NextResponse.json({ error: "Invalid meeting details." }, { status: 422 });
  }

  // ── Step 1: Create Google Calendar event + Meet link ────────────────────
  let scheduleResult;
  try {
    scheduleResult = await scheduleFromSession(session);
  } catch (e: any) {
    console.error("[ScheduleAPI] Unexpected scheduling error:", e.message);
    return NextResponse.json(
      { error: "Scheduling failed. Please try again." },
      { status: 500 }
    );
  }

  if (!scheduleResult.success) {
    return NextResponse.json(
      {
        success: false,
        conflictMessage: scheduleResult.conflictMessage,
        alternatives: scheduleResult.alternatives,
        error: scheduleResult.error,
        failure: scheduleResult.failure,
      },
      { status: scheduleResult.conflictMessage ? 409 : 500 }
    );
  }

  const meeting = scheduleResult.meeting!;

  // ── Step 2: Send confirmation emails before completing the request ─────────
  // Serverless runtimes can stop fire-and-forget work once a response is sent.
  // Awaiting delivery makes the outcome observable and reliable.
  let emailDelivery = { visitorDelivered: false, ownerDelivered: false };
  try {
    emailDelivery = await sendMeetingConfirmationEmails(session, meeting);
  } catch (e: any) {
    console.error("[ScheduleAPI] Email delivery error:", e.message);
  }

  return NextResponse.json({
    success: true,
    meeting: {
      eventId:  meeting.eventId,
      meetLink: meeting.meetLink,
      htmlLink: meeting.htmlLink,
      startIso: meeting.startIso,
      endIso:   meeting.endIso,
      summary:  meeting.summary,
    },
    emailDelivery,
  });
}
