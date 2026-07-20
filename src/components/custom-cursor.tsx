// src/components/custom-cursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

const LENS_SIZE_DEFAULT = 40;
const LENS_SIZE_HOVER = 85;
const DOT_SIZE = 4;

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Motion values bypass React state so position updates never trigger re-renders
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 2000, damping: 80, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 2000, damping: 80, mass: 0.1 });

  useEffect(() => {
    setIsClient(true);

    const moveCursor = (e: MouseEvent) => {
      rawX.set(e.clientX - LENS_SIZE_HOVER / 2);
      rawY.set(e.clientY - LENS_SIZE_HOVER / 2);
    };

    const checkHoverTarget = (target: HTMLElement | null) =>
      target?.closest('a, button, input, textarea, select, [data-cursor-hover]');

    const handleMouseOver = (e: MouseEvent) => {
      if (checkHoverTarget(e.target as HTMLElement)) setIsHovering(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (
        checkHoverTarget(e.target as HTMLElement) &&
        !checkHoverTarget(e.relatedTarget as HTMLElement)
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isClient) return null;

  const lensVariants = {
    default: { height: LENS_SIZE_DEFAULT, width: LENS_SIZE_DEFAULT, opacity: 0.8, filter: "blur(0px) brightness(1) contrast(1)" },
    hover:   { height: LENS_SIZE_HOVER,   width: LENS_SIZE_HOVER,   opacity: 1,   filter: "blur(3px) brightness(2) contrast(1.5) saturate(1.5)" },
  };

  const liquidTransition = { type: "spring", stiffness: 70, damping: 15, mass: 1.8 };

  return (
    <motion.div
      className={cn(
        "hidden lg:block fixed top-0 left-0 z-[9998] pointer-events-none rounded-full",
        "border-2 border-foreground/50 bg-background/20",
        "backdrop-filter backdrop-blur-sm mix-blend-difference"
      )}
      style={{ x, y, width: LENS_SIZE_DEFAULT, height: LENS_SIZE_DEFAULT }}
      variants={lensVariants}
      animate={isHovering ? "hover" : "default"}
      transition={{
        height: liquidTransition,
        width: liquidTransition,
        opacity: liquidTransition,
        filter: liquidTransition,
      }}
    >
      <motion.div
        className="absolute inset-0 m-auto rounded-full bg-foreground"
        variants={{ default: { scale: 0.5, opacity: 1 }, hover: { scale: 0, opacity: 0 } }}
        animate={isHovering ? "hover" : "default"}
        transition={liquidTransition}
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
      />
    </motion.div>
  );
}
