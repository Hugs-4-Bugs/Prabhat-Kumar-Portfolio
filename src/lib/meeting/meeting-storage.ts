/**
 * Meeting Storage — Phase 4
 * Persists sessions and drafts across refreshes and navigation.
 * Uses localStorage (same approach as existing conversation persistence).
 * Phase 5 can swap this for a server-side store without changing callers.
 */

import type { MeetingSession } from "./meeting-session";

const SESSION_KEY = "quantumai_meeting_session_v4";

export function persistSession(session: MeetingSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* Storage unavailable */ }
}

export function loadPersistedSession(): MeetingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MeetingSession;
    // Don't restore terminal or completed sessions
    if (parsed.state === "completed" || parsed.state === "confirmed") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPersistedSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}
