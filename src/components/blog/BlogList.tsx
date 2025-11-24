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

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: i * 0.1
      },
    }),
  };

  if (blogs.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-[300px]">
         <p className="text-center text-slate-400 text-lg">No blogs found for this filter.</p>
      </div>
    );
  }

  return (
    <>
      {blogs.map((blog, index) => (
        <motion.div 
            key={blog.slug} 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="flex-shrink-0 w-[80vw] sm:w-[350px] md:w-[400px]"
            style={{ scrollSnapAlign: "start" }}
        >
          <BlogCard
            blog={blog}
            onRead={onRead}
            onBookmark={onBookmark}
            isBookmarked={bookmarks.includes(blog.slug)}
          />
        </motion.div>
      ))}
    </>
  );
}
