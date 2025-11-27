// src/components/blog/BlogCard.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Star } from "lucide-react";
import type { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface BlogCardProps {
  blog: Blog;
  onRead: (blog: Blog) => void;
  onBookmark: (slug: string) => void;
  isBookmarked: boolean;
}

const categoryColors: { [key: string]: string } = {
  Technical: 'bg-blue-500/10 border-blue-400/30 text-blue-400 dark:text-blue-300',
  'Non-Technical': 'bg-purple-500/10 border-purple-400/30 text-purple-500 dark:text-purple-300',
  Books: 'bg-green-500/10 border-green-400/30 text-green-500 dark:text-green-300',
};

export function BlogCard({ blog, onRead, onBookmark, isBookmarked }: BlogCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark(blog.slug);
  };

  const CardInnerContent = (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline text-2xl text-foreground group-hover:text-primary transition-colors">{blog.title}</h3>
        <div className="flex items-center gap-2">
          {blog.tag === 'Paid' && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border bg-yellow-500/10 border-yellow-400/30 text-yellow-500 dark:text-yellow-300">
              <Star className="w-3 h-3" />
              Paid
            </span>
          )}
          <button onClick={handleBookmarkClick} className="p-2 rounded-full hover:bg-secondary transition-colors z-10">
            <Bookmark
              className={`h-5 w-5 transition-all duration-300 ${
                isBookmarked 
                  ? 'text-yellow-400 fill-yellow-400/20 scale-110' 
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={cn("text-xs font-medium", categoryColors[blog.category] || 'bg-secondary')}>
            {blog.category}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium">
            {blog.subCategory}
          </Badge>
      </div>

      <p className="text-muted-foreground flex-grow mb-6">{blog.description}</p>

      <div className="flex justify-between items-center mt-auto">
        <div className="group/read relative inline-flex items-center text-primary font-semibold">
          Read Now
          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover/read:translate-x-1" />
           <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover/read:w-full"/>
        </div>
      </div>
    </div>
  );

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className="group relative h-full rounded-2xl overflow-hidden border border-border bg-card backdrop-blur-xl transform-style-3d shadow-lg dark:shadow-black/20 cursor-pointer"
    >
      {/* Animated Border */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      {children}
    </div>
  );

  // If the blog is free, wrap it in a Link that opens in a new tab.
  // If it's paid, use a div that triggers the modal via onClick.
  if (blog.tag === 'Free') {
    return (
      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
        <CardWrapper>
          {CardInnerContent}
        </CardWrapper>
      </a>
    );
  } else {
    return (
      <div onClick={() => onRead(blog)}>
        <CardWrapper>
          {CardInnerContent}
        </CardWrapper>
      </div>
    );
  }
}