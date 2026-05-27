import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from "lucide-react";

const problems = [
  {
    id: "lead-to-revenue",
    title: "Lead-to-Revenue Disconnect",
    before: "Leads, replies, qualification notes, and follow-ups live in separate tools, causing revenue intent to leak between handoffs.",
    after: "AcquisitionOS connects signal capture, qualification, follow-up, and account context into one operating loop.",
    metric: "40% faster lead processing, 3x automation efficiency, and 500+ leads processed daily.",
    href: "/acquisitionos",
  },
  {
    id: "system-design",
    title: "Engineers Can't Design Systems for Scale",
    before: "Architecture starts as vague boxes and becomes expensive once teams hit scale, reliability, or ownership problems.",
    after: "SystemFoundry guides trade-offs, modules, diagrams, data flows, failure modes, and execution plans before code is locked in.",
    metric: "20+ architectures designed, 35% query optimization patterns, and clearer design reviews.",
    href: "/systemfoundry",
  },
  {
    id: "aws-costs",
    title: "AWS Bills Skyrocket Without Warning",
    before: "Teams often discover expensive Terraform resources only after deployment and billing surprises.",
    after: "CodeGuard AI flags AWS cost risks inside VS Code while infrastructure code is still being written.",
    metric: "AWS 10K AIdeas semi-finalist, 45% AWS cost reduction case, and 1000+ user target.",
    href: "https://marketplace.visualstudio.com/items?itemName=prabhatKumar.codeguard-ai",
  },
  {
    id: "production-scale",
    title: "Production Systems Fail at Scale",
    before: "Monoliths crash, databases slow down, and DevOps remains manual until outages force redesign.",
    after: "Spring Boot microservices, async processing, cloud automation, observability, and CI/CD harden systems for growth.",
    metric: "99.9% uptime targets, 10,000+ concurrent-user architecture, and 35% performance improvement focus.",
    href: "/architecture-lab",
  },
];

export default function ProblemsSolvedPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="fixed left-0 right-0 top-16 z-40 border-b bg-background/85 px-4 py-2 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 hover:bg-muted hover:text-foreground">
              <Home size={13} /> Home
            </Link>
            <span>/</span>
            <span className="px-3 font-semibold text-foreground">Problems Solved</span>
          </div>
          <Link href="/#problems-solve" className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-semibold text-foreground hover:bg-muted">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>

      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Problems Solved</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Operational problems turned into practical systems.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            A gallery of business and engineering problems mapped to the products,
            architectures, and workflows I build.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6 lg:grid-cols-2">
          {problems.map((problem) => {
            const external = problem.href.startsWith("http");
            const cta = (
              <>
                View Solution <ArrowRight className="ml-2 h-4 w-4" />
              </>
            );
            return (
              <article key={problem.id} id={problem.id} className="scroll-mt-32 rounded-2xl border bg-card/70 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold">{problem.title}</h2>
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border bg-background/70 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                    <p className="text-sm leading-6 text-muted-foreground">{problem.before}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">After</p>
                    <p className="text-sm leading-6 text-muted-foreground">{problem.after}</p>
                  </div>
                </div>
                <p className="mt-5 rounded-xl bg-muted/40 p-4 text-sm font-semibold text-foreground">Impact: {problem.metric}</p>
                {external ? (
                  <a href={problem.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary">
                    {cta}
                  </a>
                ) : (
                  <Link href={problem.href} className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary">
                    {cta}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
