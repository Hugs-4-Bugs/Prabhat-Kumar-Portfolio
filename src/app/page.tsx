
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ModalProvider, useModal } from '@/context/ModalContext';

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { ContractBanner } from "@/components/sections/contract-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { CTABar } from "@/components/sections/cta-bar";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { CurrentlyBuilding } from "@/components/sections/currently-building";
import { GitHubLiveSection } from "@/components/sections/github-live";
import { LinkedInLatestSection } from "@/components/sections/linkedin-latest";
import { Projects } from "@/components/sections/projects";
import { SeoPageLinks } from "@/components/sections/seo-page-links";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { TechStack } from "@/components/sections/tech-stack";
import { PaidModal } from "@/components/blog/PaidModal";
import { ErrorBoundary } from "@/components/error-boundary";


gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { isModalOpen, closeModal } = useModal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      sections.forEach((section) => {
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

      // Section headings: fade up + Y translate on enter
      gsap.utils.toArray<HTMLElement>('.section-heading').forEach((heading) => {
        gsap.fromTo(heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            }
          }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef}>
      {/* Hero has its own full animations — no ErrorBoundary needed */}
      <Hero />

      <ErrorBoundary sectionName="CurrentlyBuilding">
        <CurrentlyBuilding />
      </ErrorBoundary>

      <ErrorBoundary sectionName="SeoPageLinks">
        <SeoPageLinks />
      </ErrorBoundary>

      <ErrorBoundary sectionName="About">
        <About />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Services">
        <Services />
      </ErrorBoundary>

      <ErrorBoundary sectionName="ContractBanner">
        <ContractBanner />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Experience">
        <Experience />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Testimonials">
        <Testimonials />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Projects">
        <Projects />
      </ErrorBoundary>

      <ErrorBoundary sectionName="GitHubLiveSection">
        <GitHubLiveSection />
      </ErrorBoundary>

      <ErrorBoundary sectionName="LinkedInLatestSection">
        <LinkedInLatestSection />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Skills">
        <Skills />
      </ErrorBoundary>

      <ErrorBoundary sectionName="TechStack">
        <TechStack />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Education">
        <Education />
      </ErrorBoundary>

      <ErrorBoundary sectionName="CTABar">
        <CTABar />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Contact">
        <Contact />
      </ErrorBoundary>

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
