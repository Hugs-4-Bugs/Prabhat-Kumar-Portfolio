"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mic, Power, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingPanel } from "@/components/MeetingPanel";
import { extractMeetingFieldsAction } from "@/app/actions";
import { extractData, type MeetingSession } from "@/lib/meeting/meeting-session";
import { loadPersistedSession } from "@/lib/meeting/meeting-storage";
import { setField, startSession as startMeetingSession } from "@/lib/meeting/meeting-workflow";
import type { MeetingFormData } from "@/lib/meeting/meeting-types";
import { quantumAiKnowledge } from "@/lib/quantumai-knowledge";
import { getAssistantContext, recordAssistantUserTurn } from "@/lib/assistant/intelligence-store";

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const LIVE_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

const VOICES = [
  { id: "quantum", name: "Quantum AI", tagline: "Deep & Calm", color: "#4A90D9", accent: "#7C5CFC", geminiVoice: "Charon", visual: "neural" },
  { id: "nova", name: "Nova", tagline: "Warm & Friendly", color: "#E879B7", accent: "#8B5CF6", geminiVoice: "Aoede", visual: "supernova" },
  { id: "sage", name: "Sage", tagline: "Thoughtful & Wise", color: "#A78BFA", accent: "#22D3EE", geminiVoice: "Kore", visual: "neural" },
  { id: "aria", name: "Aria", tagline: "Energetic & Bright", color: "#F59E0B", accent: "#FB7185", geminiVoice: "Fenrir", visual: "supernova" },
] as const;
type Voice = (typeof VOICES)[number];
type VoiceState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "interrupted" | "error" | "closing";

interface LiveVoiceAgentProps {
  isVisible: boolean;
  onClose: () => void;
  conversationHistory: Array<{ user: string; model: string }>;
  onAddMessage: (user: string, model: string, source: "voice") => void;
}

const SYSTEM_INSTRUCTION = `You are QuantumAI, the voice assistant for Prabhat Kumar's portfolio. Be concise, factual, and conversational; answer in the visitor's dominant language (English, Hindi, or Hinglish). A selected voice such as Nova, Sage, or Aria is a voice style only: your name is always QuantumAI.

Conversation rules:
- Do not repeat an introduction after the first turn. For "who are you?", say you are QuantumAI, Prabhat's portfolio assistant.
- Answer direct questions first, with a specific documented fact. Do not replace a short question with a long biography or motivational language.
- Track all user-provided details, but do not claim that a field was saved, a form was complete, availability was checked, or a meeting was submitted unless the application explicitly confirms it.
- When the visitor asks to schedule, call open_meeting_flow once. Then say the form is open and ask for only one missing required detail. Required details are full name, email, phone with country code, meeting purpose, date, time, and timezone. Company and role are optional.
- If the visitor asks for availability, say it is checked only after all required fields are complete and they select Save Request. Never say the request was sent before that confirmation.
- If the visitor corrects a detail, acknowledge the correction but ask for confirmation before replacing a conflicting value.
- Never invent portfolio achievements, work history, calendar results, or contact details.\n\nTrusted portfolio data:\n${JSON.stringify(quantumAiKnowledge)}`;

function base64ToBytes(value: string) {
  const raw = window.atob(value);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index++) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

function bytesToBase64(bytes: Int16Array) {
  const chunkSize = 0x8000;
  let binary = "";
  const view = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  for (let start = 0; start < view.length; start += chunkSize) {
    binary += String.fromCharCode(...view.subarray(start, start + chunkSize));
  }
  return window.btoa(binary);
}

