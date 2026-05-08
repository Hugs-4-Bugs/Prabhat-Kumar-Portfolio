// src/components/sections/currently-building.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import React, { useEffect, useState } from "react";

const cards = [
  {
    icon: "🤖",
    title: "AI Agentic IT Company",
    subtitle: "Orchestration Platform",
    tag: "In Progress",
    tagColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    description: "Building a fully autonomous AI company that runs end-to-end IT operations — from lead gen to delivery — using multi-agent orchestration",
  },
  {
    icon: "📈",
    title: "Trading Bot",
    subtitle: "Indian Markets + Crypto",
    tag: "Live",
    tagLabel: "Live (Paper Trading)",
    tagColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    description: "24/7 automated trading system for NIFTY 50, BANK NIFTY, SENSEX, Gold, Silver, Crude Oil and Crypto. FastAPI + Claude AI + Zerodha Kite Connect",
  },
  {
    icon: "🛡️",
    title: "CodeGuard AI",
    subtitle: "VS Code Extension",
    tag: "Live",
    tagLabel: "Live on Marketplace",
    tagColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    description: "Real-time AWS cost detection in Terraform code. 14-pattern rule engine. AWS 10K AIdeas semi-finalist.",
  },
  {
    icon: "📧",
    title: "AI Sales Outreach Platform",
    subtitle: "24/7 Lead Automation",
    tag: "Running",
    tagLabel: "Running on Laptop",
    tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    description: "Autonomous system that discovers leads, validates emails, generates personalized cold emails, classifies replies using AI, and automates follow-ups",
  },
  {
    icon: "☁️",
    title: "AWS Cost Intelligence Dashboard",
    subtitle: "FinOps for Developers",
    tag: "Building",
    tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "React-based dashboard extending CodeGuard AI — real-time spend tracking, budget alerts, AI-powered cost optimization insights",
  },
  {
    icon: "🌐",
    title: "QuantumFusion Solutions",
    subtitle: "AI Tech Company",
    tag: "Live",
    tagColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    description: "Building an innovative tech company focused on AI, cloud automation, and open-source development to empower digital transformation",
  },
  {
    icon: "📊",
    title: "AI Observability Platform",
    subtitle: "Kafka + Spring Boot",
    tag: "Architecting",
    tagColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    description: "Event-driven real-time monitoring platform using Kafka for AI systems observability, anomaly detection, and alerting",
  },
  {
    icon: "🔬",
    title: "Spring AI Research",
    subtitle: "LLM + Java Integration",
    tag: "Experimenting",
    tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Exploring Spring AI framework for integrating LLMs into production Java microservices — RAG, tool calling, agentic flows",
  },
];

export function CurrentlyBuilding() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Section id="currently-building">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center text-3xl font-bold tracking-tight sm:text-4xl">
          <h2>🚀 What I'm Building</h2>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="ml-1 inline-block w-3 h-8 bg-primary translate-y-1"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center px-4 mb-8"
        >
          <p className="text-xl md:text-2xl italic font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
            "I don't just write code. I build systems that think, trade, sell, and scale — autonomously."
          </p>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden mt-8 py-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div 
          className="flex gap-6 w-max"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          style={{
            animation: `scroll ${cards.length * 5}s linear infinite`,
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {/* Double the cards for seamless loop */}
          {[...cards, ...cards].map((card, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden glass-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md relative"
            >
              {/* Top gradient border accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{card.icon}</div>
                  <Badge variant="outline" className={`font-medium ${card.tagColor}`}>
                    {card.tagLabel || card.tag}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-primary mb-3">
                  {card.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px));
          }
        }

        .glass-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}} />
    </Section>
  );
}
