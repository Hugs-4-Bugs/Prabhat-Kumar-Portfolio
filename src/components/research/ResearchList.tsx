"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ResearchPaper } from "@/lib/research";
import { ResearchCard } from "./ResearchCard";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Orbit } from 'lucide-react';
import { SectionHeading } from "@/components/section-heading";

interface ResearchListProps {
  initialPapers: ResearchPaper[];
}

const INITIAL_VISIBLE = 6;

const projectFilters = [
  { label: 'All', value: 'All' },
  { label: 'Research Papers', value: 'research-paper' },
  { label: 'Articles', value: 'article' },
  { label: 'Reports', value: 'report' },
];

export function ResearchList({ initialPapers }: ResearchListProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [particles, setParticles] = useState<{id: number, x: string, y: string, duration: number}[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + 'vw',
      y: Math.random() * 100 + 'vh',
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const canvasParticles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number; }> = [];

    for (let i = 0; i < 50; i++) {
      canvasParticles.push({
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
      ctx!.fillStyle = 'transparent';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      canvasParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx!.fillStyle = particle.color;
        ctx!.globalAlpha = particle.alpha;
        ctx!.fill();

        canvasParticles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx!.beginPath();
            ctx!.strokeStyle = particle.color;
            ctx!.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particle.x, particle.y);
            ctx!.lineTo(otherParticle.x, otherParticle.y);
            ctx!.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas && sectionRef.current) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredPapers = useMemo(() => {
    let source = activeFilter === 'All' 
      ? initialPapers 
      : initialPapers.filter(p => p.type === activeFilter);
    return [...source].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
  }, [activeFilter, initialPapers]);
  
  const visiblePapers = useMemo(() => {
    return filteredPapers.slice(0, visibleCount);
  }, [filteredPapers, visibleCount]);

  const isShowingAll = visibleCount >= filteredPapers.length;
  const hasMore = filteredPapers.length > INITIAL_VISIBLE;

  const toggleVisibleCount = () => {
    if (isShowingAll) {
      setVisibleCount(INITIAL_VISIBLE);
    } else {
      setVisibleCount(filteredPapers.length);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(INITIAL_VISIBLE);
  };

  return (
    <section 
      id="research" 
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background px-4 md:px-8 py-12"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 pointer-events-none" />
      
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
            initial={{ x: p.x, y: p.y }}
            animate={{ x: [p.x, (parseFloat(p.x) + 5) + 'vw'], y: [p.y, (parseFloat(p.y) - 5) + 'vh'] }}
            transition={{ duration: p.duration, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeading>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <BookOpen className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Research & Articles
              </h2>
              <Sparkles className="w-8 h-8 text-purple-400 animate-bounce" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Deep dives into AI systems, market research, and engineering breakthroughs.
            </p>
          </motion.div>
        </SectionHeading>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 mt-8"
        >
          {projectFilters.map((filter, index) => (
            <GalacticButton key={filter.value} delay={index * 0.1}>
              <Button
                onClick={() => handleFilterClick(filter.value)}
                className={cn(
                  "relative group px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold rounded-2xl border-2 backdrop-blur-xl transition-all duration-500",
                  "hover:scale-110 hover:rotate-3 transform-gpu",
                  "min-h-[44px]", 
                  activeFilter === filter.value 
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-2xl shadow-cyan-400/25"
                    : "border-border bg-card/50 text-muted-foreground hover:border-purple-400 hover:text-purple-300"
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
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", stiffness: 200 }}>
                      <Orbit className="w-4 h-4 hidden md:block" />
                    </motion.div>
                  )}
                </span>
              </Button>
            </GalacticButton>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 relative">
          <AnimatePresence mode="popLayout">
            {visiblePapers.map((paper, index) => (
              <motion.div
                key={`${activeFilter}-${paper.slug}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.5, rotateY: 180, y: 100 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: -180, y: -100 }}
                transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 80, damping: 15 }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5, transition: { duration: 0.3 } }}
                className="transform-style-3d perspective-1000"
              >
                <ResearchCard paper={paper} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <QuantumButton onClick={toggleVisibleCount}>
              <Button className="group relative px-12 py-6 text-xl font-bold rounded-2xl border-2 border-cyan-400/50 bg-card/80 backdrop-blur-xl text-cyan-300 hover:text-white transition-all duration-500 overflow-hidden min-h-[44px]">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center">
                  {isShowingAll ? "Show Less" : `Show More (+${filteredPapers.length - visibleCount})`}
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
    </section>
  );
}

function GalacticButton({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className="inline-block"
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

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
