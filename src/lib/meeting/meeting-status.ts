/**
 * Meeting Lifecycle States — Phase 4
 * Single source of truth for every meeting's lifecycle.
 * Never use scattered booleans — always transition through these states.
 */

export type MeetingLifecycleState =
  | "draft"               // User opened the panel, nothing saved yet
  | "collecting"          // Engine is actively collecting fields (voice/chat)
  | "validating"          // All fields present, running validation
  | "ready"               // Fully validated, waiting for user to submit
  | "pending_submission"  // User clicked submit, awaiting backend
  | "submitted"           // Sent to backend/queue
  | "confirmed"           // Calendar invite accepted / meeting confirmed
  | "rejected"            // Request declined
  | "cancelled"           // User or host cancelled
  | "completed";          // Meeting has taken place

/** All valid forward and backward transitions */
const TRANSITIONS: Record<MeetingLifecycleState, MeetingLifecycleState[]> = {
  draft:              ["collecting", "cancelled"],
  collecting:         ["validating", "draft", "cancelled"],
  validating:         ["ready", "collecting"],
  ready:              ["pending_submission", "collecting", "cancelled"],
  pending_submission: ["submitted", "ready"],
  submitted:          ["confirmed", "rejected", "cancelled"],
  confirmed:          ["cancelled", "completed"],
  rejected:           ["draft"],
  cancelled:          ["draft"],
  completed:          [],
};

export function canTransition(
  from: MeetingLifecycleState,
  to: MeetingLifecycleState
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function transition(
  current: MeetingLifecycleState,
  next: MeetingLifecycleState
): MeetingLifecycleState {
  if (!canTransition(current, next)) {
    console.warn(`[MeetingEngine] Invalid transition: ${current} → ${next}`);
    return current;
  }
  return next;
}

export function isTerminal(state: MeetingLifecycleState): boolean {
  return TRANSITIONS[state].length === 0;
}

export function isSubmittable(state: MeetingLifecycleState): boolean {
  return state === "ready";
}
