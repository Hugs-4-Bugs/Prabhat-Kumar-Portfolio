"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Section } from "@/components/section-wrapper";

export function ContractBanner() {
  return (
    <Section id="contract-banner" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl w-full"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-teal-900 via-purple-900 to-black bg-[length:200%_200%] animate-gradient-xy opacity-90 dark:opacity-100" />
        
        {/* Glass Overlay for depth */}
        <div className="absolute inset-0 z-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side */}
          <div className="flex-1 space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Let's Build Something Remarkable
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
              I take on contract projects for businesses. Whether you need a scalable backend, AI integration, trading system, or complete product — I architect and ship it.
            </p>
            
            <ul className="space-y-4 pt-2">
              {[
                "Backend Systems (Java, Spring Boot, Microservices)",
                "AI & Automation (LLMs, Agents, Outreach Bots)",
                "Cloud & DevOps (AWS, Docker, CI/CD)"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-100 text-lg">
                  <span className="flex-shrink-0 bg-green-500/20 rounded-full p-1 text-green-400">
                    <CheckCircle2 size={20} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side */}
          <div className="flex-shrink-0 flex flex-col items-start lg:items-center space-y-8 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full lg:w-auto shadow-2xl">
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-green-400 uppercase tracking-widest">
                Currently Available
              </span>
            </div>

            <div className="flex flex-col w-full gap-4">
              <Link href="#contact" className="w-full">
                <LiquidButton className="relative overflow-hidden group w-full px-8 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-primary/30 ">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Discuss Your Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </LiquidButton>
              </Link>
              
              <Link href="#services" className="w-full">
                <button className="w-full px-8 py-4 bg-transparent border-2 border-white/30 rounded-xl font-bold text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  View My Services <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
        }
        .ripple-bg {
          position: relative;
        }
        .ripple-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-circle, rgba(255,255,255,0.2) 10%, transparent 10.01%;
          transform: scale(10);
          opacity: 0;
          transition: transform 0.5s, opacity 1s;
        }
        .ripple-bg:active::after {
          transform: scale(0);
          opacity: 1;
          transition: 0s;
        }
      `}} />
    </Section>
  );
}
