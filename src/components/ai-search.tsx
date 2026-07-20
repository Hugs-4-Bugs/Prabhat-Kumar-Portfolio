"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Sparkles, X, Search, Mic, MicOff, User, Trash2, AudioWaveform, SendHorizontal } from "lucide-react";
import Lottie from "lottie-react";

import { getAISearchResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import listeningAnimation from "@/lib/listening-animation.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getBrowserStorage } from "@/lib/browser-storage";
import { VoiceAgent } from "@/components/VoiceAgent";

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AISearchProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Particle {
  id: number;
  bg: string;
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
  xRange: number;
  yRange: number;
}

/* ─── Lightweight transcript normalization ────────────────────────────── */

const SR_CORRECTIONS: [RegExp, string][] = [
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
  [/\bspring\s+boot\b/gi,   "Spring Boot"],
  [/\bspringboot\b/gi,      "Spring Boot"],
  [/\bspring\s+book\b/gi,   "Spring Boot"],
  [/\bspring\s+but\b/gi,    "Spring Boot"],
  [/\bspring\s+bout\b/gi,   "Spring Boot"],
  [/\bspring\s+bought\b/gi, "Spring Boot"],
  [/\bmicro\s+services\b/gi, "microservices"],
  [/\bmicro-services\b/gi,   "microservices"],
  [/\bjava\s+script\b/gi,   "JavaScript"],
  [/\btype\s+script\b/gi,   "TypeScript"],
  [/\ba\.?\s*w\.?\s*s\b/gi, "AWS"],
  [/\bamazon\s+web\s+services\b/gi, "AWS"],
  [/\bpostgres\b/gi,   "PostgreSQL"],
  [/\bpost\s+gres\b/gi, "PostgreSQL"],
  [/\bmy\s+sql\b/gi,   "MySQL"],
  [/\bmongo\s+db\b/gi, "MongoDB"],
  [/\brest\s+api\b/gi,  "REST API"],
  [/\brest\s+apis\b/gi, "REST APIs"],
  [/\bj\.?\s*w\.?\s*t\b/gi, "JWT"],
  [/\bjason\b/g,        "JSON"],
  [/\bci\s*\/\s*cd\b/gi, "CI/CD"],
  [/\bdev\s*ops\b/gi,   "DevOps"],
  [/\bcode\s+guard\b/gi,      "CodeGuard"],
  [/\bacquisition\s+os\b/gi,  "AcquisitionOS"],
  [/\bquantum\s+ai\b/gi,      "QuantumAI"],
  [/\bquantum\s+fusion\b/gi,  "QuantumFusion"],
  [/\bsystem\s+foundry\b/gi,  "SystemFoundry"],
  [/(?<![a-zA-Z])\bi\b(?![a-zA-Z])/g, "I"],
];

function normalizeSpeechTranscript(text: string): string {
  let result = text
    .replace(/\s+/g, " ")
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .trim();
  for (const [pattern, replacement] of SR_CORRECTIONS) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/^./, (c) => c.toUpperCase());
}

