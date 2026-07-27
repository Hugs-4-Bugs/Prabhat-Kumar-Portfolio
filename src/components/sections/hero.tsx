// src/components/sections/hero.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  FileText,
  Cpu,
  CircuitBoard,
  Server,
  Binary,
  Code2,
  Brain,
  Sparkles,
} from "lucide-react";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Pre-compute random positions once — never recalculate on re-renders
  const pulseNodes = useRef(
    [...Array(8)].map(() => ({
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
    }))
  );
  const dataStreams = useRef(
    [...Array(12)].map(() => ({
      width: 400 + Math.random() * 300,
      left: -400 - Math.random() * 200,
      rotate: Math.random() * 15 - 7.5,
    }))
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Particle system for advanced background
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      type: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.type = Math.floor(Math.random() * 3);

        // Theme-based colors
        if (isDark) {
          const colors = [
            `rgba(59, 130, 246, ${this.opacity})`,
            `rgba(139, 92, 246, ${this.opacity})`,
            `rgba(14, 165, 233, ${this.opacity})`,
          ];
          this.color = colors[this.type];
        } else {
          const colors = [
            `rgba(37, 99, 235, ${this.opacity})`,
            `rgba(124, 58, 237, ${this.opacity})`,
            `rgba(2, 132, 199, ${this.opacity})`,
          ];
          this.color = colors[this.type];
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();

        if (this.type === 0) {
          ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else if (this.type === 1) {
          ctx!.fillRect(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
          );
        } else {
          ctx!.moveTo(this.x, this.y - this.size);
          ctx!.lineTo(this.x - this.size, this.y + this.size);
          ctx!.lineTo(this.x + this.size, this.y + this.size);
          ctx!.closePath();
        }

        ctx!.fill();
      }
    }

    // Create particles — capped for consistent 60fps on all devices
    const particles: Particle[] = [];
    const particleCount = Math.min(
      80,
      Math.floor((canvas.width * canvas.height) / 12000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connection lines — use squared distance to avoid Math.sqrt per pair
    const connectParticles = () => {
      const maxDistance = 120;
      const maxDistSq = maxDistance * maxDistance;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const opacity = 1 - Math.sqrt(distSq) / maxDistance;
            ctx!.strokeStyle = isDark
              ? `rgba(100, 100, 255, ${opacity * 0.3})`
              : `rgba(59, 130, 246, ${opacity * 0.2})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx!.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      if (isDark) {
        gradient.addColorStop(0, "rgba(10, 10, 20, 0.8)");
        gradient.addColorStop(1, "rgba(20, 20, 40, 0.8)");
      } else {
        gradient.addColorStop(0, "rgba(240, 248, 255, 0.9)");
        gradient.addColorStop(1, "rgba(224, 242, 254, 0.9)");
      }
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted, isDark]);

  // Main GSAP animations
  useEffect(() => {
    if (!heroRef.current || !mounted) return;

    let ctx: gsap.Context;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      ctx = gsap.context(() => {
        // Reset elements to visible state first
        gsap.set([".hero-title", ".hero-subtitle", ".hero-description", ".hero-button-primary", ".hero-button-secondary"], {
          opacity: 1,
          y: 0,
          scale: 1
        });

        // Master timeline
        const masterTL = gsap.timeline({ delay: 0.1 });

        // Background elements entrance - FASTER
        masterTL
          .fromTo(
            ".energy-core",
            {
              scale: 0,
              opacity: 0,
              rotation: -180,
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 1,
              ease: "power2.out",
            }
          )
          .fromTo(
            ".floating-gear",
            {
              scale: 0,
              opacity: 0,
              rotation: -360,
            },
            {
              scale: 1,
              opacity: 0.2,
              rotation: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.7)",
            },
            "-=0.8"
          );

        // Text animation sequence - FASTER
        masterTL
          .fromTo(
            ".hero-title",
            {
              opacity: 0,
              y: 80,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.3"
          )
          .fromTo(
            ".hero-subtitle",
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            "-=0.5"
          )
          .fromTo(
            ".hero-description",
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.4"
          );

        // Button animations - FASTER
        masterTL
          .fromTo(
            ".hero-button-primary",
            {
              opacity: 0,
              y: 30,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.3"
          )
          .fromTo(
            ".hero-button-secondary",
            {
              opacity: 0,
              y: 30,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.4"
          );

        // Continuous animations
        gsap.to(".energy-core", {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });

        gsap.to(".floating-gear", {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
          stagger: 1.5,
        });

        gsap.to(".pulse-node", {
          scale: 1.5,
          opacity: 0.4,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            each: 0.6,
            from: "random",
          },
        });

      }, heroRef);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (ctx) {
        ctx.revert();
      }
      // Kill all GSAP animations
      gsap.killTweensOf(".energy-core");
      gsap.killTweensOf(".floating-gear");
      gsap.killTweensOf(".pulse-node");
    };
  }, [mounted, isDark]);

  // Reset animations when component mounts/unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return (
      <section
        id="home"
        className="relative min-h-[100svh] flex items-center justify-center bg-background"
      >
        <div className="container text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg mb-4 mx-auto max-w-2xl"></div>
            <div className="h-8 bg-muted rounded-lg mb-8 mx-auto max-w-md"></div>
            <div className="h-24 bg-muted rounded-lg mb-8 mx-auto max-w-3xl"></div>
            <div className="flex justify-center gap-4">
              <div className="h-12 bg-muted rounded-lg w-40"></div>
              <div className="h-12 bg-muted rounded-lg w-40"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      id="home"
      // className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background transition-colors duration-300"
      // className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black transition-colors duration-300"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-slate-950 transition-colors duration-300"
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Advanced Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, #0f172a 0%, #000000 100%)"
            : "radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%)",
        }}
      />

      {/* Optimized Background Container */}
      <div
        className="absolute inset-0 z-1 overflow-hidden"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* Base Grid */}
        <div
          className={`bg-element absolute inset-0 ${
            isDark ? "bg-grid-white/[0.02]" : "bg-grid-slate-900/[0.02]"
          } bg-[length:80px_80px]`}
        />

        {/* Central Energy Core - Theme Aware */}
        {/* <div className="energy-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: isDark
                ? `
                radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.35) 0%, transparent 60%)
              `
                : `
                radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.25) 0%, transparent 60%)
              `,
              filter: "blur(40px)",
            }}
          />
        </div> */}

        <div
  className="energy-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax]"
>
  <div
    className="absolute inset-0 rounded-full"
    style={{
      background: isDark
        ? `
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.6) 0%, transparent 70%),
          radial-gradient(circle at 30% 30%, rgba(10, 10, 10, 0.8) 0%, transparent 60%),
          radial-gradient(circle at 70% 70%, rgba(20, 20, 20, 0.7) 0%, transparent 60%)
        `
        : `
          radial-gradient(circle at 50% 50%, rgba(230, 230, 230, 0.6) 0%, transparent 70%),
          radial-gradient(circle at 30% 30%, rgba(245, 245, 245, 0.8) 0%, transparent 60%),
          radial-gradient(circle at 70% 70%, rgba(220, 220, 220, 0.7) 0%, transparent 60%)
        `,
      filter: "blur(60px)",
    }}
  />
</div>


        {/* Floating Gears - Theme Aware */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="floating-gear bg-element absolute"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: `${10 + i * 25}%`,
              top: `${8 + i * 12}%`,
              opacity: isDark ? 0.2 : 0.1,
            }}
          >
            <Cpu
              className="w-full h-full"
              style={{
                color: isDark
                  ? "rgba(59, 130, 246, 0.25)"
                  : "rgba(37, 99, 235, 0.15)",
              }}
            />
          </div>
        ))}

        {/* Circuit Boards */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-element absolute"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              right: `${i * 15}%`,
              bottom: `${i * 10}%`,
              opacity: isDark ? 0.15 : 0.08,
            }}
          >
            <CircuitBoard
              className="w-full h-full"
              style={{
                color: isDark
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(124, 58, 237, 0.1)",
              }}
            />
          </div>
        ))}

        {/* Pulse Nodes - Theme Aware */}
        {pulseNodes.current.map((node, i) => (
          <div
            key={i}
            className="pulse-node bg-element absolute rounded-full"
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              left: `${node.left}%`,
              top: `${node.top}%`,
              background: isDark
                ? `radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)`
                : `radial-gradient(circle, rgba(37, 99, 235, 0.2), transparent 70%)`,
              filter: "blur(12px)",
            }}
          />
        ))}

        {/* Data Streams - Theme Aware */}
        {dataStreams.current.map((stream, i) => (
          <div
            key={i}
            className="data-stream bg-element absolute h-0.5"
            style={{
              width: `${stream.width}px`,
              left: `${stream.left}px`,
              top: `${i * 8 + 6}%`,
              transform: `rotate(${stream.rotate}deg)`,
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)"
                : "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent)",
            }}
          />
        ))}

        {/* Tech Icons - Theme Aware */}
        {[Server, Binary, Code2, Brain, Sparkles].map((Icon, i) => (
          <div
            key={i}
            className="tech-icon floating-element absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${70 + Math.sin(i) * 20}%`,
              opacity: isDark ? 0.2 : 0.15,
            }}
          >
            <Icon
              className="w-10 h-10"
              style={{
                color: isDark
                  ? "rgba(34, 197, 94, 0.25)"
                  : "rgba(21, 128, 61, 0.15)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="container text-center relative z-20 px-4 sm:px-6"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* Main Title */}
        <motion.div
          className="hero-title text-element font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-headline tracking-tighter mb-4"
          style={{
            textShadow: isDark
              ? `
              0 1px 0 #ccc,
              0 2px 0 #c9c9c9,
              0 3px 0 #bbb,
              0 4px 0 #b9b9b9,
              0 5px 0 #aaa,
              0 6px 1px rgba(0,0,0,.1),
              0 0 5px rgba(0,0,0,.1),
              0 1px 3px rgba(0,0,0,.3),
              0 3px 5px rgba(0,0,0,.2),
              0 15px 30px rgba(59, 130, 246, 0.2)
            `
              : `
              0 1px 0 #e5d3d3ff,
              0 2px 0 #f0f0f0,
              0 3px 0 #e0e0e0,
              0 4px 0 #d0d0d0,
              0 5px 0 #c0c0c0,
              0 6px 1px rgba(0,0,0,.1),
              0 0 5px rgba(0,0,0,.05),
              0 1px 3px rgba(0,0,0,.1),
              0 3px 5px rgba(0,0,0,.1),
              0 15px 30px rgba(37, 99, 235, 0.15)
            `,
          }}
        >
          <Balancer>
            PRABHAT
            <motion.span
              className="inline-block ml-2 sm:ml-4"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)"
                  : "linear-gradient(135deg, #1d4ed8, #7c3aed, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.span>
          </Balancer>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          // className="hero-subtitle text-element font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline tracking-tighter mb-8"
          className="hero-subtitle text-element font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline tracking-tighter mb-8"
          style={{
            textShadow: isDark
              ? `
              0 1px 0 #666,
              0 2px 0 #5a5a5a,
              0 3px 0 #555,
              0 8px 15px rgba(139, 92, 246, 0.15)
            `
              : `
              0 1px 0 #999,
              0 2px 0 #888,
              0 3px 0 #777,
              0 8px 15px rgba(124, 58, 237, 0.1)
            `,
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
        >
          <Balancer>KUMAR</Balancer>
          <div className="mt-4 text-base font-semibold tracking-normal sm:text-xl md:text-2xl">
            Founder x Software Engineer x System Builder
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          className="hero-description text-element max-w-3xl mx-auto text-base md:text-xl lg:text-2xl font-light leading-relaxed mb-8 sm:mb-12"
          style={{
            textShadow: isDark
              ? "0 2px 8px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)",
            color: isDark
              ? "rgba(226, 232, 240, 0.9)"
              : "rgba(30, 41, 59, 0.9)",
          }}
        >
          {/* <Balancer>
            I architect and build AI systems that solve real operational problems.
            <span
              className="font-semibold"
              style={{
                color: isDark ? "#60a5fa" : "#2563eb",
              }}
            >
              {" "}From autonomous lead generation to trading bots to production
              infrastructure, I engineer solutions that scale, perform, and prove ROI.
            </span>
          </Balancer> */}
        
        <Balancer>
  I architect and build AI systems that solve real operational problems.
  <span
    className="font-semibold"
    style={{
      color: isDark ? "#60a5fa" : "#2563eb",
    }}
  >
    {" "}
    From autonomous lead generation to trading bots to production
    infrastructure, I engineer solutions that scale, perform, and prove ROI.
  </span>
  <span
    className="font-medium"
    style={{
      color: isDark ? "#cbd5e1" : "#475569",
    }}
  >
    {" "}
    Alongside AI systems, I specialize in building production-grade Spring Boot
    backends, reducing backend downtime, optimizing SQL performance, and solving
    complex backend challenges.
  </span>
</Balancer>
        </motion.p>

        {/* Buttons Container */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {/* Primary Button */}
          <motion.div
            className="hero-button-primary button-element"
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              asChild
              size="lg"
              className="relative px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto sm:min-w-[220px] group"
              style={{
                background: isDark
                  ? `
                  linear-gradient(135deg, 
                    rgba(59, 130, 246, 0.95) 0%, 
                    rgba(139, 92, 246, 0.9) 50%, 
                    rgba(14, 165, 233, 0.85) 100%
                )`
                  : `
                  linear-gradient(135deg, 
                    rgba(37, 99, 235, 0.95) 0%, 
                    rgba(124, 58, 237, 0.9) 50%, 
                    rgba(2, 132, 199, 0.85) 100%
                )`,
                boxShadow: isDark
                  ? `
                  inset 0 1px 0 rgba(255, 255, 255, 0.4),
                  0 4px 6px -1px rgba(0, 0, 0, 0.3),
                  0 10px 15px -3px rgba(59, 130, 246, 0.4)
                `
                  : `
                  inset 0 1px 0 rgba(255, 255, 255, 0.6),
                  0 4px 6px -1px rgba(0, 0, 0, 0.1),
                  0 10px 15px -3px rgba(37, 99, 235, 0.3)
                `,
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Link
                href="#projects"
                className="relative z-10 flex items-center justify-center"
              >
                <span className="text-white font-semibold">VIEW MY WORK</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </motion.div>

          {/* Secondary Button */}
          <motion.div
            className="hero-button-secondary button-element"
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="relative px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto sm:min-w-[220px] backdrop-blur-lg group border-2"
              style={{
                background: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.6)",
                borderColor: isDark
                  ? "rgba(59, 130, 246, 0.4)"
                  : "rgba(37, 99, 235, 0.3)",
                boxShadow: isDark
                  ? "0 4px 15px rgba(59, 130, 246, 0.2)"
                  : "0 4px 15px rgba(37, 99, 235, 0.15)",
              }}
            >
              <a
                href="/Prabhat Experience Profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center"
              >
                <span
                  style={{
                    color: isDark ? "#ffffff" : "transparent",
                    background: isDark
                      ? "none"
                      : "linear-gradient(135deg, #2563eb, #7c3aed)",
                    WebkitBackgroundClip: isDark ? "unset" : "text",
                    WebkitTextFillColor: isDark ? "#ffffff" : "transparent",
                    backgroundClip: isDark ? "unset" : "text",
                  }}
                  className="font-bold"
                >
                  DOWNLOAD CV
                </span>
                <FileText
                  className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                  style={{
                    color: isDark ? "#60a5fa" : "#2563eb",
                  }}
                />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className={`w-8 h-12 rounded-full flex justify-center p-1 backdrop-blur-sm border ${
            isDark
              ? "border-blue-400/30 bg-black/20"
              : "border-blue-600/30 bg-white/50"
          }`}
        >
          <motion.div
            className="w-1.5 h-3 rounded-full"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, #60a5fa, #a78bfa)"
                : "linear-gradient(to bottom, #2563eb, #7c3aed)",
            }}
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
























// // src/components/sections/hero.tsx
// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { ArrowRight, FileText, Sparkles, Cpu, Binary, Zap, Satellite } from "lucide-react";
// import Balancer from "react-wrap-balancer";
// import { useRef, useEffect } from "react";
// import gsap from "gsap";

// import { siteConfig } from "@/lib/data";
// import { Button } from "@/components/ui/button";

// export function Hero() {
//   const sceneRef = useRef<HTMLDivElement>(null);
//   const asteroidsRef = useRef<HTMLDivElement>(null);
//   const planetsRef = useRef<HTMLDivElement>(null);
//   const satellitesRef = useRef<HTMLDivElement>(null);
//   const starsRef = useRef<HTMLDivElement>(null);

//   const FADE_DOWN_ANIMATION_VARIANTS = {
//     hidden: { opacity: 0, y: -10 },
//     show: { opacity: 1, y: 0, transition: { type: "spring" } },
//   };

//   useEffect(() => {
//     // Create twinkling stars
//     const stars = starsRef.current?.children;
//     if (stars) {
//       Array.from(stars).forEach((star, index) => {
//         gsap.to(star, {
//           opacity: Math.random() * 0.8 + 0.2,
//           duration: 2 + Math.random() * 3,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: Math.random() * 2
//         });
//       });
//     }

//     // Animate asteroids
//     const asteroids = asteroidsRef.current?.children;
//     if (asteroids) {
//       Array.from(asteroids).forEach((asteroid, index) => {
//         const duration = 15 + Math.random() * 10;
//         const rotation = 360 + Math.random() * 180;

//         gsap.to(asteroid, {
//           x: `+=${window.innerWidth + 200}`,
//           y: `+=${Math.random() * 200 - 100}`,
//           rotation: index % 2 === 0 ? rotation : -rotation,
//           duration: duration,
//           repeat: -1,
//           ease: "none",
//           delay: Math.random() * 5
//         });
//       });
//     }

//     // Animate planets with orbital motion
//     const planets = planetsRef.current?.children;
//     if (planets) {
//       Array.from(planets).forEach((planet, index) => {
//         const orbitRadius = 120 + index * 60;
//         const duration = 20 + index * 5;

//         gsap.to(planet, {
//           rotation: 360,
//           duration: duration,
//           repeat: -1,
//           ease: "none"
//         });

//         // Orbital path animation
//         if (planet.firstChild) {
//           gsap.to(planet.firstChild, {
//             x: orbitRadius * Math.cos(index * 90 * Math.PI / 180),
//             y: orbitRadius * Math.sin(index * 90 * Math.PI / 180),
//             duration: duration,
//             repeat: -1,
//             ease: "sine.inOut",
//             yoyo: true
//           });
//         }
//       });
//     }

//     // Animate satellites
//     const satellites = satellitesRef.current?.children;
//     if (satellites) {
//       Array.from(satellites).forEach((satellite, index) => {
//         const path = index % 2 === 0 ? "+=300" : "-=300";
//         const duration = 8 + Math.random() * 4;

//         gsap.to(satellite, {
//           x: path,
//           y: `+=${Math.random() * 100 - 50}`,
//           rotation: 180,
//           duration: duration,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: Math.random() * 3
//         });
//       });
//     }

//     // Floating tech elements
//     const techElements = document.querySelectorAll('.tech-float');
//     techElements.forEach((element, index) => {
//       gsap.to(element, {
//         y: `+=${40 + Math.random() * 40}`,
//         x: `+=${Math.random() * 30 - 15}`,
//         rotation: Math.random() * 20 - 10,
//         duration: 4 + Math.random() * 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         delay: Math.random() * 2
//       });
//     });

//     // Mouse parallax effect
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!sceneRef.current) return;

//       const { clientX, clientY } = e;
//       const moveX = (clientX - window.innerWidth / 2) * 0.02;
//       const moveY = (clientY - window.innerHeight / 2) * 0.02;

//       // Different layers move at different speeds for depth
//       gsap.to('.parallax-layer-1', { x: moveX * 0.5, y: moveY * 0.5, duration: 1 });
//       gsap.to('.parallax-layer-2', { x: moveX * 0.3, y: moveY * 0.3, duration: 1 });
//       gsap.to('.parallax-layer-3', { x: moveX * 0.1, y: moveY * 0.1, duration: 1 });
//     };

//     window.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       gsap.globalTimeline.clear();
//     };
//   }, []);

//   return (
//     <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-slate-950">
//       {/* Deep Space Background */}
//       <div ref={sceneRef} className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-blue-950">
//         {/* Nebula Clouds */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse parallax-layer-1" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000 parallax-layer-2" />
//         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-full blur-2xl animate-pulse delay-500 parallax-layer-3" />

//         {/* Twinkling Stars */}
//         <div ref={starsRef} className="absolute inset-0 parallax-layer-1">
//           {Array.from({ length: 150 }).map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full bg-white animate-twinkle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 2 + 1}px`,
//                 height: `${Math.random() * 2 + 1}px`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 opacity: Math.random() * 0.7 + 0.3,
//               }}
//             />
//           ))}
//         </div>

//         {/* Moving Asteroids */}
//         <div ref={asteroidsRef} className="absolute inset-0 parallax-layer-2">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-4 h-4 bg-gray-400/30 rounded-full"
//               style={{
//                 left: `-50px`,
//                 top: `${20 + i * 10}%`,
//                 transform: `scale(${0.5 + Math.random() * 0.5})`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Orbiting Planets */}
//         <div ref={planetsRef} className="absolute inset-0 parallax-layer-3">
//           {/* Planet 1 */}
//           <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
//             <div className="relative">
//               <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg" />
//               <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-400/50 rounded-full -translate-x-1/2 -translate-y-1/2">
//                 <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//               </div>
//             </div>
//           </div>

//           {/* Planet 2 */}
//           <div className="absolute top-3/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
//             <div className="relative">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full shadow-lg" />
//               <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-blue-300/40 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
//             </div>
//           </div>
//         </div>

//         {/* Moving Satellites */}
//         <div ref={satellitesRef} className="absolute inset-0 parallax-layer-2">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div
//               key={i}
//               className="absolute"
//               style={{
//                 top: `${30 + i * 20}%`,
//                 left: `${i * 30}%`,
//               }}
//             >
//               <Satellite className="w-6 h-6 text-cyan-300/60" />
//             </div>
//           ))}
//         </div>

//         {/* Binary Matrix Rain */}
//         <div className="absolute inset-0 pointer-events-none opacity-20 parallax-layer-1">
//           {Array.from({ length: 30 }).map((_, i) => (
//             <div
//               key={i}
//               className="absolute font-mono text-green-400 text-xs"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 animation: `matrixRain ${8 + Math.random() * 8}s linear infinite`,
//                 animationDelay: `${Math.random() * 5}s`,
//               }}
//             >
//               {Array.from({ length: 20 }).map((_, j) => (
//                 <div key={j} className="opacity-70">
//                   {Math.random() > 0.5 ? '1' : '0'}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Tech Elements */}
//       <div className="absolute inset-0 z-5 pointer-events-none">
//         <div className="tech-float absolute top-1/6 left-1/5">
//           <Cpu className="w-8 h-8 text-purple-400/40" />
//         </div>
//         <div className="tech-float absolute top-2/3 right-1/4">
//           <Binary className="w-10 h-10 text-green-400/30" />
//         </div>
//         <div className="tech-float absolute bottom-1/4 left-1/3">
//           <Sparkles className="w-6 h-6 text-yellow-400/40" />
//         </div>
//         <div className="tech-float absolute top-1/3 right-1/6">
//           <Zap className="w-8 h-8 text-cyan-400/40" />
//         </div>
//       </div>

//       {/* Enhanced Gradient Overlay */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />

//       <motion.div
//         className="container text-center relative z-20"
//         initial="hidden"
//         animate="show"
//         viewport={{ once: true }}
//         variants={{
//           hidden: {},
//           show: {
//             transition: {
//               staggerChildren: 0.15,
//             },
//           },
//         }}
//       >
//         <motion.div
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline tracking-tighter"
//         >
//           <Balancer>
//             <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
//               Prabhat Kumar
//             </span>
//             <span className="text-cyan-400 animate-pulse">.</span>
//           </Balancer>
//         </motion.div>

//         <motion.p
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="mt-6 max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-gray-300 font-light"
//         >
//           <Balancer>
//             {siteConfig.description} I blend the art of code with the science of AI to build innovative, high-performance software solutions.
//           </Balancer>
//         </motion.p>

//         <motion.div
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
//         >
//           {/* Space-themed Primary Button */}
//           <Button asChild size="lg" className="w-full sm:w-auto group relative overflow-hidden bg-transparent border-0" data-cursor-hover>
//             <Link href="#projects" className="relative z-10">
//               <span className="relative z-10 flex items-center text-white">
//                 View My Work <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
//               </span>

//               {/* Nebula Button Effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-lg blur-lg opacity-50 group-hover:opacity-70 transition-all duration-300" />

//               {/* Stars on Button */}
//               <div className="absolute inset-0 rounded-lg overflow-hidden">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="absolute rounded-full bg-white animate-twinkle"
//                     style={{
//                       left: `${20 + i * 15}%`,
//                       top: `${30 + Math.random() * 40}%`,
//                       width: '1px',
//                       height: '1px',
//                       animationDelay: `${i * 0.5}s`,
//                     }}
//                   />
//                 ))}
//               </div>
//             </Link>
//           </Button>

//           {/* Cyber Outline Button */}
//           <Button asChild size="lg" variant="outline" className="w-full sm:w-auto group relative overflow-hidden border-2 border-cyan-400/50 bg-transparent" data-cursor-hover>
//             <a href="/Prabhat Experience Profile.pdf" target="_blank" rel="noopener noreferrer" className="relative z-10">
//               <span className="relative z-10 flex items-center text-cyan-100">
//                 Download CV <FileText className="ml-2 group-hover:scale-110 transition-transform duration-200" />
//               </span>

//               <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300" />
//               <div className="absolute inset-0 rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors duration-300" />
//             </a>
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Animated Scroll Indicator */}
//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
//         <motion.div
//           className="w-8 h-12 border-2 border-cyan-400/50 rounded-full flex justify-center p-1 relative overflow-hidden group"
//           whileHover={{ scale: 1.2 }}
//           transition={{ type: "spring", stiffness: 400, damping: 10 }}
//         >
//           <motion.div
//             className="w-1 h-3 bg-cyan-400 rounded-full z-10 group-hover:bg-cyan-300 transition-colors duration-300"
//             animate={{ y: [0, 16, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
//           />
//           <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
//         </motion.div>
//       </div>
//     </section>
//   );
// }
























// // src/components/sections/hero.tsx
// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import {
//   ArrowRight,
//   FileText,
//   Cpu,
//   CircuitBoard,
//   Server,
//   Binary,
//   Code2,
//   Brain,
//   Sparkles,
// } from "lucide-react";
// import Balancer from "react-wrap-balancer";

// import { siteConfig } from "@/lib/data";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";

// // Register GSAP plugins
// if (typeof window !== "undefined") {
//   gsap.registerPlugin();
// }

// export function Hero() {
//   const heroRef = useRef<HTMLElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const animationRef = useRef<number>();
//   const { theme, systemTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   const currentTheme = theme === "system" ? systemTheme : theme;
//   const isDark = currentTheme === "dark";

//   useEffect(() => {
//     setMounted(true);
//     return () => {
//       setMounted(false);
//     };
//   }, []);

//   // Particle system for advanced background
//   useEffect(() => {
//     if (!canvasRef.current || !mounted) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let animationId: number;

//     // Set canvas size
//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Particle class
//     class Particle {
//       x: number;
//       y: number;
//       size: number;
//       speedX: number;
//       speedY: number;
//       color: string;
//       opacity: number;
//       type: number;

//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.size = Math.random() * 2 + 0.5;
//         this.speedX = Math.random() * 1 - 0.5;
//         this.speedY = Math.random() * 1 - 0.5;
//         this.opacity = Math.random() * 0.4 + 0.1;
//         this.type = Math.floor(Math.random() * 3);

//         // Theme-based colors
//         if (isDark) {
//           const colors = [
//             `rgba(59, 130, 246, ${this.opacity})`,
//             `rgba(139, 92, 246, ${this.opacity})`,
//             `rgba(14, 165, 233, ${this.opacity})`,
//           ];
//           this.color = colors[this.type];
//         } else {
//           const colors = [
//             `rgba(37, 99, 235, ${this.opacity})`,
//             `rgba(124, 58, 237, ${this.opacity})`,
//             `rgba(2, 132, 199, ${this.opacity})`,
//           ];
//           this.color = colors[this.type];
//         }
//       }

//       update() {
//         this.x += this.speedX;
//         this.y += this.speedY;

//         if (this.x > canvas.width) this.x = 0;
//         else if (this.x < 0) this.x = canvas.width;
//         if (this.y > canvas.height) this.y = 0;
//         else if (this.y < 0) this.y = canvas.height;
//       }

//       draw() {
//         ctx!.fillStyle = this.color;
//         ctx!.beginPath();

//         if (this.type === 0) {
//           ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         } else if (this.type === 1) {
//           ctx!.fillRect(
//             this.x - this.size,
//             this.y - this.size,
//             this.size * 2,
//             this.size * 2
//           );
//         } else {
//           ctx!.moveTo(this.x, this.y - this.size);
//           ctx!.lineTo(this.x - this.size, this.y + this.size);
//           ctx!.lineTo(this.x + this.size, this.y + this.size);
//           ctx!.closePath();
//         }

//         ctx!.fill();
//       }
//     }

//     // Create particles
//     const particles: Particle[] = [];
//     const particleCount = Math.min(
//       80,
//       Math.floor((canvas.width * canvas.height) / 10000)
//     );

//     for (let i = 0; i < particleCount; i++) {
//       particles.push(new Particle());
//     }

//     // Connection lines
//     const connectParticles = () => {
//       const maxDistance = 120;
//       for (let a = 0; a < particles.length; a++) {
//         for (let b = a; b < particles.length; b++) {
//           const dx = particles[a].x - particles[b].x;
//           const dy = particles[a].y - particles[b].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < maxDistance) {
//             const opacity = 1 - distance / maxDistance;
//             ctx!.strokeStyle = isDark
//               ? `rgba(100, 100, 255, ${opacity * 0.2})`
//               : `rgba(59, 130, 246, ${opacity * 0.15})`;
//             ctx!.lineWidth = 0.5;
//             ctx!.beginPath();
//             ctx!.moveTo(particles[a].x, particles[a].y);
//             ctx!.lineTo(particles[b].x, particles[b].y);
//             ctx!.stroke();
//           }
//         }
//       }
//     };

//     // Animation loop
//     const animate = () => {
//       ctx!.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw gradient background
//       const gradient = ctx!.createLinearGradient(
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );
//       if (isDark) {
//         gradient.addColorStop(0, "rgba(15, 23, 42, 0.9)");
//         gradient.addColorStop(1, "rgba(30, 41, 59, 0.9)");
//       } else {
//         gradient.addColorStop(0, "rgba(248, 250, 252, 0.95)");
//         gradient.addColorStop(1, "rgba(241, 245, 249, 0.95)");
//       }
//       ctx!.fillStyle = gradient;
//       ctx!.fillRect(0, 0, canvas.width, canvas.height);

