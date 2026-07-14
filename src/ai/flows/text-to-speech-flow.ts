'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that takes text and returns an audio data URI.
 */

import {ai} from '@/ai/genkit';
import wav from 'wav';

const ELEVENLABS_VOICE_ENV_BY_AGENT: Record<string, string> = {
  quantum: 'ELEVENLABS_VOICE_ID_QUANTUM',
  nova: 'ELEVENLABS_VOICE_ID_NOVA',
  sage: 'ELEVENLABS_VOICE_ID_SAGE',
  aria: 'ELEVENLABS_VOICE_ID_ARIA',
  echo: 'ELEVENLABS_VOICE_ID_ECHO',
  orion: 'ELEVENLABS_VOICE_ID_ORION',
  luna: 'ELEVENLABS_VOICE_ID_LUNA',
};

export async function textToSpeech(text: string, voiceAgentId?: string): Promise<string> {
    const elevenLabsAudio = await textToSpeechWithElevenLabs(text, voiceAgentId);
    if (elevenLabsAudio) {
      return elevenLabsAudio;
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Alloy' },
          },
        },
      },
      prompt: text,
    });
    if (!media?.url) {
      throw new Error('No audio returned from TTS model.');
    }
    const pcmData = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavData = await toWav(pcmData);
    return `data:audio/wav;base64,${wavData}`;
}

async function textToSpeechWithElevenLabs(text: string, voiceAgentId?: string): Promise<string | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const agentVoiceEnv = voiceAgentId ? ELEVENLABS_VOICE_ENV_BY_AGENT[voiceAgentId] : undefined;
  const voiceId = (agentVoiceEnv ? process.env[agentVoiceEnv] : undefined) || process.env.ELEVENLABS_VOICE_ID;
  if (!voiceId) return null;

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

    if (!response.ok) {
      console.error('ElevenLabs TTS failed:', await response.text());
      return null;
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    return `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return null;
  }
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => {
      bufs.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
