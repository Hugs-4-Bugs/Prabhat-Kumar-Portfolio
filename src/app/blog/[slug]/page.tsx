// src/app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { blogData } from '@/lib/blogs';
import { Calendar, Clock, PanelRightOpen, PanelRightClose } from 'lucide-react';
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
  
  // On mobile, the sidebar acts as an overlay. This ensures the body doesn't scroll behind it.
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
        
        {/* Sidebar Toggle Button */}
        <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-full shadow-lg bg-secondary/50 backdrop-blur-md"
                aria-label="Toggle Sidebar"
                data-cursor-hover
            >
              <AnimatePresence initial={false}>
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

        <div className="container mx-auto py-8 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            
            {/* Main Content Area */}
            <main className={cn(
              "transition-all duration-500 ease-in-out",
              isSidebarOpen ? "lg:col-span-2 xl:col-span-3" : "lg:col-span-3 xl:col-span-4"
            )}>
                 <span className={cn(
                    "inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4",
                    blog.tag === 'Paid'
                        ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-500 dark:text-yellow-300'
                        : 'bg-green-500/10 border-green-400/30 text-green-500 dark:text-green-300'
                 )}>
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

            {/* Sidebar with AI Tools & ToC */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside 
                        initial={{ width: 0, opacity: 0, x: 20 }}
                        animate={{ width: 'auto', opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-1 xl:col-span-1 hidden lg:block"
                    >
                        <div className="sticky top-20 space-y-8">
                            <TableOfContents content={blog.content} />
                            <AISection content={blog.content} />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar (Overlay) */}
             <AnimatePresence>
                {isSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-40">
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                         />
                         <motion.aside 
                            initial={{ x: '100%' }}
                            animate={{ x: '0%' }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed top-0 right-0 h-full w-full max-w-xs bg-secondary border-l border-border/50 z-50 overflow-y-auto"
                        >
                            <div className="p-6 space-y-8">
                                <TableOfContents content={blog.content} />
                                <AISection content={blog.content} />
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}
