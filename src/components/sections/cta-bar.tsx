"use client";

import { motion } from "framer-motion";
import { Github, FileText, Linkedin, PlaySquare, MessageSquare } from "lucide-react";
import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Section } from "@/components/section-wrapper";

export function CTABar() {
  return (
    <Section id="cta-bar" className="py-12 mb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl glass-card border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-2xl z-0 rounded-3xl" />
        
        <div className="relative z-10 text-center mb-10 w-full">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Ready to Work Together?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to production-grade system — I build it all.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-4 w-full">
          <Link href="https://github.com/Hugs-4-Bugs" target="_blank" className="w-full sm:w-auto">
            <LiquidButton className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-2 border-black/20 dark:border-white/20 text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 ">
              <Github size={20} /> View GitHub
            </LiquidButton>
          </Link>
          
          <Link href="https://prabhatblogs.lovable.app/" target="_blank" className="w-full sm:w-auto">
            <LiquidButton className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-2 border-black/20 dark:border-white/20 text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 ">
              <FileText size={20} /> Read Articles
            </LiquidButton>
          </Link>
          
          <Link href="https://www.linkedin.com/in/prabhat-kumar-6963661a4/" target="_blank" className="w-full sm:w-auto">
            <LiquidButton className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-2 border-black/20 dark:border-white/20 text-foreground hover:bg-blue-500/10 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 ">
              <Linkedin size={20} /> Connect on LinkedIn
            </LiquidButton>
          </Link>
          
          <Link href="#projects" className="w-full sm:w-auto">
            <LiquidButton className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-2 border-black/20 dark:border-white/20 text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 ">
              <PlaySquare size={20} /> Watch Projects
            </LiquidButton>
          </Link>
          
          <Link href="#contact" className="w-full sm:w-auto">
            <LiquidButton className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2  border-2 border-transparent">
              <MessageSquare size={20} /> Start a Project
            </LiquidButton>
          </Link>
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .ripple-btn {
          position: relative;
          overflow: hidden;
        }
        .ripple-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-circle, rgba(255,255,255,0.3) 10%, transparent 10.01%;
          transform: scale(10);
          opacity: 0;
          transition: transform 0.5s, opacity 1s;
        }
        .ripple-btn:active::after {
          transform: scale(0);
          opacity: 1;
          transition: 0s;
        }
      `}} />
    </Section>
  );
}
