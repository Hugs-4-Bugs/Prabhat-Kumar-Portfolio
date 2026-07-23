/**
 * Notification Event Hooks — Phase 6
 * Internal event bus for email delivery lifecycle.
 * Phase 7 analytics / CRM adapters subscribe here.
 */

import type { EmailJob, EmailNotificationHooks } from "./email-types";

const _hooks: EmailNotificationHooks[] = [];

export function registerNotificationHooks(hooks: EmailNotificationHooks): void {
  _hooks.push(hooks);
}

export function notifyDelivered(job: EmailJob): void {
  _hooks.forEach((h) => { try { h.onDelivered?.(job); } catch { /* ignore */ } });
}

export function notifyFailed(job: EmailJob): void {
  _hooks.forEach((h) => { try { h.onFailed?.(job); } catch { /* ignore */ } });
}

export function notifyRetry(job: EmailJob): void {
  _hooks.forEach((h) => { try { h.onRetry?.(job); } catch { /* ignore */ } });
}
