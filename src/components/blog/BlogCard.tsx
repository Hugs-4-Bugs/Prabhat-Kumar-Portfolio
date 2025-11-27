// src/components/blog/BlogCard.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Star } from "lucide-react";
import type { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger onRead for paid blogs when the card is clicked,
    // but not when the bookmark button is clicked.
    if (blog.tag === 'Paid' && !(e.target as HTMLElement).closest('.bookmark-button')) {
      onRead(blog);
    }
  };
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when bookmarking
    onBookmark(blog.slug);
  };

  const CardInnerContent = (
    <>
      {/* Animated Border */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
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
            <button onClick={handleBookmarkClick} className="bookmark-button p-2 rounded-full hover:bg-secondary transition-colors z-10" data-cursor-hover>
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

        <div className="mt-auto">
          {/* For free blogs, the "Read Now" is a direct link opening a new tab. */}
          {/* For paid blogs, it's just a visual cue as the whole card is clickable. */}
          {blog.tag === 'Free' ? (
             <a 
              href={`/blog/${blog.slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()} // Prevent card click
              className="group/read relative inline-flex items-center text-primary font-semibold"
              data-cursor-hover
            >
              Read Now
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover/read:translate-x-1" />
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover/read:w-full"/>
            </a>
          ) : (
             <div className="group/read relative inline-flex items-center text-primary font-semibold">
              Read Now
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover/read:translate-x-1" />
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover/read:w-full"/>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative h-full rounded-2xl overflow-hidden border border-border bg-card backdrop-blur-xl transform-style-3d shadow-lg dark:shadow-black/20",
        blog.tag === 'Paid' ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {CardInnerContent}
    </div>
  );
}