export const LiveVoiceAgent = memo(function LiveVoiceAgent({
  isVisible,
  onClose,
  conversationHistory,
  onAddMessage,
}: LiveVoiceAgentProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [voice, setVoice] = useState<Voice>(VOICES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const stateRef = useRef<VoiceState>("idle");

  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<AudioWorkletNode | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartRef = useRef(0);
  const generationRef = useRef(0);
  const inputTextRef = useRef("");
  const outputTextRef = useRef("");
  const closingRef = useRef(false);
  const meetingSessionRef = useRef<MeetingSession | null>(null);
  const extractionIdRef = useRef(0);
  const discardingAudioRef = useRef(false);
  const awaitingReplacementRef = useRef(false);
  const lastBargeInRef = useRef(0);
  const initialPromptRef = useRef(true);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const stopPlayback = useCallback(() => {
    generationRef.current += 1;
    nextStartRef.current = 0;
    for (const source of sourcesRef.current) {
      try { source.stop(); } catch { /* already stopped */ }
      source.disconnect();
    }
    sourcesRef.current.clear();
  }, []);

  const cleanup = useCallback(() => {
    closingRef.current = true;
    stopPlayback();
    inputNodeRef.current?.disconnect();
    inputNodeRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void inputContextRef.current?.close();
    inputContextRef.current = null;
    void outputContextRef.current?.close();
    outputContextRef.current = null;
    const socket = socketRef.current;
    socketRef.current = null;
    if (socket && socket.readyState < WebSocket.CLOSING) socket.close();
  }, [stopPlayback]);

  const queueAudio = useCallback((base64: string, generation: number) => {
    if (generation !== generationRef.current) return;
    const context = outputContextRef.current;
    if (!context) return;
    const pcm = new Int16Array(base64ToBytes(base64).buffer);
    const buffer = context.createBuffer(1, pcm.length, 24_000);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < pcm.length; index++) channel[index] = pcm[index] / 32768;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    const startAt = Math.max(context.currentTime + 0.025, nextStartRef.current);
    nextStartRef.current = startAt + buffer.duration;
    source.onended = () => { sourcesRef.current.delete(source); source.disconnect(); };
    sourcesRef.current.add(source);
    source.start(startAt);
  }, []);

  const flushTurn = useCallback(() => {
    const user = inputTextRef.current.trim();
    const model = outputTextRef.current.trim();
    if (user && model) {
      recordAssistantUserTurn(user);
      onAddMessage(user, model, "voice");
      setLastReply(model);
    }
    inputTextRef.current = "";
    outputTextRef.current = "";
  }, [onAddMessage]);

  const openMeetingFlow = useCallback(() => {
    const existing = meetingSessionRef.current ?? loadPersistedSession();
    meetingSessionRef.current = startMeetingSession(undefined, existing);
    setMeetingOpen(true);
  }, []);

  const collectMeetingFields = useCallback(async (spokenText: string) => {
    const session = meetingSessionRef.current;
    if (!session || !spokenText.trim()) return;
    const extractionId = ++extractionIdRef.current;
    const result = await extractMeetingFieldsAction(spokenText, extractData(session));
    if (!result.success || !result.data || extractionId !== extractionIdRef.current) return;
    let updated = meetingSessionRef.current;
    if (!updated) return;
    for (const [field, value] of Object.entries(result.data)) {
      if (typeof value === "string" && value.trim()) {
        updated = setField(updated, field as keyof MeetingFormData, value, 85);
      }
    }
    meetingSessionRef.current = updated;
  }, []);

  const startSession = useCallback(async () => {
    if (socketRef.current || closingRef.current === false && started) return;
    closingRef.current = false;
    initialPromptRef.current = true;
    discardingAudioRef.current = false;
    awaitingReplacementRef.current = false;
    setErrorMessage("");
    setStarted(true);
    setState("connecting");
    try {
      const tokenRequest = fetch("/api/voice/live-token", { method: "POST", cache: "no-store" });
      const microphoneRequest = navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const [tokenResult, microphoneResult] = await Promise.allSettled([tokenRequest, microphoneRequest]);
      if (microphoneResult.status === "rejected") throw microphoneResult.reason;
      const mediaStream = microphoneResult.value;
      streamRef.current = mediaStream;
      if (tokenResult.status === "rejected") throw tokenResult.reason;
      const tokenResponse = tokenResult.value;
      const tokenPayload = await tokenResponse.json() as { token?: string; error?: string };
      if (!tokenResponse.ok || !tokenPayload.token) throw new Error(tokenPayload.error || "Voice token failed.");
      const outputContext = new AudioContext({ sampleRate: 24_000 });
      outputContextRef.current = outputContext;
      await outputContext.resume();
      const socket = new WebSocket(`${LIVE_URL}?access_token=${encodeURIComponent(tokenPayload.token)}`);
      socketRef.current = socket;
      socket.onopen = async () => {
        if (socketRef.current !== socket) return;
        socket.send(JSON.stringify({
          setup: {
            model: `models/${LIVE_MODEL}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice.geminiVoice } } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            realtimeInputConfig: {
              automaticActivityDetection: {
                startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
                endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
                prefixPaddingMs: 500,
                silenceDurationMs: 950,
              },
            },
            systemInstruction: { parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${getAssistantContext("voice conversation")}` }] },
            tools: [{ functionDeclarations: [{
              name: "open_meeting_flow",
              description: "Open the existing meeting booking form after the visitor explicitly asks to schedule or book a meeting.",
              parameters: { type: "OBJECT", properties: {} },
            }] }],
          },
        }));
        if (conversationHistory.length) {
          socket.send(JSON.stringify({ clientContent: { turns: conversationHistory.slice(-8).flatMap((turn) => [
            { role: "user", parts: [{ text: turn.user }] },
            { role: "model", parts: [{ text: turn.model }] },
          ]), turnComplete: false } }));
        }
        const inputContext = new AudioContext();
        inputContextRef.current = inputContext;
        const workletSource = `class PcmProcessor extends AudioWorkletProcessor { constructor(){ super(); this.ratio=sampleRate/16000; this.samples=[]; this.frames=0; this.energy=0; this.speechFrames=0; } process(inputs){ const input=inputs[0][0]; if(!input) return true; for(let i=0;i<input.length;i++){ this.energy+=input[i]*input[i]; this.frames++; } if(this.frames>=1024){ const rms=Math.sqrt(this.energy/this.frames); this.speechFrames=rms>0.045?this.speechFrames+1:0; if(this.speechFrames>=5){ this.port.postMessage({ type:'speech' }); this.speechFrames=0; } this.frames=0; this.energy=0; } for(let i=0;i<input.length;i+=this.ratio){ const position=Math.floor(i); const next=Math.min(position+1,input.length-1); const fraction=i-position; this.samples.push(Math.max(-1,Math.min(1,input[position]+(input[next]-input[position])*fraction))); if(this.samples.length>=1600){ const pcm=new Int16Array(this.samples.length); for(let j=0;j<this.samples.length;j++) pcm[j]=this.samples[j]<0?this.samples[j]*0x8000:this.samples[j]*0x7fff; this.port.postMessage({ type:'audio', data:pcm },[pcm.buffer]); this.samples=[]; } } return true; } } registerProcessor('quantum-pcm', PcmProcessor);`;
        const workletUrl = URL.createObjectURL(new Blob([workletSource], { type: "application/javascript" }));
        await inputContext.audioWorklet.addModule(workletUrl);
        URL.revokeObjectURL(workletUrl);
        const source = inputContext.createMediaStreamSource(mediaStream);
        const node = new AudioWorkletNode(inputContext, "quantum-pcm");
        inputNodeRef.current = node;
        node.port.onmessage = ({ data }: MessageEvent<{ type: "audio" | "speech"; data?: Int16Array }>) => {
          if (data.type === "speech" && stateRef.current === "speaking" && Date.now() - lastBargeInRef.current > 250) {
            lastBargeInRef.current = Date.now();
            awaitingReplacementRef.current = true;
            discardingAudioRef.current = true;
            stopPlayback();
            setState("interrupted");
            return;
          }
          if (data.type !== "audio" || !data.data) return;
          if (socketRef.current !== socket || socket.readyState !== WebSocket.OPEN) return;
          socket.send(JSON.stringify({ realtimeInput: { audio: { data: bytesToBase64(data.data), mimeType: "audio/pcm;rate=16000" } } }));
        };
        source.connect(node);
        await inputContext.resume();
        socket.send(JSON.stringify({ realtimeInput: { text: "Greet the visitor briefly, then listen." } }));
        setState("listening");
      };
      socket.onmessage = async (event) => {
        const payload = typeof event.data === "string" ? event.data : await event.data.text();
        const message = JSON.parse(payload) as any;
        if (socketRef.current !== socket) return;
        if (message.error) {
          const detail = typeof message.error.message === "string"
            ? message.error.message
            : "Gemini rejected the voice session.";
          console.error("[LiveVoice] Gemini session error", message.error);
          setErrorMessage(detail);
          setState("error");
          cleanup();
          return;
        }
        const content = message.serverContent;
        if (content?.interrupted) {
          discardingAudioRef.current = true;
          awaitingReplacementRef.current = true;
          stopPlayback();
          setState("interrupted");
        }
        if (content?.inputTranscription?.text) {
          if (initialPromptRef.current) {
            initialPromptRef.current = false;
          } else {
            inputTextRef.current = `${inputTextRef.current} ${content.inputTranscription.text}`.trim();
          }
          setTranscript(inputTextRef.current);
          setState("thinking");
        }
        if (content?.outputTranscription?.text) {
          if (awaitingReplacementRef.current) {
            awaitingReplacementRef.current = false;
            discardingAudioRef.current = false;
            outputTextRef.current = "";
          }
          outputTextRef.current = `${outputTextRef.current} ${content.outputTranscription.text}`.trim();
          setLastReply(outputTextRef.current);
        }
        for (const part of content?.modelTurn?.parts ?? []) {
          if (part.inlineData?.data && !discardingAudioRef.current) {
            setState("speaking");
            queueAudio(part.inlineData.data, generationRef.current);
          }
        }
        if (content?.turnComplete) {
          const completedUserTurn = inputTextRef.current;
          flushTurn();
          void collectMeetingFields(completedUserTurn);
          setState("listening");
        }
        if (message.toolCall?.functionCalls) {
          const responses = message.toolCall.functionCalls.map((call: { id: string; name: string }) => {
            if (call.name === "open_meeting_flow") {
              openMeetingFlow();
              void collectMeetingFields(inputTextRef.current);
              return { id: call.id, name: call.name, response: { result: { opened: true } } };
            }
            return { id: call.id, name: call.name, response: { error: "Tool unavailable." } };
          });
          socket.send(JSON.stringify({ toolResponse: { functionResponses: responses } }));
        }
      };
      socket.onerror = () => {
        if (!closingRef.current) {
          setErrorMessage("The secure connection to Gemini could not be opened. Check your network and try again.");
          setState("error");
        }
      };
      socket.onclose = (event) => {
        if (!closingRef.current) {
          setErrorMessage(event.reason || "Gemini closed the voice connection before it was ready. Please try again.");
          setState("error");
        }
      };
    } catch (error) {
      console.error("[LiveVoice] Unable to start session", error);
      cleanup();
      setStarted(true);
      setErrorMessage(error instanceof Error ? error.message : "Voice mode could not start. Please try again.");
      setState("error");
    }
  }, [cleanup, collectMeetingFields, conversationHistory, flushTurn, openMeetingFlow, queueAudio, started, stopPlayback, voice.geminiVoice]);

  const closeSession = useCallback(() => {
    setState("closing");
    cleanup();
    setStarted(false);
    setTranscript("");
    onClose();
  }, [cleanup, onClose]);

  const retrySession = useCallback(() => {
    cleanup();
    setStarted(false);
    setState("idle");
    void startSession();
  }, [cleanup, startSession]);

  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  const stateLabel: Record<VoiceState, string> = {
    idle: "Ready when you are", connecting: "Establishing secure voice…", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…", interrupted: "I heard you — go ahead", error: "Voice needs attention", closing: "Ending voice mode…",
  };

  return <AnimatePresence>{isVisible && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[1010] flex flex-col items-center justify-center bg-neutral-950/70 backdrop-blur-2xl text-white overflow-y-auto">
    <div className="absolute top-4 right-4 z-10"><Button variant="ghost" size="icon" onClick={closeSession} className="rounded-full hover:bg-white/10 text-white"><X size={24} /></Button></div>
    {!started ? <div className="flex flex-col items-center gap-5 sm:gap-7 text-center px-4 sm:px-6 max-w-xs sm:max-w-sm w-full"><VoiceSignalCore voice={voice} state="idle" compact /><div className="w-full"><h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Voice Mode</h2><p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Talk naturally to QuantumAI about Prabhat&apos;s skills, experience &amp; projects.</p><VoicePicker value={voice} open={dropdownOpen} setOpen={setDropdownOpen} onChange={setVoice} /><Button size="lg" onClick={startSession} className="mt-4 sm:mt-6 rounded-full px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold gap-2 sm:gap-3 shadow-xl shadow-primary/20 w-full sm:w-auto"><Power size={16} />Start Conversation</Button></div></div> : <div className="flex flex-col items-center w-full max-w-sm px-4 gap-4 py-2"><div className="w-full"><VoicePicker value={voice} open={dropdownOpen} setOpen={setDropdownOpen} onChange={setVoice} /></div><VoiceSignalCore voice={voice} state={state} /><div className="text-center px-2 w-full"><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: voice.color }}>{state === "thinking" ? "Analysing context" : state === "speaking" ? "Live response" : state === "listening" ? "Live microphone" : "QuantumAI voice"}</p><h2 className="text-lg sm:text-xl font-bold mb-1 tracking-tight">{stateLabel[state]}</h2><p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem] px-2 leading-relaxed">{state === "error" ? errorMessage : transcript || (state === "speaking" ? lastReply : "Voice mode stays active hands-free.")}</p></div><button onClick={state === "error" ? retrySession : stopPlayback} aria-label={state === "error" ? "Retry voice connection" : "Stop speaking"} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors ${state === "speaking" ? "bg-red-500" : "bg-white text-black"}`}><Mic size={22} /></button>{state === "error" && <button onClick={retrySession} className="text-sm font-medium text-white hover:text-primary transition-colors">Try again</button>}<button onClick={closeSession} className="text-gray-400 hover:text-white transition-colors text-sm font-medium pb-1">Exit Session</button><p className="text-[10px] text-gray-600 text-center max-w-[240px] leading-relaxed pb-2">Voice capabilities are continuously improving.</p></div>}
    <MeetingPanel isOpen={meetingOpen} onClose={() => setMeetingOpen(false)} />
    <VoiceSignalStyles />
  </motion.div>}</AnimatePresence>;
});

