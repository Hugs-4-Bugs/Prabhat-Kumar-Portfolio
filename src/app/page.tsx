

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { TechStack } from "@/components/sections/tech-stack";
import { BlogsPage } from "@/components/sections/blogs";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isBlogPage, setIsBlogPage] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setIsBlogPage(window.location.hash === "#blogs");
    };

    checkHash(); // Check on initial load
    window.addEventListener('hashchange', checkHash, false);

    return () => {
      window.removeEventListener('hashchange', checkHash, false);
    };
  }, []);

  useEffect(() => {
    if (isBlogPage) return; // Don't run animations on blog page view

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      sections.forEach((section, i) => {
        // Skip the hero section for the fade-in-up animation
        if (section.id === 'home' || section.id === 'blogs') return;

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
              toggleActions: "play none none reverse", // Use reverse on scroll back up
            }
          }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, [isBlogPage]);

  if (isBlogPage) {
    return <BlogsPage />;
  }
  
  return (
    <div ref={mainRef}>
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Skills />
      {/* The BlogsPage component will be rendered by the logic above */}
      <TechStack />
      <Education />
      <Contact />
    </div>
  );
}
