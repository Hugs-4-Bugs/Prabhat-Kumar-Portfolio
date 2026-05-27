// src/app/acquisitionos/page.tsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  Zap,
  Users,
  Brain,
  CreditCard,
  BarChart3,
  Target,
  Shield,
  Layers,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Animated Pipeline Flow
   ────────────────────────────────────────────────────────────── */
const pipelineSteps = [
  { label: "Traffic", icon: TrendingUp, color: "#3b82f6", desc: "Multi-channel traffic acquisition" },
  { label: "Lead Engine", icon: Target, color: "#6366f1", desc: "Intelligent lead capture & scoring" },
  { label: "AI Qualification", icon: Brain, color: "#8b5cf6", desc: "ML-powered lead qualification" },
  { label: "CRM", icon: Users, color: "#a855f7", desc: "Unified customer relationship mgmt" },
  { label: "Billing", icon: CreditCard, color: "#ec4899", desc: "Automated billing & invoicing" },
  { label: "Analytics", icon: BarChart3, color: "#f43f5e", desc: "Real-time business intelligence" },
  { label: "Revenue", icon: Zap, color: "#10b981", desc: "Revenue optimization engine" },
];

function PipelineFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 max-w-sm mx-auto">
      {pipelineSteps.map((step, i) => {
        const isActive = i === activeStep;
        const isPast = i < activeStep;
        return (
          <div key={step.label} className="w-full">
            <motion.div
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-500"
              animate={{
                scale: isActive ? 1.05 : 1,
                background: isActive
                  ? `rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.12)`
                  : "rgba(255,255,255,0.02)",
              }}
              style={{
                border: `1px solid ${isActive ? step.color + "40" : "rgba(255,255,255,0.05)"}`,
                boxShadow: isActive ? `0 0 30px ${step.color}15` : "none",
              }}
              onClick={() => setActiveStep(i)}
            >
              {/* Glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: `radial-gradient(circle at 20% 50%, ${step.color}10, transparent 70%)`,
                  }}
                />
              )}

              <div
                className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: `${step.color}${isActive ? "25" : "10"}`,
                  border: `1px solid ${step.color}${isActive ? "50" : "20"}`,
                }}
              >
                <step.icon size={18} style={{ color: step.color }} />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-sm font-semibold text-white/85">{step.label}</p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[10px] text-white/40 mt-0.5"
                  >
                    {step.desc}
                  </motion.p>
                )}
              </div>
              {isPast && <CheckCircle size={16} className="text-emerald-400/50 relative z-10" />}
            </motion.div>

            {/* Arrow */}
            {i < pipelineSteps.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown
                  size={16}
                  className="transition-colors duration-300"
                  style={{ color: isPast || isActive ? step.color + "60" : "rgba(255,255,255,0.1)" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Modules Grid
   ────────────────────────────────────────────────────────────── */
const modules = [
  { name: "Lead Engine", icon: Target, color: "#6366f1", desc: "Capture leads from multiple channels with intelligent forms, landing pages, and API integrations." },
  { name: "AI Qualification", icon: Brain, color: "#8b5cf6", desc: "ML models score and qualify leads in real-time, eliminating manual review bottlenecks." },
  { name: "CRM Suite", icon: Users, color: "#06b6d4", desc: "Full lifecycle customer management with pipeline tracking, notes, and activity logging." },
  { name: "Billing Engine", icon: CreditCard, color: "#ec4899", desc: "Automated invoicing, payment processing, and subscription management built-in." },
  { name: "Credits System", icon: Zap, color: "#f59e0b", desc: "Flexible credit-based usage model with real-time balance tracking and auto-refill." },
  { name: "Analytics Hub", icon: BarChart3, color: "#10b981", desc: "Real-time dashboards for revenue, conversion funnels, cohort analysis, and forecasting." },
  { name: "Revenue Intelligence", icon: TrendingUp, color: "#f43f5e", desc: "AI-driven revenue optimization with churn prediction and upsell recommendations." },
  { name: "Security", icon: Shield, color: "#3b82f6", desc: "Enterprise-grade security with JWT, RBAC, encryption at rest and in transit." },
];

function ModuleCard({ mod, index }: { mod: typeof modules[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl overflow-hidden p-6 cursor-default group"
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${isHovered ? mod.color + "30" : "rgba(255,255,255,0.05)"}`,
        transform: isHovered
          ? `perspective(600px) rotateX(${(mousePos.y - 0.5) * -6}deg) rotateY(${(mousePos.x - 0.5) * 6}deg)`
          : "none",
        transition: "transform 0.3s ease, border 0.3s ease",
      }}
    >
      {/* Mouse light */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${mod.color}12, transparent 60%)`,
          }}
        />
      )}

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${mod.color}15`,
          border: `1px solid ${mod.color}25`,
        }}
      >
        <mod.icon size={22} style={{ color: mod.color }} />
      </div>
      <h3 className="text-sm font-bold text-white/85 mb-2">{mod.name}</h3>
      <p className="text-xs text-white/45 leading-relaxed">{mod.desc}</p>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Problems Section
   ────────────────────────────────────────────────────────────── */
const problems = [
  { title: "Lead Fragmentation", desc: "Leads scattered across multiple platforms, spreadsheets, and inboxes with no unified view." },
  { title: "CRM Separation", desc: "Customer data siloed in disconnected systems, creating blind spots in the sales pipeline." },
  { title: "Billing Isolation", desc: "Payment and billing managed separately, causing revenue leakage and reconciliation nightmares." },
  { title: "No AI Intelligence", desc: "Manual qualification, no predictive analytics, zero automation in the acquisition funnel." },
];

/* ──────────────────────────────────────────────────────────────
   Background Canvas
   ────────────────────────────────────────────────────────────── */
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Animated grid
      const gridSize = 60;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating dots at intersections
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dist = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2)
          );
          const pulse = Math.sin(time * 2 + dist * 0.003) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1 + pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${0.05 + pulse * 0.08})`;
          ctx.fill();
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function AcquisitionOSPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GridBackground />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                style={{
                  background: "rgba(99, 102, 241, 0.08)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">Building</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline mb-4"
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                  }}
                >
                  AcquisitionOS
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-white/50 mb-6 leading-relaxed"
              >
                AI Powered Acquisition Intelligence Platform
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-white/35 mb-8 max-w-md leading-relaxed"
              >
                Unifying lead generation, qualification, CRM, billing, and revenue analytics into one intelligent platform. End-to-end acquisition, powered by AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <a
                  href="https://preview-chat-ab88c1b0-d6fd-4199-b9d5-ec3a018502fc.space-z.ai/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:gap-3"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 0 25px rgba(99, 102, 241, 0.25)",
                  }}
                >
                  Live Preview
                  <ExternalLink size={14} />
                </a>
                <a
                  href="#modules"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white/80 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  View Modules
                  <ChevronRight size={14} />
                </a>
              </motion.div>
            </div>

            {/* Right: Pipeline */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <PipelineFlow />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              The Problem
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Modern acquisition stacks are fragmented, manual, and disconnected.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl group"
                style={{
                  background: "rgba(239, 68, 68, 0.03)",
                  border: "1px solid rgba(239, 68, 68, 0.08)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-300/80 mb-1">{problem.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{problem.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              System Architecture
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              A unified, event-driven architecture that connects every stage of the acquisition funnel.
            </p>
          </motion.div>

          {/* Architecture diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl p-8 sm:p-12"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Input Layer */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider mb-3">Input Layer</h4>
                {["Web Forms", "API Integrations", "Landing Pages", "Social Channels"].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded-lg text-xs text-white/60"
                    style={{ background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.1)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Processing Layer */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-purple-400/80 uppercase tracking-wider mb-3">Processing Layer</h4>
                {["AI Lead Scoring", "Smart Routing", "Auto Qualification", "Pipeline Mgmt"].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded-lg text-xs text-white/60"
                    style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.1)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Output Layer */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mb-3">Output Layer</h4>
                {["Revenue Dashboard", "Billing Automation", "Analytics Reports", "Growth Insights"].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded-lg text-xs text-white/60"
                    style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.1)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Flow indicators */}
            <div className="hidden sm:flex justify-center gap-8 mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <div className="w-3 h-0.5 bg-blue-500/40" /> Input
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <div className="w-3 h-0.5 bg-purple-500/40" /> Process
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/30">
                <div className="w-3 h-0.5 bg-emerald-500/40" /> Output
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MODULES ─────────────────────────────────────────── */}
      <section id="modules" className="relative py-20 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Core Modules
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Eight integrated modules that cover the entire acquisition lifecycle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod, i) => (
              <ModuleCard key={mod.name} mod={mod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ─────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Roadmap
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent" />

            {[
              { phase: "Phase 1", title: "Core Platform", items: ["Lead Engine", "CRM", "Basic Analytics"], status: "done" },
              { phase: "Phase 2", title: "AI Layer", items: ["AI Qualification", "Smart Scoring", "Predictive Models"], status: "current" },
              { phase: "Phase 3", title: "Revenue Suite", items: ["Billing Engine", "Credits System", "Revenue Intelligence"], status: "upcoming" },
              { phase: "Phase 4", title: "Scale", items: ["Multi-tenant", "API Marketplace", "White-label"], status: "upcoming" },
            ].map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative pl-16 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div
                  className="absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: phase.status === "done" ? "#10b981" : phase.status === "current" ? "#6366f1" : "rgba(255,255,255,0.15)",
                    background: phase.status === "done" ? "rgba(16,185,129,0.15)" : phase.status === "current" ? "rgba(99,102,241,0.15)" : "transparent",
                  }}
                >
                  {phase.status === "done" && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                  {phase.status === "current" && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                </div>

                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      color: phase.status === "done" ? "#10b981" : phase.status === "current" ? "#6366f1" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {phase.phase}{phase.status === "current" ? " — In Progress" : ""}
                  </span>
                  <h3 className="text-lg font-bold text-white/80 mt-1 mb-2">{phase.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {phase.items.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] px-2.5 py-1 rounded-full text-white/50"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-4">
              Ready to transform acquisition?
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
              AcquisitionOS is currently in active development. Get early access or discuss partnerships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://preview-chat-ab88c1b0-d6fd-4199-b9d5-ec3a018502fc.space-z.ai/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:gap-3"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 25px rgba(99, 102, 241, 0.25)",
                }}
              >
                Try Live Preview
                <ExternalLink size={14} />
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white/80 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Contact
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
