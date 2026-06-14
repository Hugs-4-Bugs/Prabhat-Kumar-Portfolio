import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from "lucide-react";

const tiers = [
  {
    name: "Consulting",
    price: "Project-based",
    description: "For founders and teams who need architecture clarity before building.",
    features: ["Architecture review", "System design document", "Trade-off analysis", "Implementation roadmap", "Risk and scale review"],
  },
  {
    name: "Product Setup",
    price: "Fixed scope",
    description: "For teams who want a product, automation workflow, or AI system implemented end to end.",
    features: ["Full implementation plan", "Backend and frontend delivery", "API integrations", "Deployment guidance", "Production handoff"],
  },
  {
    name: "Retainer",
    price: "Monthly",
    description: "For ongoing architecture, optimization, product iteration, and production hardening.",
    features: ["Weekly architecture support", "Performance optimization", "Cloud cost review", "Feature delivery", "Monitoring and reliability"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="fixed left-0 right-0 top-16 z-40 border-b bg-background/85 px-4 py-2 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-muted hover:text-foreground">
              <Home size={13} /> Home
            </Link>
            <span>/</span>
            <span className="px-3 font-semibold text-foreground">Pricing</span>
          </div>
          <Link href="/#pricing-preview" className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-semibold text-foreground hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>

      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Pricing</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Clear engagement models for serious product and architecture work.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Exact pricing depends on scope, timeline, integrations, and production requirements.
            These tiers remove ambiguity and help route the right conversation.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className="rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold">{tier.name}</h2>
              <p className="mt-3 text-3xl font-bold text-primary">{tier.price}</p>
              <p className="mt-4 leading-7 text-muted-foreground">{tier.description}</p>
              <div className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/#contact" className="mt-8 inline-flex min-h-11 items-center font-semibold text-primary">
                Discuss {tier.name} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
