// src/app/architecture-lab/page.tsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  ExternalLink,
  ArrowRight,
  Workflow,
  ChevronRight,
  Layers,
  Network,
  Box,
  Activity,
  Brain,
  Target,
  BarChart3,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Lab Data
   ────────────────────────────────────────────────────────────── */
const labProjects = [
  {
    id: "acquisitionos",
    name: "AcquisitionOS",
    type: "AI SaaS Platform",
    description: "AI Powered Acquisition Intelligence — unifying lead gen, CRM, billing, and analytics.",
    architecture: {
      layers: ["Traffic Layer", "Lead Engine", "AI Qualification", "CRM Suite", "Billing", "Analytics"],
      tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "ML Pipeline", "Stripe"],
      pattern: "Event-Driven Microservices",
    },
    link: "https://preview-chat-ab88c1b0-d6fd-4199-b9d5-ec3a018502fc.space-z.ai/",
    route: "/acquisitionos",
    color: "#6366f1",
    icon: "🚀",
  },
  {
    id: "systemfoundry",
    name: "SystemFoundry",
    type: "Architecture Platform",
    description: "AI-powered system architecture generation and visualization platform.",
    architecture: {
      layers: ["Prompt Input", "AI Reasoning", "Architecture Graph", "JSON Export", "Visualization"],
      tech: ["React", "TypeScript", "OpenAI", "D3.js", "Zustand"],
      pattern: "Client-Server + AI Pipeline",
    },
    link: "https://systemfoundry.vercel.app/",
    route: "/systemfoundry",
    color: "#8b5cf6",
    icon: "🏗️",
  },
  {
    id: "trading-infra",
    name: "Trading Infrastructure",
    type: "FinTech System",
    description: "High-frequency trading infrastructure combining algorithmic precision with market psychology.",
    architecture: {
      layers: ["Market Data Feed", "Signal Engine", "Risk Assessment", "Order Execution", "P&L Tracking"],
      tech: ["Java", "Spring Boot", "WebSocket", "Redis", "TimescaleDB"],
      pattern: "Event-Sourcing + CQRS",
    },
    color: "#14b8a6",
    icon: "📈",
  },
  {
    id: "observability",
    name: "AI Observability",
    type: "Infrastructure",
    description: "Comprehensive observability platform for monitoring AI models in production.",
    architecture: {
      layers: ["Data Collection", "Metric Processing", "Anomaly Detection", "Alerting", "Dashboard"],
      tech: ["Go", "ClickHouse", "Grafana", "Prometheus", "OpenTelemetry"],
      pattern: "Data Pipeline + Stream Processing",
    },
    color: "#f97316",
    icon: "👁️",
  },
  {
    id: "youtube-arch",
    name: "YouTube Architecture",
    type: "System Design Study",
    description: "Deep dive into YouTube's architecture: CDN, transcoding, search, and recommendations.",
    architecture: {
      layers: ["Upload Service", "Transcoding Pipeline", "CDN Distribution", "Search Index", "Recommendation Engine"],
      tech: ["Distributed Storage", "FFmpeg", "Bigtable", "MapReduce", "ML Rankings"],
      pattern: "Distributed Monolith → Microservices",
    },
    color: "#ef4444",
    icon: "📺",
  },
  {
    id: "kafka-arch",
    name: "Kafka Event Streaming",
    type: "System Design Study",
    description: "Event streaming architecture with producers, consumers, partitions, and exactly-once semantics.",
    architecture: {
      layers: ["Producers", "Broker Cluster", "Topic Partitions", "Consumer Groups", "Connectors"],
      tech: ["ZooKeeper", "Kafka Streams", "Schema Registry", "KSQL", "Connect"],
      pattern: "Pub-Sub + Event Streaming",
    },
    color: "#6b7280",
    icon: "📡",
  },
  {
    id: "ai-systems",
    name: "AI Systems",
    type: "ML Architecture",
    description: "End-to-end ML pipeline with feature store, training, inference, and model monitoring.",
    architecture: {
      layers: ["Data Ingestion", "Feature Engineering", "Model Training", "Serving Layer", "Monitoring"],
      tech: ["Python", "MLflow", "Ray", "TensorFlow", "Kubernetes"],
      pattern: "ML Pipeline + Feature Store",
    },
    color: "#a855f7",
    icon: "🤖",
  },
];

/* ──────────────────────────────────────────────────────────────
   Background
   ────────────────────────────────────────────────────────────── */
function LabBackground() {
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
      time += 0.002;

      // Hex grid
      const size = 40;
      const h = size * Math.sqrt(3);
      for (let row = -1; row < canvas.height / h + 1; row++) {
        for (let col = -1; col < canvas.width / (size * 1.5) + 1; col++) {
          const x = col * size * 1.5;
          const y = row * h + (col % 2 ? h / 2 : 0);
          const dist = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
            Math.pow(y - canvas.height / 2, 2)
          );
          const pulse = Math.sin(time * 2 + dist * 0.002) * 0.5 + 0.5;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + (size * 0.4) * Math.cos(angle);
            const py = y + (size * 0.4) * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.02 + pulse * 0.02})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
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