//       particles.forEach((particle) => {
//         particle.update();
//         particle.draw();
//       });

//       connectParticles();
//       animationId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//       if (animationId) {
//         cancelAnimationFrame(animationId);
//       }
//     };
//   }, [mounted, isDark]);

//   // Main GSAP animations
//   useEffect(() => {
//     if (!heroRef.current || !mounted) return;

//     let ctx: gsap.Context;

//     // Small delay to ensure DOM is ready
//     const timeoutId = setTimeout(() => {
//       ctx = gsap.context(() => {
//         gsap.set(
//           [
//             ".bg-element",
//             ".text-element",
//             ".button-element",
//             ".floating-element",
//           ],
//           {
//             willChange: "transform, opacity",
//           }
//         );

//         // Reset elements to visible state first
//         gsap.set(
//           [
//             ".hero-title",
//             ".hero-subtitle",
//             ".hero-description",
//             ".hero-button-primary",
//             ".hero-button-secondary",
//           ],
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//           }
//         );

//         const masterTL = gsap.timeline({ delay: 0.1 });

//         // Background elements
//         masterTL
//           .fromTo(
//             ".energy-core",
//             {
//               scale: 0,
//               opacity: 0,
//               rotation: -180,
//             },
//             {
//               scale: 1,
//               opacity: 1,
//               rotation: 0,
//               duration: 1.2,
//               ease: "power2.out",
//             }
//           )
//           .fromTo(
//             ".floating-gear",
//             {
//               scale: 0,
//               opacity: 0,
//               rotation: -360,
//             },
//             {
//               scale: 1,
//               opacity: 0.2,
//               rotation: 0,
//               duration: 0.8,
//               stagger: 0.2,
//               ease: "back.out(1.7)",
//             },
//             "-=0.8"
//           );

