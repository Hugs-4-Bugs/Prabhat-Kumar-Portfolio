// src/components/sections/services.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Loader2, Lightbulb, BarChart } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeProjectDescription } from "@/ai/flows/analyze-project-description";
import type { AnalyzeProjectDescriptionOutput } from "@/ai/flows/analyze-project-description";

export function Services() {
  const { services } = siteConfig;
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeProjectDescriptionOutput | null>(null);
  const [description, setDescription] = useState(
    "We built a new e-commerce platform with a focus on user experience and mobile-first design. It has product search, a shopping cart, and a checkout process. We hope to increase sales."
  );

  // Refs for mouse tracking
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Mouse position with smooth spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  // Transform values for parallax and magnetic effects
  const rotateX = useTransform(smoothY, [0, window?.innerHeight || 800], [-5, 5]);
  const rotateY = useTransform(smoothX, [0, window?.innerWidth || 1200], [5, -5]);

  // Handle mouse move for parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  // Magnetic button effect
  const MagneticButton = ({ children, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
      if (!ref.current) return;
      
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) * 0.3;
      const y = (e.clientY - (top + height / 2)) * 0.3;
      
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button ref={ref} onMouseMove={handleMouse} onMouseLeave={handleMouseLeave} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  };

  // Enhanced card variants with 3D effects
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateX: 15,
      scale: 0.8
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        rotateX: { duration: 0.6, ease: "easeOut" }
      },
    }),
  };

  // Hover variants for 3D card effect
  const cardHoverVariants = {
    initial: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      z: 0
    },
    hover: { 
      scale: 1.05,
      rotateX: -5,
      rotateY: 5,
      y: -10,
      z: 20,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const handleAnalysis = () => {
    startTransition(async () => {
      setAnalysisResult(null);
      const result = await analyzeProjectDescription({ description });
      if (result) {
        setAnalysisResult(result);
        toast({
          title: "Analysis Complete",
          description: "AI suggestions are ready.",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "Could not get a response from the AI.",
          variant: "destructive",
        });
      }
    });
  };

  // Floating beams component
  const FloatingBeams = () => {
    const beams = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {beams.map((beam) => (
          <motion.div
            key={beam.id}
            className="absolute w-px h-32 bg-gradient-to-b from-primary/20 via-primary/40 to-transparent"
            style={{
              left: `${beam.x}%`,
              top: '-5rem',
            }}
            animate={{
              y: [0, 400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Section 
      id="services" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <FloatingBeams />
      
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${smoothX}px ${smoothY}px, rgba(120, 119, 198, 0.1), transparent 80%)`,
        }}
      />
      
      <div className="relative z-10">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <SectionHeading>
            My Cutting-Edge Services
          </SectionHeading>
        </motion.div>

        <div 
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 perspective-1000"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className="h-full transform-style-3d"
            >
              <motion.div
                variants={cardHoverVariants}
                className="h-full relative group"
              >
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200" />
                
                <Card className="h-full bg-card/80 backdrop-blur-xl border-border/50 relative z-10 transform-style-3d shadow-2xl hover:shadow-3xl transition-all duration-500">
                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-20">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <service.icon className="w-7 h-7 text-primary-foreground" />
                    </motion.div>
                    <CardTitle className="font-headline text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-20">
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -inset-10 top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-40 transition-transform duration-1000" />
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* AI Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 relative"
        >
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <h3 className="text-2xl md:text-4xl font-bold font-headline text-center mb-6 flex items-center justify-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <BrainCircuit className="text-primary w-8 h-8 md:w-10 md:h-10"/>
            </motion.div>
            AI Feature Showcase
          </h3>
          
          <motion.p 
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Explore one of the AI tools I've built. This feature analyzes a project description and provides suggestions for improvement, just like I do for my clients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-60" />
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl font-headline bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Project Description Analyzer
                </CardTitle>
                <CardDescription className="text-base">
                  Enter a project description below and let the AI enhance it with cutting-edge analysis.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Textarea
                    placeholder="Enter your project description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="text-base resize-none border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-300 shadow-inner"
                    data-cursor-hover
                  />
                </motion.div>
                
                <MagneticButton 
                  onClick={handleAnalysis} 
                  disabled={isPending || !description} 
                  data-cursor-hover
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4"/>
                  )}
                  Analyze with AI
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute -inset-10 top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 hover:translate-x-40 transition-transform duration-1000" />
                  </div>
                </MagneticButton>
              </CardContent>
              
              <AnimatePresence>
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="border-t border-border/50 relative z-10"
                  >
                    <div className="p-6 grid md:grid-cols-2 gap-8 bg-gradient-to-br from-muted/30 to-background/50">
                      <motion.div 
                        className="space-y-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="font-semibold flex items-center gap-3 text-lg">
                          <motion.div
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <BarChart className="text-primary w-5 h-5"/>
                          </motion.div>
                          AI Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                          {analysisResult.analysis}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="font-semibold flex items-center gap-3 text-lg">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Lightbulb className="text-accent w-5 h-5"/>
                          </motion.div>
                          Suggestions
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                          {analysisResult.suggestions}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}






















// // src/components/sections/services.tsx
// "use client";

// import { useState, useTransition } from "react";
// import { motion } from "framer-motion";
// import { Sparkles, BrainCircuit, Loader2, Lightbulb, BarChart } from "lucide-react";
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { analyzeProjectDescription } from "@/ai/flows/analyze-project-description";
// import type { AnalyzeProjectDescriptionOutput } from "@/ai/flows/analyze-project-description";

// export function Services() {
//   const { services } = siteConfig;
//   const { toast } = useToast();
//   const [isPending, startTransition] = useTransition();
//   const [analysisResult, setAnalysisResult] = useState<AnalyzeProjectDescriptionOutput | null>(null);
//   const [description, setDescription] = useState(
//     "We built a new e-commerce platform with a focus on user experience and mobile-first design. It has product search, a shopping cart, and a checkout process. We hope to increase sales."
//   );

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.1,
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     }),
//   };

//   const handleAnalysis = () => {
//     startTransition(async () => {
//       setAnalysisResult(null);
//       const result = await analyzeProjectDescription({ description });
//       if (result) {
//         setAnalysisResult(result);
//         toast({
//           title: "Analysis Complete",
//           description: "AI suggestions are ready.",
//         });
//       } else {
//         toast({
//           title: "Analysis Failed",
//           description: "Could not get a response from the AI.",
//           variant: "destructive",
//         });
//       }
//     });
//   };

//   return (
//     <Section id="services">
//       <SectionHeading>My Cutting-Edge Services</SectionHeading>
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//         {services.map((service, i) => (
//           <motion.div
//             key={service.title}
//             variants={cardVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             custom={i}
//             className="h-full"
//           >
//             <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300">
//               <CardHeader>
//                 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
//                   <service.icon className="w-6 h-6 text-primary" />
//                 </div>
//                 <CardTitle className="font-headline text-lg">{service.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription>{service.description}</CardDescription>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
      
//       <div className="mt-24">
//         <h3 className="text-2xl md:text-3xl font-bold font-headline text-center mb-4 flex items-center justify-center gap-3">
//             <BrainCircuit className="text-primary"/> AI Feature Showcase
//         </h3>
//         <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
//             Explore one of the AI tools I've built. This feature analyzes a project description and provides suggestions for improvement, just like I do for my clients.
//         </p>

//         <Card className="max-w-4xl mx-auto overflow-hidden">
//             <CardHeader>
//                 <CardTitle>Project Description Analyzer</CardTitle>
//                 <CardDescription>Enter a project description below and let the AI enhance it.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                  <Textarea
//                     placeholder="Enter your project description..."
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     rows={5}
//                     className="text-base"
//                     data-cursor-hover
//                 />
//                  <Button onClick={handleAnalysis} disabled={isPending || !description} data-cursor-hover>
//                     {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
//                     Analyze with AI
//                 </Button>
//             </CardContent>
//             {analysisResult && (
//                  <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     className="border-t"
//                  >
//                     <div className="p-6 grid md:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                             <h4 className="font-semibold flex items-center gap-2"><BarChart className="text-primary"/> AI Analysis</h4>
//                             <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{analysisResult.analysis}</p>
//                         </div>
//                         <div className="space-y-4">
//                             <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="text-accent"/> Suggestions</h4>
//                             <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{analysisResult.suggestions}</p>
//                         </div>
//                     </div>
//                  </motion.div>
//             )}
//         </Card>
//       </div>

//     </Section>
//   );
// }
