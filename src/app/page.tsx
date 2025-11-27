
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ModalProvider, useModal } from '@/context/ModalContext';

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { TechStack } from "@/components/sections/tech-stack";
import { Blogs } from "@/components/sections/blogs";
import { PaidModal } from "@/components/blog/PaidModal";


gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { isModalOpen, closeModal } = useModal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      sections.forEach((section, i) => {
        if (section.id === 'home') return;

        gsap.fromTo(section, 
          { opacity: 0, y: 50 }, 
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef}>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Projects />
        <Skills />
        <TechStack />
        <Blogs />
        <Education />
        <Contact />
        <PaidModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default function Home() {
  return (
    <ModalProvider>
      <AppContent />
    </ModalProvider>
  )
}
