
"use client";

import { motion } from 'framer-motion';
import { BlogCard } from './blog-card';
import type { Blog } from '@/lib/types';

interface BlogListProps {
  blogs: Blog[];
  onReadMore: (blog: Blog) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function BlogList({ blogs, onReadMore }: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-xl">No blogs found.</p>
        <p>Try adjusting your search or filter.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onReadMore={() => onReadMore(blog)} />
      ))}
    </motion.div>
  );
}
