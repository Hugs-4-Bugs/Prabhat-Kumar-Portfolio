// src/components/blog/FilterBar.tsx
"use client";

import { Search, Bookmark, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function FilterBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: FilterBarProps) {
  const filters = ["All", "Paid", "Free", "Bookmarked"];

  return (
    <div className="mb-12 space-y-6">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blogs by title..."
          className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-slate-700 bg-slate-900/50 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "relative group px-6 py-3 text-base font-semibold rounded-full border-2 backdrop-blur-xl transition-all duration-300",
              activeFilter === filter
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/20"
                : "border-slate-600 bg-slate-900/50 text-slate-300 hover:border-purple-400 hover:text-purple-300"
            )}
          >
            <div className={cn("absolute inset-0 rounded-full blur-md transition-opacity duration-300", activeFilter === filter ? "bg-cyan-400/20" : "opacity-0 group-hover:opacity-100 bg-purple-400/20")}/>
            <span className="relative z-10 flex items-center gap-2">
              {filter === 'Bookmarked' ? <Bookmark className="h-4 w-4"/> : filter === 'Paid' ? <Star className="h-4 w-4"/> : null}
              {filter}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
