'use server';
/**
 * @fileOverview Converts text to speech using ElevenLabs.
 * Returns a base64 audio data URI on success, or null on failure
 * so the caller can fall back to the browser Web Speech API.
 */

/**
 * Resolves the ElevenLabs voice ID for the given agent using a fully-static
 * switch statement. This avoids Next.js / Vercel build-time dynamic
 * process.env[] access which always evaluates to undefined.
 */
function getElevenLabsVoiceId(voiceAgentId?: string): string | undefined {
  const agentId = voiceAgentId?.toLowerCase().trim();
  switch (agentId) {
    case 'quantum': return process.env.ELEVENLABS_VOICE_ID_QUANTUM;
    case 'nova':    return process.env.ELEVENLABS_VOICE_ID_NOVA;
    case 'sage':    return process.env.ELEVENLABS_VOICE_ID_SAGE;
    case 'aria':    return process.env.ELEVENLABS_VOICE_ID_ARIA;
    case 'echo':    return process.env.ELEVENLABS_VOICE_ID_ECHO;
    case 'orion':   return process.env.ELEVENLABS_VOICE_ID_ORION;
    case 'luna':    return process.env.ELEVENLABS_VOICE_ID_LUNA;
    default:        return process.env.ELEVENLABS_VOICE_ID;
  }
}

export async function textToSpeech(text: string, voiceAgentId?: string): Promise<string | null> {
  return textToSpeechWithElevenLabs(text, voiceAgentId);
}

async function textToSpeechWithElevenLabs(text: string, voiceAgentId?: string): Promise<string | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('[TTS] ElevenLabs API key (ELEVENLABS_API_KEY) is missing — falling back to browser TTS.');
    return null;
  }

  const voiceId = getElevenLabsVoiceId(voiceAgentId);
  if (!voiceId) {
    console.error(`[TTS] No ElevenLabs voice ID found for agent "${voiceAgentId ?? 'default'}" — falling back to browser TTS.`);
    return null;
  }

  console.log(`[TTS] ElevenLabs request started — agent: "${voiceAgentId ?? 'default'}", voice ID: "${voiceId}"`);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    });

    console.log(`[TTS] ElevenLabs HTTP status: ${response.status}`);

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[TTS] ElevenLabs rejected voice ID "${voiceId}" (HTTP ${response.status}):`, errBody);
      return null;
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    console.log(`[TTS] ElevenLabs audio received — ${audioBuffer.length} bytes`);
    return `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
  } catch (error) {
    console.error('[TTS] ElevenLabs fetch error:', error);
    return null;
  }
}
