/**
 * Meeting Summary — Phase 3
 * Creates a concise professional summary from free-form speech input.
 * Uses a local heuristic in Phase 3.
 * Phase 4 can replace summarise() with an actual LLM call.
 */

/**
 * Converts raw speech transcript into a concise professional meeting
 * reason (≤ 3 sentences). No LLM call in Phase 3 — uses sentence trimming.
 */
export function summariseMeetingReason(rawSpeech: string): string {
  const cleaned = rawSpeech
    .replace(/\b(um+|uh+|er+|ah+|like|you know|basically|so)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Split into sentences and take the first 3 meaningful ones
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const summary = sentences.slice(0, 3).join(" ");

  // Capitalise first letter, ensure ends with a period
  const result = summary.charAt(0).toUpperCase() + summary.slice(1);
  return result.endsWith(".") || result.endsWith("!") || result.endsWith("?")
    ? result
    : result + ".";
}

/**
 * Returns a professional one-paragraph meeting context string for display.
 */
export function formatMeetingContext(firstName: string, reason: string): string {
  return `${firstName} has requested a meeting regarding: ${reason}`;
}
