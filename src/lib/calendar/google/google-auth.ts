/**
 * Google OAuth — Phase 5
 * All token handling is server-side. Tokens never reach the client.
 * Minimum scopes: calendar.events + calendar.readonly
 */

import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

/** Build an OAuth2 client from env vars */
export function getOAuth2Client() {
  const clientId     = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri  = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "[CalendarAuth] Missing GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, or GOOGLE_OAUTH_REDIRECT_URI"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/** Generate the consent URL to redirect the user to */
export async function getAuthUrl(state: string): Promise<string> {
  const auth = getOAuth2Client();
  return auth.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state,
  });
}

/** Exchange the authorization code for tokens */
export async function exchangeCode(
  code: string
): Promise<{ accessToken: string; refreshToken: string; expiry: number }> {
  const auth = getOAuth2Client();
  const { tokens } = await auth.getToken(code);
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error("[CalendarAuth] Token exchange failed — missing tokens.");
  }
  return {
    accessToken:  tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiry:       tokens.expiry_date ?? Date.now() + 3600_000,
  };
}

/** Build an authenticated client from a stored refresh token */
export function buildAuthedClient(refreshToken: string) {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: refreshToken });
  return auth;
}
