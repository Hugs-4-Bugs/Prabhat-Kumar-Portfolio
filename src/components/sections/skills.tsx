"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  CodeXml,
  Server,
  Cloud,
  Database,
  BrainCircuit,
  ScreenShare,
  Terminal,
  TrendingUp,
} from 'lucide-react';

// ====================================================================
// Mock Data and Dependencies
// ====================================================================

const siteConfig = {
  skills: [
    {
      category: "Languages",
      icon: CodeXml,
      skills: ["Java", "JavaScript", "HTML/CSS", "Node.js", "TypeScript", "SQL"]
    },
    {
      category: "Java & Spring",
      icon: Server,
      skills: ["Spring Boot", "Spring Security", "Spring Cloud", "Spring AI", "Hibernate", "JWT", "REST API", "Spring MVC"]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS EC2", "S3", "Lambda", "RDS", "VPC", "CloudFront", "CloudWatch", "IAM", "SQS", "SNS", "ELB", "CI/CD", "Jenkins", "Docker"]
    },
    {
      category: "Databases",
      icon: Database,
      skills: ["MySQL", "MongoDB", "PostgreSQL", "RDS", "DynamoDB", "ORM"]
    },
    {
      category: "AI & ML",
      icon: BrainCircuit,
      skills: ["OpenAI API", "Ollama", "AI Streaming", "Chatbots", "Voicebots", "ML Price Prediction", "Algo Trading"]
    },
    {
      category: "Frontend",
      icon: ScreenShare,
      skills: ["React", "Next.js", "Angular", "Redux", "Framer Motion", "Tailwind CSS", "Terminal UI"]
    },
    {
      category: "Problem Solving",
      icon: Terminal,
      skills: ["Data Structures", "Algorithms", "System Design", "UML/ER Diagrams", "Custom Exception Handling"]
    },
    {
      category: "Trading",
      icon: TrendingUp,
      skills: ["Mirror Market", "Supply & Demand", "Order Blocks", "FVG", "Liquidity Traps", "Technical Analysis"]
    },
  ],
};

// Mock Shadcn/ui Components
const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow-xl ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Section = React.forwardRef(({ id, className = "", children, ...props }, ref) => (
  <section id={id} ref={ref} className={`py-24 sm:py-32 overflow-hidden relative ${className}`} {...props}>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {children}
    </div>
  </section>
));
Section.displayName = 'Section';

const SectionHeading = ({ children }) => (
  <motion.h2 
    initial={{ opacity: 0, y: -50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true, amount: 0.1 }}
    className="text-4xl font-extrabold tracking-tight text-center mb-12 sm:text-5xl"
  >
    {children}
  </motion.h2>
);

// Enhanced Tabs with smooth transitions
const TabsContext = React.createContext(null);

const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
    viewport={{ once: true, amount: 0.1 }}
    className={`flex flex-wrap gap-2 p-1 rounded-full bg-muted/50 backdrop-blur-sm ${className}`}
  >
    {children}
  </motion.div>
);

