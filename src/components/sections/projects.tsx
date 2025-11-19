// src/components/sections/projects.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Sparkles, Zap, Orbit } from 'lucide-react';

const INITIAL_VISIBLE_PROJECTS = 6;

export function Projects() {
  const { projects, projectFilters } = siteConfig;
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PROJECTS);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // PARTICLE CANVAS ANIMATION
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();

        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FLOATING GEOMETRIC SHAPES
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const shapes = ['triangle', 'circle', 'square', 'hexagon'];
    const colors = [
      'from-purple-500/20 to-pink-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-orange-500/20 to-red-500/20'
    ];

    shapes.forEach((shape, index) => {
      const shapeEl = document.createElement('div');
      shapeEl.className = `absolute w-32 h-32 bg-gradient-to-br ${colors[index]} blur-xl opacity-20 animate-float`;
      shapeEl.style.left = `${20 + index * 20}%`;
      shapeEl.style.top = `${30 + (index % 2) * 40}%`;
      shapeEl.style.animationDelay = `${index * 2}s`;
      
      section.appendChild(shapeEl);
    });
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(p => p.tags.includes(activeFilter));
  }, [activeFilter, projects]);
  
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const isShowingAll = visibleCount >= filteredProjects.length;
  const hasMoreProjects = filteredProjects.length > INITIAL_VISIBLE_PROJECTS;

  const toggleVisibleCount = () => {
    if (isShowingAll) {
      // Show less - go back to initial count
      setVisibleCount(INITIAL_VISIBLE_PROJECTS);
    } else {
      // Show more - show all projects
      setVisibleCount(filteredProjects.length);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(INITIAL_VISIBLE_PROJECTS);
  };

  return (
    <Section 
      id="projects" 
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-slate-950"
    >
      {/* ANIMATED BACKGROUND LAYERS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/90" />
      
      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            animate={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        <SectionHeading>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                My Projects
              </h2>
              <Sparkles className="w-8 h-8 text-purple-400 animate-bounce" />
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Exploring the universe of code, one project at a time 🚀
            </p>
          </motion.div>
        </SectionHeading>

        {/* MAGNETIC FILTER BUTTONS WITH GLOW */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {projectFilters.map((filter, index) => (
            <GalacticButton key={filter.value} delay={index * 0.1}>
              <Button
                onClick={() => handleFilterClick(filter.value)}
                className={cn(
                  "relative group px-8 py-4 text-lg font-semibold rounded-2xl border-2 backdrop-blur-xl transition-all duration-500",
                  "hover:scale-110 hover:rotate-3 transform-gpu",
                  activeFilter === filter.value 
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-2xl shadow-cyan-400/25"
                    : "border-slate-600 bg-slate-900/50 text-slate-300 hover:border-purple-400 hover:text-purple-300"
                )}
                data-cursor-hover
              >
                {/* GLOW EFFECT */}
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
            </GalacticButton>
          ))}
        </motion.div>

        {/* 4D HOLOGRAPHIC PROJECT GRID */}
        <motion.div 
          layout 
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 relative"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={`${activeFilter}-${project.name}-${index}`}
                layout
                initial={{ 
                  opacity: 0, 
                  scale: 0.5,
                  rotateY: 180,
                  y: 100
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0,
                  y: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5,
                  rotateY: -180,
                  y: -100
                }}
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
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* SHOW MORE BUTTON WITH QUANTUM EFFECT - Only show if there are more projects */}
        {hasMoreProjects && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <QuantumButton onClick={toggleVisibleCount}>
              <Button 
                className="group relative px-12 py-6 text-xl font-bold rounded-2xl border-2 border-cyan-400/50 bg-slate-900/80 backdrop-blur-xl text-cyan-300 hover:text-white transition-all duration-500 overflow-hidden"
                data-cursor-hover
              >
                {/* PULSING GLOW */}
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl animate-pulse" />
                
                {/* ANIMATED BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* QUANTUM PARTICLES */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
                      initial={{ x: -20, y: Math.random() * 100 }}
                      animate={{ x: '100%', y: Math.random() * 100 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        repeatDelay: 5
                      }}
                    />
                  ))}
                </div>

                <span className="relative z-10 flex items-center">
                  {isShowingAll ? "Show Less" : `Show More (+${filteredProjects.length - visibleCount})`}
                  {isShowingAll ? (
                    <ChevronUp className="ml-4 h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                  ) : (
                    <ChevronDown className="ml-4 h-6 w-6 group-hover:translate-y-1 transition-transform" />
                  )}
                </span>
              </Button>
            </QuantumButton>
          </motion.div>
        )}
      </div>
    </Section>
  );
}

