// src/components/custom-cursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsClient(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, [data-cursor-hover]')) {
            setIsHovering(true);
        }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, [data-cursor-hover]')) {
            setIsHovering(false);
        }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      className="hidden lg:block fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    >
      <motion.div
        className={cn(
          "absolute -top-1/2 -left-1/2 rounded-full border-2 transition-transform duration-300",
          isHovering 
            ? "border-accent bg-accent/20" 
            : "border-primary bg-primary/10"
        )}
        animate={{ 
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
        }}
        transition={springConfig}
      />
    </motion.div>
  );
}
