/**
 * Google OAuth — Phase 5
 * All token handling is server-side. Tokens never reach the client.
 * Minimum scopes: event management plus free/busy availability.
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.freebusy",
];

type OAuthClientSource = "GOOGLE_OAUTH_CLIENT_ID/GOOGLE_OAUTH_CLIENT_SECRET" | "GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET";

interface EnvValue {
  value?: string;
  configured: boolean;
  length: number;
}

interface OAuthClientCandidate {
  source: OAuthClientSource;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let cleaned = value.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  cleaned = cleaned.replace(/\\n/g, "").trim();
  return cleaned || undefined;
}

function readEnv(name: string): EnvValue {
  const value = cleanEnvValue(process.env[name]);
  return {
    value,
    configured: Boolean(value),
    length: value?.length ?? 0,
  };
}

export function getCalendarRefreshToken(): string | undefined {
  return readEnv("GOOGLE_CALENDAR_REFRESH_TOKEN").value;
}

function getRedirectUri(): string | undefined {
  return readEnv("GOOGLE_OAUTH_REDIRECT_URI").value;
}

function getOAuthClientCandidates(): OAuthClientCandidate[] {
  const redirectUri = getRedirectUri();
  if (!redirectUri) return [];

  const primaryId = readEnv("GOOGLE_OAUTH_CLIENT_ID").value;
  const primarySecret = readEnv("GOOGLE_OAUTH_CLIENT_SECRET").value;
  const aliasId = readEnv("GOOGLE_CLIENT_ID").value;
  const aliasSecret = readEnv("GOOGLE_CLIENT_SECRET").value;
  const candidates: OAuthClientCandidate[] = [];

  if (primaryId && primarySecret) {
    candidates.push({
      source: "GOOGLE_OAUTH_CLIENT_ID/GOOGLE_OAUTH_CLIENT_SECRET",
      clientId: primaryId,
      clientSecret: primarySecret,
      redirectUri,
    });
  }

  if (aliasId && aliasSecret && (aliasId !== primaryId || aliasSecret !== primarySecret)) {
    candidates.push({
      source: "GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET",
      clientId: aliasId,
      clientSecret: aliasSecret,
      redirectUri,
    });
  }

  return candidates;
}

function createOAuth2Client(candidate: OAuthClientCandidate): OAuth2Client {
  return new google.auth.OAuth2(candidate.clientId, candidate.clientSecret, candidate.redirectUri);
}

function getGoogleErrorDetails(error: unknown): { status?: number; message: string; googleError?: string } {
  const candidate = error as {
    code?: unknown;
    message?: unknown;
    response?: { status?: unknown; data?: { error?: unknown; error_description?: unknown } };
  };
  const status = candidate?.response?.status ?? candidate?.code;
  return {
    status: typeof status === "number" ? status : undefined,
    message: String(candidate?.response?.data?.error_description ?? candidate?.message ?? ""),
    googleError: typeof candidate?.response?.data?.error === "string"
      ? candidate.response.data.error
      : undefined,
  };
}

function logSafeCalendarAuthDiagnostics(stage: string) {
  const refreshToken = readEnv("GOOGLE_CALENDAR_REFRESH_TOKEN");
  const primaryId = readEnv("GOOGLE_OAUTH_CLIENT_ID");
  const primarySecret = readEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const aliasId = readEnv("GOOGLE_CLIENT_ID");
  const aliasSecret = readEnv("GOOGLE_CLIENT_SECRET");
  const redirectUri = readEnv("GOOGLE_OAUTH_REDIRECT_URI");
  const calendarId = readEnv("GOOGLE_CALENDAR_ID");

  console.info(`[CalendarAuth] ${stage}`, {
    "GOOGLE_OAUTH_CLIENT_ID configured": primaryId.configured,
    "GOOGLE_OAUTH_CLIENT_SECRET configured": primarySecret.configured,
    "GOOGLE_CLIENT_ID configured": aliasId.configured,
    "GOOGLE_CLIENT_SECRET configured": aliasSecret.configured,
    "GOOGLE_OAUTH_REDIRECT_URI configured": redirectUri.configured,
    "GOOGLE_CALENDAR_REFRESH_TOKEN configured": refreshToken.configured,
    "GOOGLE_CALENDAR_ID configured": calendarId.configured,
    refreshTokenLength: refreshToken.length,
    primaryClientIdLength: primaryId.length,
    aliasClientIdLength: aliasId.length,
    primarySecretLength: primarySecret.length,
    aliasSecretLength: aliasSecret.length,
    redirectUriLength: redirectUri.length,
    calendarIdLength: calendarId.length,
    oauthClientNameConflict: primaryId.configured && aliasId.configured && primaryId.value !== aliasId.value,
    oauthSecretNameConflict: primarySecret.configured && aliasSecret.configured && primarySecret.value !== aliasSecret.value,
  });
}

export function getCalendarScopes(): readonly string[] {
  return SCOPES;
}

export function getCalendarConfigStatus() {
  const calendarId = readEnv("GOOGLE_CALENDAR_ID");
  const refreshToken = readEnv("GOOGLE_CALENDAR_REFRESH_TOKEN");
  const primaryId = readEnv("GOOGLE_OAUTH_CLIENT_ID");
  const primarySecret = readEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const aliasId = readEnv("GOOGLE_CLIENT_ID");
  const aliasSecret = readEnv("GOOGLE_CLIENT_SECRET");
  const redirectUri = readEnv("GOOGLE_OAUTH_REDIRECT_URI");
  const candidates = getOAuthClientCandidates();
  return {
    clientIdConfigured: primaryId.configured || aliasId.configured,
    clientSecretConfigured: primarySecret.configured || aliasSecret.configured,
    redirectUriConfigured: redirectUri.configured,
    refreshTokenConfigured: refreshToken.configured,
    calendarIdConfigured: calendarId.configured,
    calendarIdSource: calendarId.configured ? "GOOGLE_CALENDAR_ID" : "default:primary",
    refreshTokenSource: "GOOGLE_CALENDAR_REFRESH_TOKEN",
    clientIdSource: candidates[0]?.source ?? "missing",
    clientSecretSource: candidates[0]?.source ?? "missing",
    oauthClientCandidates: candidates.map((candidate) => candidate.source),
    googleOAuthClientIdConfigured: primaryId.configured,
    googleOAuthClientSecretConfigured: primarySecret.configured,
    googleClientIdConfigured: aliasId.configured,
    googleClientSecretConfigured: aliasSecret.configured,
    refreshTokenLength: refreshToken.length,
    oauthClientNameConflict: primaryId.configured && aliasId.configured && primaryId.value !== aliasId.value,
    oauthSecretNameConflict: primarySecret.configured && aliasSecret.configured && primarySecret.value !== aliasSecret.value,
  };
}

/** Build an OAuth2 client from env vars */
export function getOAuth2Client() {
  const candidate = getOAuthClientCandidates()[0];

  if (!candidate) {
    throw new Error(
      "[CalendarAuth] Missing Google OAuth client ID, client secret, or redirect URI"
    );
  }

  return createOAuth2Client(candidate);
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
  const normalizedRefreshToken = cleanEnvValue(refreshToken);
  if (!normalizedRefreshToken) throw new Error("[CalendarAuth] Missing refresh token.");
  auth.setCredentials({ refresh_token: normalizedRefreshToken });
  return auth;
}

