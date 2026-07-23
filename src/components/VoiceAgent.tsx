"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, ChevronDown, Power, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAIAudio, getVoiceAIResponse } from "@/app/actions";
import { getBrowserStorage } from "@/lib/browser-storage";
import { getVisitorContextHint } from "@/lib/visitor/visitor-engine";
import { useMeetingEngine } from "@/lib/meeting/meeting-engine";
import { extractMeetingFieldsAction } from "@/app/actions";
import { useVisitorIntelligence } from "@/lib/visitor/use-visitor-intelligence";

/* ─── Voice Agent Definitions ─────────────────────────────────────────── */
const VOICE_AGENTS = [
  {
    id: "quantum",
    name: "Quantum AI",
    tagline: "Deep & Calm",
    color: "#4A90D9",
    pitch: 0.78,
    rate: 0.88,
    greeting: "Hey. I'm Quantum AI, your guide to Prabhat's portfolio. What do you want to know?",
  },
  {
    id: "nova",
    name: "Nova",
    tagline: "Warm & Friendly",
    color: "#E91E8C",
    pitch: 1.22,
    rate: 1.05,
    greeting: "Hi there! I'm Nova. I'm warm, friendly, and totally ready to tell you all about Prabhat. Go ahead!",
  },
  {
    id: "sage",
    name: "Sage",
    tagline: "Wise & Measured",
    color: "#9B59B6",
    pitch: 0.68,
    rate: 0.82,
    greeting: "Greetings. I am Sage. I speak thoughtfully and precisely. How may I assist you today?",
  },
  {
    id: "aria",
    name: "Aria",
    tagline: "Energetic & Upbeat",
    color: "#FF6B35",
    pitch: 1.32,
    rate: 1.12,
    greeting: "Hey hey! Aria here! I'm energetic and upbeat. Super excited to help. Ask me anything!",
  },
  {
    id: "echo",
    name: "Echo",
    tagline: "Neutral & Clear",
    color: "#00BCD4",
    pitch: 1.0,
    rate: 1.0,
    greeting: "Hello. I'm Echo. I speak clearly and precisely. I'm here to answer your questions about Prabhat.",
  },
  {
    id: "orion",
    name: "Orion",
    tagline: "Young & Enthused",
    color: "#4CAF50",
    pitch: 1.08,
    rate: 1.08,
    greeting: "What's up! Orion here. I'm the young and enthusiastic one. Let's talk about Prabhat's projects!",
  },
  {
    id: "luna",
    name: "Luna",
    tagline: "Warm & Helpful",
    color: "#FFD700",
    pitch: 1.12,
    rate: 0.95,
    greeting: "Hi, I'm Luna. I'm warm, helpful, and multilingual. Tell me what language you prefer and let's chat!",
  },
] as const;

type Agent = (typeof VOICE_AGENTS)[number];

/* ─── Browser voice priority map ──────────────────────────────────────── */
const VOICE_PRIORITY: Record<string, string[]> = {
  quantum: ["Google UK English Male", "Microsoft George", "Daniel", "Alex"],
  nova: ["Google US English Female", "Microsoft Zira", "Samantha", "Victoria"],
  sage: ["Microsoft David", "Google UK English Male", "Daniel", "Arthur"],
  aria: ["Google US English Female", "Microsoft Cortana", "Victoria", "Karen"],
  echo: ["Karen", "Moira", "Google US English", "Microsoft Eva"],
  orion: ["Microsoft Mark", "Google US English Male", "Tom", "Fred"],
  luna: ["Google Hindi", "Microsoft Heera", "Google UK English Female", "Aditi"],
};

/* ─── Helper: pick best browser voice ─────────────────────────────────── */
function getBestBrowserVoice(agent: Agent): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const priorities = VOICE_PRIORITY[agent.id] ?? [];
  for (const name of priorities) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

/* ─── Helper: clean text for TTS ──────────────────────────────────────── */
function cleanForSpeech(text: string): string {
  return text
    .replace(/Prabhat/g, "Pra-bhaat")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/AWS/g, "A W S")
    .replace(/API/g, "A P I")
    .replace(/JWT/g, "J W T")
    .replace(/SQL/g, "S Q L")
    .replace(/UI/g, "U I")
    .replace(/UX/g, "U X");
}

/* ─── Helper: normalize speech-to-text transcript ─────────────────────── */
/**
 * Lightweight post-processing — corrects only mechanical SR artifacts and
 * known mis-recognitions for this domain.
 * Does NOT rewrite, summarize, or change meaning.
 */

// Ordered list of [pattern, replacement] pairs.
// Patterns are applied left-to-right; use word boundaries to avoid partial matches.
const SR_CORRECTIONS: [RegExp, string][] = [
  // ── Name: Prabhat ──────────────────────────────────────────────────────
  // Common SR outputs for "Prabhat": Prahart, Prabhat, Probhat, Prabhath,
  // Prabhath, Prabot, Parbhat, Prabhut, Prabhet, Prabat
  [/\bPra-?ha[rl]t\b/gi, "Prabhat"],
  [/\bProbhat\b/gi,      "Prabhat"],
  [/\bPrabhath\b/gi,     "Prabhat"],
  [/\bPrabot\b/gi,       "Prabhat"],
  [/\bParbhat\b/gi,      "Prabhat"],
  [/\bPrabhut\b/gi,      "Prabhat"],
  [/\bPrabhet\b/gi,      "Prabhat"],
  [/\bPrabat\b/gi,       "Prabhat"],
  [/\bPrahat\b/gi,       "Prabhat"],
  [/\bPrabha[td]\b/gi,   "Prabhat"],

  // ── Tech: Spring Boot / Spring ─────────────────────────────────────────
  [/\bspring\s+boot\b/gi,   "Spring Boot"],
  [/\bspringboot\b/gi,      "Spring Boot"],
  [/\bspring\s+book\b/gi,   "Spring Boot"],
  [/\bspring\s+but\b/gi,    "Spring Boot"],
  [/\bspring\s+bout\b/gi,   "Spring Boot"],
  [/\bspring\s+bought\b/gi, "Spring Boot"],

  // ── Tech: Microservices ────────────────────────────────────────────────
  [/\bmicro\s+services\b/gi, "microservices"],
  [/\bmicro-services\b/gi,   "microservices"],

  // ── Tech: Java / JavaScript / TypeScript ──────────────────────────────
  [/\bjava\s+script\b/gi,   "JavaScript"],
  [/\btype\s+script\b/gi,   "TypeScript"],
  [/\bjava\s+spring\b/gi,   "Java Spring"],

  // ── Tech: AWS / Cloud ─────────────────────────────────────────────────
  [/\ba\.?\s*w\.?\s*s\b/gi, "AWS"],
  [/\bamazon\s+web\s+services\b/gi, "AWS"],

  // ── Tech: Hibernate / Kafka / Docker ──────────────────────────────────
  [/\bhibernate\b/gi, "Hibernate"],
  [/\bkafka\b/gi,     "Kafka"],
  [/\bdocker\b/gi,    "Docker"],
  [/\bpostgres\b/gi,  "PostgreSQL"],
  [/\bpost\s+gres\b/gi, "PostgreSQL"],
  [/\bmy\s+sql\b/gi,  "MySQL"],
  [/\bmongo\s+db\b/gi, "MongoDB"],

  // ── Tech: APIs / JWT / REST ────────────────────────────────────────────
  [/\brest\s+api\b/gi,   "REST API"],
  [/\brest\s+apis\b/gi,  "REST APIs"],
  [/\bj\.?\s*w\.?\s*t\b/gi, "JWT"],
  [/\bjason\b/g,         "JSON"],   // "jason" is a common SR mishear for JSON

  // ── Tech: CI/CD / DevOps ──────────────────────────────────────────────
  [/\bci\s*\/\s*cd\b/gi, "CI/CD"],
  [/\bdev\s*ops\b/gi,    "DevOps"],

  // ── Projects / Products ───────────────────────────────────────────────
  [/\bcode\s+guard\b/gi,      "CodeGuard"],
  [/\bacquisition\s+os\b/gi,  "AcquisitionOS"],
  [/\bquantum\s+ai\b/gi,      "QuantumAI"],
  [/\bquantum\s+fusion\b/gi,  "QuantumFusion"],
  [/\bsystem\s+foundry\b/gi,  "SystemFoundry"],

  // ── Common filler / connector fixes ───────────────────────────────────
  // SR sometimes outputs "i" (lowercase) for the pronoun "I"
  [/(?<![a-zA-Z])\bi\b(?![a-zA-Z])/g, "I"],
];

