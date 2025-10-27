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
    lenis.current = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.current?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  return <>{children}</>;
}
