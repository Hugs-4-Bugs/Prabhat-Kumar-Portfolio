/**
 * Google OAuth callback route — Phase 5
 * GET /api/auth/google?code=... — exchanges the code for tokens
 * GET /api/auth/google         — redirects to Google consent screen
 *
 * This owner-only route is deliberately disabled in production. Authorize from
 * a protected development environment, then add the resulting refresh token to
 * the production secret store as GOOGLE_CALENDAR_REFRESH_TOKEN.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, exchangeCode } from "@/lib/calendar/google/google-auth";
import { verifyCalendarConnection } from "@/lib/calendar/google/diagnostics";

export const runtime = "nodejs";

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function expectedState(secret: string): string {
  return createHmac("sha256", secret).update("prabhat-online-google-oauth-setup").digest("hex");
}

async function persistDevelopmentRefreshToken(refreshToken: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development-only OAuth persistence is unavailable in production.");
  }
  if (!refreshToken || /[\r\n]/.test(refreshToken)) {
    throw new Error("Google returned an invalid refresh token.");
  }

  const envPath = path.join(process.cwd(), ".env.local");
  let content = "";
  try {
    content = await readFile(envPath, "utf8");
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
  }

  const entry = `GOOGLE_CALENDAR_REFRESH_TOKEN=${refreshToken}`;
  const pattern = /^GOOGLE_CALENDAR_REFRESH_TOKEN=.*$/m;
  const nextContent = pattern.test(content)
    ? content.replace(pattern, entry)
    : `${content}${content && !content.endsWith("\n") ? "\n" : ""}${entry}\n`;
  const temporaryPath = `${envPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, nextContent, { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, envPath);
  process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = refreshToken;
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const setupToken = req.nextUrl.searchParams.get("setup_token");
  const setupSecret = process.env.GOOGLE_OAUTH_SETUP_TOKEN;

  if (!setupSecret) {
    return NextResponse.json({ error: "OAuth setup is not enabled." }, { status: 404 });
  }

  // Step 1: no code → redirect to Google consent screen
  if (!code) {
    if (!setupToken || !secureEqual(setupToken, setupSecret)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    try {
      const url = await getAuthUrl(expectedState(setupSecret));
      return NextResponse.redirect(url);
    } catch {
      return NextResponse.json({ error: "Could not start OAuth setup." }, { status: 500 });
    }
  }

  // Step 2: code present → exchange for tokens
  if (!state || !secureEqual(state, expectedState(setupSecret))) {
    return NextResponse.json({ error: "Invalid OAuth state." }, { status: 400 });
  }

  try {
    const tokens = await exchangeCode(code);
    const diagnostic = await verifyCalendarConnection(tokens.refreshToken);
    await persistDevelopmentRefreshToken(tokens.refreshToken);
    console.info("[CalendarAuth] OAuth completed and calendar access verified.");
    return NextResponse.json(
      {
        message: "Calendar authorization completed and verified. The refresh token was saved to local development configuration. Add the same newly issued token to Vercel's GOOGLE_CALENDAR_REFRESH_TOKEN before deploying.",
        diagnostic,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("[CalendarAuth] OAuth renewal failed:", error?.message ?? "unknown error");
    return NextResponse.json(
      { error: "OAuth renewal or calendar verification failed. The existing refresh token was not changed." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
