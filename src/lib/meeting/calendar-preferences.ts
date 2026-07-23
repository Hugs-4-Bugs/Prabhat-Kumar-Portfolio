/**
 * Calendar Preferences — Phase 7
 * Configurable via environment variables or this file.
 * No UI needed — backend-only configuration.
 */

export interface CalendarPreferences {
  workingHoursStart: number;   // 0–23 hour in owner's timezone
  workingHoursEnd: number;
  ownerTimezone: string;       // IANA timezone
  bufferBetweenMeetingsMin: number;
  lunchStartHour: number;
  lunchEndHour: number;
  maxMeetingsPerDay: number;
  defaultDurationMin: number;
  allowWeekends: boolean;
}

export function getCalendarPreferences(): CalendarPreferences {
  return {
    workingHoursStart:      Number(process.env.CAL_WORK_START ?? 9),
    workingHoursEnd:        Number(process.env.CAL_WORK_END ?? 18),
    ownerTimezone:          process.env.CAL_OWNER_TIMEZONE ?? "Asia/Kolkata",
    bufferBetweenMeetingsMin: Number(process.env.CAL_BUFFER_MIN ?? 15),
    lunchStartHour:         Number(process.env.CAL_LUNCH_START ?? 13),
    lunchEndHour:           Number(process.env.CAL_LUNCH_END ?? 14),
    maxMeetingsPerDay:      Number(process.env.CAL_MAX_MEETINGS ?? 5),
    defaultDurationMin:     Number(process.env.CAL_DURATION_MIN ?? 60),
    allowWeekends:          process.env.CAL_ALLOW_WEEKENDS === "true",
  };
}

/** Returns true if a given hour falls within working hours */
export function isWorkingHour(hour: number, prefs: CalendarPreferences): boolean {
  if (hour >= prefs.lunchStartHour && hour < prefs.lunchEndHour) return false;
  return hour >= prefs.workingHoursStart && hour < prefs.workingHoursEnd;
}
