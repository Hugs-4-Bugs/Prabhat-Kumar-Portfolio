import fs from 'fs';
import path from 'path';

export interface ResearchPaper {
  slug: string;
  title: string;
  type: 'research-paper' | 'article' | 'report';
  publishedDate: string;
  venue: string | null;
  tags: string[];
  pdfPath: string;
  coverImage: string | null;
  readingTimeMinutes: number;
  featured: boolean;
  description: string;
  externalLink?: string;
  content?: string;
}

export function getAllResearchPapers(): ResearchPaper[] {
  const filePath = path.join(process.cwd(), 'content', 'research', 'manifest.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading research manifest:", error);
    return [];
  }
}

export function getResearchPaperBySlug(slug: string): ResearchPaper | undefined {
  const papers = getAllResearchPapers();
  return papers.find(p => p.slug === slug);
}
