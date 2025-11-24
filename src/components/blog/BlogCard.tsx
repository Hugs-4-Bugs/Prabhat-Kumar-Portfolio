// src/components/blog/BlogCard.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Lock, Star } from "lucide-react";
import type { Blog } from "@/lib/types";

interface BlogCardProps {
  blog: Blog;
  onRead: (blog: Blog) => void;
  onBookmark: (slug: string) => void;
  isBookmarked: boolean;
}

export function BlogCard({ blog, onRead, onBookmark, isBookmarked }: BlogCardProps) {
  return (
    <motion.div
      whileHover="hover"
      className="group relative h-full w-[400px] rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/50 backdrop-blur-xl transform-style-3d shadow-xl shadow-black/20"
    >
      {/* Animated Border */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline text-2xl text-slate-100 group-hover:text-cyan-300 transition-colors">{blog.title}</h3>
          <div className="flex items-center gap-2">
            {blog.tag === 'Paid' && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border bg-yellow-500/10 border-yellow-400/30 text-yellow-300">
                <Star className="w-3 h-3" />
                Paid
              </span>
            )}
             <button onClick={(e) => { e.stopPropagation(); onBookmark(blog.slug); }} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors z-10">
              <Bookmark
                className={`h-5 w-5 transition-all duration-300 ${
                  isBookmarked 
                    ? 'text-yellow-400 fill-yellow-400/20 scale-110' 
                    : 'text-slate-400 group-hover:text-white'
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-slate-400 flex-grow mb-6">{blog.description}</p>

        <div className="flex justify-between items-center mt-auto">
          <button
            onClick={() => onRead(blog)}
            className="group/read relative inline-flex items-center text-cyan-300 font-semibold"
          >
            Read Now
            <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover/read:translate-x-1" />
             <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan-400 transition-all duration-300 group-hover/read:w-full"/>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
