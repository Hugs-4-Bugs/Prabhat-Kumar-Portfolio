// src/components/sections/blogs.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { blogData } from "@/lib/blogs";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { FilterBar } from "@/components/blog/FilterBar";
import { BlogList } from "@/components/blog/BlogList";
import { BlogViewer } from "@/components/blog/BlogViewer";
import { PaidModal } from "@/components/blog/PaidModal";
import type { Blog } from "@/lib/types";

export function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);

  const [bookmarks, addBookmark, removeBookmark] = useBookmarks();

  useEffect(() => {
    // Disable body scroll when blog viewer or modal is open
    if (selectedBlog || isPaidModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedBlog, isPaidModalOpen]);


  const filteredBlogs = useMemo(() => {
    let blogs = blogData;
    
    if (searchQuery) {
        blogs = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (activeFilter === "Paid") {
        return blogs.filter(blog => blog.tag === "Paid");
    }
    if (activeFilter === "Free") {
        return blogs.filter(blog => blog.tag === "Free");
    }
    if (activeFilter === "Bookmarked") {
        return blogs.filter(blog => bookmarks.includes(blog.slug));
    }
    
    return blogs;
  }, [searchQuery, activeFilter, bookmarks]);

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
    <Section id="blogs" className="min-h-screen">
      <SectionHeading>My Blogs</SectionHeading>
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <BlogList
        blogs={filteredBlogs}
        onRead={handleRead}
        bookmarks={bookmarks}
        onBookmark={handleBookmark}
      />
      <AnimatePresence>
        {selectedBlog && <BlogViewer blog={selectedBlog} onClose={closeViewer} />}
      </AnimatePresence>
      <PaidModal isOpen={isPaidModalOpen} onClose={() => setIsPaidModalOpen(false)} />
    </Section>
  );
}
