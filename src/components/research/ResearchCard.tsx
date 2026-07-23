"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { ResearchPaper } from "@/lib/research";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ResearchCardProps {
  paper: ResearchPaper;
  index?: number;
}

const typeMap = {
  "research-paper": "Research Paper",
  "article": "Article",
  "report": "Report"
};

export function ResearchCard({ paper, index = 0 }: ResearchCardProps) {
  const [particles, setParticles] = useState<{x: string, y: string, duration: number}[]>([]);

  useEffect(() => {
    setParticles([...Array(8)].map(() => ({
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      duration: Math.random() * 5 + 3
    })));
  }, []);

  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      className="group h-full transform-style-3d"
      style={{ perspective: '1500px' }}
    >
      <div className="relative h-full">
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          variants={{
            initial: { scale: 0.8 },
            hover: { scale: 1.1 }
          }}
        />
        
        <Card className="group/card relative flex flex-col h-full overflow-hidden transition-all duration-700 border-2 border-border/50 bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-slate-900/90 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/20">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
          
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
                initial={{ x: p.x, y: p.y }}
                animate={{
                  x: [p.x, (parseFloat(p.x) + 10) % 100 + '%'],
                  y: [p.y, (parseFloat(p.y) + 10) % 100 + '%'],
                }}
                transition={{ duration: p.duration, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col h-full bg-card/60 backdrop-blur-md rounded-3xl">
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 backdrop-blur-sm">
                  {typeMap[paper.type]}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {paper.publishedDate ? format(new Date(paper.publishedDate), 'MMM d, yyyy') : ''}
                </div>
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight mt-2 line-clamp-3">
                {paper.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-grow flex flex-col p-6 pt-0">
              <ScrollArea className="h-24 pr-4 mb-4">
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {paper.description || "Click to view the full report."}
                </CardDescription>
              </ScrollArea>
              
              <motion.div className="flex flex-wrap gap-2 mt-auto" layout>
                {paper.tags.slice(0, 4).map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 + tagIndex * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge className="font-medium bg-card/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-cyan-500/20 hover:border-cyan-400/30 hover:text-cyan-300 transition-all duration-300">
                      {tag}
                    </Badge>
                  </motion.span>
                ))}
              </motion.div>
            </CardContent>
            
            <CardFooter className="p-6 pt-4 border-t border-slate-800">
              <motion.div
                className="w-full flex gap-3"
                variants={{ initial: { y: 20, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
                transition={{ delay: 0.2 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button asChild className="w-full relative overflow-hidden group/btn backdrop-blur-sm border-2 border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-white transition-all duration-300">
                    <Link href={`/research/${paper.slug}`}>
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                      <span className="relative z-10 flex items-center justify-center font-semibold">
                        <FileText className="mr-2 h-4 w-4" />
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardFooter>
          </div>
          
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 transform-gpu -z-10"
            variants={{ initial: { translateZ: -50 }, hover: { translateZ: -100 } }}
            style={{ transformStyle: 'preserve-3d' }}
          />
        </Card>
      </div>
    </motion.div>
  );
}