//         // Text animations
//         masterTL
//           .fromTo(
//             ".hero-title",
//             {
//               opacity: 0,
//               y: 80,
//             },
//             {
//               opacity: 1,
//               y: 0,
//               duration: 1,
//               ease: "power3.out",
//             },
//             "-=0.3"
//           )
//           .fromTo(
//             ".hero-subtitle",
//             {
//               opacity: 0,
//               y: 50,
//             },
//             {
//               opacity: 1,
//               y: 0,
//               duration: 0.8,
//               ease: "power2.out",
//             },
//             "-=0.5"
//           )
//           .fromTo(
//             ".hero-description",
//             {
//               opacity: 0,
//               y: 30,
//             },
//             {
//               opacity: 1,
//               y: 0,
//               duration: 0.7,
//               ease: "power2.out",
//             },
//             "-=0.4"
//           );

//         // Button animations
//         masterTL
//           .fromTo(
//             ".hero-button-primary",
//             {
//               opacity: 0,
//               y: 30,
//               scale: 0.9,
//             },
//             {
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               duration: 0.6,
//               ease: "back.out(1.7)",
//             },
//             "-=0.3"
//           )
//           .fromTo(
//             ".hero-button-secondary",
//             {
//               opacity: 0,
//               y: 30,
//               scale: 0.9,
//             },
//             {
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               duration: 0.6,
//               ease: "back.out(1.7)",
//             },
//             "-=0.4"
//           );

