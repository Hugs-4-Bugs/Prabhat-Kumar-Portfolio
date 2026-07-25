"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Copy,
  Database,
  GitBranch,
  Github,
  LineChart,
  Mail,
  Network,
  PlugZap,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { submitArchitectureReviewRequest } from "@/app/actions";

type LiveMetrics = {
  tradingBot: {
    niftyPrice: string;
    niftyChange: string;
    activePositions: string;
    pnl: string;
    status: string;
  };
  codeGuard: {
    users: string;
    costsSaved: string;
    scans: string;
    status: string;
  };
  acquisitionOS: {
    leadsProcessed: string;
    conversionRate: string;
    lift: string;
    status: string;
  };
  socialProof: {
    githubStars: string;
    vscodeDownloads: string;
    linkedinConnections: string;
    emailSubscribers: string;
  };
  updatedAt: string;
};

const fallbackMetrics: LiveMetrics = {
  tradingBot: {
    niftyPrice: "22,950.00",
    niftyChange: "+0.42%",
    activePositions: "3",
    pnl: "+₹18,420",
    status: "Last known",
  },
  codeGuard: {
    users: "1,000+",
    costsSaved: "$54K/year",
    scans: "14 cost-risk patterns",
    status: "Aggregated",
  },
  acquisitionOS: {
    leadsProcessed: "500+ / day",
    conversionRate: "8%",
    lift: "4x",
    status: "Beta metric",
  },
  socialProof: {
    githubStars: "Portfolio-wide",
    vscodeDownloads: "Marketplace ready",
    linkedinConnections: "Growing network",
    emailSubscribers: "Lead magnet active",
  },
  updatedAt: new Date().toISOString(),
};

const comparisonRows = [
  ["Lead Gen", "Manual spreadsheets", "AcquisitionOS", "4x faster"],
  ["AWS Costs", "Surprise bills", "CodeGuard AI", "45% saved"],
  ["Trading", "Manual decisions", "Trading Bot", "24/7 automation"],
  ["Architecture", "Vague diagrams", "SystemFoundry", "Design clarity"],
  ["Operations", "Human handoffs", "Agent workflows", "60% lower load"],
];

const roadmapItems = [
  ["AcquisitionOS", "Launch MVP", "Q3 2026", "Lead engine, AI qualification, outreach loop"],
  ["SystemFoundry", "Beta access", "Q3 2026", "Architecture prompts, decision records, exportable diagrams"],
  ["QuantumFusion", "Funding round", "Q3 2026", "Product studio OS, client pilots, case-study pipeline"],
  ["CodeGuard AI", "Marketplace growth", "Q3 2026", "More Terraform patterns, cost dashboard, team workflows"],
];

const integrations: Array<{ name: string; copy: string; icon: LucideIcon }> = [
  { name: "Claude API", copy: "LLM workflows and agentic reasoning", icon: Bot },
  { name: "Zerodha Kite", copy: "Trading execution and market data", icon: TrendingUp },
  { name: "AWS", copy: "Cloud infrastructure, FinOps, deployment", icon: Cloud },
  { name: "Firebase", copy: "Auth, realtime apps, rapid product surfaces", icon: Database },
  { name: "Stripe", copy: "Billing, subscriptions, credits", icon: PlugZap },
  { name: "Spring Boot", copy: "Production Java APIs and microservices", icon: Code2 },
  { name: "Kafka", copy: "Event-driven monitoring and async reliability", icon: GitBranch },
  { name: "Ollama", copy: "Local LLM inference and private AI", icon: Sparkles },
];

const snippets = [
  {
    label: "Trading bot signal logic",
    language: "typescript",
    code: `const signal = indicators.rsi < 32 && price > indicators.vwap
  ? "BUY"
  : indicators.rsi > 68 && price < indicators.ema20
    ? "SELL"
    : "HOLD";

if (signal !== "HOLD" && risk.maxLossOk(position)) {
  await broker.placeOrder({ symbol, signal, quantity });
}`,
  },
  {
    label: "Spring Boot JWT filter",
    language: "java",
    code: `String token = resolveBearerToken(request);
if (token != null && jwtService.isValid(token)) {
  Authentication auth = jwtService.toAuthentication(token);
  SecurityContextHolder.getContext().setAuthentication(auth);
}
filterChain.doFilter(request, response);`,
  },
  {
    label: "Terraform cost rule",
    language: "typescript",
    code: `if (resource.type === "aws_instance" && expensiveFamilies.has(resource.instanceType)) {
  diagnostics.push({
    severity: "warning",
    message: "High-cost EC2 family detected before deployment.",
  });
}`,
  },
];

