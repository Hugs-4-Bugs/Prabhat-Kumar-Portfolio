/**
 * Email Queue — Phase 6
 * In-memory job tracking for the current request lifecycle.
 * Phase 7: replace with a persistent queue (Redis, Upstash, etc.).
 */

import type { EmailJob } from "./email-types";

// Simple in-memory log — useful for server-side debugging
const _jobs: EmailJob[] = [];
const MAX_LOG = 200;

export function logJob(job: EmailJob): void {
  _jobs.unshift(job);
  if (_jobs.length > MAX_LOG) _jobs.pop();
}

export function getRecentJobs(limit = 20): EmailJob[] {
  return _jobs.slice(0, limit);
}

export function getJobById(id: string): EmailJob | undefined {
  return _jobs.find((j) => j.id === id);
}
