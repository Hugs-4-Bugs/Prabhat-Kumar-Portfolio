/**
 * Email Notification Types — Phase 6
 */

export type EmailStatus = "pending" | "sending" | "delivered" | "failed" | "retry_scheduled";

export type EmailType =
  | "meeting_confirmation_visitor"
  | "meeting_notification_owner"
  | "meeting_reminder"        // Phase 7
  | "meeting_cancelled"       // Phase 7
  | "meeting_rescheduled"     // Phase 7
  | "meeting_feedback";       // Phase 7

export interface EmailPayload {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
}

export interface EmailJob {
  id: string;
  type: EmailType;
  payload: EmailPayload;
  status: EmailStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  lastAttemptAt?: number;
  deliveredAt?: number;
  error?: string;
}

export interface MeetingEmailData {
  meetingId: string;
  visitorFirstName: string;
  visitorLastName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorCompany?: string;
  visitorRole?: string;
  reasonSummary: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  durationMinutes: number;
  meetLink: string;
  calendarEventId?: string;
  htmlLink?: string;
}

/** Extension points for Phase 7+ */
export interface EmailNotificationHooks {
  onDelivered?: (job: EmailJob) => void;
  onFailed?: (job: EmailJob) => void;
  onRetry?: (job: EmailJob) => void;
}