const TabsTrigger = ({ value, children, className, ...props }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e) => {
    if (ref.current) {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const center = { x: left + width / 2, y: top + height / 2 };
      const deltaX = e.clientX - center.x;
      const deltaY = e.clientY - center.y;
      
      const pullX = deltaX * 0.25;
      const pullY = deltaY * 0.25;
      
      x.set(pullX);
      y.set(pullY);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
        isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'text-foreground/70 hover:bg-muted'
      } ${className}`}
      onClick={() => setActiveTab(value)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      <span className="relative z-10 flex items-center">
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="active-tab-glow"
          className="absolute inset-0 rounded-full bg-primary/20 -z-0"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {isHovered && !isActive && (
        <div className="absolute inset-0 rounded-full border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
};

const TabsContent = ({ value, children }) => {
  const { activeTab } = React.useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// ====================================================================
// Enhanced SkillCard with Better Alignment
// ====================================================================

function SkillCard({ skill, index }) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const sx = useSpring(tiltX, springConfig);
  const sy = useSpring(tiltY, springConfig);

  const rotateX = useTransform(sy, [-10, 10], ["2deg", "-2deg"]);
  const rotateY = useTransform(sx, [-10, 10], ["-2deg", "2deg"]);

  const handleMouseMove = useCallback((e) => {
    if (e.currentTarget) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const center = { x: left + width / 2, y: top + height / 2 };
      
      const normalizedX = (e.clientX - center.x) / (width / 2) * 10;
      const normalizedY = (e.clientY - center.y) / (height / 2) * 10;

      tiltX.set(normalizedX);
      tiltY.set(normalizedY);
    }
  }, [tiltX, tiltY]);

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const fadeInAnimation = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.03 * index,
        duration: 0.5
      }
    },
  };

  return (
    <motion.div
      key={skill}
      variants={fadeInAnimation}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className="relative group perspective-[1000px] hover:z-20 transition-all duration-300"
    >
      <div className="p-3 rounded-xl text-center text-sm font-medium transition-all duration-300 ease-out shadow-lg transform-style-3d 
                      bg-card border border-border/50
                      group-hover:shadow-2xl group-hover:shadow-primary/30 dark:group-hover:shadow-primary/50
                      group-hover:scale-105 h-full min-h-[80px] flex items-center justify-center">
        
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 -m-[2px] rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-[14px] bg-[length:400%_400%] animate-shineGradient 
                          bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 dark:via-primary/40" />
        </div>

        <div className="relative z-10 p-2 bg-card rounded-[10px] h-full w-full flex items-center justify-center transition-colors duration-300 group-hover:text-primary">
          <span className="text-center leading-tight break-words px-1">
            {skill}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ====================================================================
// Main Skills Component with Scroll Fix
// ====================================================================

export function Skills() {
  const { skills } = siteConfig;
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [activeCategory, setActiveCategory] = useState(skills[0].category);

  // Handle Parallax & Spotlight - FIXED: Throttled mouse movement
  const handleMouseMove = useCallback((e) => {
    if (sectionRef.current) {
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePos({ x, y });
    }
  }, []);

  // REMOVED: Smooth scroll behavior from useEffect as it causes issues
  // The scroll behavior should be handled by CSS only

  // Parallax values
  const parallaxX = (mousePos.x - 0.5) * -40;
  const parallaxY = (mousePos.y - 0.5) * -40;

  // Enhanced tab change handler for smoother transitions
  const handleTabChange = useCallback((value) => {
    setActiveCategory(value);
  }, []);

  return (
    <>
      <style>
        {`
        .perspective-\[1000px\] {
            perspective: 1000px;
        }
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        @keyframes shineGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-shineGradient {
          animation: shineGradient 3s ease infinite;
        }
        .dark .spotlight-overlay {
          background: radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), 
                      rgba(14, 165, 233, 0.12) 0%,
                      rgba(14, 165, 233, 0.0) 25%);
          transition: background 0.1s ease-out;
        }
        .light .spotlight-overlay {
          background: radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), 
                      rgba(59, 130, 246, 0.12) 0%,
                      rgba(255, 255, 255, 0.0) 30%);
          transition: background 0.1s ease-out;
        }
        .magnetic-button-container {
            overflow: visible;
        }
        
        /* REMOVED: Smooth scrolling from here as it causes issues */
        /* Let the browser handle scroll naturally */
        
        /* Perfect grid alignment */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .skills-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .skills-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        /* Fix for scroll performance */
        .skills-section {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
        }
        
        /* Optimize animations for better performance */
        .optimized-animations {
          will-change: transform, opacity;
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-shineGradient {
            animation: none;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        `}
      </style>
      
      <Section 
        id="skills" 
        ref={sectionRef} 
        onMouseMove={handleMouseMove} 
        className="relative skills-section optimized-animations"
      >
        {/* Cursor Spotlight/Holographic Background Effect */}
        <div
          className="absolute inset-0 z-0 spotlight-overlay transition-colors duration-300"
          style={{
            '--mouse-x': mousePos.x,
            '--mouse-y': mousePos.y,
          }}
        />

        {/* Floating Beams with Smoother Parallax */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[48rem] h-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
          style={{ 
            x: parallaxX, 
            y: parallaxY,
            background: 'linear-gradient(135deg, var(--tw-color-primary) 0%, var(--tw-color-blue-500) 50%, var(--tw-color-purple-500) 100%)',
          }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />

        <div className="relative z-10">
          <SectionHeading>Skills & Expertise</SectionHeading>
          
          <Tabs defaultValue={activeCategory} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center magnetic-button-container mb-8">
              <TabsList className="w-full max-w-4xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto border border-border/70 shadow-xl">
                {skills.map((category) => (
                  <TabsTrigger 
                    key={category.category} 
                    value={category.category} 
                    className="text-xs sm:text-sm transition-all duration-300"
                  >
                    <category.icon className="mr-2 h-4 w-4 hidden sm:inline-block" />
                    {category.category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {/* Enhanced Smooth Tab Transitions */}
            <AnimatePresence mode="wait">
              {skills.map((category) => (
                <TabsContent key={category.category} value={category.category}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-dashed bg-background/90 backdrop-blur-md border-border/50 shadow-2xl">
                      <CardContent className="p-6 sm:p-8">
                        <motion.div 
                          className="skills-grid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          {category.skills.map((skill, index) => (
                            <SkillCard 
                              key={skill} 
                              skill={skill} 
                              index={index} 
                            />
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </Section>
    </>
  );
}

export default Skills;























// // src/components/sections/skills.tsx
// "use client";

// import { motion } from "framer-motion";
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";

// export function Skills() {
//   const { skills } = siteConfig;

//   const fadeInAnimation = {
//     initial: { opacity: 0, y: 20 },
//     animate: (index: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: 0.05 * index,
//       }
//     }),
//   }

//   return (
//     <Section id="skills">
//       <SectionHeading>Skills & Expertise</SectionHeading>
//       <Tabs defaultValue={skills[0].category} className="w-full">
//         <div className="flex justify-center">
//             <TabsList className="grid w-full max-w-4xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
//             {skills.map((category) => (
//                 <TabsTrigger key={category.category} value={category.category} className="text-xs sm:text-sm" data-cursor-hover>
//                     <category.icon className="mr-2 h-4 w-4 hidden sm:inline-block" />
//                     {category.category}
//                 </TabsTrigger>
//             ))}
//             </TabsList>
//         </div>
//         {skills.map((category) => (
//           <TabsContent key={category.category} value={category.category}>
//             <Card className="mt-6 border-dashed">
//                 <CardContent className="p-6">
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {category.skills.map((skill, index) => (
//                             <motion.div 
//                                 key={skill}
//                                 variants={fadeInAnimation}
//                                 initial="initial"
//                                 whileInView="animate"
//                                 viewport={{ once: true }}
//                                 custom={index}
//                                 className="bg-secondary/50 p-3 rounded-md text-center text-sm font-medium"
//                                 data-cursor-hover
//                             >
//                                 {skill}
//                             </motion.div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </Section>
//   );
// }
