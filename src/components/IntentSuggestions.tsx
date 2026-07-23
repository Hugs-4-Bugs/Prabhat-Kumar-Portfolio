"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { IntentSuggestion } from "@/lib/intent/intent-engine";

interface IntentSuggestionsProps {
  suggestions: IntentSuggestion[];
  /** Called when user clicks a suggestion chip */
  onSelect: (label: string) => void;
}

/**
 * Subtle suggestion chips shown below the last AI message.
 * Appears only when intent confidence is high enough.
 * Pure UI — no API calls, no state side effects.
 */
export function IntentSuggestions({ suggestions, onSelect }: IntentSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex flex-wrap gap-2 mt-3 pl-12"
        role="group"
        aria-label="Suggested topics"
      >
        <span className="text-[10px] text-muted-foreground/60 w-full mb-0.5 select-none">
          You might also be interested in:
        </span>
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSelect(s.label)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{
              background: "rgba(120,119,198,0.12)",
              border: "1px solid rgba(120,119,198,0.25)",
              color: "rgba(200,200,255,0.85)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(120,119,198,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(120,119,198,0.12)";
            }}
            aria-label={`Ask about ${s.label}`}
          >
            <span className="opacity-50 text-[9px]">✦</span>
            {s.label}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
