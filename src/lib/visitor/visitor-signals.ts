/**
 * Visitor Signal Patterns — Phase 7
 * Regex-based signal detection for every visitor dimension.
 * Add new signals by appending entries — no other files need to change.
 */

import type {
  VisitorCategory, TechnicalLevel, ConversationStyle,
  DetectedLanguage, ConversationGoal,
} from "./visitor-types";

// ── Visitor category signals ──────────────────────────────────────────────

export const CATEGORY_SIGNALS: Array<{
  category: VisitorCategory;
  patterns: RegExp[];
  weight: number;
}> = [
  // Recruiter
  { category: "recruiter", weight: 9, patterns: [/\brecruit/i, /\bhiring\b/i, /\bjob\s+opening/i, /\bopen\s+role/i, /\bcandidate\b/i, /\btalent\b/i] },
  { category: "recruiter", weight: 7, patterns: [/\blinkedin\b/i, /\bresume/i, /\bcv\b/i, /\bposition\b/i] },
  // Hiring manager
  { category: "hiring_manager", weight: 10, patterns: [/\bhiring\s+manager/i, /\blead.*engineer/i, /\bteam.*lead/i, /\bmanager.*hire/i] },
  { category: "hiring_manager", weight: 7, patterns: [/\bgrow.*team/i, /\bhire.*engineer/i, /\bculture\s+fit/i, /\bcompensation/i, /\bsalary/i] },
  // HR
  { category: "hr", weight: 10, patterns: [/\bhr\b/i, /\bhuman\s+resource/i, /\bpeople\s+ops/i, /\bonboarding/i, /\bnotice\s+period/i] },
  // Founder
  { category: "founder", weight: 10, patterns: [/\bfounder/i, /\bco-?founder/i, /\bstartup/i, /\bmvp/i, /\bproduct.*vision/i] },
  { category: "founder", weight: 8, patterns: [/\bsaas/i, /\bproduct.*market/i, /\bbuil(d|ding)\s+(a|the)?\s*(product|company|startup)/i] },
  // Investor
  { category: "investor", weight: 10, patterns: [/\binvest/i, /\bvc\b/i, /\bventure\b/i, /\bfunding/i, /\bseed\b/i, /\bseries\s+[a-c]\b/i] },
  { category: "investor", weight: 8, patterns: [/\broi\b/i, /\bmarket\s+size/i, /\btam\b/i, /\bgrowth\s+rate/i] },
  // Client / consultant
  { category: "client", weight: 10, patterns: [/\bhire.*you/i, /\byour.*service/i, /\bconsult/i, /\bfreelance/i, /\bwork.*together/i] },
  { category: "client", weight: 8, patterns: [/\bcontract\s+work/i, /\brate\b/i, /\bhourly/i, /\bproject\s+budget/i] },
  // Developer
  { category: "developer", weight: 9, patterns: [/\bspring\s*boot/i, /\bmicroservice/i, /\bpull\s+request/i, /\bgithub/i, /\bopen[\s-]source/i] },
  { category: "developer", weight: 7, patterns: [/\bcode\b/i, /\bapi\b/i, /\barchitecture/i, /\bdeploy/i, /\bdocker/i, /\bkubernetes/i] },
  // Student
  { category: "student", weight: 10, patterns: [/\bstudent/i, /\buniversity/i, /\bcollege/i, /\binternship/i, /\bfresh.*grad/i] },
  { category: "student", weight: 7, patterns: [/\bassignment/i, /\blearn.*from/i, /\bmentor/i, /\bentry.*level/i] },
  // Technical interviewer
  { category: "technical_interviewer", weight: 10, patterns: [/\btechnical\s+interview/i, /\bcoding\s+challenge/i, /\btest.*skill/i] },
  { category: "technical_interviewer", weight: 8, patterns: [/\bdata\s+structure/i, /\balgorithm/i, /\bsystem\s+design\s+interview/i] },
  // Media
  { category: "media", weight: 10, patterns: [/\bpress\b/i, /\bjournalist/i, /\bpodcast/i, /\bnewsletter/i, /\barticle\b/i, /\binterview/i] },
  // Business partner
  { category: "business_partner", weight: 9, patterns: [/\bpartner/i, /\bjoint.*venture/i, /\bstrategic.*alliance/i, /\bcollaborate/i] },
];

// ── Goal signals ──────────────────────────────────────────────────────────