function VoiceSignalCore({ voice, state, compact = false }: { voice: Voice; state: VoiceState; compact?: boolean }) {
  const style = { "--voice-primary": voice.color, "--voice-accent": voice.accent } as CSSProperties;
  const variantClass = voice.visual === "supernova" ? "voice-signal--supernova" : "voice-signal--neural";
  return <div className={`voice-signal ${variantClass} voice-signal--${state} ${compact ? "voice-signal--compact" : ""}`} style={style} aria-hidden="true">
    <div className="voice-signal__field" />
    <div className="voice-signal__corona voice-signal__corona--one" />
    <div className="voice-signal__corona voice-signal__corona--two" />
    <div className="voice-signal__ribbon voice-signal__ribbon--one" />
    <div className="voice-signal__ribbon voice-signal__ribbon--two" />
    <div className="voice-signal__halo voice-signal__halo--one" />
    <div className="voice-signal__halo voice-signal__halo--two" />
    <div className="voice-signal__orbit voice-signal__orbit--outer"><span /></div>
    <div className="voice-signal__orbit voice-signal__orbit--inner"><span /></div>
    <div className="voice-signal__scan" />
    <div className="voice-signal__burst">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--spark": index } as CSSProperties} />)}</div>
    <div className="voice-signal__particles">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--particle": index } as CSSProperties} />)}</div>
    <div className="voice-signal__core"><div className="voice-signal__mesh" /><div className="voice-signal__gloss" /><div className="voice-signal__equalizer">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div></div>
  </div>;
}