//         // Continuous animations
//         gsap.to(".energy-core", {
//           rotation: 360,
//           duration: 30,
//           repeat: -1,
//           ease: "none",
//           transformOrigin: "center center",
//         });

//         gsap.to(".floating-gear", {
//           rotation: 360,
//           duration: 20,
//           repeat: -1,
//           ease: "none",
//           stagger: 1.5,
//         });
//       }, heroRef);
//     }, 100);

//     return () => {
//       clearTimeout(timeoutId);
//       if (ctx) {
//         ctx.revert();
//       }
//       // Kill all GSAP animations
//       gsap.killTweensOf(".energy-core");
//       gsap.killTweensOf(".floating-gear");
//       gsap.killTweensOf(".pulse-node");
//     };
//   }, [mounted, isDark]);

//   // Reset animations when component mounts/unmounts
//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, []);

//   if (!mounted) {
//     return (
//       <section
//         id="home"
//         className="relative min-h-[100svh] flex items-center justify-center bg-background"
//       >
//         <div className="container text-center">
//           <div className="animate-pulse">
//             <div className="h-16 bg-muted rounded-lg mb-4 mx-auto max-w-2xl"></div>
//             <div className="h-8 bg-muted rounded-lg mb-8 mx-auto max-w-md"></div>
//             <div className="h-24 bg-muted rounded-lg mb-8 mx-auto max-w-3xl"></div>
//             <div className="flex justify-center gap-4">
//               <div className="h-12 bg-muted rounded-lg w-40"></div>
//               <div className="h-12 bg-muted rounded-lg w-40"></div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       ref={heroRef}
//       id="home"
//       className="relative min-h-[100svh] flex items-center justify-center overflow-hidden transition-colors duration-300 bg-background"
//       style={{
//         transform: "translateZ(0)",
//         backfaceVisibility: "hidden",
//       }}
//     >
//       {/* Advanced Canvas Background */}
//       <canvas ref={canvasRef} className="absolute inset-0 z-0" />

