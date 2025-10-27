// src/components/sections/skills.tsx
"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export function Skills() {
  const { skills } = siteConfig;

  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
      }
    }),
  }

  return (
    <Section id="skills">
      <SectionHeading>Skills & Expertise</SectionHeading>
      <Tabs defaultValue={skills[0].category} className="w-full">
        <div className="flex justify-center">
            <TabsList className="grid w-full max-w-4xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            {skills.map((category) => (
                <TabsTrigger key={category.category} value={category.category} className="text-xs sm:text-sm" data-cursor-hover>
                    <category.icon className="mr-2 h-4 w-4 hidden sm:inline-block" />
                    {category.category}
                </TabsTrigger>
            ))}
            </TabsList>
        </div>
        {skills.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <Card className="mt-6 border-dashed">
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.skills.map((skill, index) => (
                            <motion.div 
                                key={skill}
                                variants={fadeInAnimation}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                custom={index}
                                className="bg-secondary/50 p-3 rounded-md text-center text-sm font-medium"
                                data-cursor-hover
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
