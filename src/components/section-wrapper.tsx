// src/components/section-wrapper.tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-16 md:py-24 overflow-hidden", className)}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
}
