"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * LiquidButton — reusable CTA button with:
 * - Liquid ripple from click point
 * - Hover: scale 1.03 + glow shadow (using hsl primary colour)
 * - Smooth cubic-bezier transition
 */
export function LiquidButton({
  children,
  className,
  onClick,
  href,
  target,
  rel,
  ...props
}: LiquidButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const triggerRipple = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e);
    if (onClick) onClick(e);
  };

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    triggerRipple(e);
  };

  const commonClass = cn(
    // Layout
    "relative overflow-hidden inline-flex items-center justify-center cursor-pointer",
    // Transition — smooth cubic-bezier
    "transition-all duration-300 ease-&lsqb;cubic-bezier(0.25,1,0.5,1)&rsqb;",
    // Hover state: subtle scale + primary glow
    "hover:scale-[1.03]",
    "hover:shadow-[0_0_24px_4px_hsl(var(--primary)/0.35)]",
    // Active
    "active:scale-[0.98]",
    className
  );

  const rippleNodes = ripples.map((ripple) => (
    <span
      key={ripple.id}
      className="absolute rounded-full bg-white/30 pointer-events-none animate-liquid-ripple"
      style={{
        left: ripple.x,
        top: ripple.y,
        transform: "translate(-50%, -50%)",
      }}
    />
  ));

  const isExternal = href && (href.startsWith("http") || href.startsWith("//"));

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target={target}
          rel={rel ?? "noreferrer"}
          className={commonClass}
          onClick={handleAnchorClick}
        >
          {children}
          {rippleNodes}
          <RippleStyle />
        </a>
      );
    }
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={commonClass}
        onClick={handleAnchorClick as any}
      >
        {children}
        {rippleNodes}
        <RippleStyle />
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={commonClass}
      onClick={handleClick}
      {...props}
    >
      {children}
      {rippleNodes}
      <RippleStyle />
    </button>
  );
}

function RippleStyle() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes liquid-ripple {
          0%   { width: 0px; height: 0px; opacity: 0.8; }
          100% { width: 600px; height: 600px; opacity: 0; }
        }
        .animate-liquid-ripple {
          animation: liquid-ripple 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `
    }} />
  );
}
