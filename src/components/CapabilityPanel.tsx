"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { CAPABILITY_REGISTRY } from "@/lib/capabilities";

/**
 * CapabilityTrigger
 *
 * Self-contained component that renders:
 *   1. The "+" button
 *   2. The contextual mini-menu (one item: "Capabilities")
 *   3. The Capability Panel overlay
 *
 * Drop it anywhere in the input row — it manages its own state locally
 * with zero side effects on the parent chat or AI pipeline.
 */
export function CapabilityTrigger({ onScheduleMeeting }: { onScheduleMeeting?: () => void } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Only show capabilities that are live today
  const categories = CAPABILITY_REGISTRY.map((cat) => ({
    ...cat,
    items: cat.items.filter((i) => i.status === "available"),
  })).filter((cat) => cat.items.length > 0);

  const totalCount = categories.reduce((s, c) => s + c.items.length, 0);

  // ── Close menu on outside click ──────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // ── Close panel on outside click ─────────────────────────────────────
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen]);

  // ── ESC key ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panelOpen) { setPanelOpen(false); return; }
      if (menuOpen) { setMenuOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panelOpen, menuOpen]);

  const openCapabilities = useCallback(() => {
    setMenuOpen(false);
    setPanelOpen(true);
  }, []);

  return (
    // Relative wrapper so the menu can be positioned above the trigger
    <div className="relative flex-shrink-0">

      {/* ── "+" trigger button ─────────────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open QuantumAI capabilities"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <Plus
          size={15}
          strokeWidth={2.2}
          style={{
            transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.18s ease",
          }}
        />
      </button>

      {/* ── Contextual mini-menu ───────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="QuantumAI options"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-2 z-[1020] min-w-[180px]"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              background: "linear-gradient(135deg, rgba(20,20,40,0.95), rgba(10,10,25,0.97))",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: "14px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <button
              role="menuitem"
              onClick={openCapabilities}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white rounded-t-[14px] hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
            >
              <span className="text-sm leading-none opacity-70" aria-hidden>✦</span>
              Capabilities
              <span className="ml-auto text-[10px] text-white/35 tabular-nums">
                {totalCount}
              </span>
            </button>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "0 12px" }} />
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onScheduleMeeting?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white rounded-b-[14px] hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
            >
              <span className="text-sm leading-none opacity-70" aria-hidden>📅</span>
              Schedule Meeting
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Capability Panel ───────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[1025] bg-black/35 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="QuantumAI Capability Center"
              aria-modal="true"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[1030] inset-x-3 bottom-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg max-h-[70vh] flex flex-col"
              style={{
                backdropFilter: "blur(32px) saturate(200%)",
                background:
                  "linear-gradient(160deg, rgba(16,16,36,0.97) 0%, rgba(8,8,22,0.98) 100%)",
                border: "1px solid rgba(255,255,255,0.11)",
                borderRadius: "22px",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
                <div>
                  <h2 className="text-sm font-semibold text-white/95 tracking-tight">
                    QuantumAI Capabilities
                  </h2>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    {totalCount} capabilities available today
                  </p>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close capability panel"
                  className="w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 mt-0.5"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-grow px-5 py-4 space-y-5">
                {categories.map((category) => (
                  <section
                    key={category.id}
                    aria-labelledby={`cap-${category.id}`}
                  >
                    <h3
                      id={`cap-${category.id}`}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 mb-2.5"
                    >
                      <span aria-hidden>{category.icon}</span>
                      {category.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                          style={{
                            background: "rgba(255,255,255,0.035)",
                            border: "1px solid rgba(255,255,255,0.065)",
                          }}
                        >
                          <span
                            className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/90"
                            style={{ boxShadow: "0 0 4px rgba(52,211,153,0.6)" }}
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-white/85 leading-snug">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-white/35 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/[0.07] flex-shrink-0">
                <p className="text-[9px] text-white/25 text-center leading-relaxed">
                  Capabilities shown here reflect currently available features.
                  New capabilities will appear automatically as QuantumAI evolves.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