// GALACTIC BUTTON COMPONENT
function GalacticButton({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className="inline-block"
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}

// QUANTUM BUTTON COMPONENT
function QuantumButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block cursor-pointer"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-2xl blur-lg"
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

























// "use client";

// import { useState, useMemo, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { ProjectCard } from "@/components/project-card";
// import { Button } from "@/components/ui/button";
// import { cn } from '@/lib/utils';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// const INITIAL_VISIBLE_PROJECTS = 6;

// export function Projects() {
//   const { projects, projectFilters } = siteConfig;
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PROJECTS);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   const filteredProjects = useMemo(() => {
//     if (activeFilter === 'All') return projects;
//     return projects.filter(p => p.tags.includes(activeFilter));
//   }, [activeFilter, projects]);

//   const isShowingAll = visibleCount >= filteredProjects.length;

//   const toggleVisibleCount = () => {
//     setVisibleCount(prevCount =>
//       prevCount >= filteredProjects.length ? INITIAL_VISIBLE_PROJECTS : projects.length
//     );
//   };

//   const handleFilterClick = (filter: string) => {
//     setActiveFilter(filter);
//     setVisibleCount(INITIAL_VISIBLE_PROJECTS);
//   };

//   // Quantum Grid Parallax and Interactions (Client-Side Only)
//   useEffect(() => {
//     if (typeof window === 'undefined') return; // SSR Safety

//     let animationId: number;
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!sectionRef.current) return;
//       const rect = sectionRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       setMousePos({ x, y });

//       // Warp the grid based on mouse
//       if (gridRef.current) {
//         const warpX = (x / rect.width - 0.5) * 20;
//         const warpY = (y / rect.height - 0.5) * 20;
//         gridRef.current.style.transform = `translate(${warpX}px, ${warpY}px) scale(${1 + Math.abs(warpX) * 0.01})`;
//       }

//       // Parallax cards
//       const cards = sectionRef.current.querySelectorAll('.project-card');
//       cards.forEach((card, index) => {
//         const depth = (index % 3 + 1) * 0.02;
//         const moveX = (x - rect.width / 2) * depth;
//         const moveY = (y - rect.height / 2) * depth;
//         (card as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
//       });
//     };

//     const section = sectionRef.current;
//     if (section) {
//       section.addEventListener('mousemove', handleMouseMove);
//       return () => section.removeEventListener('mousemove', handleMouseMove);
//     }
//   }, []);

//   // Scroll-Trigger with Quantum Materialization
//   useEffect(() => {
//     if (typeof window === 'undefined') return; // SSR Safety

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('quantum-materialize');
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     const cards = sectionRef.current?.querySelectorAll('.project-card');
//     cards?.forEach((card) => observer.observe(card));

//     return () => observer.disconnect();
//   }, [filteredProjects, visibleCount]);

//   return (
//     <Section id="projects" ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 dark:from-background dark:via-slate-900/20 dark:to-cyan-900/10">
//       {/* Quantum Grid Background */}
//       <div
//         ref={gridRef}
//         className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40 transition-transform duration-300"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: '50px 50px',
//           animation: 'grid-pulse 4s ease-in-out infinite',
//         }}
//       />

//       <SectionHeading className="relative z-10 text-center mb-8">My Projects</SectionHeading>

//       <div className="flex flex-wrap justify-center gap-2 mb-12 relative z-10">
//         {projectFilters.map((filter, index) => (
//           <QuantumMagneticButton
//             key={filter.value}
//             variant={activeFilter === filter.value ? 'default' : 'outline'}
//             onClick={() => handleFilterClick(filter.value)}
//             className={cn(
//               "transition-all duration-300 rounded-full px-4 text-sm backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/50",
//               activeFilter === filter.value && "shadow-lg shadow-cyan-400/20 bg-cyan-400/10"
//             )}
//             data-cursor-hover
//             index={index}
//           >
//             {filter.label}
//           </QuantumMagneticButton>
//         ))}
//       </div>

//       <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
//         <AnimatePresence>
//           {filteredProjects.slice(0, visibleCount).map((project, index) => (
//             <motion.div
//               key={`${activeFilter}-${project.name}`}
//               layout
//               initial={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
//               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
//               exit={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
//               transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
//               className="project-card"
//             >
//               <ProjectCard project={project} index={index} />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>

//       {filteredProjects.length > INITIAL_VISIBLE_PROJECTS && (
//         <div className="mt-12 text-center relative z-10">
//           <QuantumMagneticButton variant="ghost" onClick={toggleVisibleCount} data-cursor-hover index={0} className="backdrop-blur-sm">
//             {isShowingAll ? "Show Less" : "Show More"}
//             {isShowingAll ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
//           </QuantumMagneticButton>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes grid-pulse {
//           0%, 100% { opacity: 0.2; }
//           50% { opacity: 0.4; }
//         }
//         @keyframes quantum-materialize {
//           0% { opacity: 0; clip-path: circle(0% at center); filter: blur(10px); }
//           50% { opacity: 0.5; clip-path: circle(50% at center); filter: blur(5px); }
//           100% { opacity: 1; clip-path: circle(100% at center); filter: blur(0px); }
//         }
//         .quantum-materialize {
//           animation: quantum-materialize 1.2s ease-out forwards;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .quantum-materialize { animation: none; }
//         }
//       `}</style>
//     </Section>
//   );
// }

// // Quantum Magnetic Button with Snapping and Particles
// function QuantumMagneticButton({ children, className, index, ...props }: any) {
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     if (typeof window === 'undefined') return; // SSR Safety

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!buttonRef.current) return;
//       const rect = buttonRef.current.getBoundingClientRect();
//       const centerX = rect.left + rect.width / 2;
//       const centerY = rect.top + rect.height / 2;
//       const deltaX = e.clientX - centerX;
//       const deltaY = e.clientY - centerY;
//       const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
//       const strength = Math.min(distance / 100, 1);
//       buttonRef.current.style.transform = `translate(${deltaX * 0.2 * strength}px, ${deltaY * 0.2 * strength}px)`;
//       buttonRef.current.style.boxShadow = `0 0 15px rgba(0,255,255,${strength * 0.4})`;
//     };

