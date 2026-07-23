/**
 * QuantumAI Intent Types
 * Phase 2 — Intent Detection Layer
 *
 * Add new intents here. The engine and UI render automatically.
 * No other files need to change to support a new intent.
 */

export type IntentId =
  | "general_visitor"
  | "recruiter"
  | "hiring_manager"
  | "hr"
  | "technical_interviewer"
  | "engineering_manager"
  | "startup_founder"
  | "potential_client"
  | "investor"
  | "collaboration_request"
  | "open_source_contributor"
  | "student"
  | "general_learner"
  | "media_press"
  | "unknown";

export interface DetectedIntent {
  primary: IntentId;
  confidence: number;          // 0–100
  secondary?: IntentId;
  secondaryConfidence?: number;
  updatedAt: number;           // Date.now()
}

export interface IntentSignal {
  patterns: RegExp[];          // matches against user message (lowercased)
  weight: number;              // 1–10, how strongly this pattern implies the intent
}

export interface IntentDefinition {
  id: IntentId;
  label: string;
  signals: IntentSignal[];
  /** Topic areas to emphasise in suggestions when this intent is detected */
  suggestTopics: string[];
}

// ── Analytics event interfaces (Phase 2 only defines shapes; no dispatch yet) ──
export interface IntentEvent {
  type: "intent_detected" | "intent_changed" | "suggestion_displayed" | "suggestion_clicked";
  intent: IntentId;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Plug in a real analytics provider in a future phase */
export type IntentEventHandler = (event: IntentEvent) => void;
