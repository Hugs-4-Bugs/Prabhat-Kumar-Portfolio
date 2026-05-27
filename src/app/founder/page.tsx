import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Code2, Compass, Home, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: Building2,
    title: "Why QuantumFusion exists",
    copy: "To turn practical AI, backend engineering, and automation into products that reduce operational drag for real teams.",
  },
  {
    icon: Code2,
    title: "How I build",
    copy: "Start from the painful workflow, design the smallest reliable architecture, then ship with observability and iteration loops.",
  },
  {
    icon: Compass,
    title: "Where I focus",
    copy: "Acquisition intelligence, architecture thinking, cloud cost awareness, trading systems, and multi-agent company operations.",
  },
  {
    icon: Sparkles,
    title: "What I value",
    copy: "Systems that are useful, understandable, reliable, and strong enough to survive production.",
  },
];

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="fixed left-0 right-0 top-16 z-40 border-b bg-background/85 px-4 py-2 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-muted hover:text-foreground">
              <Home size={13} /> Home
            </Link>
            <span>/</span>
            <span className="px-3 font-semibold text-foreground">Founder</span>
          </div>
          <Link href="/#about" className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-semibold text-foreground hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>

      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Founder Narrative</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            I build products where AI meets operational execution.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            QuantumFusion Solutions is my vehicle for building useful systems around unclear architecture,
            scattered acquisition workflows, unreliable backend processes, and AI that needs to carry real work.
          </p>
          <Link href="/products" className="mt-8 inline-flex min-h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground">
            Explore Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-2xl border bg-card/70 p-6 shadow-lg backdrop-blur-sm">
                <Icon className="mb-5 h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{pillar.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{pillar.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
