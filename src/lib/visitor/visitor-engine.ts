/**
 * Visitor Intelligence Engine — Phase 7
 * Synchronous, pure function — zero API calls, zero UI side effects.
 * Called after every conversation turn.
 */

import type { VisitorProfile, VisitorCategory, TechnicalLevel, ConversationGoal } from "./visitor-types";
import {
  CATEGORY_SIGNALS, GOAL_SIGNALS, HIRING_SIGNALS,
  MEETING_SIGNALS, TECHNICAL_SIGNALS,
  detectLanguage, detectConversationStyle,
} from "./visitor-signals";

const isDev = process.env.NODE_ENV === "development";

function lerp(current: number, target: number, t = 0.35): number {
  return Math.min(100, Math.max(0, current + (target - current) * t));
}

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v));
}

interface ConversationTurn { role: "user" | "model"; content: string; }

/**
 * Analyse a single conversation turn and return an updated VisitorProfile.
 * The profile is always the caller's responsibility to store — this function
 * is pure (no side effects, no state).
 */
export function analyseConversationTurn(
  profile: VisitorProfile,
  userMessage: string,
  history: ConversationTurn[]
): VisitorProfile {
  const msg = userMessage.toLowerCase();

  // Build a weighted corpus: recent messages matter more
  const allUserText = [
    ...history.filter((t) => t.role === "user").map((t) => t.content.toLowerCase()),
    msg, msg, // repeat current to boost weight
  ].join(" ");

  const updated = { ...profile, turnCount: profile.turnCount + 1, updatedAt: Date.now() };

  // ── Language detection ───────────────────────────────────────────────
  updated.detectedLanguage = detectLanguage(userMessage);

  // ── Conversation style ───────────────────────────────────────────────
  const styleNow = detectConversationStyle(userMessage);
  if (styleNow !== "friendly") updated.conversationStyle = styleNow;

  // ── Visitor category classification ─────────────────────────────────
  const catScores: Partial<Record<VisitorCategory, number>> = {};
  for (const sig of CATEGORY_SIGNALS) {
    const hit = sig.patterns.some((p) => p.test(allUserText));
    if (hit) catScores[sig.category] = (catScores[sig.category] ?? 0) + sig.weight * 10;
  }
  const topCat = Object.entries(catScores).sort(([, a], [, b]) => b - a)[0];
  if (topCat) {
    const [cat, rawScore] = topCat;
    const conf = clamp(rawScore);
    if (conf > updated.visitorTypeConfidence) {
      updated.visitorType = cat as VisitorCategory;
      updated.visitorTypeConfidence = lerp(updated.visitorTypeConfidence, conf);
    }
  }

  // ── Goal detection ───────────────────────────────────────────────────
  const goalMap = { ...updated.goals };
  for (const sig of GOAL_SIGNALS) {
    if (sig.patterns.some((p) => p.test(allUserText))) {
      const current = goalMap[sig.goal] ?? 0;
      goalMap[sig.goal] = clamp(lerp(current, sig.weight * 10));
    }
  }
  // Decay "unknown" as real goals emerge
  const realGoals = Object.values(goalMap).filter((v, i) => Object.keys(goalMap)[i] !== "unknown");
  if (realGoals.length > 0) goalMap["unknown"] = Math.max(0, (goalMap["unknown"] ?? 100) - 20);
  updated.goals = goalMap;

  // ── Technical level ──────────────────────────────────────────────────
  let bestLevel: TechnicalLevel = updated.technicalLevel;
  let bestWeight = 0;
  for (const sig of TECHNICAL_SIGNALS) {
    if (sig.patterns.some((p) => p.test(allUserText)) && sig.weight > bestWeight) {
      bestWeight = sig.weight;
      bestLevel = sig.level;
    }
  }
  if (bestWeight > 0) updated.technicalLevel = bestLevel;

  // ── Hiring signals ───────────────────────────────────────────────────
  const hasHiringSignal = HIRING_SIGNALS.some((p) => p.test(allUserText));
  if (hasHiringSignal) {
    updated.hiringSignalDetected = true;
    updated.hiringProbability = clamp(lerp(updated.hiringProbability, 80));
  } else if (updated.visitorType === "recruiter" || updated.visitorType === "hiring_manager") {
    updated.hiringProbability = clamp(lerp(updated.hiringProbability, 50));
  }

  // ── Meeting probability ──────────────────────────────────────────────
  const hasMeetingSignal = MEETING_SIGNALS.some((p) => p.test(allUserText));
  if (hasMeetingSignal) {
    updated.meetingSignalDetected = true;
    updated.meetingProbability = clamp(lerp(updated.meetingProbability, 85));
  } else if (updated.hiringProbability > 60) {
    updated.meetingProbability = clamp(lerp(updated.meetingProbability, 40));
  }

  // ── Portfolio & technical interest ──────────────────────────────────
  if (/\bproject/i.test(allUserText) || /\bportfolio/i.test(allUserText)) {
    updated.portfolioInterest = clamp(lerp(updated.portfolioInterest, 70));
  }
  if (/\bjava|spring|aws|microservice|architecture|kubernetes|kafka/i.test(allUserText)) {
    updated.technicalInterest = clamp(lerp(updated.technicalInterest, 75));
  }

  // ── Topic tracking ────────────────────────────────────────────────────
  const topicPatterns: [RegExp, string][] = [
    [/\bspring\s*boot|java\b/i, "Java/Spring Boot"],
    [/\baws|cloud/i, "AWS/Cloud"],
    [/\bai\b|machine\s+learning|llm/i, "AI/ML"],
    [/\btrading|algo.*trad/i, "Trading/Finance"],
    [/\bcodeguard|acquisitionos|quantumfusion/i, "Products"],
    [/\barchitecture|microservice|system\s+design/i, "System Architecture"],
    [/\bportfolio|project/i, "Portfolio"],
    [/\brecruit|hir/i, "Recruitment"],
  ];
  for (const [pattern, topic] of topicPatterns) {
    if (pattern.test(allUserText) && !updated.topicsDiscussed.includes(topic)) {
      updated.topicsDiscussed = [...updated.topicsDiscussed, topic];
    }
  }

  // ── Dev-only diagnostic logging ───────────────────────────────────────
  if (isDev && updated.turnCount % 2 === 0) {
    const topGoal = Object.entries(updated.goals).sort(([, a], [, b]) => b - a)[0];
    console.group("[VisitorIntelligence]");
    console.log(`Visitor Type    : ${updated.visitorType} (${Math.round(updated.visitorTypeConfidence)}%)`);
    console.log(`Technical Level : ${updated.technicalLevel}`);
    console.log(`Hiring Prob     : ${Math.round(updated.hiringProbability)}%`);
    console.log(`Meeting Prob    : ${Math.round(updated.meetingProbability)}%`);
    console.log(`Detected Intent : ${topGoal?.[0]} (${Math.round(topGoal?.[1] ?? 0)}%)`);
    console.log(`Language        : ${updated.detectedLanguage}`);
    console.log(`Topics          : ${updated.topicsDiscussed.join(", ")}`);
    console.groupEnd();
  }

  return updated;
}

