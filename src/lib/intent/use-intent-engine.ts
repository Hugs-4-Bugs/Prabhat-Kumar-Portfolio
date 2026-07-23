"use client";

import { useCallback, useRef, useState } from "react";
import { classifyIntent, getSuggestions, type IntentSuggestion } from "./intent-engine";
import type { DetectedIntent } from "./intent-types";

interface ConversationTurn {
  role: "user" | "model";
  content: string;
}

interface UseIntentEngineReturn {
  intent: DetectedIntent | null;
  suggestions: IntentSuggestion[];
  /** Call after every AI response to update intent */
  updateIntent: (currentMessage: string, history: ConversationTurn[]) => void;
}

/**
 * React hook that wraps the intent engine.
 * State is local — no external store, no extra renders on unrelated updates.
 */
export function useIntentEngine(): UseIntentEngineReturn {
  const [intent, setIntent] = useState<DetectedIntent | null>(null);
  const [suggestions, setSuggestions] = useState<IntentSuggestion[]>([]);
  const prevIntentRef = useRef<DetectedIntent | undefined>(undefined);

  const updateIntent = useCallback(
    (currentMessage: string, history: ConversationTurn[]) => {
      // Classification is synchronous and cheap — safe to call inline
      const detected = classifyIntent(currentMessage, history, prevIntentRef.current);
      prevIntentRef.current = detected;
      setIntent(detected);
      setSuggestions(getSuggestions(detected));
    },
    []
  );

  return { intent, suggestions, updateIntent };
}
