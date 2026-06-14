import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

import { caseStudies } from "@/lib/case-studies";

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="fixed left-0 right-0 top-16 z-40 border-b bg-background/85 px-4 py-2 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-muted hover:text-foreground">
              <Home size={13} /> Home
            </Link>
            <span>/</span>
            <span className="px-3 font-semibold text-foreground">Case Studies</span>
          </div>
          <Link href="/#projects" className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-semibold text-foreground hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>

      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Case Studies</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Problem, solution, result, metrics.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Concrete examples of product and architecture work translated into measurable outcomes.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.slug} className="rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{study.product}</p>
              <h2 className="mt-3 text-2xl font-bold">{study.title}</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{study.situation}</p>
              <p className="mt-5 rounded-xl bg-primary/10 p-4 text-sm font-semibold text-primary">{study.metric}</p>
              <Link href={`/case-studies/${study.slug}`} className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary">
                Read Case Study <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
