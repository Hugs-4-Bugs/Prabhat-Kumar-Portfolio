"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Play, Volume2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAIAudio, getVoiceAIResponse } from '@/app/actions';
import { getBrowserStorage } from '@/lib/browser-storage';

const VOICE_AGENTS = [
  { id: 'quantum', name: 'Quantum', tagline: 'Deep & Calm', color: '#4A90D9',
    pitch: 0.75, rate: 0.9, greeting: "Hey. I'm Quantum. Ask me anything about Prabhat." },
  { id: 'nova', name: 'Nova', tagline: 'Warm & Friendly', color: '#E91E8C',
    pitch: 1.25, rate: 1.05, greeting: "Hi there! I'm Nova. What would you like to know?" },
  { id: 'sage', name: 'Sage', tagline: 'Wise & Measured', color: '#9B59B6',
    pitch: 0.65, rate: 0.8, greeting: "Greetings. I am Sage. How may I assist you today?" },
  { id: 'aria', name: 'Aria', tagline: 'Energetic & Upbeat', color: '#FF6B35',
    pitch: 1.35, rate: 1.15, greeting: "Hey hey! Aria here! Super ready to help. Go ahead!" },
  { id: 'echo', name: 'Echo', tagline: 'Neutral & Clear', color: '#00BCD4',
    pitch: 1.0, rate: 1.0, greeting: "Hello. I'm Echo. I'm here to answer your questions about Prabhat." },
  { id: 'orion', name: 'Orion', tagline: 'Young & Enthused', color: '#4CAF50',
    pitch: 1.1, rate: 1.1, greeting: "What's up! Orion here. Let's talk about Prabhat's projects!" },
  { id: 'luna', name: 'Luna', tagline: 'Warm & Helpful', color: '#FFD700',
    pitch: 1.15, rate: 0.95, greeting: "Hi, I'm Luna. I can help you in any language you prefer. What's on your mind?" }
];

interface VoiceAgentProps {
  isVisible: boolean;
  onClose: () => void;
  conversationHistory: Array<{ user: string; model: string }>;
  onAddMessage: (user: string, model: string) => void;
}

