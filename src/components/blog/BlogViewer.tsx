// src/components/blog/BlogViewer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Sparkles, PanelRightOpen, PanelRightClose, List } from "lucide-react";
import type { Blog } from "@/lib/types";
import { AISection } from "./AISection";
import { Button } from "../ui/button";

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function BlogViewer({ blog, onClose }: { blog: Blog | null; onClose: () => void; }) {
  const [toc, setToc] = useState<{ id: string; level: number; text: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (blog) {
      // Small delay to let content render before generating ToC
      setTimeout(() => {
        if (contentRef.current) {
          const headings = Array.from(contentRef.current.querySelectorAll("h2, h3"));
          const newToc = headings.map((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            return {
              id,
              level: parseInt(heading.tagName.substring(1)),
              text: heading.textContent || "",
            };
          });
          setToc(newToc);
        }
      }, 100);
    } else {
      setToc([]);
    }
  }, [blog]);

  const readingTime = blog ? calculateReadingTime(blog.content) : 0;

  return (
    <AnimatePresence>
      {blog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header flex justify-between items-start">
              <div>
                <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4 ${
                    blog.tag === 'Paid'
                      ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
                      : 'bg-green-500/10 border-green-400/30 text-green-300'
                  }`}
                >
                  {blog.tag}
                </span>
                <h1 className="font-headline text-2xl md:text-4xl text-white">
                  {blog.title}
                </h1>
                <div className="flex items-center space-x-4 text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex flex-grow overflow-hidden">
                <main ref={contentRef} className="modal-content flex-grow">
                    <div className="prose prose-invert prose-lg max-w-none text-slate-300 
                                prose-headings:text-cyan-300 prose-headings:font-headline
                                prose-h2:text-3xl prose-h3:text-2xl
                                prose-a:text-cyan-400 hover:prose-a:text-cyan-200 transition-colors
                                prose-strong:text-white
                                prose-em:text-purple-300
                                prose-blockquote:border-l-4 prose-blockquote:border-purple-400/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
                                prose-ul:list-disc prose-ul:marker:text-cyan-400
                                prose-ol:list-decimal prose-ol:marker:text-cyan-400
                                prose-code:bg-slate-800/80 prose-code:p-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-yellow-300
                                prose-pre:bg-slate-900/80 prose-pre:p-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-700"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </main>
              
                <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 h-full overflow-y-auto bg-slate-900/50 border-l border-slate-800 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline text-lg text-cyan-300 flex items-center gap-2">
                                <List className="h-5 w-5"/>
                                Table of Contents
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
                                <PanelRightClose />
                            </Button>
                        </div>
                        <ul className="space-y-2 mb-8">
                        {toc.map(({ id, level, text }) => (
                            <li key={id} style={{ marginLeft: `${(level - 2) * 0.5}rem` }}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => {
                                e.preventDefault();
                                const element = contentRef.current?.querySelector(`#${id}`);
                                element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-slate-400 hover:text-cyan-300 transition-colors text-sm"
                            >
                                {text}
                            </a>
                            </li>
                        ))}
                        </ul>
                        <AISection />
                    </motion.aside>
                )}
                </AnimatePresence>

                {!isSidebarOpen && (
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <PanelRightOpen />
                        </Button>
                    </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
