// src/components/blog/BlogViewer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, List, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import type { Blog } from "@/lib/types";
import { AISection } from "./AISection";
import { Button } from "../ui/button";
import { useWindowSize } from 'react-use';

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function BlogViewer({ blog, onClose, onBookmark, isBookmarked }: { blog: Blog | null; onClose: () => void; onBookmark: (slug: string) => void; isBookmarked: boolean; }) {
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

  const readingTime = blog ? calculateReadingTime(blog.content) : 0;

  const SidebarContent = () => (
    <div className="p-6 md:p-0">
        <Button 
            onClick={() => blog && onBookmark(blog.slug)}
            variant="outline" 
            className="w-full mb-8 bg-background/50 border-border hover:bg-secondary"
        >
            <Bookmark className={`mr-2 h-4 w-4 transition-all ${isBookmarked ? 'text-yellow-400 fill-yellow-400/20' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-headline text-lg text-primary flex items-center gap-2">
          <List className="h-5 w-5"/>
          Table of Contents
        </h3>
      </div>
      <ul className="space-y-2 mb-8">
        {toc.map(({ id, level, text }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const contentWrapper = document.querySelector(".blog-content-wrapper");
                const element = contentRef.current?.querySelector(`#${id}`);
                if (contentWrapper && element) {
                  const topPos = (element as HTMLElement).offsetTop;
                  contentWrapper.scrollTo({ top: topPos, behavior: 'smooth' });
                }
              }}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
      <AISection />
    </div>
  );
  
  return (
    <AnimatePresence>
      {blog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 top-16 bg-background/95 backdrop-blur-lg z-40 overflow-hidden"
        >
            <div className="container mx-auto h-full flex items-start p-4 md:p-8">
                {/* Scrollable Main Content */}
                <div className="flex-grow h-full overflow-y-auto blog-content-wrapper pr-8">
                    <main ref={contentRef} className="max-w-4xl mx-auto pb-32">
                        <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4 ${
                            blog.tag === 'Paid'
                                ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-500 dark:text-yellow-300'
                                : 'bg-green-500/10 border-green-400/30 text-green-500 dark:text-green-300'
                        }`}
                        >
                        {blog.tag}
                        </span>
                        <h1 className="font-headline text-3xl md:text-5xl text-foreground break-words">
                        {blog.title}
                        </h1>
                        <div className="flex items-center flex-wrap space-x-4 text-muted-foreground mt-4 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{readingTime} min read</span>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert prose-lg max-w-none text-foreground 
                                                prose-headings:text-primary prose-headings:font-headline
                                                prose-h2:text-3xl prose-h3:text-2xl
                                                prose-a:text-primary hover:prose-a:text-primary/80 transition-colors
                                                prose-strong:text-foreground
                                                prose-em:text-primary/90
                                                prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                                                prose-ul:list-disc prose-ul:marker:text-primary
                                                prose-ol:list-decimal prose-ol:marker:text-primary
                                                prose-code:bg-secondary prose-code:p-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-primary
                                                prose-pre:bg-secondary/80 prose-pre:p-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-border"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </main>
                </div>

                {/* Fixed Right Sidebar for Desktop */}
                <aside className="hidden md:block w-80 flex-shrink-0 h-full overflow-y-auto">
                    <div className="sticky top-0">
                        <SidebarContent />
                    </div>
                </aside>
            </div>
            
            {/* Global Close Button */}
            <div className="fixed top-20 right-4 z-50">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground bg-background/50 hover:bg-secondary backdrop-blur-sm">
                    <X className="h-6 w-6" />
                </Button>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
