import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  CalendarDiagnosticError,
  verifyCalendarConnection,
  verifyCalendarWriteAccess,
} from "@/lib/calendar/google/diagnostics";
import { getCalendarConfigStatus, getCalendarRefreshToken, getCalendarScopes } from "@/lib/calendar/google/google-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.GOOGLE_CALENDAR_DIAGNOSTIC_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return Boolean(secret && supplied && secureEqual(supplied, secret));
}

function safeEnvironmentStatus() {
  return {
    "GOOGLE_OAUTH_CLIENT_ID configured": Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID),
    "GOOGLE_OAUTH_CLIENT_SECRET configured": Boolean(process.env.GOOGLE_OAUTH_CLIENT_SECRET),
    "GOOGLE_CLIENT_ID configured": Boolean(process.env.GOOGLE_CLIENT_ID),
    "GOOGLE_CLIENT_SECRET configured": Boolean(process.env.GOOGLE_CLIENT_SECRET),
    "GOOGLE_OAUTH_REDIRECT_URI configured": Boolean(process.env.GOOGLE_OAUTH_REDIRECT_URI),
    "GOOGLE_CALENDAR_REFRESH_TOKEN configured": Boolean(process.env.GOOGLE_CALENDAR_REFRESH_TOKEN),
    "GOOGLE_CALENDAR_ID configured": Boolean(process.env.GOOGLE_CALENDAR_ID),
    "GOOGLE_CALENDAR_DIAGNOSTIC_TOKEN configured": Boolean(process.env.GOOGLE_CALENDAR_DIAGNOSTIC_TOKEN),
    sources: getCalendarConfigStatus(),
    requiredScopes: getCalendarScopes(),
    databasePersistence: "NOT_CONFIGURED",
    confirmationEmail: {
      resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
      resendFromEmailConfigured: Boolean(process.env.RESEND_FROM_EMAIL),
      status: "NOT_SENT_BY_DIAGNOSTIC",
    },
  };
}

function failureResponse(error: unknown) {
  const diagnosticError = error instanceof CalendarDiagnosticError ? error : undefined;
  const code = diagnosticError?.diagnosticCode ?? "AUTH_REFRESH_FAILED";
  console.error("[CalendarDiagnostic] failed", {
    code,
    httpStatus: diagnosticError?.httpStatus,
    googleStatus: diagnosticError?.googleStatus,
  });
  return NextResponse.json(
    {
      ok: false,
      code,
      httpStatus: diagnosticError?.httpStatus,
      googleStatus: diagnosticError?.googleStatus,
      environment: safeEnvironmentStatus(),
    },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

async function runDiagnostic(write: boolean) {
  const refreshToken = getCalendarRefreshToken();
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  if (!refreshToken) throw new CalendarDiagnosticError("AUTH_REQUIRED");
  const diagnostic = write
    ? await verifyCalendarWriteAccess(refreshToken, calendarId)
    : await verifyCalendarConnection(refreshToken, calendarId);
  return NextResponse.json(
    { ok: true, mode: write ? "write" : "read", environment: safeEnvironmentStatus(), diagnostic },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** GET tests token refresh, Calendar access, scopes, and FreeBusy without writes. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    return await runDiagnostic(false);
  } catch (error) {
    return failureResponse(error);
  }
}

/** POST performs the owner-authorized disposable event + Meet verification. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const body = await request.json().catch(() => null);
    if (body?.confirmWrite !== true) return NextResponse.json({ error: "Write confirmation required." }, { status: 400 });
    return await runDiagnostic(true);
  } catch (error) {
    return failureResponse(error);
  }
}
