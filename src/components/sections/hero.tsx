// src/components/sections/hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function Hero() {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[length:20px_20px] dark:bg-grid-slate-400/[0.05] dark:bg-[length:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <motion.div
        className="container text-center relative z-10"
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-headline tracking-tighter"
        >
          <Balancer>
            Prabhat Kumar
            <span className="text-primary">,</span> Software Alchemist
          </Balancer>
        </motion.div>
        
        <motion.p
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="mt-6 max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-muted-foreground"
        >
          <Balancer>
            {siteConfig.description} I blend the art of code with the science of AI to build innovative, high-performance software solutions.
          </Balancer>
        </motion.p>
        
        <motion.div
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto" data-cursor-hover>
            <Link href="#projects">
              View My Work <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto" data-cursor-hover>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Download CV <FileText className="ml-2" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-foreground/50 rounded-full flex justify-center p-1">
          <motion.div 
            className="w-1 h-2 bg-primary rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
        </div>
      </div>
    </section>
  );
}
