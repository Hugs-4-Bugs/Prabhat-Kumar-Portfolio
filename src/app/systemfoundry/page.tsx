// src/app/systemfoundry/page.tsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ExternalLink,
  Workflow,
  FileJson,
  Brain,
  Network,
  Box,
  Layers,
  Cpu,
  Activity,
  ChevronRight,
  Play,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Architecture Node Background
   ────────────────────────────────────────────────────────────── */
function NodeFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }

    let nodes: Node[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.04 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(time * 3 + n.x * 0.01) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.15 * pulse})`;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * pulse + 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * pulse})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    init();
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
   AI Architecture Flow
   ────────────────────────────────────────────────────────────── */
const flowSteps = [
  { label: "Prompt", icon: Play, color: "#8b5cf6", desc: "Describe what you want to architect" },
  { label: "AI Reasoning", icon: Brain, color: "#6366f1", desc: "AI analyzes and reasons about structure" },
  { label: "Architecture", icon: Network, color: "#06b6d4", desc: "Generates complete system architecture" },
  { label: "JSON Export", icon: FileJson, color: "#10b981", desc: "Export as structured JSON for integration" },
];

function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % flowSteps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 justify-center">
      {flowSteps.map((step, i) => {
        const isActive = i === activeStep;
        return (
          <div key={step.label} className="flex items-center gap-2 sm:gap-0">
            <motion.div
              className="relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer min-w-[100px]"
              animate={{
                scale: isActive ? 1.08 : 1,
                background: isActive
                  ? `rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.1)`
                  : "rgba(255,255,255,0.02)",
              }}
              style={{
                border: `1px solid ${isActive ? step.color + "40" : "rgba(255,255,255,0.05)"}`,
                boxShadow: isActive ? `0 0 25px ${step.color}15` : "none",
                transition: "border 0.3s, box-shadow 0.3s",
              }}
              onClick={() => setActiveStep(i)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `${step.color}${isActive ? "20" : "10"}`,
                  border: `1px solid ${step.color}${isActive ? "40" : "15"}`,
                }}
              >
                <step.icon size={18} style={{ color: step.color }} />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-white/70">{step.label}</span>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[8px] text-white/35 text-center"
                >
                  {step.desc}
                </motion.span>
              )}
            </motion.div>

            {/* Arrow between steps */}
            {i < flowSteps.length - 1 && (
              <div className="hidden sm:block px-2">
                <ChevronRight
                  size={16}
                  className="transition-colors"
                  style={{ color: i <= activeStep ? step.color + "60" : "rgba(255,255,255,0.1)" }}
                />
              </div>
            )}
            {i < flowSteps.length - 1 && (
              <div className="block sm:hidden">
                <ArrowDown
                  size={16}
                  className="transition-colors"
                  style={{ color: i <= activeStep ? step.color + "60" : "rgba(255,255,255,0.1)" }}
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
   Interactive Architecture Examples
   ────────────────────────────────────────────────────────────── */
const architectureExamples = [
  {
    name: "YouTube",
    desc: "Video streaming architecture with CDN, transcoding pipeline, and recommendation engine.",
    components: ["CDN", "Transcoding", "Search", "Recommendations", "Storage", "Analytics"],
    color: "#ef4444",
  },
  {
    name: "Uber",
    desc: "Ride-hailing microservices with real-time matching, pricing, and geolocation services.",
    components: ["Matching", "Pricing", "Maps", "Payments", "Notifications", "Surge"],
    color: "#000000",
  },
  {
    name: "Netflix",
    desc: "Content delivery system with adaptive streaming, personalization, and A/B testing.",
    components: ["Streaming", "Personalization", "A/B Testing", "Content Mgmt", "Billing"],
    color: "#e50914",
  },
  {
    name: "Observability",
    desc: "Full-stack observability platform with metrics, logs, traces, and alerting.",
    components: ["Metrics", "Logs", "Traces", "Alerting", "Dashboards", "SLO Tracking"],
    color: "#f59e0b",
  },
  {
    name: "Kafka",
    desc: "Event streaming architecture with producers, consumers, partitions, and connectors.",
    components: ["Producers", "Consumers", "Partitions", "Connectors", "Schema Registry"],
    color: "#231f20",
  },
  {
    name: "AI Systems",
    desc: "ML pipeline with data preprocessing, model training, inference, and monitoring.",
    components: ["ETL", "Feature Store", "Training", "Inference", "Monitoring", "Model Registry"],
    color: "#8b5cf6",
  },
];

function ExampleCard({ example, index }: { example: typeof architectureExamples[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const displayColor = example.color === "#000000" || example.color === "#231f20" ? "#6b7280" : example.color;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onClick={() => setIsExpanded(!isExpanded)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${isExpanded ? displayColor + "30" : "rgba(255,255,255,0.05)"}`,
        transition: "border 0.3s ease",
      }}
    >
      {/* Mouse light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${displayColor}10, transparent 60%)`,
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `${displayColor}12`,
                border: `1px solid ${displayColor}20`,
              }}
            >
              <Workflow size={18} style={{ color: displayColor }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/85">{example.name}</h3>
              <span className="text-[9px] text-white/30 uppercase tracking-wider">Architecture</span>
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
            <ChevronRight size={16} className="text-white/20" />
          </motion.div>
        </div>

        <p className="text-xs text-white/40 leading-relaxed mb-3">{example.desc}</p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5"
            >
              {example.components.map((comp) => (
                <span
                  key={comp}
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    color: displayColor,
                    background: `${displayColor}10`,
                    border: `1px solid ${displayColor}18`,
                  }}
                >
                  {comp}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Capabilities
   ────────────────────────────────────────────────────────────── */
const capabilities = [
  { icon: Network, title: "Architecture Simulation", desc: "Simulate and visualize complex system architectures before writing code.", color: "#6366f1" },
  { icon: Brain, title: "Design Generation", desc: "AI generates architecture designs from natural language descriptions.", color: "#8b5cf6" },
  { icon: FileJson, title: "JSON Export", desc: "Export architectures as structured JSON for integration with other tools.", color: "#10b981" },
  { icon: Box, title: "System Mapping", desc: "Map entire systems with components, connections, and data flows.", color: "#06b6d4" },
  { icon: Layers, title: "Component Modeling", desc: "Model individual components with interfaces, dependencies, and contracts.", color: "#f59e0b" },
  { icon: Activity, title: "Performance Analysis", desc: "Analyze bottlenecks and optimize architecture for performance.", color: "#f43f5e" },
];

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function SystemFoundryPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NodeFieldCanvas />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
            style={{
              background: "rgba(139, 92, 246, 0.08)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-headline mb-4"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 40%, #06b6d4 100%)",
              }}
            >
              SystemFoundry
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-white/50 mb-4"
          >
            AI Architecture Thinking Platform
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/35 mb-10 max-w-xl mx-auto"
          >
            Engineers code. Few think in systems. SystemFoundry bridges the gap — turning prompts into complete, exportable system architectures.
          </motion.p>

          {/* Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <ArchitectureFlow />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4"
          >
            <a
              href="https://systemfoundry.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:gap-3"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 0 25px rgba(139, 92, 246, 0.25)",
              }}
            >
              Try SystemFoundry
              <ExternalLink size={14} />
            </a>
            <a
              href="#examples"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white/80 transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              See Examples
              <ArrowDown size={14} />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CAPABILITIES ────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Capabilities
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Everything you need to think, design, and export at the systems level.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform duration-300"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: `${cap.color}12`,
                    border: `1px solid ${cap.color}20`,
                  }}
                >
                  <cap.icon size={20} style={{ color: cap.color }} />
                </div>
                <h3 className="text-sm font-bold text-white/85 mb-2">{cap.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE EXAMPLES ────────────────────────────── */}
      <section id="examples" className="relative py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Architecture Examples
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Click to explore real-world architectures generated by SystemFoundry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureExamples.map((example, i) => (
              <ExampleCard key={example.name} example={example} index={i} />
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
              Start thinking in systems
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
              SystemFoundry is live and free to use. Transform your engineering approach today.
            </p>
            <a
              href="https://systemfoundry.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:gap-3"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 0 25px rgba(139, 92, 246, 0.25)",
              }}
            >
              Launch SystemFoundry
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
