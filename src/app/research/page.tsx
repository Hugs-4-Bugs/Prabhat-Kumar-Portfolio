import { getAllResearchPapers } from '@/lib/research';
import { ResearchList } from '@/components/research/ResearchList';

export const metadata = {
  title: "Research & Articles | Prabhat Kumar",
  description: "Research papers, reports, and technical articles by Prabhat Kumar.",
};

export default function ResearchPage() {
  const papers = getAllResearchPapers();
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <ResearchList initialPapers={papers} />
    </main>
  );
}