//       {/* Optimized Background Container */}
//       <div
//         className="absolute inset-0 z-1 overflow-hidden"
//         style={{
//           transform: "translateZ(0)",
//           willChange: "transform",
//         }}
//       >
//         {/* Base Grid */}
//         <div
//           className={`bg-element absolute inset-0 ${
//             isDark ? "bg-grid-white/[0.02]" : "bg-grid-slate-900/[0.02]"
//           } bg-[length:80px_80px]`}
//         />

//         {/* Central Energy Core */}
//         <div className="energy-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax]">
//           <div
//             className="absolute inset-0 rounded-full"
//             style={{
//               background: isDark
//                 ? `
//                 radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 60%),
//                 radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 60%),
//                 radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.25) 0%, transparent 60%)
//               `
//                 : `
//                 radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.2) 0%, transparent 60%),
//                 radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),
//                 radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.2) 0%, transparent 60%)
//               `,
//               filter: "blur(30px)",
//             }}
//           />
//         </div>

//         {/* Floating Gears */}
//         {[...Array(3)].map((_, i) => (
//           <div
//             key={i}
//             className="floating-gear bg-element absolute"
//             style={{
//               width: `${100 + i * 40}px`,
//               height: `${100 + i * 40}px`,
//               left: `${15 + i * 20}%`,
//               top: `${10 + i * 10}%`,
//               opacity: isDark ? 0.15 : 0.08,
//             }}
//           >
//             <Cpu
//               className="w-full h-full"
//               style={{
//                 color: isDark
//                   ? "rgba(59, 130, 246, 0.2)"
//                   : "rgba(37, 99, 235, 0.1)",
//               }}
//             />
//           </div>
//         ))}

