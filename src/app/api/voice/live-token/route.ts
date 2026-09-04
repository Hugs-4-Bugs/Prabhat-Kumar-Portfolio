import { NextResponse } from "next/server";

const LIVE_MODEL = "gemini-3.1-flash-live-preview";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice is not configured." },
      { status: 503 }
    );
  }

  const now = Date.now();
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/auth_tokens",
    {
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
    }
  );

  if (!response.ok) {
    const details = await response.text();
    console.error("[VoiceToken] Gemini token request failed:", response.status, details.slice(0, 500));
    return NextResponse.json(
      { error: "Unable to start voice right now." },
      { status: response.status === 429 ? 429 : 502 }
    );
  }

  const token = (await response.json()) as { name?: string; expireTime?: string };
  if (!token.name) {
    return NextResponse.json({ error: "Invalid voice token response." }, { status: 502 });
  }

  return NextResponse.json(
    { token: token.name, expiresAt: token.expireTime },
    { headers: { "Cache-Control": "no-store" } }
  );
}
