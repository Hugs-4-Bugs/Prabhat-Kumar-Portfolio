// src/components/sections/experience.tsx

"use client";

import { useRef, useEffect } from "react";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { useTheme } from "next-themes";

// GSAP imports
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const workExperiences = [
  {
    company: "Netcore Cloud",
    role: "Java Software Developer",
    duration: "Jan 2023 – Present",
   details: [
      "Developed and maintained scalable backend services using Java, Spring Boot, Hibernate, and Microservices, ensuring high availability and fault tolerance.",
      "Integrated AWS services (EC2, RDS, S3) for deployment, database management, and cloud storage, improving application performance and reliability.",
      "Designed and optimized complex SQL queries and MySQL database schemas using Hibernate for efficient data persistence and retrieval.",
      "Collaborated with cross-functional teams to define, design, and ship new features following agile methodologies and best coding practices.",
      "Led backend development for the Real Estate Blog Management System within a team of 8 engineers.",
      "Designed and implemented REST APIs for creating, editing, updating, and managing blog posts and comments.",
      "Built database tables and relationships for blogs, comments, and user actions, optimizing schema performance in MySQL.",
      "Implemented Spring Security + JWT for secure API access and added like/dislike functionality to increase user engagement.",
      "Tested, debugged, and optimized APIs using Postman to ensure performance and reliability."
    ],
    tech: ["Java","Spring Boot","Hibernate","Microservices","MySQL","SQL","REST APIs","Spring Security","JWT","AWS","EC2","RDS","S3","Maven","Postman"],
    metrics: [
      { label: "Performance Gain", value: "40% faster", icon: "⚡" },
      { label: "Request Scale", value: "1M+ requests", icon: "📈" },
      { label: "Team Size", value: "8 engineers", icon: "👥" },
      { label: "System Uptime", value: "99.9%", icon: "🔄" }
    ]    
  },
  {
    company: "CodeSpeedy Technology Pvt Ltd",
    role: "Java Software Engineer Intern",
    duration: "Oct 2022 – Dec 2022",
    details: [
      "Developed secure authentication system with Spring Boot & JWT (99.9% uptime)",
      "Optimized Hibernate ORM relationships, improving query performance by 35%",
      "Reduced codebase by 25% using Lombok while accelerating development",
      "Implemented robust exception handling for better error management",
      "Conducted comprehensive API testing with 250K+ test requests"
    ],
    tech: ["Java", "Spring Boot", "Hibernate", "JWT", "MySQL", "Spring Security", "Postman"],
    metrics: [
      { label: "Query Optimization", value: "35% faster", icon: "🚀" },
      { label: "Development Speed", value: "25% increase", icon: "⚡" },
      { label: "Test Coverage", value: "500K+ requests", icon: "🧪" },
      { label: "System Reliability", value: "99.9% uptime", icon: "🛡️" }
    ]
  },
  {
    company: "Walmart USA",
    role: "Software Engineer (Remote)",
    duration: "2022",
    details: [
      "Solved technical simulations for Walmart departments, improving system efficiency by 40%.",
      "Designed custom heap in Java for shipping logistics, handling 2M+ daily operations.",
      "Built UML/ER diagrams for complex systems/databases serving 50K+ concurrent users.",
      "Optimized data structures reducing memory usage by 30% across distributed systems."
    ],
    tech: ["Java", "UML", "ER Diagrams", "Data Structures", "Algorithms"],
    metrics: [
      { label: "System Efficiency", value: "40% improved", icon: "📊" },
      { label: "Daily Operations", value: "2M+ handled", icon: "🔄" },
      { label: "Concurrent Users", value: "50K+ scale", icon: "👥" },
      { label: "Memory Usage", value: "30% reduced", icon: "💾" }
    ]
  }
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { theme } = useTheme();

  // Cinematic Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    
    // Cinematic Particles
    class CinematicParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      pulsePhase: number;
      trail: {x: number, y: number, opacity: number}[];

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.trail = [];
      }

      update() {
        this.y -= this.speed;
        this.pulsePhase += 0.02;
        
        // Cinematic sway
        this.x += Math.sin(this.pulsePhase) * 0.1;
        
        // Add trail point
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 5) this.trail.shift();
        
        // Fade trail
        this.trail.forEach(point => point.opacity *= 0.8);

        // Reset when off screen
        if (this.y < -10) {
          this.y = canvas.height + 10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        
        // Draw trail
        ctx.strokeStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
        ctx.lineWidth = 0.5;
        
        if (this.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y);
          for (let i = 1; i < this.trail.length; i++) {
            ctx.globalAlpha = this.trail[i].opacity;
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw particle
        ctx.globalAlpha = this.opacity * pulse;
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.6)';
        
        // Cinematic lens flare effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(59, 130, 246, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: CinematicParticle[] = [];
    const particleCount = 20;

    const resizeCanvas = () => {
      if (canvas && sectionRef.current) {
        canvas.width = sectionRef.current.offsetWidth;
        canvas.height = sectionRef.current.offsetHeight;
      }
    };

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new CinematicParticle());
      }
    };

    const animate = () => {
      // Cinematic dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(10, 5, 20, 0.8)');
        gradient.addColorStop(1, 'rgba(20, 10, 40, 0.6)');
      } else {
        gradient.addColorStop(0, 'rgba(240, 245, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(230, 235, 250, 0.7)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      particles.length = 0;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  // Cinematic GSAP Animations
  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic section entrance
      gsap.fromTo(sectionRef.current, 
        { 
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cinematic title animation
      gsap.fromTo(".cinematic-title", 
        {
          opacity: 0,
          y: 100,
          rotationX: 45
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cinematic-title",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cinematic timeline line drawing
      gsap.fromTo(".timeline-line", 
        {
          scaleY: 0,
          transformOrigin: "top"
        },
        {
          scaleY: 1,
          duration: 2.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cinematic card sequence
      workExperiences.forEach((_, index) => {
        const card = cardsRef.current[index];
        if (!card) return;

        gsap.fromTo(card, 
          {
            opacity: 0,
            x: index % 2 === 0 ? -300 : 300,
            y: 100,
            rotationY: index % 2 === 0 ? -30 : 30,
            scale: 0.8,
            filter: "blur(20px)"
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotationY: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.8,
            delay: index * 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 40%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Cinematic metric buttons animation
      gsap.fromTo(".cinematic-metric", 
        {
          opacity: 0,
          scale: 0,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".timeline-item",
            start: "top 80%",
            end: "bottom 50%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cinematic continuous floating
      gsap.to(".cinematic-card", {
        y: -10,
        rotationZ: 0.5,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cinematic card hover effects
  const handleCardHover = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      duration: 0.6,
      scale: 1.05,
      y: -20,
      rotationY: 5,
      boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
      ease: "power2.out"
    });
  };

  const handleCardLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      duration: 0.8,
      scale: 1,
      y: 0,
      rotationY: 0,
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <Section 
      id="experience" 
      ref={sectionRef}
      className="experience-section relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
    >
      {/* Cinematic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Cinematic Lens Flare */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Cinematic Title */}
      <div className="relative z-10">
        <SectionHeading className="cinematic-title text-center mb-20">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
            Professional Journey
          </span>
        </SectionHeading>
      </div>

      {/* Responsive Cinematic Timeline */}
      <div ref={timelineRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Responsive Timeline Line */}
          <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-cyan-400/50 via-purple-500/80 to-cyan-400/50">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-purple-500/20 blur-sm" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full shadow-lg" />
          </div>

          {/* Responsive Cards Container */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-24 py-12 sm:py-16 lg:py-20">
            {workExperiences.map((experience, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className={`cinematic-card group relative w-full ${
                    // Responsive width classes
                    "lg:w-[90%] xl:w-[80%] 2xl:w-[70%]"
                  } ${
                    isLeft 
                      ? "mr-auto ml-0 pr-8 sm:pr-12 lg:pr-16 xl:pr-24" 
                      : "ml-auto mr-0 pl-8 sm:pl-12 lg:pl-16 xl:pl-24"
                  }`}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardLeave(index)}
                >
                  {/* Responsive Cinematic Card */}
                  <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-cyan-400/20 shadow-2xl overflow-hidden transform-style-3d transition-all duration-700 w-full">
                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-cyan-400/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Responsive Card Content */}
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors duration-500 truncate">
                            {experience.role}
                          </h3>
                          <p className="text-base sm:text-lg lg:text-lg font-semibold text-cyan-300 truncate">
                            {experience.company}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm text-cyan-200 bg-cyan-500/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-cyan-400/30 backdrop-blur-sm whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0">
                          {experience.duration}
                        </span>
                      </div>

                      {/* Responsive Experience Details */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {experience.details.map((detail, detailIndex) => (
                          <p 
                            key={detailIndex} 
                            className="text-gray-300 leading-relaxed text-xs sm:text-sm border-l-2 border-cyan-400/50 pl-3 sm:pl-4 py-1 sm:py-1"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>

                      {/* Responsive Cinematic Metrics */}
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {experience.metrics.map((metric, metricIndex) => (
                          <button
                            key={metricIndex}
                            className="cinematic-metric group/metric relative bg-gradient-to-br from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 backdrop-blur-sm transition-all duration-500 transform-style-3d hover:scale-105 hover:rotate-1 w-full sm:w-auto"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                              <span className="text-base sm:text-xl transform-gpu">{metric.icon}</span>
                              <div className="text-left hidden sm:block">
                                <div className="text-xs font-medium text-cyan-200/80 transform-gpu">
                                  {metric.label}
                                </div>
                                <div className="text-sm font-bold text-cyan-300 transform-gpu">
                                  {metric.value}
                                </div>
                              </div>
                              <div className="text-center sm:hidden">
                                <div className="text-[10px] font-medium text-cyan-200/80">
                                  {metric.label.split(' ')[0]}
                                </div>
                                <div className="text-xs font-bold text-cyan-300">
                                  {metric.value}
                                </div>
                              </div>
                            </div>
                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300" />
                          </button>
                        ))}
                      </div>

                      {/* Responsive Tech Stack */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {experience.tech.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 sm:px-3 py-1 sm:py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-200 rounded-md sm:rounded-lg text-xs sm:text-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-rotate-1 cursor-pointer whitespace-nowrap"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Responsive Cinematic Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg" />
                  </div>

                  {/* Responsive Cinematic Connection Node */}
                  <div className={`absolute top-6 sm:top-8 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 border-2 border-black shadow-2xl transform group-hover:scale-125 sm:group-hover:scale-150 group-hover:rotate-180 transition-all duration-700 flex items-center justify-center
                    ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}
                  >
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-black rounded-full" />
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cinematic Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float-cinematic"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .experience-section {
          background: linear-gradient(
            135deg,
            hsl(220, 60%, 5%) 0%,
            hsl(270, 60%, 15%) 50%,
            hsl(220, 60%, 5%) 100%
          );
        }

        @keyframes float-cinematic {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) translateX(-5px) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-20px) translateX(-10px) rotate(270deg);
            opacity: 0.6;
          }
        }

        .animate-float-cinematic {
          animation: float-cinematic 15s ease-in-out infinite;
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        /* Responsive container queries for extra large screens */
        @media (min-width: 1536px) {
          .experience-section {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1920px) {
          .experience-section {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        /* Cinematic scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0891b2, #7c3aed);
        }
      `}</style>
    </Section>
  );
}

export default Experience;

























// // src/components/sections/experience.tsx

// "use client";

// import { useRef, useEffect } from "react";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { useTheme } from "next-themes";

// // GSAP imports
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Register GSAP plugins
// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// // Manual work experience data with performance metrics
// const workExperiences = [
//   {
//     company: "Netcore Cloud",
//     role: "Java Software Developer",
//     duration: "Jan 2023 – Present",
//    details: [
//       "Built scalable microservices using Java & Spring Boot (99.9% uptime).",
//       "Managed AWS infra (EC2, RDS, S3) for high-performance deployments.",
//       "Optimized MySQL & Hibernate queries, improving latency by 35% across 1M+ requests.",
//       "Led backend development for Real Estate Blog System.",
//       "Implemented secure REST APIs with Spring Security + JWT.",
//       "Added like/dislike functionality to boost user engagement."
// ],
//     tech: ["Java","Spring Boot","Hibernate","Microservices","MySQL","SQL","REST APIs","Spring Security","JWT","AWS","EC2","RDS","S3","Maven","Postman"],
//     metrics: [
//       { label: "Performance Gain", value: "40% faster", icon: "⚡" },
//       { label: "Request Scale", value: "1M+ requests", icon: "📈" },
//       { label: "Team Size", value: "8 engineers", icon: "👥" },
//       { label: "System Uptime", value: "99.9%", icon: "🔄" }
//     ]    
//   },
//   {
//     company: "CodeSpeedy Technology Pvt Ltd",
//     role: "Java Software Engineer Intern",
//     duration: "Oct 2022 – Dec 2022",
//     details: [
//       "Developed secure authentication system with Spring Boot & JWT (99.9% uptime)",
//       "Optimized Hibernate ORM relationships, improving query performance by 35%",
//       "Reduced codebase by 25% using Lombok while accelerating development",
//       "Implemented robust exception handling for better error management",
//       "Conducted comprehensive API testing with 250K+ test requests"
//     ],
//     tech: ["Java", "Spring Boot", "Hibernate", "JWT", "MySQL", "Spring Security", "Postman"],
//     metrics: [
//       { label: "Query Optimization", value: "35% faster", icon: "🚀" },
//       { label: "Development Speed", value: "25% increase", icon: "⚡" },
//       { label: "Test Coverage", value: "500K+ requests", icon: "🧪" },
//       { label: "System Reliability", value: "99.9% uptime", icon: "🛡️" }
//     ]
//   },
//   {
//     company: "Walmart USA",
//     role: "Software Engineer (Remote)",
//     duration: "2022",
//     details: [
//       "Solved technical simulations for Walmart departments, improving system efficiency by 40%.",
//       "Designed custom heap in Java for shipping logistics, handling 2M+ daily operations.",
//       "Built UML/ER diagrams for complex systems/databases serving 50K+ concurrent users.",
//       "Optimized data structures reducing memory usage by 30% across distributed systems."
//     ],
//     tech: ["Java", "UML", "ER Diagrams", "Data Structures", "Algorithms"],
//     metrics: [
//       { label: "System Efficiency", value: "40% improved", icon: "📊" },
//       { label: "Daily Operations", value: "2M+ handled", icon: "🔄" },
//       { label: "Concurrent Users", value: "50K+ scale", icon: "👥" },
//       { label: "Memory Usage", value: "30% reduced", icon: "💾" }
//     ]
//   }
// ];

// export function Experience() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const holographicBeamsRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
//   const { theme } = useTheme();
//   const mouseRef = useRef({ x: 0, y: 0 });

//   // Enhanced cursor spotlight with 3D effect
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mouseRef.current = { x: e.clientX, y: e.clientY };
      
//       if (sectionRef.current) {
//         const rect = sectionRef.current.getBoundingClientRect();
//         const x = ((e.clientX - rect.left) / rect.width) * 100;
//         const y = ((e.clientY - rect.top) / rect.height) * 100;
        
//         sectionRef.current.style.setProperty('--mouse-x', `${x}%`);
//         sectionRef.current.style.setProperty('--mouse-y', `${y}%`);
        
//         // 3D parallax effect for cards
//         cardsRef.current.forEach((card, index) => {
//           if (!card) return;
          
//           const cardRect = card.getBoundingClientRect();
//           const cardCenterX = cardRect.left + cardRect.width / 2;
//           const cardCenterY = cardRect.top + cardRect.height / 2;
          
//           const distanceX = (e.clientX - cardCenterX) / window.innerWidth;
//           const distanceY = (e.clientY - cardCenterY) / window.innerHeight;
          
//           const rotateY = distanceX * 8;
//           const rotateX = -distanceY * 8;
//           const translateZ = Math.abs(distanceX * 20) + Math.abs(distanceY * 20);
          
//           gsap.to(card, {
//             duration: 0.8,
//             rotateX: rotateX,
//             rotateY: rotateY,
//             translateZ: translateZ,
//             ease: "power2.out"
//           });
//         });
//       }
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Animated holographic beams
//   useEffect(() => {
//     const beams = holographicBeamsRef.current;
//     if (!beams) return;

//     const createBeams = () => {
//       beams.innerHTML = '';
//       const beamCount = 4;
      
//       for (let i = 0; i < beamCount; i++) {
//         const beam = document.createElement('div');
//         beam.className = 'holographic-beam';
//         beam.style.setProperty('--beam-index', i.toString());
//         beam.style.left = `${(i / beamCount) * 100}%`;
//         beam.style.animationDelay = `${i * 1.5}s`;
//         beams.appendChild(beam);
//       }
//     };

//     createBeams();
//   }, []);

//   // Premium Background Animation - Floating Tech Architecture
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrame: number;
    
//     // Premium Tech Architecture Element
//     class ArchitectureElement {
//       x: number;
//       y: number;
//       size: number;
//       speed: number;
//       rotation: number;
//       rotationSpeed: number;
//       pulsePhase: number;
//       type: string;
//       opacity: number;

//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.size = Math.random() * 25 + 15;
//         this.speed = Math.random() * 0.3 + 0.1;
//         this.rotation = Math.random() * Math.PI * 2;
//         this.rotationSpeed = (Math.random() - 0.5) * 0.01;
//         this.pulsePhase = Math.random() * Math.PI * 2;
//         this.type = ['server', 'database', 'cloud', 'api', 'microservice'][Math.floor(Math.random() * 5)];
//         this.opacity = Math.random() * 0.15 + 0.05;
//       }

//       update() {
//         this.y -= this.speed;
//         this.rotation += this.rotationSpeed;
//         this.pulsePhase += 0.015;
        
//         // Subtle horizontal movement
//         this.x += Math.sin(this.pulsePhase) * 0.2;
        
//         // Reset when off screen
//         if (this.y < -50) {
//           this.y = canvas.height + 30;
//           this.x = Math.random() * canvas.width;
//         }
//       }

//       draw() {
//         const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
//         const currentOpacity = this.opacity * pulse;

//         ctx.save();
//         ctx.translate(this.x, this.y);
//         ctx.rotate(this.rotation);
//         ctx.globalAlpha = currentOpacity;

//         // Different styles based on architecture type
//         switch (this.type) {
//           case 'server':
//             this.drawServer(ctx);
//             break;
//           case 'database':
//             this.drawDatabase(ctx);
//             break;
//           case 'cloud':
//             this.drawCloud(ctx);
//             break;
//           case 'api':
//             this.drawAPI(ctx);
//             break;
//           case 'microservice':
//             this.drawMicroservice(ctx);
//             break;
//         }

//         ctx.restore();
//       }

//       drawServer(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)';
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)';
//         ctx.lineWidth = 1;
        
//         // Server rack
//         ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
//         ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
        
//         // Server slots
//         for (let i = 0; i < 3; i++) {
//           ctx.fillStyle = theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)';
//           ctx.fillRect(-this.size/3, -this.size/2 + (i * this.size/3) + 2, this.size/1.5, this.size/4);
//         }
//       }

//       drawDatabase(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)';
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
//         ctx.lineWidth = 1;
        
//         // Database cylinder
//         ctx.beginPath();
//         ctx.ellipse(0, -this.size/4, this.size/2, this.size/6, 0, 0, Math.PI * 2);
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.ellipse(0, this.size/4, this.size/2, this.size/6, 0, 0, Math.PI * 2);
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.moveTo(-this.size/2, -this.size/4);
//         ctx.lineTo(-this.size/2, this.size/4);
//         ctx.stroke();
        
//         ctx.beginPath();
//         ctx.moveTo(this.size/2, -this.size/4);
//         ctx.lineTo(this.size/2, this.size/4);
//         ctx.stroke();
//       }

//       drawCloud(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)';
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)';
//         ctx.lineWidth = 1;
        
//         // Cloud shape
//         ctx.beginPath();
//         ctx.arc(0, 0, this.size/3, 0, Math.PI * 2);
//         ctx.arc(this.size/4, -this.size/6, this.size/4, 0, Math.PI * 2);
//         ctx.arc(-this.size/4, -this.size/6, this.size/4, 0, Math.PI * 2);
//         ctx.arc(this.size/6, this.size/6, this.size/3.5, 0, Math.PI * 2);
//         ctx.arc(-this.size/6, this.size/6, this.size/3.5, 0, Math.PI * 2);
//         ctx.stroke();
//       }

//       drawAPI(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = theme === 'dark' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.08)';
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)';
//         ctx.lineWidth = 1;
        
//         // API endpoints
//         for (let i = 0; i < 4; i++) {
//           const angle = (i * Math.PI / 2);
//           const x = Math.cos(angle) * this.size/2;
//           const y = Math.sin(angle) * this.size/2;
          
//           ctx.beginPath();
//           ctx.arc(x, y, this.size/6, 0, Math.PI * 2);
//           ctx.stroke();
          
//           // Connection to center
//           ctx.beginPath();
//           ctx.moveTo(0, 0);
//           ctx.lineTo(x, y);
//           ctx.stroke();
//         }
//       }

//       drawMicroservice(ctx: CanvasRenderingContext2D) {
//         ctx.fillStyle = theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)';
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)';
//         ctx.lineWidth = 1;
        
//         // Microservice cluster
//         const points = [
//           {x: 0, y: -this.size/2},
//           {x: this.size/2, y: 0},
//           {x: 0, y: this.size/2},
//           {x: -this.size/2, y: 0}
//         ];
        
//         points.forEach(point => {
//           ctx.beginPath();
//           ctx.arc(point.x, point.y, this.size/4, 0, Math.PI * 2);
//           ctx.stroke();
//         });
        
//         // Connections
//         ctx.beginPath();
//         points.forEach((point, index) => {
//           if (index === 0) ctx.moveTo(point.x, point.y);
//           else ctx.lineTo(point.x, point.y);
//         });
//         ctx.closePath();
//         ctx.stroke();
//       }
//     }

//     const elements: ArchitectureElement[] = [];
//     const elementCount = 8; // Minimal but meaningful

//     const resizeCanvas = () => {
//       if (canvas && sectionRef.current) {
//         canvas.width = sectionRef.current.offsetWidth;
//         canvas.height = sectionRef.current.offsetHeight;
//       }
//     };

//     const initElements = () => {
//       for (let i = 0; i < elementCount; i++) {
//         elements.push(new ArchitectureElement());
//       }
//     };

//     const animate = () => {
//       // Very subtle background clear
//       ctx.fillStyle = theme === 'dark' 
//         ? 'rgba(15, 15, 25, 0.02)' 
//         : 'rgba(250, 250, 255, 0.01)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Update and draw elements
//       elements.forEach(element => {
//         element.update();
//         element.draw();
//       });

//       animationFrame = requestAnimationFrame(animate);
//     };

//     resizeCanvas();
//     initElements();
//     animate();

//     const handleResize = () => {
//       resizeCanvas();
//       elements.length = 0;
//       initElements();
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       cancelAnimationFrame(animationFrame);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [theme]);

//   // Enhanced GSAP Animations
//   useEffect(() => {
//     if (!sectionRef.current) return;

//     const ctx = gsap.context(() => {
//       // Section entrance
//       gsap.fromTo(sectionRef.current, 
//         { 
//           opacity: 0,
//           y: 100,
//           rotationX: -10
//         },
//         {
//           opacity: 1,
//           y: 0,
//           rotationX: 0,
//           duration: 1.8,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // 3D Card entrance animations
//       gsap.fromTo(".timeline-item-left",
//         {
//           opacity: 0,
//           x: -200,
//           rotationY: -45,
//           rotationX: 10,
//           scale: 0.8
//         },
//         {
//           opacity: 1,
//           x: 0,
//           rotationY: 0,
//           rotationX: 0,
//           scale: 1,
//           duration: 1.5,
//           stagger: 0.3,
//           ease: "back.out(2)",
//           scrollTrigger: {
//             trigger: ".timeline-container",
//             start: "top 70%",
//             end: "bottom 30%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       gsap.fromTo(".timeline-item-right",
//         {
//           opacity: 0,
//           x: 200,
//           rotationY: 45,
//           rotationX: 10,
//           scale: 0.8
//         },
//         {
//           opacity: 1,
//           x: 0,
//           rotationY: 0,
//           rotationX: 0,
//           scale: 1,
//           duration: 1.5,
//           stagger: 0.3,
//           ease: "back.out(2)",
//           scrollTrigger: {
//             trigger: ".timeline-container",
//             start: "top 70%",
//             end: "bottom 30%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Button animations
//       gsap.fromTo(".metric-button, .tech-button",
//         {
//           opacity: 0,
//           scale: 0.8,
//           y: 20
//         },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.05,
//           ease: "back.out(1.7)",
//           scrollTrigger: {
//             trigger: ".timeline-item",
//             start: "top 85%",
//             end: "bottom 60%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // 3D Floating animation for cards
//       gsap.to(".timeline-item", {
//         y: -8,
//         rotationZ: 0.5,
//         duration: 4,
//         yoyo: true,
//         repeat: -1,
//         ease: "sine.inOut",
//         stagger: 0.2
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   // Enhanced card hover effects
//   const handleCardHover = (index: number, e: React.MouseEvent) => {
//     const card = cardsRef.current[index];
//     if (!card) return;

//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
    
//     const rotateY = ((x - centerX) / centerX) * 10;
//     const rotateX = ((centerY - y) / centerY) * 8;

//     gsap.to(card, {
//       duration: 0.5,
//       rotateY: rotateY,
//       rotateX: rotateX,
//       scale: 1.02,
//       z: 50,
//       ease: "power2.out"
//     });
//   };

//   const handleCardLeave = (index: number) => {
//     const card = cardsRef.current[index];
//     if (!card) return;

//     gsap.to(card, {
//       duration: 0.8,
//       rotateY: 0,
//       rotateX: 0,
//       scale: 1,
//       z: 0,
//       ease: "elastic.out(1, 0.5)"
//     });
//   };

//   return (
//     <Section 
//       id="experience" 
//       ref={sectionRef}
//       className="experience-section relative overflow-hidden bg-secondary/30 min-h-screen"
//     >
//       {/* Premium Architecture Background */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none"
//       />

//       {/* Subtle Holographic Beams */}
//       <div
//         ref={holographicBeamsRef}
//         className="holographic-beams-container absolute inset-0 pointer-events-none"
//       />

//       {/* Enhanced Cursor Spotlight */}
//       <div className="cursor-spotlight pointer-events-none" />

//       <SectionHeading className="relative z-10">
//         Work Experience
//       </SectionHeading>

//       {/* Ultimate 3D/4D Timeline */}
//       <div className="relative z-10 timeline-container max-w-7xl mx-auto px-4">
//         <div className="relative">
//           {/* 3D Central Timeline Line */}
//           <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/30 via-accent/50 to-primary/30">
//             <div className="absolute inset-0 bg-primary/10 blur-sm" />
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg" />
//           </div>

//           {/* Timeline Items Container */}
//           <div className="space-y-20 py-12">
//             {workExperiences.map((experience, index) => {
//               const isLeft = index % 2 === 0;
//               const timelineItemClass = isLeft 
//                 ? "timeline-item timeline-item-left mr-auto ml-0 pr-12 lg:pr-24" 
//                 : "timeline-item timeline-item-right ml-auto mr-0 pl-12 lg:pl-24";
              
//               return (
//                 <div
//                   key={index}
//                   ref={el => cardsRef.current[index] = el}
//                   className={`${timelineItemClass} group relative w-full lg:w-[45%] bg-background/95 backdrop-blur-xl rounded-3xl p-8 border border-border/40 shadow-2xl hover:shadow-4xl transition-all duration-700 transform-style-3d`}
//                   style={{
//                     transformStyle: 'preserve-3d',
//                   }}
//                   onMouseMove={(e) => handleCardHover(index, e)}
//                   onMouseLeave={() => handleCardLeave(index)}
//                 >
//                   {/* 3D Timeline Dot */}
//                   <div className={`absolute top-8 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background shadow-2xl transform group-hover:scale-150 group-hover:rotate-180 transition-all duration-700 flex items-center justify-center
//                     ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}
//                     style={{ transformStyle: 'preserve-3d' }}
//                   >
//                     <div className="w-1.5 h-1.5 bg-background rounded-full" />
//                     <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
//                   </div>

//                   {/* 3D Connection Line */}
//                   <div className={`absolute top-8 h-0.5 bg-gradient-to-r transform-gpu
//                     ${isLeft ? 'right-6 left-auto w-12 from-transparent to-primary/50' : 'left-6 right-auto w-12 from-primary/50 to-transparent'}`} 
//                   />

//                   {/* Content */}
//                   <div className="space-y-6 relative" style={{ transformStyle: 'preserve-3d' }}>
//                     {/* Header */}
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                       <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-500">
//                         {experience.role}
//                       </h3>
//                       <span className="text-sm text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/20 backdrop-blur-sm">
//                         {experience.duration}
//                       </span>
//                     </div>
                    
//                     <p className="text-lg font-semibold text-primary/90">
//                       {experience.company}
//                     </p>
                    
//                     {/* Experience Details */}
//                     <div className="space-y-2">
//                       {experience.details.map((detail, detailIndex) => (
//                         <p key={detailIndex} className="text-foreground/80 leading-relaxed text-sm">
//                           • {detail}
//                         </p>
//                       ))}
//                     </div>

//                     {/* Performance Metrics as Buttons */}
//                     {experience.metrics && (
//                       <div className="flex flex-wrap gap-3 pt-2">
//                         {experience.metrics.map((metric, metricIndex) => (
//                           <button
//                             key={metricIndex}
//                             className="metric-button group/metric relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl px-4 py-3 backdrop-blur-sm transition-all duration-300 transform-style-3d hover:scale-105 hover:translate-z-10 active:scale-95"
//                             style={{ transformStyle: 'preserve-3d' }}
//                           >
//                             <div className="flex items-center gap-3">
//                               <span className="text-lg transform-gpu">{metric.icon}</span>
//                               <div className="text-left">
//                                 <div className="text-xs font-medium text-foreground/70 transform-gpu">
//                                   {metric.label}
//                                 </div>
//                                 <div className="text-sm font-bold text-blue-600 dark:text-blue-400 transform-gpu">
//                                   {metric.value}
//                                 </div>
//                               </div>
//                             </div>
//                             {/* Button hover effect */}
//                             <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                           </button>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Tech Stack as Buttons */}
//                     <div className="flex flex-wrap gap-2 pt-4">
//                       {experience.tech?.map((skill, skillIndex) => (
//                         <button
//                           key={skillIndex}
//                           className="tech-button group/tech relative bg-secondary/40 hover:bg-secondary/60 border border-border/40 hover:border-primary/40 text-foreground/70 hover:text-foreground rounded-full px-4 py-2 text-sm backdrop-blur-sm transition-all duration-300 transform-style-3d hover:scale-110 hover:translate-z-5 active:scale-105"
//                           style={{ transformStyle: 'preserve-3d' }}
//                         >
//                           <span className="relative z-10 transform-gpu">{skill}</span>
//                           {/* Tech button hover effect */}
//                           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* 4D Holographic Effects */}
//                   <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
//                   {/* 3D Animated Border */}
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .experience-section {
//           --mouse-x: 50%;
//           --mouse-y: 50%;
//           perspective: 1200px;
//         }

//         .cursor-spotlight {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: radial-gradient(
//             circle at var(--mouse-x) var(--mouse-y),
//             ${theme === 'dark' ? 'rgba(120, 119, 198, 0.08)' : 'rgba(99, 102, 241, 0.04)'} 0%,
//             transparent 70%
//           );
//           opacity: 0;
//           transition: opacity 0.3s ease;
//           pointer-events: none;
//           z-index: 5;
//         }

//         .experience-section:hover .cursor-spotlight {
//           opacity: 1;
//         }

//         .holographic-beams-container {
//           opacity: ${theme === 'dark' ? 0.15 : 0.08};
//           mix-blend-mode: ${theme === 'dark' ? 'screen' : 'multiply'};
//         }

//         .holographic-beam {
//           position: absolute;
//           top: 0;
//           width: 0.5px;
//           height: 100%;
//           background: linear-gradient(
//             to bottom,
//             transparent,
//             ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)'},
//             ${theme === 'dark' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.15)'},
//             transparent
//           );
//           animation: beamFloat 12s ease-in-out infinite;
//         }

//         @keyframes beamFloat {
//           0%, 100% {
//             transform: translateY(0px);
//             opacity: 0.1;
//           }
//           50% {
//             transform: translateY(-20px);
//             opacity: 0.3;
//           }
//         }

//         /* 3D Transform styles */
//         .transform-style-3d {
//           transform-style: preserve-3d;
//         }

//         :global(.timeline-item) {
//           transform-style: preserve-3d;
//           transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//           position: relative;
//           backdrop-filter: blur(12px);
//         }

//         :global(.timeline-item:hover) {
//           backdrop-filter: blur(16px);
//           z-index: 20;
//         }

//         /* Button hover effects */
//         :global(.metric-button:hover) {
//           transform: translateY(-2px) translateZ(15px) scale(1.05);
//           box-shadow: 0 8px 25px ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'};
//         }

//         :global(.tech-button:hover) {
//           transform: translateY(-1px) translateZ(10px) scale(1.08);
//           box-shadow: 0 4px 15px ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'};
//         }

//         /* 4D Shadow effects */
//         .shadow-4xl {
//           box-shadow: 
//             0 25px 50px -12px rgba(0, 0, 0, 0.25),
//             0 0 0 1px rgba(255, 255, 255, 0.1),
//             0 0 80px ${theme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)'},
//             inset 0 1px 0 rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </Section>
//   );
// }

// export default Experience;





























// // src/components/sections/experience.tsx

// "use client";

// import { useRef, useEffect } from "react";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { useTheme } from "next-themes";

// // GSAP imports
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Register GSAP plugins
// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// // Manual work experience data
// const workExperiences = [
//   {
//     company: "Netcore Cloud",
//     role: "Java Software Developer",
//     duration: "Jan 2023 – Present",
//     details: [
//       "Developed and maintained scalable backend services using Java, Spring Boot, Hibernate, and Microservices, ensuring high availability and fault tolerance.",
//       "Integrated AWS services (EC2, RDS, S3) for deployment, database management, and cloud storage, improving application performance and reliability.",
//       "Designed and optimized complex SQL queries and MySQL database schemas using Hibernate for efficient data persistence and retrieval.",
//       "Collaborated with cross-functional teams to define, design, and ship new features following agile methodologies and best coding practices.",
//       "Led backend development for the Real Estate Blog Management System within a team of 8 engineers.",
//       "Designed and implemented REST APIs for creating, editing, updating, and managing blog posts and comments.",
//       "Built database tables and relationships for blogs, comments, and user actions, optimizing schema performance in MySQL.",
//       "Implemented Spring Security + JWT for secure API access and added like/dislike functionality to increase user engagement.",
//       "Tested, debugged, and optimized APIs using Postman to ensure performance and reliability."
//     ],
//     tech: ["Java","Spring Boot","Hibernate","Microservices","MySQL","SQL","REST APIs","Spring Security","JWT","AWS","EC2","RDS","S3","Maven","Postman"]    
//   },
//   {
//     company: "CodeSpeedy Technology Pvt Ltd",
//     role: "Java Software Engineer Intern",
//     duration: "Oct 2022 – Dec 2022",
//     details: [
//       "Built backend authentication modules with Spring Boot & JWT.",
//       "Managed entity relationships with Hibernate ORM.",
//       "Applied custom exception handling & HTTP status practices.",
//       "Leveraged Lombok to reduce Java boilerplate.",
//       "Performed API testing with Postman."
//     ],
//     tech: ["Java", "Spring Boot", "Hibernate", "JWT", "MySQL", "Spring Security", "Postman"]
//   },
//   {
//     company: "Walmart USA",
//     role: "Software Engineer (Remote)",
//     duration: "2022",
//     details: [
//       "Solved technical simulations for Walmart departments.",
//       "Designed custom heap in Java for shipping.",
//       "Built UML/ER diagrams for complex systems/databases."
//     ],
//     tech: ["Java", "UML", "ER Diagrams", "Data Structures"]
//   }
// ];

// export function Experience() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const holographicBeamsRef = useRef<HTMLDivElement>(null);
//   const { theme } = useTheme();
//   const mouseRef = useRef({ x: 0, y: 0 });

//   // Cursor spotlight effect
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mouseRef.current = { x: e.clientX, y: e.clientY };
      
//       if (sectionRef.current) {
//         const rect = sectionRef.current.getBoundingClientRect();
//         const x = ((e.clientX - rect.left) / rect.width) * 100;
//         const y = ((e.clientY - rect.top) / rect.height) * 100;
        
//         sectionRef.current.style.setProperty('--mouse-x', `${x}%`);
//         sectionRef.current.style.setProperty('--mouse-y', `${y}%`);
//       }
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Animated holographic beams
//   useEffect(() => {
//     const beams = holographicBeamsRef.current;
//     if (!beams) return;

//     const createBeams = () => {
//       beams.innerHTML = '';
//       const beamCount = 6; // Reduced for cleaner look
      
//       for (let i = 0; i < beamCount; i++) {
//         const beam = document.createElement('div');
//         beam.className = 'holographic-beam';
//         beam.style.setProperty('--beam-index', i.toString());
//         beam.style.left = `${(i / beamCount) * 100}%`;
//         beam.style.animationDelay = `${i * 0.8}s`;
//         beams.appendChild(beam);
//       }
//     };

//     createBeams();
//   }, []);

//   // Ultra Premium Background Animation - Quantum Circuit Patterns
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrame: number;
    
//     // Premium Quantum Circuit Elements
//     class QuantumElement {
//       x: number;
//       y: number;
//       size: number;
//       rotation: number;
//       rotationSpeed: number;
//       pulsePhase: number;
//       type: string;
//       speed: number;
//       trail: {x: number, y: number, alpha: number}[];

//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.size = Math.random() * 3 + 1;
//         this.rotation = Math.random() * Math.PI * 2;
//         this.rotationSpeed = (Math.random() - 0.5) * 0.02;
//         this.pulsePhase = Math.random() * Math.PI * 2;
//         this.type = ['quantumDot', 'circuitNode', 'energyOrb', 'dataFlow'][Math.floor(Math.random() * 4)];
//         this.speed = Math.random() * 0.5 + 0.1;
//         this.trail = [];
//       }

//       update() {
//         this.rotation += this.rotationSpeed;
//         this.pulsePhase += 0.05;
        
//         // Subtle movement patterns
//         this.x += Math.cos(this.rotation) * this.speed;
//         this.y += Math.sin(this.rotation) * 0.3;
        
//         // Boundary wrap
//         if (this.x < -50) this.x = canvas.width + 50;
//         if (this.x > canvas.width + 50) this.x = -50;
//         if (this.y < -50) this.y = canvas.height + 50;
//         if (this.y > canvas.height + 50) this.y = -50;

//         // Add trail point
//         this.trail.push({x: this.x, y: this.y, alpha: 1});
//         if (this.trail.length > 8) this.trail.shift();
        
//         // Fade trail
//         this.trail.forEach(point => point.alpha -= 0.1);
//         this.trail = this.trail.filter(point => point.alpha > 0);
//       }

//       draw() {
//         const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
//         const alpha = 0.4 * pulse;

//         ctx.save();
//         ctx.globalAlpha = alpha;

//         switch (this.type) {
//           case 'quantumDot':
//             this.drawQuantumDot(ctx, pulse);
//             break;
//           case 'circuitNode':
//             this.drawCircuitNode(ctx, pulse);
//             break;
//           case 'energyOrb':
//             this.drawEnergyOrb(ctx, pulse);
//             break;
//           case 'dataFlow':
//             this.drawDataFlow(ctx);
//             break;
//         }

//         // Draw trail
//         this.drawTrail(ctx);
//         ctx.restore();
//       }

//       drawQuantumDot(ctx: CanvasRenderingContext2D, pulse: number) {
//         const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
//         gradient.addColorStop(0, theme === 'dark' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)');
//         gradient.addColorStop(1, 'transparent');
        
//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * 4 * pulse, 0, Math.PI * 2);
//         ctx.fill();

//         // Core dot
//         ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(59, 130, 246, 0.9)';
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
//         ctx.fill();
//       }

//       drawCircuitNode(ctx: CanvasRenderingContext2D, pulse: number) {
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(6, 182, 212, 0.4)';
//         ctx.lineWidth = 1;
//         ctx.setLineDash([2, 3]);
        
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
//         ctx.stroke();
//         ctx.setLineDash([]);

//         // Connection points
//         for (let i = 0; i < 4; i++) {
//           const angle = (i * Math.PI / 2) + this.rotation;
//           const px = this.x + Math.cos(angle) * this.size * 6;
//           const py = this.y + Math.sin(angle) * this.size * 6;
          
//           ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.6)';
//           ctx.beginPath();
//           ctx.arc(px, py, this.size * pulse, 0, Math.PI * 2);
//           ctx.fill();
//         }
//       }

//       drawEnergyOrb(ctx: CanvasRenderingContext2D, pulse: number) {
//         const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 8);
//         gradient.addColorStop(0, theme === 'dark' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)');
//         gradient.addColorStop(1, 'transparent');
        
//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * 8 * pulse, 0, Math.PI * 2);
//         ctx.fill();

//         // Orb rings
//         ctx.strokeStyle = theme === 'dark' ? 'rgba(236, 72, 153, 0.5)' : 'rgba(236, 72, 153, 0.3)';
//         ctx.lineWidth = 0.5;
        
//         for (let i = 1; i <= 3; i++) {
//           ctx.beginPath();
//           ctx.arc(this.x, this.y, this.size * 2 * i * pulse, 0, Math.PI * 2);
//           ctx.stroke();
//         }
//       }

//       drawDataFlow(ctx: CanvasRenderingContext2D) {
//         if (this.trail.length < 2) return;

//         ctx.strokeStyle = theme === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)';
//         ctx.lineWidth = 1;
        
//         ctx.beginPath();
//         ctx.moveTo(this.trail[0].x, this.trail[0].y);
        
//         for (let i = 1; i < this.trail.length; i++) {
//           ctx.globalAlpha = this.trail[i].alpha;
//           ctx.lineTo(this.trail[i].x, this.trail[i].y);
//         }
//         ctx.stroke();
//       }

//       drawTrail(ctx: CanvasRenderingContext2D) {
//         if (this.trail.length < 2) return;

//         ctx.strokeStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)';
//         ctx.lineWidth = 0.5;
        
//         ctx.beginPath();
//         ctx.moveTo(this.trail[0].x, this.trail[0].y);
        
//         for (let i = 1; i < this.trail.length; i++) {
//           ctx.globalAlpha = this.trail[i].alpha;
//           ctx.lineTo(this.trail[i].x, this.trail[i].y);
//         }
//         ctx.stroke();
//       }
//     }

//     const elements: QuantumElement[] = [];
//     const elementCount = 15; // Premium and minimal

//     const resizeCanvas = () => {
//       if (canvas && sectionRef.current) {
//         canvas.width = sectionRef.current.offsetWidth;
//         canvas.height = sectionRef.current.offsetHeight;
//       }
//     };

//     const initElements = () => {
//       for (let i = 0; i < elementCount; i++) {
//         elements.push(new QuantumElement());
//       }
//     };

//     const animate = () => {
//       // Clear with subtle theme-based background
//       ctx.fillStyle = theme === 'dark' 
//         ? 'rgba(10, 10, 20, 0.03)' 
//         : 'rgba(250, 250, 255, 0.02)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Update and draw elements
//       elements.forEach(element => {
//         element.update();
//         element.draw();
//       });

//       animationFrame = requestAnimationFrame(animate);
//     };

//     resizeCanvas();
//     initElements();
//     animate();

//     const handleResize = () => {
//       resizeCanvas();
//       // Reinitialize elements on resize
//       elements.length = 0;
//       initElements();
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       cancelAnimationFrame(animationFrame);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [theme]);

//   // GSAP Scroll Animations
//   useEffect(() => {
//     if (!sectionRef.current) return;

//     const ctx = gsap.context(() => {
//       // Section entrance animation
//       gsap.fromTo(sectionRef.current, 
//         { 
//           opacity: 0,
//           y: 100 
//         },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1.5,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Staggered animations for alternating timeline items
//       gsap.fromTo(".timeline-item-left",
//         {
//           opacity: 0,
//           x: -150,
//           rotationY: -30
//         },
//         {
//           opacity: 1,
//           x: 0,
//           rotationY: 0,
//           duration: 1.2,
//           stagger: 0.3,
//           ease: "back.out(1.7)",
//           scrollTrigger: {
//             trigger: ".timeline-container",
//             start: "top 70%",
//             end: "bottom 30%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       gsap.fromTo(".timeline-item-right",
//         {
//           opacity: 0,
//           x: 150,
//           rotationY: 30
//         },
//         {
//           opacity: 1,
//           x: 0,
//           rotationY: 0,
//           duration: 1.2,
//           stagger: 0.3,
//           ease: "back.out(1.7)",
//           scrollTrigger: {
//             trigger: ".timeline-container",
//             start: "top 70%",
//             end: "bottom 30%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Subtle floating animation for cards
//       gsap.to(".timeline-item", {
//         y: -4,
//         duration: 4,
//         yoyo: true,
//         repeat: -1,
//         ease: "sine.inOut",
//         stagger: 0.3
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <Section 
//       id="experience" 
//       ref={sectionRef}
//       className="experience-section relative overflow-hidden bg-secondary/30 min-h-screen"
//     >
//       {/* Ultra Premium Animated Canvas Background */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none"
//       />

//       {/* Subtle Holographic Beams */}
//       <div
//         ref={holographicBeamsRef}
//         className="holographic-beams-container absolute inset-0 pointer-events-none"
//       />

//       {/* Cursor Spotlight Overlay */}
//       <div className="cursor-spotlight pointer-events-none" />

//       <SectionHeading className="relative z-10">
//         Work Experience
//       </SectionHeading>

//       {/* Enhanced Timeline with Alternating Layout */}
//       <div className="relative z-10 timeline-container max-w-7xl mx-auto px-4">
//         <div className="relative">
//           {/* Central Timeline Line */}
//           <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/30 via-accent/50 to-primary/30">
//             <div className="absolute inset-0 bg-primary/10 blur-sm" />
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
//           </div>

//           {/* Timeline Items Container */}
//           <div className="space-y-16 py-8">
//             {workExperiences.map((experience, index) => {
//               const isLeft = index % 2 === 0;
//               const timelineItemClass = isLeft 
//                 ? "timeline-item timeline-item-left mr-auto ml-0 pr-12 lg:pr-24" 
//                 : "timeline-item timeline-item-right ml-auto mr-0 pl-12 lg:pl-24";
              
//               return (
//                 <div
//                   key={index}
//                   className={`${timelineItemClass} group relative w-full lg:w-[45%] bg-background/95 backdrop-blur-md rounded-2xl p-8 border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 transform-style-3d`}
//                   style={{
//                     transform: `translateZ(${index * 10}px)`,
//                   }}
//                 >
//                   {/* Timeline Dot */}
//                   <div className={`absolute top-8 w-5 h-5 rounded-full bg-primary border-3 border-background shadow-lg transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 flex items-center justify-center
//                     ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}
//                   >
//                     <div className="w-1.5 h-1.5 bg-background rounded-full" />
//                     <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
//                   </div>

//                   {/* Connection Line to Center */}
//                   <div className={`absolute top-8 h-0.5 bg-gradient-to-r ${isLeft ? 'right-6 left-auto w-10 from-transparent to-primary/40' : 'left-6 right-auto w-10 from-primary/40 to-transparent'}`} />

//                   {/* Content */}
//                   <div className="space-y-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                       <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
//                         {experience.role}
//                       </h3>
//                       <span className="text-sm text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/20">
//                         {experience.duration}
//                       </span>
//                     </div>
                    
//                     <p className="text-lg font-semibold text-primary/90">
//                       {experience.company}
//                     </p>
                    
//                     {/* Experience Details */}
//                     <div className="space-y-2">
//                       {experience.details.map((detail, detailIndex) => (
//                         <p key={detailIndex} className="text-foreground/80 leading-relaxed text-sm">
//                           • {detail}
//                         </p>
//                       ))}
//                     </div>
                    
//                     {/* Tech Stack */}
//                     <div className="flex flex-wrap gap-2">
//                       {experience.tech?.map((skill, skillIndex) => (
//                         <span
//                           key={skillIndex}
//                           className="magnetic-btn text-xs px-3 py-1.5 rounded-full bg-secondary/40 border border-border/30 text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-300 hover:scale-105"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Enhanced Hover Effects - No Blur */}
//                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/3 via-accent/2 to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
//                   {/* Subtle Gradient Border */}
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .experience-section {
//           --mouse-x: 50%;
//           --mouse-y: 50%;
//           perspective: 1000px;
//         }

//         .cursor-spotlight {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: radial-gradient(
//             circle at var(--mouse-x) var(--mouse-y),
//             ${theme === 'dark' ? 'rgba(120, 119, 198, 0.08)' : 'rgba(99, 102, 241, 0.05)'} 0%,
//             transparent 70%
//           );
//           opacity: 0;
//           transition: opacity 0.3s ease;
//           pointer-events: none;
//           z-index: 5;
//         }

//         .experience-section:hover .cursor-spotlight {
//           opacity: 1;
//         }

//         .holographic-beams-container {
//           opacity: ${theme === 'dark' ? 0.2 : 0.1};
//           mix-blend-mode: ${theme === 'dark' ? 'screen' : 'multiply'};
//         }

//         .holographic-beam {
//           position: absolute;
//           top: 0;
//           width: 1px;
//           height: 100%;
//           background: linear-gradient(
//             to bottom,
//             transparent,
//             ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'},
//             ${theme === 'dark' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'},
//             transparent
//           );
//           animation: beamFloat 12s ease-in-out infinite;
//         }

//         @keyframes beamFloat {
//           0%, 100% {
//             transform: translateY(0px);
//             opacity: 0.1;
//           }
//           50% {
//             transform: translateY(-20px);
//             opacity: 0.3;
//           }
//         }

//         /* Enhanced timeline item styles - No Blur on Hover */
//         .transform-style-3d {
//           transform-style: preserve-3d;
//         }

//         :global(.timeline-item) {
//           transform-style: preserve-3d;
//           transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//           position: relative;
//           backdrop-filter: blur(8px); /* Initial blur */
//         }

//         :global(.timeline-item:hover) {
//           transform: 
//             translateY(-6px) 
//             translateZ(20px) 
//             rotateX(2deg) 
//             rotateY(${theme === 'dark' ? '1deg' : '-1deg'}) 
//             scale(1.01);
//           backdrop-filter: blur(8px); /* Maintain same blur on hover */
//           z-index: 10;
//         }

//         /* Magnetic button effect */
//         :global(.magnetic-btn) {
//           transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//           transform-style: preserve-3d;
//           backdrop-filter: blur(4px);
//         }

//         :global(.magnetic-btn:hover) {
//           transform: translateZ(8px) scale(1.05);
//           box-shadow: 0 4px 12px ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'};
//         }
//       `}</style>
//     </Section>
//   );
// }

// export default Experience;

























// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Briefcase, Zap } from 'lucide-react';

// // --- DATA SIMULATION (Using the latest provided data) ---
// const siteConfig = {
//   workExperience: [
//     {
//       company: "Netcore Cloud",
//       role: "Java Software Developer",
//       duration: "Jan 2023 – Present",
//       details: [
//         "Contributed to core product development using Java, Spring Boot, Hibernate, Microservices, and AWS.",
//         "Built scalable backend services, integrated cloud components (EC2, RDS, S3), and optimized MySQL schemas.",
//         "Delivered high-performance REST APIs and led development for the Real Estate Blog Management System in an agile environment."
//       ],
//       tech: ["Java", "Spring Boot", "Hibernate", "Microservices", "MySQL", "SQL", "REST APIs", "AWS", "EC2", "RDS", "S3", "Scalable Systems", "Agile", "Maven", "Postman"]
//     },
//     {
//       company: "CodeSpeedy Technology Pvt Ltd",
//       role: "Java Software Engineer Intern",
//       duration: "Oct 2022 – Dec 2022",
//       details: [
//         "Built authentication modules using Spring Boot & JWT.",
//         "Managed entity relationships via Hibernate ORM and streamlined error handling with custom exceptions.",
//         "Leveraged Lombok to reduce Java boilerplate and performed API testing with Postman."
//       ],
//       tech: ["Java", "Spring Boot", "Hibernate", "JWT", "MySQL", "Spring Security", "Postman"]
//     },
//     {
//       company: "Walmart USA",
//       role: "Software Engineer (Remote)",
//       duration: "2022",
//       details: [
//         "Completed Advanced Software Engineering simulations.",
//         "Built custom Java heap for logistics and created UML/ER diagrams for scalable system design."
//       ],
//       tech: ["Java", "System Design", "UML", "ER Diagrams"]
//     }
//   ],
// };


// // --- UTILITY HOOKS ---

// // Intersection Observer Hook for Scroll-Triggering
// const useInView = (options) => {
//   const ref = useRef(null);
//   const [inView, setInView] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setInView(true);
//       }
//     }, options);

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [ref, options]);

//   return [ref, inView];
// };

// // --- HELPER COMPONENTS ---

// // Mock Section component (Kept clean for smooth scrolling)
// const Section = React.forwardRef(({ children, className, id, style }, ref) => (
//   <section id={id} ref={ref} className={`py-16 px-4 md:px-8 ${className}`} style={style}>
//     <div className="container mx-auto max-w-6xl">
//       {children}
//     </div>
//   </section>
// ));
// Section.displayName = 'Section';

// // Mock SectionHeading component
// const SectionHeading = ({ children, className, style }) => (
//   <h2 className={`text-center font-extrabold tracking-tight ${className}`} style={style}>
//     {children}
//   </h2>
// );

// // Timeline Item with Alternating Layout and Detailed Content
// const TimelineItem = ({ event, index, isVisible }) => {
//   const [ref, inView] = useInView({ threshold: 0.15 });
//   // Alternating the side: 0, 2, 4... is left (justify-end); 1, 3, 5... is right (justify-start)
//   const isRightSide = index % 2 !== 0; 

//   const style = {
//     // Staggered transition delay
//     transitionDelay: `${index * 150}ms`,
//     // Fade-in animation triggered by intersection observer
//     opacity: isVisible && inView ? 1 : 0,
//     // Setting CSS variable for dynamic rotation in the stylesheet
//     '--card-index': index,
//   };

//   return (
//     <li
//       ref={ref}
//       // Alternating positioning fix for medium screens and above
//       className={`relative w-full md:w-1/2 mb-20 flex transition-all duration-1000 ease-out timeline-item-container ${
//         isRightSide
//           ? 'md:ml-auto md:pl-10 justify-start' // Right side: starts from center line
//           : 'md:mr-auto md:pr-10 justify-end'  // Left side: ends at center line
//       }`}
//       style={style}
//     >
//       {/* Connector Dot */}
//       <div className={`absolute top-2 w-4 h-4 rounded-full ring-8 shadow-neon hidden md:block z-20 transition-all duration-500 ${
//         // Neon coloring for the dot
//         isRightSide 
//           ? 'bg-fuchsia-500 ring-gray-50 dark:bg-cyan-400 dark:ring-gray-950 md:-left-2' 
//           : 'bg-cyan-400 ring-gray-50 dark:bg-fuchsia-500 dark:ring-gray-950 md:right-0'
//       }`} />

//       {/* 4D Card Container with Animated Gradient Border */}
//       <div 
//         className="w-full relative timeline-card-wrapper"
//         // Card's initial position is set via CSS class, rotation is handled by CSS variables
//       >
//         {/* Inner Content Card (The Holographic Layer) */}
//         <div className="bg-white dark:bg-gray-950/90 backdrop-blur-md rounded-xl p-6 flex-grow transition-shadow duration-300 border border-gray-100/10 shadow-lg dark:shadow-2xl dark:shadow-fuchsia-900/10">
          
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
//               <div className="flex items-center order-1 sm:order-1 mb-2 sm:mb-0">
//                  <Briefcase className="w-5 h-5 text-indigo-600 dark:text-cyan-400 mr-2" />
//                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{event.company}</p>
//               </div>
//               {/* Duration is placed here */}
//               <span className="text-sm font-semibold text-indigo-700 dark:text-fuchsia-400 uppercase order-2 sm:order-2 tracking-widest">{event.duration}</span>
//           </div>

//           <h3 className="text-xl font-bold mt-1 text-gray-900 dark:text-gray-50">{event.role}</h3>
          
//           {/* Details List */}
//           {event.details && (
//             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-1 pl-4">
//               {event.details.map((detail, i) => (
//                 <li key={i}>{detail}</li>
//               ))}
//             </ul>
//           )}

//           {/* Tech Stack Badges */}
//           {event.tech && event.tech.length > 0 && (
//             <div className="mt-5 flex flex-wrap gap-2">
//               {event.tech.map((tech, i) => (
//                 <span key={i} className="inline-flex items-center px-3 py-1 text-xs font-mono bg-cyan-100/50 text-cyan-900 rounded-full dark:bg-cyan-900/50 dark:text-cyan-300 shadow-inner">
//                   <Zap className="w-3 h-3 mr-1" />
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           )}

//         </div>
//       </div>
//     </li>
//   );
// };

// // Mock Timeline component
// const Timeline = ({ events, className, isVisible }) => (
//     <div className={`relative ${className}`}>
//         {/* Vertical Line with Holographic Pulse */}
//         <div className="timeline-line absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-800 rounded-full hidden md:block z-10" />

//         <ul className="space-y-16">
//             {events.map((event, index) => (
//             <TimelineItem
//                 key={index}
//                 event={event}
//                 index={index}
//                 isVisible={isVisible}
//             />
//             ))}
//         </ul>
        
//         {events.length === 0 && (
//             <div className="text-center p-10 text-gray-500 dark:text-gray-400 text-lg border border-dashed border-indigo-400 rounded-xl">
//                 No experience items to display. Please populate the `siteConfig.workExperience` array.
//             </div>
//         )}
//     </div>
// );


// // --- MAIN EXPERIENCE COMPONENT ---

// export function Experience() {
//   const sectionRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   // Intersection Observer for overall section visibility
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(entry.target); // Stop observing once visible
//         }
//       },
//       { threshold: 0.2 }
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => {
//         if (sectionRef.current) observer.unobserve(sectionRef.current);
//         observer.disconnect();
//     };
//   }, []);

//   // Mouse move handler for performance: updates CSS variables directly
//   const handleMouseMove = useCallback((e) => {
//       if (sectionRef.current) {
//         const rect = sectionRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         // CRITICAL FIX: Update CSS variables directly for hardware-accelerated transforms
//         sectionRef.current.style.setProperty('--mouse-x-norm', `${(x / rect.width - 0.5) * 2}`); // -1 to 1
//         sectionRef.current.style.setProperty('--mouse-y-norm', `${(y / rect.height - 0.5) * 2}`); // -1 to 1
//       }
//     }, []);

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [handleMouseMove]);

//   return (
//     <Section
//       id="experience"
//       ref={sectionRef}
//       // CRITICAL FIX: No overflow-hidden; use perspective for 3D parent container
//       className="bg-gray-50 dark:bg-gray-950 relative min-h-screen transition-colors duration-500" 
//       style={{
//         perspective: "1500px", // Set strong perspective on the main container
//       }}
//     >
//       {/* Morphing Background Shapes - More subtle and neon */}
//       <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <div
//             key={i}
//             className="absolute bg-gradient-to-br from-indigo-500/50 via-fuchsia-500/50 to-cyan-500/50 dark:from-indigo-900/60 dark:via-fuchsia-900/60 dark:to-cyan-900/60 animate-glow-morph rounded-full filter blur-3xl mix-blend-multiply"
//             style={{
//               width: `${100 + Math.random() * 150}px`,
//               height: `${100 + Math.random() * 150}px`,
//               left: `${Math.random() * 90}%`,
//               top: `${Math.random() * 90}%`,
//               animationDelay: `${Math.random() * 10}s`,
//               animationDuration: `${15 + Math.random() * 10}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Parallax Layered Content */}
//       <div
//         className="relative z-10 transition-transform duration-200 ease-out"
//         // Apply subtle parallax to the main content block
//         style={{
//           '--p-x': 'calc(var(--mouse-x-norm) * -10px)',
//           '--p-y': 'calc(var(--mouse-y-norm) * -10px)',
//           transform: 'translate3d(var(--p-x), var(--p-y), 0)',
//         }}
//       >
        
//         {/* SectionHeading - Premium Look */}
//         <SectionHeading
//           className={`text-5xl md:text-6xl font-black mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} text-gray-900 dark:text-gray-100`}
//           style={{
//             textShadow: "0 0 10px rgba(173, 216, 230, 0.5), 0 0 20px rgba(147, 51, 234, 0.3)", // Light blue/purple neon glow
//           }}
//         >
//           Work Experience
//         {/* <Timeline events={siteConfig.workExperience} iconName="Briefcase" /> */}
//         </SectionHeading>

//         {/* Enhanced Timeline */}
//         <div className="relative mt-10">
//           <Timeline
//             events={siteConfig.workExperience}
//             className={`transition-all duration-1500 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
//             isVisible={isVisible}
//           />
//         </div>
//       </div>

//       {/* Custom CSS for Advanced Animations and Effects */}
//       <style>{`
//         /* 1. Global Performance & 3D Setup */
//         .timeline-item-container {
//             /* Enable 3D rendering for smooth transitions */
//             transform-style: preserve-3d;
//             perspective: 1000px;
//         }

//         /* 2. Background Animation */
//         @keyframes glow-morph {
//           0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
//           50% { border-radius: 40% 60% 70% 30% / 30% 60% 40% 70%; }
//         }
//         .animate-glow-morph {
//           animation: glow-morph 20s infinite alternate ease-in-out;
//         }

//         /* 3. Central Timeline Line Pulse (Holographic Effect) */
//         @keyframes linePulse {
//           0%, 100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.8), 0 0 10px rgba(6, 182, 212, 0.4); }
//           50% { box-shadow: 0 0 15px rgba(147, 51, 234, 1), 0 0 30px rgba(6, 182, 212, 0.8); }
//         }
//         .timeline-line {
//             background: linear-gradient(to top, rgba(6, 182, 212, 0), #9333ea, #06b6d4, #9333ea, rgba(6, 182, 212, 0));
//             animation: linePulse 4s infinite ease-in-out;
//             opacity: 0.8;
//         }

//         /* 4. Timeline Card (4D/Parallax Effect) */
//         .timeline-card-wrapper {
//           transform-style: preserve-3d;
//           transition: transform 0.2s ease-out, box-shadow 0.6s ease-out;
//           border-radius: 12px;
          
//           /* Dynamic 3D Rotation based on mouse position on the Section */
//           transform: rotateX(calc(var(--mouse-y-norm) * 5deg)) rotateY(calc(var(--mouse-x-norm) * -5deg)) translateZ(0);
//         }
        
//         .timeline-card-wrapper:hover {
//           /* Ultra rich 4D Hover effect: Lift, tilt, and add deep glow */
//           transform: rotateX(calc(var(--mouse-y-norm) * 8deg)) rotateY(calc(var(--mouse-x-norm) * -8deg)) translateZ(25px) scale(1.02);
//           cursor: pointer;
//           box-shadow: 0 0 40px rgba(147, 51, 234, 0.5), 0 0 80px rgba(6, 182, 212, 0.2);
//         }
        
//         .dark .timeline-card-wrapper:hover {
//             box-shadow: 0 0 40px rgba(255, 0, 255, 0.6), 0 0 80px rgba(0, 255, 255, 0.4);
//         }
//       `}</style>
//     </Section>
//   );
// }

// export default Experience;

























// // src/components/sections/experience.tsx
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Timeline } from "@/components/timeline";

// export function Experience() {
//   return (
//     <Section id="experience" className="bg-secondary/30">
//       <SectionHeading>Work Experience</SectionHeading>
//       <Timeline events={siteConfig.workExperience} iconName="Briefcase" />
//     </Section>
//   );
// }
