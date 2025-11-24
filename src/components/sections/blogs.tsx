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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis(ScrollTrigger.update);
  
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lenis, searchQuery, activeFilter]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const categories = gsap.utils.toArray<HTMLElement>('.blog-category-container');
      
      categories.forEach(category => {
        const track = category.querySelector('.blog-horizontal-track') as HTMLElement;
        
        if (!track || track.scrollWidth <= category.clientWidth) {
          gsap.set(category, { height: 'auto', marginBottom: '5rem' });
          return;
        }
        
        gsap.to(track, {
          x: () => -(track.scrollWidth - category.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: category,
            start: "top top",
            end: () => `+=${track.scrollWidth - category.clientWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, [lenis, searchQuery, activeFilter]);

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
    <Section id="blogs" ref={sectionRef} className="p-0 m-0 max-w-full bg-slate-950">
        <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-sm pt-12 pb-8">
            <SectionHeading>My Blogs</SectionHeading>
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
        </div>

        <div className="relative">
            {Object.entries({
                'Technical': groupedAndFilteredBlogs['Technical'] || [],
                'Non-Technical': groupedAndFilteredBlogs['Non-Technical'] || [],
                'Books': groupedAndFilteredBlogs['Books'] || [],
            }).map(([categoryName, blogs]) => (
                <div key={categoryName} className="blog-category-container h-screen flex flex-col justify-center overflow-hidden">
                    <div className="pt-8 pb-4 px-8">
                        <h3 className="text-4xl font-bold font-headline text-cyan-300">{categoryName}</h3>
                    </div>
                    <div className="flex-grow flex items-center">
                        <div className="blog-horizontal-track flex gap-8 px-8">
                           <BlogList
                              blogs={blogs}
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
