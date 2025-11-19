// // src/components/project-card.tsx
// import Image from "next/image";
// import Link from "next/link";
// import { ExternalLink } from "lucide-react";

// import type { Project } from "@/lib/types";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";

// interface ProjectCardProps {
//   project: Project;
// }

// export function ProjectCard({ project }: ProjectCardProps) {
//   return (
//     <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2 dark:hover:shadow-primary/10">
//        <CardHeader className="p-4">
//          <div className="aspect-video w-full overflow-hidden rounded-md mb-4 border">
//             <Image
//                 src={project.image}
//                 alt={project.name}
//                 width={600}
//                 height={400}
//                 className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
//                 data-ai-hint={project.imageAiHint}
//             />
//         </div>
//         <CardTitle className="text-xl font-headline">{project.name}</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-grow flex flex-col p-4 pt-0">
//         <ScrollArea className="h-24 pr-4 mb-4">
//           <CardDescription className="text-sm">{project.description}</CardDescription>
//         </ScrollArea>
//         <div className="flex flex-wrap gap-2 mt-auto">
//           {project.tags.slice(0, 4).map((tag) => (
//             <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter className="p-4">
//         <Button asChild variant="outline" className="w-full" data-cursor-hover>
//           <a href={project.link} target="_blank" rel="noopener noreferrer">
//             Project Link
//             <ExternalLink className="ml-2 h-4 w-4" />
//           </a>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }












// import Image from "next/image";
// import Link from "next/link";
// import { ExternalLink } from "lucide-react";
// import { useEffect, useRef } from "react";

// import type { Project } from "@/lib/types";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";

// interface ProjectCardProps {
//   project: Project;
//   index: number;
// }

// export function ProjectCard({ project, index }: ProjectCardProps) {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const swarmRef = useRef<HTMLDivElement>(null);

//   // Quantum Tunnel Entry (Client-Side Only)
//   useEffect(() => {
//     if (typeof window === 'undefined') return; // SSR Safety

//     if (!cardRef.current) return;
//     cardRef.current.style.clipPath = 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)';
//     setTimeout(() => {
//       cardRef.current!.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
//       cardRef.current!.style.transition = 'clip-path 1s ease-out';
//     }, 300 + index * 150);
//   }, [index]);

//   // Quantum Particle Swarm on Hover (Client-Side Only)
//   useEffect(() => {
//     if (typeof window === 'undefined') return; // SSR Safety

//     if (!swarmRef.current) return;
//     const particles = swarmRef.current.children;
//     for (let i = 0; i < particles.length; i++) {
//       const particle = particles[i] as HTMLElement;
//       particle.style.animationDelay = `${i * 0.1}s`;
//     }
//   }, []);

//   return (
//     <Card
//       ref={cardRef}
//       className="group flex flex-col h-full overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-cyan-400/30 hover:-translate-y-4 dark:hover:shadow-cyan-400/20 relative backdrop-blur-sm bg-background/80 dark:bg-slate-900/50 border border-cyan-400/10 dark:border-cyan-400/20"
//       style={{
//         filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
//       }}
//     >
//       {/* Quantum Particle Swarm */}
//       <div ref={swarmRef} className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//         {Array.from({ length: 12 }).map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-swarm"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animation: `swarm 2s ease-in-out infinite`,
//             }}
//           />
//         ))}
//       </div>

//       <CardHeader className="p-4 relative z-10">
//         <div className="aspect-video w-full overflow-hidden rounded-md mb-4 border border-cyan-400/20">
//           <Image
//             src={project.image}
//             alt={project.name}
//             width={600}
//             height={400}
//             className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
//             data-ai-hint={project.imageAiHint}
//           />
//         </div>
//         <CardTitle className="text-xl font-headline text-foreground dark:text-white">{project.name}</CardTitle>
//       </CardHeader>

//       <CardContent className="flex-grow flex flex-col p-4 pt-0 relative z-10">
//         <ScrollArea className="h-24 pr-4 mb-4">
//           <CardDescription className="text-sm text-muted-foreground dark:text-slate-300">{project.description}</CardDescription>
//         </ScrollArea>
//         <div className="flex flex-wrap gap-2 mt-auto">
//           {project.tags.slice(0, 4).map((tag) => (
//             <Badge key={tag} variant="secondary" className="font-normal bg-cyan-400/10 dark:bg-cyan-400/20 text-cyan-600 dark:text-cyan-300">{tag}</Badge>
//           ))}
//         </div>
//       </CardContent>

//       <CardFooter className="p-4 relative z-10">
//         <Button asChild variant="outline" className="w-full transition-all duration-300 hover:scale-105 hover:bg-cyan-400/10 dark:hover:bg-cyan-400/20" data-cursor-hover>
//           <a href={project.link} target="_blank" rel="noopener noreferrer">
//             Project Link
//             <ExternalLink className="ml-2 h-4 w-4" />
//           </a>
//         </Button>
//       </CardFooter>

//       <style jsx>{`
//         @keyframes swarm {
//           0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
//           50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.5); opacity: 1; }
//         }
//       `}</style>
//     </Card>
//   );
// }
































// src/components/project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Star } from "lucide-react";
import { motion } from "framer-motion";

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
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                animate={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
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
                      {/* BUTTON SHINE */}
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
                    {/* BUTTON SHINE */}
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