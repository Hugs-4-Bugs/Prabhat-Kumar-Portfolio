// src/components/timeline.tsx
"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { TimelineEvent } from "@/lib/types";

interface TimelineProps {
  events: TimelineEvent[];
  icon: LucideIcon;
}

export function Timeline({ events, icon: Icon }: TimelineProps) {
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"></div>
      {events.map((event, i) => (
        <motion.div
          key={i}
          className="relative flex items-start gap-6 md:gap-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
        >
          <div className="hidden md:flex flex-col items-center w-1/2 text-right pr-12">
            <p className="font-semibold text-primary">{event.date}</p>
          </div>
          
          <div className="relative z-10 w-12 h-12 rounded-full bg-secondary border-4 border-background flex-shrink-0 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-grow pb-12 md:w-1/2 md:pl-12 md:text-left">
            <p className="font-semibold text-primary mb-1 md:hidden">{event.date}</p>
            <h3 className="font-headline text-xl font-bold">{event.title}</h3>
            <p className="text-muted-foreground font-medium">{event.company}</p>
            {event.description && <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
