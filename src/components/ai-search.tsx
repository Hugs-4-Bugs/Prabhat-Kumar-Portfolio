
"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Sparkles, Loader2, X, Search, Mic, MicOff, Keyboard, User } from "lucide-react";
import Lottie from "lottie-react";

import { getAISearchResponse, getAIAudio } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import listeningAnimation from "@/lib/listening-animation.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AISearchProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AISearch({ isVisible, onClose }: AISearchProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Load conversation from localStorage on initial render
  useEffect(() => {
    if (isVisible) {
      const savedConversation = localStorage.getItem('ai-search-conversation');
      if (savedConversation) {
        setConversation(JSON.parse(savedConversation));
      }
    }
  }, [isVisible]);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-search-conversation', JSON.stringify(conversation));
  }, [conversation]);

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  }, [audio]);
  
  const handleSubmit = useCallback(async (currentQuery: string) => {
    if (!currentQuery.trim()) return;

    stopAudio();
    
    const newConversation: Message[] = [...conversation, { role: 'user', content: currentQuery }];
    setConversation(newConversation);
    setQuery("");

    startTransition(async () => {
      const history = newConversation.filter(m => m.role === 'model').map((m, i) => ({
          user: newConversation[i * 2]?.content || '',
          model: m.content,
      }));

      const response = await getAISearchResponse(currentQuery, history);

      if (response.success && response.answer) {
        setConversation(prev => [...prev, { role: 'model', content: response.answer as string }]);
        
        const audioResponse = await getAIAudio(response.answer);
         if(audioResponse.success && audioResponse.audio) {
            const audioInstance = new Audio(audioResponse.audio);
            setAudio(audioInstance);
            audioInstance.play();
        } else if (!audioResponse.success) {
           toast({ title: 'Audio Error', description: audioResponse.message, variant: 'destructive' });
        }

      } else {
        toast({
          title: "AI Search Error",
          description: response.message || "An error occurred.",
          variant: "destructive",
        });
        // Revert conversation state if API call fails
        setConversation(prev => prev.slice(0, -1));
      }
    });
  }, [stopAudio, toast, conversation]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported by this browser.");
      return;
    }
    
    if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSubmitRef.current(transcript); 
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            toast({ title: 'Voice Error', description: `Could not recognize speech: ${event.error}`, variant: 'destructive'});
            setIsListening(false);
        };
        
        recognition.onstart = () => {
            setIsListening(true);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
    }
  }, [toast]);
  
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopAudio();
      setQuery('');
      recognitionRef.current.start();
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

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-lg flex items-center justify-center"
            >
                <div className="absolute top-4 right-4 z-20">
                    <Button variant="ghost" size="icon" onClick={handleClose} data-cursor-hover>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close AI Search</span>
                    </Button>
                </div>
                
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ ease: "easeOut" }}
                    className="w-full max-w-4xl h-full flex flex-col pt-12 pb-8 px-4"
                >
                    {conversation.length === 0 && (
                        <div className="flex-shrink-0 text-center pb-8">
                            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                                <Balancer>
                                    Ask <span className="text-primary">Sharma</span> AI
                                </Balancer>
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Your personal guide to Prabhat Kumar's portfolio.
                            </p>
                        </div>
                    )}
                    
                    <ScrollArea className="flex-grow -mx-4" ref={scrollAreaRef}>
                        <div className="min-h-[100px] px-4 pb-8 space-y-8">
                        
                        {conversation.map((message, index) => (
                           <div key={index}>
                                {message.role === 'user' ? (
                                    <div className="flex items-start gap-4 justify-end">
                                        <div className="p-4 bg-primary text-primary-foreground rounded-2xl rounded-br-none max-w-2xl">
                                            {message.content}
                                        </div>
                                        <User className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="prose prose-lg dark:prose-invert max-w-none"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                                            <div 
                                                className="whitespace-pre-wrap" 
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
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col items-center justify-center text-center p-8 space-y-2"
                            >
                                <Lottie animationData={listeningAnimation} loop={true} style={{width: 80, height: 80}}/>
                                <p className="text-muted-foreground">Listening...</p>
                            </motion.div>
                        )}
                        {isPending && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-start gap-4 text-center p-8"
                            >
                                <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1 animate-pulse" />
                                <div className="flex items-center gap-2">
                                     <p className="text-muted-foreground">Sharma AI is thinking...</p>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        </div>
                    </ScrollArea>
                    
                    <form onSubmit={handleFormSubmit} className="relative mt-8 flex-shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            className="w-full h-14 pl-12 pr-32 rounded-full border bg-secondary/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            disabled={isPending || isListening}
                            data-cursor-hover
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button type="button" size="icon" variant={isListening ? "destructive" : "ghost"} onClick={toggleListening} disabled={isPending || !recognitionRef.current}>
                                {isListening ? <MicOff /> : <Mic />}
                            </Button>
                            <Button type="submit" size="icon" variant="ghost" disabled={isPending || isListening || !query.trim()}>
                                <Keyboard />
                            </Button>
                        </div>
                    </form>

                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}

    