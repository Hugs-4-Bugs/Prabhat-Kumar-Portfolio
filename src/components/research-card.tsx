import Link from "next/link";
import { FileText, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface ResearchItem {
  slug: string;
  title: string;
  type: "research-paper" | "article" | "report";
  publishedDate: string;
  venue: string | null;
  externalLink: string | null;
  pdfPath: string | null;
  description: string;
  tags: string[];
  coverImage: string | null;
  readingTimeMinutes: number;
  featured: boolean;
}

interface ResearchCardProps {
  research: ResearchItem;
  index?: number;
}

export function ResearchCard({ research, index = 0 }: ResearchCardProps) {
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
        
        <Card className="group/card relative flex flex-col h-full overflow-hidden transition-all duration-700 border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-slate-900/90 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/20">
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
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col h-full bg-slate-900/60 backdrop-blur-md rounded-3xl">
            <CardHeader className="p-6 pb-4">
              <motion.div 
                className="relative aspect-video w-full overflow-hidden flex items-center justify-center rounded-2xl border-2 border-slate-600/50 group-hover:border-cyan-400/30 transition-all duration-500 bg-slate-800/50"
                variants={{
                  initial: { rotateY: 0 },
                  hover: { rotateY: 5, rotateX: -5 }
                }}
                transition={{ duration: 0.5 }}
              >
                {research.coverImage ? (
                  <img
                    src={research.coverImage}
                    alt={research.title}
                    className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 transition-transform duration-1000 ease-out group-hover:scale-110">
		    <FileText size={64} className="mb-2 opacity-30" />
		    <span className="text-sm font-semibold tracking-wider uppercase opacity-50">{research.type.replace("-", " ")}</span>
		  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  className="absolute top-3 right-3"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  <Badge className="bg-cyan-500/20 capitalize text-cyan-300 border-cyan-400/30 backdrop-blur-sm">
                    {research.type.replace("-", " ")}
                  </Badge>
                </motion.div>
              </motion.div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4 line-clamp-2">
                {research.title}
              </CardTitle>
	      <div className="text-xs text-slate-400 mt-2 font-medium flex justify-between">
		<span>{new Date(research.publishedDate).toLocaleDateString()}</span>
		<span>{research.readingTimeMinutes} min read</span>
	      </div>
            </CardHeader>
            
            <CardContent className="flex-grow flex flex-col p-6 pt-0">
              <ScrollArea className="h-28 pr-4 mb-4">
                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  {research.description || "Click to view the full report."}
                </CardDescription>
              </ScrollArea>
              
              <motion.div 
                className="flex flex-wrap gap-2 mt-auto"
                layout
              >
                {research.tags.slice(0, 4).map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.05 + tagIndex * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge 
                      className="font-medium bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-400/30 hover:text-cyan-300 transition-all duration-300"
                    >
                      {tag}
                    </Badge>
                  </motion.span>
                ))}
              </motion.div>
            </CardContent>
            
            <CardFooter className="p-6 pt-4">
              <motion.div
                className="w-full flex gap-3"
                variants={{
                  initial: { y: 20, opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button 
                    asChild 
                    className="w-full px-0 relative overflow-hidden group/btn backdrop-blur-sm border-2 border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-white transition-all duration-300 min-h-[44px]"
                    data-cursor-hover
                  >
                    <Link href={`/research/${research.slug}`}>
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
          
                    <span className="relative z-10 flex items-center justify-center font-semibold">
                      <FileText className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      Read More
                    </span>
                    </Link>
                  </Button>
                </motion.div>

                {research.externalLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full px-0 relative overflow-hidden group/btn2 backdrop-blur-sm border-2 border-purple-400/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white transition-all duration-300 min-h-[44px]"
                      data-cursor-hover
                    >
                     <a href={research.externalLink} target="_blank" rel="noopener noreferrer">
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 -translate-x-full group-hover/btn2:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                      
                     <span className="relative z-10 flex items-center justify-center font-semibold">
                        <ExternalLink className="mr-2 h-4 w-4 transition-transform" />
                          External
                      </span>
                      </a>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </CardFooter>
          </div>
          
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 transform-gpu -z-10"
            variants={{
              initial: { translateZ: -50 },
              hover: { translateZ: -100 }
            }}
            style={{
              transformStyle: 'preserve-3d'
            }}
          />
        </Card>
      </div>
    </motion.div>
  );
}
