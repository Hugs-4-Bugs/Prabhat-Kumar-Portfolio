"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Play, Volume2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVoiceAIResponse } from '@/app/actions';

const VOICE_AGENTS = [
  { id: 'quantum', name: 'Quantum', tagline: 'Deep & Calm', color: '#4A90D9',
    pitch: 0.85, rate: 0.92, greeting: "Hey. I'm Quantum. Ask me anything about Prabhat." },
  { id: 'nova', name: 'Nova', tagline: 'Warm & Friendly', color: '#E91E8C',
    pitch: 1.15, rate: 1.0, greeting: "Hi there! I'm Nova. What would you like to know?" },
  { id: 'sage', name: 'Sage', tagline: 'Wise & Measured', color: '#9B59B6',
    pitch: 0.78, rate: 0.85, greeting: "Greetings. I am Sage. How may I assist you today?" },
  { id: 'aria', name: 'Aria', tagline: 'Energetic & Upbeat', color: '#FF6B35',
    pitch: 1.2, rate: 1.08, greeting: "Hey hey! Aria here! Super ready to help. Go ahead!" },
  { id: 'echo', name: 'Echo', tagline: 'Neutral & Clear', color: '#00BCD4',
    pitch: 1.0, rate: 0.97, greeting: "Hello. I'm Echo. I'm here to answer your questions." },
  { id: 'orion', name: 'Orion', tagline: 'Young & Enthusiastic', color: '#4CAF50',
    pitch: 1.08, rate: 1.05, greeting: "What's up! I'm Orion. Let's talk about Prabhat!" }
];

interface VoiceAgentProps {
  isVisible: boolean;
  onClose: () => void;
  conversationHistory: Array<{ user: string; model: string }>;
  onAddMessage: (user: string, model: string) => void;
}

