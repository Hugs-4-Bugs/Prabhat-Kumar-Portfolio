// src/components/blog/BlogViewer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Sparkles, PanelRightOpen, PanelRightClose, List, ChevronUp, ChevronDown } from "lucide-react";
import type { Blog } from "@/lib/types";
import { AISection } from "./AISection";
import { Button } from "../ui/button";
import { useWindowSize } from 'react-use';


const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function BlogViewer({ blog, onClose }: { blog: Blog | null; onClose: () => void; }) {
  const [toc, setToc] = useState<{ id: string; level: number; text: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 768; // md breakpoint

  useEffect(() => {
    if (blog) {
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

  useEffect(() => {
      // Collapse sidebar by default on mobile
      setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const readingTime = blog ? calculateReadingTime(blog.content) : 0;

  const SidebarContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline text-lg text-cyan-300 flex items-center gap-2">
            <List className="h-5 w-5"/>
            Table of Contents
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-400 md:hidden">
            <X size={18}/>
        </Button>
      </div>
      <ul className="space-y-2 mb-8">
      {toc.map(({ id, level, text }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}>
          <a
              href={`#${id}`}
              onClick={(e) => {
              e.preventDefault();
              const contentEl = contentRef.current?.parentElement;
              const element = contentRef.current?.querySelector(`#${id}`);
              if (contentEl && element) {
                const topPos = element.offsetTop;
                contentEl.scrollTo({ top: topPos - 80, behavior: 'smooth' }); // Offset for sticky header
              }
              }}
              className="text-slate-400 hover:text-cyan-300 transition-colors text-sm"
          >
              {text}
          </a>
          </li>
      ))}
      </ul>
      <AISection />
    </>
  );

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
                <div className="flex items-center flex-wrap space-x-4 text-slate-400 mt-2">
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
            
            <div className="flex flex-grow overflow-hidden relative">
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
              
                {/* Desktop Sidebar */}
                <AnimatePresence>
                {!isMobile && isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0, x: 100 }}
                        animate={{ width: 320, opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: 100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex-shrink-0 h-full overflow-y-auto bg-slate-900/50 border-l border-slate-800 p-6 hidden md:block"
                    >
                      <SidebarContent />
                    </motion.aside>
                )}
                </AnimatePresence>

                {/* Sidebar Toggle for Desktop */}
                {!isMobile && !isSidebarOpen && (
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 hidden md:block">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <PanelRightOpen />
                        </Button>
                    </div>
                )}

                 {/* Collapsible Panel for Mobile */}
                {isMobile && (
                    <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full p-3 flex justify-center items-center text-cyan-300">
                             {isSidebarOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronUp className="h-5 w-5 mr-2" />}
                             AI Tools & Contents
                        </button>
                        <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 max-h-[40vh] overflow-y-auto">
                                    <SidebarContent />
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
