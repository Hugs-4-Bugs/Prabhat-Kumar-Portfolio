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
  const [isHovering, setIsHovering] = useState(false);

  // Expand first few cards by default for better UX
  useEffect(() => {
    const defaultExpanded = new Set([0, 1, 2]);
    setExpandedCards(defaultExpanded);
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

  const floatingBeamVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const listVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4
      }
    })
  };

  // Calculate minimum height based on the category with most tools
  const getCardHeight = (toolsCount: number, isExpanded: boolean) => {
    const baseHeight = 200; // Minimum height for header and some content
    const itemHeight = 32; // Height per tool item
    const maxVisible = 4; // Number of items visible when collapsed
    
    if (isExpanded) {
      return baseHeight + (toolsCount * itemHeight);
    }
    return baseHeight + (Math.min(toolsCount, maxVisible) * itemHeight);
  };

  return (
    <Section 
      id="tech-stack" 
      className="relative bg-secondary/30 overflow-hidden"
      ref={sectionRef}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
          hsl(var(--primary) / 0.03) 0%, 
          transparent 50%)`,
        transform: 'translateZ(0)' // Force GPU acceleration for smooth scrolling
      }}
    >
      {/* Floating Holographic Beams */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
            style={{
              top: `${20 + i * 15}%`,
              left: '10%',
              right: '10%',
              transform: `rotate(${i * 15}deg)`,
            }}
            variants={floatingBeamVariants}
            animate="animate"
            initial="animate"
          />
        ))}
      </div>

      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
        }}
      />

      <SectionHeading 
        className="relative z-10"
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }}
      >
        Tech Stack & Tools
      </SectionHeading>

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
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              style={{ 
                minHeight: `${cardHeight}px`,
                transform: 'translateZ(0)' // Force GPU acceleration
              }}
            >
              {/* Animated Gradient Border */}
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
                  {/* Holographic Effect */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, 
                        hsl(var(--primary) / 0.1) 0%, 
                        hsl(var(--secondary) / 0.1) 50%, 
                        hsl(var(--primary) / 0.1) 100%)`
                    }}
                  />
                  
                  <CardHeader className="relative z-10 pb-3 flex-shrink-0">
                    <CardTitle className="font-headline text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {category.category}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category.tools.length} skills
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 flex-1 flex flex-col">
                    <div className="flex-1">
                      <ul className="space-y-2">
                        {visibleTools.map((tool, toolIndex) => (
                          <motion.li 
                            key={tool.name} 
                            className="text-sm group/tool"
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={toolIndex}
                          >
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.span 
                                    className="font-semibold cursor-help relative inline-block py-1 text-foreground"
                                    whileHover={{ 
                                      scale: 1.05,
                                      color: "hsl(var(--primary))"
                                    }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <span className="relative z-10 text-foreground group-hover/tool:text-primary">
                                      {tool.name}
                                    </span>
                                    {/* Magnetic underline effect */}
                                    <motion.span 
                                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/tool:w-full"
                                      transition={{ duration: 0.3 }}
                                    />
                                  </motion.span>
                                </TooltipTrigger>
                                <TooltipContent 
                                  side="top"
                                  className="bg-popover/95 backdrop-blur-sm border-border max-w-xs"
                                >
                                  <p className="text-popover-foreground text-sm">{tool.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-muted-foreground ml-2 hidden sm:inline opacity-0 sm:opacity-100 transition-opacity text-xs">
                              - {tool.description}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Animated expand/collapse for remaining items */}
                      <AnimatePresence>
                        {hasMoreTools && (
                          <motion.div
                            variants={listVariants}
                            initial="collapsed"
                            animate={isExpanded ? "expanded" : "collapsed"}
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 pt-2">
                              {category.tools.slice(4).map((tool, toolIndex) => (
                                <motion.li 
                                  key={tool.name} 
                                  className="text-sm group/tool"
                                  variants={itemVariants}
                                  initial="hidden"
                                  whileInView="visible"
                                  viewport={{ once: true }}
                                  custom={toolIndex + 4}
                                >
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.span 
                                          className="font-semibold cursor-help relative inline-block py-1 text-foreground"
                                          whileHover={{ 
                                            scale: 1.05,
                                            color: "hsl(var(--primary))"
                                          }}
                                          transition={{ type: "spring", stiffness: 400 }}
                                        >
                                          <span className="relative z-10 text-foreground group-hover/tool:text-primary">
                                            {tool.name}
                                          </span>
                                          <motion.span 
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/tool:w-full"
                                            transition={{ duration: 0.3 }}
                                          />
                                        </motion.span>
                                      </TooltipTrigger>
                                      <TooltipContent 
                                        side="top"
                                        className="bg-popover/95 backdrop-blur-sm border-border max-w-xs"
                                      >
                                        <p className="text-popover-foreground text-sm">{tool.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <span className="text-muted-foreground ml-2 hidden sm:inline opacity-0 sm:opacity-100 transition-opacity text-xs">
                                    - {tool.description}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Show All/Show Less Button - Positioned at bottom center */}
                    {hasMoreTools && (
                      <div className="mt-4 pt-3 border-t border-border/40 flex-shrink-0">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCard(categoryIndex)}
                            className="h-8 px-4 text-xs hover:bg-primary/10 transition-colors border border-border/40 hover:border-primary/30 text-foreground"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-2" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-2" />
                                Show all ({category.tools.length - 4} more)
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* 4D Corner Accents */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary/50 rounded-full group-hover:scale-150 transition-transform duration-300" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-secondary/50 rounded-full group-hover:scale-150 transition-transform duration-300" />
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </Section>
  );
}





























// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
// import { createRoot } from 'react-dom/client';

// // --------------------------------------------------------------------------------
// // 1. DATA CONFIGURATION (EXPANDED)
// // --------------------------------------------------------------------------------

// const siteConfig = {
//   techStack: [
//     {
//       category: "Frontend Core & Frameworks",
//       tools: [
//         { name: "React", description: "The modern declarative UI library for web and native UIs." },
//         { name: "TypeScript", description: "Strongly typed JavaScript that scales for large applications." },
//         { name: "Next.js", description: "Full-stack React framework for server-side rendering and static generation." },
//         { name: "Vue.js", description: "Progressive framework for building user interfaces." },
//         { name: "Svelte", description: "Compiler that shifts work out of the browser into a build step." },
//       ],
//     },
//     {
//       category: "Styling, UI/UX & Motion",
//       tools: [
//         { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development." },
//         { name: "Shadcn/UI", description: "Reusable components built with Radix and Tailwind CSS." },
//         { name: "Framer Motion", description: "Library for production-ready animations and gestures." },
//         { name: "PostCSS", description: "Tool for transforming CSS with JavaScript plugins (e.g., nesting)." },
//         { name: "Three.js", description: "JavaScript library for 3D computer graphics on the web." },
//       ],
//     },
//     {
//       category: "State Management & Data",
//       tools: [
//         { name: "Zustand", description: "A fast, scalable, and bear-bones state management solution." },
//         { name: "Redux Toolkit", description: "The standard approach for global state management in React apps." },
//         { name: "React Query (TanStack)", description: "Powerful data fetching, caching, and state synchronization library." },
//         { name: "GraphQL", description: "Query language for your API, optimized for client consumption." },
//         { name: "tRPC", description: "End-to-end typesafe APIs without schemas or code generation." },
//       ],
//     },
//     {
//       category: "Backend & Persistence",
//       tools: [
//         { name: "Node.js", description: "JavaScript runtime environment for building server-side applications." },
//         { name: "Express.js", description: "Minimalist, flexible Node.js web application framework." },
//         { name: "PostgreSQL", description: "The world's most advanced open source relational database." },
//         { name: "MongoDB", description: "Flexible, document-based NoSQL database for modern applications." },
//         { name: "Prisma", description: "Next-generation ORM for Node.js and TypeScript." },
//         { name: "Redis", description: "In-memory data structure store, used as a cache and message broker." },
//       ],
//     },
//     {
//       category: "DevOps & Infrastructure",
//       tools: [
//         { name: "Docker", description: "Platform for developing, shipping, and running applications in containers." },
//         { name: "Kubernetes (K8s)", description: "Container orchestration system for automating deployment and scaling." },
//         { name: "Terraform", description: "Tool for building, changing, and versioning infrastructure safely (IaC)." },
//         { name: "AWS/GCP/Azure", description: "Major cloud providers for scalable, global infrastructure." },
//         { name: "GitHub Actions", description: "CI/CD platform for automating software workflows." },
//       ],
//     },
//     {
//       category: "Testing & Quality Assurance",
//       tools: [
//         { name: "Jest", description: "Delightful JavaScript Testing Framework for unit and integration tests." },
//         { name: "Cypress", description: "Fast, easy, and reliable testing for anything that runs in a browser." },
//         { name: "Storybook", description: "Tool for developing UI components in isolation." },
//         { name: "Vitest", description: "A fast unit test framework powered by Vite." },
//       ],
//     },
//   ],
// };

// // --------------------------------------------------------------------------------
// // 2. MINIMAL UI COMPONENT DEFINITIONS (To make the file runnable)
// // --------------------------------------------------------------------------------

// // A simple section container
// const Section = React.forwardRef(({ id, className, children }, ref) => (
//   <section id={id} ref={ref} className={`py-20 sm:py-32 px-4 ${className}`}>
//     <div className="max-w-7xl mx-auto">{children}</div>
//   </section>
// ));

// // A simple section heading
// const SectionHeading = ({ children }) => (
//   <h2 className="text-4xl font-extrabold tracking-tight text-center mb-16 relative">
//     {children}
//     {/* Underline Effect */}
//     <span className="block w-20 h-1 bg-primary mx-auto mt-2 rounded-full opacity-70"></span>
//   </h2>
// );

// // Simple Card components (Tailwind approximation of shadcn/ui)
// const Card = ({ className = '', children }) => (
//   <div className={`rounded-xl border bg-card text-card-foreground shadow-lg h-full ${className}`}>
//     {children}
//   </div>
// );
// const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
// const CardTitle = ({ className = '', children }) => <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
// const CardContent = ({ children }) => <div className="p-6 pt-0">{children}</div>;

// // Minimal Tooltip implementation
// const TooltipProvider = ({ children }) => children;
// const Tooltip = ({ children }) => children;
// const TooltipTrigger = ({ asChild, children }) => children;
// const TooltipContent = ({ children }) => (
//     <div className="bg-popover text-popover-foreground px-3 py-1 text-sm rounded-md shadow-md z-50 absolute pointer-events-none opacity-0 transition-opacity">
//         {children}
//     </div>
// );

// // --------------------------------------------------------------------------------
// // 3. CSS STYLING FOR GRADIENT BORDERS & THEME
// // --------------------------------------------------------------------------------

// // 🌀 CSS for the animated gradient border (injected via a style tag)
// const animatedBorderCss = `
// .card-3d-border {
//   --border-size: 2px;
//   --speed: 8s;
//   --angle: 0deg;
//   --radius: 0.75rem; /* Matches rounded-xl */
  
//   /* Use CSS variables for theme colors */
//   --color-1: hsl(var(--primary)); 
//   --color-2: hsl(var(--secondary));
//   --card-bg: hsl(var(--card));
  
//   background: var(--card-bg);
//   padding: var(--border-size);
//   border-radius: var(--radius);
//   position: relative;
//   overflow: hidden;
//   z-index: 0;
// }

// .card-3d-border::before {
//   content: '';
//   position: absolute;
//   inset: 0;
//   background: var(--card-bg); /* Inner content background */
//   border-radius: calc(var(--radius) - var(--border-size));
//   z-index: 2;
// }

// .card-3d-border::after {
//   content: '';
//   position: absolute;
//   z-index: 1;
//   inset: 0;
//   background: conic-gradient(
//     from var(--angle), 
//     var(--color-1), 
//     var(--color-2) 50%, 
//     var(--color-1)
//   );
//   animation: rotate var(--speed) linear infinite;
// }

// @keyframes rotate {
//   to { --angle: 360deg; }
// }

// /* On hover, subtle zoom for border effect */
// .card-3d-border:hover::after {
//   filter: brightness(1.2);
//   transform: scale(1.05);
//   transition: transform 0.3s ease-out, filter 0.3s ease-out;
// }

// /* Base Tailwind equivalent classes for running in this environment */
// .bg-secondary\\/30 { background-color: rgba(229, 231, 235, 0.3); } /* light gray for light theme */
// .dark .bg-secondary\\/30 { background-color: rgba(30, 41, 59, 0.3); } /* dark blue for dark theme */
// `;

// // --------------------------------------------------------------------------------
// // 4. INTERACTIVE MAGNETIC TOOLTIP
// // --------------------------------------------------------------------------------

// function InteractiveTooltip({ tool }) {
//   const triggerRef = useRef(null);
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   // Magnetic logic
//   const handleMouseMove = (e) => {
//     if (!triggerRef.current) return;
//     const { left, top, width, height } = triggerRef.current.getBoundingClientRect();
//     const x = e.clientX - (left + width / 2);
//     const y = e.clientY - (top + height / 2);
    
//     // Set motion values based on cursor proximity (lower factor for less movement)
//     mouseX.set(x * 0.1); 
//     mouseY.set(y * 0.1); 
//   };
  
//   const handleMouseLeave = () => {
//     // Smoothly reset
//     mouseX.set(0, { type: "spring", stiffness: 300, damping: 20 });
//     mouseY.set(0, { type: "spring", stiffness: 300, damping: 20 });
//   };
  
//   return (
//     <Tooltip>
//         <motion.span
//             ref={triggerRef}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//             style={{ x: mouseX, y: mouseY }}
//             className="inline-block" // Crucial for Framer Motion to work
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//         >
//             <TooltipTrigger asChild>
//                 <span className="font-semibold cursor-help" data-cursor-hover>
//                     {tool.name}
//                 </span>
//             </TooltipTrigger>
//         </motion.span>
//         <span className="text-muted-foreground ml-2 hidden sm:inline">- {tool.description}</span>
//         <TooltipContent>
//             <p>{tool.description}</p>
//         </TooltipContent>
//     </Tooltip>
//   );
// }

// // --------------------------------------------------------------------------------
// // 5. INTERACTIVE 3D CARD COMPONENT
// // --------------------------------------------------------------------------------

// function InteractiveTechCard({ category }) {
//   const cardRef = useRef(null);
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const [isHovered, setIsHovered] = useState(false);

//   // 🖱️ Mouse-to-3D-Rotation Logic
//   const handleMouseMove = (e) => {
//     if (!cardRef.current) return;
//     const { offsetWidth: width, offsetHeight: height } = cardRef.current;
    
//     // Get cursor position relative to card center (normalized -1 to 1)
//     const x = e.nativeEvent.offsetX / width - 0.5;
//     const y = e.nativeEvent.offsetY / height - 0.5;
    
//     // Scale the values for a good 3D look
//     mouseX.set(x * 10); // Max rotation angle
//     mouseY.set(y * 10); // Max rotation angle
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     // Smoothly reset rotation to 0
//     mouseX.set(0, { type: "spring", stiffness: 200, damping: 15 });
//     mouseY.set(0, { type: "spring", stiffness: 200, damping: 15 });
//   };
  
//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };
  
//   // Transform mouse values into rotation angles
//   // The y-rotation depends on mouseX, and x-rotation depends on mouseY (inverted for natural 3D look)
//   const rotateX = useTransform(mouseY, (value) => value * -1 + "deg"); 
//   const rotateY = useTransform(mouseX, (value) => value * 1 + "deg");
  
//   return (
//     <motion.div
//       ref={cardRef}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={handleMouseEnter}
//       style={{
//         rotateX,
//         rotateY,
//         scale: isHovered ? 1.03 : 1, // Subtle scale up on hover
//         transition: { type: 'spring', stiffness: 100, damping: 10 },
//       }}
//       className="h-full relative transition-shadow duration-300 rounded-xl cursor-pointer"
//     >
//       {/* 💫 The Outer Border Wrapper */}
//       <div className="card-3d-border h-full relative" style={{ zIndex: 30 }}>
//         {/* The actual Card content */}
//         <Card className="h-full relative z-40 bg-card/80 backdrop-blur-sm transition duration-300">
//             <CardHeader>
//                 <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <ul className="space-y-3">
//                     {category.tools.map((tool) => (
//                         <li key={tool.name} className="text-sm">
//                             <InteractiveTooltip tool={tool} />
//                         </li>
//                     ))}
//                 </ul>
//             </CardContent>
//         </Card>
//       </div>
//     </motion.div>
//   );
// }

// // --------------------------------------------------------------------------------
// // 6. MAIN SECTION COMPONENT
// // --------------------------------------------------------------------------------

// const cardVariants = {
//   hidden: { opacity: 0, y: 50, rotateX: 10 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     rotateX: 0,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 20,
//       delay: i * 0.1, // Staggered delay for scroll-trigger sequence
//     },
//   }),
// };

// export function TechStack() {
//   const { techStack } = siteConfig;
//   const sectionRef = useRef(null);

//   // 🖱️ Cursor Position & Parallax Logic
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
//   // Motion values for subtle inner parallax effect
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const handleMouseMove = useCallback((e) => {
//     if (sectionRef.current) {
//       const rect = sectionRef.current.getBoundingClientRect();
//       // Calculate cursor position relative to the section (0 to 1)
//       const x = (e.clientX - rect.left) / rect.width;
//       const y = (e.clientY - rect.top) / rect.height;
//       setMousePosition({ x, y });
      
//       // Update Framer Motion values for Parallax effect
//       // Transforms x,y from 0-1 range to a small pixel range (-10 to 10)
//       mouseX.set(x * 20 - 10); 
//       mouseY.set(y * 20 - 10); 
//     }
//   }, [mouseX, mouseY]);

//   useEffect(() => {
//     // Attach listener to the whole document for smooth tracking
//     document.addEventListener("mousemove", handleMouseMove);
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, [handleMouseMove]);

//   // Framer Motion Scroll-Trigger for Section Parallax (Subtle vertical shift)
//   const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
//   const yScrollParallax = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  
//   // Combine mouse parallax and scroll parallax
//   const xParallax = useTransform(mouseX, (x) => `${x}px`);
//   const yParallax = useTransform([yScrollParallax, mouseY], ([scrollP, mouseP]) => `${scrollP + mouseP}px`);


//   // CSS for dynamic spotlight (light/dark theme respected by CSS variables)
//   const spotlightStyle = {
//     background: `radial-gradient(
//       circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
//       var(--spotlight-color) 0%,
//       transparent 30%
//     )`,
//   };

//   return (
//     <>
//         {/* Inject custom styles globally */}
//         <style dangerouslySetInnerHTML={{ __html: animatedBorderCss }} />
//         <Section id="tech-stack" className="bg-secondary/30 relative overflow-hidden" ref={sectionRef}>
            
//             {/* 🌌 Holographic Beams / Cursor Spotlight */}
//             <div 
//                 className="absolute inset-0 transition-opacity duration-300 pointer-events-none opacity-50 dark:opacity-25" 
//                 style={spotlightStyle}
//             />
//             {/* Define the spotlight color for CSS to use (using Tailwind theme values) */}
//             <style dangerouslySetInnerHTML={{ __html: `
//                 :root {
//                 --spotlight-color: rgba(135, 206, 235, 0.15); /* Light blue for light mode */
//                 }
//                 .dark {
//                 --spotlight-color: rgba(147, 112, 219, 0.1); /* Medium purple for dark mode */
//                 }
//             `}} />
            
//             {/* 🚀 Parallax container for content (Reacts to scroll and mouse) */}
//             <motion.div 
//                 style={{ y: yParallax, x: xParallax, zIndex: 10 }}
//                 className="relative"
//             >
//                 <SectionHeading>Tech Stack & Tools</SectionHeading>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     <TooltipProvider delayDuration={100}>
//                         {techStack.map((category, i) => (
//                             <motion.div
//                                 key={category.category}
//                                 custom={i}
//                                 variants={cardVariants}
//                                 initial="hidden"
//                                 whileInView="visible"
//                                 viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of card is visible
//                                 style={{ perspective: 1000 }} // Ensure 3D context for children
//                             >
//                                 <InteractiveTechCard category={category} />
//                             </motion.div>
//                         ))}
//                     </TooltipProvider>
//                 </div>
//             </motion.div>
//         </Section>
//     </>
//   );
// }


// // --------------------------------------------------------------------------------
// // 7. APP ROOT COMPONENT
// // --------------------------------------------------------------------------------

// // Mocking some basic Tailwind color variables for visual consistency
// const GlobalStyles = () => (
//     <style dangerouslySetInnerHTML={{ __html: `
//         /* Minimal Tailwind Color Setup for demonstration */
//         :root {
//             --background: 0 0% 100%;
//             --foreground: 222.2 47.4% 11.2%;
//             --card: 0 0% 100%;
//             --card-foreground: 222.2 47.4% 11.2%;
//             --primary: 221.2 83.2% 53.3%; /* Blue */
//             --secondary: 210 40% 96.1%; /* Light Gray */
//             --muted-foreground: 215.4 16.3% 46.9%;
//             --popover: 0 0% 100%;
//             --popover-foreground: 222.2 47.4% 11.2%;
//             --radius: 0.5rem;
//         }
//         .dark {
//             --background: 224 71% 4%;
//             --foreground: 213 31% 91%;
//             --card: 217.2 32.6% 17.5%;
//             --card-foreground: 210 40% 98%;
//             --primary: 217.2 91.2% 59.8%; /* Brighter Blue */
//             --secondary: 217.2 32.6% 25.5%; /* Darker Gray */
//             --muted-foreground: 215 20.2% 65.1%;
//             --popover: 217.2 32.6% 17.5%;
//             --popover-foreground: 210 40% 98%;
//         }

//         body {
//             background-color: hsl(var(--background));
//             color: hsl(var(--foreground));
//             font-family: 'Inter', sans-serif;
//             min-height: 150vh; /* Ensure enough scroll space for the effect to show */
//         }
//     `}}/>
// );


// function App() {
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   useEffect(() => {
//     // Simple dark mode toggle for demonstration
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   return (
//     <div className="min-h-screen">
//       <GlobalStyles />
//       <header className="py-4 px-8 flex justify-end">
//         <button
//           onClick={() => setIsDarkMode(!isDarkMode)}
//           className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
//         >
//           Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
//         </button>
//       </header>
//       <div className="h-[50vh] flex items-center justify-center text-2xl text-muted-foreground">
//         Scroll Down to See the Section
//       </div>
      
//       <TechStack />
      
//       <div className="h-[50vh] flex items-center justify-center text-2xl text-muted-foreground">
//         End of Scroll-Triggered Area
//       </div>
//     </div>
//   );
// }

// export default App;



























// // src/components/sections/tech-stack.tsx
// "use client";

// import { motion } from "framer-motion";
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// export function TechStack() {
//   const { techStack } = siteConfig;

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//       },
//     }),
//   };

//   return (
//     <Section id="tech-stack" className="bg-secondary/30">
//       <SectionHeading>Tech Stack & Tools</SectionHeading>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {techStack.map((category, i) => (
//           <motion.div
//             key={category.category}
//             variants={cardVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             custom={i}
//           >
//             <Card className="h-full">
//               <CardHeader>
//                 <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {category.tools.map((tool) => (
//                     <li key={tool.name} className="text-sm">
//                       <TooltipProvider delayDuration={100}>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <span className="font-semibold cursor-help" data-cursor-hover>{tool.name}</span>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>{tool.description}</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                       <span className="text-muted-foreground ml-2 hidden sm:inline">- {tool.description}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </Section>
//   );
// }
