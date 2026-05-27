// src/app/problem-solving/page.tsx
"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal, Code2, ShieldAlert, Cpu } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Background
   ────────────────────────────────────────────────────────────── */
function TerminalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      ctx.fillStyle = "rgba(16, 185, 129, 0.03)";
      ctx.font = "14px monospace";
      
      const cols = Math.floor(canvas.width / 20);
      const rows = Math.floor(canvas.height / 20);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() > 0.98) {
            const char = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
            ctx.fillText(char, i * 20, j * 20);
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
}

export default function ProblemSolvingPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      <TerminalBackground />
      
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
            border: "1px solid rgba(16,185,129,0.3)",
            boxShadow: "0 0 50px rgba(16,185,129,0.2)",
          }}
        >
          <Terminal size={32} className="text-emerald-400" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold font-headline mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, #a7f3d0 100%)" }}
        >
          Problem Solving
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/50 mb-10 max-w-xl mx-auto"
        >
          An analytical deep-dive into complex engineering challenges, algorithm optimization, and competitive programming.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: Code2, label: "Algorithms", color: "#10b981" },
            { icon: Cpu, label: "Optimization", color: "#3b82f6" },
            { icon: ShieldAlert, label: "Debugging", color: "#ec4899" },
          ].map((item, i) => (
            <div 
              key={i}
              className="p-4 rounded-xl flex flex-col items-center gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <item.icon size={24} style={{ color: item.color }} />
              <span className="text-sm font-medium text-white/70">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
           <span className="inline-block px-4 py-2 rounded-full text-xs font-mono text-emerald-400/80 bg-emerald-400/10 border border-emerald-400/20 mb-8">
             System upgrading. Environment preparing...
           </span>
           <br/>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Ecosystem
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