function VoiceSignalStyles() {
  return <style jsx global>{`
    .voice-signal { --voice-primary:#4A90D9; --voice-accent:#7C5CFC; position:relative; display:grid; place-items:center; width:12.75rem; height:12.75rem; isolation:isolate; contain:layout paint; transform:translateZ(0); }
    .voice-signal--compact { width:6.5rem; height:6.5rem; }
    .voice-signal__field, .voice-signal__corona, .voice-signal__ribbon, .voice-signal__halo, .voice-signal__orbit, .voice-signal__scan, .voice-signal__burst, .voice-signal__particles { position:absolute; inset:0; pointer-events:none; }
    .voice-signal__field { z-index:0; border-radius:50%; background:radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--voice-primary) 22%, transparent), transparent 62%); filter:blur(14px); opacity:.62; animation:voice-field-drift 9s ease-in-out infinite; }
    .voice-signal__core { position:relative; z-index:5; width:72%; height:72%; border-radius:50%; overflow:hidden; background:radial-gradient(circle at 28% 22%, rgba(255,255,255,.82), rgba(255,255,255,.18) 16%, transparent 27%), radial-gradient(circle at 38% 35%, color-mix(in srgb, var(--voice-primary) 92%, white), var(--voice-primary) 42%, color-mix(in srgb, var(--voice-accent) 82%, black) 112%); box-shadow:0 0 34px color-mix(in srgb, var(--voice-primary) 48%, transparent), 0 0 92px color-mix(in srgb, var(--voice-accent) 28%, transparent), inset -24px -30px 42px rgba(5,7,20,.43), inset 12px 12px 22px rgba(255,255,255,.15); animation:voice-core-breathe 4s ease-in-out infinite; }
    .voice-signal__mesh { position:absolute; inset:-35%; opacity:.26; background:repeating-conic-gradient(from 28deg, rgba(255,255,255,.22) 0 4deg, transparent 4deg 14deg); mix-blend-mode:overlay; animation:voice-mesh-turn 18s linear infinite; }
    .voice-signal__gloss { position:absolute; inset:0; background:radial-gradient(ellipse at 32% 22%, rgba(255,255,255,.52), transparent 28%), linear-gradient(135deg, rgba(255,255,255,.16), transparent 48%); mix-blend-mode:screen; }
    .voice-signal__halo { z-index:2; border-radius:50%; border:1px solid color-mix(in srgb, var(--voice-primary) 44%, transparent); opacity:.45; }
    .voice-signal__halo--one { inset:5%; box-shadow:0 0 32px color-mix(in srgb, var(--voice-primary) 34%, transparent); animation:voice-halo 3.6s ease-out infinite; }
    .voice-signal__halo--two { inset:-11%; border-color:color-mix(in srgb, var(--voice-accent) 34%, transparent); animation:voice-halo 3.6s 1.2s ease-out infinite; }
    .voice-signal__orbit { z-index:3; border-radius:50%; border:1px solid color-mix(in srgb, var(--voice-primary) 32%, transparent); animation:voice-orbit 9s linear infinite; }
    .voice-signal__orbit span { position:absolute; width:.38rem; height:.38rem; border-radius:99px; background:var(--voice-accent); box-shadow:0 0 13px var(--voice-accent); top:10%; left:49%; }
    .voice-signal__orbit--outer { width:98%; height:77%; inset:11% 1%; transform:rotate(-25deg); }
    .voice-signal__orbit--inner { width:78%; height:106%; inset:-3% 11%; transform:rotate(38deg); animation-direction:reverse; animation-duration:7s; }
    .voice-signal__scan { z-index:6; inset:auto; width:78%; height:2px; opacity:0; background:linear-gradient(90deg, transparent, var(--voice-accent), white, var(--voice-primary), transparent); box-shadow:0 0 14px var(--voice-accent); }
    .voice-signal__particles { z-index:1; }
    .voice-signal__particles i { --angle:calc(var(--particle) * 30deg); position:absolute; top:50%; left:50%; width:.22rem; height:.22rem; border-radius:50%; background:var(--voice-primary); opacity:0; transform:rotate(var(--angle)) translateY(-6.1rem); box-shadow:0 0 10px var(--voice-primary); }
    .voice-signal__equalizer { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:4%; opacity:0; transition:opacity .25s ease; }
    .voice-signal__equalizer i { display:block; width:5%; height:14%; border-radius:99px; background:rgba(255,255,255,.82); transform:scaleY(.45); }
    .voice-signal__corona, .voice-signal__ribbon, .voice-signal__burst { opacity:0; }
    .voice-signal--supernova .voice-signal__field { opacity:.78; filter:blur(18px); background:radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--voice-primary) 38%, transparent), color-mix(in srgb, var(--voice-accent) 20%, transparent) 36%, transparent 70%); }
    .voice-signal--supernova .voice-signal__core { width:70%; height:70%; background:radial-gradient(circle at 30% 22%, rgba(255,255,255,.88), rgba(255,255,255,.22) 15%, transparent 27%), radial-gradient(circle at 43% 42%, color-mix(in srgb, var(--voice-primary) 90%, white), var(--voice-primary) 36%, var(--voice-accent) 74%, rgba(8,9,24,.92) 122%); box-shadow:0 0 42px color-mix(in srgb, var(--voice-primary) 58%, transparent), 0 0 118px color-mix(in srgb, var(--voice-accent) 38%, transparent), inset -22px -32px 46px rgba(2,3,13,.45), inset 16px 13px 24px rgba(255,255,255,.18); }
    .voice-signal--supernova .voice-signal__corona { z-index:2; inset:5%; border-radius:50%; background:conic-gradient(from 90deg, transparent, color-mix(in srgb, var(--voice-primary) 42%, transparent), transparent 21%, color-mix(in srgb, var(--voice-accent) 48%, transparent), transparent 58%, color-mix(in srgb, white 34%, transparent), transparent); filter:blur(.5px); mask:radial-gradient(circle, transparent 49%, #000 51%, #000 58%, transparent 61%); animation:voice-corona-turn 5.8s linear infinite; opacity:.82; }
    .voice-signal--supernova .voice-signal__corona--two { inset:-3%; animation-duration:8.5s; animation-direction:reverse; opacity:.5; mask:radial-gradient(circle, transparent 55%, #000 57%, #000 61%, transparent 64%); }
    .voice-signal--supernova .voice-signal__ribbon { z-index:4; inset:8%; border-radius:50%; border:1px solid color-mix(in srgb, var(--voice-primary) 42%, transparent); transform:rotateX(68deg) rotateZ(20deg); box-shadow:0 0 22px color-mix(in srgb, var(--voice-primary) 26%, transparent); animation:voice-ribbon-one 4.8s ease-in-out infinite; opacity:.75; }
    .voice-signal--supernova .voice-signal__ribbon--two { border-color:color-mix(in srgb, var(--voice-accent) 46%, transparent); transform:rotateX(64deg) rotateZ(108deg); animation:voice-ribbon-two 5.4s ease-in-out infinite; opacity:.62; }
    .voice-signal--supernova .voice-signal__burst i { --angle:calc(var(--spark) * 20deg); position:absolute; top:50%; left:50%; width:1px; height:23%; transform-origin:50% 0; transform:rotate(var(--angle)) translateY(-58%); background:linear-gradient(180deg, rgba(255,255,255,.85), color-mix(in srgb, var(--voice-primary) 58%, transparent), transparent); filter:drop-shadow(0 0 8px var(--voice-primary)); opacity:.35; }
    .voice-signal--supernova.voice-signal--listening .voice-signal__core, .voice-signal--supernova.voice-signal--interrupted .voice-signal__core { animation:supernova-listen .86s ease-in-out infinite; }
    .voice-signal--supernova.voice-signal--listening .voice-signal__halo, .voice-signal--supernova.voice-signal--interrupted .voice-signal__halo { animation-duration:1.45s; }
    .voice-signal--supernova.voice-signal--listening .voice-signal__particles i, .voice-signal--supernova.voice-signal--interrupted .voice-signal__particles i { animation:supernova-particle 1.35s calc(var(--particle) * -0.09s) ease-in-out infinite; }
    .voice-signal--supernova.voice-signal--thinking .voice-signal__scan { opacity:.98; animation:supernova-scan 1.05s ease-in-out infinite; }
    .voice-signal--supernova.voice-signal--thinking .voice-signal__core { animation:supernova-think 1.12s ease-in-out infinite; }
    .voice-signal--supernova.voice-signal--thinking .voice-signal__burst { animation:supernova-burst-turn 4s linear infinite; opacity:.7; }
    .voice-signal--supernova.voice-signal--thinking .voice-signal__burst i { animation:supernova-ray 1.55s calc(var(--spark) * -0.04s) ease-in-out infinite; }
    .voice-signal--supernova.voice-signal--speaking .voice-signal__core { animation:supernova-speak .46s cubic-bezier(.2,.8,.2,1) infinite alternate; }
    .voice-signal--supernova.voice-signal--speaking .voice-signal__equalizer { opacity:1; }
    .voice-signal--supernova.voice-signal--speaking .voice-signal__equalizer i { animation:voice-equalize .48s ease-in-out infinite alternate; }
    .voice-signal--supernova.voice-signal--speaking .voice-signal__corona { animation-duration:2.5s; opacity:.95; }
    .voice-signal--supernova.voice-signal--speaking .voice-signal__burst { opacity:.82; animation:supernova-burst-turn 2.9s linear infinite; }
    .voice-signal--neural.voice-signal--listening .voice-signal__core, .voice-signal--neural.voice-signal--interrupted .voice-signal__core { animation:voice-listen .9s ease-in-out infinite; }
    .voice-signal--neural.voice-signal--listening .voice-signal__halo, .voice-signal--neural.voice-signal--interrupted .voice-signal__halo { animation-duration:1.8s; }
    .voice-signal--neural.voice-signal--thinking .voice-signal__scan { opacity:.95; animation:voice-scan 1.5s ease-in-out infinite; }
    .voice-signal--neural.voice-signal--thinking .voice-signal__core { animation:voice-think 1.35s ease-in-out infinite; }
    .voice-signal--neural.voice-signal--thinking .voice-signal__particles i { animation:voice-particle 1.8s calc(var(--particle) * -0.19s) ease-in-out infinite; }
    .voice-signal--neural.voice-signal--speaking .voice-signal__core { animation:voice-speak .52s ease-in-out infinite alternate; }
    .voice-signal--neural.voice-signal--speaking .voice-signal__equalizer { opacity:1; }
    .voice-signal--neural.voice-signal--speaking .voice-signal__equalizer i { animation:voice-equalize .54s ease-in-out infinite alternate; }
    .voice-signal--speaking .voice-signal__equalizer i:nth-child(2) { animation-delay:-.42s; } .voice-signal--speaking .voice-signal__equalizer i:nth-child(3) { animation-delay:-.17s; } .voice-signal--speaking .voice-signal__equalizer i:nth-child(4) { animation-delay:-.31s; } .voice-signal--speaking .voice-signal__equalizer i:nth-child(5) { animation-delay:-.08s; }
    .voice-signal--connecting .voice-signal__orbit { animation-duration:1.5s; } .voice-signal--connecting .voice-signal__scan { opacity:.7; animation:voice-scan .9s linear infinite; }
    .voice-signal--closing .voice-signal__core { animation:voice-closing .7s ease-in-out infinite alternate; }
    .voice-signal--error .voice-signal__core { filter:saturate(.28) brightness(.64); animation:none; } .voice-signal--error .voice-signal__orbit, .voice-signal--error .voice-signal__corona, .voice-signal--error .voice-signal__ribbon, .voice-signal--error .voice-signal__burst { animation:none; opacity:.18; }
    @keyframes voice-core-breathe { 0%,100% { transform:scale(1); } 50% { transform:scale(1.035); } }
    @keyframes voice-field-drift { 0%,100% { transform:scale(.95); opacity:.48; } 50% { transform:scale(1.08); opacity:.78; } }
    @keyframes voice-mesh-turn { to { transform:rotate(360deg); } }
    @keyframes voice-halo { 0% { transform:scale(.79); opacity:0; } 30% { opacity:.62; } 100% { transform:scale(1.2); opacity:0; } }
    @keyframes voice-orbit { to { transform:rotate(360deg); } }
    @keyframes voice-listen { 0%,100% { transform:scale(1); filter:brightness(1); } 50% { transform:scale(1.075); filter:brightness(1.19); } }
    @keyframes voice-think { 0%,100% { transform:scale(.98); filter:hue-rotate(0deg); } 50% { transform:scale(1.055); filter:hue-rotate(13deg) brightness(1.15); } }
    @keyframes voice-scan { 0% { transform:translateY(-3.8rem) scaleX(.6); opacity:0; } 25%,75% { opacity:1; } 100% { transform:translateY(3.8rem) scaleX(1); opacity:0; } }
    @keyframes voice-particle { 0%,100% { opacity:0; transform:rotate(var(--angle)) translateY(-4rem) scale(.35); } 50% { opacity:.9; transform:rotate(var(--angle)) translateY(-6.45rem) scale(1); } }
    @keyframes voice-speak { from { transform:scale(.97); filter:brightness(1); } to { transform:scale(1.09); filter:brightness(1.22); } }
    @keyframes voice-equalize { from { transform:scaleY(.35); } to { transform:scaleY(2.4); } }
    @keyframes voice-closing { from { transform:scale(.95); opacity:.7; } to { transform:scale(1.02); opacity:.95; } }
    @keyframes voice-corona-turn { to { transform:rotate(360deg); } }
    @keyframes voice-ribbon-one { 0%,100% { transform:rotateX(68deg) rotateZ(20deg) scale(.95); } 50% { transform:rotateX(64deg) rotateZ(198deg) scale(1.05); } }
    @keyframes voice-ribbon-two { 0%,100% { transform:rotateX(64deg) rotateZ(108deg) scale(1.03); } 50% { transform:rotateX(70deg) rotateZ(-82deg) scale(.95); } }
    @keyframes supernova-listen { 0%,100% { transform:scale(1); filter:brightness(1) saturate(1.08); } 45% { transform:scale(1.1); filter:brightness(1.25) saturate(1.2); } 68% { transform:scale(1.035); } }
    @keyframes supernova-think { 0%,100% { transform:scale(.98) rotate(0deg); filter:brightness(1) hue-rotate(0deg); } 50% { transform:scale(1.075) rotate(2deg); filter:brightness(1.24) hue-rotate(18deg); } }
    @keyframes supernova-speak { from { transform:scale(.96); filter:brightness(1.03) saturate(1.1); } to { transform:scale(1.13); filter:brightness(1.34) saturate(1.3); } }
    @keyframes supernova-scan { 0% { transform:translateY(-4.3rem) scaleX(.45); opacity:0; } 35%,70% { opacity:1; } 100% { transform:translateY(4.3rem) scaleX(1.18); opacity:0; } }
    @keyframes supernova-burst-turn { to { transform:rotate(360deg); } }
    @keyframes supernova-ray { 0%,100% { opacity:.14; height:18%; } 45% { opacity:.72; height:32%; } }
    @keyframes supernova-particle { 0%,100% { opacity:0; transform:rotate(var(--angle)) translateY(-4.6rem) scale(.35); } 48% { opacity:1; transform:rotate(var(--angle)) translateY(-6.85rem) scale(1.1); } }
    @media (prefers-reduced-motion:reduce) { .voice-signal *, .voice-signal { animation:none !important; } }
  `}</style>;
}

function VoicePicker({ value, open, setOpen, onChange }: { value: Voice; open: boolean; setOpen: (open: boolean) => void; onChange: (voice: Voice) => void }) {
  return <div className="relative w-full max-w-xs mx-auto"><button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl" style={{ backdropFilter: "blur(20px) saturate(180%)", background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)" }}><span className="flex items-center gap-3"><span className="w-7 h-7 rounded-full" style={{ backgroundColor: value.color }} /><span className="text-left"><span className="block text-sm font-semibold leading-none">{value.name}</span><span className="block text-[10px] text-gray-400 mt-0.5">{value.tagline}</span></span></span><ChevronDown size={16} className="text-gray-400" /></button>{open && <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50" style={{ backdropFilter: "blur(24px) saturate(200%)", background: "linear-gradient(135deg, rgba(20,20,40,0.92), rgba(10,10,25,0.96))", border: "1px solid rgba(255,255,255,0.14)" }}>{VOICES.map((item) => <button key={item.id} onClick={() => { onChange(item); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10"><span className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color }} /><span><span className="block text-sm font-medium leading-none">{item.name}</span><span className="block text-[10px] text-gray-400 mt-0.5">{item.tagline}</span></span></button>)}</div>}</div>;
}
