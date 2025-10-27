// src/components/sections/education.tsx
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { GraduationCap } from "lucide-react";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading>My Educational Journey</SectionHeading>
      <Timeline events={siteConfig.education} icon={GraduationCap} />
    </Section>
  );
}
