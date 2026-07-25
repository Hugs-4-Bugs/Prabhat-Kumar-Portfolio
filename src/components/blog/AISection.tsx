// src/components/blog/AISection.tsx
"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Send, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getBlogSummary, getBlogAnswer } from "@/app/blog/actions";
import { useToast } from "@/hooks/use-toast";
import Balancer from "react-wrap-balancer";

interface AISectionProps {
  content: string;
}

export function AISection({ content }: AISectionProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<{ user: string; ai: string }[]>([]);
  
  const [isSummaryLoading, startSummaryTransition] = useTransition();
  const [isQuestionLoading, startQuestionTransition] = useTransition();

  const handleGenerateSummary = () => {
    startSummaryTransition(async () => {
      setSummary("");
      const result = await getBlogSummary(content);
      if (result.success) {
        setSummary(result.summary ?? "");
      } else {
        toast({ title: "Summary Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    startQuestionTransition(async () => {
      const currentQuestion = question;
      setQuestion("");

      const result = await getBlogAnswer(content, currentQuestion);

      const newConversationEntry = {
        user: currentQuestion,
        ai: result.success ? result.answer : result.message || "An error occurred.",
      };

      setConversation(prev => [...prev, newConversationEntry]);

      if (!result.success) {
        toast({ title: "AI Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="relative rounded-2xl border border-primary/30 bg-secondary/30 p-6 backdrop-blur-xl group">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-headline text-xl text-primary"
        data-cursor-hover
      >
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6" />
          AI Tools
        </div>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "1.5rem" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-6">
              {/* AI Summary */}
              <div>
                <h4 className="font-semibold text-primary mb-3">AI Summary</h4>
                <Button onClick={handleGenerateSummary} disabled={isSummaryLoading} size="sm" variant="secondary" className="text-foreground" data-cursor-hover>
                  {isSummaryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  {isSummaryLoading ? "Generating..." : "Generate Summary"}
                </Button>
                <AnimatePresence>
                {isSummaryLoading && (
                   <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Bot size={16} className="text-primary animate-pulse"/>
                      <span>AI is reading and summarizing...</span>
                   </div>
                )}
                {summary && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-muted-foreground border-l-2 border-primary/50 pl-4"
                  >
                    <Balancer>{summary}</Balancer>
                  </motion.p>
                )}
                </AnimatePresence>
              </div>

              {/* AI Q&A */}
              <div>
                <h4 className="font-semibold text-primary mb-3">Ask a Question</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {conversation.map((entry, i) => (
                    <motion.div 
                      key={i} 
                      className="text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-semibold text-foreground">You: <span className="font-normal">{entry.user}</span></p>
                      <p className="text-primary/90 mt-1 flex gap-2">
                        <Bot size={16} className="flex-shrink-0 mt-0.5"/> 
                        <Balancer>{entry.ai}</Balancer>
                      </p>
                    </motion.div>
                  ))}
                   {isQuestionLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bot size={16} className="text-primary animate-pulse"/>
                        <span>Thinking...</span>
                      </div>
                    )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about this blog..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskQuestion();
                      }
                    }}
                    className="bg-background/60 border-primary/40 text-foreground"
                    rows={1}
                    disabled={isQuestionLoading}
                    data-cursor-hover
                  />
                  <Button onClick={handleAskQuestion} disabled={isQuestionLoading || !question.trim()} size="icon" variant="secondary" className="text-foreground flex-shrink-0" data-cursor-hover>
                    <Send />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
