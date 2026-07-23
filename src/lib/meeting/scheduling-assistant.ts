/**
 * Scheduling Assistant — Phase 7
 * Coordinates between Visitor Intelligence, Meeting Engine, and Calendar.
 * Pure logic — no UI imports.
 *
 * Responsibilities:
 *  1. Decide whether to suggest scheduling based on visitor profile
 *  2. Extract any field values already known from conversation
 *  3. Generate natural language prompts for missing fields
 *  4. Build a confirmation summary before committing
 *  5. Detect idiomatic date/time mentions ("tomorrow 3pm", "next Friday")
 */

import type { VisitorProfile } from "@/lib/visitor/visitor-types";
import type { MeetingFormData } from "./meeting-types";
import { summariseMeetingReason } from "./meeting-summary";

// ── Thresholds ────────────────────────────────────────────────────────────────
const MEETING_SUGGEST_THRESHOLD = 60;   // meetingProbability > this → suggest
const HIRING_SUGGEST_THRESHOLD  = 55;   // hiringProbability > this  → suggest

/** Returns true when the visitor profile warrants a scheduling suggestion */
export function shouldOfferScheduling(profile: VisitorProfile): boolean {
  if (profile.meetingSignalDetected) return true;
  if (profile.meetingProbability > MEETING_SUGGEST_THRESHOLD) return true;
  if (profile.hiringProbability > HIRING_SUGGEST_THRESHOLD) return true;
  return false;
}

/** Generate a natural, non-robotic offer to schedule */
export function buildSchedulingOffer(profile: VisitorProfile): string {
  const type = profile.visitorType;
  if (type === "recruiter" || type === "hiring_manager") {
    return "It sounds like you may want to connect with Prabhat directly. Would you like to schedule a meeting? I can help you set that up right now.";
  }
  if (type === "founder" || type === "investor") {
    return "Would you like to schedule a call with Prabhat to discuss this further? I can open the meeting scheduler for you.";
  }
  if (type === "client" || type === "potential_customer") {
    return "I'd be happy to help you schedule a consultation with Prabhat. Shall I open the scheduling form?";
  }
  return "Would you like to schedule a meeting with Prabhat? I can help set that up.";
}

/** Natural-language meeting confirmation summary */
export function buildConfirmationSummary(data: Partial<MeetingFormData>): string {
  const name = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
  const purpose = data.reasonForMeeting
    ? summariseMeetingReason(data.reasonForMeeting)
    : "Not specified";

  const lines = [
    `Here's a summary of your meeting request:`,
    ``,
    `👤 Name      : ${name || "—"}`,
    `📧 Email     : ${data.email || "—"}`,
    `📅 Date      : ${data.preferredDate || "—"}`,
    `🕐 Time      : ${data.preferredTime || "—"}`,
    `🌍 Timezone  : ${data.timezone || "—"}`,
    `⏱ Duration  : 60 minutes`,
    `💬 Purpose   : ${purpose}`,
    ``,
    `Everything look good? Say **confirm** to schedule, or tell me what to change.`,
  ];
  return lines.join("\n");
}

/**
 * Attempt to extract field values from a free-form message.
 * Returns partial MeetingFormData with any values found.
 * Used to pre-fill fields so the user doesn't re-enter information.
 */
export function extractFieldsFromMessage(
  message: string,
  existing: Partial<MeetingFormData>
): Partial<MeetingFormData> {
  const updates: Partial<MeetingFormData> = {};

  // Email
  if (!existing.email) {
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) updates.email = emailMatch[0];
  }

  // Phone (10–15 digit sequence, optionally with spaces/dashes)
  if (!existing.phone) {
    const phoneMatch = message.match(/\b(\+?[\d][\d\s\-]{8,14})\b/);
    if (phoneMatch) updates.phone = phoneMatch[1].replace(/\D/g, "");
  }

  // Date: YYYY-MM-DD
  if (!existing.preferredDate) {
    const isoDate = message.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (isoDate) updates.preferredDate = isoDate[1];
    else {
      // Natural date: "tomorrow", "next Friday", "15th June", "June 15"
      const tomorrow = /\btomorrow\b/i.test(message);
      if (tomorrow) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        updates.preferredDate = d.toISOString().split("T")[0];
      }
    }
  }

  // Time: HH:MM or "3 PM", "15:00"
  if (!existing.preferredTime) {
    const time24 = message.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
    if (time24) {
      updates.preferredTime = `${time24[1].padStart(2, "0")}:${time24[2]}`;
    } else {
      const time12 = message.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
      if (time12) {
        let hour = parseInt(time12[1], 10);
        const min = time12[2] ? parseInt(time12[2], 10) : 0;
        const meridiem = time12[3].toLowerCase();
        if (meridiem === "pm" && hour !== 12) hour += 12;
        if (meridiem === "am" && hour === 12) hour = 0;
        updates.preferredTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      }
    }
  }

  return updates;
}

/**
 * Given a partial form and conversation context, return the next field
 * to ask about and a natural prompt for it.
 */
export function getNextFieldPrompt(
  data: Partial<MeetingFormData>
): { field: keyof MeetingFormData; prompt: string } | null {
  if (!data.firstName || !data.lastName) {
    return { field: "firstName", prompt: "What's your name?" };
  }
  if (!data.email) {
    return { field: "email", prompt: `Thanks, ${data.firstName}! What's the best email address to send the meeting confirmation to?` };
  }
  if (!data.reasonForMeeting) {
    return { field: "reasonForMeeting", prompt: "What would you like to discuss with Prabhat?" };
  }
  if (!data.preferredDate) {
    return { field: "preferredDate", prompt: "Do you have a preferred date in mind? (e.g. 'tomorrow', '2025-09-01')" };
  }
  if (!data.preferredTime) {
    return { field: "preferredTime", prompt: "What time works best for you?" };
  }
  if (!data.timezone) {
    return { field: "timezone", prompt: "What timezone are you in? (e.g. Asia/Kolkata, America/New_York)" };
  }
  if (!data.phone) {
    return { field: "phone", prompt: "Last thing — what's your phone number in case Prabhat needs to reach you?" };
  }
  if (!data.countryCode) {
    return { field: "countryCode", prompt: "And the country code? (e.g. +91, +1)" };
  }
  return null; // All required fields collected
}

/** Returns a polite conflict message with alternatives */
export function buildConflictResponse(conflictMessage: string): string {
  return `I checked Prabhat's calendar and it looks like that slot isn't available. ${conflictMessage} Which of these works better for you?`;
}
