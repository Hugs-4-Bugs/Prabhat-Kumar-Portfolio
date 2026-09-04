"use client";

export type AssistantIntent =
  | "GENERAL_QUERY" | "HIRING" | "CLIENT_INQUIRY" | "PROJECT_INQUIRY"
  | "COLLABORATION" | "PARTNERSHIP" | "BOOK_MEETING" | "CANCEL_MEETING"
  | "RESCHEDULE_MEETING" | "FEEDBACK" | "COMPLAINT" | "UNKNOWN";
export type MemoryImportance = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "TEMPORARY";
export type MemorySource = "USER_EXPLICIT" | "USER_CORRECTION" | "FORM_INPUT" | "MEETING_RESULT";

interface Fact {
  key: "name" | "company" | "role" | "timezone" | "email" | "phone" | "project" | "meetingDeclined";
  value: string;
  importance: MemoryImportance;
  confidence: number;
  source: MemorySource;
  updatedAt: number;
}

interface Opportunity {
  type: "HIRING" | "CLIENT_PROJECT" | "PARTNERSHIP";
  confidence: number;
  summary: string;
  recommendedAction: "NONE" | "SUGGEST_MEETING";
  updatedAt: number;
}

interface IntelligenceState {
  version: 1;
  facts: Fact[];
  intent: { value: AssistantIntent; confidence: number; updatedAt: number };
  opportunity?: Opportunity;
  summary: string;
  updatedAt: number;
}

const STORAGE_KEY = "quantumai_intelligence_v1";
const MAX_FACTS = 20;

function initialState(): IntelligenceState {
  return {
    version: 1,
    facts: [],
    intent: { value: "UNKNOWN", confidence: 0, updatedAt: Date.now() },
    summary: "",
    updatedAt: Date.now(),
  };
}

function load(): IntelligenceState {
  if (typeof window === "undefined") return initialState();
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return initialState();
    const parsed = JSON.parse(value) as Partial<IntelligenceState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.facts) || !parsed.intent) return initialState();
    return { ...initialState(), ...parsed, facts: parsed.facts.slice(0, MAX_FACTS) };
  } catch {
    return initialState();
  }
}

function save(state: IntelligenceState): IntelligenceState {
  const next = { ...state, facts: state.facts.slice(0, MAX_FACTS), updatedAt: Date.now() };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("quantumai:intelligence-updated"));
    } catch {
      // Storage can be disabled; intelligence then remains session-local.
    }
  }
  return next;
}

