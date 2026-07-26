import { NextRequest, NextResponse } from "next/server";
import { cancelScheduledMeeting } from "@/lib/calendar/calendar-adapter";
import { sendMeetingCancellationEmails } from "@/lib/notifications/meeting-confirmation";
import type { ConfirmedMeeting } from "@/lib/meeting/meeting-types";

export async function POST(req: NextRequest) {
  let meeting: ConfirmedMeeting;
  let reason: unknown;
  try {
    ({ meeting, reason } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!meeting?.calendarEventId || !meeting.participantEmail || typeof reason !== "string" || !reason.trim()) {
    return NextResponse.json({ error: "A cancellation reason is required." }, { status: 422 });
  }

  try {
    await cancelScheduledMeeting(meeting.calendarEventId);
  } catch (error) {
    console.error("[MeetingCancel] Calendar deletion failed:", error);
    return NextResponse.json({ error: "Could not cancel the Calendar event. Your meeting is still active." }, { status: 502 });
  }

  try {
    await sendMeetingCancellationEmails(meeting, reason.trim());
  } catch (error) {
    // Event deletion is complete; email retries remain observable in server logs.
    console.error("[MeetingCancel] Email delivery failed:", error);
  }
  return NextResponse.json({ success: true });
}
