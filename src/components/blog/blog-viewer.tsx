
"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { X, Bot, HelpCircle, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { Blog } from '@/lib/types';
import { siteConfig } from '@/lib/data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BlogViewerProps {
  blog: Blog;
  onClose: () => void;
}

const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export function BlogViewer({ blog, onClose }: BlogViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  
  const readingTime = estimateReadingTime(blog.content);
  
  const { scrollYProgress } = useScroll({ container: contentRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Timeout to ensure content is rendered before querySelectorAll runs
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const headingElements = contentRef.current.querySelectorAll('h2, h3');
        const extractedHeadings = Array.from(headingElements).map((el, i) => {
          const id = `heading-${i}`;
          el.id = id;
          return {
            id,
            text: el.textContent || '',
            level: parseInt(el.tagName.substring(1), 10)
          };
        });
        setHeadings(extractedHeadings);
      }
    }, 100); // A small delay
    return () => clearTimeout(timer);
  }, [blog]);

  const handleTocClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerateSummary = () => {
    // Dummy AI logic
    setAiSummary(`This is an AI-generated summary of "${blog.title}". It discusses the main points of the content in a concise manner...`);
  };

  const handleAskQuestion = () => {
    // Dummy AI logic
    if (aiQuestion.trim()) {
      setAiAnswer(`This is a dummy answer to your question: "${aiQuestion}". In a real scenario, an AI would provide a detailed response based on the article's content.`);
      setAiQuestion('');
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      <motion.div className="h-1.5 bg-primary origin-left" style={{ scaleX }} />
      
      <header className="p-4 flex items-center justify-between border-b shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-headline truncate" title={blog.title}>{blog.title}</h2>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Badge variant={blog.tag === 'Paid' ? 'destructive' : 'secondary'}>{blog.tag}</Badge>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
            <span>&bull;</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-cursor-hover>
          <X size={24} />
        </Button>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Table of Contents */}
        <aside className="hidden lg:block w-64 border-r p-4 shrink-0">
          <ScrollArea className="h-full">
            <h3 className="font-semibold mb-4">Table of Contents</h3>
            <ul className="space-y-2 text-sm">
              {headings.map(heading => (
                <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
                  <button 
                    onClick={() => handleTocClick(heading.id)} 
                    className="text-left hover:text-primary transition-colors"
                    data-cursor-hover
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <ScrollArea className="flex-grow" ref={contentRef}>
          <article className="prose dark:prose-invert max-w-none p-6 md:p-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </ScrollArea>

        {/* AI Section */}
        <aside className="w-full md:w-80 border-l p-4 shrink-0 flex flex-col gap-4">
          <ScrollArea className="h-full">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between font-semibold w-full cursor-pointer group mb-2">
                  <h3 className="flex items-center gap-2"><Bot size={18} /> AI Summary</h3>
                   <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 p-3 bg-secondary/50 rounded-md">
                    <Button onClick={handleGenerateSummary} size="sm" className="w-full" data-cursor-hover>Generate Summary</Button>
                    <AnimatePresence>
                    {aiSummary && (
                        <motion.p 
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            className="text-sm text-muted-foreground"
                        >{aiSummary}</motion.p>
                    )}
                    </AnimatePresence>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="mt-4" defaultOpen>
               <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between font-semibold w-full cursor-pointer group mb-2">
                    <h3 className="flex items-center gap-2"><HelpCircle size={18} /> Ask a Question</h3>
                    <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                 <div className="space-y-3 p-3 bg-secondary/50 rounded-md">
                    <Textarea 
                    placeholder="Ask anything about this blog..." 
                    rows={3} 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    data-cursor-hover
                    />
                    <Button onClick={handleAskQuestion} size="sm" className="w-full" data-cursor-hover>Ask AI</Button>
                    <AnimatePresence>
                    {aiAnswer && (
                        <motion.p 
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            className="text-sm text-muted-foreground"
                        >{aiAnswer}</motion.p>
                    )}
                    </AnimatePresence>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </aside>
      </div>
    </motion.div>
  );
}
