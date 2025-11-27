// src/components/blog/TableOfContents.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from '@/lib/utils';

interface TocEntry {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const headingElements = Array.from(tempDiv.querySelectorAll('h2, h3'));

    const parsedHeadings = headingElements.map((el, index) => {
      const text = el.textContent || '';
      const level = parseInt(el.tagName.substring(1), 10);
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + `-${index}`;
      el.id = id; // This won't affect the rendered output but helps in logic
      return { level, text, id };
    });
    setHeadings(parsedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    const elements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    elements.forEach(el => el && observer.observe(el));

    return () => {
      elements.forEach(el => el && observer.unobserve(el));
    };
  }, [headings]);
  
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
  }


  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-2xl border border-border bg-secondary/30 p-6 backdrop-blur-xl group">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between font-headline text-xl text-foreground"
            data-cursor-hover
        >
            <div className="flex items-center gap-3">
            <List className="h-6 w-6" />
            Table of Contents
            </div>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
         <AnimatePresence>
            {isOpen && (
                 <motion.nav
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: "1.5rem" }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                 >
                    <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li key={heading.id} className={cn(
                            'text-sm font-medium transition-colors duration-200',
                            {
                                'pl-4': heading.level === 3,
                                'text-primary font-bold': activeId === heading.id,
                                'text-muted-foreground hover:text-foreground': activeId !== heading.id
                            }
                        )}>
                        <a 
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToId(heading.id);
                            }}
                            data-cursor-hover
                        >
                            {heading.text}
                        </a>
                        </li>
                    ))}
                    </ul>
                </motion.nav>
            )}
         </AnimatePresence>
    </div>
  );
}
