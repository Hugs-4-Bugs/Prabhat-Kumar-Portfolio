// src/components/header.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Menu, X, Github, Linkedin, Instagram, Search } from "lucide-react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { QuantumAIIcon } from "./QuantumAIIcon";

interface HeaderProps {
  onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  const { scrollYProgress } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);


  useEffect(() => {
    const sections = siteConfig.navLinks
      .map((link) => {
        if (link.href.startsWith("http")) return null;
        return document.getElementById(link.href.substring(1));
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
      >
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {siteConfig.navLinks.map((link) => {
              const isExternal = link.href.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-primary relative"
                    data-cursor-hover
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-primary relative",
                    activeSection === link.href.substring(1) ? "text-primary" : ""
                  )}
                  data-cursor-hover
                >
                  {link.label}
                  {activeSection === link.href.substring(1) && (
                    <motion.span
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                      layoutId="underline"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-2">
             <div className="hidden md:flex items-center space-x-1">
               <Button variant="ghost" size="icon" onClick={onSearchClick} aria-label="AI Search" data-cursor-hover>
                  <QuantumAIIcon />
               </Button>
               <Button variant="ghost" size="icon" asChild>
                 <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
               </Button>
               <Button variant="ghost" size="icon" asChild>
                 <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="Github"><Github size={18} /></a>
               </Button>
               <Button variant="ghost" size="icon" asChild>
                 <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
               </Button>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg font-medium">
            {siteConfig.navLinks.map((link) => {
              const isExternal = link.href.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t w-1/2 my-4"></div>
            <Button variant="ghost" onClick={() => { onSearchClick(); setIsMobileMenuOpen(false); }} className="text-lg">
                <QuantumAIIcon /> <span className="ml-2">AI Search</span>
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