export const GOAL_SIGNALS: Array<{ goal: ConversationGoal; patterns: RegExp[]; weight: number }> = [
  { goal: "wanting_meeting",       weight: 10, patterns: [/\bschedul(e|ing)\b/i, /\bbook.*call/i, /\bset\s+up.*meeting/i, /\bavailable.*tomorrow/i, /\blet'?s\s+connect/i, /\blet'?s\s+talk/i] },
  { goal: "wanting_collaboration", weight: 9,  patterns: [/\bcollaborate/i, /\bteam\s*up/i, /\bwork\s+together/i, /\bjoint\s+project/i] },
  { goal: "wanting_consultation",  weight: 9,  patterns: [/\bconsult/i, /\bneed.*advice/i, /\bexpert.*opinion/i, /\bneed.*help.*with/i] },
  { goal: "looking_for_resume",    weight: 9,  patterns: [/\bresume/i, /\bcv\b/i, /\bdownload.*resume/i] },
  { goal: "checking_skills",       weight: 8,  patterns: [/\bskill/i, /\btechnolog/i, /\bstack\b/i, /\bexpert.*in/i] },
  { goal: "looking_for_java_developer", weight: 9, patterns: [/\bjava\s+developer/i, /\bjava.*engineer/i, /\bspring.*developer/i] },
  { goal: "looking_for_ai_engineer",   weight: 9, patterns: [/\bai\s+engineer/i, /\bml\s+engineer/i, /\bai.*developer/i, /\bgenai/i] },
  { goal: "technical_discussion",  weight: 7,  patterns: [/\barchitecture/i, /\bmicroservice/i, /\bscalability/i, /\bperformance/i, /\bsystem\s+design/i] },
  { goal: "exploring_portfolio",   weight: 6,  patterns: [/\bproject/i, /\bportfolio/i, /\bshow\s+me/i, /\btell.*about.*work/i] },
  { goal: "learning_about_prabhat",weight: 5,  patterns: [/\bprabhat/i, /\bwho.*are\s+you/i, /\btell.*about.*yourself/i, /\byour.*background/i] },
  { goal: "career_advice",         weight: 7,  patterns: [/\bcareer\b/i, /\bpath\b/i, /\bguidance\b/i, /\badvice\b/i, /\bgrow.*career/i] },
];

// ── Hiring / buying signals ───────────────────────────────────────────────

export const HIRING_SIGNALS: RegExp[] = [
  /\bhire\s+you/i, /\bwant.*hire/i, /\bwe'?re\s+recruit/i, /\bopening\b/i,
  /\bwe\s+need.*engineer/i, /\bjoin.*team/i, /\boffer\b/i, /\bcollaborate.*you/i,
  /\bconsultant\b/i, /\bdiscuss.*opportunit/i,
];

// ── Meeting opportunity signals ───────────────────────────────────────────

export const MEETING_SIGNALS: RegExp[] = [
  /\bschedul(e|ing)/i, /\bbook.*call/i, /\bset\s+up.*meeting/i,
  /\blet'?s\s+(talk|connect|chat|speak|meet)/i, /\bavailable.*tomorrow/i,
  /\bcan\s+we\s+meet/i, /\bdiscuss.*further/i, /\bneed.*discussion/i,
];

// ── Technical level signals ───────────────────────────────────────────────

export const TECHNICAL_SIGNALS: Array<{ level: TechnicalLevel; patterns: RegExp[]; weight: number }> = [
  { level: "architect",       weight: 10, patterns: [/\barchitect\b/i, /\bsystem\s+design\b/i, /\bdistributed\s+system/i, /\bevent[\s-]driven/i] },
  { level: "senior_engineer", weight: 8,  patterns: [/\bmicroservice/i, /\bkubernetes/i, /\bkafka/i, /\bspring\s*boot/i, /\bci\/cd/i, /\bdevops/i, /\baws\b/i] },
  { level: "intermediate",    weight: 6,  patterns: [/\bapi\b/i, /\bdocker\b/i, /\bgit\b/i, /\brest\b/i, /\bjava\b/i, /\breact\b/i] },
  { level: "beginner",        weight: 4,  patterns: [/\blearning\b/i, /\bhow\s+to\b/i, /\bwhat\s+is\b/i, /\btutorial\b/i, /\bstudent\b/i] },
  { level: "recruiter",       weight: 7,  patterns: [/\brecruit/i, /\bhiring\b/i, /\btalent\b/i, /\bcandidate\b/i] },
  { level: "non_technical",   weight: 3,  patterns: [/\binvest/i, /\bfounder\b/i, /\bmarketing\b/i, /\bbusiness\b/i, /\bceo\b/i] },
];

// ── Language detection ───────────────────────────────────────────────────

export function detectLanguage(text: string): DetectedLanguage {
  const hindiWords = /[\u0900-\u097F]/.test(text); // Devanagari unicode range
  const hinglishWords = /\b(kya|hai|hain|kaise|kyun|aap|mujhe|chahiye|batao|bolo|matlab|yaar|bhai|theek|accha|nahi|haan|mera|tera|tumhara)\b/i.test(text);
  const hasEnglish = /[a-zA-Z]{3,}/.test(text);

  if (hindiWords && hasEnglish) return "hinglish";
  if (hindiWords) return "hi";
  if (hinglishWords && hasEnglish) return "hinglish";
  if (hinglishWords) return "hi";
  return "en";
}

// ── Conversation style signals ────────────────────────────────────────────

export function detectConversationStyle(text: string): ConversationStyle {
  if (/\b(dear|kindly|sincerely|respectfully|pleased)\b/i.test(text)) return "formal";
  if (/\b(hey|hi|lol|btw|tbh|ngl|omg|gonna|wanna|ya|bro|dude)\b/i.test(text)) return "casual";
  if (/\b(roi|kpi|stakeholder|leverage|synergy|deliverable|procurement)\b/i.test(text)) return "business";
  if (/\b(algorithm|complexity|latency|throughput|scalab|microservice|deploy|kubernetes)\b/i.test(text)) return "technical";
  return "friendly";
}
