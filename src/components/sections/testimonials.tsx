"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Quote, 
  Star, 
  TrendingUp, 
  Bot, 
  Shield, 
  Users, 
  Eye, 
  Layout, 
  Zap, 
  Infinity as InfinityIcon, 
  Cpu, 
  Brain,
  Layers3,
  BrainCircuit,
  Database
} from "lucide-react";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { useTilt } from "@/hooks/use-tilt";

const testimonials = [
  {
    id: 1,
    name: "Rahul Mehta",
    role: "CTO, FinTech Startup",
    text: "Prabhat architected our entire trading backend from scratch. His understanding of financial systems, combined with clean Spring Boot microservices design, was exceptional. Delivered on time and beyond expectations.",
    metric: "10,000+ concurrent traders • 99.9% uptime • 3 months",
    // 3-Color Liquid Cocktail Mixtures (Stable, Transparent, Rich)
    liquidColors: ["rgba(0, 212, 255, 0.4)", "rgba(0, 102, 255, 0.45)", "rgba(122, 0, 255, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#00d4ff] to-[#0066ff]",
    initials: "RM",
    icon: TrendingUp,
    achievement: "High-Frequency Trading",
    project: "Trading Bot",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Manager, SaaS Company",
    text: "We hired Prabhat to build our AI-powered outreach platform. The system he delivered runs 24/7 autonomously — lead discovery, email validation, AI personalization, and reply classification. Incredible engineering.",
    metric: "500+ leads daily • 35% better response • 60% lower cost",
    liquidColors: ["rgba(168, 85, 247, 0.45)", "rgba(236, 72, 153, 0.4)", "rgba(59, 130, 246, 0.35)"],
    bgColor: "bg-gradient-to-r from-[#a855f7] to-[#ec4899]",
    initials: "SC",
    icon: Bot,
    achievement: "Autonomous AI Agent",
    project: "AcquisitionOS",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Sharma",
    role: "Founder, Digital Agency",
    text: "CodeGuard AI saved our team thousands of dollars in unexpected AWS bills. Prabhat built something genuinely useful — real-time Terraform cost detection right in VS Code. Brilliant tool.",
    metric: "45% cost reduction • 1,000+ VS Code users",
    liquidColors: ["rgba(16, 185, 129, 0.45)", "rgba(5, 150, 105, 0.4)", "rgba(110, 231, 183, 0.35)"],
    bgColor: "bg-gradient-to-r from-[#10b981] to-[#059669]",
    initials: "AS",
    icon: Shield,
    achievement: "Cloud Cost Optimization",
    project: "CodeGuard AI",
    rating: 5,
  },
  {
    id: 4,
    name: "Dhiraj Singh",
    role: "Founder, Maarogyam",
    text: "Prabhat delivered exactly what we needed for Maarogyam — a fast, modern, and professional healthcare platform with smooth performance and clean user experience. His backend architecture made a huge difference.",
    metric: "50,000+ patient records • <1.2s load • 99.8% uptime",
    liquidColors: ["rgba(249, 115, 22, 0.45)", "rgba(234, 88, 12, 0.4)", "rgba(250, 204, 21, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#f97316] to-[#ea580c]",
    initials: "DS",
    icon: Users,
    achievement: "Healthcare Scale",
    project: "SystemFoundry",
    rating: 5,
  },
  {
    id: 5,
    name: "Dr. Elena Vasquez",
    role: "Head of AI Research, QuantumLab",
    text: "Prabhat's work on QuantumOS is revolutionary. He built a quantum-inspired classical optimization layer that reduced our computation time by 80%. His ability to bridge quantum concepts with practical engineering is rare.",
    metric: "80% faster computation • 1M+ simulations daily",
    liquidColors: ["rgba(6, 182, 212, 0.45)", "rgba(59, 130, 246, 0.4)", "rgba(0, 245, 255, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]",
    initials: "EV",
    icon: Cpu,
    achievement: "Quantum-Classical Bridge",
    project: "QuantumOS",
    rating: 5,
  },
  {
    id: 6,
    name: "Marcus Williams",
    role: "VP Engineering, Observability Platform",
    text: "The AI Observability Layer Prabhat built gives us x-ray vision into our ML pipelines. We caught 3 critical model drifts before they hit production. This should be industry standard.",
    metric: "99.99% anomaly detection • 15min → 30sec MTTR",
    liquidColors: ["rgba(139, 92, 246, 0.45)", "rgba(99, 102, 241, 0.4)", "rgba(217, 70, 239, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1]",
    initials: "MW",
    icon: Eye,
    achievement: "ML Pipeline Intelligence",
    project: "AI Observability Layer",
    rating: 5,
  },
  {
    id: 7,
    name: "Neha Gupta",
    role: "Technical Writer & Developer Advocate",
    text: "PrabhatBlogs isn't just another tech blog — it's a masterclass in distributed systems. His deep dives on microservices patterns helped our team solve 3 major architectural challenges. Pure gold.",
    metric: "50k+ monthly readers • 500+ GitHub stars",
    liquidColors: ["rgba(234, 179, 8, 0.4)", "rgba(202, 138, 4, 0.45)", "rgba(244, 63, 94, 0.35)"],
    bgColor: "bg-gradient-to-r from-[#eab308] to-[#ca8a04]",
    initials: "NG",
    icon: Layout,
    achievement: "Knowledge Multiplier",
    project: "PrabhatBlogs",
    rating: 5,
  },
  {
    id: 8,
    name: "James O'Brien",
    role: "CTO, Fintech Unicorn",
    text: "The Visualization Engine Prabhat created handles 10M+ data points with sub-second rendering. We've never seen anything like it — WebGL, WebAssembly, and React working in perfect harmony.",
    metric: "10M points • 60fps • 200ms load time",
    liquidColors: ["rgba(236, 72, 153, 0.45)", "rgba(190, 24, 93, 0.4)", "rgba(124, 58, 237, 0.35)"],
    bgColor: "bg-gradient-to-r from-[#ec4899] to-[#be185d]",
    initials: "JO",
    icon: Zap,
    achievement: "Real-time Visual Analytics",
    project: "Visualization Engine",
    rating: 5,
  },
  {
    id: 9,
    name: "Dr. Priya Sharma",
    role: "Director of AI, QuantumFusion",
    text: "Prabhat's approach to QuantumFusion Solutions is visionary. He's building hybrid quantum-classical models that are actually practical for today's hardware. The efficiency gains are unprecedented.",
    metric: "4x speedup • 60% energy reduction",
    liquidColors: ["rgba(20, 184, 166, 0.45)", "rgba(15, 118, 110, 0.4)", "rgba(45, 212, 191, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#14b8a6] to-[#0f766e]",
    initials: "PS",
    icon: InfinityIcon,
    achievement: "Quantum Fusion",
    project: "QuantumFusion Solutions",
    rating: 5,
  },
  {
    id: 10,
    name: "Alex Rivera",
    role: "Founder, AI Infrastructure Startup",
    text: "PrabhatAI is the most thoughtful AI assistant architecture I've seen. The multi-agent orchestration layer with memory and tool use is production-ready. We're basing our next product on it.",
    metric: "98% accuracy • 200ms response • 24/7 uptime",
    liquidColors: ["rgba(217, 70, 239, 0.45)", "rgba(162, 28, 175, 0.4)", "rgba(59, 130, 246, 0.3)"],
    bgColor: "bg-gradient-to-r from-[#d946ef] to-[#a21caf]",
    initials: "AR",
    icon: Brain,
    achievement: "Intelligent Agent System",
    project: "PrabhatAI",
    rating: 5,
  },
  {
    id: 11,
    name: "Early Access User",
    role: "System Architect",
    text: "SystemFoundry changed how we approach architecture planning. Generating system designs, exporting artifacts, and iterating visually reduced our planning cycle significantly.",
    metric: "Architecture planning • Export workflows • Faster iterations",
    liquidColors: ["rgba(139, 233, 253, 0.45)", "rgba(80, 199, 247, 0.4)", "rgba(27, 108, 168, 0.35)"],
    bgColor: "bg-gradient-to-br from-[#0b1014] via-[#13202a] to-[#1e3a4c]",
    initials: "EA",
    icon: Layers3,
    achievement: "Architecture Intelligence",
    project: "SystemFoundry",
    rating: 5,
  },
  {
    id: 12,
    name: "Platform User",
    role: "AI Engineer",
    text: "The multi-agent company operating system is impressive. Having specialized agents with shared memory and orchestration creates a workflow closer to an actual AI organization than a chatbot.",
    metric: "Shared memory • Agent orchestration • Autonomous workflow",
    liquidColors: ["rgba(34, 197, 94, 0.45)", "rgba(22, 163, 74, 0.4)", "rgba(20, 83, 45, 0.35)"],
    bgColor: "bg-gradient-to-r from-[#07130a] via-[#0d2212] to-[#13331b]",
    initials: "PU",
    icon: BrainCircuit,
    achievement: "AI Organization",
    project: "AI Company OS",
    rating: 5,
  },
  {
    id: 13,
    name: "Developer Community",
    role: "Backend Engineer",
    text: "The shared memory architecture stands out. New agents inheriting context without losing previous work makes the system feel persistent rather than session based.",
    metric: "Persistent memory • Context sync • Agent continuity",
    liquidColors: ["rgba(245, 158, 11, 0.45)", "rgba(217, 119, 6, 0.4)", "rgba(120, 53, 15, 0.35)"],
    bgColor: "bg-gradient-to-tr from-[#1a1208] via-[#2e1f0d] to-[#4a2c0f]",
    initials: "DC",
    icon: Database,
    achievement: "Memory Layer",
    project: "Shared Memory Engine",
    rating: 5,
  }
];

const doubleTestimonials = [...testimonials, ...testimonials];

function PremiumTestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>({ maxTilt: 10, scale: 1.03 });
  const IconComponent = testimonial.icon;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative w-[350px] md:w-[420px] h-[370px] flex-shrink-0 p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex flex-col justify-between group transition-all duration-500 ease-out select-none overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* STABLE TRANSPARENT 3-COLOR LIQUID WATER FILTER (Activated on Hover, Absolutely No Reading Distraction) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <svg className="w-full h-full object-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {/* Stable High-Fidelity Fluidic Displacement Grid Maps */}
            <filter id={`stable-liquid-${testimonial.id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" seed={testimonial.id} />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          
          {/* Static premium watery overlapping liquid zones */}
          <g filter={`url(#stable-liquid-${testimonial.id})`}>
            <rect width="100" height="100" fill={testimonial.liquidColors[0]} />
            <circle cx="20" cy="30" r="55" fill={testimonial.liquidColors[1]} style={{ mixBlendMode: 'color-dodge' }} />
            <circle cx="80" cy="70" r="50" fill={testimonial.liquidColors[2]} style={{ mixBlendMode: 'overlay' }} />
          </g>
        </svg>
        
        {/* Anti-dizzy frosted transparent liquid shield layer */}
        <div className="absolute inset-0 bg-white/10 dark:bg-zinc-950/20 backdrop-blur-[20px]" />
      </div>

      {/* Edge Liquid Tint Frame Enhancer */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none border-2 z-10 scale-105 group-hover:scale-100"
        style={{ borderColor: testimonial.liquidColors[0] }}
      />

      {/* Floating Background Accent Elements */}
      <Quote 
        className="absolute top-6 right-8 w-16 h-16 text-black/[0.02] dark:text-white/[0.02] transition-all duration-500 group-hover:text-white/10 group-hover:scale-110 pointer-events-none z-10" 
        style={{ transform: "translateZ(15px)" }}
      />

      {/* Icon Shield Badge */}
      <div className="absolute top-6 left-8 w-10 h-10 rounded-xl bg-black/[0.03] dark:bg-white/5 backdrop-blur-md border border-black/[0.05] dark:border-white/10 flex items-center justify-center shadow-md transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/30 z-10">
        <IconComponent className="w-5 h-5 text-zinc-700 dark:text-zinc-300 transition-colors duration-500 group-hover:text-white" />
      </div>

      {/* Testimonial Core Content Block */}
      <div style={{ transform: "translateZ(35px)" }} className="transition-transform duration-500 mt-14 relative z-10">
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.15)] group-hover:fill-white group-hover:text-white transition-colors duration-500" />
          ))}
        </div>

        <p className="text-zinc-600 dark:text-zinc-300 group-hover:text-white text-[14px] md:text-[15px] leading-relaxed font-medium line-clamp-5 italic transition-colors duration-500">
          “{testimonial.text}”
        </p>
      </div>

      {/* Footer / Meta Specs block */}
      <div style={{ transform: "translateZ(50px)" }} className="transition-transform duration-500 mt-auto relative z-10">
        {/* Metric row box */}
        <div className="mb-5 inline-block w-full text-center py-2 px-[14px] rounded-2xl border border-black/[0.04] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.02] text-[11px] font-bold tracking-wide uppercase text-zinc-500 dark:text-zinc-400 backdrop-blur-sm group-hover:bg-white/15 group-hover:text-white group-hover:border-white/20 transition-all duration-500">
          {testimonial.metric}
        </div>

        {/* User profile layout segment */}
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-md ${testimonial.bgColor} shadow-md shadow-black/5 group-hover:bg-white group-hover:from-white group-hover:to-white group-hover:text-zinc-900 transition-all duration-500`}>
            {testimonial.initials}
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-white text-sm tracking-tight transition-colors duration-500">{testimonial.name}</h4>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-white/80 transition-colors duration-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" className="py-24 overflow-hidden relative bg-zinc-50/30 dark:bg-black/15">
      {/* Side Ambient Edge Fog Masks to smoothly fade out cards over edges seamlessly */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent dark:from-background dark:via-background/80 dark:to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-zinc-50 via-zinc-50/80 to-transparent dark:from-background dark:via-background/80 dark:to-transparent z-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading>Social Proof & Impact</SectionHeading>
          <p className="mt-4 text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            Real-world systems engineered for maximum performance, commercial scale, and deep structural stability.
          </p>
        </motion.div>
      </div>

      {/* CRITICAL FIX FOR THE ACCIDENT FOCUS POSITION RE-RENDER JUMP BUG:
        Instead of removing the class string via useState toggles (which forced React layout recalculated re-renders), 
        we use pure hardware-accelerated Tailwind css parent grouping (`group/marquee`) paired with child state tracking.
        When hovering over the master layout block, the global animation timing parameters instantly pause *exactly* where they are on screen, natively unblocking the correct localized card coordinate pointer capture.
      */}
      <div className="relative w-full flex flex-col gap-8 select-none group/marquee">
        <div className="w-max flex gap-6 px-4 animate-marquee group-hover/marquee:pause-marquee">
          {doubleTestimonials.map((testimonial, idx) => (
            <PremiumTestimonialCard key={`portfolio-item-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Global Optimization Stylesheet injection */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-marquee {
          animation: marquee 100s linear infinite;
        }
        .pause-marquee {
          animation-play-state: paused !important;
        }
      `}</style>
    </Section>
  );
}

























// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
// import { Quote, Star, ChevronLeft, ChevronRight, Sparkles, Award, TrendingUp } from "lucide-react";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";

// const testimonials = [
//   {
//     name: "Rahul Mehta",
//     role: "CTO, FinTech Startup",
//     content: "Prabhat architected our entire trading backend from scratch. His understanding of financial systems, combined with clean Spring Boot microservices design, was exceptional. Delivered on time and beyond expectations.",
//     metric: "10,000+ concurrent traders • 99.9% uptime • 3 months",
//     icon: TrendingUp,
//     color: "from-cyan-500 to-blue-600",
//     bgImage: "radial-gradient(circle at 20% 30%, rgba(6,182,212,0.15), transparent 70%)",
//   },
//   {
//     name: "Sarah Chen",
//     role: "Product Manager, SaaS Company",
//     content: "We hired Prabhat to build our AI-powered outreach platform. The system he delivered runs 24/7 autonomously — lead discovery, email validation, AI personalization, and reply classification. Incredible engineering.",
//     metric: "500+ leads daily • 35% better response • 60% lower cost",
//     icon: Sparkles,
//     color: "from-purple-500 to-pink-600",
//     bgImage: "radial-gradient(circle at 80% 40%, rgba(168,85,247,0.15), transparent 70%)",
//   },
//   {
//     name: "Amit Sharma",
//     role: "Founder, Digital Agency",
//     content: "CodeGuard AI saved our team thousands of dollars in unexpected AWS bills. Prabhat built something genuinely useful — real-time Terraform cost detection right in VS Code. Brilliant tool.",
//     metric: "45% cost reduction • 1,000+ VS Code users",
//     icon: Award,
//     color: "from-emerald-500 to-teal-600",
//     bgImage: "radial-gradient(circle at 60% 70%, rgba(16,185,129,0.15), transparent 70%)",
//   },
//   {
//     name: "Dhiraj Singh",
//     role: "Founder, Maarogyam",
//     content: "Prabhat delivered exactly what we needed for Maarogyam — a fast, modern, and professional healthcare platform with smooth performance and clean user experience. His attention to backend architecture, scalability, and real-world usability made a huge difference.",
//     metric: "50,000+ patient records • <1.2s load • 99.8% uptime",
//     icon: Award,
//     color: "from-orange-500 to-amber-600",
//     bgImage: "radial-gradient(circle at 40% 80%, rgba(249,115,22,0.15), transparent 70%)",
//   },
//   {
//     name: "AcquisitionOS Beta Client",
//     role: "Founder, B2B SaaS",
//     content: "Prabhat's AcquisitionOS system transformed how we think about lead acquisition. The AI-powered qualification alone improved our conversion rate from 2% to 8% in three months. Game changer.",
//     metric: "4x conversion improvement • 2% → 8% in 90 days",
//     icon: TrendingUp,
//     color: "from-rose-500 to-red-600",
//     bgImage: "radial-gradient(circle at 90% 20%, rgba(244,63,94,0.15), transparent 70%)",
//   },
// ];

// const AnimatedCard = ({ testimonial, index, isActive, onClick }: any) => {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [rotateX, setRotateX] = useState(0);
//   const [rotateY, setRotateY] = useState(0);
//   const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!cardRef.current) return;
//     const rect = cardRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
//     const rotateXVal = ((y - centerY) / centerY) * -8;
//     const rotateYVal = ((x - centerX) / centerX) * 8;
//     setRotateX(rotateXVal);
//     setRotateY(rotateYVal);
//     setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
//   };

//   const handleMouseLeave = () => {
//     setRotateX(0);
//     setRotateY(0);
//   };

//   const IconComponent = testimonial.icon;

//   return (
//     <motion.div
//       ref={cardRef}
//       onClick={onClick}
//       className={`relative cursor-pointer transition-all duration-500 ease-out
//         ${isActive ? 'scale-105 md:scale-110 z-20' : 'scale-90 md:scale-95 opacity-60 hover:opacity-80'}`}
//       style={{
//         perspective: "1200px",
//         transformStyle: "preserve-3d",
//         rotateX: rotateX,
//         rotateY: rotateY,
//         transition: "transform 0.1s ease-out",
//       }}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       whileHover={{ scale: isActive ? 1.08 : 1.02 }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//     >
//       <div
//         className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/20 dark:border-white/10"
//         style={{
//           background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
//           backdropFilter: "blur(12px)",
//           boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
//         }}
//       >
//         {/* Animated gradient background */}
//         <div
//           className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-10 dark:opacity-20`}
//           style={{
//             backgroundImage: testimonial.bgImage,
//           }}
//         />
        
//         {/* Dynamic glow effect on hover */}
//         <div
//           className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
//           style={{
//             background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.25), transparent 60%)`,
//             opacity: rotateX !== 0 ? 0.6 : 0,
//           }}
//         />

//         <div className="relative p-6 md:p-8 flex flex-col h-full min-h-[420px] md:min-h-[480px]">
//           {/* Decorative quote */}
//           <Quote className="absolute top-4 right-6 w-16 h-16 text-white/10 dark:text-white/5 rotate-180" />
          
//           {/* Star rating */}
//           <div className="flex gap-1 mb-6">
//             {[...Array(5)].map((_, i) => (
//               <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-glow" />
//             ))}
//           </div>

//           {/* Content */}
//           <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-6 flex-grow font-medium">
//             “{testimonial.content}”
//           </p>

//           {/* Metric badge with icon */}
//           <div className="mb-8 p-3 rounded-xl bg-black/20 dark:bg-white/10 backdrop-blur-sm border border-white/20">
//             <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary">
//               <IconComponent className="w-4 h-4" />
//               <span>{testimonial.metric}</span>
//             </div>
//           </div>

//           {/* Author */}
//           <div className="flex items-center gap-3 mt-auto">
//             <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
//               {testimonial.name.charAt(0)}
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
//               <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export function Testimonials() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isAutoScrolling, setIsAutoScrolling] = useState(true);
//   const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dragStartX = useRef(0);
//   const dragThreshold = 50;

//   const nextSlide = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % testimonials.length);
//   }, []);

//   const prevSlide = useCallback(() => {
//     setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//   }, []);

//   const goToSlide = (index: number) => {
//     setActiveIndex(index);
//     // Reset auto-scroll timer on manual interaction
//     if (autoScrollRef.current) {
//       clearInterval(autoScrollRef.current);
//       setIsAutoScrolling(false);
//       setTimeout(() => {
//         setIsAutoScrolling(true);
//       }, 10000);
//     }
//   };

//   // Auto-scroll logic
//   useEffect(() => {
//     if (isAutoScrolling) {
//       autoScrollRef.current = setInterval(() => {
//         nextSlide();
//       }, 4000);
//     }
//     return () => {
//       if (autoScrollRef.current) clearInterval(autoScrollRef.current);
//     };
//   }, [isAutoScrolling, nextSlide]);

//   // Touch/mouse drag handling
//   const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
//     const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
//     dragStartX.current = clientX;
//   };

//   const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
//     const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
//     const diff = clientX - dragStartX.current;
//     if (Math.abs(diff) > dragThreshold) {
//       if (diff > 0) prevSlide();
//       else nextSlide();
//     }
//   };

//   // Get visible cards based on active index for the 3D carousel effect
//   const getCardPosition = (idx: number) => {
//     const diff = (idx - activeIndex + testimonials.length) % testimonials.length;
//     const isActive = diff === 0;
//     const isPrev = diff === testimonials.length - 1;
//     const isNext = diff === 1;
//     const isPrevTwo = diff === testimonials.length - 2;
//     const isNextTwo = diff === 2;

//     let classes = "absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.2,0.64,1)]";
//     let style: React.CSSProperties = {};

//     if (isActive) {
//       classes += " relative z-30 opacity-100 scale-100 translate-x-0";
//       style = { transform: "translateX(0) scale(1)" };
//     } else if (isPrev) {
//       classes += " hidden md:block z-20 opacity-70 scale-90 -translate-x-[95%]";
//       style = { transform: "translateX(-95%) scale(0.9)" };
//     } else if (isNext) {
//       classes += " hidden md:block z-20 opacity-70 scale-90 translate-x-[95%]";
//       style = { transform: "translateX(95%) scale(0.9)" };
//     } else if (isPrevTwo) {
//       classes += " hidden lg:block z-10 opacity-40 scale-80 -translate-x-[150%]";
//       style = { transform: "translateX(-150%) scale(0.8)" };
//     } else if (isNextTwo) {
//       classes += " hidden lg:block z-10 opacity-40 scale-80 translate-x-[150%]";
//       style = { transform: "translateX(150%) scale(0.8)" };
//     } else {
//       classes += " hidden";
//     }

//     return { classes, style };
//   };

//   return (
//     <Section id="testimonials" className="py-12 md:py-20 overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.7 }}
//         className="text-center"
//       >
//         <SectionHeading className="mb-4">What People Say</SectionHeading>
//         <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
//           Trusted by industry leaders and innovators worldwide
//         </p>
//       </motion.div>

//       <div className="relative mt-16 md:mt-24">
//         {/* 3D Carousel Container */}
//         <div 
//           ref={containerRef}
//           className="relative flex justify-center items-center min-h-[500px] md:min-h-[580px]"
//           onTouchStart={handleDragStart}
//           onTouchEnd={handleDragEnd}
//           onMouseDown={handleDragStart}
//           onMouseUp={handleDragEnd}
//         >
//           <div className="relative w-full max-w-6xl mx-auto px-4">
//             <div className="relative flex justify-center items-center">
//               {testimonials.map((testimonial, idx) => {
//                 const { classes, style } = getCardPosition(idx);
//                 const isActive = idx === activeIndex;
//                 return (
//                   <div key={idx} className={classes} style={style}>
//                     <div className="w-[280px] md:w-[380px] lg:w-[420px]">
//                       <AnimatedCard
//                         testimonial={testimonial}
//                         index={idx}
//                         isActive={isActive}
//                         onClick={() => goToSlide(idx)}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Navigation arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 text-gray-800 dark:text-white hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-300 shadow-xl"
//             aria-label="Previous testimonial"
//           >
//             <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 text-gray-800 dark:text-white hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-300 shadow-xl"
//             aria-label="Next testimonial"
//           >
//             <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
//           </button>
//         </div>

//         {/* Dots indicator */}
//         <div className="flex justify-center gap-3 mt-8 md:mt-12">
//           {testimonials.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => goToSlide(idx)}
//               className={`transition-all duration-300 rounded-full ${
//                 idx === activeIndex
//                   ? "w-8 h-2 bg-primary"
//                   : "w-2 h-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500"
//               }`}
//               aria-label={`Go to testimonial ${idx + 1}`}
//             />
//           ))}
//         </div>

//         {/* Decorative elements for depth */}
//         <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
//         <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] -z-10" />
//       </div>

//       {/* Custom styles for glow effect */}
//       <style jsx>{`
//         .drop-shadow-glow {
//           filter: drop-shadow(0 0 4px rgba(250,204,21,0.5));
//         }
//       `}</style>
//     </Section>
//   );
// }
