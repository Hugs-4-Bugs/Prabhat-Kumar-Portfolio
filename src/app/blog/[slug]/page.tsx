// src/app/blog/[slug]/page.tsx
"use client";

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { blogData } from '@/lib/blogs';
import { Calendar, Clock, PanelRightOpen, PanelRightClose, X } from 'lucide-react';
import { AISection } from '@/components/blog/AISection';
import { Button } from '@/components/ui/button';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { cn } from '@/lib/utils';


// Helper function to get reading time
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = blogData.find((p) => p.slug === params.slug);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!blog) {
    notFound();
  }

  const readingTime = calculateReadingTime(blog.content);

  // Stop body scroll when sidebar is open on mobile
  // This is a common pattern to prevent background scrolling when an overlay is active
  useState(() => {
    if (typeof window !== 'undefined' && isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-background text-foreground min-h-screen relative">
       <div className="container mx-auto py-8 px-4 md:px-8">
        
        {/* Toggle Sidebar Button - Visible on all screens */}
        <div className="fixed top-4 right-4 z-[60]">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-full shadow-lg bg-secondary/50 backdrop-blur-md"
                aria-label="Toggle Sidebar"
                data-cursor-hover
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  {isSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
                </motion.div>
              </AnimatePresence>
            </Button>
        </div>
        
        <div className={cn("transition-all duration-500 ease-in-out", isSidebarOpen ? "lg:mr-[420px]" : "lg:mr-0")}>
            {/* Main Content */}
            <main>
                 <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4 ${
                    blog.tag === 'Paid'
                        ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-500 dark:text-yellow-300'
                        : 'bg-green-500/10 border-green-400/30 text-green-500 dark:text-green-300'
                }`}
                >
                {blog.tag}
                </span>

                <h1 className="font-headline text-3xl md:text-5xl text-foreground break-words mb-4">
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
       </div>

       {/* Sidebar with AI Tools & ToC */}
        <AnimatePresence>
            {isSidebarOpen && (
                <motion.aside 
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-0 right-0 h-full w-full max-w-md lg:max-w-sm xl:max-w-md bg-secondary/50 backdrop-blur-xl border-l border-border/50 z-50 overflow-y-auto"
                >
                    <div className="p-6 space-y-8">
                        <TableOfContents content={blog.content} />
                        <AISection content={blog.content} />
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    </div>
  );
}
