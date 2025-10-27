// src/components/sections/projects.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_VISIBLE_PROJECTS = 6;

export function Projects() {
  const { projects, projectFilters } = siteConfig;
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PROJECTS);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(p => p.tags.includes(activeFilter));
  }, [activeFilter, projects]);
  
  const isShowingAll = visibleCount >= filteredProjects.length;

  const toggleVisibleCount = () => {
    setVisibleCount(prevCount => 
        prevCount >= filteredProjects.length ? INITIAL_VISIBLE_PROJECTS : projects.length
    );
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(INITIAL_VISIBLE_PROJECTS);
  };

  return (
    <Section id="projects">
      <SectionHeading>My Projects</SectionHeading>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {projectFilters.map(filter => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            onClick={() => handleFilterClick(filter.value)}
            className={cn(
              "transition-all duration-300 rounded-full px-4 text-sm",
              activeFilter === filter.value && "shadow-md"
            )}
            data-cursor-hover
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.slice(0, visibleCount).map((project, index) => (
            <motion.div
              key={`${activeFilter}-${project.title}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: (index % INITIAL_VISIBLE_PROJECTS) * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length > INITIAL_VISIBLE_PROJECTS && (
        <div className="mt-12 text-center">
            <Button variant="ghost" onClick={toggleVisibleCount} data-cursor-hover>
                {isShowingAll ? "Show Less" : "Show More"}
                {isShowingAll ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
            </Button>
        </div>
      )}
    </Section>
  );
}
