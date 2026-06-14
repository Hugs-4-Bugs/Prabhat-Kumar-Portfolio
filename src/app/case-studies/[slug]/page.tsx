import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from "lucide-react";

import { caseStudies } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((item) => item.slug === params.slug);
  if (!study) notFound();

  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="fixed left-0 right-0 top-16 z-40 border-b bg-background/85 px-4 py-2 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-muted hover:text-foreground">
              <Home size={13} /> Home
            </Link>
            <span>/</span>
            <Link href="/case-studies" className="px-3 hover:text-foreground">Case Studies</Link>
          </div>
          <Link href="/case-studies" className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-semibold text-foreground hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>

      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">{study.product}</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{study.title}</h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold text-primary">{study.metric}</p>
          <p className="mt-2 text-sm text-muted-foreground">Timeline: {study.timeline}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6 lg:grid-cols-3">
          {[
            ["Situation", study.situation],
            ["Action", study.action],
            ["Result", study.result],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>

        <div className="container mt-8">
          <div className="rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold">Metrics</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {study.metrics.map((metric) => (
                <div key={metric} className="flex gap-3 rounded-xl border bg-background/70 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-semibold text-muted-foreground">{metric}</span>
                </div>
              ))}
            </div>
            <Link href="/#contact" className="mt-8 inline-flex min-h-11 items-center font-semibold text-primary">
              Discuss a Similar Problem <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
