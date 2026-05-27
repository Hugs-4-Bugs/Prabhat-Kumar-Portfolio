"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  Compass,
  Lightbulb,
  Network,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";

const problemCards = [
  {
    title: "Lead-to-Revenue Disconnect",
    problem: "Startups lose money between lead generation and sale closure.",
    solution: "AI agentic lead discovery, qualification, outreach, and follow-up pipelines.",
    metric: "40% faster lead processing and 3x automation efficiency.",
    proof: "QuantumFusion Solutions and SaaS acquisition workflows.",
    icon: Workflow,
    href: "/problems-solved#lead-to-revenue",
  },
  {
    title: "Engineers Can't Design Systems for Scale",
    problem: "Teams build monoliths instead of thinking about growth from day one.",
    solution: "System architecture consulting, microservices mentoring, and event-driven design.",
    metric: "20+ architectures designed and 35% query optimization patterns.",
    proof: "Trading Bot, AI Observability, Spring Boot architecture work.",
    icon: Network,
    href: "/problems-solved#system-design",
  },
  {
    title: "AWS Bills Skyrocket Without Warning",
    problem: "DevOps teams do not see infrastructure costs until it is too late.",
    solution: "CodeGuard AI with real-time Terraform cost detection and FinOps workflows.",
    metric: "AWS 10K AIdeas semi-finalist and marketplace-ready developer tool.",
    proof: "Amit Sharma testimonial: saved thousands in AWS bills.",
    icon: Cloud,
    href: "/problems-solved#aws-costs",
  },
  {
    title: "Trading Without Intelligence",
    problem: "Manual trading is slow, emotional, and difficult to operate consistently.",
    solution: "24/7 automated trading system with RSI, EMA, VWAP, Bollinger Bands, and broker integration.",
    metric: "4+ years trading experience across Indian markets and crypto.",
    proof: "Live architecture with Zerodha Kite Connect integration.",
    icon: TrendingUp,
    href: "/trading-bot-architecture",
  },
  {
    title: "Production Systems Fail at Scale",
    problem: "Monoliths crash, databases slow down, and DevOps stays manual.",
    solution: "Spring Boot microservices, Kafka-style async flows, cloud automation, observability, and CI/CD.",
    metric: "99.9% uptime targets and 35% performance improvement focus.",
    proof: "Netcore Cloud experience and multiple production deployments.",
    icon: ShieldCheck,
    href: "/architecture-lab",
  },
];

const operatingProfiles: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Founder Mentality", copy: "Think about business, unit economics, product-market fit, and things people pay for.", icon: Building2 },
  { title: "Engineering Excellence", copy: "Production systems, scalability from day one, security, observability, and maintainability.", icon: Code2 },
  { title: "Problem-Solving Mindset", copy: "Start from the real problem, design around constraints, and ship useful software.", icon: Compass },
  { title: "Systems Thinking", copy: "Everything connects: frontend, backend, infrastructure, automation, and reliability.", icon: Network },
  { title: "Innovation Focus", copy: "Experiment with Claude API, Ollama, Spring AI, WebFlux, Kafka, and agentic workflows.", icon: Lightbulb },
];

const differentials = [
  "Full-stack technical depth across backend, frontend, DevOps, and product delivery.",
  "AI/ML expertise with Claude API, LLM workflows, agents, and practical automation.",
  "Financial systems knowledge from 4+ years of trading experience.",
  "Founder mentality: unit economics, ROI, product-market fit, and execution speed.",
  "Startup and enterprise mix: 6+ products shipped plus Netcore Cloud and Walmart simulation exposure.",
];

const framework = [
  ["Understand the Real Problem", "Find the root cause, not the symptom. A slow API may actually be N+1 queries or bad ORM mapping."],
  ["Design the Architecture", "Map constraints, bottlenecks, scale points, ownership, data flows, and operational risks."],
  ["Engineer for Production", "Build resilience, monitoring, logging, graceful failures, circuit breakers, and async reliability."],
  ["Optimize & Iterate", "Measure, analyze, improve, and keep feedback loops tight. 35% optimization is a normal target."],
  ["Document & Transfer", "Leave architecture docs, runbooks, and maintainable systems so future changes are easy."],
];

const research = [
  "Spring AI Framework for LLM integration in Java microservices",
  "Claude API for multi-agent orchestration and autonomous workflows",
  "Kafka for real-time observability and event-driven monitoring",
  "WebFlux and reactive programming for non-blocking systems",
  "Ollama for local LLM inference and privacy-first AI",
];

export function StrategicProblems() {
  return (
    <Section id="problems-solve" className="bg-muted/20">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Real Problems I Solve</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Problem-first engineering with measurable outcomes.</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {problemCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/10"
            >
              <Icon className="mb-5 h-9 w-9 text-primary" />
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.problem}</p>
              <div className="my-5 h-px bg-border" />
              <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">My solution:</span> {card.solution}</p>
              <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm font-semibold text-primary">{card.metric}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Proven with: {card.proof}</p>
              <Link href={card.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary">
                View Solution <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

export function OperatingProfile() {
  return (
    <Section id="operating-profile" className="border-t bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">My Operating Profile</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What drives my work.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            I work with startups who want to scale intelligently, teams who need system redesign,
            technical co-founders building products, and companies automating operational bottlenecks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {operatingProfiles.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="rounded-2xl border bg-card/70 p-5 shadow-md backdrop-blur-sm">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function WhyDifferent() {
  return (
    <Section id="why-different" className="bg-muted/20">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why I'm Different</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Not just a developer. A technical founder who understands business.
        </h2>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          You get someone who thinks like a founder but executes like a principal engineer:
          systems that scale, solve real problems, and prove impact beyond the codebase.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {differentials.map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border bg-background/60 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm leading-6 text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ProblemSolvingFramework() {
  return (
    <Section id="problem-solving-framework">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">My Problem-Solving Framework</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Systems that scale, perform, and survive.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {framework.map(([title, copy], index) => (
          <div key={title} className="rounded-2xl border bg-card/70 p-5 shadow-md backdrop-blur-sm">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="text-base font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function InnovationResearch() {
  return (
    <Section id="innovation-research" className="bg-muted/20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Innovation & Research</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Beyond shipping products, I keep researching what is next.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Recognition includes AWS 10,000 AIdeas semi-finalist for CodeGuard AI, technical writing on
            system design and Spring Boot patterns, and continued open-source work in the Java ecosystem.
          </p>
        </div>
        <div className="space-y-3">
          {research.map((item) => (
            <div key={item} className="flex gap-3 rounded-xl border bg-card/70 p-4 shadow-sm">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm leading-6 text-muted-foreground">{item}</span>
            </div>
          ))}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-primary">
            Continuous learning: always exploring, always iterating, always shipping.
          </div>
        </div>
      </div>
    </Section>
  );
}
