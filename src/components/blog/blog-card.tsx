
"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Blog } from '@/lib/types';

interface BlogCardProps {
  blog: Blog;
  onReadMore: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function BlogCard({ blog, onReadMore }: BlogCardProps) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarks.includes(blog.id);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full group"
    >
      <Card className="flex flex-col h-full bg-secondary/30 border-border/30 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2">{blog.title}</CardTitle>
            <Badge variant={blog.tag === 'Paid' ? 'destructive' : 'secondary'}>
              {blog.tag}
            </Badge>
          </div>
          <CardDescription className="line-clamp-3 h-[60px]">
            {blog.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex justify-between items-center">
          <Button onClick={onReadMore} data-cursor-hover>
            Read Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleBookmark(blog.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            data-cursor-hover
          >
            <Bookmark className={cn("transition-colors", isBookmarked ? "text-primary fill-primary" : "text-muted-foreground")} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
