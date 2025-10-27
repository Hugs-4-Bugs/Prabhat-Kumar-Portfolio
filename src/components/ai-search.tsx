"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Balancer from "react-wrap-balancer";
import { Sparkles, Loader2, X, Search, Mic, Keyboard } from "lucide-react";
import { getAISearchResponse, getAIAudio } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function AISearch() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ answer: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(true);
  
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(async () => {
      setResult(null);
      const response = await getAISearchResponse(query);

      if (response.success && response.answer) {
        setResult({ answer: response.answer });
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
      }
    });
  };

  const handleClose = () => {
    if (audio) {
        audio.pause();
    }
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-x-0 top-0 z-[1000] p-4 bg-background/80 backdrop-blur-lg"
        >
            <div className="container max-w-4xl mx-auto">
                <div className="relative">
                    <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="icon" onClick={handleClose} data-cursor-hover>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close AI Search</span>
                        </Button>
                    </div>

                    <div className="text-center mb-8 pt-8">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                            <Balancer>
                                Ask <span className="text-primary">Sharma</span> AI
                            </Balancer>
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Your personal guide to Prabhat Kumar's portfolio.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything about Prabhat's skills, projects, or experience..."
                            className="w-full h-14 pl-12 pr-24 rounded-full border bg-secondary/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            data-cursor-hover
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button type="submit" size="icon" variant="ghost" disabled={isPending}>
                                <Keyboard />
                            </Button>
                        </div>
                    </form>

                    <AnimatePresence>
                    {isPending && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center justify-center text-center p-8 space-y-4"
                        >
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Sharma AI is thinking...</p>
                        </motion.div>
                    )}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose prose-lg dark:prose-invert max-w-none mx-auto p-6 bg-secondary/30 rounded-lg border"
                        >
                            <div className="flex items-start gap-4">
                                <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.answer.replace(/\n/g, '<br />') }} />
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
}