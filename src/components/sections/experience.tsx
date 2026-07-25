// src/components/sections/experience.tsx

"use client";

import { useRef, useEffect, useState } from "react";
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
  const [floatingParticles, setFloatingParticles] = useState<any[]>([]);

  useEffect(() => {
    setFloatingParticles([...Array(15)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDuration: Math.random() * 10 + 10 + 's'
    })));
  }, []);

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
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.trail = [];
      }

      update() {
        this.y -= this.speed;
        this.pulsePhase += 0.02;
        this.x += Math.sin(this.pulsePhase) * 0.1;
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 5) this.trail.shift();
        this.trail.forEach(point => point.opacity *= 0.8);
        if (this.y < -10) {
          this.y = canvas!.height + 10;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx!.strokeStyle = theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
        ctx!.lineWidth = 0.5;
        if (this.trail.length > 1) {
          ctx!.beginPath();
          ctx!.moveTo(this.trail[0].x, this.trail[0].y);
          for (let i = 1; i < this.trail.length; i++) {
            ctx!.globalAlpha = this.trail[i].opacity;
            ctx!.lineTo(this.trail[i].x, this.trail[i].y);
          }
          ctx!.stroke();
        }
        ctx!.globalAlpha = this.opacity * pulse;
        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(59, 130, 246, 0.8)';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
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
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new CinematicParticle());
      }
    };

    const animate = () => {
      const gradient = ctx!.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(10, 5, 20, 0.8)');
        gradient.addColorStop(1, 'rgba(20, 10, 40, 0.6)');
      } else {
        gradient.addColorStop(0, 'rgba(240, 245, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(230, 235, 250, 0.7)');
      }
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
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
      gsap.fromTo(sectionRef.current, 
        { opacity: 0, scale: 0.95, filter: "blur(10px)" },
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

      gsap.fromTo(".cinematic-title", 
        { opacity: 0, y: 100, rotationX: 45 },
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

      gsap.fromTo(".timeline-line", 
        { scaleY: 0, transformOrigin: "top" },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
      className="experience-section relative overflow-hidden min-h-screen"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10">
        <SectionHeading className="cinematic-title text-center mb-20">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
            Professional Journey
          </span>
        </SectionHeading>
      </div>

      <div ref={timelineRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-cyan-400/50 via-purple-500/80 to-cyan-400/50">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-purple-500/20 blur-sm" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-24 py-12 sm:py-16 lg:py-20">
            {workExperiences.map((experience, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className={`cinematic-card group relative w-full lg:w-[90%] xl:w-[80%] ${isLeft ? "mr-auto ml-0 pr-8 lg:pr-24" : "ml-auto mr-0 pl-8 lg:pl-24"}`}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardLeave(index)}
                >
                  <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-cyan-400/20 shadow-2xl overflow-hidden transform-style-3d transition-all duration-700">
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors truncate">
                            {experience.role}
                          </h3>
                          <p className="text-base sm:text-lg font-semibold text-cyan-300 truncate">
                            {experience.company}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm text-cyan-200 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30 whitespace-nowrap">
                          {experience.duration}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4 sm:mb-6">
                        {experience.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 text-xs sm:text-sm border-l-2 border-cyan-400/50 pl-3 py-1">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {experience.tech.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 rounded-md text-xs sm:text-sm backdrop-blur-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingParticles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float-cinematic"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: `${i * 0.5}s`,
              animationDuration: p.animationDuration
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .experience-section {
          background: linear-gradient(135deg, hsl(220, 60%, 5%) 0%, hsl(270, 60%, 15%) 50%, hsl(220, 60%, 5%) 100%);
        }
        @keyframes float-cinematic {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(-5px); opacity: 0.8; }
        }
        .animate-float-cinematic {
          animation: float-cinematic 15s ease-in-out infinite;
        }
      `}</style>
    </Section>
  );
}

export default Experience;
