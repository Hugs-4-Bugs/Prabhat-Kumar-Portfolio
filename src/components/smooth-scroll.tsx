// src/components/smooth-scroll.tsx
"use client";
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    lenis.current = lenisInstance;

    lenisInstance.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    
    gsap.ticker.add((time)=>{
      lenisInstance.raf(time * 1000)
    });
    
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenis.current = null;
    };
  }, []);

  return <>{children}</>;
}