/* ──────────────────────────────────────────────────────────────
   Detail Modal
   ────────────────────────────────────────────────────────────── */
function DetailModal({
  project,
  onClose,
}: {
  project: typeof labProjects[0];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{
          background: "rgba(15, 15, 25, 0.95)",
          backdropFilter: "blur(40px)",
          border: `1px solid ${project.color}25`,
          boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${project.color}10`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-20"
        >
          <X size={16} className="text-white/50" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="text-3xl w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: `${project.color}15`,
                border: `1px solid ${project.color}25`,
              }}
            >
              {project.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white/90 font-headline">{project.name}</h2>
              <span className="text-xs text-white/40 uppercase tracking-wider">{project.type}</span>
            </div>
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-6">{project.description}</p>

          {/* Architecture Details */}
          <div className="space-y-6">
            {/* Pattern */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Architecture Pattern</h4>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  color: project.color,
                  background: `${project.color}10`,
                  border: `1px solid ${project.color}18`,
                }}
              >
                <Network size={12} />
                {project.architecture.pattern}
              </div>
            </div>

            {/* Layers */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">System Layers</h4>
              <div className="space-y-2">
                {project.architecture.layers.map((layer, i) => (
                  <motion.div
                    key={layer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: `${project.color}15`,
                        color: project.color,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs text-white/60">{layer}</span>
                    {i < project.architecture.layers.length - 1 && (
                      <ArrowRight size={10} className="text-white/15 ml-auto" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.architecture.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2.5 py-1 rounded-full text-white/50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white transition-all"
                style={{
                  background: `${project.color}20`,
                  border: `1px solid ${project.color}30`,
                }}
              >
                Visit Product <ExternalLink size={12} />
              </a>
            )}
            {project.route && (
              <Link
                href={project.route}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white/80 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                Full Page <ChevronRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Gallery Card
   ────────────────────────────────────────────────────────────── */
function GalleryCard({
  project,
  index,
  onSelect,
}: {
  project: typeof labProjects[0];
  index: number;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onClick={onSelect}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 0.5) * -6}deg) rotateY(${(mousePos.x - 0.5) * 6}deg) scale(1.02)`
          : "perspective(800px) rotateX(0) rotateY(0) scale(1)",
        transition: "transform 0.3s ease",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${isHovered ? project.color + "35" : "rgba(255,255,255,0.05)"}`,
          transition: "border 0.3s",
        }}
      />

      {/* Mouse light */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${project.color}12, transparent 60%)`,
          }}
        />
      )}

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{
          boxShadow: isHovered ? `0 0 40px ${project.color}15` : "none",
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: `${project.color}15`,
              border: `1px solid ${project.color}20`,
            }}
          >
            {project.icon}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/25 px-2 py-0.5 rounded-full bg-white/3 border border-white/5">
            {project.architecture.pattern.split("+")[0].trim()}
          </span>
        </div>

        <h3 className="text-base font-bold text-white/85 font-headline mb-1 group-hover:text-white transition-colors">
          {project.name}
        </h3>
        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-3">{project.type}</p>
        <p className="text-xs text-white/45 leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors">
          {project.description}
        </p>

        {/* Mini layer preview */}
        <div className="mt-4 flex flex-wrap gap-1">
          {project.architecture.layers.slice(0, 3).map((layer) => (
            <span
              key={layer}
              className="text-[8px] px-1.5 py-0.5 rounded"
              style={{
                color: project.color + "80",
                background: `${project.color}08`,
                border: `1px solid ${project.color}12`,
              }}
            >
              {layer}
            </span>
          ))}
          {project.architecture.layers.length > 3 && (
            <span className="text-[8px] text-white/25 px-1">
              +{project.architecture.layers.length - 3}
            </span>
          )}
        </div>

        {/* Hover CTA */}
        <div className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-medium" style={{ color: project.color }}>
            View Architecture
          </span>
          <ChevronRight size={12} style={{ color: project.color }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function ArchitectureLabPage() {
  const [selectedProject, setSelectedProject] = useState<typeof labProjects[0] | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LabBackground />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <Layers size={12} className="text-purple-400/80" />
            <span className="text-[10px] text-purple-300/80 font-bold uppercase tracking-wider">Architecture Lab</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #8b5cf6 100%)",
            }}
          >
            Architecture Lab
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-white/40 max-w-xl mx-auto"
          >
            Explore the system architectures behind every product. Click any card to dive into the technical details.
          </motion.p>
        </div>
      </section>

      {/* ── GALLERY GRID ─────────────────────────────────────── */}
      <section className="relative py-8 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {labProjects.map((project, i) => (
              <GalleryCard
                key={project.id}
                project={project}
                index={i}
                onSelect={() => setSelectedProject(project)}
              />
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
            <h2 className="text-xl sm:text-3xl font-bold font-headline text-white/90 mb-4">
              Want to architect together?
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
              I use SystemFoundry to generate these architectures. Try it yourself or reach out for collaboration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://systemfoundry.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:gap-3"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                Try SystemFoundry
                <ExternalLink size={14} />
              </a>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white/80 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                All Products
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <DetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
