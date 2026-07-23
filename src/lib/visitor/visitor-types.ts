/**
 * Visitor Intelligence Types — Phase 7 (Visitor Analysis)
 * Session-only, no database persistence.
 */

export type VisitorCategory =
  | "general_visitor" | "recruiter" | "hiring_manager" | "hr"
  | "founder" | "investor" | "client" | "potential_customer"
  | "developer" | "student" | "open_source_contributor"
  | "technical_interviewer" | "engineering_manager"
  | "business_partner" | "media" | "unknown";

export type TechnicalLevel = "non_technical" | "beginner" | "intermediate" | "senior_engineer" | "architect" | "recruiter";
export type ConversationStyle = "formal" | "casual" | "business" | "technical" | "friendly" | "unknown";
export type DetectedLanguage = "en" | "hi" | "hinglish" | "mixed" | "other";

export type ConversationGoal =
  | "learning_about_prabhat" | "exploring_portfolio" | "looking_for_resume"
  | "checking_skills" | "looking_for_java_developer" | "looking_for_ai_engineer"
  | "looking_for_founder" | "wanting_collaboration" | "wanting_consultation"
  | "wanting_product_demo" | "wanting_meeting" | "technical_discussion"
  | "career_advice" | "open_source_discussion" | "unknown";

export interface ConfidenceScore {
  value: number;      // 0–100
  updatedAt: number;
}

export interface VisitorProfile {
  sessionId: string;
  createdAt: number;
  updatedAt: number;

  // Classification
  visitorType: VisitorCategory;
  visitorTypeConfidence: number;         // 0–100

  // Goals (multiple can be active)
  goals: Partial<Record<ConversationGoal, number>>; // goal → confidence 0–100

  // Derived scores
  hiringProbability: number;             // 0–100
  meetingProbability: number;            // 0–100
  portfolioInterest: number;             // 0–100
  technicalInterest: number;             // 0–100

  // Context
  technicalLevel: TechnicalLevel;
  conversationStyle: ConversationStyle;
  detectedLanguage: DetectedLanguage;

  // Memory
  topicsDiscussed: string[];
  questionsAnswered: string[];          // normalised question fingerprints
  turnCount: number;

  // Signals
  hiringSignalDetected: boolean;
  meetingSignalDetected: boolean;

  // Suggestion suppression — track what was recently suggested
  recentlySuggested: string[];
  lastSuggestionAt?: number;
}

export function createVisitorProfile(sessionId: string): VisitorProfile {
  return {
    sessionId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    visitorType: "unknown",
    visitorTypeConfidence: 0,
    goals: { unknown: 100 },
    hiringProbability: 0,
    meetingProbability: 0,
    portfolioInterest: 0,
    technicalInterest: 0,
    technicalLevel: "non_technical",
    conversationStyle: "unknown",
    detectedLanguage: "en",
    topicsDiscussed: [],
    questionsAnswered: [],
    turnCount: 0,
    hiringSignalDetected: false,
    meetingSignalDetected: false,
    recentlySuggested: [],
  };
}