export function AISearch({ isVisible, onClose }: AISearchProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const activeRecognitionRef = useRef<any>(null);
  const interimRef = useRef('');
  const finalRef = useRef('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    // Initialize particles only on client to avoid hydration mismatch
    const newParticles = [...Array(15)].map((_, i) => ({
      id: i,
      bg: i % 3 === 0 ? 'rgba(120, 119, 198, 0.4)' : 
          i % 3 === 1 ? 'rgba(255, 119, 198, 0.3)' : 
          'rgba(120, 219, 255, 0.35)',
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      xRange: (Math.random() - 0.5) * 100,
      yRange: (Math.random() - 0.5) * 100,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const savedConversation = getBrowserStorage()?.getItem('ai-search-conversation');
      if (savedConversation) {
        setConversation(JSON.parse(savedConversation));
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (conversation.length > 0) {
      getBrowserStorage()?.setItem('ai-search-conversation', JSON.stringify(conversation));
    }
  }, [conversation]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const handleClearConversation = () => {
    stopAudio();
    setConversation([]);
    getBrowserStorage()?.removeItem('ai-search-conversation');
    toast({
      title: "Conversation Cleared",
      description: "The chat history has been cleared.",
    });
  }
  
  const handleSubmit = useCallback(async (currentQuery: string) => {
    if (!currentQuery.trim()) return;

    stopAudio();
    
    const newConversation: Message[] = [...conversation, { role: 'user', content: currentQuery }];
    setConversation(newConversation);
    setQuery("");

    startTransition(async () => {
      const history = conversation.reduce((acc: Array<{ user: string; model: string }>, message, index) => {
        if (message.role === 'user' && conversation[index + 1]?.role === 'model') {
          acc.push({
            user: message.content,
            model: conversation[index + 1].content,
          });
        }
        return acc;
      }, []);

      const response = await getAISearchResponse(currentQuery, history);

      if (response.success && response.answer) {
        console.log('[AISearch] Assistant response received, appending once');
        setConversation(prev => [...prev, { role: 'model', content: response.answer as string }]);
      } else {
        toast({
          title: "AI Search Error",
          description: response.message || "An error occurred.",
          variant: "destructive",
        });
        setConversation(prev => prev.slice(0, -1));
      }
    });
  }, [stopAudio, toast, conversation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('[SR] Speech Recognition not supported by this browser.');
      return;
    }
    // Store the constructor, not an instance — we create a fresh instance each time
    recognitionRef.current = SR;
  }, []);

  const toggleListening = () => {
    const SR = recognitionRef.current;
    if (!SR) return;

    if (isListening) {
      console.log('[SR] Microphone stopped by user');
      activeRecognitionRef.current?.stop();
      activeRecognitionRef.current = null;
      setIsListening(false);
      return;
    }

    console.log('[SR] Microphone clicked — starting recognition');
    stopAudio();
    setQuery('');
    interimRef.current = '';
    finalRef.current = '';

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    // en-US has the best acoustic model coverage for technical and conversational speech
    rec.lang = 'en-US';

    // Short hold after final result before committing — lets the user finish a thought
    // without being cut off by a brief natural pause mid-sentence
    const HOLD_MS = 600;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const clearHold = () => {
      if (holdTimer !== null) { clearTimeout(holdTimer); holdTimer = null; }
    };

    const commitAndStop = () => {
      clearHold();
      try { rec.stop(); } catch { /* ignore */ }
    };

    rec.onstart = () => {
      console.log('[SR] Recognition started');
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      const display = (finalRef.current + ' ' + interim).trim();
      console.log(`[SR] Interim transcript: "${display}"`);
      setQuery(display);

      // After a final result, wait briefly before stopping — the user may
      // still be forming the rest of their sentence
      if (event.results[event.results.length - 1].isFinal) {
        clearHold();
        holdTimer = setTimeout(commitAndStop, HOLD_MS);
      }
    };

    rec.onerror = (event: any) => {
      clearHold();
      console.error('[SR] Recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted') {
        setIsListening(false);
        activeRecognitionRef.current = null;
        return;
      }
      toast({ title: 'Voice Error', description: `Could not recognize speech: ${event.error}`, variant: 'destructive' });
      setIsListening(false);
      activeRecognitionRef.current = null;
    };

    rec.onend = () => {
      clearHold();
      console.log('[SR] Recognition ended');
      const committed = normalizeSpeechTranscript(finalRef.current.trim());
      if (committed) {
        console.log(`[SR] Final transcript committed: "${committed}"`);
        setQuery(committed);
      }
      setIsListening(false);
      activeRecognitionRef.current = null;
    };

    try {
      rec.start();
      activeRecognitionRef.current = rec;
    } catch (e) {
      console.error('[SR] rec.start() threw:', e);
      setIsListening(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(query);
  };

  const handleClose = () => {
    stopAudio();
    onClose();
  }

  const handleAddMessage = (user: string, model: string) => {
    setConversation(prev => [
      ...prev, 
      { role: 'user', content: user },
      { role: 'model', content: model }
    ]);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      const stopPropagation = (e: WheelEvent) => e.stopPropagation();
      overlay.addEventListener('wheel', stopPropagation);
      return () => {
        overlay.removeEventListener('wheel', stopPropagation);
      };
    }
  }, []);
  
  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollViewport) {
      scrollViewport.scrollTo({ top: scrollViewport.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation, isPending]);

  const canSubmit = !isPending && !isListening && query.trim().length > 0;

  return (
    <>
    <AnimatePresence>
        {isVisible && (
            <motion.div
                key="chat-overlay"
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex flex-col items-center justify-start overflow-hidden"
                style={{
                  background: `
                    radial-gradient(circle at 10% 20%, rgba(120, 119, 198, 0.25) 0%, transparent 40%),
                    radial-gradient(circle at 90% 10%, rgba(255, 119, 198, 0.20) 0%, transparent 40%),
                    radial-gradient(circle at 25% 80%, rgba(120, 219, 255, 0.30) 0%, transparent 45%),
                    radial-gradient(circle at 80% 80%, rgba(255, 219, 120, 0.25) 0%, transparent 45%),
                    radial-gradient(circle at 15% 50%, rgba(167, 120, 255, 0.20) 0%, transparent 40%),
                    radial-gradient(circle at 85% 40%, rgba(120, 255, 187, 0.25) 0%, transparent 40%),
                    radial-gradient(circle at 50% 15%, rgba(255, 120, 120, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 60% 70%, rgba(120, 255, 240, 0.20) 0%, transparent 40%),
                    radial-gradient(circle at 30% 30%, rgba(198, 255, 120, 0.18) 0%, transparent 40%),
                    radial-gradient(circle at 70% 60%, rgba(255, 180, 120, 0.22) 0%, transparent 40%),
                    linear-gradient(135deg, 
                      hsl(var(--background)) 0%, 
                      hsl(var(--background)/0.95) 30%, 
                      hsl(var(--background)/0.90) 70%, 
                      hsl(var(--background)) 100%
                    )
                  `,
                  backdropFilter: 'blur(25px) saturate(180%)'
                }}
            >
                <div className="absolute inset-0 overflow-hidden">
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        backgroundImage: `radial-gradient(circle, ${p.bg})`,
                        filter: 'blur(8px)',
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                      }}
                      animate={{
                        x: [0, p.xRange],
                        y: [0, p.yRange],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex gap-1 sm:gap-2">
                    {conversation.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleClearConversation} 
                        data-cursor-hover
                        className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20"
                      >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Clear Conversation</span>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleClose} 
                      data-cursor-hover
                      className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close AI Search</span>
                    </Button>
                </div>
                
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ ease: "easeOut" }}
                    className="w-full max-w-4xl h-full flex flex-col pt-14 pb-4 px-3 sm:px-4 relative z-10"
                >
                    <div className="flex-shrink-0 text-center pb-8 sticky top-0 z-10 pt-4 -mt-4">
                        <motion.h1 
                          className="text-3xl sm:text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-2 sm:mb-4"
                          animate={{
                            textShadow: [
                              '0 0 25px rgba(120, 119, 198, 0.7)',
                              '0 0 35px rgba(255, 119, 198, 0.6)',
                              '0 0 30px rgba(120, 219, 255, 0.7)',
                              '0 0 25px rgba(120, 119, 198, 0.7)'
                            ]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                            <Balancer>
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                    QuantumAI
                                </span>
                            </Balancer>
                        </motion.h1>
                        <motion.p 
                          className="text-sm sm:text-xl text-muted-foreground/90"
                          animate={{
                            textShadow: [
                              '0 0 15px rgba(120, 119, 198, 0.5)',
                              '0 0 20px rgba(255, 119, 198, 0.4)',
                              '0 0 18px rgba(120, 219, 255, 0.5)'
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                            Your personal guide to Prabhat Kumar's portfolio.
                        </motion.p>
                    </div>
                    
                    <ScrollArea className="flex-grow -mx-4" ref={scrollAreaRef}>
                        <div className="min-h-[100px] px-4 pb-8 space-y-8">
                        
                        {conversation.length === 0 && !isPending && !isListening && (
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-muted-foreground/90 pt-20 text-lg"
                             >
                                <motion.div
                                  animate={{
                                    textShadow: [
                                      '0 0 20px rgba(120, 119, 198, 0.6)',
                                      '0 0 25px rgba(255, 119, 198, 0.5)',
                                      '0 0 22px rgba(120, 219, 255, 0.6)'
                                    ]
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  Ask me anything about Prabhat's skills, experience, or projects.
                                </motion.div>
                            </motion.div>
                        )}
                        
                        {conversation.map((message, index) => (
                           <div key={index}>
                                {message.role === 'user' ? (
                                    <div className="flex items-start gap-4 justify-end">
                                        <motion.div 
                                          className="p-3 sm:p-4 text-primary-foreground rounded-2xl rounded-br-none max-w-[85vw] sm:max-w-2xl relative overflow-hidden"
                                          style={{
                                            backgroundImage: `
                                              linear-gradient(135deg, 
                                                rgba(120, 119, 198, 0.9) 0%, 
                                                rgba(255, 119, 198, 0.8) 50%, 
                                                rgba(120, 219, 255, 0.85) 100%
                                              )`,
                                            boxShadow: `
                                              0 8px 32px rgba(120, 119, 198, 0.4),
                                              0 4px 16px rgba(255, 119, 198, 0.3),
                                              inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                            `,
                                            backdropFilter: 'blur(10px)'
                                          }}
                                          whileHover={{
                                            scale: 1.02,
                                            boxShadow: `
                                              0 12px 40px rgba(120, 119, 198, 0.6),
                                              0 6px 20px rgba(255, 119, 198, 0.4),
                                              inset 0 1px 0 rgba(255, 255, 255, 0.3)
                                            `
                                          }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse" />
                                            {message.content}
                                        </motion.div>
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          className="w-8 h-8 shrink-0 mt-1 flex items-center justify-center rounded-full"
                                          style={{
                                            backgroundImage: `
                                              radial-gradient(circle at 30% 30%, 
                                                rgba(120, 119, 198, 0.9) 0%, 
                                                rgba(255, 119, 198, 0.8) 50%, 
                                                transparent 70%
                                              ),
                                              radial-gradient(circle at 70% 70%, 
                                                rgba(120, 219, 255, 0.7) 0%, 
                                                transparent 50%
                                              )
                                            `,
                                            boxShadow: `
                                              0 4px 15px rgba(120, 119, 198, 0.4),
                                              0 2px 8px rgba(255, 119, 198, 0.3)
                                            `
                                          }}
                                        >
                                          <User className="w-4 h-4 text-primary-foreground" />
                                        </motion.div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="prose prose-lg dark:prose-invert max-w-none"
                                    >
                                        <div className="flex items-start gap-4">
                                            <motion.div 
                                              className="w-8 h-8 shrink-0 mt-1 flex items-center justify-center rounded-full"
                                              style={{
                                                backgroundImage: `
                                                  radial-gradient(circle at 30% 30%, 
                                                    rgba(120, 119, 198, 0.9) 0%, 
                                                    rgba(255, 119, 198, 0.8) 30%, 
                                                    rgba(120, 219, 255, 0.7) 60%,
                                                    transparent 70%
                                                  )
                                                `,
                                                boxShadow: `
                                                  0 4px 20px rgba(120, 119, 198, 0.6),
                                                  0 2px 10px rgba(255, 119, 198, 0.5),
                                                  0 0 0 1px rgba(255, 255, 255, 0.1)
                                                `
                                              }}
                                              whileHover={{
                                                scale: 1.1,
                                                rotate: 5
                                              }}
                                            >
                                              <Sparkles className="w-4 h-4 text-primary-foreground" />
                                            </motion.div>
                                            <motion.div 
                                                className="whitespace-pre-wrap p-4 sm:p-6 rounded-2xl relative overflow-hidden"
                                                style={{
                                                  backgroundImage: `
                                                    radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
                                                    radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.12) 0%, transparent 50%),
                                                    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.10) 0%, transparent 50%),
                                                    rgba(255, 255, 255, 0.05)
                                                  `,
                                                  backdropFilter: 'blur(15px)',
                                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                                  boxShadow: `
                                                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                                    0 8px 32px rgba(0, 0, 0, 0.1),
                                                    0 2px 8px rgba(120, 119, 198, 0.2)
                                                  `
                                                }}
                                                whileHover={{
                                                  boxShadow: `
                                                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                                                    0 12px 40px rgba(0, 0, 0, 0.15),
                                                    0 4px 16px rgba(120, 119, 198, 0.3)
                                                  `
                                                }}
                                                dangerouslySetInnerHTML={{ 
                                                    __html: message.content
                                                        .replace(/###\s*(.*)/g, '<h3>$1</h3>')
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/\*(.*)/g, '<li style="list-style-type: disc; margin-left: 20px;">$1</li>')
                                                        .replace(/\n/g, '<br />')
                                                        .replace(/<br \/>\s*<li/g, '<li') 
                                                        .replace(/<\/li><br \/>/g, '</li>')
                                                }} 
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}

                        <AnimatePresence>
                        {isListening && (
                            <motion.div 
                                key="listening"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col items-center justify-center text-center p-6 sm:p-12 space-y-3 sm:space-y-4"
                                style={{
                                  backgroundImage: `
                                    radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.25) 0%, transparent 70%),
                                    radial-gradient(circle at 30% 70%, rgba(255, 119, 198, 0.20) 0%, transparent 70%),
                                    radial-gradient(circle at 70% 30%, rgba(120, 219, 255, 0.22) 0%, transparent 70%)
                                  `,
                                  borderRadius: '2rem',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(20px)'
                                }}
                            >
                                <motion.div
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Lottie animationData={listeningAnimation} loop={true} style={{width: 70, height: 70}}/>
                                </motion.div>
                                <motion.p 
                                  className="text-lg font-medium"
                                  animate={{
                                    textShadow: [
                                      '0 0 10px rgba(120, 119, 198, 0.6)',
                                      '0 0 15px rgba(255, 119, 198, 0.6)',
                                      '0 0 12px rgba(120, 219, 255, 0.6)'
                                    ]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  Listening...
                                </motion.p>
                            </motion.div>
                        )}
                        {isPending && (
                            <motion.div 
                                key="pending"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-start gap-4 text-center p-8"
                                style={{
                                  backgroundImage: `
                                    radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.20) 0%, transparent 70%),
                                    radial-gradient(circle at 70% 30%, rgba(255, 219, 120, 0.15) 0%, transparent 70%),
                                    radial-gradient(circle at 30% 70%, rgba(167, 120, 255, 0.18) 0%, transparent 70%)
                                  `,
                                  borderRadius: '1.5rem',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(15px)'
                                }}
                            >
                                <motion.div 
                                  className="w-8 h-8 shrink-0 mt-1 flex items-center justify-center rounded-full"
                                  style={{
                                    backgroundImage: `
                                      radial-gradient(circle at 30% 30%, 
                                        rgba(120, 119, 198, 0.9) 0%, 
                                        rgba(255, 119, 198, 0.8) 30%, 
                                        rgba(120, 219, 255, 0.7) 60%,
                                        transparent 70%
                                      )
                                    `,
                                    boxShadow: `
                                      0 4px 20px rgba(120, 119, 198, 0.6),
                                      0 2px 10px rgba(255, 119, 198, 0.5)
                                    `
                                  }}
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                                </motion.div>
                                <div className="flex items-center gap-3">
                                     <motion.p 
                                       className="text-muted-foreground text-lg"
                                       animate={{
                                         textShadow: [
                                           '0 0 8px rgba(120, 219, 255, 0.5)',
                                           '0 0 12px rgba(255, 219, 120, 0.5)',
                                           '0 0 10px rgba(167, 120, 255, 0.5)'
                                         ]
                                       }}
                                       transition={{
                                         duration: 2.5,
                                         repeat: Infinity,
                                         ease: "easeInOut"
                                       }}
                                     >
                                       QuantumAI is thinking...
                                     </motion.p>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        </div>
                    </ScrollArea>
                    
                    <form onSubmit={handleFormSubmit} className="relative mt-4 sm:mt-8 flex-shrink-0">
                        <motion.div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 30% 50%, rgba(120, 119, 198, 0.25) 0%, transparent 50%),
                              radial-gradient(circle at 70% 50%, rgba(255, 119, 198, 0.20) 0%, transparent 50%),
                              radial-gradient(circle at 50% 30%, rgba(120, 219, 255, 0.22) 0%, transparent 50%),
                              radial-gradient(circle at 50% 70%, rgba(255, 219, 120, 0.18) 0%, transparent 50%)
                            `,
                            backdropFilter: 'blur(15px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: `
                              inset 0 1px 0 rgba(255, 255, 255, 0.1),
                              0 8px 32px rgba(120, 119, 198, 0.3),
                              0 4px 16px rgba(120, 119, 198, 0.2)
                            `
                          }}
                        />
                        <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-muted-foreground z-10 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a question..."
                            className="relative z-10 w-full h-12 sm:h-16 pl-10 sm:pl-14 pr-24 sm:pr-36 rounded-full bg-transparent focus:outline-none text-sm sm:text-lg placeholder-muted-foreground"
                            disabled={isPending || isListening}
                            data-cursor-hover
                        />
                        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-3 z-10">
                            {query.trim().length === 0 ? (
                              <>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant={isListening ? "destructive" : "ghost"} 
                                    onClick={toggleListening} 
                                    disabled={isPending || !recognitionRef.current}
                                    className="rounded-full backdrop-blur-md border border-white/20 w-8 h-8 sm:w-10 sm:h-10"
                                    style={{
                                      backgroundImage: isListening ? `
                                        radial-gradient(circle at 30% 30%, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.8) 50%, rgba(185,28,28,0.7) 100%)
                                      ` : `
                                        radial-gradient(circle at 30% 30%, rgba(120,119,198,0.3) 0%, rgba(255,119,198,0.25) 50%, transparent 100%)
                                      `,
                                      boxShadow: isListening
                                        ? `0 4px 20px rgba(239,68,68,0.6)`
                                        : `0 4px 15px rgba(120,119,198,0.3)`
                                    }}
                                  >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => setIsVoiceMode(true)}
                                    className="rounded-full backdrop-blur-md border border-white/20 w-8 h-8 sm:w-10 sm:h-10"
                                    style={{
                                      backgroundImage: `radial-gradient(circle at 30% 30%, rgba(120,219,255,0.3) 0%, rgba(120,255,187,0.25) 50%, transparent 100%)`,
                                      boxShadow: `0 4px 15px rgba(120,219,255,0.3)`
                                    }}
                                  >
                                    <AudioWaveform className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </>
                            ) : (
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  type="submit" 
                                  size="icon" 
                                  variant="ghost" 
                                  className="rounded-full backdrop-blur-md border border-white/20 w-8 h-8 sm:w-10 sm:h-10"
                                  style={{
                                    backgroundImage: `radial-gradient(circle at 30% 30%, rgba(120,219,255,0.5) 0%, rgba(255,219,120,0.45) 50%, rgba(120,255,187,0.4) 100%)`,
                                    boxShadow: `0 4px 20px rgba(120,219,255,0.5)`
                                  }}
                                >
                                  <SendHorizontal className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            )}
                        </div>
                    </form>

                </motion.div>


            </motion.div>
        )}
        
    </AnimatePresence>

    {/* Voice Agent Modal — rendered outside AnimatePresence so it manages its own presence */}
    <VoiceAgent 
      isVisible={isVoiceMode}
      onClose={() => setIsVoiceMode(false)}
      conversationHistory={conversation.reduce((acc: Array<{ user: string; model: string }>, message, index) => {
        if (message.role === 'user' && conversation[index + 1]?.role === 'model') {
          acc.push({
            user: message.content,
            model: conversation[index + 1].content,
          });
        }
        return acc;
      }, [])}
      onAddMessage={handleAddMessage}
    />
    </>
  );
}
