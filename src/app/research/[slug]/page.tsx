import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Home, Download, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

import { getAllResearchPapers, getResearchPaperBySlug } from "@/lib/research";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  const papers = getAllResearchPapers();
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const paper = getResearchPaperBySlug(params.slug);
  if (!paper) return {};

  return {
    title: `${paper.title} | prabhat.online`,
    description: paper.description,
    openGraph: {
      title: paper.title,
      description: paper.description,
      images: paper.coverImage ? [paper.coverImage] : [],
      type: "article",
    },
  };
}

export default function ResearchDetailPage({ params }: { params: { slug: string } }) {
  const paper = getResearchPaperBySlug(params.slug);
  if (!paper) notFound();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": paper.type === "research-paper" ? "ScholarlyArticle" : "Article",
    "headline": paper.title,
    "description": paper.description,
    "author": {
      "@type": "Person",
      "name": "Prabhat Kumar",
      "url": "https://prabhatkr.vercel.app/#about" // fallback url
    },
    "datePublished": paper.publishedDate,
    "image": paper.coverImage ? [paper.coverImage] : []
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Top Nav Breadcrumbs */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-white/10 bg-background/85 px-4 py-3 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link href="/#home" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 hover:bg-white/5 hover:text-foreground transition-colors">
              <Home size={15} /> Home
            </Link>
            <span>/</span>
            <Link href="/research" className="px-3 min-h-[44px] flex items-center hover:text-foreground transition-colors">
              Research
            </Link>
          </div>
          <Link href="/research" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-4 font-semibold text-foreground hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-5xl">
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 mb-4 px-3 py-1">
            {paper.type === "research-paper" ? "Research Paper" : paper.type.charAt(0).toUpperCase() + paper.type.slice(1)}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-slate-400 bg-clip-text text-transparent mb-6 leading-tight">
            {paper.title}
          </h1>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Link href="/#about" className="hover:text-cyan-400 font-semibold underline underline-offset-4 decoration-cyan-400/30 transition-colors">
                By Prabhat Kumar
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{paper.publishedDate ? format(new Date(paper.publishedDate), 'MMMM d, yyyy') : "Unknown"}</span>
              </div>
              
              {paper.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{paper.venue}</span>
                </div>
              )}
              
              {paper.readingTimeMinutes && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{paper.readingTimeMinutes} min read</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
            {paper.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted/80 text-muted-foreground border-border">
                {tag}
              </Badge>
            ))}
          </div>

          {paper.description && (
            <div className="bg-card/50 border border-border rounded-2xl p-6 mb-8 text-left max-w-4xl">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {paper.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button asChild className="min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-foreground gap-2">
              <a href={paper.pdfPath} download>
                <Download size={18} />
                Download PDF
              </a>
            </Button>
            {paper.externalLink && (
              <Button asChild variant="outline" className="min-h-[44px] border-border bg-card hover:bg-muted text-foreground gap-2">
                <a href={paper.externalLink} target="_blank" rel="noopener noreferrer">
                  View External
                  <ExternalLink size={18} />
                </a>
              </Button>
            )}
            {paper.venue && !paper.externalLink && (
              <Button variant="outline" className="min-h-[44px] border-border bg-card text-foreground gap-2 pointer-events-none opacity-80">
                View on {paper.venue}
              </Button>
            )}
          </div>
        </header>

        {paper.content && (
          <div className="prose prose-invert max-w-none my-12 bg-card border border-border p-8 rounded-3xl shadow-xl">
            <ReactMarkdown>{paper.content}</ReactMarkdown>
          </div>
        )}

        {/* PDF Viewer */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/10">
          <div className="hidden md:block w-full h-[80vh]">
            <iframe 
              src={`${paper.pdfPath}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title={`${paper.title} PDF viewer`}
            />
          </div>
          
          <div className="md:hidden flex flex-col items-center justify-center p-12 text-center border-t border-border bg-card/50">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
              <FilePdfIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">View Document</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              PDF preview is limited on mobile devices. Please download the document to read it fully.
            </p>
            <Button asChild className="min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-foreground px-8">
              <a href={paper.pdfPath} download>
                Download PDF
              </a>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function FilePdfIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 18v-6a2 2 0 0 1 2-2h0v0a2 2 0 0 1 2 2v6" />
      <path d="M10 14h4" />
    </svg>
  );
}
