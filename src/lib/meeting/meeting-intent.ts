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
    `I'd be happy to help you schedule a meeting with ${name}. I’ve opened the form and can fill it in as we talk. To begin, what are your first and last names?`,
    `Sure—the meeting form is open, and I can fill it in for you. Please share your first and last names to get started.`,
    `Great—I’ve opened the meeting form. I’ll collect the details one at a time, starting with your first and last names.`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
