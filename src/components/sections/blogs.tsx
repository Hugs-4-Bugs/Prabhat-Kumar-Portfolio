// src/components/sections/blogs.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { blogData } from "@/lib/blogs";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { BlogList } from "@/components/blog/BlogList";
import { BlogViewer } from "@/components/blog/BlogViewer";
import { PaidModal } from "@/components/blog/PaidModal";
import { FilterBar } from "@/components/blog/FilterBar";
import type { Blog } from "@/lib/types";

export function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const body = document.body;
    if (selectedBlog || isPaidModalOpen) {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
    }
    // Cleanup function to ensure scroll is re-enabled on component unmount
    return () => {
      body.classList.remove('no-scroll');
    };
  }, [selectedBlog, isPaidModalOpen]);

  const handleRead = (blog: Blog) => {
    if (blog.tag === "Paid") {
      setIsPaidModalOpen(true);
    } else {
      setSelectedBlog(blog);
    }
  };

  const handleBookmark = (slug: string) => {
    if (bookmarks.includes(slug)) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }
  };

  const closeViewer = () => {
    setSelectedBlog(null);
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
    <Section id="blogs" className="bg-slate-950/90 py-24">
        <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-sm py-12">
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
                  <div key={categoryName} className="blog-category-container">
                      <h3 className="text-3xl font-bold font-headline text-cyan-300 mb-8 px-4 md:px-8">{categoryName}</h3>
                      <div className="horizontal-scroll-container">
                         <div className="flex gap-8 px-4 md:px-8 blog-horizontal-track">
                           <BlogList
                              blogs={blogs}
                              onRead={handleRead}
                              bookmarks={bookmarks}
                              onBookmark={handleBookmark}
                            />
                        </div>
                      </div>
                  </div>
                )
            ))}
        </div>
        
      <AnimatePresence>
        {selectedBlog && <BlogViewer blog={selectedBlog} onClose={closeViewer} />}
      </AnimatePresence>
      <PaidModal isOpen={isPaidModalOpen} onClose={() => setIsPaidModalOpen(false)} />
    </Section>
  );
}
