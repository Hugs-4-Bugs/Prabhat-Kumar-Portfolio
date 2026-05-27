// src/components/products/ProductsLauncher.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Grid3X3, X, Search, ExternalLink } from "lucide-react";
import { products, statusConfig } from "@/lib/products-data";
import { useTheme } from "next-themes";
import type { Product } from "@/lib/products-data";

interface ProductsLauncherProps {
  className?: string;
}

function ProductTile({ product, index, onClose, isDark }: { product: Product; index: number; onClose: () => void; isDark: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tileRef.current.style.setProperty("--mouse-x", `${x}px`);
    tileRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const status = statusConfig[product.status];

  const content = (
    <motion.div
      ref={tileRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClose}
      className="product-tile group relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300"
      style={{
        background: isHovered 
          ? `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${product.color}35, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'})`
          : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'),
        opacity: isHovered ? 0.88 : 0.82,
        border: `1px solid ${isHovered ? product.color + (isDark ? '60' : '40') : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')}`,
        boxShadow: isHovered ? `0 0 40px ${product.color}25, inset 0 0 30px ${product.color}15` : 'none',
      }}
    >
      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${product.color}15, transparent 60%)`,
          }}
        />
      )}

      {/* Icon */}
      <div
        className="relative z-10 text-2xl sm:text-3xl w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${product.color}20, ${product.color}08)`,
          border: `1px solid ${product.color}30`,
        }}
      >
        {product.icon}
      </div>

      {/* Name */}
      <span className="relative z-10 text-[10px] sm:text-xs font-medium text-center leading-tight text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
        {product.name}
      </span>

      {/* Status pill */}
      <span
        className="relative z-10 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{
          color: status.color,
          background: status.bg,
          border: `1px solid ${status.color}30`,
        }}
      >
        {status.label}
      </span>

      {/* External link indicator */}
      {product.link && (
        <ExternalLink
          size={10}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: product.color }}
        />
      )}
    </motion.div>
  );

  if (product.link) {
    return (
      <a href={product.link} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link href="/products" className="block">
      {content}
    </Link>
  );
}

export function ProductsLauncher({ className }: ProductsLauncherProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className || ''}`}>
      {/* Trigger Button - Google Apps Grid Icon */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors duration-200"
        aria-label="Products"
        data-cursor-hover
      >
        <Grid3X3
          size={18}
          className={`transition-all duration-300 ${isOpen ? 'text-primary rotate-90 scale-90' : 'text-foreground/70 hover:text-foreground'}`}
        />
        {/* Ping indicator */}
        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{
              opacity: 0,
              scale: 0.92,
              y: -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: -10,
            }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="products-launcher-panel fixed md:absolute left-0 right-0 bottom-0 md:left-auto md:right-0 md:bottom-auto md:top-full md:mt-2 z-[999] w-full md:w-[420px] max-h-[85vh] md:max-h-[520px] rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: isDark 
                ? 'linear-gradient(145deg, rgba(12, 12, 18, 0.95), rgba(6, 6, 10, 0.98))' 
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(252, 252, 254, 0.98))',
              backdropFilter: 'blur(40px) saturate(180%) brightness(0.95)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(0.95)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.15)' 
                : '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: isDark 
                ? '0 50px 100px rgba(0, 0, 0, 0.9), inset 0 1px 2px rgba(255,255,255,0.25), inset 0 25px 50px rgba(255,255,255,0.04), inset 0 -25px 40px rgba(0,0,0,0.3)' 
                : '0 50px 100px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255,255,255,1), inset 0 25px 50px rgba(255,255,255,0.5), inset 0 -25px 40px rgba(0,0,0,0.05)',
              isolation: 'isolate',
            }}
          >
            {/* Handle bar for mobile */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className={`w-10 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-black/20"}`} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div>
                <h3 className={`text-sm font-semibold font-headline ${isDark ? "text-white/90" : "text-slate-900"}`}>Products</h3>
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>Ecosystem by Prabhat Kumar</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
              >
                <X size={14} className={isDark ? "text-white/50" : "text-slate-400"} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div className="relative">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-all ${isDark ? "bg-white/5 border-white/8 text-white/80 placeholder:text-white/25 focus:border-indigo-500/40 focus:bg-white/8" : "bg-black/5 border-black/10 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500/40 focus:bg-white"}`}
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className={`flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin ${isDark ? "scrollbar-thumb-white/10" : "scrollbar-thumb-black/10"}`}>
              <div className="grid grid-cols-3 gap-2">
                {filteredProducts.map((product, i) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    index={i}
                    onClose={() => setIsOpen(false)}
                    isDark={isDark}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-8 ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  <Search size={24} className="mb-2" />
                  <span className="text-xs">No products found</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-5 py-3 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-2 w-full py-2 text-xs font-medium rounded-lg transition-all ${isDark ? "text-indigo-400 hover:text-indigo-300 hover:bg-white/5" : "text-indigo-600 hover:text-indigo-700 hover:bg-black/5"}`}
              >
                View All Products
                <ExternalLink size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
