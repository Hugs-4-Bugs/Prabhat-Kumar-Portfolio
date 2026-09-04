import { hasMeetingIntent } from "./meeting-intent";
import type { MeetingSession } from "./meeting-session";
import { isFitQuestion } from "@/lib/quantumai-knowledge";

export type DialogueIntent = "qualification" | "scheduling" | "form_answer" | "correction" | "general" | "small_talk";

const QUALIFICATION_PATTERNS = [
  /\b(is|would|does|do)\b.*\b(qualified|qualify|fit|good fit|suitable|match)\b/i,
  /\b(skills?|experience|background|expertise|strengths?)\b.*\b(for|in|with)\b/i,
  /\b(role|position|job|opening|requirement)\b/i,
  /\b(java|backend|software developer|spring boot|microservices)\b.*\b(experience|role|fit|qualified)\b/i,
];

/**
 * Routing is deliberately deterministic. A direct qualification question always
 * wins over scheduling keywords so a recruiter never has their question skipped.
 */
export function classifyDialogueIntent(message: string, session: MeetingSession | null): DialogueIntent {
  const text = message.trim();
  if (isFitQuestion(text) || QUALIFICATION_PATTERNS.some((pattern) => pattern.test(text))) return "qualification";
  if (session?.pendingCorrection) return "correction";
  if (hasMeetingIntent(text)) return "scheduling";
  if (session?.state === "collecting" && isLikelyFormAnswer(text, session)) return "form_answer";
  if (/^(hi|hello|hey|thanks|thank you)\b/i.test(text)) return "small_talk";
  return "general";
}

/**
 * A meeting can be filled out of order in natural conversation. Keep direct
 * portfolio questions out of extraction, but allow declarative statements to
 * contribute any details they contain (for example, an email, project brief,
 * or preferred date shared before a name).
 */
export function isMeetingDataStatement(message: string): boolean {
  const text = message.trim();
  if (!text || /\?$/.test(text)) return false;
  if (/\b(who|what|when|where|why|how|can you|could you|do you|is he|is prabhat)\b/i.test(text)) return false;
  return /@|\b\d{5,}\b|\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)\b|\b(ist|india|asia\/kolkata|timezone|time zone)\b|\b(my name is|i am|i'm|my company|founder|working at|project is about|build(?:ing)? a)\b/i.test(text);
}

function isLikelyFormAnswer(text: string, session: MeetingSession): boolean {
  if (session.pendingCorrection || session.pendingVoiceName) return true;
  const current = session.currentStep;
  if (!current || current === "complete") return false;
  const value = text.trim();
  if (!value) return false;
  if (current === "firstName" || current === "lastName") return /^(?:my name is |i am |i'm )?[a-z][a-z' -]*$/i.test(value);
  if (current === "email") return /@/.test(value);
  if (current === "phone" || current === "countryCode") return /\d/.test(value);
  if (current === "preferredDate") return /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{4}-\d{2}-\d{2})\b/i.test(value);
  if (current === "preferredTime") return /\b\d{1,2}(?::\d{2})?\s*(am|pm)?\b/i.test(value);
  if (current === "timezone") return /\b(asia|america|europe|utc|ist|gmt)\b/i.test(value);
  // Purpose/company/role/notes are free text, but explicit question wording
  // remains general Q&A rather than silently becoming a form value.
  return !/\?|\b(who|what|when|where|why|how|does|is he|is prabhat)\b/i.test(value);
}

export function qualificationMeetingContext(session: MeetingSession | null): string {
  const continuation = session?.currentStep && session.currentStep !== "complete"
    ? ` A meeting form is already in progress; preserve its state and only offer to resume with the ${session.currentStep} after answering.`
    : " If the visitor also mentioned a meeting, offer to schedule it only after the answer.";
  return `PRIORITY: Answer the visitor's direct qualification or role-fit question first using Prabhat's real portfolio experience. Do not ask for scheduling fields and do not open or restart a form before answering.${continuation}`;
}

export function singleNameReply(message: string, session: MeetingSession | null): string | null {
  if (!session || session.fields.firstName.value || session.fields.lastName.value) return null;
  if (session.currentStep !== "firstName") return null;
  const candidate = message.trim().replace(/^(my name is|i am|i'm)\s+/i, "").replace(/[.!,?]+$/g, "");
  if (/^[a-z][a-z'-]*$/i.test(candidate)) {
    return `Got '${candidate}' — could you give me both first and last name?`;
  }
  return null;
}

export function isCorrectionConfirmation(message: string): boolean {
  return /\b(yes|correct|correction|replace|update|use that|that is right)\b/i.test(message);
}
