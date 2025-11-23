
"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { X, Bot, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { Blog } from '@/lib/types';
import { siteConfig } from '@/lib/data';

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
        </aside>

        {/* Main Content */}
        <ScrollArea className="flex-grow" ref={contentRef}>
          <article className="prose dark:prose-invert max-w-none p-6 md:p-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </ScrollArea>

        {/* AI Section */}
        <aside className="w-full md:w-80 border-l p-4 shrink-0 flex flex-col gap-6">
          {/* AI Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><Bot size={18} /> AI Summary</h3>
            <Button onClick={handleGenerateSummary} size="sm" className="w-full" data-cursor-hover>Generate Summary</Button>
            {aiSummary && <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">{aiSummary}</p>}
          </div>

          {/* AI Q&A */}
          <div className="space-y-3 mt-auto">
            <h3 className="font-semibold flex items-center gap-2"><HelpCircle size={18} /> Ask a Question</h3>
            <Textarea 
              placeholder="Ask anything about this blog..." 
              rows={3} 
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              data-cursor-hover
            />
            <Button onClick={handleAskQuestion} size="sm" className="w-full" data-cursor-hover>Ask AI</Button>
            {aiAnswer && <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">{aiAnswer}</p>}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
