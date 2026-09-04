import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCalendarConfigStatus } from "@/lib/calendar/google/google-auth";
import { verifyCalendarConnection } from "@/lib/calendar/google/diagnostics";

export const runtime = "nodejs";

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function failureCode(error: unknown): "INVALID_REFRESH_TOKEN" | "AUTH_REFRESH_FAILED" | "CALENDAR_ACCESS_DENIED" | "CALENDAR_NOT_FOUND" | "AVAILABILITY_CHECK_FAILED" {
  const candidate = error as { code?: unknown; response?: { status?: unknown; data?: { error?: { message?: unknown } } }; message?: unknown };
  const status = candidate?.response?.status ?? candidate?.code;
  const message = String(candidate?.response?.data?.error?.message ?? candidate?.message ?? "");
  if (/invalid_grant|invalid credential|token.*(?:expired|revoked)/i.test(message)) return "INVALID_REFRESH_TOKEN";
  if (status === 401) return "AUTH_REFRESH_FAILED";
  if (status === 403) return "CALENDAR_ACCESS_DENIED";
  if (status === 404) return "CALENDAR_NOT_FOUND";
  return "AVAILABILITY_CHECK_FAILED";
}

/** Development-only, owner-protected, read-only Calendar connection probe. */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const setupSecret = process.env.GOOGLE_OAUTH_SETUP_TOKEN;
  const providedToken = req.nextUrl.searchParams.get("setup_token");
  if (!setupSecret || !providedToken || !secureEqual(providedToken, setupSecret)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, code: "AUTH_REQUIRED", configured: getCalendarConfigStatus() },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const diagnostic = await verifyCalendarConnection(refreshToken);
    return NextResponse.json({ ok: true, diagnostic }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = failureCode(error);
    console.error("[CalendarDiagnostic] Connection check failed:", { code, message: error instanceof Error ? error.message : "unknown error" });
    return NextResponse.json(
      { ok: false, code, configured: getCalendarConfigStatus() },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