function normalizeSpeechTranscript(text: string): string {
  let result = text
    // Collapse runs of whitespace
    .replace(/\s+/g, " ")
    // Remove accidental duplicate consecutive words (e.g. "the the")
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .trim();

  // Apply domain corrections
  for (const [pattern, replacement] of SR_CORRECTIONS) {
    result = result.replace(pattern, replacement);
  }

  // Capitalize first character
  result = result.replace(/^./, (c) => c.toUpperCase());

  return result;
}

/* ─── Props ────────────────────────────────────────────────────────────── */
interface VoiceAgentProps {
  isVisible: boolean;
  onClose: () => void;
  conversationHistory: Array<{ user: string; model: string }>;
  onAddMessage: (user: string, model: string) => void;
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  VoiceAgent Component                                                   */
/* ═══════════════════════════════════════════════════════════════════════ */
export const VoiceAgent = memo(function VoiceAgent({
  isVisible,
  onClose,
  conversationHistory,
  onAddMessage,
}: VoiceAgentProps) {
  type VoiceState =
    | "idle"
    | "requesting_permission"
    | "listening"
    | "thinking"
    | "speaking"
    | "error";

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(VOICE_AGENTS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastAI, setLastAI] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);

  /* ── Visitor Intelligence (Phase 7) — session-only, async, zero API calls ── */
  const { analyse: analyseVisitor, reset: resetVisitorProfile } = useVisitorIntelligence();

  /* refs so callbacks always see fresh values */
  const agentRef = useRef<Agent>(VOICE_AGENTS[0]);
  const isMounted = useRef(true);
  const stateRef = useRef<VoiceState>("idle");
  const finalTranscriptRef = useRef("");

  /* audio refs */
  const convAudioRef = useRef<HTMLAudioElement | null>(null); // conversation
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);
  const bargeInRecognitionRef = useRef<SpeechRecognition | null>(null); // background listening for barge-in
  
  /* cleanup tracking */
  const sessionActiveRef = useRef(true); // track if session is active
  const pendingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const engine = useMeetingEngine();
  const { profile } = useVisitorIntelligence(); // track setTimeout calls
  const conversationAbortRef = useRef<AbortController | null>(null); // abort conversation TTS
  const micPermissionGrantedRef = useRef(false); // skip re-requesting permission between turns

  /* keep refs in sync */
  useEffect(() => {
    agentRef.current = selectedAgent;
  }, [selectedAgent]);
  useEffect(() => {
    stateRef.current = voiceState;
  }, [voiceState]);

  /* load saved voice */
  useEffect(() => {
    const saved = getBrowserStorage()?.getItem("quantumai_selected_voice");
    if (saved) {
      const a = VOICE_AGENTS.find((x) => x.id === saved);
      if (a) {
        setSelectedAgent(a);
        agentRef.current = a;
      }
    }
  }, []);