function upsertFact(state: IntelligenceState, fact: Omit<Fact, "updatedAt">): IntelligenceState {
  const existing = state.facts.findIndex((item) => item.key === fact.key);
  const nextFact: Fact = { ...fact, updatedAt: Date.now() };
  const facts = existing >= 0
    ? state.facts.map((item, index) => index === existing ? nextFact : item)
    : [...state.facts, nextFact];
  return { ...state, facts };
}

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function detectAssistantIntent(message: string): { value: AssistantIntent; confidence: number } {
  const text = message.toLowerCase();
  if (/\b(don't|do not|not now|no)\b.{0,20}\b(meet|meeting|schedule|book)\b|\bmeeting.*(?:nahi|nahin)\b/i.test(text)) return { value: "GENERAL_QUERY", confidence: 90 };
  if (/\b(cancel|cancelled|cancellation)\b.{0,25}\b(meeting|call)\b/i.test(text)) return { value: "CANCEL_MEETING", confidence: 95 };
  if (/\b(reschedule|move|change)\b.{0,25}\b(meeting|call|time|date)\b/i.test(text)) return { value: "RESCHEDULE_MEETING", confidence: 92 };
  if (/\b(book|schedule|arrange|set up)\b.{0,35}\b(meeting|call|interview)\b|\b(meet|meeting)\b.{0,30}\b(prabhat|him)\b|\bmeeting\s*(?:rakh|book)\b/i.test(text)) return { value: "BOOK_MEETING", confidence: 94 };
  if (/\b(hiring|hire|recruit|interview|candidate|job opening|role)\b/i.test(text)) return { value: "HIRING", confidence: 86 };
  if (/\b(partner|partnership|collaborat)\b/i.test(text)) return { value: "PARTNERSHIP", confidence: 85 };
  if (/\b(build|develop|application|platform|website|saas|automation|project|budget|pricing|quote|clinic)\b/i.test(text)) return { value: "CLIENT_INQUIRY", confidence: 75 };
  if (/\b(project|product|service)\b/i.test(text)) return { value: "PROJECT_INQUIRY", confidence: 60 };
  if (/\b(bad|wrong|frustrated|not working|complaint)\b/i.test(text)) return { value: "COMPLAINT", confidence: 75 };
  if (/\b(feedback|suggestion)\b/i.test(text)) return { value: "FEEDBACK", confidence: 70 };
  return { value: "GENERAL_QUERY", confidence: 35 };
}

function extractFacts(message: string): Array<Omit<Fact, "updatedAt">> {
  const text = normalize(message);
  const source: MemorySource = /\b(actually|correction|instead|changed|now)\b/i.test(text) ? "USER_CORRECTION" : "USER_EXPLICIT";
  const facts: Array<Omit<Fact, "updatedAt">> = [];
  const name = text.match(/\b(?:my name is|i am|i'm)\s+([a-z][a-z'\-]+(?:\s+[a-z][a-z'\-]+){1,3})\b/i)?.[1];
  const company = text.match(/\b(?:from|at|work(?:ing)? (?:at|for)|company is|my company is)\s+([a-z0-9][a-z0-9 .&'\-]{1,70})/i)?.[1];
  const role = text.match(/\b(?:i am|i'm|my role is|working as)\s+(?:a |an |the )?([a-z][a-z /\-]{2,60})(?:\.|,|$)/i)?.[1];
  const email = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0];
  const phone = text.match(/\b\d(?:[\s-]?\d){5,14}\b/)?.[0]?.replace(/\D/g, "");
  const timezone = text.match(/\b(Asia\/Kolkata|IST|Asia\/Dubai|GMT|UTC|America\/[A-Za-z_]+|Europe\/[A-Za-z_]+)\b/i)?.[1];
  if (name) facts.push({ key: "name", value: name, importance: "HIGH", confidence: 100, source });
  if (company) facts.push({ key: "company", value: company.trim(), importance: "HIGH", confidence: 95, source });
  if (role && !/name is/i.test(role)) facts.push({ key: "role", value: role.trim(), importance: "MEDIUM", confidence: 85, source });
  if (email) facts.push({ key: "email", value: email, importance: "CRITICAL", confidence: 100, source });
  if (phone) facts.push({ key: "phone", value: phone, importance: "CRITICAL", confidence: 95, source });
  if (timezone) facts.push({ key: "timezone", value: /^ist$/i.test(timezone) ? "Asia/Kolkata" : timezone, importance: "MEDIUM", confidence: 95, source });
  if (/\b(build|develop|application|platform|clinic|saas|automation)\b/i.test(text) && text.length > 30) {
    facts.push({ key: "project", value: text.slice(0, 500), importance: "HIGH", confidence: 80, source });
  }
  if (/\b(?:don't|do not|not now|no)\b.{0,20}\b(meet|meeting|schedule|book)\b/i.test(text)) {
    facts.push({ key: "meetingDeclined", value: "true", importance: "TEMPORARY", confidence: 100, source });
  }
  return facts;
}

function opportunityFor(intent: AssistantIntent, message: string): Opportunity | undefined {
  if (intent === "HIRING") return { type: "HIRING", confidence: 85, summary: "Potential hiring discussion", recommendedAction: "SUGGEST_MEETING", updatedAt: Date.now() };
  if (intent === "CLIENT_INQUIRY") return { type: "CLIENT_PROJECT", confidence: 75, summary: normalize(message).slice(0, 240), recommendedAction: "SUGGEST_MEETING", updatedAt: Date.now() };
  if (intent === "PARTNERSHIP") return { type: "PARTNERSHIP", confidence: 85, summary: "Potential partnership discussion", recommendedAction: "SUGGEST_MEETING", updatedAt: Date.now() };
  return undefined;
}

export function recordAssistantUserTurn(message: string): IntelligenceState {
  let state = load();
  const intent = detectAssistantIntent(message);
  for (const fact of extractFacts(message)) state = upsertFact(state, fact);
  if (intent.value === "BOOK_MEETING") state = upsertFact(state, { key: "meetingDeclined", value: "false", importance: "TEMPORARY", confidence: 100, source: "USER_EXPLICIT" });
  const opportunity = opportunityFor(intent.value, message);
  state = {
    ...state,
    intent: { ...intent, updatedAt: Date.now() },
    opportunity: opportunity ?? state.opportunity,
    summary: `Current intent: ${intent.value}. Latest user request: ${normalize(message).slice(0, 300)}`,
  };
  return save(state);
}

export function getAssistantContext(query: string): string {
  const state = load();
  const terms = new Set(normalize(query).toLowerCase().split(/\W+/).filter((term) => term.length > 2));
  const relevantFacts = state.facts.filter((fact) => {
    if (["name", "company", "role", "timezone", "meetingDeclined"].includes(fact.key)) return true;
    return [...terms].some((term) => fact.value.toLowerCase().includes(term));
  });
  const safeFacts = relevantFacts
    .filter((fact) => fact.key !== "email" && fact.key !== "phone")
    .map((fact) => `${fact.key}: ${fact.value} (confidence ${fact.confidence}%, ${fact.source})`);
  const opportunity = state.opportunity?.recommendedAction === "SUGGEST_MEETING" && state.facts.find((fact) => fact.key === "meetingDeclined")?.value !== "true"
    ? `Opportunity: ${state.opportunity.type} (${state.opportunity.confidence}% confidence). Suggest a meeting once when it materially helps; never book automatically.`
    : "";
  return [
    safeFacts.length ? `Remembered visitor context: ${safeFacts.join("; ")}.` : "",
    `Current detected intent: ${state.intent.value} (${state.intent.confidence}% confidence).`,
    opportunity,
  ].filter(Boolean).join("\n");
}

export function describeAssistantMemory(): string {
  const facts = load().facts.filter((fact) => fact.key !== "email" && fact.key !== "phone");
  if (!facts.length) return "I don't have any saved conversation details yet.";
  return `I remember: ${facts.map((fact) => `${fact.key} (${fact.value})`).join("; ")}.`;
}

export function forgetAssistantMemory(target?: string): string {
  const state = load();
  if (!target || /\b(all|everything|memory)\b/i.test(target)) {
    save(initialState());
    return "I've cleared the saved assistant memory on this device.";
  }
  const lower = target.toLowerCase();
  const facts = state.facts.filter((fact) => fact.key !== lower && !fact.value.toLowerCase().includes(lower));
  save({ ...state, facts });
  return "I've removed the matching saved detail from this device.";
}
