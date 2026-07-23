/**
 * Meeting Intent Detection — Phase 3
 * Detects when a user wants to schedule a meeting from natural language.
 */

const MEETING_PATTERNS: RegExp[] = [
  /\bschedul(e|ing)\b.*\b(meeting|call|session|chat|talk)\b/i,
  /\b(book|set\s+up|arrange|organise|organize)\b.*\b(meeting|call|time|slot|appointment)\b/i,
  /\b(want|like|love|would)\b.{0,30}\b(meet|connect|talk|speak|chat|discuss)\b/i,
  /\bcan\s+(i|we)\b.{0,20}\b(meet|schedule|book|talk|speak)\b/i,
  /\b(discuss|explore)\b.{0,30}\b(opportunit|proposal|project|collaborat|business|partner)/i,
  /\b(get\s+in\s+touch|reach\s+out|connect)\b/i,
  /\b(available|availability)\b.{0,20}\b(call|meeting|chat)\b/i,
  /\bi.*want.*meeting/i,
  /\bbook\s+a\s+(call|meeting|session)\b/i,
  /\bschedule.*prabhat/i,
  /\bmeet.*prabhat/i,
];

/**
 * Returns true if the message contains scheduling intent.
 */
export function hasMeetingIntent(message: string): boolean {
  return MEETING_PATTERNS.some((p) => p.test(message));
}

/**
 * Returns a natural AI reply acknowledging the intent.
 * The actual panel opening is handled by the UI layer.
 */
export function getMeetingIntentReply(name = "Prabhat"): string {
  const replies = [
    `I'd be happy to help you schedule a meeting with ${name}! I've opened the scheduling form for you. Please fill in your details and preferred time — ${name} will receive your request and confirm shortly.`,
    `Sure! Let me open the meeting scheduler for you. Fill in your details and ${name} will get back to you to confirm the time.`,
    `Great idea! I've brought up the meeting request form. Just fill in your details and ${name} will confirm a time that works.`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
