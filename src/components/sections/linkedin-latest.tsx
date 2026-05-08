"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/section-wrapper";

type LinkedInPost = {
  id: string;
  text: string;
  date: string;
  url: string;
};

const linkedInProfile = "https://www.linkedin.com/in/prabhat-kumar-6963661a4/";

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function LinkedInLatestSection() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/linkedin-posts.json");

        if (!response.ok) {
          throw new Error("LinkedIn posts are temporarily unavailable.");
        }

        const data: LinkedInPost[] = await response.json();
        const latestPosts = data
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        if (isMounted) setPosts(latestPosts);
      } catch (caughtError) {
        if (!isMounted) return;
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load LinkedIn posts.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Section id="linkedin-latest" className="pt-0">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-3 py-1 text-sm font-medium text-[#0A66C2]">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            📢 Latest LinkedIn Posts
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Technical notes, project breakdowns, and engineering lessons from Prabhat.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          visible: { transition: { staggerChildren: 0.14 } },
          hidden: {},
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <LinkedInPostSkeleton key={index} />)
          : posts.map((post) => <LinkedInPostCard key={post.id} post={post} />)}
      </motion.div>

      <div className="mt-8 rounded-lg border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-5">
        <a
          href={linkedInProfile}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-medium text-[#0A66C2] hover:underline"
        >
          Follow on LinkedIn for weekly technical breakdowns
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}

function LinkedInPostSkeleton() {
  return (
    <Card className="border-border bg-card/60">
      <CardHeader>
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 animate-pulse rounded bg-muted" />
        <div className="h-4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

function LinkedInPostCard({ post }: { post: LinkedInPost }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="flex h-full flex-col border-border bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#0A66C2]/40 hover:shadow-lg hover:shadow-[#0A66C2]/10">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>{formatPostDate(post.date)}</span>
            <span className="inline-flex items-center gap-1 text-[#0A66C2]">
              <Linkedin className="h-4 w-4" />
              Posted on LinkedIn
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-3 text-base leading-7 text-foreground">
            {post.text}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-3">
          <Button asChild variant="outline" className="border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/10">
            <a href={post.url} target="_blank" rel="noreferrer">
              View on LinkedIn
            </a>
          </Button>
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#0A66C2]"
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