//     const handleMouseLeave = () => {
//       if (buttonRef.current) {
//         buttonRef.current.style.transform = 'translate(0, 0)';
//         buttonRef.current.style.boxShadow = 'none';
//       }
//     };

//     const button = buttonRef.current;
//     if (button) {
//       button.addEventListener('mousemove', handleMouseMove);
//       button.addEventListener('mouseleave', handleMouseLeave);
//       return () => {
//         button.removeEventListener('mousemove', handleMouseMove);
//         button.removeEventListener('mouseleave', handleMouseLeave);
//       };
//     }
//   }, []);

//   return (
//     <Button ref={buttonRef} className={className} {...props}>
//       {children}
//     </Button>
//   );
// }



































// // src/components/sections/projects.tsx
// "use client";

// import { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { ProjectCard } from "@/components/project-card";
// import { Button } from "@/components/ui/button";
// import { cn } from '@/lib/utils';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// const INITIAL_VISIBLE_PROJECTS = 6;

// export function Projects() {
//   const { projects, projectFilters } = siteConfig;
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PROJECTS);

//   const filteredProjects = useMemo(() => {
//     if (activeFilter === 'All') return projects;
//     return projects.filter(p => p.tags.includes(activeFilter));
//   }, [activeFilter, projects]);
  
//   const isShowingAll = visibleCount >= filteredProjects.length;

//   const toggleVisibleCount = () => {
//     setVisibleCount(prevCount => 
//         prevCount >= filteredProjects.length ? INITIAL_VISIBLE_PROJECTS : projects.length
//     );
//   };

//   const handleFilterClick = (filter: string) => {
//     setActiveFilter(filter);
//     setVisibleCount(INITIAL_VISIBLE_PROJECTS);
//   };

//   return (
//     <Section id="projects">
//       <SectionHeading>My Projects</SectionHeading>
//       <div className="flex flex-wrap justify-center gap-2 mb-12">
//         {projectFilters.map(filter => (
//           <Button
//             key={filter.value}
//             variant={activeFilter === filter.value ? 'default' : 'outline'}
//             onClick={() => handleFilterClick(filter.value)}
//             className={cn(
//               "transition-all duration-300 rounded-full px-4 text-sm",
//               activeFilter === filter.value && "shadow-md"
//             )}
//             data-cursor-hover
//           >
//             {filter.label}
//           </Button>
//         ))}
//       </div>

//       <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         <AnimatePresence>
//           {filteredProjects.slice(0, visibleCount).map((project, index) => (
//             <motion.div
//               key={`${activeFilter}-${project.name}`}
//               layout
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.3, delay: (index % INITIAL_VISIBLE_PROJECTS) * 0.05 }}
//             >
//               <ProjectCard project={project} />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
      
//       {filteredProjects.length > INITIAL_VISIBLE_PROJECTS && (
//         <div className="mt-12 text-center">
//             <Button variant="ghost" onClick={toggleVisibleCount} data-cursor-hover>
//                 {isShowingAll ? "Show Less" : "Show More"}
//                 {isShowingAll ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
//             </Button>
//         </div>
//       )}
//     </Section>
//   );
// }
