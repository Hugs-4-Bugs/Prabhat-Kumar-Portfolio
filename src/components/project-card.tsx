// src/components/project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import type { Project } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
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
      {/* HOLOGRAPHIC EFFECT CONTAINER */}
      <div className="relative h-full">
        {/* OUTER GLOW */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          variants={{
            initial: { scale: 0.8 },
            hover: { scale: 1.1 }
          }}
        />
        
        {/* MAIN CARD */}
        <Card className="group/card relative flex flex-col h-full overflow-hidden transition-all duration-700 border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-slate-900/90 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/20">
          {/* ANIMATED GRADIENT BORDER */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
          
          {/* FLOATING PARTICLES */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
                initial={{
                  x: p.x,
                  y: p.y,
                }}
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
            {/* CARD HEADER WITH 3D IMAGE */}
            <CardHeader className="p-6 pb-4">
              <motion.div 
                className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-slate-600/50 group-hover:border-cyan-400/30 transition-all duration-500 bg-slate-800/50"
                variants={{
                  initial: { rotateY: 0 },
                  hover: { rotateY: 5, rotateX: -5 }
                }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110"
                  data-ai-hint={project.imageAiHint}
                />
                
                {/* GLOW OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* FLOATING BADGE */}
                <motion.div
                  className="absolute top-3 right-3"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1 fill-cyan-400" />
                    New
                  </Badge>
                </motion.div>
              </motion.div>
              
              {/* TITLE WITH GRADIENT */}
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4">
                {project.name}
              </CardTitle>
            </CardHeader>
            
            {/* CARD CONTENT */}
            <CardContent className="flex-grow flex flex-col p-6 pt-0">
              <ScrollArea className="h-28 pr-4 mb-4">
                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  {project.description}
                </CardDescription>
              </ScrollArea>
              
              {/* TAGS WITH MAGIC */}
              <motion.div 
                className="flex flex-wrap gap-2 mt-auto"
                layout
              >
                {project.tags.slice(0, 4).map((tag, tagIndex) => (
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
            
            {/* CARD FOOTER WITH QUANTUM BUTTONS */}
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
                    className="w-full relative overflow-hidden group/btn backdrop-blur-sm border-2 border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-white transition-all duration-300"
                    data-cursor-hover
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
          
                    <span className="relative z-10 flex items-center justify-center font-semibold">
                      <Github className="mr-2 h-4 w-4 group-hover/github:scale-110 transition-transform" />
                      Code
                    </span>
                    </a>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button 
                    variant="outline"
                    className="w-full relative overflow-hidden group/github backdrop-blur-sm border-2 border-purple-400/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-white transition-all duration-300"
                    data-cursor-hover
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 -translate-x-full group-hover/github:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    
                   <span className="relative z-10 flex items-center justify-center font-semibold">
                      <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform" />
                        Live Demo
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </CardFooter>
          </div>
          
          {/* 4D DEPTH EFFECT */}
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
