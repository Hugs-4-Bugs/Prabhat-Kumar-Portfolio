// src/components/sections/blogs.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";

import { blogData } from "@/lib/blogs";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { BlogList } from "@/components/blog/BlogList";
import { BlogViewer } from "@/components/blog/BlogViewer";
import { PaidModal } from "@/components/blog/PaidModal";
import { FilterBar } from "@/components/blog/FilterBar";
import type { Blog } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks();
  
  const [filters, setFilters] = useState<Record<string, { query: string; category: string }>>({
    Technical: { query: '', category: 'All' },
    'Non-Technical': { query: '', category: 'All' },
    Books: { query: '', category: 'All' },
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis(ScrollTrigger.update);
  
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lenis, filters]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const categories = gsap.utils.toArray<HTMLElement>('.blog-category-container');
      
      categories.forEach(category => {
        const track = category.querySelector('.blog-horizontal-track') as HTMLElement;
        if (!track) return;
        
        const trackWidth = track.scrollWidth;
        const containerWidth = category.clientWidth;
        
        // Only apply the animation if the track is wider than the container
        if (trackWidth > containerWidth) {
          gsap.to(track, {
            x: () => -(trackWidth - containerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: category,
              start: "top top",
              end: () => `+=${trackWidth - containerWidth}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, [lenis, filters]);

  useEffect(() => {
    if (selectedBlog || isPaidModalOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    }
  }, [selectedBlog, isPaidModalOpen, lenis]);

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

  const groupedBlogs = useMemo(() => {
    return blogData.reduce((acc, blog) => {
      const category = blog.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(blog);
      return acc;
    }, {} as Record<string, Blog[]>);
  }, []);

  const filteredGroupedBlogs = useMemo(() => {
    const result: Record<string, Blog[]> = {};
    for (const categoryName in groupedBlogs) {
      const categoryBlogs = groupedBlogs[categoryName];
      const categoryFilter = filters[categoryName];
      
      result[categoryName] = categoryBlogs.filter(blog => {
        const matchesQuery = blog.title.toLowerCase().includes(categoryFilter.query.toLowerCase());
        const matchesCategory = 
          categoryFilter.category === 'All' ||
          (categoryFilter.category === 'Paid' && blog.tag === 'Paid') ||
          (categoryFilter.category === 'Free' && blog.tag === 'Free') ||
          (categoryFilter.category === 'Bookmarked' && bookmarks.includes(blog.slug));
        
        return matchesQuery && matchesCategory;
      });
    }
    return result;
  }, [groupedBlogs, filters, bookmarks]);

  const handleFilterChange = (category: string, filterType: 'query' | 'category', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filterType]: value,
      }
    }));
    // We need to refresh ScrollTrigger when content changes
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };
  
  return (
    <Section id="blogs" ref={sectionRef} className="p-0 m-0 max-w-full relative bg-slate-950">
        <SectionHeading>
            My Blogs
        </SectionHeading>
        <div className="relative">
            {Object.entries(groupedBlogs).map(([categoryName, _]) => (
                <div key={categoryName} className="blog-category-container h-screen flex flex-col justify-center overflow-x-hidden">
                    <div className="pt-24 pb-8 px-8">
                        <h3 className="text-4xl font-bold font-headline text-cyan-300">{categoryName}</h3>
                        <FilterBar
                          searchQuery={filters[categoryName]?.query || ''}
                          setSearchQuery={(query) => handleFilterChange(categoryName, 'query', query)}
                          activeFilter={filters[categoryName]?.category || 'All'}
                          setActiveFilter={(category) => handleFilterChange(categoryName, 'category', category)}
                        />
                    </div>
                    <div className="flex-grow flex items-center">
                        <div className="blog-horizontal-track flex gap-8 px-8">
                           <BlogList
                              blogs={filteredGroupedBlogs[categoryName] || []}
                              onRead={handleRead}
                              bookmarks={bookmarks}
                              onBookmark={handleBookmark}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      <AnimatePresence>
        {selectedBlog && <BlogViewer blog={selectedBlog} onClose={closeViewer} />}
      </AnimatePresence>
      <PaidModal isOpen={isPaidModalOpen} onClose={() => setIsPaidModalOpen(false)} />
    </Section>
  );
}