export function LiveProductDashboard() {
  const [metrics, setMetrics] = useState<LiveMetrics>(fallbackMetrics);
  const [status, setStatus] = useState("Loading live hooks");

  useEffect(() => {
    let mounted = true;
    fetch("/api/live-metrics")
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        setMetrics(data);
        setStatus("Live where public APIs are available");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("Using last-known product metrics");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    {
      title: "Trading Bot",
      icon: LineChart,
      status: metrics.tradingBot.status,
      values: [
        ["NIFTY", metrics.tradingBot.niftyPrice],
        ["Change", metrics.tradingBot.niftyChange],
        ["Positions", metrics.tradingBot.activePositions],
        ["P&L", metrics.tradingBot.pnl],
      ],
    },
    {
      title: "CodeGuard AI",
      icon: ShieldCheck,
      status: metrics.codeGuard.status,
      values: [
        ["Users", metrics.codeGuard.users],
        ["Costs saved", metrics.codeGuard.costsSaved],
        ["Rules", metrics.codeGuard.scans],
        ["Channel", "VS Code"],
      ],
    },
    {
      title: "AcquisitionOS",
      icon: BarChart3,
      status: metrics.acquisitionOS.status,
      values: [
        ["Leads", metrics.acquisitionOS.leadsProcessed],
        ["Conversion", metrics.acquisitionOS.conversionRate],
        ["Lift", metrics.acquisitionOS.lift],
        ["Mode", "Beta"],
      ],
    },
  ];

  return (
    <Section id="live-product-dashboard" className="bg-muted/20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Live Product Dashboard</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Proof that the products are operating.</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            The dashboard pulls live public market data where possible and uses labeled aggregated product metrics for private systems.
          </p>
        </div>
        <span className="rounded-full border bg-card/70 px-4 py-2 text-xs font-semibold text-muted-foreground">
          {status}
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold">{card.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.status}</p>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {card.values.map(([label, value]) => (
                  <div key={label} className="rounded-xl border bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-2 text-xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

export function ProductComparisonMatrix() {
  return (
    <Section id="product-comparison">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Product Comparison Matrix</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Old way vs. my systems.</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-4 bg-muted/70 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <span>Problem</span>
          <span>Old Way</span>
          <span>My Solution</span>
          <span>Win</span>
        </div>
        {comparisonRows.map(([problem, oldWay, solution, win]) => (
          <div key={problem} className="grid grid-cols-4 gap-3 border-t px-4 py-4 text-sm">
            <span className="font-semibold">{problem}</span>
            <span className="text-muted-foreground">{oldWay}</span>
            <span className="font-semibold text-primary">{solution}</span>
            <span className="text-muted-foreground">{win}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ArchitectureVisualization() {
  const [active, setActive] = useState(0);
  const flow = ["Lead", "Validation", "AI Email", "Response", "CRM", "Revenue"];

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % flow.length), 1800);
    return () => clearInterval(timer);
  }, [flow.length]);

  return (
    <Section id="architecture-visualization" className="bg-muted/20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Interactive Architecture</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">AcquisitionOS flow from lead to revenue.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            This visualization shows how signals move through validation, AI personalization,
            response classification, CRM updates, and revenue intelligence.
          </p>
          <Button asChild className="mt-8">
            <Link href="/acquisitionos">
              Explore AcquisitionOS <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10" />
          <div className="relative grid gap-4 sm:grid-cols-3">
            {flow.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setActive(index)}
                className={`min-h-28 rounded-xl border p-4 text-left transition-all ${
                  active === index
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                    : "bg-background/70 hover:border-primary/40"
                }`}
              >
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="font-bold">{step}</span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  {active === index ? "Active processing stage" : "Click to inspect"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ShippingRoadmap() {
  return (
    <Section id="shipping-this-quarter">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">What I'm Shipping This Quarter</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Q3 2026 roadmap.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roadmapItems.map(([product, milestone, quarter, detail]) => (
          <div key={product} className="rounded-2xl border bg-card/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{quarter}</p>
            <h3 className="mt-3 text-xl font-bold">{product}</h3>
            <p className="mt-2 font-semibold text-muted-foreground">{milestone}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function IntegrationShowcase() {
  return (
    <Section id="integration-showcase" className="bg-muted/20">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Integration Showcase</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tools and APIs I integrate with.</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {integrations.map(({ name, copy, icon: Icon }) => (
          <div key={name} className="rounded-2xl border bg-card/80 p-5 shadow-md backdrop-blur-md">
            <Icon className="mb-4 h-7 w-7 text-primary" />
            <h3 className="font-bold">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function LiveCodeSnippets() {
  const [selected, setSelected] = useState(0);
  const current = snippets[selected];

  return (
    <Section id="live-code-snippets">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Live Code Snippets</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Capability shown in code, not claims.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Representative snippets from product logic: trading decisions, JWT security filters,
            and infrastructure cost detection.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {snippets.map((snippet, index) => (
              <button
                key={snippet.label}
                onClick={() => setSelected(index)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  selected === index ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                }`}
              >
                {snippet.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-slate-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <span>{current.language}</span>
            <Copy className="h-4 w-4" />
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100">
            <code>{current.code}</code>
          </pre>
        </div>
      </div>
    </Section>
  );
}

export function CommunityProofAndLeadMagnet() {
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const proof: Array<{ label: string; copy: string; icon: LucideIcon }> = [
    { label: "GitHub", copy: "Open-source portfolio and product code", icon: Github },
    { label: "VS Code", copy: "CodeGuard AI marketplace presence", icon: Code2 },
    { label: "LinkedIn", copy: "Professional engineering network", icon: Users },
    { label: "Case Studies", copy: "Metrics-backed delivery proof", icon: BarChart3 },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const formData = new FormData(event.currentTarget);
    const result = await submitArchitectureReviewRequest(formData);

    setSubmitted(result.success);
    setStatusMessage(result.message ?? "");
    setIsSubmitting(false);
  };

  return (
    <Section id="community-proof-lead-magnet" className="bg-muted/20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Community & Social Proof</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Third-party validation plus a useful next step.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {proof.map(({ label, copy, icon: Icon }) => (
              <div key={label} className="rounded-2xl border bg-card/80 p-5 shadow-md backdrop-blur-md">
                <Icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-bold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card/90 p-6 shadow-xl backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Free lead magnet</p>
          <h3 className="mt-3 text-2xl font-bold">Get your system architecture reviewed.</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Send a short description of your product, bottleneck, or architecture. I will reply with a practical review checklist.
          </p>
          {submitted ? (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-semibold text-primary">
              {statusMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                required
                name="email"
                type="email"
                placeholder="Email"
                className="min-h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-colors focus:border-primary"
              />
              <textarea
                required
                name="description"
                placeholder="What system should I review?"
                className="min-h-28 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
              {statusMessage && (
                <p className="text-sm font-semibold text-destructive">{statusMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Mail className="mr-2 h-4 w-4" /> {isSubmitting ? "Sending..." : "Request Free Review"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

export function PricingPreview() {
  const tiers = useMemo(
    () => [
      ["Consulting", "Project-based", "Architecture review, roadmap, design docs, system trade-offs"],
      ["Product Setup", "Fixed scope", "AcquisitionOS, CodeGuard AI, automation, or SaaS implementation"],
      ["Retainer", "Monthly", "Ongoing architecture, delivery, optimization, and production hardening"],
    ],
    []
  );

  return (
    <Section id="pricing-preview">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Engagement models without ambiguity.</h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/pricing">
            View Pricing <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map(([name, price, copy]) => (
          <div key={name} className="rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="mt-3 text-2xl font-bold text-primary">{price}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
