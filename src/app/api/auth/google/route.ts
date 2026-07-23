/**
 * Google OAuth callback route — Phase 5
 * GET /api/auth/google?code=... — exchanges the code for tokens
 * GET /api/auth/google         — redirects to Google consent screen
 *
 * Tokens are stored server-side only. Never sent to the client.
 * In production, store the refresh token in a secrets manager / DB.
 * For this portfolio, we log it once so you can copy it to .env.local.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, exchangeCode } from "@/lib/calendar/google/google-auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  // Step 1: no code → redirect to Google consent screen
  if (!code) {
    try {
      const url = await getAuthUrl();
      return NextResponse.redirect(url);
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message },
        { status: 500 }
      );
    }
  }

  // Step 2: code present → exchange for tokens
  try {
    const tokens = await exchangeCode(code);
    // In production: persist tokens.refreshToken securely (DB / secret manager).
    // For development: log once so the developer can copy to .env.local
    console.log(
      "\n[CalendarAuth] ✅ OAuth successful.\n" +
      "Copy the refresh token below to GOOGLE_CALENDAR_REFRESH_TOKEN in .env.local:\n",
      tokens.refreshToken,
      "\n"
    );
    return NextResponse.json({
      message: "Calendar connected successfully. Check server logs for the refresh token.",
      accessTokenExpiry: tokens.expiry,
    });
  } catch (e: any) {
    console.error("[CalendarAuth] Token exchange failed:", e.message);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
