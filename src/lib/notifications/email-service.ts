/**
 * Email Service — Phase 6
 * Sends emails via Resend (same API already used for contact forms).
 * All logic server-side. No credentials reach the client.
 */

import type { EmailPayload, EmailJob, EmailStatus } from "./email-types";

const MAX_ATTEMPTS = 3;
const BACKOFF_BASE_MS = 2000;

function generateJobId(): string {
  return `email_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Send a single email via Resend.
 * Returns the Resend email ID on success, throws on failure.
 */
async function sendViaResend(payload: EmailPayload): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) throw new Error("RESEND_FROM_EMAIL is not configured.");

  const body = {
    from: fromEmail,
    to:   [payload.to],
    reply_to: payload.replyTo,
    subject: payload.subject,
    html:    payload.html,
    text:    payload.text,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`Resend HTTP ${res.status}: ${JSON.stringify(json)}`);
  return json.id as string;
}

/**
 * Send an email with exponential-backoff retry.
 * Returns a completed EmailJob (delivered or failed).
 */
export async function sendEmail(
  payload: EmailPayload,
  type: EmailJob["type"] = "meeting_confirmation_visitor"
): Promise<EmailJob> {
  const job: EmailJob = {
    id: generateJobId(),
    type,
    payload,
    status: "pending",
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: Date.now(),
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    job.attempts = attempt;
    job.lastAttemptAt = Date.now();
    job.status = "sending";

    try {
      await sendViaResend(payload);
      job.status = "delivered";
      job.deliveredAt = Date.now();
      console.log(`[EmailService] ${type} delivered (attempt ${attempt}).`);
      return job;
    } catch (err: any) {
      job.error = err.message;
      console.error(`[EmailService] ${type} delivery attempt ${attempt} failed:`, err.message);

      if (attempt < MAX_ATTEMPTS) {
        job.status = "retry_scheduled";
        const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  job.status = "failed";
  console.error(`[EmailService] ${type} delivery failed after ${MAX_ATTEMPTS} attempts.`);
  return job;
}