export function VoiceAgent({ isVisible, onClose, conversationHistory, onAddMessage }: VoiceAgentProps) {
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [selectedAgent, setSelectedAgent] = useState(VOICE_AGENTS[0]);
  const [transcript, setTranscript] = useState('');
  const [lastExchange, setLastExchange] = useState({ user: '', ai: '' });
  const [isReady, setIsReady] = useState(false);
  const [sessionStarted, setSessionSessionStarted] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const speakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted voice
  useEffect(() => {
    const saved = localStorage.getItem('quantumai_selected_voice');
    if (saved) {
      const agent = VOICE_AGENTS.find(a => a.id === saved);
      if (agent) setSelectedAgent(agent);
    }
  }, []);

  const handleVoiceChange = (agent: typeof VOICE_AGENTS[0]) => {
    console.log('[VoiceAgent] Changing voice to:', agent.name);
    setSelectedAgent(agent);
    localStorage.setItem('quantumai_selected_voice', agent.id);
  };

  const getBestVoice = useCallback((agent: typeof VOICE_AGENTS[0]) => {
    const voices = window.speechSynthesis.getVoices();
    const priorityMap: Record<string, string[]> = {
      quantum: ['Google UK English Male', 'Microsoft George', 'Daniel', 'Alex'],
      nova:    ['Google US English Female', 'Microsoft Zira', 'Samantha', 'Victoria'],
      sage:    ['Microsoft David', 'Google UK English Male', 'Daniel', 'Arthur'],
      aria:    ['Google US English Female', 'Microsoft Cortana', 'Victoria', 'Karen'],
      echo:    ['Karen', 'Moira', 'Google US English', 'Microsoft Eva'],
      orion:   ['Microsoft Mark', 'Google US English Male', 'Tom', 'Fred']
    };
    
    const priorities = priorityMap[agent.id];
    for (const name of priorities) {
      const match = voices.find(v => v.name.includes(name));
      if (match) return match;
    }
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, []);

  const speakNaturally = useCallback((text: string, agent: typeof VOICE_AGENTS[0], onEnd?: () => void) => {
    console.log('[VoiceAgent] Preparing to speak:', text.substring(0, 50) + '...');
    window.speechSynthesis.cancel();
    if (!text.trim()) {
      onEnd?.();
      return;
    }
    
    const cleaned = text
      .replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '')
      .replace(/`[^`]*`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/AWS/g, 'A W S').replace(/API/g, 'A P I')
      .replace(/JWT/g, 'J W T').replace(/SQL/g, 'S Q L')
      .replace(/UI/g, 'U I').replace(/UX/g, 'U X');
    
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    let index = 0;
    
    const speakNext = () => {
      if (index >= sentences.length) {
        console.log('[VoiceAgent] Finished speaking all sentences.');
        if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
        onEnd?.();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      const voice = getBestVoice(agent);
      if (voice) utterance.voice = voice;
      
      utterance.pitch = agent.pitch + (Math.random() * 0.06 - 0.03);
      utterance.rate = agent.rate + (Math.random() * 0.04 - 0.02);
      utterance.volume = 1;
      
      utterance.onstart = () => {
        console.log('[VoiceAgent] Sentence start:', index);
        setState('speaking');
      };

      utterance.onend = () => {
        console.log('[VoiceAgent] Sentence end:', index);
        index++;
        setTimeout(speakNext, 250 + Math.random() * 150);
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

  const startListening = useCallback(() => {
    console.log('[VoiceAgent] Initializing SpeechRecognition...');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('[VoiceAgent] SpeechRecognition not supported.');
      setTranscript('Speech recognition not supported.');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('[VoiceAgent] Recognition started.');
      setState('listening');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
      console.log('[VoiceAgent] Transcript update:', current);
      
      if (event.results[event.results.length - 1].isFinal) {
        console.log('[VoiceAgent] Final result received:', current);
        handleUserInput(current);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[VoiceAgent] Recognition error:', event.error);
      if (event.error === 'no-speech') {
        setState('idle');
        setTranscript('I didn\'t catch that. Tap to try again.');
      } else {
        setState('idle');
      }
    };

    recognition.onend = () => {
      console.log('[VoiceAgent] Recognition ended.');
      if (state === 'listening') setState('idle');
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch(e) {
      console.error('[VoiceAgent] Could not start recognition:', e);
    }
  }, [state]);

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    
    console.log('[VoiceAgent] Processing input for AI:', input);
    setState('thinking');
    setLastExchange(prev => ({ ...prev, user: input }));

    try {
      const result = await getVoiceAIResponse(input, conversationHistory);
      if (result.success && result.answer) {
        console.log('[VoiceAgent] AI Response received:', result.answer.substring(0, 50));
        setLastExchange(prev => ({ ...prev, ai: result.answer as string }));
        onAddMessage(input, result.answer as string);
        speakNaturally(result.answer as string, selectedAgent, () => {
          setState('idle');
          setTimeout(() => startListening(), 500);
        });
      } else {
        console.error('[VoiceAgent] AI call returned failure.');
        setTranscript('Failed to connect. Tap mic to retry.');
        setState('idle');
      }
    } catch (err) {
      console.error('[VoiceAgent] handleUserInput error:', err);
      setState('idle');
    }
  };

  const startSession = () => {
    console.log('[VoiceAgent] Starting session...');
    setSessionSessionStarted(true);
    speakNaturally(selectedAgent.greeting, selectedAgent, () => {
      setState('idle');
      startListening();
    });
  };

  const toggleMic = () => {
    if (state === 'speaking') {
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
    console.log('[VoiceAgent] Closing VoiceAgent...');
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    onClose();
  };

  // Pre-load voices
  useEffect(() => {
    const checkVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        console.log('[VoiceAgent] Voices loaded and ready.');
        setIsReady(true);
      }
    };
    window.speechSynthesis.onvoiceschanged = checkVoices;
    checkVoices();
  }, []);

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
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse">
                <AudioWaveform size={64} className="text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-headline mb-4">Voice Mode</h2>
                <p className="text-gray-400 max-w-sm mb-8">
                  Talk naturally to QuantumAI about Prabhat's skills, experience, and projects.
                </p>
                <Button 
                  size="lg" 
                  onClick={startSession}
                  className="rounded-full px-12 py-6 text-lg font-bold gap-3 shadow-xl shadow-primary/20"
                >
                  <Power size={20} />
                  Start Conversation
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center gap-8 mb-12">
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
                    className={`relative w-48 h-48 rounded-full shadow-2xl transition-all duration-500 overflow-hidden ${
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
                    className="text-3xl font-bold font-headline mb-2"
                  >
                    {state === 'listening' ? 'Listening...' : 
                     state === 'thinking' ? 'Thinking...' : 
                     state === 'speaking' ? 'Speaking...' : 'Ready to chat'}
                  </motion.h2>
                  <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">
                    {transcript || (state === 'speaking' ? lastExchange.ai : state === 'idle' ? 'Tap the mic to talk.' : '')}
                  </p>
                </div>
              </div>

              <div className="w-full overflow-x-auto no-scrollbar py-4 px-6 mb-8 flex justify-center">
                <div className="flex gap-4 min-w-max">
                  {VOICE_AGENTS.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVoiceChange(agent)}
                      className={`relative p-4 rounded-2xl bg-white/5 border-2 transition-all cursor-pointer w-36 text-center ${
                        selectedAgent.id === agent.id ? 'border-primary shadow-[0_0_15px_rgba(74,144,217,0.3)]' : 'border-transparent'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: agent.color }}
                      >
                        <Volume2 size={18} />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{agent.name}</h3>
                      <p className="text-[10px] text-gray-400 mb-3">{agent.tagline}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakNaturally(agent.greeting, agent);
                        }}
                      >
                        <Play size={12} fill="currentColor" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMic}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
                    state === 'listening' ? 'bg-red-500' : 'bg-white text-black'
                  }`}
                >
                  {state === 'listening' ? <X size={36} /> : <Mic size={36} />}
                </motion.button>
                
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
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
