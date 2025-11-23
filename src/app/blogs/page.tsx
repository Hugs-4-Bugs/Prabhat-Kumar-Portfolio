
"use client";

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { FilterBar } from "@/components/blog/filter-bar";
import { BlogList } from "@/components/blog/blog-list";
import { BlogViewer } from "@/components/blog/blog-viewer";
import { PremiumLockModal } from "@/components/blog/premium-lock-modal";
import { blogs as allBlogs } from "@/lib/blogs.json";
import type { Blog } from "@/lib/types";

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const filteredBlogs = useMemo(() => {
    let blogs = allBlogs;

    if (activeFilter === 'Bookmarked') {
      blogs = blogs.filter(blog => bookmarks.includes(blog.id));
    } else if (activeFilter !== 'All') {
      blogs = blogs.filter(blog => blog.tag === activeFilter);
    }

    if (searchTerm) {
      blogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return blogs;
  }, [searchTerm, activeFilter, allBlogs, bookmarks]);

  const handleReadMore = (blog: Blog) => {
    if (blog.tag === 'Paid') {
      setIsModalOpen(true);
    } else {
      setSelectedBlog(blog);
      setIsViewerOpen(true);
    }
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    // Delay clearing the blog to allow for the exit animation
    setTimeout(() => {
      setSelectedBlog(null);
    }, 500);
  };

  return (
    <Section id="blogs" className="py-24 sm:py-32">
      <SectionHeading>Blogs & Resources</SectionHeading>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <BlogList blogs={filteredBlogs} onReadMore={handleReadMore} />
      </div>

      <AnimatePresence>
        {isViewerOpen && selectedBlog && (
          <BlogViewer blog={selectedBlog} onClose={closeViewer} />
        )}
      </AnimatePresence>
      
      <PremiumLockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Section>
  );
}
