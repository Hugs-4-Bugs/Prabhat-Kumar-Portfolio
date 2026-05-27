import Link from "next/link";
import { ArrowRight, BrainCircuit, Cloud, Code2, LineChart, LockKeyhole, Network, RadioTower, ShieldCheck } from "lucide-react";

const pages = [
  {
    title: "Trading Bot Architecture",
    href: "/trading-bot-architecture",
    icon: LineChart,
    description: "AI trading system architecture for NIFTY, BANK NIFTY, commodities, and crypto.",
  },
  {
    title: "AI Sales Outreach Platform",
    href: "/ai-sales-outreach-platform",
    icon: RadioTower,
    description: "Lead discovery, AI personalization, campaign automation, and reply classification.",
  },
  {
    title: "AWS CodeGuard AI",
    href: "/aws-codeguard-ai",
    icon: Cloud,
    description: "Real-time AWS Terraform cost detection inside VS Code.",
  },
  {
    title: "Spring Boot JWT Guide",
    href: "/spring-boot-jwt-authentication-guide",
    icon: LockKeyhole,
    description: "Spring Security 6 JWT filters, roles, refresh tokens, and Postman testing.",
  },
  {
    title: "Java Microservices",
    href: "/java-microservices-project",
    icon: Network,
    description: "Spring Cloud architecture with Eureka, Gateway, Config Server, Kafka, and CI/CD.",
  },
  {
    title: "AI Observability",
    href: "/ai-observability-platform",
    icon: BrainCircuit,
    description: "Kafka event architecture for AI monitoring, anomalies, dashboards, and alerts.",
  },
  {
    title: "System Design Interview",
    href: "/system-design-interview",
    icon: Code2,
    description: "Production patterns for rate limits, caching, sharding, and real-world systems.",
  },
  {
    title: "Spring Security 403 Fix",
    href: "/spring-security-403-fix",
    icon: ShieldCheck,
    description: "Debug JWT, CORS, CSRF, role prefixes, and filter chain issues.",
  },
];

export function SeoPageLinks() {
  return (
    <section id="seo-pages" className="py-16 sm:py-20">
      <div className="container">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Engineering Deep Dives
          </p>
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Prabhat&apos;s technical architecture pages
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Open practical breakdowns of AI systems, Java backend architecture,
            cloud tooling, and Spring Security debugging.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => {
            const Icon = page.icon;

            return (
              <Link
                key={page.href}
                href={page.href}
                className="group rounded-lg border border-border bg-card/50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/40 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  {page.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {page.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
