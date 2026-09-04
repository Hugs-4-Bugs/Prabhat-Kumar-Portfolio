/**
 * Meeting Validator — Phase 3
 * Pure validation logic, no UI dependencies.
 */

import type { MeetingFormData, MeetingValidationError } from "./meeting-types";
import { isValidTimezone, zonedDateTimeToUtc } from "@/lib/calendar/google/timezone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{6,15}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function isRealIsoDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

export function validateMeetingForm(
  data: Partial<MeetingFormData>
): MeetingValidationError[] {
  const errors: MeetingValidationError[] = [];

  // First Name
  if (!data.firstName?.trim()) {
    errors.push({ field: "firstName", message: "First name is required." });
  }

  // Last Name
  if (!data.lastName?.trim()) {
    errors.push({ field: "lastName", message: "Last name is required." });
  }

  // Email
  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  // Phone
  if (!data.phone?.trim()) {
    errors.push({ field: "phone", message: "Phone number is required." });
  } else if (!PHONE_RE.test(data.phone.replace(/\s/g, ""))) {
    errors.push({ field: "phone", message: "Phone must be 6–15 digits." });
  }

  // Country Code
  if (!data.countryCode?.trim()) {
    errors.push({ field: "countryCode", message: "Country code is required." });
  }

  // Reason for Meeting
  if (!data.reasonForMeeting?.trim()) {
    errors.push({ field: "reasonForMeeting", message: "Please describe the reason for the meeting." });
  } else if (data.reasonForMeeting.trim().length < 10) {
    errors.push({ field: "reasonForMeeting", message: "Please provide at least 10 characters." });
  }

  // Preferred Date and Time. A meeting is valid only when the wall-clock
  // date/time in the visitor's selected IANA timezone resolves to the future.
  if (!data.preferredDate?.trim()) {
    errors.push({ field: "preferredDate", message: "Preferred date is required." });
  } else if (!isRealIsoDate(data.preferredDate.trim())) {
    errors.push({ field: "preferredDate", message: "Use a valid date." });
  }

  if (!data.preferredTime?.trim()) {
    errors.push({ field: "preferredTime", message: "Preferred time is required." });
  } else if (!TIME_RE.test(data.preferredTime.trim())) {
    errors.push({ field: "preferredTime", message: "Use a valid time." });
  }

  if (!data.timezone?.trim()) {
    errors.push({ field: "timezone", message: "Timezone is required." });
  } else if (!isValidTimezone(data.timezone.trim())) {
    errors.push({ field: "timezone", message: "Choose a valid timezone." });
  }

  const date = data.preferredDate?.trim();
  const time = data.preferredTime?.trim();
  const timezone = data.timezone?.trim();
  if (date && time && timezone && isRealIsoDate(date) && TIME_RE.test(time) && isValidTimezone(timezone)) {
    try {
      if (zonedDateTimeToUtc(date, time, timezone).getTime() <= Date.now()) {
        errors.push({ field: "preferredDate", message: "Choose a future date and time in the selected timezone." });
      }
    } catch {
      errors.push({ field: "preferredDate", message: "Unable to resolve the selected date and time." });
    }
  }

  return errors;
}

/** Returns an error message for a single field, or undefined if valid */
export function getFieldError(
  field: keyof MeetingFormData,
  data: Partial<MeetingFormData>
): string | undefined {
  return validateMeetingForm(data).find((e) => e.field === field)?.message;
}

/** True only when all required fields are valid */
export function isMeetingFormValid(data: Partial<MeetingFormData>): boolean {
  return validateMeetingForm(data).length === 0;
}