//         {/* Pulse Nodes */}
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="pulse-node bg-element absolute rounded-full"
//             style={{
//               width: `${40 + i * 20}px`,
//               height: `${40 + i * 20}px`,
//               left: `${Math.random() * 80 + 10}%`,
//               top: `${Math.random() * 80 + 10}%`,
//               background: isDark
//                 ? `radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)`
//                 : `radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 70%)`,
//               filter: "blur(8px)",
//             }}
//           />
//         ))}

//         {/* Data Streams */}
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i}
//             className="data-stream bg-element absolute h-0.5"
//             style={{
//               width: `${300 + Math.random() * 200}px`,
//               left: `${-300 - Math.random() * 200}px`,
//               top: `${i * 12 + 8}%`,
//               transform: `rotate(${Math.random() * 10 - 5}deg)`,
//               background: isDark
//                 ? "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)"
//                 : "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent)",
//             }}
//           />
//         ))}
//       </div>

//       {/* Content Container */}
//       <div
//         ref={contentRef}
//         className="container text-center relative z-20 px-4 sm:px-6"
//         style={{
//           transform: "translateZ(0)",
//           willChange: "transform",
//         }}
//       >
//         {/* Main Title */}
//         <motion.div
//           className="hero-title text-element font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-heading tracking-tighter mb-4"
//           style={{
//             color: isDark ? "#f8fafc" : "#0f172a",
//             textShadow: isDark
//               ? `
//               0 2px 10px rgba(59, 130, 246, 0.3),
//               0 4px 20px rgba(139, 92, 246, 0.2)
//             `
//               : `
//               0 2px 8px rgba(37, 99, 235, 0.2),
//               0 4px 16px rgba(124, 58, 237, 0.1)
//             `,
//           }}
//         >
//           <Balancer>
//             PRABHAT
//             <motion.span
//               className="inline-block ml-2 sm:ml-4"
//               style={{
//                 background: isDark
//                   ? "linear-gradient(135deg, #60a5fa, #a78bfa, #22d3ee)"
//                   : "linear-gradient(135deg, #2563eb, #7c3aed, #0ea5e9)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//               }}
//               animate={{
//                 scale: [1, 1.05, 1],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             ></motion.span>
//           </Balancer>
//         </motion.div>

//         {/* Subtitle */}
//         <motion.div
//           className="hero-subtitle text-element font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading tracking-tighter mb-8"
//           style={{
//             color: isDark ? "#e2e8f0" : "#334155",
//           }}
//         >
//           <Balancer>KUMAR</Balancer>
//         </motion.div>

//         {/* Description */}
//         <motion.p
//           className="hero-description text-element max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-12"
//           style={{
//             color: isDark
//               ? "rgba(226, 232, 240, 0.95)"
//               : "rgba(30, 41, 59, 0.95)",
//           }}
//         >
//           {/* <Balancer>
//             Hi! I'm Prabhat Kumar, a passionate developer fascinated by AI, web technologies, and building software that solves real-world problems. I blend the art of code with the science of AI to build{" "}
//             <span style={{
//               background: isDark
//               ? 'none'
//                 // ? 'linear-gradient(135deg, #527095ff, #a78bfa)'
//                 : 'linear-gradient(135deg, #2563eb, #7b728bff)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }} className="font-semibold">
//               innovative, high-performance software solutions.
//             </span>
//           </Balancer> */}
//           <Balancer>
//             Hi! I'm Prabhat Kumar, a passionate developer fascinated by AI, web
//             technologies, and building software that solves real-world problems.
//             I blend the art of code with the science of AI to build{" "}
//             <span
//               className="font-semibold"
//               style={{
//                 color: isDark ? "#60a5fa" : "#2563eb",
//               }}
//             >
//               innovative, high-performance software solutions.
//             </span>
//           </Balancer>
//         </motion.p>

//         {/* Buttons Container */}
//         <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
//           {/* Primary Button */}
//           <motion.div
//             className="hero-button-primary button-element"
//             whileHover={{
//               scale: 1.05,
//               y: -3,
//             }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 400, damping: 17 }}
//           >
//             <Button
//               asChild
//               size="lg"
//               className="relative px-8 py-6 text-lg font-bold min-w-[200px] sm:min-w-[220px] group transform transition-all duration-200 shadow-2xl"
//               style={{
//                 background: isDark
//                   ? `
//                   linear-gradient(135deg,
//                     #3b82f6 0%,
//                     #8b5cf6 50%,
//                     #06b6d4 100%
//                 )`
//                   : `
//                   linear-gradient(135deg,
//                     #2563eb 0%,
//                     #7c3aed 50%,
//                     #0ea5e9 100%
//                 )`,
//                 border: "none",
//               }}
//             >
//               <Link
//                 href="#projects"
//                 className="relative z-10 flex items-center justify-center"
//               >
//                 <span className="text-white font-bold">VIEW MY WORK</span>
//                 <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
//               </Link>
//             </Button>
//           </motion.div>