/**
 * Build an authenticated client and prove the refresh token can be exchanged.
 * If production has both legacy and canonical OAuth env names, this detects
 * which client actually matches the stored refresh token without logging secrets.
 */
export async function buildVerifiedAuthedClient(refreshToken: string): Promise<{ auth: OAuth2Client; clientSource: OAuthClientSource }> {
  const normalizedRefreshToken = cleanEnvValue(refreshToken);
  if (!normalizedRefreshToken) throw new Error("[CalendarAuth] Missing refresh token.");

  const candidates = getOAuthClientCandidates();
  if (candidates.length === 0) {
    logSafeCalendarAuthDiagnostics("OAuth client missing");
    throw new Error("[CalendarAuth] Missing Google OAuth client configuration.");
  }

  logSafeCalendarAuthDiagnostics("Starting refresh-token verification");

  let lastError: unknown;
  for (const candidate of candidates) {
    const auth = createOAuth2Client(candidate);
    auth.setCredentials({ refresh_token: normalizedRefreshToken });
    try {
      const accessToken = await auth.getAccessToken();
      if (!accessToken.token) throw new Error("Google did not return an access token.");
      console.info("[CalendarAuth] Refresh-token verification succeeded", {
        oauthClientSource: candidate.source,
        accessTokenReceived: true,
      });
      return { auth, clientSource: candidate.source };
    } catch (error) {
      lastError = error;
      const details = getGoogleErrorDetails(error);
      console.error("[CalendarAuth] Refresh-token verification failed", {
        oauthClientSource: candidate.source,
        status: details.status,
        googleError: details.googleError,
        message: details.message,
      });
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("[CalendarAuth] Refresh-token verification failed.");
}
