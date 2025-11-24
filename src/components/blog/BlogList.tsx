// src/components/blog/BlogList.tsx
"use client";

import { motion } from "framer-motion";
import { BlogCard } from "./BlogCard";
import type { Blog } from "@/lib/types";

interface BlogListProps {
  blogs: Blog[];
  onRead: (blog: Blog) => void;
  bookmarks: string[];
  onBookmark: (slug: string) => void;
}

export function BlogList({ blogs, onRead, bookmarks, onBookmark }: BlogListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  if (blogs.length === 0) {
    return <p className="text-center text-slate-400 mt-12">No blogs found for this filter.</p>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <motion.div key={blog.slug} variants={itemVariants}>
          <BlogCard
            blog={blog}
            onRead={onRead}
            onBookmark={onBookmark}
            isBookmarked={bookmarks.includes(blog.slug)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
