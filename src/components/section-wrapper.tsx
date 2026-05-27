// src/components/section-wrapper.tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string;
  className?: string;
  children: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(({ id, className, children, ...props }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative py-16 md:py-24 overflow-hidden", className)}
      {...props}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
});

Section.displayName = "Section";