  /* init voices list */
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /* cleanup on unmount */
  useEffect(() => {
    isMounted.current = true;
    sessionActiveRef.current = true;
    return () => {
      isMounted.current = false;
      sessionActiveRef.current = false;
      micPermissionGrantedRef.current = false;
      
      // Clear all pending timeouts
      pendingTimeoutsRef.current.forEach(t => clearTimeout(t));
      pendingTimeoutsRef.current = [];
      
      // Stop all audio playback
      stopAllAudio();
      
      // Stop speech recognition
      recognitionRef.current?.stop();
      
      // Stop barge-in listening
      stopBargeInListening();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Stop everything ─────────────────────────────────────────────── */
  const stopAllAudio = useCallback(() => {
    // Abort preview audio
    previewAbortRef.current?.abort();
    previewAbortRef.current = null;

    // Cancel browser speech synthesis immediately
    window.speechSynthesis.cancel();

    // Stop conversation audio playback
    if (convAudioRef.current) {
      convAudioRef.current.pause();
      convAudioRef.current.currentTime = 0;
      convAudioRef.current.src = "";
      convAudioRef.current.onplay = null;
      convAudioRef.current.onended = null;
      convAudioRef.current.onerror = null;
    }

    // Abort any pending conversation TTS requests
    conversationAbortRef.current?.abort();
    conversationAbortRef.current = null;
  }, []);

  /* ─── Instant browser-TTS preview (zero latency) ─────────────────── */
  /**
   * Uses ONLY the browser's built-in Web Speech API so the agent starts
   * speaking within <10 ms — no network call, no ElevenLabs, no Gemini.
   * Called the moment the user clicks a different agent card.
   */
  const speakPreviewInstantly = useCallback((agent: Agent) => {
    // Cancel whatever is speaking right now, immediately
    stopAllAudio();
    recognitionRef.current?.stop();

    const text = agent.greeting;
    if (!text.trim()) return;

    // Create abort controller for this preview session
    const abort = new AbortController();
    previewAbortRef.current = abort;

    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
    let index = 0;

    const speakNext = () => {
      if (abort.signal.aborted || !isMounted.current) return;
      if (index >= sentences.length) return;

      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      const voice = getBestBrowserVoice(agent);
      if (voice) utterance.voice = voice;
      utterance.pitch = agent.pitch;
      utterance.rate = agent.rate;
      utterance.volume = 1;

      utterance.onend = () => {
        index++;
        if (!abort.signal.aborted && isMounted.current) speakNext();
      };
      utterance.onerror = () => {
        index++;
        if (!abort.signal.aborted && isMounted.current) speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    // Register abort → cancel mid-speech
    abort.signal.addEventListener("abort", () => window.speechSynthesis.cancel(), {
      once: true,
    });

    window.speechSynthesis.cancel(); // hard-cancel any lingering utterance
    speakNext();
  }, [stopAllAudio]);

  /* ─── Select agent → instantly switch voice ───────────────────────── */
  const selectAgent = useCallback(
    (agent: Agent) => {
      setSelectedAgent(agent);
      agentRef.current = agent;
      getBrowserStorage()?.setItem("quantumai_selected_voice", agent.id);
      setDropdownOpen(false);
      // Instantly speak greeting of new agent (zero latency)
      speakPreviewInstantly(agent);
    },
    [speakPreviewInstantly]
  );

  /* ─── Background listening for barge-in (interruption) ──────────────── */
  const stopBargeInListening = useCallback(() => {
    if (bargeInRecognitionRef.current) {
      try {
        bargeInRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
      bargeInRecognitionRef.current = null;
    }
  }, []);

  const startBargeInListening = useCallback(() => {
    if (bargeInRecognitionRef.current) return; // Already listening

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    try {
      const rec = new SR() as SpeechRecognition;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-IN";

      // onspeechstart fires the moment the browser detects voice audio —
      // this is the earliest possible signal that the user is speaking.
      (rec as any).onspeechstart = () => {
        if (isMounted.current && sessionActiveRef.current && stateRef.current === "speaking") {
          // Stop assistant immediately
          stopAllAudio();
          bargeInRecognitionRef.current = null;
          try { rec.stop(); } catch { /* ignore */ }
          // Switch to main listening right away
          startListening();
        }
      };

      // Also catch any transcription result as a fallback barge-in trigger
      rec.onresult = () => {
        if (isMounted.current && sessionActiveRef.current && stateRef.current === "speaking") {
          stopAllAudio();
          bargeInRecognitionRef.current = null;
          try { rec.stop(); } catch { /* ignore */ }
          startListening();
        }
      };

      rec.onerror = () => {
        // Silently fail — don't interrupt main flow
        bargeInRecognitionRef.current = null;
      };

      rec.onend = () => {
        // Clear the ref so a fresh instance can be started if needed
        if (bargeInRecognitionRef.current === rec) {
          bargeInRecognitionRef.current = null;
        }
        // Restart only if the assistant is still speaking
        if (
          isMounted.current &&
          sessionActiveRef.current &&
          stateRef.current === "speaking"
        ) {
          // Small delay to avoid rapid restart loops
          setTimeout(() => {
            if (
              isMounted.current &&
              sessionActiveRef.current &&
              stateRef.current === "speaking" &&
              !bargeInRecognitionRef.current
            ) {
              startBargeInListening();
            }
          }, 100);
        }
      };

      rec.start();
      bargeInRecognitionRef.current = rec;
    } catch {
      // Silently handle errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopAllAudio, stopBargeInListening]);

  /* ─── Natural TTS for conversation responses (ElevenLabs → browser) ── */
  const speakNaturallyForConversation = useCallback(
    async (text: string, agent: Agent, onEnd?: () => void) => {
      const cleaned = cleanForSpeech(text);
      if (!cleaned.trim()) {
        onEnd?.();
        return;
      }

      console.log(`[VoiceAgent] Selected agent: ${agent.name} (id: ${agent.id})`);

      stopAllAudio();

      // Create abort controller for this conversation TTS
      const abort = new AbortController();
      conversationAbortRef.current = abort;

      // Check session is still active before making request
      if (!sessionActiveRef.current || !isMounted.current) {
        abort.abort();
        return;
      }

      // ── Try ElevenLabs ──────────────────────────────────────────────
      console.log(`[VoiceAgent] ElevenLabs request started for agent "${agent.id}"`);
      let elevenLabsSucceeded = false;

      try {
        const res = await getAIAudio(cleaned, agent.id);

        // Check abort / session after async call
        if (abort.signal.aborted || !sessionActiveRef.current || !isMounted.current) {
          return;
        }

        console.log(`[VoiceAgent] ElevenLabs response received — success: ${res.success}, has audio: ${!!res.audio}`);

        if (res.success && res.audio) {
          const audio = new Audio(res.audio);
          convAudioRef.current = audio;

          audio.onplay = () => {
            console.log('[VoiceAgent] ElevenLabs audio playback started');
            if (isMounted.current && sessionActiveRef.current) {
              setVoiceState("speaking");
              startBargeInListening();
            }
          };

          audio.onended = () => {
            stopBargeInListening();
            if (isMounted.current && sessionActiveRef.current) {
              onEnd?.();
            }
          };

          audio.onerror = (e) => {
            console.error('[VoiceAgent] ElevenLabs audio element error:', e);
            stopBargeInListening();
            if (sessionActiveRef.current && isMounted.current) {
              console.warn('[VoiceAgent] Browser fallback triggered (audio element error)');
              speakWithBrowser(cleaned, agent, onEnd);
            }
          };

          try {
            await audio.play();
            // play() resolved — ElevenLabs is working
            elevenLabsSucceeded = true;
            return;
          } catch (playError) {
            console.error('[VoiceAgent] audio.play() rejected:', playError);
            // play() failed — fall through to browser TTS below
          }
        } else {
          console.warn(`[VoiceAgent] ElevenLabs returned no audio (message: ${res.message}) — will use browser fallback`);
        }
      } catch (fetchError) {
        console.error('[VoiceAgent] ElevenLabs fetch/network error:', fetchError);
      }

      // ── Browser TTS fallback ────────────────────────────────────────
      if (!elevenLabsSucceeded && !abort.signal.aborted && sessionActiveRef.current && isMounted.current) {
        console.warn('[VoiceAgent] Browser fallback triggered');
        speakWithBrowser(cleaned, agent, onEnd);
      }
    },
    [stopAllAudio, startBargeInListening, stopBargeInListening]
  );

  const speakWithBrowser = (
    text: string,
    agent: Agent,
    onEnd?: () => void
  ) => {
    if (!isMounted.current || !sessionActiveRef.current) return;
    console.log(`[VoiceAgent] speakWithBrowser called for agent "${agent.name}"`);
    window.speechSynthesis.cancel();

    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
    let index = 0;

    const speakNext = () => {
      // Exit if session ended or component unmounted
      if (!isMounted.current || !sessionActiveRef.current) return;
      if (index >= sentences.length) {
        onEnd?.();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      const voice = getBestBrowserVoice(agent);
      if (voice) utterance.voice = voice;
      utterance.pitch = agent.pitch;
      utterance.rate = agent.rate;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        if (isMounted.current && sessionActiveRef.current) {
          setVoiceState("speaking");
          // Start background listening for barge-in detection
          startBargeInListening();
        }
      };
      
      utterance.onend = () => {
        index++;
        if (isMounted.current && sessionActiveRef.current) {
          stopBargeInListening();
          setTimeout(speakNext, 200);
        }
      };
      
      utterance.onerror = (e) => {
        console.error("[VoiceAgent] utterance error", e);
        index++;
        if (isMounted.current && sessionActiveRef.current) {
          stopBargeInListening();
          speakNext();
        }
      };
      
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  /* ─── Microphone / speech recognition ────────────────────────────── */
  const startListening = useCallback(async () => {
    if (!isMounted.current || !sessionActiveRef.current) return;

    // Prevent concurrent recognition instances — if already listening, do nothing
    if (stateRef.current === "listening") return;

    stopAllAudio();

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceState("error");
      setTranscript(
        "Speech recognition is not supported. Please use Chrome or Edge."
      );
      return;
    }

    recognitionRef.current?.stop();

    // Only request mic permission once per session — re-requesting between turns
    // adds 200-500ms latency and causes a jarring "requesting_permission" flash
    if (!micPermissionGrantedRef.current) {
      try {
        setVoiceState("requesting_permission");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        micPermissionGrantedRef.current = true;
      } catch {
        if (isMounted.current && sessionActiveRef.current) {
          setVoiceState("error");
          setTranscript("Microphone permission blocked. Please allow access.");
        }
        return;
      }
    }

    // Exit if session ended while waiting
    if (!sessionActiveRef.current || !isMounted.current) return;

    const rec = new SR() as SpeechRecognition;
    rec.continuous = true;
    rec.interimResults = true;
    // en-US has significantly better acoustic model coverage (including Indian
    // English) than en-IN for technical vocabulary and natural conversational speech
    rec.lang = "en-US";
    finalTranscriptRef.current = "";

    // Silence-hold timer: wait this long after the last final result before
    // committing. Prevents cutting the user off mid-sentence during brief pauses.
    const SILENCE_HOLD_MS = 1200;
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let speechHandled = false;

    const clearSilenceTimer = () => {
      if (silenceTimer !== null) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    };

    const commitSpeech = () => {
      clearSilenceTimer();
      if (speechHandled) return;
      const final = finalTranscriptRef.current.trim();
      if (!final) return;
      console.log('[VoiceAgent] Final transcript committed:', final);
      speechHandled = true;
      try { rec.stop(); } catch { /* ignore */ }
      handleUserSpeech(normalizeSpeechTranscript(final));
    };

    rec.onstart = () => {
      console.log('[VoiceAgent] SR started');
      if (isMounted.current && sessionActiveRef.current) {
        if (stateRef.current === "speaking") {
          stopAllAudio();
        }
        setVoiceState("listening");
        setTranscript("");
      }
    };

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      const display = (finalTranscriptRef.current + " " + interim).trim();
      setTranscript(display);
      console.log(`[VoiceAgent] SR interim: "${display}"`);

      // Every time we get a new final result, reset the silence hold timer.
      // This prevents committing while the user is still speaking — only commit
      // after SILENCE_HOLD_MS of no new final results.
      if (e.results[e.results.length - 1].isFinal) {
        clearSilenceTimer();
        silenceTimer = setTimeout(commitSpeech, SILENCE_HOLD_MS);
      }
    };

    // onspeechend fires when the browser's VAD detects end-of-speech.
    // Use it to shorten the silence hold to 400ms — the user clearly stopped.
    (rec as any).onspeechend = () => {
      console.log('[VoiceAgent] End-of-speech detected');
      if (!speechHandled && finalTranscriptRef.current.trim()) {
        clearSilenceTimer();
        silenceTimer = setTimeout(commitSpeech, 400);
      }
    };

    rec.onerror = (e) => {
      if (!isMounted.current || !sessionActiveRef.current) return;
      clearSilenceTimer();
      console.warn('[VoiceAgent] SR error:', e.error);
      if (e.error === "aborted") return;
      if (e.error === "no-speech") {
        if (isMounted.current && sessionActiveRef.current) {
          setVoiceState("idle");
          const t = setTimeout(startListening, 800);
          pendingTimeoutsRef.current.push(t);
        }
        return;
      }
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setVoiceState("error");
        setTranscript("Microphone blocked. Please allow access.");
        return;
      }
      setVoiceState("error");
      setTranscript(`Voice error: ${e.error}`);
    };

    rec.onend = () => {
      console.log('[VoiceAgent] SR ended, speechHandled:', speechHandled);
      clearSilenceTimer();
      // If we have accumulated final text that wasn't committed yet, commit now
      if (!speechHandled && finalTranscriptRef.current.trim() && isMounted.current && sessionActiveRef.current) {
        handleUserSpeech(normalizeSpeechTranscript(finalTranscriptRef.current.trim()));
        return;
      }
      // If nothing was heard, auto-restart
      if (!speechHandled && isMounted.current && sessionActiveRef.current && stateRef.current === "listening") {
        const t = setTimeout(startListening, 800);
        pendingTimeoutsRef.current.push(t);
      }
    };

    try {
      rec.start();
      recognitionRef.current = rec;
    } catch (e) {
      console.error("[VoiceAgent] rec.start error", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopAllAudio]);

  /* ─── Handle user speech → AI → TTS → listen again ──────────────── */
  const handleUserSpeech = async (input: string) => {
    if (!input.trim() || !isMounted.current || !sessionActiveRef.current) return;
    setVoiceState("thinking");
    setTranscript(input);

    try {
      const isCollecting = engine.session && engine.session.state === 'collecting';
      let meetingContext = undefined;
      const isMeetingLikely = profile.meetingProbability > 60 || profile.meetingSignalDetected;
      
      if (!isCollecting && isMeetingLikely) {
         meetingContext = "Visitor Intelligence indicates this user might want a meeting. Proactively and politely suggest they can schedule a meeting with Prabhat if they'd like. Keep it natural.";
      }
      
      if (isCollecting) {
         // Extract fields from user message
         const extraction = await extractMeetingFieldsAction(input, engine.data);
         if (extraction.success && extraction.data) {
           Object.entries(extraction.data).forEach(([key, val]) => {
             if (val) engine.setField(key as any, val);
           });
         }
         
         const remaining = engine.getRemainingFields();
         if (remaining.length > 0) {
           const nextMsg = engine.nextQuestion();
           meetingContext = `The user is scheduling a meeting. You must ask them for their missing info ONE BY ONE.
           Remaining missing fields: ${remaining.join(", ")}.
           Next question to ask: "${nextMsg}".
           Acknowledge their answer briefly, then ask the next question naturally (spoken style).`;
         } else {
           meetingContext = `The user just provided the last piece of information!
           All fields collected. Tell the user you've got everything and the meeting request is ready to confirm on their screen.`;
         }
      }

      const result = await getVoiceAIResponse(
        input,
        conversationHistory,
        agentRef.current.id,
        undefined, // visitorContext
        meetingContext
      );

      // Check session is still active after async call
      if (!sessionActiveRef.current || !isMounted.current) return;

      if (result.success && result.answer) {
        const answer = result.answer as string;
        setLastAI(answer);
        onAddMessage(input, answer);

        // Update visitor intelligence asynchronously — no UI impact
        analyseVisitor(input, conversationHistory.flatMap(h => [
          { role: "user" as const, content: h.user },
          { role: "model" as const, content: h.model },
        ]));

        speakNaturallyForConversation(answer, agentRef.current, () => {
          if (isMounted.current && sessionActiveRef.current) {
            setVoiceState("idle");
            const timeout = setTimeout(startListening, 600);
            pendingTimeoutsRef.current.push(timeout);
          }
        });
      } else {
        const fallback =
          result.message ?? "Sorry, I'm having trouble connecting right now.";
        speakWithBrowser(cleanForSpeech(fallback), agentRef.current, () => {
          if (isMounted.current && sessionActiveRef.current) {
            setVoiceState("idle");
            const t = setTimeout(startListening, 600);
            pendingTimeoutsRef.current.push(t);
          }
        });
      }
    } catch {
      if (!sessionActiveRef.current || !isMounted.current) return;
      const fallback = "Sorry, something went wrong. Please try again.";
      speakWithBrowser(cleanForSpeech(fallback), agentRef.current, () => {
        if (isMounted.current && sessionActiveRef.current) {
          setVoiceState("idle");
          const t = setTimeout(startListening, 600);
          pendingTimeoutsRef.current.push(t);
        }
      });
    }
  };

  /* ─── Start session ───────────────────────────────────────────────── */
  const startSession = () => {
    sessionActiveRef.current = true;
    setSessionStarted(true);

    // Unlock browser autoplay policy — must happen synchronously inside a
    // user gesture. Without this, audio.play() is rejected with NotAllowedError
    // after the async LLM + ElevenLabs pipeline completes, because the browser
    // no longer considers that call to be within a user-initiated context.
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      src.onended = () => ctx.close();
    } catch {
      // Non-fatal — best effort unlock
    }

    // Use browser TTS for greeting (instant, no ElevenLabs wait)
    speakPreviewInstantly(agentRef.current);
    // After greeting, start listening — rough estimate based on word count
    const greetingWords = agentRef.current.greeting.split(" ").length;
    const estimatedMs = Math.max(2000, (greetingWords / agentRef.current.rate) * 500);
    const timeout = setTimeout(() => {
      if (isMounted.current && sessionActiveRef.current) {
        setVoiceState("idle");
        startListening();
      }
    }, estimatedMs);
    pendingTimeoutsRef.current.push(timeout);
  };

  /* ─── Mic toggle ──────────────────────────────────────────────────── */
  const toggleMic = () => {
    if (voiceState === "speaking") {
      // Barge-in: user wants to interrupt, stop speaking and start listening
      stopAllAudio();
      startListening();
    } else if (voiceState === "listening") {
      recognitionRef.current?.stop();
      setVoiceState("idle");
    } else {
      startListening();
    }
  };

  /* ─── Close ───────────────────────────────────────────────────────── */
  const handleClose = () => {
    // Mark session as inactive immediately
    sessionActiveRef.current = false;
    micPermissionGrantedRef.current = false;
    
    // Clear all pending timeouts
    pendingTimeoutsRef.current.forEach(t => clearTimeout(t));
    pendingTimeoutsRef.current = [];
    
    // Stop all audio playback immediately
    stopAllAudio();
    
    // Stop speech recognition
    recognitionRef.current?.stop();
    
    // Stop barge-in listening
    stopBargeInListening();
    
    // Reset state
    setSessionStarted(false);
    setVoiceState("idle");
    setDropdownOpen(false);
    resetVisitorProfile();
    
    // Notify parent to close
    onClose();
  };

  /* ─── Derived UI values ───────────────────────────────────────────── */
  const stateLabel: Record<VoiceState, string> = {
    idle: "Ready to chat",
    requesting_permission: "Requesting microphone…",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
    error: "Voice needs attention",
  };

  const orbColors: Record<VoiceState, string> = {
    idle: "radial-gradient(circle at 30% 30%, #4a90d9, #1e3a8a)",
    requesting_permission: "radial-gradient(circle at 30% 30%, #6366f1, #1e3a8a)",
    listening: "radial-gradient(circle at 30% 30%, #3b82f6, #0ea5e9)",
    thinking: "conic-gradient(from 0deg, #1e3a8a, #9333ea, #1e3a8a)",
    speaking: "radial-gradient(circle at 30% 30%, #06b6d4, #1e3a8a)",
    error: "radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)",
  };

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1010] flex flex-col items-center justify-center bg-neutral-950/70 backdrop-blur-2xl text-white overflow-y-auto"
        >
          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-white/10 text-white"
            >
              <X size={24} />
            </Button>
          </div>

          {/* ── Pre-session ── */}
          {!sessionStarted ? (
            <PreSession
              selectedAgent={selectedAgent}
              onStart={startSession}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              onSelectAgent={selectAgent}
            />
          ) : (
            /* ── Active session ── */
            <ActiveSession
              voiceState={voiceState}
              selectedAgent={selectedAgent}
              transcript={transcript}
              lastAI={lastAI}
              stateLabel={stateLabel}
              orbColors={orbColors}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              onSelectAgent={selectAgent}
              onToggleMic={toggleMic}
              onClose={handleClose}
            />
          )}

          <VoiceStyles />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Pre-Session Screen                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */
function PreSession({
  selectedAgent,
  onStart,
  dropdownOpen,
  setDropdownOpen,
  onSelectAgent,
}: {
  selectedAgent: Agent;
  onStart: () => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  onSelectAgent: (a: Agent) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 sm:gap-8 text-center px-4 sm:px-6 max-w-xs sm:max-w-sm w-full">
      {/* Orb preview */}
      <div
        className="w-16 h-16 sm:w-24 sm:h-24 rounded-full animate-[orb-pulse_3s_infinite_ease-in-out] shadow-2xl shadow-blue-500/40 flex-shrink-0"
        style={{
          background: "radial-gradient(circle at 30% 30%, #4a90d9, #1e3a8a)",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
      </div>

      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Voice Mode</h2>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          Talk naturally to QuantumAI about Prabhat's skills, experience &amp; projects.
        </p>

        {/* Agent Dropdown */}
        <VoiceDropdown
          selectedAgent={selectedAgent}
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          onSelect={onSelectAgent}
        />

        <Button
          size="lg"
          onClick={onStart}
          className="mt-4 sm:mt-6 rounded-full px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold gap-2 sm:gap-3 shadow-xl shadow-primary/20 w-full sm:w-auto"
        >
          <Power size={16} />
          Start Conversation
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  AI Core — 5-layer cinematic procedural visualization                   */
/* ═══════════════════════════════════════════════════════════════════════ */
function AICore({ voiceState, agentColor }: { voiceState: string; agentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef2 = useRef(voiceState);
  const rafRef = useRef<number>(0);

  useEffect(() => { stateRef2.current = voiceState; }, [voiceState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 280;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const BASE_R = 62; // core sphere radius

    // Parse hex color → rgb
    const hex = agentColor.replace("#", "");
    const CR = parseInt(hex.slice(0, 2), 16);
    const CG = parseInt(hex.slice(2, 4), 16);
    const CB = parseInt(hex.slice(4, 6), 16);

    // ── Interpolated state targets (lerp coefficient 0.08) ──────────────
    // Each property smoothly interpolates toward its state target.
    const interp = {
      breathAmp:    0.04,   // idle
      breathFreq:   1.5,    // Hz
      ringSpeed:    1.0,    // multiplier on rotation
      particleSpeed:1.0,
      glowAlpha:    0.18,
      waveFreqA:    4,      // primary ring wave frequency
      waveFreqB:    6,      // mid ring wave frequency
      waveFreqC:    3,      // inner ring wave frequency
      waveAmpA:     0.06,
      waveAmpB:     0.05,
      waveAmpC:     0.04,
      nodeRadius:   5,      // core node size
      nodeGlow:     0.6,
      particleCount:14,
      particleAlpha:0.4,
    };

    // State target configs
    const STATE_TARGETS: Record<string, typeof interp> = {
      idle: {
        breathAmp: 0.03, breathFreq: 1.5, ringSpeed: 1.0, particleSpeed: 1.0,
        glowAlpha: 0.15, waveFreqA: 4, waveFreqB: 6, waveFreqC: 3,
        waveAmpA: 0.05, waveAmpB: 0.04, waveAmpC: 0.03,
        nodeRadius: 4, nodeGlow: 0.5, particleCount: 14, particleAlpha: 0.3,
      },
      requesting_permission: {
        breathAmp: 0.04, breathFreq: 2, ringSpeed: 1.2, particleSpeed: 1.2,
        glowAlpha: 0.20, waveFreqA: 5, waveFreqB: 7, waveFreqC: 4,
        waveAmpA: 0.06, waveAmpB: 0.05, waveAmpC: 0.04,
        nodeRadius: 5, nodeGlow: 0.6, particleCount: 16, particleAlpha: 0.4,
      },
      listening: {
        breathAmp: 0.06, breathFreq: 3.0, ringSpeed: 1.5, particleSpeed: 1.5,
        glowAlpha: 0.30, waveFreqA: 6, waveFreqB: 8, waveFreqC: 4,
        waveAmpA: 0.10, waveAmpB: 0.08, waveAmpC: 0.06,
        nodeRadius: 6, nodeGlow: 0.8, particleCount: 20, particleAlpha: 0.55,
      },
      thinking: {
        breathAmp: 0.05, breathFreq: 4.5, ringSpeed: 3.5, particleSpeed: 2.2,
        glowAlpha: 0.28, waveFreqA: 12, waveFreqB: 24, waveFreqC: 8,
        waveAmpA: 0.14, waveAmpB: 0.12, waveAmpC: 0.10,
        nodeRadius: 5, nodeGlow: 0.9, particleCount: 28, particleAlpha: 0.7,
      },
      speaking: {
        breathAmp: 0.11, breathFreq: 5.0, ringSpeed: 2.0, particleSpeed: 2.0,
        glowAlpha: 0.42, waveFreqA: 8, waveFreqB: 14, waveFreqC: 5,
        waveAmpA: 0.18, waveAmpB: 0.15, waveAmpC: 0.11,
        nodeRadius: 10, nodeGlow: 1.0, particleCount: 24, particleAlpha: 0.65,
      },
      error: {
        breathAmp: 0.03, breathFreq: 1.0, ringSpeed: 0.5, particleSpeed: 0.5,
        glowAlpha: 0.12, waveFreqA: 3, waveFreqB: 4, waveFreqC: 2,
        waveAmpA: 0.03, waveAmpB: 0.02, waveAmpC: 0.02,
        nodeRadius: 3, nodeGlow: 0.3, particleCount: 8, particleAlpha: 0.2,
      },
    };

    const LERP = 0.08;
    function lerp(a: number, b: number) { return a + (b - a) * LERP; }

    // Particles — fixed pool of 30, visibility gated by particleCount
    const MAX_P = 30;
    type Particle = {
      angle: number; baseRadius: number; speed: number;
      size: number; alpha: number; alphaDir: number; drift: number; driftPhase: number;
    };
    const particles: Particle[] = Array.from({ length: MAX_P }, (_, i) => ({
      angle: (i / MAX_P) * Math.PI * 2 + Math.random() * 0.4,
      baseRadius: BASE_R * (1.55 + Math.random() * 0.9),
      speed: (0.0004 + Math.random() * 0.0006) * (Math.random() > 0.5 ? 1 : -1),
      size: 0.8 + Math.random() * 1.2,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      drift: Math.random() * 0.018 + 0.006,
      driftPhase: Math.random() * Math.PI * 2,
    }));

    // Computational ring rotation angles
    let innerRingAngle = 0;
    let outerRingAngle = 0;

    let lastT = 0;

    function draw(t: number) {
      const dt = t - lastT;
      lastT = t;

      ctx!.clearRect(0, 0, SIZE, SIZE);

      // Lerp interp toward current state target
      const target = STATE_TARGETS[stateRef2.current] ?? STATE_TARGETS.idle;
      for (const key of Object.keys(interp) as (keyof typeof interp)[]) {
        (interp as any)[key] = lerp((interp as any)[key], (target as any)[key]);
      }

      const ts = t * 0.001; // time in seconds
      const breathe = 1 + Math.sin(ts * interp.breathFreq * Math.PI * 2) * interp.breathAmp;
      const R = BASE_R * breathe;

      // ── LAYER 1: Deep Volumetric Nebula Glow ──────────────────────────
      // Multi-stop radial that breathes from inside out
      const nebulaR = R * 3.2;
      const nebula = ctx!.createRadialGradient(CX, CY, 0, CX, CY, nebulaR);
      const ga = interp.glowAlpha;
      nebula.addColorStop(0,    `rgba(${CR},${CG},${CB},${ga})`);
      nebula.addColorStop(0.25, `rgba(${CR},${CG},${CB},${ga * 0.6})`);
      nebula.addColorStop(0.55, `rgba(${CR},${CG},${CB},${ga * 0.2})`);
      nebula.addColorStop(1,    `rgba(0,0,0,0)`);
      ctx!.globalCompositeOperation = "screen";
      ctx!.beginPath();
      ctx!.arc(CX, CY, nebulaR, 0, Math.PI * 2);
      ctx!.fillStyle = nebula;
      ctx!.fill();
      ctx!.globalCompositeOperation = "source-over";

      // ── LAYER 2: Computational Rings (counter-rotating dashed) ────────
      // Rotation speed driven by interp.ringSpeed
      const rotStep = dt * 0.0004 * interp.ringSpeed;
      innerRingAngle -= rotStep;        // counter-clockwise
      outerRingAngle += rotStep * 0.6;  // clockwise, slower

      const compRingAlpha = 0.18 + interp.glowAlpha * 0.4;

      // Inner dashed ring — fine dashes
      const innerR = R * 1.62;
      ctx!.save();
      ctx!.translate(CX, CY);
      ctx!.rotate(innerRingAngle);
      ctx!.beginPath();
      ctx!.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${CR},${CG},${CB},${compRingAlpha})`;
      ctx!.lineWidth = 0.7;
      ctx!.setLineDash([3, 6]);
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.restore();

      // Outer dashed ring — wide segments
      const outerR = R * 2.05;
      ctx!.save();
      ctx!.translate(CX, CY);
      ctx!.rotate(outerRingAngle);
      ctx!.beginPath();
      ctx!.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${CR},${CG},${CB},${compRingAlpha * 0.7})`;
      ctx!.lineWidth = 0.5;
      ctx!.setLineDash([12, 18]);
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.restore();

      // ── LAYER 3: Living Core Lattice — 3 wave rings ───────────────────
      // Each ring is a sine-wave path drawn as a polyline
      const drawWaveRing = (
        radius: number, freq: number, amp: number,
        phaseOffset: number, lineW: number,
        r2: number, g2: number, b2: number, alpha: number
      ) => {
        const STEPS = 180;
        ctx!.beginPath();
        for (let s = 0; s <= STEPS; s++) {
          const angle = (s / STEPS) * Math.PI * 2;
          const wave = 1 + Math.sin(angle * freq + ts * 2.5 + phaseOffset) * amp
                         + Math.sin(angle * freq * 0.5 + ts * 1.8 + phaseOffset * 1.3) * amp * 0.4;
          const rr = radius * wave * breathe;
          const x = CX + Math.cos(angle) * rr;
          const y = CY + Math.sin(angle) * rr;
          s === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        ctx!.closePath();
        ctx!.strokeStyle = `rgba(${r2},${g2},${b2},${alpha})`;
        ctx!.lineWidth = lineW;
        ctx!.stroke();
      };

      // Primary ring — light sapphire (#7EC8E3 ≈ 126,200,227)
      drawWaveRing(R * 1.32, interp.waveFreqA, interp.waveAmpA,
        0, 1.1, 126, 200, 227, 0.65);
      // Mid ring — deep cobalt (#1B3A8C ≈ 27,58,140 → brighten for visibility)
      drawWaveRing(R * 1.55, interp.waveFreqB, interp.waveAmpB,
        Math.PI / 3, 0.75, 80, 140, 220, 0.45);
      // Inner ring — ultraviolet/purple (#9B59B6 ≈ 155,89,182)
      drawWaveRing(R * 1.15, interp.waveFreqC, interp.waveAmpC,
        Math.PI * 0.7, 0.55, 155, 89, 182, 0.38);

      // ── LAYER 5: Quantum Microparticles ───────────────────────────────
      // Draw before core so they appear behind the sphere
      const visCount = Math.round(interp.particleCount);
      for (let i = 0; i < visCount; i++) {
        const p = particles[i];
        p.angle += p.speed * interp.particleSpeed;
        p.alpha += p.alphaDir * 0.012;
        if (p.alpha >= 1) { p.alpha = 1; p.alphaDir = -1; }
        if (p.alpha <= 0) { p.alpha = 0; p.alphaDir = 1; }
        // Sine-wave drift offset for independent feel
        const driftOffset = Math.sin(ts * p.drift * 6 + p.driftPhase) * BASE_R * 0.12;
        const r2 = p.baseRadius * breathe + driftOffset;
        const px = CX + Math.cos(p.angle) * r2;
        const py = CY + Math.sin(p.angle) * r2;
        // Sharp bright point
        ctx!.beginPath();
        ctx!.arc(px, py, p.size * (0.7 + 0.3 * p.alpha), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${p.alpha * interp.particleAlpha})`;
        ctx!.fill();
      }

      // ── Core sphere (drawn after particles so it occludes them) ───────
      const sphere = ctx!.createRadialGradient(
        CX - R * 0.28, CY - R * 0.3, R * 0.04, CX, CY, R
      );
      const s = stateRef2.current;
      if (s === "listening") {
        sphere.addColorStop(0, `rgba(${Math.min(CR+70,255)},${Math.min(CG+70,255)},255,1)`);
        sphere.addColorStop(0.5, `rgba(${CR},${CG},${Math.min(CB+50,255)},1)`);
        sphere.addColorStop(1, `rgba(${Math.max(CR-50,0)},${Math.max(CG-50,0)},${Math.max(CB-30,0)},1)`);
      } else if (s === "thinking") {
        sphere.addColorStop(0, `rgba(${Math.min(CR+30,255)},${Math.min(CG+90,255)},${Math.min(CB+90,255)},1)`);
        sphere.addColorStop(0.5, `rgba(${CR},${Math.max(CG-10,0)},${Math.min(CB+70,255)},1)`);
        sphere.addColorStop(1, `rgba(${Math.max(CR-40,0)},${Math.max(CG-40,0)},${Math.max(CB-20,0)},1)`);
      } else if (s === "speaking") {
        sphere.addColorStop(0, `rgba(${Math.min(CR+90,255)},${Math.min(CG+100,255)},255,1)`);
        sphere.addColorStop(0.4, `rgba(${CR},${CG},${Math.min(CB+60,255)},1)`);
        sphere.addColorStop(1, `rgba(${Math.max(CR-55,0)},${Math.max(CG-55,0)},${Math.max(CB-35,0)},1)`);
      } else {
        sphere.addColorStop(0, `rgba(${Math.min(CR+55,255)},${Math.min(CG+55,255)},${Math.min(CB+55,255)},1)`);
        sphere.addColorStop(0.5, `rgba(${CR},${CG},${CB},1)`);
        sphere.addColorStop(1, `rgba(${Math.max(CR-65,0)},${Math.max(CG-65,0)},${Math.max(CB-45,0)},1)`);
      }
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, Math.PI * 2);
      ctx!.fillStyle = sphere;
      ctx!.fill();

      // Specular highlight
      const spec = ctx!.createRadialGradient(
        CX - R * 0.3, CY - R * 0.33, 0,
        CX - R * 0.3, CY - R * 0.33, R * 0.55
      );
      spec.addColorStop(0, "rgba(255,255,255,0.38)");
      spec.addColorStop(0.5, "rgba(255,255,255,0.07)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, Math.PI * 2);
      ctx!.fillStyle = spec;
      ctx!.fill();

      // Thinking — internal lattice swirl
      if (s === "thinking" || s === "speaking") {
        const lines = s === "speaking" ? 7 : 5;
        for (let i = 0; i < lines; i++) {
          const a1 = (ts * (s === "speaking" ? 0.55 : 0.4) + i / lines) * Math.PI * 2;
          const a2 = a1 + Math.PI * (s === "speaking" ? 0.7 : 0.55);
          ctx!.beginPath();
          ctx!.moveTo(CX + Math.cos(a1) * R * 0.5, CY + Math.sin(a1) * R * 0.5);
          ctx!.lineTo(CX + Math.cos(a2) * R * 0.5, CY + Math.sin(a2) * R * 0.5);
          ctx!.strokeStyle = `rgba(255,255,255,${0.10 + 0.07 * Math.sin(ts * 2.5 + i)})`;
          ctx!.lineWidth = 0.7;
          ctx!.stroke();
        }
      }

      // Listening — inward convergence ripples
      if (s === "listening") {
        for (let i = 0; i < 3; i++) {
          const phase = ((ts * 1.2 + i * 0.33) % 1);
          const rr = R * (1 + (1 - phase) * 0.85);
          ctx!.beginPath();
          ctx!.arc(CX, CY, rr, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${CR},${CG},${CB},${(1 - phase) * 0.3})`;
          ctx!.lineWidth = 1.0;
          ctx!.stroke();
        }
      }

      // ── LAYER 4: Precision Core Node ──────────────────────────────────
      const nodeR = interp.nodeRadius;
      // Outer aura
      const nodeGlow = ctx!.createRadialGradient(CX, CY, 0, CX, CY, nodeR * 4.5);
      nodeGlow.addColorStop(0, `rgba(255,255,255,${interp.nodeGlow * 0.9})`);
      nodeGlow.addColorStop(0.3, `rgba(${CR},${CG},${CB},${interp.nodeGlow * 0.4})`);
      nodeGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.beginPath();
      ctx!.arc(CX, CY, nodeR * 4.5, 0, Math.PI * 2);
      ctx!.fillStyle = nodeGlow;
      ctx!.fill();
      // Core point
      ctx!.beginPath();
      ctx!.arc(CX, CY, nodeR, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,255,255,${interp.nodeGlow})`;
      ctx!.fill();
    }

    function loop(ts: number) {
      draw(ts);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="drop-shadow-2xl"
      style={{ width: "min(220px, 58vw)", height: "min(220px, 58vw)" }}
    />
  );
}


/* ═══════════════════════════════════════════════════════════════════════ */
/*  Active Session Screen                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function ActiveSession({
  voiceState,
  selectedAgent,
  transcript,
  lastAI,
  stateLabel,
  orbColors,
  dropdownOpen,
  setDropdownOpen,
  onSelectAgent,
  onToggleMic,
  onClose,
}: {
  voiceState: string;
  selectedAgent: Agent;
  transcript: string;
  lastAI: string;
  stateLabel: Record<string, string>;
  orbColors: Record<string, string>;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  onSelectAgent: (a: Agent) => void;
  onToggleMic: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4 gap-4 py-2">
      {/* Agent dropdown */}
      <div className="w-full">
        <VoiceDropdown
          selectedAgent={selectedAgent}
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
          onSelect={onSelectAgent}
        />
      </div>

      {/* AI Core visualization — scales down on small screens */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <AICore voiceState={voiceState} agentColor={selectedAgent.color} />
      </div>

      {/* State label + transcript */}
      <div className="text-center px-2 w-full">
        <motion.h2
          key={voiceState}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl font-bold mb-1 tracking-tight"
        >
          {stateLabel[voiceState] ?? "Ready"}
        </motion.h2>
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem] px-2 leading-relaxed">
          {transcript ||
            (voiceState === "speaking" ? lastAI : "Tap the mic to speak.")}
        </p>
      </div>

      {/* Mic button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleMic}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors flex-shrink-0 ${
          voiceState === "listening" ? "bg-red-500" : "bg-white text-black"
        }`}
      >
        {voiceState === "listening" ? (
          <X size={22} />
        ) : (
          <Mic size={22} />
        )}
      </motion.button>

      {/* Exit */}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors text-sm font-medium pb-1"
      >
        Exit Session
      </button>

      {/* Preview notice */}
      <p className="text-[10px] text-gray-600 text-center max-w-[240px] leading-relaxed pb-2">
        Preview · Voice capabilities are continuously improving.
      </p>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════════════════ */
const VoiceDropdown = memo(function VoiceDropdown({
  selectedAgent,
  isOpen,
  setIsOpen,
  onSelect,
}: {
  selectedAgent: Agent;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onSelect: (a: Agent) => void;
}) {
  const dropRef = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, setIsOpen]);

  return (
    <div ref={dropRef} className="relative w-full max-w-xs mx-auto">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all"
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedAgent.color }}
          />
          <div className="text-left">
            <p className="text-sm font-semibold leading-none">
              {selectedAgent.name}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {selectedAgent.tagline}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
            style={{
              backdropFilter: "blur(24px) saturate(200%)",
              background:
                "linear-gradient(135deg, rgba(20,20,40,0.92), rgba(10,10,25,0.96))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {VOICE_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => onSelect(agent)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left hover:bg-white/8 ${
                  selectedAgent.id === agent.id ? "bg-white/10" : ""
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: agent.color }}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium leading-none">
                    {agent.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {agent.tagline}
                  </p>
                </div>
                {selectedAgent.id === agent.id && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: agent.color }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ─── CSS animations ──────────────────────────────────────────────────── */
function VoiceStyles() {
  return (
    <style jsx global>{`
      @keyframes orb-pulse {
        0%, 100% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.06); opacity: 1; }
      }
      @keyframes orb-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes orb-listen {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.12); filter: brightness(1.25); }
      }
    `}</style>
  );
}
