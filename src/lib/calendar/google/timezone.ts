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
 * Resolve a wall-clock date/time in an IANA timezone to its UTC instant.
 *
 * A bare string such as `2026-07-30T10:00:00` is interpreted in the server's
 * timezone by Date. That is incorrect for scheduling because the visitor's
 * selected timezone is authoritative. This conversion keeps availability
 * checks, conflict detection, and Calendar event creation on the same instant.
 */
export function zonedDateTimeToUtc(
  date: string,   // YYYY-MM-DD
  time: string,   // HH:MM
  timezone: string
): Date {
  if (!isValidTimezone(timezone)) {
    throw new Error(`[Timezone] Invalid timezone: ${timezone}`);
  }
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Two passes handle the offset change around daylight-saving transitions.
  let timestamp = target;
  for (let attempt = 0; attempt < 2; attempt++) {
    const values = Object.fromEntries(
      formatter
        .formatToParts(new Date(timestamp))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)])
    ) as Record<string, number>;
    const displayedAsUtc = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second
    );
    timestamp = target - (displayedAsUtc - timestamp);
  }

  return new Date(timestamp);
}

/** Backward-compatible ISO helper for calendar consumers. */
export function buildIsoDateTime(
  date: string,
  time: string,
  timezone: string
): string {
  return zonedDateTimeToUtc(date, time, timezone).toISOString();
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
