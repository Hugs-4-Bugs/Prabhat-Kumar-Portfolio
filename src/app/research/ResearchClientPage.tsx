"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchItem, ResearchCard } from '@/components/research-card';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Orbit, Zap, Sparkles } from 'lucide-react';

export function ResearchClientPage({ initialData }: { initialData: ResearchItem[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { label: 'All', value: 'All' },
    { label: 'Research Papers', value: 'research-paper' },
    { label: 'Articles', value: 'article' },
    { label: 'Reports', value: 'report' }
  ];

  const filteredResearch = useMemo(() => {
    return activeFilter === 'All'
      ? initialData
      : initialData.filter(item => item.type === activeFilter);
  }, [activeFilter, initialData]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-cyan-900/10 -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Research & Articles
          </h1>
          <Sparkles className="w-8 h-8 text-purple-400 animate-bounce" />
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Deep dives, technical reports, and research papers on AI systems, backend architecture, and engineering management.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {filters.map((filter, index) => (
          <motion.div
            key={filter.value}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            className="inline-block"
          >
            <Button
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "relative group px-8 py-4 text-sm md:text-base font-semibold rounded-2xl border-2 backdrop-blur-xl transition-all duration-500",
                "hover:scale-110 hover:rotate-3 transform-gpu",
                activeFilter === filter.value 
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-2xl shadow-cyan-400/25"
                  : "border-slate-600 bg-slate-900/50 text-slate-300 hover:border-purple-400 hover:text-purple-300"
              )}
            >
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-md transition-opacity duration-500",
                activeFilter === filter.value 
                  ? "opacity-100 bg-cyan-400/25" 
                  : "opacity-0 group-hover:opacity-100 bg-purple-400/25"
              )} />
              
              <span className="relative z-10 flex items-center gap-2">
                {filter.label}
                {activeFilter === filter.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Orbit className="w-4 h-4" />
                  </motion.div>
                )}
              </span>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        layout 
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative"
      >
        <AnimatePresence mode="popLayout">
          {filteredResearch.map((item, index) => (
            <motion.div
              key={`${activeFilter}-${item.slug}`}
              layout
              initial={{ opacity: 0, scale: 0.5, rotateY: 180, y: 100 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -180, y: -100 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 15
              }}
              whileHover={{
                y: -20,
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="transform-style-3d perspective-1000"
            >
              <ResearchCard research={item} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredResearch.length === 0 && (
        <div className="text-center text-slate-400 py-12">
          No research found for this category.
        </div>
      )}
    </div>
  );
}
