// src/components/sections/education.tsx
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading>My Educational Journey</SectionHeading>
      <Timeline events={siteConfig.education} iconName="GraduationCap" />
    </Section>
  );
}
