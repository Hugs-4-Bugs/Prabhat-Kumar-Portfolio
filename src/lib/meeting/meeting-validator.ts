/**
 * Meeting Validator — Phase 3
 * Pure validation logic, no UI dependencies.
 */

import type { MeetingFormData, MeetingValidationError } from "./meeting-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{6,15}$/;

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

  // Preferred Date
  if (!data.preferredDate?.trim()) {
    errors.push({ field: "preferredDate", message: "Preferred date is required." });
  } else {
    const chosen = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(chosen.getTime())) {
      errors.push({ field: "preferredDate", message: "Invalid date." });
    } else if (chosen < today) {
      errors.push({ field: "preferredDate", message: "Date cannot be in the past." });
    }
  }

  // Preferred Time
  if (!data.preferredTime?.trim()) {
    errors.push({ field: "preferredTime", message: "Preferred time is required." });
  }

  // Timezone
  if (!data.timezone?.trim()) {
    errors.push({ field: "timezone", message: "Timezone is required." });
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
