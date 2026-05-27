// src/components/smooth-scroll.tsx
"use client";
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return <>{children}</>;
}