/**
 * Returns a one-line context hint to prepend to the voice/chat AI system prompt.
 * Zero extra API calls — purely derived from the profile.
 */
export function getVisitorContextHint(profile: VisitorProfile): string {
  if (profile.turnCount === 0 || profile.visitorType === "unknown") return "";

  const parts: string[] = [];
  parts.push(`The visitor appears to be a ${profile.visitorType.replace(/_/g, " ")}.`);

  if (profile.technicalLevel !== "non_technical" && profile.technicalLevel !== "beginner") {
    parts.push(`They seem ${profile.technicalLevel.replace(/_/g, " ")} level.`);
  }

  if (profile.hiringProbability > 65) {
    parts.push("They may be interested in hiring Prabhat — emphasise experience and availability.");
  }

  if (profile.topicsDiscussed.length > 0) {
    parts.push(`Topics discussed so far: ${profile.topicsDiscussed.slice(0, 3).join(", ")}.`);
  }

  return parts.join(" ");
}

/**
 * Determine whether a suggestion topic should be shown.
 * Prevents spam by checking recent suggestion history.
 */
export function shouldSuggest(profile: VisitorProfile, topic: string): boolean {
  // Don't repeat a suggestion within 3 turns
  if (profile.recentlySuggested.includes(topic)) return false;
  return true;
}

export function recordSuggestion(profile: VisitorProfile, topic: string): VisitorProfile {
  const recent = [...profile.recentlySuggested, topic].slice(-5);
  return { ...profile, recentlySuggested: recent, lastSuggestionAt: Date.now() };
}
