
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import { Mic, MicOff, Send, Bot, User, X } from 'lucide-react';
import { useAudio, useToggle } from 'react-use';
import Lenis from '@studio-freight/lenis';


import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIResponse, getAIAudio } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import listeningAnimation from '@/lib/listening-animation.json';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  isSearchOpen: boolean;
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function AIAssistant({ isSearchOpen }: AIAssistantProps) {
  const { toast } = useToast();
  const [isOpen, toggleOpen] = useToggle(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [audioComponent, setAudioComponent] = useState<React.ReactElement | null>(null);
  const audioStateRef = useRef<any>(null);
  const audioControlsRef = useRef<any>(null);

  // Load conversation from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('assistant-conversation');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('assistant-conversation', JSON.stringify(messages));
  }, [messages]);
  
  // Inactivity timer logic
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setMessages([]);
      localStorage.removeItem('assistant-conversation');
      toast({
        title: "Chat Cleared",
        description: "Your conversation has been cleared due to inactivity.",
      });
    }, INACTIVITY_TIMEOUT);
  }, [toast]);

  useEffect(() => {
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll'];
    
    const resetTimer = () => resetInactivityTimer();

    if (isOpen) {
      resetInactivityTimer();
      activityEvents.forEach(event => {
        window.addEventListener(event, resetTimer);
      });
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isOpen, resetInactivityTimer]);


  useEffect(() => {
    // This entire component only renders on the client, but `useAudio`
    // can still cause issues if not handled carefully.
    // We create a simple functional component here to encapsulate the hook
    // and then render it dynamically.
    const AudioPlayer = () => {
      const [audio, state, controls] = useAudio({ src: '' });
      audioStateRef.current = state;
      audioControlsRef.current = controls;
      return audio;
    };
    setAudioComponent(<AudioPlayer />);
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const query = text || userInput;
    if (!query.trim()) return;

    if (audioControlsRef.current) {
        audioControlsRef.current.pause();
    }
    
    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setUserInput('');
    setIsAITyping(true);

    try {
      // Correctly build the history array
      const history = messages.reduce((acc: Array<{ user: string; model: string }>, msg, index) => {
        if (msg.sender === 'user') {
          const nextMsg = messages[index + 1];
          if (nextMsg && nextMsg.sender === 'ai') {
            acc.push({
              user: msg.text,
              model: nextMsg.text,
            });
          }
        }
        return acc;
      }, []);

      const response = await getAIResponse(query, history);
      setIsAITyping(false);

      if (response.success && response.answer) {
        setMessages(prev => [...prev, { sender: 'ai', text: response.answer as string }]);
        const audioResponse = await getAIAudio(response.answer as string);
        if(audioResponse.success && audioResponse.audio && audioControlsRef.current) {
            audioControlsRef.current.src(audioResponse.audio);
            audioControlsRef.current.play();
        } else if (!audioResponse.success) {
           toast({ title: 'Audio Error', description: audioResponse.message, variant: 'destructive' });
        }
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: response.message || 'An error occurred.' }]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setIsAITyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    }
  }, [userInput, toast, messages]);

  // Speech-to-text handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported by this browser.");
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };
    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast({ title: 'Voice Error', description: `Could not recognize speech: ${event.error}`, variant: 'destructive'});
      setIsListening(false);
    };
     recognitionRef.current.onstart = () => {
      setIsListening(true);
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      audioControlsRef.current?.pause();
      recognitionRef.current?.start();
    }
  };
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleSend("Hello");
    }
  }, [isOpen, messages.length, handleSend]);

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollViewport) {
      scrollViewport.scrollTo({ top: scrollViewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isAITyping]);
  
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && isOpen) {
      const stopPropagation = (e: WheelEvent) => e.stopPropagation();
      chatContainer.addEventListener('wheel', stopPropagation);
      return () => {
        chatContainer.removeEventListener('wheel', stopPropagation);
      };
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 md:right-8 z-[999] w-[calc(100vw-2rem)] max-w-md"
          >
            <Card className="h-[70vh] flex flex-col shadow-2xl dark:shadow-primary/10">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <Bot className="text-primary" />
                  <CardTitle className="font-headline text-xl">QuantumAI</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleOpen} data-cursor-hover>
                  <X size={20} />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {messages.map((msg, i) => (
                      <div key={i} className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : '')}>
                        {msg.sender === 'ai' && <Bot size={24} className="text-primary shrink-0" />}
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-secondary rounded-bl-none'
                          )}
                        >
                          {msg.text}
                        </div>
                         {msg.sender === 'user' && <User size={24} className="text-muted-foreground shrink-0" />}
                      </div>
                    ))}
                    {isAITyping && (
                      <div className="flex items-end gap-2">
                        <Bot size={24} className="text-primary shrink-0" />
                        <div className="bg-secondary rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-2">
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                {isListening && (
                    <div className="flex justify-center items-center p-2 border-t">
                        <Lottie animationData={listeningAnimation} loop={true} style={{width: 60, height: 60}}/>
                        <p className="text-sm text-muted-foreground">Listening...</p>
                    </div>
                )}
                <div className="p-4 border-t flex items-center gap-2">
                  <div style={{ display: 'none' }}>{audioComponent}</div>
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about Prabhat..."
                    rows={1}
                    className="flex-grow resize-none min-h-0"
                    disabled={isAITyping || isListening}
                    data-cursor-hover
                  />
                  <Button size="icon" onClick={toggleListening} disabled={!recognitionRef.current || isAITyping} variant={isListening ? "destructive" : "outline"} data-cursor-hover>
                    {isListening ? <MicOff /> : <Mic />}
                  </Button>
                  <Button size="icon" onClick={() => handleSend()} disabled={!userInput.trim() || isAITyping || isListening} data-cursor-hover>
                    <Send />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-[1000]"
          >
            <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={toggleOpen} data-cursor-hover>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'x' : 'bot'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X /> : <Bot />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

