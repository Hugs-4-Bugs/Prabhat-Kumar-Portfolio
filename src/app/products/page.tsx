// src/app/products/page.tsx
"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Zap, Box, Brain, FlaskConical, Rocket } from "lucide-react";
import { products, statusConfig } from "@/lib/products-data";
import type { Product, ProductStatus } from "@/lib/products-data";

/* ──────────────────────────────────────────────────────────────
   Particle Background (Canvas-based, GPU-friendly)
   ────────────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];

    const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `, ${p.alpha})`).replace("rgb", "rgba").replace("#", "");
        // Convert hex to rgba
        const r = parseInt(p.color.slice(1, 3), 16);
        const g = parseInt(p.color.slice(3, 5), 16);
        const b = parseInt(p.color.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   Product Card with glassmorphism & hover effects
   ────────────────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: Product; index: number }) {
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

  const status = statusConfig[product.status];

  const actionLabel = useMemo(() => {
    switch (product.status) {
      case "live": return "View Product";
      case "building": return product.link ? "Preview" : "In Progress";
      case "research": return "Open Research";
      case "coming-soon": return "Coming Soon";
    }
  }, [product.status, product.link]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 0.5) * -8}deg) rotateY(${(mousePos.x - 0.5) * 8}deg) scale(1.02)`
          : "perspective(800px) rotateX(0) rotateY(0) scale(1)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isHovered ? product.color + "40" : "rgba(255,255,255,0.06)"}`,
          transition: "border 0.3s ease",
        }}
      />

      {/* Mouse-reactive light */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${product.color}15, transparent 60%)`,
          }}
        />
      )}

      {/* Glow border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: isHovered
            ? `0 0 40px ${product.color}20, inset 0 0 40px ${product.color}05`
            : "none",
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full min-h-[280px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="text-3xl sm:text-4xl w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${product.color}25, ${product.color}08)`,
              border: `1px solid ${product.color}25`,
            }}
          >
            {product.icon}
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              color: status.color,
              background: status.bg,
              border: `1px solid ${status.color}25`,
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Info */}
        <h3 className="text-lg sm:text-xl font-bold text-white/90 font-headline mb-1 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">{product.type}</p>
        <p className="text-sm text-white/55 leading-relaxed flex-1 line-clamp-3 group-hover:text-white/70 transition-colors">
          {product.description}
        </p>

        {/* Modules */}
        {product.modules && isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-wrap gap-1"
          >
            {product.modules.slice(0, 5).map((mod) => (
              <span
                key={mod}
                className="text-[9px] px-2 py-0.5 rounded-full"
                style={{
                  color: product.color,
                  background: `${product.color}12`,
                  border: `1px solid ${product.color}20`,
                }}
              >
                {mod}
              </span>
            ))}
          </motion.div>
        )}

        {/* Action */}
        <div className="mt-4 pt-4 border-t border-white/5">
          {product.link ? (
            <a
              href={product.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
              style={{ color: product.color }}
            >
              {actionLabel}
              <ExternalLink size={14} />
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-2 text-sm font-medium opacity-60"
              style={{ color: product.color }}
            >
              {actionLabel}
              <ArrowRight size={14} />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Network Graph (CSS-based for performance)
   ────────────────────────────────────────────────────────────── */
function ProductNetwork() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const centerProduct = products.find((p) => p.id === "quantumfusion");
  const otherProducts = products.filter((p) => p.id !== "quantumfusion");

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square max-h-[600px]">
      {/* Center node */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        whileHover={{ scale: 1.1 }}
        onMouseEnter={() => setActiveNode("quantumfusion")}
        onMouseLeave={() => setActiveNode(null)}
      >
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: "rgba(6, 182, 212, 0.1)",
            border: "2px solid rgba(6, 182, 212, 0.3)",
            boxShadow: activeNode === "quantumfusion"
              ? "0 0 60px rgba(6, 182, 212, 0.3)"
              : "0 0 30px rgba(6, 182, 212, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span className="text-2xl sm:text-3xl">{centerProduct?.icon}</span>
          <span className="text-[8px] sm:text-[10px] text-cyan-300/80 font-medium mt-1 text-center px-2 leading-tight">
            QuantumFusion
          </span>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {otherProducts.map((product, i) => {
        const angle = (i / otherProducts.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 38; // percentage
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        const isActive = activeNode === product.id;

        return (
          <motion.div
            key={product.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.15 }}
            onMouseEnter={() => setActiveNode(product.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Connection line to center */}
            <svg
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: 1,
                height: 1,
                overflow: "visible",
              }}
            >
              <line
                x1={0}
                y1={0}
                x2={`${typeof window !== 'undefined' ? (50 - x) * window.innerWidth / 100 : 0}`}
                y2={`${typeof window !== 'undefined' ? (50 - y) * window.innerHeight / 100 : 0}`}
                stroke={isActive ? product.color : "rgba(255,255,255,0.06)"}
                strokeWidth={isActive ? 1.5 : 0.5}
                strokeDasharray={isActive ? "none" : "4 4"}
                style={{ transition: "all 0.3s ease" }}
              />
            </svg>

            <div
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                width: isActive ? "5rem" : "3.5rem",
                height: isActive ? "5rem" : "3.5rem",
                background: `rgba(${parseInt(product.color.slice(1, 3), 16)}, ${parseInt(product.color.slice(3, 5), 16)}, ${parseInt(product.color.slice(5, 7), 16)}, 0.08)`,
                border: `1.5px solid ${product.color}${isActive ? "60" : "25"}`,
                boxShadow: isActive ? `0 0 30px ${product.color}25` : "none",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-lg sm:text-xl">{product.icon}</span>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[7px] font-medium mt-0.5 text-center leading-tight px-1"
                  style={{ color: product.color }}
                >
                  {product.name.split(" ")[0]}
                </motion.span>
              )}
            </div>

            {/* Expanded info */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 p-3 rounded-xl z-30"
                  style={{
                    background: "rgba(15, 15, 25, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${product.color}30`,
                    boxShadow: `0 15px 40px rgba(0,0,0,0.5)`,
                  }}
                >
                  <p className="text-[10px] font-bold text-white/80">{product.name}</p>
                  <p className="text-[8px] text-white/40 mt-0.5">{product.type}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusConfig[product.status].color }}
                    />
                    <span className="text-[8px]" style={{ color: statusConfig[product.status].color }}>
                      {statusConfig[product.status].label}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Horizontal Carousel
   ────────────────────────────────────────────────────────────── */
function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            className="snap-center flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="p-6 h-full flex flex-col"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="text-2xl w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${product.color}15`,
                    border: `1px solid ${product.color}25`,
                  }}
                >
                  {product.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/85">{product.name}</h4>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: statusConfig[product.status].color }}
                  >
                    {statusConfig[product.status].label}
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed flex-1">{product.description}</p>
              {product.problemSolved && (
                <p className="text-[10px] text-white/30 mt-3 italic">Solves: {product.problemSolved}</p>
              )}
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: product.color }}
                >
                  Visit <ExternalLink size={11} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  const categories = [
    { icon: Zap, label: "Products", count: products.filter((p) => p.status === "live").length },
    { icon: Box, label: "Platforms", count: products.filter((p) => p.type.includes("Platform")).length },
    { icon: Brain, label: "AI Systems", count: products.filter((p) => p.type.includes("AI")).length },
    { icon: FlaskConical, label: "Research", count: products.filter((p) => p.status === "research").length },
    { icon: Rocket, label: "Building", count: products.filter((p) => p.status === "building").length },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleField />

      {/* ── SECTION 1: Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div style={{ opacity, y }} className="text-center max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-300/80 font-medium">PRODUCT ECOSYSTEM</span>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8"
          >
            {categories.map((cat, i) => (
              <div
                key={cat.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <cat.icon size={14} className="text-indigo-400/70" />
                <span className="text-white/60">{cat.label}</span>
                <span className="text-indigo-300/60 font-mono text-[10px]">{cat.count}</span>
              </div>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-headline mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #a5b4fc 40%, #818cf8 70%, #6366f1 100%)",
            }}
          >
            Product Ecosystem
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-white/40 max-w-xl mx-auto mb-10"
          >
            Building systems beyond software — platforms, AI systems, and research that push boundaries.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="#products-grid"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:gap-3"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
              }}
            >
              Explore Products
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border border-white/15 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 2: Interactive Network ──────────────────── */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Connected Ecosystem
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              All products are interconnected, sharing infrastructure, AI capabilities, and design systems.
            </p>
          </motion.div>

          <ProductNetwork />
        </div>
      </section>

      {/* ── SECTION 3: Product Carousel ─────────────────────── */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              Product Carousel
            </h2>
            <p className="text-sm text-white/40">
              Scroll through the collection — snap to explore each product in detail.
            </p>
          </motion.div>

          <ProductCarousel />
        </div>
      </section>

      {/* ── SECTION 4: Product Grid ─────────────────────────── */}
      <section id="products-grid" className="relative py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white/90 mb-3">
              All Products
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              The complete portfolio of platforms, tools, and research initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
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
              Interested in collaborating?
            </h2>
            <p className="text-sm text-white/40 mb-8">
              These are founder-level projects built from the ground up. Let&apos;s connect and build together.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:gap-3"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.2)",
              }}
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
