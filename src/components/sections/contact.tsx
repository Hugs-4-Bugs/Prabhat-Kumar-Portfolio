// src/components/sections/contact.tsx
"use client";

import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Mail, Phone, MapPin, Send, Sparkles, Orbit, Zap, Brain } from "lucide-react";
import { ContactFormHandler } from "@/components/contact-form-handler";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export function Contact() {
  const { email, phone, location } = siteConfig;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<QuantumParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Quantum particle system
  const initParticles = useCallback(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 4 + 1,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 200,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    setMounted(true);
    initParticles();
  }, [initParticles]);

  // Canvas background animation
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.03)');

    const animate = () => {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated grid
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      const spacing = 40;
      const time = Date.now() * 0.001;

      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time + x * 0.01) * 2, 0);
        ctx.lineTo(x + Math.cos(time + x * 0.008) * 2, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(time + y * 0.01) * 2);
        ctx.lineTo(canvas.width, y + Math.cos(time + y * 0.008) * 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted]);

  // Master GSAP animations
  useEffect(() => {
    if (!mounted || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax cursor effect
      const handleMouseMove = (e: MouseEvent) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        
        const { left, top, width, height } = sectionRef.current!.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(".parallax-layer-1", {
          x: x * 30,
          y: y * 30,
          duration: 2,
          ease: "power2.out"
        });

        gsap.to(".parallax-layer-2", {
          x: x * 60,
          y: y * 60,
          duration: 2.5,
          ease: "power2.out"
        });

        gsap.to(".parallax-layer-3", {
          x: x * 90,
          y: y * 90,
          duration: 3,
          ease: "power2.out"
        });
      };

      // Quantum entrance sequence
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.set(".quantum-element", { opacity: 0, scale: 0.8 });
          }
        }
      });

      masterTL
        // Header sequence
        .fromTo(".section-heading-master", 
          { 
            opacity: 0, 
            y: 100,
            rotationX: 45,
            filter: "blur(10px)"
          },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power4.out"
          }
        )
        // Orbital elements
        .fromTo(".orbital-element",
          {
            opacity: 0,
            scale: 0.3,
            rotation: -180
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.6,
            stagger: 0.15,
            ease: "back.out(2)"
          },
          "-=1.2"
        )
        // Contact cards quantum entrance
        .fromTo(".quantum-card",
          {
            opacity: 0,
            y: 80,
            rotationY: -25,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.4,
            stagger: 0.2,
            ease: "power3.out"
          },
          "-=1"
        )
        // Form materialization
        .fromTo(".form-quantum",
          {
            opacity: 0,
            scale: 0.95,
            filter: "blur(20px)"
          },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.inOut"
          },
          "-=0.8"
        );

      // Continuous hologram animation
      const hologramTL = gsap.timeline({ repeat: -1, yoyo: true });
      hologramTL
        .to(".hologram-beam", {
          scaleY: 1.8,
          opacity: 0.6,
          duration: 2,
          stagger: 0.3,
          ease: "sine.inOut"
        })
        .to(".hologram-node", {
          scale: 1.3,
          duration: 1.5,
          stagger: 0.2,
          ease: "power2.inOut"
        }, "-=1.5");

      // Magnetic fields with quantum physics
      const setupQuantumMagneticFields = () => {
        const magneticElements = document.querySelectorAll("[data-quantum-magnetic]");
        
        magneticElements.forEach((element: Element) => {
          const el = element as HTMLElement;
          let isActive = false;

          el.addEventListener("mouseenter", () => {
            isActive = true;
            gsap.to(el, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          el.addEventListener("mousemove", (e: MouseEvent) => {
            if (!isActive) return;

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const power = Math.min(1.5, 40 / (distance + 0.1));
            
            gsap.to(el, {
              x: x * power * 0.4,
              y: y * power * 0.4,
              rotationY: x * power * 0.2,
              rotationX: -y * power * 0.2,
              duration: 1,
              ease: "power2.out"
            });

            // Create particle ripple effect
            if (distance < 50 && Math.random() > 0.7) {
              createMagneticRipple(e.clientX, e.clientY);
            }
          });

          el.addEventListener("mouseleave", () => {
            isActive = false;
            gsap.to(el, {
              x: 0,
              y: 0,
              rotationY: 0,
              rotationX: 0,
              scale: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.5)"
            });
          });
        });
      };

      const createMagneticRipple = (x: number, y: number) => {
        const ripple = document.createElement('div');
        ripple.className = 'absolute w-2 h-2 bg-primary/30 rounded-full pointer-events-none';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);

        gsap.to(ripple, {
          scale: 8,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            document.body.removeChild(ripple);
          }
        });
      };

      setupQuantumMagneticFields();
      sectionRef.current?.addEventListener("mousemove", handleMouseMove);

      return () => {
        sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
        hologramTL.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  // Quantum gradient animations
  useEffect(() => {
    if (!mounted) return;

    const gradients = gsap.utils.toArray(".quantum-gradient");
    gradients.forEach((gradient: any) => {
      gsap.to(gradient, {
        backgroundPosition: "200% 200%",
        duration: 8 + Math.random() * 4,
        repeat: -1,
        ease: "linear"
      });
    });

    // Floating animation for quantum particles
    particles.forEach((particle) => {
      gsap.to(`.quantum-particle-${particle.id}`, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 80 - 40}`,
        rotation: Math.random() * 360,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, [mounted, particles]);

  if (!mounted) {
    return (
      <Section id="contact" className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-accent/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading>Quantum Connection</SectionHeading>
          <div className="h-96 flex items-center justify-center">
            <div className="text-lg text-muted-foreground">Initializing quantum interface...</div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-accent/5"
    >
      {/* Quantum Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />

      {/* Quantum Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full quantum-particle-${particle.id} quantum-element
              bg-gradient-to-r from-primary/40 via-accent/30 to-cyan-400/20 
              backdrop-blur-sm border border-white/10 shadow-lg`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Holographic Interface */}
      <div ref={hologramRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hologram-beam absolute top-1/4 left-1/4 w-0.5 h-32 bg-gradient-to-b from-purple-400/40 via-cyan-400/30 to-transparent transform rotate-45 parallax-layer-1" />
        <div className="hologram-beam absolute top-1/3 right-1/4 w-0.5 h-24 bg-gradient-to-b from-blue-400/30 via-green-400/20 to-transparent transform -rotate-12 parallax-layer-2" />
        <div className="hologram-beam absolute bottom-1/4 left-1/3 w-0.5 h-36 bg-gradient-to-t from-green-400/25 via-yellow-400/20 to-transparent transform rotate-20 parallax-layer-3" />
        
        <div className="hologram-node absolute top-2/3 left-1/5 w-3 h-3 bg-primary/40 rounded-full blur-sm parallax-layer-1" />
        <div className="hologram-node absolute bottom-1/3 right-1/5 w-2 h-2 bg-accent/30 rounded-full blur parallax-layer-2" />
      </div>

      <div className="relative z-10">
        {/* Orbital Header */}
        <div className="text-center mb-20 relative">
          <div className="orbital-element absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary/20 rounded-full" />
          <div className="orbital-element absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-accent/15 rounded-full" />
          
          <SectionHeading className="section-heading-master mb-8">
            <span className="inline-flex items-center gap-4">
              <Orbit className="w-8 h-8 text-primary animate-spin-slow" />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Quantum Connection
              </span>
              <Zap className="w-8 h-8 text-cyan-500 animate-pulse" />
            </span>
          </SectionHeading>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto parallax-layer-1">
            Let's transcend digital boundaries and create experiences that defy expectations
          </p>
        </div>

        <div className="max-w-8xl mx-auto px-4">
          {/* Quantum Grid */}
          <div className="grid xl:grid-cols-12 gap-8 items-start mb-16">
            {/* Contact Portal - Left */}
            <div className="xl:col-span-5 space-y-8">
              <div 
                data-quantum-magnetic
                className="quantum-card group relative"
              >
                {/* Multi-dimensional Border */}
                <div className="quantum-gradient absolute -inset-1 bg-gradient-to-r from-purple-600/60 via-pink-500/50 to-cyan-600/60 rounded-3xl opacity-70 group-hover:opacity-100 transition-all duration-1000 blur-[2px]" />
                <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                {/* Card Content */}
                <div className="relative bg-background/90 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 transform-gpu transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                    <h3 className="text-3xl font-bold font-headline">
                      <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                        Neural Interface
                      </span>
                    </h3>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Connect with me through multiple quantum channels. Each interaction is optimized for maximum resonance and minimal entropy.
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Mail, href: `mailto:${email}`, text: email, description: "Primary quantum channel" },
                      { icon: Phone, href: `tel:${phone}`, text: phone, description: "Vocal frequency transmission" },
                      { icon: MapPin, href: null, text: location, description: "Spatial coordinates" }
                    ].map((item, index) => (
                      <div
                        key={index}
                        data-quantum-magnetic
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/30 to-transparent hover:from-secondary/50 transition-all duration-500 group/item transform-gpu hover:scale-105 border border-white/5 hover:border-white/10"
                      >
                        <div className="relative mt-1">
                          <item.icon className="w-5 h-5 text-primary transform-gpu group-hover/item:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                          {item.href ? (
                            <a 
                              href={item.href}
                              className="text-lg font-semibold text-foreground/90 hover:text-primary transition-all duration-300 block"
                            >
                              {item.text}
                            </a>
                          ) : (
                            <p className="text-lg font-semibold text-foreground/90">
                              {item.text}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Quantum Portal - Right */}
            <div className="xl:col-span-7">
              <div 
                data-quantum-magnetic
                className="quantum-card group relative h-full min-h-[600px]"
              >
                {/* 4D Portal Effect */}
                <div className="quantum-gradient absolute -inset-2 bg-gradient-to-br from-primary/40 via-transparent to-accent/30 rounded-3xl transform rotate-3 scale-105 group-hover:rotate-0 group-hover:scale-100 transition-all duration-1000" />
                <div className="absolute -inset-3 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
                
                {/* Portal Content */}
                <div className="relative bg-gradient-to-br from-background/95 to-secondary/10 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 h-full flex flex-col justify-center items-center text-center transform-gpu transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                  
                  {/* Quantum Core */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center transform-gpu group-hover:scale-110 group-hover:rotate-180 transition-all duration-1000 shadow-2xl">
                      <Send className="w-12 h-12 text-white transform-gpu group-hover:scale-125 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-cyan-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                    
                    {/* Orbiting elements */}
                    <div className="absolute -inset-4">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500/30 rounded-full blur-sm group-hover:scale-150 transition-transform duration-1000" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-cyan-400/40 rounded-full blur group-hover:scale-200 transition-transform duration-1200" />
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold font-headline mb-4">
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      Initiate Quantum Handshake
                    </span>
                  </h4>
                  
                  <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                    Your message travels through encrypted quantum channels, ensuring zero latency and maximum impact upon arrival.
                  </p>

                  {/* Quantum Status */}
                  <div className="flex items-center justify-center gap-6">
                    {[
                      { color: "bg-green-500", label: "Quantum Online" },
                      { color: "bg-blue-500", label: "Channels Open" },
                      { color: "bg-purple-500", label: "Ready" }
                    ].map((status, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${status.color} rounded-full animate-pulse`} />
                        <span className="text-sm text-muted-foreground">{status.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Form Interface */}
          <div className="form-quantum">
            <div 
              data-quantum-magnetic
              className="group relative max-w-6xl mx-auto"
            >
              {/* Form Portal Border */}
              <div className="quantum-gradient absolute -inset-2 bg-gradient-to-r from-purple-600/50 via-pink-500/40 to-cyan-600/50 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 blur-[2px]" />
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-cyan-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-1000" />
              
              {/* Form Container */}
              <div className="relative bg-background/90 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 transform-gpu transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-headline mb-2">
                    <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                      Quantum Message Transmission
                    </span>
                  </h3>
                  <p className="text-muted-foreground">
                    Encode your message in the quantum field for instant delivery
                  </p>
                </div>
                <ContactFormHandler />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Styles */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .quantum-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* Ultra-smooth scrolling with momentum */
        html {
          
          scroll-padding-top: 2rem;
        }

        /* Quantum performance optimizations */
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform;
        }

        /* Quantum magnetic field boundaries */
        [data-quantum-magnetic] {
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Enhanced cursor for quantum interface */
        .group:hover [data-quantum-magnetic] {
          cursor: none;
        }
      `}</style>
    </Section>
  );
}



































// // src/components/sections/contact.tsx
// "use client";

// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
// import { ContactFormHandler } from "@/components/contact-form-handler";
// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Only register on client side
// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// interface Particle {
//   id: number;
//   x: number;
//   y: number;
//   size: number;
//   duration: number;
// }

// export function Contact() {
//   const { email, phone, location } = siteConfig;
//   const sectionRef = useRef<HTMLElement>(null);
//   const [mounted, setMounted] = useState(false);
//   const [particles, setParticles] = useState<Particle[]>([]);

//   // Initialize on mount
//   useEffect(() => {
//     setMounted(true);
    
//     // Create particles
//     const initialParticles = Array.from({ length: 8 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       duration: Math.random() * 15 + 10,
//     }));
//     setParticles(initialParticles);
//   }, []);

//   useEffect(() => {
//     if (!mounted || !sectionRef.current) return;

//     const ctx = gsap.context(() => {
//       // Master timeline for scroll-triggered animations
//       const masterTL = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 75%",
//           end: "bottom 25%",
//           toggleActions: "play none none reverse",
//         },
//       });

//       // Section entrance sequence
//       masterTL
//         .fromTo(".section-heading-contact", 
//           { 
//             opacity: 0, 
//             y: 60,
//             rotationX: 30 
//           },
//           { 
//             opacity: 1, 
//             y: 0, 
//             rotationX: 0,
//             duration: 1.2,
//             ease: "power3.out"
//           }
//         )
//         .fromTo(".contact-card-left",
//           {
//             opacity: 0,
//             x: -50,
//             rotationY: -10,
//           },
//           {
//             opacity: 1,
//             x: 0,
//             rotationY: 0,
//             duration: 1,
//             ease: "power2.out"
//           },
//           "-=0.6"
//         )
//         .fromTo(".contact-card-right",
//           {
//             opacity: 0,
//             x: 50,
//             rotationY: 10,
//           },
//           {
//             opacity: 1,
//             x: 0,
//             rotationY: 0,
//             duration: 1,
//             ease: "power2.out"
//           },
//           "-=0.8"
//         )
//         .fromTo(".contact-form-container",
//           {
//             opacity: 0,
//             y: 40,
//             scale: 0.98
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 0.8,
//             ease: "back.out(1.2)"
//           },
//           "-=0.4"
//         );

//       // Particle animations
//       particles.forEach((particle) => {
//         gsap.to(`.particle-${particle.id}`, {
//           y: `+=${Math.random() * 100 - 50}`,
//           x: `+=${Math.random() * 60 - 30}`,
//           rotation: Math.random() * 360,
//           duration: particle.duration,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });
//       });

//       // Holographic beams animation
//       gsap.to(".holographic-beam", {
//         y: -30,
//         rotation: "+=5",
//         duration: 3,
//         repeat: -1,
//         yoyo: true,
//         stagger: 0.3,
//         ease: "sine.inOut"
//       });

//       // Magnetic effect setup
//       const setupMagneticEffects = () => {
//         const magneticElements = document.querySelectorAll("[data-magnetic]");
        
//         magneticElements.forEach((element: Element) => {
//           const el = element as HTMLElement;
          
//           el.addEventListener("mousemove", (e: MouseEvent) => {
//             const rect = el.getBoundingClientRect();
//             const x = e.clientX - rect.left - rect.width / 2;
//             const y = e.clientY - rect.top - rect.height / 2;
            
//             const distance = Math.sqrt(x * x + y * y);
//             const power = Math.min(1, 25 / distance);
            
//             gsap.to(el, {
//               x: x * power * 0.2,
//               y: y * power * 0.2,
//               rotationY: x * power * 0.05,
//               rotationX: -y * power * 0.05,
//               duration: 0.8,
//               ease: "power2.out"
//             });
//           });

//           el.addEventListener("mouseleave", () => {
//             gsap.to(el, {
//               x: 0,
//               y: 0,
//               rotationY: 0,
//               rotationX: 0,
//               duration: 1.2,
//               ease: "elastic.out(1, 0.6)"
//             });
//           });
//         });
//       };

//       setupMagneticEffects();

//     }, sectionRef);

//     return () => ctx.revert();
//   }, [mounted, particles]);

//   // Dynamic gradient animation
//   useEffect(() => {
//     if (!mounted) return;

//     const gradientAnimation = gsap.to(".dynamic-gradient", {
//       backgroundPosition: "200% 0%",
//       duration: 6,
//       repeat: -1,
//       ease: "linear"
//     });

//     return () => {
//       gradientAnimation.kill();
//     };
//   }, [mounted]);

//   if (!mounted) {
//     return (
//       <Section id="contact" className="bg-secondary/20">
//         <div className="max-w-6xl mx-auto">
//           <SectionHeading>Contact Me</SectionHeading>
//           {/* Simple fallback */}
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <div className="h-6 bg-muted rounded animate-pulse"></div>
//               <div className="h-4 bg-muted rounded animate-pulse"></div>
//             </div>
//             <div className="hidden md:block">
//               <div className="h-64 bg-muted rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </Section>
//     );
//   }

//   return (
//     <Section 
//       id="contact" 
//       ref={sectionRef}
//       className="relative overflow-hidden bg-gradient-to-b from-secondary/10 to-background/50"
//     >
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Floating Particles */}
//         {particles.map((particle) => (
//           <div
//             key={particle.id}
//             className={`absolute rounded-full particle-${particle.id}
//               bg-gradient-to-r from-primary/20 to-accent/10 
//               border border-white/5 backdrop-blur-sm`}
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//             }}
//           />
//         ))}

//         {/* Holographic Beams */}
//         <div className="holographic-beam absolute top-1/4 left-1/4 w-0.5 h-24 bg-gradient-to-b from-purple-400/20 via-transparent to-transparent transform rotate-45" />
//         <div className="holographic-beam absolute top-1/3 right-1/4 w-0.5 h-20 bg-gradient-to-b from-blue-400/15 via-transparent to-transparent transform -rotate-12" />
//         <div className="holographic-beam absolute bottom-1/4 left-1/3 w-0.5 h-28 bg-gradient-to-t from-green-400/15 via-transparent to-transparent transform rotate-20" />
//         <div className="holographic-beam absolute bottom-1/3 right-1/3 w-0.5 h-22 bg-gradient-to-t from-cyan-400/15 via-transparent to-transparent transform -rotate-30" />
//       </div>

//       <div className="relative z-10">
//         <SectionHeading className="section-heading-contact text-center mb-12">
//           <span className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//             <Sparkles className="w-6 h-6 text-primary" />
//             Let's Create Together
//             <Sparkles className="w-6 h-6 text-primary" />
//           </span>
//         </SectionHeading>

//         <div className="max-w-7xl mx-auto px-4">
//           {/* Main Content Grid */}
//           <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
//             {/* Contact Info Card */}
//             <div className="contact-card-left group relative">
//               {/* Animated Border */}
//               <div className="dynamic-gradient absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-2xl opacity-60 group-hover:opacity-80 transition-all duration-500 blur-[1px]" />
              
//               {/* Card Content */}
//               <div className="relative bg-background/80 backdrop-blur-md rounded-xl p-6 border border-border/50 transform-gpu transition-all duration-500 group-hover:shadow-xl">
//                 <h3 className="text-2xl font-bold font-headline mb-4">
//                   <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                     Get In Touch
//                   </span>
//                 </h3>
                
//                 <p className="text-muted-foreground mb-6 leading-relaxed">
//                   I'm always excited to discuss new projects, creative ideas, and opportunities to bring your vision to life.
//                 </p>

//                 <div className="space-y-3">
//                   {[
//                     { icon: Mail, href: `mailto:${email}`, text: email },
//                     { icon: Phone, href: `tel:${phone}`, text: phone },
//                     { icon: MapPin, href: null, text: location }
//                   ].map((item, index) => (
//                     <div
//                       key={index}
//                       data-magnetic
//                       className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group/item transform-gpu hover:scale-105 border border-border/30"
//                     >
//                       <div className="relative">
//                         <item.icon className="w-5 h-5 text-primary" />
//                       </div>
//                       {item.href ? (
//                         <a 
//                           href={item.href}
//                           className="text-foreground/90 hover:text-primary transition-colors duration-300"
//                         >
//                           {item.text}
//                         </a>
//                       ) : (
//                         <p className="text-foreground/90">
//                           {item.text}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Visual Card */}
//             <div className="contact-card-right group relative hidden lg:block">
//               <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-2xl transform rotate-1 scale-105 group-hover:rotate-0 group-hover:scale-100 transition-all duration-500" />
              
//               <div className="relative bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-md rounded-xl p-8 border border-border/50 h-full flex flex-col justify-center items-center text-center transform-gpu transition-all duration-500 group-hover:shadow-xl">
//                 <div className="relative mb-6">
//                   <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center transform-gpu group-hover:scale-110 transition-transform duration-500">
//                     <Send className="w-6 h-6 text-white" />
//                   </div>
//                 </div>

//                 <h4 className="text-xl font-bold font-headline mb-3">
//                   <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
//                     Ready to Start?
//                   </span>
//                 </h4>
                
//                 <p className="text-muted-foreground mb-6">
//                   Let's discuss your project and create something amazing together.
//                 </p>

//                 <div className="flex justify-center space-x-2">
//                   {[...Array(3)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="w-2 h-2 bg-primary rounded-full opacity-60 animate-bounce"
//                       style={{ 
//                         animationDelay: `${i * 0.2}s`,
//                         animationDuration: '1.2s'
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="contact-form-container">
//             <div className="group relative max-w-4xl mx-auto">
//               <div className="dynamic-gradient absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-600 rounded-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 blur-[1px]" />
              
//               <div className="relative bg-background/80 backdrop-blur-md rounded-lg p-6 border border-border/50 transform-gpu transition-all duration-500 group-hover:shadow-xl">
//                 <ContactFormHandler />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Inline styles to avoid CSS chunk issues */}
//       <style jsx>{`
//         .dynamic-gradient {
//           background-size: 200% 200%;
//           animation: gradientShift 6s ease infinite;
//         }

//         @keyframes gradientShift {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
//     </Section>
//   );
// }





































// // src/components/sections/contact.tsx
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Mail, Phone, MapPin } from "lucide-react";
// import { ContactFormHandler } from "@/components/contact-form-handler";

// export function Contact() {
//   const { email, phone, location } = siteConfig;

//   return (
//     <Section id="contact" className="bg-secondary/30">
//       <SectionHeading>Contact Me</SectionHeading>
//       <div className="max-w-6xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
//             <div>
//                  <h3 className="text-2xl font-bold font-headline mb-4">Let's Connect</h3>
//                 <p className="text-muted-foreground mb-8">
//                     I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out using the form, or connect with me through my other channels.
//                 </p>
//                 <div className="space-y-4">
//                     <div className="flex items-center gap-4" data-cursor-hover>
//                         <Mail className="w-6 h-6 text-primary" />
//                         <a href={`mailto:${email}`} className="text-lg hover:text-primary transition-colors">{email}</a>
//                     </div>
//                     <div className="flex items-center gap-4" data-cursor-hover>
//                         <Phone className="w-6 h-6 text-primary" />
//                         <a href={`tel:${phone}`} className="text-lg hover:text-primary transition-colors">{phone}</a>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <MapPin className="w-6 h-6 text-primary" />
//                         <p className="text-lg">{location}</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="hidden md:block">
//                  {/* This space is intentionally left for the form on the right side on larger screens */}
//             </div>
//         </div>
//         <ContactFormHandler />
//       </div>
//     </Section>
//   );
// }
