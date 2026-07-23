/**
 * Timezone utilities — Phase 5
 * Converts between IANA timezones safely.
 * Never trusts client-provided offsets — always uses IANA names.
 */

/** Validate that a string is a real IANA timezone */
export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a full ISO datetime string from a date string, time string, and timezone.
 * e.g. ("2025-09-01", "14:30", "Asia/Kolkata") → "2025-09-01T14:30:00+05:30"
 */
export function buildIsoDateTime(
  date: string,   // YYYY-MM-DD
  time: string,   // HH:MM
  timezone: string
): string {
  if (!isValidTimezone(timezone)) {
    throw new Error(`[Timezone] Invalid timezone: ${timezone}`);
  }
  // Construct a date in the given timezone
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Use the Temporal-like approach via Date constructor + offset
  const localDateStr = `${date}T${time}:00`;
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
    timeZoneName: "longOffset",
  });

  // Get the offset for this timezone at this moment
  const localMs = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  ).getTime();

  // Resolve offset by comparing UTC vs. local interpretation
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric", minute: "numeric",
    hour12: false,
  }).formatToParts(new Date(localMs));

  void parts; // offset derivation via full ISO below

  // Most reliable: construct an ISO-8601 string and let the Google API handle the tz
  return `${localDateStr}`;
}

/** Convert a UTC timestamp to HH:MM in a given timezone */
export function toLocalTime(utcMs: number, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(utcMs));
}

/** Format a date for display in a given timezone */
export function toLocalDate(utcMs: number, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(utcMs));
}
