// src/hooks/use-tilt.ts
"use client";

import { useCallback, useRef } from "react";

interface TiltOptions {
  maxTilt?: number; // degrees, default 8
  perspective?: number; // px, default 1000
  scale?: number; // scale factor on hover, default 1.02
  speed?: number; // transition speed ms, default 400
}

/**
 * useTilt — lightweight 3D card tilt on mousemove.
 * Attaches mouse event handlers to the returned ref. No external library needed.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
}: TiltOptions = {}) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transition = "transform 0.1s ease-out";
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    },
    [maxTilt, perspective, scale]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
  }, [perspective, speed]);

  return { ref, onMouseMove, onMouseLeave };
}