//           {/* Secondary Button */}
//           <motion.div
//             className="hero-button-secondary button-element"
//             whileHover={{
//               scale: 1.05,
//               y: -3,
//             }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 400, damping: 17 }}
//           >
//             <Button
//               asChild
//               size="lg"
//               variant="outline"
//               className="relative px-8 py-6 text-lg font-bold min-w-[200px] sm:min-w-[220px] group transform transition-all duration-200 backdrop-blur-lg border-2"
//               style={{
//                 background: isDark
//                   ? "rgba(255, 255, 255, 0.1)"
//                   : "rgba(255, 255, 255, 0.8)",
//                 borderColor: isDark
//                   ? "rgba(59, 130, 246, 0.5)"
//                   : "rgba(37, 99, 235, 0.4)",
//               }}
//             >
//               <a
//                 href="/Prabhat Experience Profile.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="relative z-10 flex items-center justify-center"
//               >
//                 <span
//                   style={{
//                     color: isDark ? "#ffffff" : "transparent",
//                     background: isDark
//                       ? "none"
//                       : "linear-gradient(135deg, #2563eb, #7c3aed)",
//                     WebkitBackgroundClip: isDark ? "unset" : "text",
//                     WebkitTextFillColor: isDark ? "#ffffff" : "transparent",
//                     backgroundClip: isDark ? "unset" : "text",
//                   }}
//                   className="font-bold"
//                 >
//                   DOWNLOAD CV
//                 </span>
//                 <FileText
//                   className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200"
//                   style={{
//                     color: isDark ? "#ffffff" : "#2563eb",
//                   }}
//                 />
//               </a>
//             </Button>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
//         animate={{
//           y: [0, -8, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <div
//           className={`w-8 h-12 rounded-full flex justify-center p-1 backdrop-blur-sm border ${
//             isDark
//               ? "border-blue-400/40 bg-black/30"
//               : "border-blue-600/40 bg-white/60"
//           } shadow-lg`}
//         >
//           <motion.div
//             className="w-1.5 h-3 rounded-full"
//             style={{
//               background: isDark
//                 ? "linear-gradient(to bottom, #60a5fa, #a78bfa)"
//                 : "linear-gradient(to bottom, #2563eb, #7c3aed)",
//             }}
//             animate={{ y: [0, 16, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//           />
//         </div>
//       </motion.div>
//     </section>
//   );
// }






















// // src/components/sections/hero.tsx
// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { ArrowRight, FileText } from "lucide-react";
// import Balancer from "react-wrap-balancer";

// import { siteConfig } from "@/lib/data";
// import { Button } from "@/components/ui/button";

// export function Hero() {
//   const FADE_DOWN_ANIMATION_VARIANTS = {
//     hidden: { opacity: 0, y: -10 },
//     show: { opacity: 1, y: 0, transition: { type: "spring" } },
//   };

//   return (
//     <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
//        {/* Grid Background */}
//       <div className="absolute inset-0 z-0 bg-background">
//         <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[length:20px_20px] dark:bg-grid-slate-400/[0.05] dark:bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_75%)]" />
//       </div>
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />

//       <motion.div
//         className="container text-center relative z-20"
//         initial="hidden"
//         animate="show"
//         viewport={{ once: true }}
//         variants={{
//           hidden: {},
//           show: {
//             transition: {
//               staggerChildren: 0.15,
//             },
//           },
//         }}
//       >
//         <motion.div
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline tracking-tighter"
//         >
//           <Balancer>
//             Prabhat Kumar
//             <span className="text-primary">.</span>
//           </Balancer>
//         </motion.div>

//         <motion.p
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="mt-6 max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-muted-foreground"
//         >
//           <Balancer>
//             {siteConfig.description} I blend the art of code with the science of AI to build innovative, high-performance software solutions.
//           </Balancer>
//         </motion.p>

//         <motion.div
//           variants={FADE_DOWN_ANIMATION_VARIANTS}
//           className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
//         >
//           <Button asChild size="lg" className="w-full sm:w-auto" data-cursor-hover>
//             <Link href="#projects">
//               View My Work <ArrowRight className="ml-2" />
//             </Link>
//           </Button>
//           <Button asChild size="lg" variant="outline" className="w-full sm:w-auto" data-cursor-hover>
//             <a href="/Prabhat Experience Profile.pdf" target="_blank" rel="noopener noreferrer">
//               Download CV <FileText className="ml-2" />
//             </a>
//           </Button>
//         </motion.div>
//       </motion.div>

//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
//         <div className="w-6 h-10 border-2 border-foreground/50 rounded-full flex justify-center p-1">
//           <motion.div
//             className="w-1 h-2 bg-primary rounded-full"
//             animate={{ y: [0, 16, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }





























// // src/components/sections/hero.tsx
// "use client";

// import Link from "next/link";
// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { ArrowRight, FileText, Cpu, CircuitBoard, Server, Binary, Code2, Brain } from "lucide-react";
// import Balancer from "react-wrap-balancer";

// import { siteConfig } from "@/lib/data";
// import { Button } from "@/components/ui/button";

// // Register GSAP plugins
// if (typeof window !== "undefined") {
//   gsap.registerPlugin();
// }

// export function Hero() {
//   const heroRef = useRef<HTMLElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!heroRef.current) return;

//     // Kill any existing animations first
//     gsap.killTweensOf(heroRef.current);

//     const ctx = gsap.context(() => {
//       // Optimize performance by using will-change
//       gsap.set([".bg-element", ".text-element", ".button-element"], {
//         willChange: "transform, opacity"
//       });

//       // Smooth background animations
//       gsap.to(".energy-core", {
//         scale: 1.2,
//         rotation: 360,
//         duration: 20,
//         repeat: -1,
//         ease: "linear",
//         transformOrigin: "center center"
//       });

//       // Floating gears - optimized
//       gsap.to(".floating-gear", {
//         rotation: 360,
//         duration: 25,
//         repeat: -1,
//         ease: "none",
//         stagger: 2
//       });

//       // Pulse nodes - optimized timing
//       gsap.to(".pulse-node", {
//         scale: 1.8,
//         opacity: 0.6,
//         duration: 3,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: 0.8
//       });

//       // Data streams - optimized
//       gsap.to(".data-stream", {
//         x: 2000,
//         duration: 8,
//         repeat: -1,
//         ease: "none",
//         stagger: 1.5
//       });

//       // Tech icons floating
//       gsap.to(".tech-icon", {
//         y: -30,
//         duration: 4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: 1
//       });

//       // Cinematic entrance sequence - optimized
//       const masterTL = gsap.timeline({ delay: 0.2 });

//       masterTL
//         .fromTo(".energy-core",
//           { scale: 0, opacity: 0 },
//           { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
//         )
//         .fromTo(".hero-title",
//           {
//             opacity: 0,
//             y: 100,
//             rotationX: 85
//           },
//           {
//             opacity: 1,
//             y: 0,
//             rotationX: 0,
//             duration: 1.8,
//             ease: "power3.out"
//           },
//           "-=0.8"
//         )
//         .fromTo(".hero-subtitle",
//           {
//             opacity: 0,
//             y: 50
//           },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 1.5,
//             ease: "power2.out"
//           },
//           "-=1.2"
//         )
//         .fromTo(".hero-description",
//           {
//             opacity: 0,
//             y: 30
//           },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 1.2,
//             ease: "power2.out"
//           },
//           "-=0.8"
//         )
//         .fromTo(".hero-button-primary",
//           {
//             opacity: 0,
//             y: 40,
//             scale: 0.8
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 1,
//             ease: "back.out(1.7)"
//           },
//           "-=0.5"
//         )
//         .fromTo(".hero-button-secondary",
//           {
//             opacity: 0,
//             y: 40,
//             scale: 0.8
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 1,
//             ease: "back.out(1.7)"
//           },
//           "-=0.8"
//         );

//     }, heroRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={heroRef}
//       id="home"
//       className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black"
//       style={{
//         transform: 'translateZ(0)',
//         backfaceVisibility: 'hidden'
//       }}
//     >
//       {/* Optimized Background Container */}
//       <div
//         className="absolute inset-0 z-0 overflow-hidden"
//         style={{
//           transform: 'translateZ(0)',
//           willChange: 'transform'
//         }}
//       >
//         {/* Base Grid */}
//         <div className="bg-element absolute inset-0 bg-grid-white/[0.02] bg-[length:80px_80px]" />

