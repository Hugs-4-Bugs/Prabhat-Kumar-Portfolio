// src/components/smooth-scroll.tsx
"use client";
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (lenis.current) {
      lenis.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    // Attach the instance to the window object so other components can access it.
    (window as any).lenisInstance = lenisInstance;

    lenis.current = lenisInstance;

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenis.current = null;
      delete (window as any).lenisInstance;
    };
  }, []);

  return <>{children}</>;
}

    