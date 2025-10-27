// src/components/sections/experience.tsx
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { Briefcase } from "lucide-react";

export function Experience() {
  return (
    <Section id="experience" className="bg-secondary/30">
      <SectionHeading>Work Experience</SectionHeading>
      <Timeline events={siteConfig.workExperience} icon={Briefcase} />
    </Section>
  );
}
