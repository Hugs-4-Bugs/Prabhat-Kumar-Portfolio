// src/components/footer.tsx
"use client";
import { siteConfig } from "@/lib/data";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-headline font-semibold">Prabhat Kumar</h3>
            <p className="text-muted-foreground text-sm">Software Alchemist & Innovator</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {siteConfig.allSocials.map((social) => (
              <Button key={social.name} variant="ghost" size="icon" asChild>
                <a href={social.url} target="_blank" rel="noreferrer" aria-label={social.name}>
                  <social.icon size={18} />
                </a>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={scrollToTop} aria-label="Scroll to top">
                <ArrowUp size={18} />
            </Button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prabhat Kumar. All Rights Reserved.</p>
          <p className="mt-1">Built with Next.js, Tailwind CSS, and a touch of AI magic ✨</p>
        </div>
      </div>
    </footer>
  );
}
