// src/components/sections/tech-stack.tsx
"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TechStack() {
  const { techStack } = siteConfig;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <Section id="tech-stack" className="bg-secondary/30">
      <SectionHeading>Tech Stack & Tools</SectionHeading>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {techStack.map((category, i) => (
          <motion.div
            key={category.category}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.tools.map((tool) => (
                    <li key={tool.name} className="text-sm">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-semibold cursor-help" data-cursor-hover>{tool.name}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tool.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-muted-foreground ml-2 hidden sm:inline">- {tool.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
