
// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { blogData } from '@/lib/blogs';
import type { Blog } from '@/lib/types';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AISection } from '@/components/blog/AISection';
import { Button } from '@/components/ui/button';

// Helper function to get reading time
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export async function generateStaticParams() {
  return blogData.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = blogData.find((p) => p.slug === params.slug);

  if (!blog) {
    notFound();
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="bg-background text-foreground min-h-screen">
       <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="mb-8">
            <Button variant="ghost" asChild>
                <Link href="/#blogs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blogs
                </Link>
            </Button>
        </div>
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <main className="lg:col-span-8">
                 <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border mb-4 ${
                    blog.tag === 'Paid'
                        ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-500 dark:text-yellow-300'
                        : 'bg-green-500/10 border-green-400/30 text-green-500 dark:text-green-300'
                }`}
                >
                {blog.tag}
                </span>

                <h1 className="font-headline text-3xl md:text-5xl text-foreground break-words mb-4">
                    {blog.title}
                </h1>
                
                <div className="flex items-center flex-wrap space-x-4 text-muted-foreground mt-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>

                 <div className="prose dark:prose-invert prose-lg max-w-none text-foreground 
                                        prose-headings:text-primary prose-headings:font-headline
                                        prose-h2:text-3xl prose-h3:text-2xl
                                        prose-a:text-primary hover:prose-a:text-primary/80 transition-colors
                                        prose-strong:text-foreground
                                        prose-em:text-primary/90
                                        prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                                        prose-ul:list-disc prose-ul:marker:text-primary
                                        prose-ol:list-decimal prose-ol:marker:text-primary
                                        prose-code:bg-secondary prose-code:p-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-primary
                                        prose-pre:bg-secondary/80 prose-pre:p-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-border"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </main>

            {/* Sidebar with AI Tools */}
            <aside className="lg:col-span-4 lg:sticky top-24 h-fit">
                <AISection content={blog.content} />
            </aside>
        </div>
       </div>
    </div>
  );
}
