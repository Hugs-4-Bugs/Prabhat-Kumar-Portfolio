/**
 * Meeting Draft — Phase 3
 * Persists draft to localStorage. Phase 4 will send it to the backend.
 */

import type { MeetingDraft, MeetingFormData } from "./meeting-types";

const STORAGE_KEY = "quantumai_meeting_draft";

function generateId(): string {
  return `mtg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveDraft(data: Partial<MeetingFormData>): MeetingDraft {
  const existing = loadDraft();
  const draft: MeetingDraft = {
    id: existing?.id ?? generateId(),
    data,
    status: "draft",
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable — fail silently
  }
  return draft;
}

export function loadDraft(): MeetingDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MeetingDraft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}