export function VoiceAgent({ isVisible, onClose, conversationHistory, onAddMessage }: VoiceAgentProps) {
  const [state, setState] = useState<'idle' | 'requesting_permission' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  const [selectedAgent, setSelectedAgent] = useState(VOICE_AGENTS[0]);
  const [transcript, setTranscript] = useState('');
  const [lastExchange, setLastExchange] = useState({ user: '', ai: '' });
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const selectedAgentRef = useRef(VOICE_AGENTS[0]);
  const isComponentMounted = useRef(true);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const stateRef = useRef(state);
  const finalTranscriptRef = useRef('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    isComponentMounted.current = true;
    
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      isComponentMounted.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  useEffect(() => {
    const saved = getBrowserStorage()?.getItem('quantumai_selected_voice');
    if (saved) {
      const agent = VOICE_AGENTS.find(a => a.id === saved);
      if (agent) {
        setSelectedAgent(agent);
        selectedAgentRef.current = agent;
      }
    }
  }, []);

  const handleVoiceChange = (agent: typeof VOICE_AGENTS[0]) => {
    setSelectedAgent(agent);
    getBrowserStorage()?.setItem('quantumai_selected_voice', agent.id);
  };

  const getBestVoice = useCallback((agent: typeof VOICE_AGENTS[0]) => {
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    const priorityMap: Record<string, string[]> = {
      quantum: ['Google UK English Male', 'Microsoft George', 'Daniel', 'Alex'],
      nova:    ['Google US English Female', 'Microsoft Zira', 'Samantha', 'Victoria'],
      sage:    ['Microsoft David', 'Google UK English Male', 'Daniel', 'Arthur'],
      aria:    ['Google US English Female', 'Microsoft Cortana', 'Victoria', 'Karen'],
      echo:    ['Karen', 'Moira', 'Google US English', 'Microsoft Eva'],
      orion:   ['Microsoft Mark', 'Google US English Male', 'Tom', 'Fred'],
      luna:    ['Google Hindi', 'Microsoft Heera', 'Google UK English Female', 'Aditi']
    };
    
    const priorities = priorityMap[agent.id];
    for (const name of priorities) {
      const match = voices.find(v => v.name.includes(name));
      if (match) return match;
    }
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, []);

  const speakWithBrowserFallback = useCallback((text: string, agent?: typeof VOICE_AGENTS[0], onEnd?: () => void) => {
    console.log('[VoiceAgent] Speaking:', text);
    window.speechSynthesis.cancel();
    
    if (!text.trim()) {
      onEnd?.();
      return;
    }
    
    const cleaned = text
      .replace(/Prabhat/g, 'Pra-bhaat')
      .replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '')
      .replace(/`[^`]*`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/AWS/g, 'A W S').replace(/API/g, 'A P I')
      .replace(/JWT/g, 'J W T').replace(/SQL/g, 'S Q L')
      .replace(/UI/g, 'U I').replace(/UX/g, 'U X');
    
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    let index = 0;
    
    const speakNext = () => {
      if (!isComponentMounted.current) return;
      if (index >= sentences.length) {
        console.log('[VoiceAgent] Finished speaking');
        onEnd?.();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      const currentAgent = selectedAgentRef.current;
      const voice = getBestVoice(currentAgent);
      
      if (voice) utterance.voice = voice;
      
      utterance.pitch = currentAgent.pitch + (Math.random() * 0.04 - 0.02);
      utterance.rate = currentAgent.rate + (Math.random() * 0.04 - 0.02);
      utterance.volume = 1;
      
      utterance.onstart = () => {
        if (isComponentMounted.current) setState('speaking');
      };
      
      utterance.onend = () => {
        index++;
        if (isComponentMounted.current) {
          setTimeout(speakNext, 300 + Math.random() * 200);
        }
      };
      
      utterance.onerror = (e) => {
        console.error('[VoiceAgent] Utterance error:', e);
        index++;
        speakNext();
      };
      
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    };
    
    speakNext();
  }, [getBestVoice]);

  const cleanSpeechText = useCallback((text: string) => {
    return text
      .replace(/Prabhat/g, 'Pra-bhaat')
      .replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '')
      .replace(/`[^`]*`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/AWS/g, 'A W S').replace(/API/g, 'A P I')
      .replace(/JWT/g, 'J W T').replace(/SQL/g, 'S Q L')
      .replace(/UI/g, 'U I').replace(/UX/g, 'U X');
  }, []);

  const speakNaturally = useCallback(async (text: string, agent?: typeof VOICE_AGENTS[0], onEnd?: () => void) => {
    const cleaned = cleanSpeechText(text);
    if (!cleaned.trim()) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    try {
      const currentAgent = agent || selectedAgentRef.current;
      const audioResponse = await getAIAudio(cleaned, currentAgent.id);
      if (isComponentMounted.current && audioResponse.success && audioResponse.audio) {
        const audio = new Audio(audioResponse.audio);
        audioRef.current = audio;
        audio.onplay = () => {
          if (isComponentMounted.current) setState('speaking');
        };
        audio.onended = () => {
          if (isComponentMounted.current) onEnd?.();
        };
        audio.onerror = () => {
          speakWithBrowserFallback(cleaned, currentAgent, onEnd);
        };
        await audio.play();
        return;
      }
    } catch (error) {
      console.error('[VoiceAgent] Natural TTS failed, using browser fallback:', error);
    }

    speakWithBrowserFallback(cleaned, agent, onEnd);
  }, [cleanSpeechText, speakWithBrowserFallback]);

  const startListening = useCallback(async () => {
    console.log('[VoiceAgent] Starting listening...');
    if (!isComponentMounted.current) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    window.speechSynthesis.cancel();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setState('error');
      setTranscript('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }

    try {
      setState('requesting_permission');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('[VoiceAgent] Microphone permission error:', error);
      if (isComponentMounted.current) {
        setState('error');
        setTranscript('Microphone permission is blocked. Please allow microphone access and try again.');
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    finalTranscriptRef.current = '';
    
    recognition.onstart = () => {
      if (isComponentMounted.current) {
        setState('listening');
        setTranscript('');
      }
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      const current = `${finalTranscriptRef.current} ${interim}`.trim();
      setTranscript(current);
      
      if (event.results[event.results.length - 1].isFinal) {
        const finalText = finalTranscriptRef.current.trim();
        console.log('[VoiceAgent] Final result:', finalText);
        try { recognition.stop(); } catch(e) {}
        handleUserInput(finalText);
      }
    };

    recognition.onerror = (event) => {
      console.log('[VoiceAgent] Recognition error:', event.error);
      if (isComponentMounted.current) {
        if (event.error === 'no-speech') {
          setState('idle');
          setTranscript('I did not catch that. Tap the mic and try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setState('error');
          setTranscript('Microphone permission is blocked. Please allow microphone access and try again.');
        } else {
          setState('error');
          setTranscript(`Voice recognition error: ${event.error}`);
        }
      }
    };

    recognition.onend = () => {
      if (isComponentMounted.current && stateRef.current === 'listening') {
        setState('idle');
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch(e) {
      console.error('[VoiceAgent] Start error:', e);
    }
  }, []);

  const handleUserInput = async (input: string) => {
    if (!input.trim() || !isComponentMounted.current) return;
    
    console.log('[VoiceAgent] Processing input...');
    setState('thinking');
    setLastExchange(prev => ({ ...prev, user: input }));

    try {
      const result = await getVoiceAIResponse(input, conversationHistory);
      if (isComponentMounted.current && result.success && result.answer) {
        console.log('[VoiceAgent] AI Response received');
        setLastExchange(prev => ({ ...prev, ai: result.answer as string }));
        onAddMessage(input, result.answer as string);
        speakNaturally(result.answer as string, undefined, () => {
          if (isComponentMounted.current) {
            setState('idle');
            setTimeout(() => startListening(), 600);
          }
        });
      } else {
        const fallback = result.message || "Sorry, I'm having trouble connecting right now.";
        console.error('[VoiceAgent] AI call failed:', fallback);
        setLastExchange(prev => ({ ...prev, ai: fallback }));
        speakNaturally(fallback, undefined, () => {
          if (isComponentMounted.current) setState('idle');
        });
      }
    } catch (err) {
      console.error('[VoiceAgent] Fatal error:', err);
      const fallback = "Sorry, something went wrong with voice mode. Please try again.";
      setLastExchange(prev => ({ ...prev, ai: fallback }));
      speakNaturally(fallback, undefined, () => {
        if (isComponentMounted.current) setState('idle');
      });
    }
  };

  const startSession = () => {
    setSessionStarted(true);
    speakNaturally(selectedAgent.greeting, undefined, () => {
      if (isComponentMounted.current) {
        setState('idle');
        startListening();
      }
    });
  };

  const toggleMic = () => {
    if (state === 'speaking') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.speechSynthesis.cancel();
      startListening();
    } else if (state === 'listening') {
      recognitionRef.current?.stop();
      setState('idle');
    } else {
      startListening();
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 text-white"
        >
          <div className="absolute top-6 right-6">
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-white/10 text-white">
              <X size={28} />
            </Button>
          </div>

          {!sessionStarted ? (
            <div className="flex flex-col items-center gap-8 text-center px-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse">
                <AudioWaveform size={48} className="text-primary md:w-16 md:h-16" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">Voice Mode</h2>
                <p className="text-gray-400 max-w-sm mb-8 text-sm md:text-base">
                  Talk naturally in any language to QuantumAI about Prabhat's skills, experience, and projects.
                </p>
                <Button 
                  size="lg" 
                  onClick={startSession}
                  className="rounded-full px-8 py-5 md:px-12 md:py-6 text-base md:text-lg font-bold gap-3 shadow-xl shadow-primary/20"
                >
                  <Power size={20} />
                  Start Conversation
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="relative">
                  <AnimatePresence>
                    {state === 'listening' && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-blue-400/50"
                      />
                    )}
                    {state === 'speaking' && (
                       <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute inset-[-20px] rounded-full bg-cyan-400/10 blur-xl"
                       />
                    )}
                  </AnimatePresence>

                  <div 
                    className={`relative w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl transition-all duration-500 overflow-hidden ${
                      state === 'listening' ? 'scale-110 shadow-blue-500/50' :
                      state === 'thinking' ? 'shadow-purple-500/50' :
                      state === 'speaking' ? 'shadow-cyan-400/50 scale-105' :
                      'shadow-blue-900/30'
                    }`}
                    style={{
                      background: state === 'thinking' 
                        ? 'conic-gradient(from 0deg, #1e3a8a, #9333ea, #1e3a8a)' 
                        : 'radial-gradient(circle at 30% 30%, #4a90d9, #1e3a8a)',
                      animation: state === 'idle' ? 'orb-pulse 3s infinite ease-in-out' : 
                                state === 'thinking' ? 'orb-rotate 2s infinite linear' :
                                state === 'listening' ? 'orb-listen 1s infinite ease-in-out' :
                                'none'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
                  </div>
                </div>

                <div className="text-center px-6 max-w-lg">
                  <motion.h2 
                    key={state}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-3xl font-bold font-headline mb-2"
                  >
                    {state === 'listening' ? 'Listening...' : 
                     state === 'requesting_permission' ? 'Requesting microphone...' :
                     state === 'thinking' ? 'Thinking...' : 
                     state === 'error' ? 'Voice needs attention' :
                     state === 'speaking' ? 'Speaking...' : 'Ready to chat'}
                  </motion.h2>
                  <p className="text-xs md:text-sm text-gray-400 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                    {transcript || (state === 'speaking' ? lastExchange.ai : state === 'idle' ? 'Tap the mic to talk.' : '')}
                  </p>
                </div>
              </div>

              <div className="w-full overflow-x-auto no-scrollbar py-4 px-6 mb-6 md:mb-8 flex justify-center">
                <div className="flex gap-3 md:gap-4 min-w-max">
                  {VOICE_AGENTS.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVoiceChange(agent)}
                      className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border-2 transition-all cursor-pointer w-28 md:w-36 text-center ${
                        selectedAgent.id === agent.id ? 'border-primary shadow-[0_0_15px_rgba(74,144,217,0.3)]' : 'border-transparent'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center"
                        style={{ backgroundColor: agent.color }}
                      >
                        <Volume2 size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <h3 className="font-bold text-xs md:text-sm mb-1">{agent.name}</h3>
                      <p className="text-[9px] md:text-[10px] text-gray-400 mb-2 md:mb-3">{agent.tagline}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 md:h-7 md:w-7 p-0 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoiceChange(agent);
                          speakNaturally(agent.greeting, agent);
                        }}
                      >
                        <Play size={10} className="md:w-3 md:h-3" fill="currentColor" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 md:gap-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMic}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
                    state === 'listening' ? 'bg-red-500' : 'bg-white text-black'
                  }`}
                >
                  {state === 'listening' ? <X size={28} className="md:w-9 md:h-9" /> : <Mic size={28} className="md:w-9 md:h-9" />}
                </motion.button>
                
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm font-medium"
                >
                  Exit Session
                </button>
              </div>
            </>
          )}

          <style jsx>{`
            @keyframes orb-pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.05); opacity: 1; }
            }
            @keyframes orb-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes orb-listen {
              0%, 100% { transform: scale(1); filter: brightness(1); }
              50% { transform: scale(1.1); filter: brightness(1.2); }
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AudioWaveformProps {
  size?: number;
  className?: string;
}

function AudioWaveform({ size = 24, className }: AudioWaveformProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </svg>
  );
}
