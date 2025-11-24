// src/components/blog/BlogViewer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, List, Sparkles, PanelRightClose, PanelRightOpen } from "lucide-react";
import type { Blog } from "@/lib/types";
import { AISection } from "./AISection";

interface BlogViewerProps {
  blog: Blog | null;
  onClose: () => void;
}

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function BlogViewer({ blog, onClose }: BlogViewerProps) {
  const [toc, setToc] = useState<{ id: string; level: number; text: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: contentRef });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (blog && contentRef.current) {
      // Use a timeout to ensure content is rendered before querying headings
      setTimeout(() => {
        if (!contentRef.current) return;
        const headings = Array.from(
          contentRef.current.querySelectorAll("h2, h3")
        );
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
      }, 100);
    } else {
        setToc([]);
    }
  }, [blog]);
  
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    if (blog) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [blog]);


  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const readingTime = blog ? calculateReadingTime(blog.content) : 0;

  return (
    <AnimatePresence>
      {blog && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-slate-950 z-50 flex"
        >
          {/* Reading Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-cyan-400 origin-left z-20"
            style={{ scaleX: scrollYProgress }}
          />

          {/* Main Content Area */}
          <main ref={contentRef} className="flex-grow overflow-y-auto p-8 md:p-12 lg:p-16 transition-all duration-300" style={{ paddingRight: isSidebarOpen ? '21rem' : '4rem' }}>
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span
                  className={`inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4 ${
                    blog.tag === 'Paid'
                      ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
                      : 'bg-green-500/10 border-green-400/30 text-green-300'
                  }`}
                >
                  {blog.tag}
                </span>
                <h1 className="font-headline text-4xl md:text-6xl text-white mb-6">
                  {blog.title}
                </h1>
                <div className="flex items-center space-x-6 text-slate-400 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </motion.div>

              {/* Blog Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="prose prose-invert prose-lg max-w-none text-slate-300 
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
            </div>
          </main>

          {/* Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.aside 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 h-full w-80 flex-shrink-0 bg-slate-900/50 border-l border-slate-800 p-8 overflow-y-auto"
              >
                <div className="sticky top-8">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 transition-colors mb-8 text-slate-300"
                  >
                    <PanelRightClose className="h-5 w-5" />
                    Hide Panel
                  </button>
                  
                  <h3 className="font-headline text-xl text-cyan-300 mb-4 flex items-center gap-3">
                    <List className="h-5 w-5"/>
                    Table of Contents
                  </h3>
                  <ul className="space-y-2">
                    {toc.map(({ id, level, text }) => (
                      <li key={id} style={{ marginLeft: `${(level - 2) * 1}rem` }}>
                        <a
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(id);
                          }}
                          className="text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                      <AISection />
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
          
          {/* Sidebar Toggle Button */}
          <AnimatePresence>
            {!isSidebarOpen && (
              <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="fixed top-24 right-6 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 text-white z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  <PanelRightOpen />
                </motion.button>
            )}
          </AnimatePresence>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="fixed top-6 right-6 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 text-white z-50"
            whileHover={{ scale: 1.1, rotate: 90 }}
          >
            <X />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
