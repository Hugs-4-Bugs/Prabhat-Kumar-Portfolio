
// src/components/sections/blogs.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useModal } from '@/context/ModalContext';

import { blogData } from "@/lib/blogs";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { BlogList } from "@/components/blog/BlogList";
import { FilterBar } from "@/components/blog/FilterBar";
import type { Blog } from "@/lib/types";

// A new component to encapsulate the logic for a single category
const BlogCategoryRow = ({ categoryName, blogs, onRead, bookmarks, onBookmark }: {
  categoryName: string;
  blogs: Blog[];
  onRead: (blog: Blog) => void;
  bookmarks: string[];
  onBookmark: (slug: string) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10; // 10px buffer
      const isAtStart = scrollLeft <= 10;

      if (isAtEnd) {
        setScrollDirection('left');
      } else if (isAtStart) {
        setScrollDirection('right');
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="blog-category-container">
      <div className="flex justify-between items-center px-4 md:px-8">
        <h3 className="text-3xl font-bold font-headline text-primary mb-8">{categoryName}</h3>
        <div className="md:hidden flex items-center text-sm text-primary/80 mb-8">
           <AnimatePresence mode="wait">
            <motion.div
              key={scrollDirection}
              initial={{ opacity: 0, x: scrollDirection === 'right' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: scrollDirection === 'right' ? 10 : -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              {scrollDirection === 'right' ? (
                <>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </motion.div>
                  Swipe
                </>
              ) : (
                <>
                  Swipe
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                  </motion.div>
                </>
              )}
            </motion.div>
           </AnimatePresence>
        </div>
      </div>
      <div ref={scrollContainerRef} className="horizontal-scroll-container">
         <div className="flex gap-8 px-4 md:px-8 blog-horizontal-track">
           <BlogList
              blogs={blogs}
              onRead={onRead}
              bookmarks={bookmarks}
              onBookmark={onBookmark}
            />
        </div>
      </div>
    </div>
  );
}


export function Blogs() {
  const { openModal } = useModal();
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleRead = (blog: Blog) => {
    if (blog.tag === "Paid") {
      openModal();
    }
  };

  const handleBookmark = (slug: string) => {
    if (bookmarks.includes(slug)) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogData.filter(blog => {
        const matchesQuery = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = 
          activeFilter === 'All' ||
          (activeFilter === 'Paid' && blog.tag === 'Paid') ||
          (activeFilter === 'Free' && blog.tag === 'Free') ||
          (activeFilter === 'Bookmarked' && bookmarks.includes(blog.slug));
        
        return matchesQuery && matchesCategory;
      });
  }, [searchQuery, activeFilter, bookmarks]);

  const groupedAndFilteredBlogs = useMemo(() => {
    return filteredBlogs.reduce((acc, blog) => {
      const category = blog.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(blog);
      return acc;
    }, {} as Record<string, Blog[]>);
  }, [filteredBlogs]);

  return (
    <Section id="blogs" className="bg-secondary/30 py-24">
        <div className="sticky top-0 z-20 bg-background/80 dark:bg-slate-950/80 backdrop-blur-sm py-12">
            <SectionHeading>My Blogs</SectionHeading>
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
        </div>

        <div className="space-y-12">
            {Object.entries({
                'Technical': groupedAndFilteredBlogs['Technical'] || [],
                'Non-Technical': groupedAndFilteredBlogs['Non-Technical'] || [],
                'Books': groupedAndFilteredBlogs['Books'] || [],
            }).map(([categoryName, blogs]) => (
                blogs.length > 0 && (
                  <BlogCategoryRow
                    key={categoryName}
                    categoryName={categoryName}
                    blogs={blogs}
                    onRead={handleRead}
                    bookmarks={bookmarks}
                    onBookmark={handleBookmark}
                  />
                )
            ))}
        </div>
    </Section>
  );
}
