// src/components/sections/blogs.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import type { Blog, BlogCategory } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks();

  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis(ScrollTrigger.update);
  
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lenis]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const sections: HTMLElement[] = gsap.utils.toArray(".blog-category-panel");
    const totalWidth = sections.reduce((acc, section) => acc + section.scrollWidth, 0);

    let ctx = gsap.context(() => {
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => `+=${containerRef.current!.offsetWidth * (sections.length - 1)}`,
        },
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [lenis]);

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
  
  return (
    <Section id="blogs" className="min-h-screen p-0 m-0 max-w-full">
        <div ref={containerRef} className="blog-section-container h-[100vh] w-full flex">
          <div className="blog-horizontal-track">
            {Object.entries(groupedBlogs).map(([category, blogs]) => (
              <div key={category} className="blog-category-panel w-[100vw] h-full flex flex-col items-center justify-center p-8">
                <SectionHeading>{category}</SectionHeading>
                <div className="w-full">
                  <BlogList
                    blogs={blogs}
                    onRead={handleRead}
                    bookmarks={bookmarks}
                    onBookmark={handleBookmark}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      <AnimatePresence>
        {selectedBlog && <BlogViewer blog={selectedBlog} onClose={closeViewer} />}
      </AnimatePresence>
      <PaidModal isOpen={isPaidModalOpen} onClose={() => setIsPaidModalOpen(false)} />
    </Section>
  );
}