//         {/* Central Energy Core - Optimized */}
//         <div className="energy-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax]">
//           <div
//             className="absolute inset-0 rounded-full"
//             style={{
//               background: `
//                 radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
//                 radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
//                 radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.35) 0%, transparent 60%)
//               `,
//               filter: 'blur(40px)',
//             }}
//           />
//         </div>

//         {/* Floating Gears - Optimized */}
//         {[...Array(3)].map((_, i) => (
//           <div
//             key={i}
//             className="floating-gear bg-element absolute opacity-20"
//             style={{
//               width: `${150 + i * 80}px`,
//               height: `${150 + i * 80}px`,
//               left: `${15 + i * 20}%`,
//               top: `${10 + i * 15}%`,
//             }}
//           >
//             <Cpu className="w-full h-full text-blue-400/25" />
//           </div>
//         ))}

//         {/* Circuit Boards */}
//         {[...Array(2)].map((_, i) => (
//           <div
//             key={i}
//             className="bg-element absolute opacity-15"
//             style={{
//               width: `${400 + i * 200}px`,
//               height: `${400 + i * 200}px`,
//               right: `${i * 20}%`,
//               bottom: `${i * 15}%`,
//             }}
//           >
//             <CircuitBoard className="w-full h-full text-purple-400/20" />
//           </div>
//         ))}

//         {/* Pulse Nodes - Optimized */}
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="pulse-node bg-element absolute rounded-full"
//             style={{
//               width: `${80 + i * 40}px`,
//               height: `${80 + i * 40}px`,
//               left: `${Math.random() * 70 + 15}%`,
//               top: `${Math.random() * 70 + 15}%`,
//               background: `radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%)`,
//               filter: 'blur(15px)',
//             }}
//           />
//         ))}

//         {/* Data Streams - Optimized */}
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i}
//             className="data-stream bg-element absolute h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
//             style={{
//               width: `${500 + Math.random() * 200}px`,
//               left: `${-300 - Math.random() * 200}px`,
//               top: `${(i * 12) + 8}%`,
//               transform: `rotate(${Math.random() * 20 - 10}deg)`,
//             }}
//           />
//         ))}

//         {/* Tech Icons - Optimized */}
//         {[Server, Binary, Code2, Brain].map((Icon, i) => (
//           <div
//             key={i}
//             className="tech-icon bg-element absolute opacity-20"
//             style={{
//               left: `${15 + i * 20}%`,
//               top: `${65 + Math.sin(i) * 15}%`,
//             }}
//           >
//             <Icon className="w-12 h-12 text-green-400/25" />
//           </div>
//         ))}
//       </div>

//       {/* Content Container */}
//       <div
//         ref={contentRef}
//         className="container text-center relative z-20"
//         style={{
//           transform: 'translateZ(0)',
//           willChange: 'transform'
//         }}
//       >
//         {/* Main Title */}
//         <motion.div
//           className="hero-title text-element font-bold text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-headline tracking-tighter mb-4"
//           style={{
//             textShadow: `
//               0 1px 0 #ccc,
//               0 2px 0 #c9c9c9,
//               0 3px 0 #bbb,
//               0 4px 0 #b9b9b9,
//               0 5px 0 #aaa,
//               0 6px 1px rgba(0,0,0,.1),
//               0 0 5px rgba(0,0,0,.1),
//               0 1px 3px rgba(0,0,0,.3),
//               0 3px 5px rgba(0,0,0,.2),
//               0 15px 30px rgba(59, 130, 246, 0.2)
//             `,
//           }}
//         >
//           <Balancer>
//             PRABHAT
//             <motion.span
//               className="text-primary inline-block ml-2 sm:ml-4"
//               animate={{
//                 scale: [1, 1.2, 1],
//                 opacity: [1, 0.8, 1],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//             </motion.span>
//           </Balancer>
//         </motion.div>

//         {/* Subtitle */}
//         <motion.div
//           className="hero-subtitle text-element font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline tracking-tighter mb-8"
//           style={{
//             textShadow: `
//               0 1px 0 #666,
//               0 2px 0 #5a5a5a,
//               0 3px 0 #555,
//               0 8px 15px rgba(139, 92, 246, 0.15)
//             `,
//           }}
//         >
//           <Balancer>
//             KUMAR
//           </Balancer>
//         </motion.div>

//         {/* Description */}
//         <motion.p
//           className="hero-description text-element max-w-3xl mx-auto text-base md:text-xl lg:text-2xl text-white/80 font-light leading-relaxed mb-12"
//           style={{
//             textShadow: '0 2px 8px rgba(0,0,0,0.5)',
//           }}
//         >
//           <Balancer>
//             {siteConfig.description} I blend the art of code with the science of AI to build
//             <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
//               {" "}innovative, high-performance software solutions.
//             </span>
//           </Balancer>
//         </motion.p>

//         {/* Buttons Container - Aligned */}
//         <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
//           {/* Primary Button */}
//           <motion.div
//             className="hero-button-primary button-element"
//             whileHover={{
//               scale: 1.05,
//               y: -2,
//             }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ type: "spring", stiffness: 400, damping: 17 }}
//           >
//             <Button
//               asChild
//               size="lg"
//               className="relative px-8 py-6 text-lg font-semibold min-w-[200px] sm:min-w-[220px]"
//               style={{
//                 background: `
//                   linear-gradient(135deg,
//                     rgba(59, 130, 246, 0.95) 0%,
//                     rgba(139, 92, 246, 0.9) 50%,
//                     rgba(14, 165, 233, 0.85) 100%
//                 )`,
//                 boxShadow: `
//                   inset 0 1px 0 rgba(255, 255, 255, 0.4),
//                   0 4px 6px -1px rgba(0, 0, 0, 0.3),
//                   0 10px 15px -3px rgba(59, 130, 246, 0.4)
//                 `,
//                 border: '1px solid rgba(255, 255, 255, 0.2)',
//               }}
//             >
//               <Link href="#projects" className="relative z-10 flex items-center justify-center">
//                 <span className="text-white font-semibold">
//                   VIEW MY WORK
//                 </span>
//                 <ArrowRight className="ml-3 w-5 h-5" />
//               </Link>
//             </Button>
//           </motion.div>

//           {/* Secondary Button - Same Level */}
//           <motion.div
//             className="hero-button-secondary button-element"
//             whileHover={{
//               scale: 1.05,
//               y: -2,
//             }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ type: "spring", stiffness: 400, damping: 17 }}
//           >
//             <Button
//               asChild
//               size="lg"
//               variant="outline"
//               className="relative px-8 py-6 text-lg font-semibold min-w-[200px] sm:min-w-[220px] backdrop-blur-lg"
//               style={{
//                 background: 'rgba(255, 255, 255, 0.08)',
//                 border: '1px solid rgba(59, 130, 246, 0.4)',
//                 boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
//               }}
//             >
//               <a
//                 href="/Prabhat Experience Profile.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="relative z-10 flex items-center justify-center"
//               >
//                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
//                   DOWNLOAD CV
//                 </span>
//                 <FileText className="ml-3 w-5 h-5 text-blue-400" />
//               </a>
//             </Button>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
//         animate={{
//           y: [0, -8, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <div className="w-8 h-12 border border-blue-400/30 rounded-full flex justify-center p-1 backdrop-blur-sm">
//           <motion.div
//             className="w-1.5 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
//             animate={{ y: [0, 16, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//           />
//         </div>
//       </motion.div>
//     </section>
//   );
// }
