/**
 * QuantumAI Intent Engine
 * Phase 2
 *
 * Pure client-side classification — zero API calls, zero LLM calls.
 * Analyses conversation text using regex signal matching and
 * returns a DetectedIntent with confidence score.
 *
 * The engine is stateless. State (current intent + history) is
 * maintained by the caller (useIntentEngine hook in ai-search.tsx).
 */

import type { DetectedIntent, IntentEvent, IntentEventHandler, IntentId } from "./intent-types";
import { INTENT_DEFINITIONS } from "./intent-score";
import { CAPABILITY_REGISTRY } from "@/lib/capabilities";

// ── Config ────────────────────────────────────────────────────────────────────
const CONFIDENCE_THRESHOLD = 60; // minimum to classify as non-unknown
const RECENCY_WEIGHT = 1.4;       // recent messages count more

// ── Analytics hooks (no-op until Phase 3+) ────────────────────────────────────
const _handlers: IntentEventHandler[] = [];

export function onIntentEvent(handler: IntentEventHandler) {
  _handlers.push(handler);
  return () => {
    const idx = _handlers.indexOf(handler);
    if (idx !== -1) _handlers.splice(idx, 1);
  };
}

function emit(event: IntentEvent) {
  _handlers.forEach((h) => {
    try { h(event); } catch { /* never block main flow */ }
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreText(text: string, intentId: IntentId): number {
  const def = INTENT_DEFINITIONS.find((d) => d.id === intentId);
  if (!def) return 0;
  let total = 0;
  for (const signal of def.signals) {
    if (signal.patterns.some((p) => p.test(text))) {
      total += signal.weight;
    }
  }
  return total;
}

/**
 * Normalise a raw score into 0–100 confidence.
 * Max theoretical score per intent ≈ sum of all weights.
 */
function normalise(raw: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  return Math.min(100, Math.round((raw / maxPossible) * 100));
}

function maxScore(intentId: IntentId): number {
  const def = INTENT_DEFINITIONS.find((d) => d.id === intentId);
  if (!def) return 1;
  return def.signals.reduce((s, sig) => s + sig.weight, 0);
}

// ── Main classification ───────────────────────────────────────────────────────

interface ConversationTurn {
  role: "user" | "model";
  content: string;
}

/**
 * Classify intent from the full conversation.
 * More recent user messages are weighted higher.
 */
export function classifyIntent(
  currentMessage: string,
  history: ConversationTurn[],
  previousIntent?: DetectedIntent
): DetectedIntent {
  // Build a weighted text corpus: recent user messages count more
  const userMessages = history
    .filter((t) => t.role === "user")
    .map((t) => t.content);

  // Current message gets RECENCY_WEIGHT × extra weight
  const corpus = [
    ...userMessages.map((m) => m.toLowerCase()),
    // Repeat current message to boost its influence
    ...Array(Math.round(RECENCY_WEIGHT)).fill(currentMessage.toLowerCase()),
  ].join(" ");

  const scores: Record<IntentId, number> = {} as Record<IntentId, number>;

  for (const def of INTENT_DEFINITIONS) {
    if (def.id === "unknown") continue;
    const raw = scoreText(corpus, def.id);
    scores[def.id] = normalise(raw, maxScore(def.id));
  }

  // Sort by score descending
  const ranked = (Object.entries(scores) as [IntentId, number][]).sort(
    ([, a], [, b]) => b - a
  );

  const [topId, topScore] = ranked[0] ?? ["unknown", 0];
  const [secondId, secondScore] = ranked[1] ?? ["unknown", 0];

  const primary: IntentId = topScore >= CONFIDENCE_THRESHOLD ? topId : "unknown";
  const confidence = primary === "unknown" ? 0 : topScore;

  const result: DetectedIntent = {
    primary,
    confidence,
    secondary:
      secondScore >= CONFIDENCE_THRESHOLD && secondId !== primary
        ? secondId
        : undefined,
    secondaryConfidence:
      secondScore >= CONFIDENCE_THRESHOLD && secondId !== primary
        ? secondScore
        : undefined,
    updatedAt: Date.now(),
  };

  // Emit analytics events (no-op until a handler is registered)
  if (!previousIntent || previousIntent.primary === "unknown") {
    if (result.primary !== "unknown") {
      emit({
        type: "intent_detected",
        intent: result.primary,
        confidence: result.confidence,
        timestamp: result.updatedAt,
      });
    }
  } else if (
    previousIntent.primary !== result.primary &&
    result.primary !== "unknown"
  ) {
    emit({
      type: "intent_changed",
      intent: result.primary,
      confidence: result.confidence,
      timestamp: result.updatedAt,
      metadata: { previous: previousIntent.primary },
    });
  }

  return result;
}

// ── Suggestions ───────────────────────────────────────────────────────────────

export interface IntentSuggestion {
  label: string;
  capabilityId?: string;  // links to an item in CAPABILITY_REGISTRY
}

/**
 * Returns contextual suggestions for the current intent.
 * Only suggests capabilities that exist in CAPABILITY_REGISTRY.
 */
export function getSuggestions(intent: DetectedIntent): IntentSuggestion[] {
  if (intent.primary === "unknown" || intent.confidence < CONFIDENCE_THRESHOLD) {
    return [];
  }

  const def = INTENT_DEFINITIONS.find((d) => d.id === intent.primary);
  if (!def) return [];

  // Flatten all available capability items
  const availableItems = CAPABILITY_REGISTRY.flatMap((cat) =>
    cat.items.filter((i) => i.status === "available").map((i) => ({
      label: i.label,
      id: i.id,
    }))
  );

  // Match suggested topics against available capabilities
  return def.suggestTopics
    .map((topic) => {
      const match = availableItems.find(
        (item) =>
          item.label.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(item.label.toLowerCase())
      );
      return match
        ? { label: match.label, capabilityId: match.id }
        : { label: topic };
    })
    .slice(0, 3); // cap at 3 suggestions
}

/**
 * Returns a one-line context hint for the voice AI system prompt.
 * Used in Phase 2 to subtly steer responses — zero extra API calls.
 */
export function getIntentHint(intent: DetectedIntent): string {
  if (intent.primary === "unknown" || intent.confidence < CONFIDENCE_THRESHOLD) {
    return "";
  }
  const def = INTENT_DEFINITIONS.find((d) => d.id === intent.primary);
  if (!def) return "";
  return `The visitor appears to be a ${def.label}. Naturally emphasise: ${def.suggestTopics.join(", ")}.`;
}
