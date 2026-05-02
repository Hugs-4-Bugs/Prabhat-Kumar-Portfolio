// src/components/sections/tech-stack.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";

export function TechStack() {
  const { techStack } = siteConfig;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [floatingParticles, setFloatingParticles] = useState<{left: string, top: string, duration: number, delay: number}[]>([]);

  useEffect(() => {
    const defaultExpanded = new Set([0, 1, 2]);
    setExpandedCards(defaultExpanded);
    
    setFloatingParticles([...Array(20)].map(() => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2
    })));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateX: -45,
      scale: 0.8
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    }),
  };

  const hoverVariants = {
    initial: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      z: 0,
    },
    hover: {
      scale: 1.03,
      rotateY: 3,
      rotateX: 3,
      z: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const listVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.4 }
    })
  };

  const getCardHeight = (toolsCount: number, isExpanded: boolean) => {
    const baseHeight = 200;
    const itemHeight = 32;
    const maxVisible = 4;
    if (isExpanded) return baseHeight + (toolsCount * itemHeight);
    return baseHeight + (Math.min(toolsCount, maxVisible) * itemHeight);
  };

  return (
    <Section 
      id="tech-stack" 
      className="relative bg-secondary/30 overflow-hidden"
      ref={sectionRef}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--primary) / 0.03) 0%, transparent 50%)`,
        transform: 'translateZ(0)'
      }}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
        }}
      />

      <SectionHeading className="relative z-10">Tech Stack & Tools</SectionHeading>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {techStack.map((category, categoryIndex) => {
          const isExpanded = expandedCards.has(categoryIndex);
          const cardHeight = getCardHeight(category.tools.length, isExpanded);
          const visibleTools = isExpanded ? category.tools : category.tools.slice(0, 4);
          const hasMoreTools = category.tools.length > 4;

          return (
            <motion.div
              key={category.category}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              custom={categoryIndex}
              className="relative group"
              style={{ 
                minHeight: `${cardHeight}px`,
                transform: 'translateZ(0)'
              }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
              <motion.div
                variants={hoverVariants}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.02}deg) rotateX(${-mousePosition.y * 0.02}deg)`
                }}
                className="h-full"
              >
                <Card className="relative bg-card/80 backdrop-blur-sm border-border/50 h-full transform-gpu flex flex-col">
                  <CardHeader className="relative z-10 pb-3 flex-shrink-0">
                    <CardTitle className="font-headline text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {category.category}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{category.tools.length} skills</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 flex-1 flex flex-col">
                    <ul className="space-y-2">
                      {visibleTools.map((tool, toolIndex) => (
                        <motion.li key={tool.name} className="text-sm group/tool" variants={itemVariants} initial="hidden" whileInView="visible" custom={toolIndex}>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.span className="font-semibold cursor-help relative inline-block py-1 text-foreground" whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}>
                                  <span className="relative z-10">{tool.name}</span>
                                  <motion.span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/tool:w-full" transition={{ duration: 0.3 }} />
                                </motion.span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover/95 backdrop-blur-sm border-border max-w-xs">
                                <p className="text-popover-foreground text-sm">{tool.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="text-muted-foreground ml-2 hidden sm:inline opacity-0 sm:opacity-100 transition-opacity text-xs"> - {tool.description}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <AnimatePresence>
                      {hasMoreTools && isExpanded && (
                        <motion.div variants={listVariants} initial="collapsed" animate="expanded" exit="collapsed" className="overflow-hidden">
                          <ul className="space-y-2 pt-2">
                            {category.tools.slice(4).map((tool, toolIndex) => (
                              <motion.li key={tool.name} className="text-sm group/tool" variants={itemVariants} initial="hidden" animate="visible" custom={toolIndex + 4}>
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.span className="font-semibold cursor-help relative inline-block py-1 text-foreground" whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}>
                                        <span className="relative z-10">{tool.name}</span>
                                        <motion.span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/tool:w-full" transition={{ duration: 0.3 }} />
                                      </motion.span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-popover/95 backdrop-blur-sm border-border max-w-xs">
                                      <p className="text-popover-foreground text-sm">{tool.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <span className="text-muted-foreground ml-2 hidden sm:inline opacity-0 sm:opacity-100 transition-opacity text-xs"> - {tool.description}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {hasMoreTools && (
                      <div className="mt-4 pt-3 border-t border-border/40 flex-shrink-0 flex justify-center">
                        <Button variant="ghost" size="sm" onClick={() => toggleCard(categoryIndex)} className="h-8 px-4 text-xs">
                          {isExpanded ? <><ChevronUp className="h-3 w-3 mr-2" />Show less</> : <><ChevronDown className="h-3 w-3 mr-2" />Show all ({category.tools.length - 4} more)</>}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {floatingParticles.map((p, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full" style={{ left: p.left, top: p.top }} animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
    </Section>
  );
}
