import { google } from "googleapis";
import { buildVerifiedAuthedClient, getCalendarConfigStatus, getCalendarScopes } from "./google-auth";

export type CalendarDiagnosticCode =
  | "AUTH_REQUIRED"
  | "INVALID_REFRESH_TOKEN"
  | "AUTH_REFRESH_FAILED"
  | "CALENDAR_ACCESS_DENIED"
  | "CALENDAR_NOT_FOUND"
  | "AVAILABILITY_CHECK_FAILED"
  | "EVENT_CREATE_FAILED"
  | "MEET_CREATE_FAILED"
  | "EVENT_RETRIEVAL_FAILED";

export class CalendarDiagnosticError extends Error {
  constructor(
    public readonly diagnosticCode: CalendarDiagnosticCode,
    public readonly httpStatus?: number,
    public readonly googleStatus?: string
  ) {
    super(diagnosticCode);
    this.name = "CalendarDiagnosticError";
  }
}

export interface CalendarConnectionDiagnostic {
  configured: ReturnType<typeof getCalendarConfigStatus>;
  scopes: readonly string[];
  accessTokenRefreshed: boolean;
  calendarAccessible: boolean;
  freeBusyAccessible: boolean;
  oauthClientSource: string;
}

export interface CalendarWriteDiagnostic extends CalendarConnectionDiagnostic {
  eventCreated: boolean;
  meetCreated: boolean;
  eventRetrieved: boolean;
  eventDeleted: boolean;
}

function errorDetails(error: unknown): { status?: number; googleStatus?: string; message: string } {
  const candidate = error as {
    code?: unknown;
    message?: unknown;
    response?: { status?: unknown; data?: { error?: { status?: unknown; message?: unknown } } };
  };
  const status = candidate?.response?.status ?? candidate?.code;
  const googleStatus = candidate?.response?.data?.error?.status;
  const message = String(candidate?.response?.data?.error?.message ?? candidate?.message ?? "");
  return {
    status: typeof status === "number" ? status : undefined,
    googleStatus: typeof googleStatus === "string" ? googleStatus : undefined,
    message,
  };
}

function classifyError(stage: "AUTH" | "CALENDAR" | "FREE_BUSY" | "EVENT_CREATE" | "EVENT_GET", error: unknown): CalendarDiagnosticError {
  const { status, googleStatus, message } = errorDetails(error);
  if (/invalid_grant|invalid credential|token.*(?:expired|revoked)/i.test(message)) {
    return new CalendarDiagnosticError("INVALID_REFRESH_TOKEN", status, googleStatus);
  }
  if (stage === "AUTH" || status === 401) return new CalendarDiagnosticError("AUTH_REFRESH_FAILED", status, googleStatus);
  if (status === 403) return new CalendarDiagnosticError("CALENDAR_ACCESS_DENIED", status, googleStatus);
  if (status === 404) return new CalendarDiagnosticError("CALENDAR_NOT_FOUND", status, googleStatus);
  if (stage === "FREE_BUSY") return new CalendarDiagnosticError("AVAILABILITY_CHECK_FAILED", status, googleStatus);
  if (stage === "EVENT_CREATE") return new CalendarDiagnosticError("EVENT_CREATE_FAILED", status, googleStatus);
  if (stage === "EVENT_GET") return new CalendarDiagnosticError("EVENT_RETRIEVAL_FAILED", status, googleStatus);
  return new CalendarDiagnosticError("CALENDAR_ACCESS_DENIED", status, googleStatus);
}

function requireRefreshToken(refreshToken?: string): string {
  if (!refreshToken) throw new CalendarDiagnosticError("AUTH_REQUIRED");
  return refreshToken;
}

/** Read-only production-safe connection probe. It never exposes credentials. */
export async function verifyCalendarConnection(
  refreshToken: string,
  calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary"
): Promise<CalendarConnectionDiagnostic> {
  let verified;
  try {
    verified = await buildVerifiedAuthedClient(requireRefreshToken(refreshToken));
  } catch (error) {
    if (error instanceof CalendarDiagnosticError) throw error;
    throw classifyError("AUTH", error);
  }

  const auth = verified.auth;
  const calendar = google.calendar({ version: "v3", auth });
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  try {
    await calendar.events.list({ calendarId, maxResults: 1, singleEvents: true });
  } catch (error) {
    throw classifyError("CALENDAR", error);
  }
  try {
    await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: later.toISOString(),
        items: [{ id: calendarId }],
      },
    });
  } catch (error) {
    throw classifyError("FREE_BUSY", error);
  }

  return {
    configured: getCalendarConfigStatus(),
    scopes: getCalendarScopes(),
    accessTokenRefreshed: true,
    calendarAccessible: true,
    freeBusyAccessible: true,
    oauthClientSource: verified.clientSource,
  };
}

/**
 * Owner-triggered write probe. It creates a short-lived event with Google Meet,
 * verifies it can be read back, then deletes it without inviting attendees.
 */
export async function verifyCalendarWriteAccess(
  refreshToken: string,
  calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary"
): Promise<CalendarWriteDiagnostic> {
  const connection = await verifyCalendarConnection(refreshToken, calendarId);
  const verified = await buildVerifiedAuthedClient(requireRefreshToken(refreshToken));
  const auth = verified.auth;
  const calendar = google.calendar({ version: "v3", auth });
  const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  start.setUTCMinutes(0, 0, 0);
  const end = new Date(start.getTime() + 5 * 60 * 1000);
  let eventId: string | undefined;

  try {
    const created = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: "QuantumAI Calendar diagnostic — auto-deleted",
        description: "Owner-authorized production diagnostic. This event is deleted immediately after verification.",
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `quantumai-diagnostic-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });
    eventId = created.data.id ?? undefined;
    if (!eventId) throw new CalendarDiagnosticError("EVENT_CREATE_FAILED");
  } catch (error) {
    if (error instanceof CalendarDiagnosticError) throw error;
    throw classifyError("EVENT_CREATE", error);
  }

  try {
    const verified = await calendar.events.get({ calendarId, eventId });
    const meetCreated = Boolean(verified.data.conferenceData?.entryPoints?.some((entry) => entry.entryPointType === "video" && entry.uri));
    if (!meetCreated) throw new CalendarDiagnosticError("MEET_CREATE_FAILED");
  } catch (error) {
    if (error instanceof CalendarDiagnosticError) throw error;
    throw classifyError("EVENT_GET", error);
  }

  try {
    await calendar.events.delete({ calendarId, eventId, sendUpdates: "none" });
  } catch (error) {
    throw classifyError("EVENT_GET", error);
  }

  return { ...connection, eventCreated: true, meetCreated: true, eventRetrieved: true, eventDeleted: true };
}
