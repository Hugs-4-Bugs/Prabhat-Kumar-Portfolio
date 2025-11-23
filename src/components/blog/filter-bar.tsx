
"use client";

import { motion } from 'framer-motion';
import { Search, Bookmark, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const filters = ['All', 'Free', 'Paid', 'Bookmarked'];

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function FilterBar({ searchTerm, setSearchTerm, activeFilter, setActiveFilter }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-12 space-y-6"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blogs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 text-lg bg-secondary/50 border-border/50 rounded-full focus:ring-2 focus:ring-primary transition-all"
          data-cursor-hover
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filters.map(filter => (
          <motion.div key={filter} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full transition-all duration-300",
                activeFilter === filter && "shadow-lg shadow-primary/30"
              )}
              data-cursor-hover
            >
              {filter === 'Bookmarked' ? <Bookmark className="mr-2 h-4 w-4" /> : null}
              {activeFilter === filter && filter !== 'Bookmarked' ? <Check className="mr-2 h-4 w-4" /> : null}
              {filter}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
