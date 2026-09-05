import { NextResponse } from "next/server";

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const TOKEN_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/auth_tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let cleaned = value.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || undefined;
}

function getVoiceApiKey(): { apiKey?: string; source: "GEMINI_API_KEY" | "GOOGLE_API_KEY" | "missing" } {
  const geminiApiKey = cleanEnvValue(process.env.GEMINI_API_KEY);
  if (geminiApiKey) return { apiKey: geminiApiKey, source: "GEMINI_API_KEY" };
  const googleApiKey = cleanEnvValue(process.env.GOOGLE_API_KEY);
  if (googleApiKey) return { apiKey: googleApiKey, source: "GOOGLE_API_KEY" };
  return { source: "missing" };
}

function logVoiceEnvStatus(stage: string) {
  const geminiApiKey = cleanEnvValue(process.env.GEMINI_API_KEY);
  const googleApiKey = cleanEnvValue(process.env.GOOGLE_API_KEY);
  console.info(`[VoiceToken] ${stage}`, {
    "GEMINI_API_KEY configured": Boolean(geminiApiKey),
    "GOOGLE_API_KEY configured": Boolean(googleApiKey),
    geminiApiKeyLength: geminiApiKey?.length ?? 0,
    googleApiKeyLength: googleApiKey?.length ?? 0,
    liveModel: LIVE_MODEL,
  });
}

function classifyTokenError(status: number): string {
  if (status === 400) return "VOICE_TOKEN_BAD_REQUEST";
  if (status === 401 || status === 403) return "VOICE_TOKEN_AUTH_FAILED";
  if (status === 404) return "VOICE_TOKEN_ENDPOINT_NOT_FOUND";
  if (status === 429) return "VOICE_TOKEN_RATE_LIMITED";
  return "VOICE_TOKEN_UPSTREAM_FAILED";
}

export async function POST() {
  const { apiKey, source } = getVoiceApiKey();
  if (!apiKey) {
    console.warn("[VoiceToken] Missing GEMINI_API_KEY or GOOGLE_API_KEY");
    logVoiceEnvStatus("Configuration missing");
    return NextResponse.json(
      {
        error: "Voice is not configured.",
        code: "VOICE_API_KEY_MISSING",
        requiredEnv: ["GEMINI_API_KEY"],
        alternativeEnv: ["GOOGLE_API_KEY"],
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  logVoiceEnvStatus("Generating live token");

  try {
    const now = Date.now();
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + 25 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error("[VoiceToken] Gemini token request failed", {
        status: response.status,
        code: classifyTokenError(response.status),
        apiKeySource: source,
        responseLength: details.length,
        responsePreview: details.slice(0, 180).replace(/[A-Za-z0-9_-]{28,}/g, "[redacted]"),
      });
      return NextResponse.json(
        {
          error: response.status === 429
            ? "Voice service is rate-limited. Please try again shortly."
            : "Failed to generate voice token.",
          code: classifyTokenError(response.status),
        },
        { status: response.status === 429 ? 429 : 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const token = (await response.json()) as { name?: string; expireTime?: string };
    if (!token.name) {
      console.error("[VoiceToken] Gemini token response missing token name", {
        apiKeySource: source,
        expiresAtPresent: Boolean(token.expireTime),
      });
      return NextResponse.json(
        { error: "Invalid voice token response.", code: "VOICE_TOKEN_INVALID_RESPONSE" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { token: token.name, expiresAt: token.expireTime },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[VoiceToken] Token generation threw", {
      message: error instanceof Error ? error.message : "unknown error",
      apiKeySource: source,
    });
    return NextResponse.json(
      { error: "Failed to generate voice token.", code: "VOICE_TOKEN_EXCEPTION" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
