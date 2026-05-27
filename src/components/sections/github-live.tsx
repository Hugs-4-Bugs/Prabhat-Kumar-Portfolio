"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, GitFork, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/section-wrapper";
import { getBrowserStorage } from "@/lib/browser-storage";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
};

type GitHubUser = {
  public_repos: number;
  followers: number;
  following: number;
};

const username = "Hugs-4-Bugs";
const languageColors: Record<string, string> = {
  Java: "#b07219",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
};

function formatRelativeTime(value: string) {
  const updatedAt = new Date(value).getTime();
  const diffMs = Date.now() - updatedAt;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

// 5-minute stale time (ms)
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_KEY = `gh_data_${username}`;
function getCachedGitHubData() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = getBrowserStorage()?.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data;
  } catch {}
  return null;
}

function setCachedGitHubData(data: { topRepos: GitHubRepo[]; allRepos: GitHubRepo[]; user: GitHubUser }) {
  if (typeof window === 'undefined') return;
  try {
    getBrowserStorage()?.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export function GitHubLiveSection() {
  const [topRepos, setTopRepos] = useState<GitHubRepo[]>([]);
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      // --- Check cache first ---
      const cached = getCachedGitHubData();
      if (cached) {
        setTopRepos(cached.topRepos);
        setAllRepos(cached.allRepos);
        setUser(cached.user);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [topReposResponse, allReposResponse, userResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5&type=public`),
          fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100&type=public`),
          fetch(`https://api.github.com/users/${username}`),
        ]);

        if (!topReposResponse.ok || !allReposResponse.ok || !userResponse.ok) {
          throw new Error("GitHub is temporarily unavailable.");
        }

        const [topReposData, allReposData, userData] = await Promise.all([
          topReposResponse.json(),
          allReposResponse.json(),
          userResponse.json(),
        ]);

        if (!isMounted) return;

        setTopRepos(topReposData);
        setAllRepos(allReposData);
        setUser(userData);

        // Persist to cache
        setCachedGitHubData({ topRepos: topReposData, allRepos: allReposData, user: userData });
      } catch (caughtError) {
        if (!isMounted) return;
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load GitHub activity.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadGitHubData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalStars = useMemo(
    () => allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    [allRepos]
  );

  return (
    <Section id="github-live" className="bg-background">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            ⚡ Live GitHub Activity
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Real-time public repository data pulled from GitHub for Hugs-4-Bugs.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
            <Github className="mr-2 h-4 w-4" />
            GitHub Profile
          </a>
        </Button>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Public repos", user?.public_repos ?? "-"],
          ["Total stars", isLoading ? "-" : totalStars],
          ["Followers", user?.followers ?? "-"],
          ["Following", user?.following ?? "-"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error} Please try again later or open the GitHub profile directly.
        </div>
      )}

      <motion.div
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
          hidden: {},
        }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => <GitHubRepoSkeleton key={index} />)
          : topRepos.map((repo) => <GitHubRepoCard key={repo.id} repo={repo} />)}
      </motion.div>
    </Section>
  );
}

function GitHubRepoSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-2 border-border bg-card/60">
      <CardHeader>
        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-6 w-24 animate-pulse rounded-full bg-muted" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

function GitHubRepoCard({ repo }: { repo: GitHubRepo }) {
  const languageColor = repo.language ? languageColors[repo.language] ?? "#94a3b8" : "#94a3b8";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, rotateX: -8 },
        visible: { opacity: 1, y: 0, rotateX: 0 },
      }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="group h-full"
      style={{ perspective: "1200px" }}
    >
      <Card className="relative flex h-full flex-col overflow-hidden border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/90 text-slate-100 shadow-xl transition-all duration-500 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20 group-hover:[transform:perspective(1200px)_rotateX(3deg)_rotateY(2deg)_translateY(-0.5rem)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text">
            {repo.name}
          </CardTitle>
          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-300">
            {repo.description || "Public repository from Hugs-4-Bugs."}
          </p>
        </CardHeader>

        <CardContent className="relative z-10 flex-grow">
          <Badge className="border border-white/10 bg-white/10 text-slate-100">
            <span
              className="mr-2 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            {repo.language || "Code"}
          </Badge>

          <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
            <Stat icon={<Star className="h-4 w-4" />} value={repo.stargazers_count} label="Stars" />
            <Stat icon={<GitFork className="h-4 w-4" />} value={repo.forks_count} label="Forks" />
            <Stat icon={<Eye className="h-4 w-4" />} value={repo.open_issues_count} label="Issues" />
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Updated {formatRelativeTime(repo.updated_at)}
          </p>
        </CardContent>

        <CardFooter className="relative z-10">
          <Button asChild className="w-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:text-white">
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              View on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-2">
      <div className="flex items-center gap-1 text-cyan-200">
        {icon}
        <span className="font-semibold">{value}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
