// src/lib/types.ts
import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type TimelineEvent = {
  date: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
};

export type Education = {
    date: string;
    title: string;
    company: string;
    description: string;
    tags: string[];
}

export type Project = {
  title: string;
  description: string;
  link: string;
  tags: string[];
  image: string;
};

export type ProjectFilter = {
    label: string;
    value: string;
}

export type SkillCategory = {
  category: string;
  icon: LucideIcon;
  skills: string[];
};

export type TechTool = {
  name: string;
  description: string;
};

export type TechCategory = {
  category: string;
  tools: TechTool[];
};
