"use client";
/**
 * Visitor Intelligence Hook — Phase 7
 * Wraps visitor-engine.ts in React state.
 * Zero API calls, zero UI side effects, session-only.
 */

import { useCallback, useRef, useState } from "react";
import { type VisitorProfile, createVisitorProfile } from "./visitor-types";
import { analyseConversationTurn, getVisitorContextHint } from "./visitor-engine";

interface ConversationTurn { role: "user" | "model"; content: string; }

export function useVisitorIntelligence() {
  const sessionId = useRef(`vsess_${Date.now()}`);
  const [profile, setProfile] = useState<VisitorProfile>(() =>
    createVisitorProfile(sessionId.current)
  );

  /** Call after every AI response — runs async so it never blocks rendering */
  const analyse = useCallback(
    (userMessage: string, history: ConversationTurn[]) => {
      // Run off the React rendering cycle — never blocks typing
      setTimeout(() => {
        setProfile((prev) => analyseConversationTurn(prev, userMessage, history));
      }, 0);
    },
    []
  );

  /** Returns a hint string for the AI system prompt */
  const getContextHint = useCallback(
    () => getVisitorContextHint(profile),
    [profile]
  );

  /** Reset when conversation is cleared */
  const reset = useCallback(() => {
    sessionId.current = `vsess_${Date.now()}`;
    setProfile(createVisitorProfile(sessionId.current));
  }, []);

  return { profile, analyse, getContextHint, reset };
}
