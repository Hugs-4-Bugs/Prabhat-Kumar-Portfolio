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
import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, exchangeCode } from "@/lib/calendar/google/google-auth";

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function expectedState(secret: string): string {
  return createHmac("sha256", secret).update("prabhat-online-google-oauth-setup").digest("hex");
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
    // This route cannot securely persist secrets. It is development-only and
    // the token is intentionally never exposed to a browser response.
    console.log("[CalendarAuth] OAuth completed. Store this refresh token in the configured secret manager:", tokens.refreshToken);
    return NextResponse.json({
      message: "Calendar authorization completed. Store the refresh token from the protected server log in your secret manager.",
    });
  } catch {
    console.error("[CalendarAuth] Token exchange failed.");
    return NextResponse.json({ error: "OAuth token exchange failed." }, { status: 400 });
  }
}
