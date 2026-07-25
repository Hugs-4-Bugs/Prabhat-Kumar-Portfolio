import { useEffect, useRef, useState, forwardRef, HTMLAttributes, ReactNode } from "react";

// --- LOCAL DATA AND INTERFACE DEFINITION ---

export interface EducationEntry {
  period: string;
  title: string;
  organization: string;
  grade: string;
  achievements: string[];
  skills: string[];
}

const educationData: EducationEntry[] = [
    {
        period: "2019-2023",
        title: "Bachelor of Engineering, Computer Science",
        organization: "Visvesvaraya Technological University",
        grade: "CGPA: 7.3",
        achievements: [
            "Specialized in Software Engineering & Algorithms",
            "Completed advanced projects in Web Development",
            "Participated in technical workshops and coding competitions"
        ],
        skills: ["Data Structures", "Algorithms", "OOP", "DBMS", "Web Tech"]
    },
    {
        period: "2016-2018",
        title: "Pre-University Course",
        organization: "Veer Kunwar Singh University", 
        grade: "Percentage: 62.4%",
        achievements: [
            "Focus on Mathematics and Computer Science",
            "Developed foundation for engineering studies",
            "Active participation in science exhibitions"
        ],
        skills: ["Mathematics", "Physics", "Chemistry", "Computer Basics"]
    },
    {
        period: "2016", 
        title: "Secondary School",
        organization: "St. Anne's Mission School",
        grade: "CGPA: 8.5",
        achievements: [
            "Consistent academic performance",
            "Developed interest in technology and computing",
            "Participated in science fairs and tech events"
        ],
        skills: ["Science", "Mathematics", "Computers", "English"]
    }
];

// --- 1. MOCK COMPONENTS ---

const Section = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { id: string }>(
  ({ children, className, id, ...props }, ref) => (
    <section id={id} ref={ref} className={`py-20 px-4 min-h-screen ${className}`} {...props}>
      {children}
    </section>
  )
);

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-4xl font-extrabold text-center mb-12 relative z-20">My Educational Journey</h2>
);

const Timeline = ({ events, iconName, renderEvent, className }: { 
    events: EducationEntry[], 
    iconName: string, 
    renderEvent: (event: EducationEntry, index: number) => ReactNode, 
    className: string 
}) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 -translate-x-1/2"></div>
            {events.map((event, index) => (
                <div key={index} className="relative mb-12 flex items-center justify-center w-full">
                    <div className="absolute left-1/2 top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-cyan-400 -translate-x-1/2 -mt-2 z-10"></div>
                    {renderEvent(event, index)}
                </div>
            ))}
        </div>
    );
};

// --- 2. MAIN COMPONENT LOGIC ---

export function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const ringsContainerRef = useRef<HTMLDivElement>(null); 
  
  // IMP FIX: store mouse position in ref, not state → avoids rerenders
  const mousePosRef = useRef({ x: 0, y: 0 });

  const [isDark, setIsDark] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // --- A. SCRIPT LOADER ---
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
      });
    };

    const initGSAP = async () => {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");
        setGsapLoaded(true);
    };

    if (typeof window !== 'undefined' && !(window as any).gsap) {
        initGSAP();
    } else if ((window as any).gsap) {
        setGsapLoaded(true);
    }
  }, []);

  // --- B. MOUSE & THEME DETECTION ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    let observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  // --- C. GSAP ANIMATIONS ---
  useEffect(() => {
    if (!gsapLoaded || !ringsContainerRef.current) return;
    
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

        // FIXED: Rings rotate ONLY ONCE, not on every mouse move
        const rings = Array.from(ringsContainerRef.current?.children || []);
        if (rings) {
          gsap.to(rings[0], {
            rotationY: 360,
            rotationZ: -45,
            duration: 20,
            repeat: -1,
            ease: "none",
          });
          gsap.to(rings[1], {
            rotationX: 360,
            rotationY: 180,
            duration: 15,
            repeat: -1,
            ease: "none",
          });
          gsap.to(rings[2], {
            rotationX: -360,
            rotationZ: 360,
            duration: 10,
            repeat: -1,
            ease: "none",
          });
          gsap.to(rings[3], {
            rotationX: 360,
            rotationY: -360,
            duration: 18,
            repeat: -1,
            ease: "none",
          });

          gsap.to(rings[4], {
            rotationZ: 360,
            duration: 22,
            repeat: -1,
            ease: "none",
          });

          gsap.to(rings[5], {
            rotationX: -360,
            rotationY: 360,
            rotationZ: -180,
            duration: 25,
            repeat: -1,
            ease: "none",
          });
        }
        

        // Soft float animation
        gsap.to(ringsContainerRef.current, {
            y: 30,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Soft scroll animation (FIXED)
        gsap.fromTo(
            ringsContainerRef.current,
            { x: '-15%' },
            {
              x: '15%',
              ease: "none",
              scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1
              }
            }
        );

        // FIXED: Card animations (no flicker)
        cardsRef.current.forEach((card) => {
            if (!card) return;

            card.onmouseenter = () => {
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.25
                });
            };
            card.onmouseleave = () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.25
                });
            };

            gsap.fromTo(
                card,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    }
                }
            );
        });

    }, sectionRef);

    return () => ctx.revert();
  }, [gsapLoaded]); // FIXED: No mousePos dependency anymore

  // --- D. SKILL TAG HOVER ---
  const handleSkillEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((window as any).gsap) {
        (window as any).gsap.to(e.currentTarget, { scale: 1.2, duration: 0.2 });
    }
  };
  const handleSkillLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((window as any).gsap) {
        (window as any).gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
    }
  };

  return (
    <Section id="education" ref={sectionRef} className="relative overflow-hidden perspective-1000">
      
      {/* Cursor Spotlight */}
      <div
        className={`fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-10 transition-opacity duration-300 ${
          isDark ? "bg-gradient-radial from-cyan-400/20 to-transparent" : "bg-gradient-radial from-blue-500/20 to-transparent"
        }`}
        style={{
          transform: `translate(${mousePosRef.current.x - 192}px, ${mousePosRef.current.y - 192}px)`,
        }}
      />

      {/* 3D Rings */}
      <div 
          ref={backgroundRef} 
          className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
      >
          <div
              ref={ringsContainerRef}
              // className="relative
              //            w-[500px] h-[500px]               
              //            w-[600px] h-[600px] 
              //            sm:w-[700px] sm:h-[700px]           /* Small tablets */
              //            sm:w-[800px] sm:h-[800px]
              //            md:w-[1000px] md:h-[1000px]
              //            lg:w-[1200px] lg:h-[1200px]         /* Regular laptops / desktop */
              //            lg:w-[1300px] lg:h-[1300px]
              //            xl:w-[1500px] xl:h-[1500px]
              //            2xl:w-[1800px] 2xl:h-[1800px]       /* 2K/4K monitors, projectors, TVs */
              //            transform-gpu preserve-3d"

              className="relative
                          w-[400px] h-[400px]
                          sm:w-[500px] sm:h-[500px]           /* Small tablets */
                          md:w-[700px] md:h-[700px]
                          lg:w-[900px] lg:h-[900px]           /* Regular laptops / desktop */
                          xl:w-[1100px] xl:h-[1100px]
                          2xl:w-[1300px] 2xl:h-[1300px]       /* 2K/4K monitors, projectors, TVs */
                          transform-gpu preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
              // style={{ transformOrigin: "50% 50%" }}

          >
             {/* ROTATING RINGS */}
              <div className={`absolute inset-0 rounded-full border-[8px] opacity-30 ${isDark ? 'border-cyan-500' : 'border-blue-600'}`}></div>
              <div className={`absolute inset-[10%] rounded-full border-[6px] opacity-40 ${isDark ? 'border-purple-500' : 'border-indigo-600'}`}></div>
              <div className={`absolute inset-[20%] rounded-full border-[4px] opacity-50 ${isDark ? 'border-pink-500' : 'border-fuchsia-600'}`}></div>
              <div className={`absolute inset-[30%] rounded-full border-[3px] opacity-50 ${isDark ? 'border-green-400' : 'border-green-600'}`}></div>
              <div className={`absolute inset-[40%] rounded-full border-[3px] opacity-40 ${isDark ? 'border-yellow-400' : 'border-yellow-600'}`}></div>
              <div className={`absolute inset-[50%] rounded-full border-[2px] opacity-40 ${isDark ? 'border-orange-400' : 'border-orange-600'}`}></div>
          </div>
      </div>
      

      <SectionHeading>My Educational Journey</SectionHeading>

      <div className="relative space-y-12">
        <Timeline
          events={educationData} 
          iconName="GraduationCap"
          className="space-y-8"
          renderEvent={(event, index) => {
            const isRightSide = index % 2 !== 0;
            const layoutClasses = isRightSide ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0";

            return (
              <div key={index} className={`flex w-full md:w-1/2 ${layoutClasses} p-10 md:p-6`}>
                <div
                  ref={(el) => { cardsRef.current[index] = el!; }}
                  className={`relative p-8 rounded-xl transform-gpu w-full backdrop-blur-md border transition-all duration-500 card-glow
                    ${isDark 
                        ? "bg-gray-900/60 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]" 
                        : "bg-white/60 border-blue-500/30 shadow-[0_0_20px_rgba(0,0,255,0.1)]"
                    }`}
                >
                  <p className="text-sm font-light italic mb-2 opacity-80">{event.period}</p>
                  <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-300 dark:to-indigo-300">{event.title}</h3>
                  <p className="text-lg font-medium text-blue-600 dark:text-cyan-400 mb-4">{event.organization}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">{event.grade}</p>
                    <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                        {event.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3 border-t border-gray-500/20">
                    <span className="w-full text-sm font-semibold mb-1 opacity-70">Key Skills:</span>
                    {event.skills.map((skill, skillIndex) => (
                        <div
                            key={skillIndex}
                            className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors duration-300
                                ${isDark ? 'border-cyan-500/50 text-cyan-300' : 'border-blue-500/50 text-blue-600'}`}
                            onMouseEnter={handleSkillEnter}
                            onMouseLeave={handleSkillLeave}
                        >
                            {skill}
                        </div>
                    ))}
                  </div>

                  <button className={`mt-6 px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95
                    ${isDark ? 'bg-cyan-600 text-white' : 'bg-blue-600 text-white'}`}>
                    View Details
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>
    </Section>
  );
}

















































// import { useEffect, useRef, useState, forwardRef, HTMLAttributes, ReactNode } from "react";

// declare const gsap: any;
// declare const ScrollTrigger: any;

// export interface EducationEntry {
//   period: string;
//   title: string;
//   organization: string;
//   grade: string;
//   achievements: string[];
//   skills: string[];
// }

// const educationData: EducationEntry[] = [
//     {
//         period: "2019-2023",
//         title: "Bachelor of Engineering, Computer Science",
//         organization: "Visvesvaraya Technological University",
//         grade: "CGPA: 7.3",
//         achievements: [
//             "Specialized in Software Engineering & Algorithms",
//             "Completed advanced projects in Web Development",
//             "Participated in technical workshops and coding competitions"
//         ],
//         skills: ["Data Structures", "Algorithms", "OOP", "DBMS", "Web Tech"]
//     },
//     {
//         period: "2016-2018",
//         title: "Pre-University Course",
//         organization: "Veer Kunwar Singh University", 
//         grade: "Percentage: 62.4%",
//         achievements: [
//             "Focus on Mathematics and Computer Science",
//             "Developed foundation for engineering studies",
//             "Active participation in science exhibitions"
//         ],
//         skills: ["Mathematics", "Physics", "Chemistry", "Computer Basics"]
//     },
//     {
//         period: "2016", 
//         title: "Secondary School",
//         organization: "St. Anne's Mission School",
//         grade: "CGPA: 8.5",
//         achievements: [
//             "Consistent academic performance",
//             "Developed interest in technology and computing",
//             "Participated in science fairs and tech events"
//         ],
//         skills: ["Science", "Mathematics", "Computers", "English"]
//     }
// ];

// const Section = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { id: string }>(
//   ({ children, className, id, ...props }, ref) => (
//     <section id={id} ref={ref} className={`py-20 px-4 min-h-screen ${className}`} {...props}>
//       {children}
//     </section>
//   )
// );

// const SectionHeading = ({ children }: { children: ReactNode }) => (
//   <h2 className="text-4xl font-extrabold text-center mb-12 relative z-20">{children}</h2>
// );

// const Timeline = ({ events, iconName, renderEvent, className }: { 
//     events: EducationEntry[], 
//     iconName: string, 
//     renderEvent: (event: EducationEntry, index: number) => ReactNode, 
//     className: string 
// }) => {
//     return (
//         <div className={`relative ${className}`}>
//             <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 -translate-x-1/2"></div>
//             {events.map((event, index) => (
//                 <div key={index} className="relative mb-12 flex items-center justify-center w-full">
//                     <div className="absolute left-1/2 top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-cyan-400 -translate-x-1/2 -mt-2 z-10"></div>
//                     {renderEvent(event, index)}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export function Education() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const backgroundRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<HTMLDivElement[]>([]);
//   const beamsRef = useRef<HTMLDivElement[]>([]);
//   const floatingShapesRef = useRef<HTMLDivElement[]>([]);
//   const particlesRef = useRef<HTMLDivElement[]>([]);
//   const globeRef = useRef<HTMLDivElement>(null);
//   const innerGlobeRef = useRef<HTMLDivElement>(null); 
//   const hologramGridRef = useRef<HTMLDivElement>(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isDark, setIsDark] = useState(false);

//   // MOUSE AND THEME DETECTION
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   useEffect(() => {
//     const checkTheme = () => {
//       setIsDark(document.documentElement.classList.contains('dark'));
//     };
//     checkTheme();
//     const observer = new MutationObserver(checkTheme);
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
//     return () => observer.disconnect();
//   }, []);

//   // FIXED BACKGROUND ANIMATIONS - NO SCROLL MOVEMENT
//   useEffect(() => {
//     if (typeof gsap === 'undefined') return;

//     const ctx = gsap.context(() => {
      
//       if (typeof ScrollTrigger !== 'undefined') {
//           gsap.registerPlugin(ScrollTrigger);
//       }
      
//       // Globe rotations - FIXED: No scroll-based movement
//       if (globeRef.current) {
//         gsap.to(globeRef.current, {
//           rotationY: 360, 
//           rotationX: 180, 
//           rotationZ: 90, 
//           duration: 40, // Slower for more illusion
//           repeat: -1, 
//           ease: "none",
//         });
        
//         gsap.to(globeRef.current, {
//           scale: 1.15, 
//           duration: 20, 
//           repeat: -1, 
//           yoyo: true, 
//           ease: "sine.inOut",
//         });
//       }

//       // Inner Globe - FIXED: No scroll-based movement
//       if (innerGlobeRef.current) {
//         gsap.to(innerGlobeRef.current, {
//           rotationY: -360, 
//           rotationX: -90, 
//           rotationZ: 180, 
//           scale: 0.85, 
//           duration: 35, 
//           repeat: -1, 
//           ease: "none",
//         });
        
//         gsap.to(innerGlobeRef.current, {
//           opacity: 0.5, 
//           duration: 15, 
//           repeat: -1, 
//           yoyo: true, 
//           ease: "power1.inOut",
//         });
//       }

//       // Floating Shapes - Enhanced illusion with depth
//       floatingShapesRef.current.forEach((shape, i) => {
//         gsap.to(shape, {
//           x: () => gsap.utils.random(-50, 50),
//           y: () => gsap.utils.random(-30, 30),
//           rotation: 360,
//           scale: () => gsap.utils.random(0.8, 1.2),
//           duration: gsap.utils.random(20, 30),
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: i * 2,
//         });
//       });

//       // Particles - Subtle floating
//       particlesRef.current.forEach((particle, i) => {
//         gsap.to(particle, {
//           y: -100,
//           x: () => gsap.utils.random(-20, 20),
//           rotation: 180,
//           opacity: () => gsap.utils.random(0.3, 0.8),
//           duration: gsap.utils.random(15, 25),
//           repeat: -1,
//           ease: "none",
//           delay: i * 0.5,
//         });
//       });

//       // Holographic Grid Pulse
//       if (hologramGridRef.current) {
//         gsap.to(hologramGridRef.current, {
//           opacity: 0.1,
//           duration: 8,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });
//       }

//       // Enhanced glow effects
//       gsap.to(".card-glow", {
//         boxShadow: "0 0 50px rgba(0,255,255,0.8), inset 0 0 15px rgba(0,255,255,0.6)",
//         duration: 4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       // Subtle background pulse for depth illusion
//       gsap.to(backgroundRef.current, {
//         opacity: 0.95,
//         duration: 10,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   // DYNAMIC/INTERACTIVE ANIMATIONS - Cards only
//   useEffect(() => {
//     if (typeof gsap === 'undefined') return;

//     const ctx = gsap.context(() => {
      
//       if (typeof ScrollTrigger !== 'undefined') {
//           gsap.registerPlugin(ScrollTrigger);
//       }

//       // REMOVED: Background parallax on scroll - this was causing the movement
//       // Only cards will have scroll-triggered animations

//       // Card entrance animations (enhanced illusion)
//       cardsRef.current.forEach((card, i) => {
//         const directions = [
//           { x: -150, y: 50, z: -100, rotationY: -15, rotationX: 10 }, // Left entrance with more depth
//           { x: 150, y: 50, z: -100, rotationY: 15, rotationX: 10 },  // Right entrance with more depth
//         ];
        
//         const dir = (i % 2 === 0) ? directions[0] : directions[1]; 

//         gsap.set(card, { ...dir, opacity: 0, scale: 0.8 });
//         gsap.to(card, {
//           x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, scale: 1,
//           duration: 2.5, 
//           ease: "elastic.out(1.2, 0.8)",
//           scrollTrigger: {
//             trigger: card, 
//             start: "top 85%", 
//             end: "bottom 15%", 
//             toggleActions: "play none none reverse",
//           },
//         });

//         // Enhanced hover effect with depth illusion
//         card.addEventListener("mouseenter", () => {
//           gsap.to(card, { 
//             rotationY: 20, 
//             rotationX: 10, 
//             scale: 1.08, 
//             z: 50, 
//             duration: 0.5, 
//             ease: "power2.out",
//             y: -10 // Lift effect
//           });
//         });
//         card.addEventListener("mouseleave", () => {
//           gsap.to(card, { 
//             rotationY: 0, 
//             rotationX: 0, 
//             scale: 1, 
//             z: 0, 
//             duration: 0.5, 
//             ease: "power2.out",
//             y: 0
//           });
//         });
//       });

//       // Magnetic buttons with enhanced effect
//       const buttons = gsap.utils.toArray(".magnetic-btn");
//       buttons.forEach((btn: any) => {
//         btn.addEventListener("mousemove", (e: MouseEvent) => {
//           const rect = btn.getBoundingClientRect();
//           const x = (e.clientX - rect.left - rect.width / 2) * 0.3; // Increased magnetic effect
//           const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
//           gsap.to(btn, { 
//             x, 
//             y, 
//             rotationY: x * 0.2, 
//             rotationX: y * 0.2, 
//             z: 20,
//             duration: 0.3, 
//             ease: "power2.out" 
//           });
//         });
//         btn.addEventListener("mouseleave", () => {
//           gsap.to(btn, { 
//             x: 0, 
//             y: 0, 
//             rotationY: 0, 
//             rotationX: 0, 
//             z: 0,
//             duration: 0.4, 
//             ease: "power2.out" 
//           });
//         });
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, [mousePos, isDark]); 

//   // GLOBE PARALLAX POSITION - Only mouse-based, no scroll
//   useEffect(() => {
//     if (typeof gsap === 'undefined') return;

//     if (globeRef.current) {
//       gsap.to(globeRef.current, {
//         x: mousePos.x * 0.01, // Reduced movement for stability
//         y: mousePos.y * 0.01,
//         duration: 1, // Slower for smoother effect
//         ease: "power1.out",
//       });
//     }
//     if (innerGlobeRef.current) {
//       gsap.to(innerGlobeRef.current, {
//         x: mousePos.x * 0.003, // Very subtle movement
//         y: mousePos.y * 0.003,
//         duration: 1,
//         ease: "power1.out",
//       });
//     }
//   }, [mousePos]);

//   return (
//     <Section id="education" ref={sectionRef} className="relative overflow-hidden perspective-1000">
      
//       {/* Enhanced Cursor Spotlight */}
//       <div
//         className={`fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-10 transition-opacity duration-500 ${
//           isDark ? "bg-gradient-radial from-cyan-400/30 via-cyan-400/10 to-transparent" : "bg-gradient-radial from-blue-500/30 via-blue-500/10 to-transparent"
//         }`}
//         style={{
//           transform: `translate(${mousePos.x - 192}px, ${mousePos.y - 192}px)`,
//           filter: "blur(20px)",
//         }}
//       />

//       {/* Enhanced 3D Dynamic Background - FIXED POSITION */}
//       <div ref={backgroundRef} className="absolute inset-0 -z-10 transform-gpu overflow-hidden">
        
//         {/* Hologram Grid Pattern */}
//         <div
//           ref={hologramGridRef}
//           className="absolute inset-0 opacity-0.05"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
//             `,
//             backgroundSize: '50px 50px',
//             transform: 'perspective(500px) rotateX(60deg)',
//             transformOrigin: 'center center',
//           }}
//         />

//         {/* Floating Geometric Shapes */}
//         {Array.from({ length: 12 }).map((_, i) => (
//           <div
//             key={`shape-${i}`}
//             ref={(el) => (floatingShapesRef.current[i] = el!)}
//             className={`absolute w-8 h-8 transform-gpu ${
//               isDark 
//                 ? "border-2 border-cyan-400/40 bg-cyan-400/10" 
//                 : "border-2 border-blue-400/40 bg-blue-400/10"
//             } ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : ''}`}
//             style={{
//               left: `${10 + (i * 7)}%`,
//               top: `${15 + (i * 6)}%`,
//               filter: 'blur(0.5px)',
//             }}
//           />
//         ))}

//         {/* Floating Particles */}
//         {Array.from({ length: 25 }).map((_, i) => (
//           <div
//             key={`particle-${i}`}
//             ref={(el) => (particlesRef.current[i] = el!)}
//             className={`absolute w-1 h-1 rounded-full ${
//               isDark ? "bg-cyan-300/60" : "bg-blue-400/60"
//             }`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: '100%',
//               filter: 'blur(0.5px)',
//             }}
//           />
//         ))}

//         {/* Enhanced Outer Globe */}
//         <div
//           ref={globeRef}
//           className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full transform-gpu opacity-70 ${
//             isDark ? "border-[12px] border-cyan-400/80 bg-cyan-900/5" : "border-[12px] border-blue-500/80 bg-blue-100/5"
//           }`}
//           style={{
//             transform: "translate(-50%, -50%) rotateX(20deg)",
//             background: isDark
//               ? "radial-gradient(circle at 30% 30%, rgba(0,255,255,0.3) 0%, rgba(0,128,255,0.1) 40%, transparent 70%)" 
//               : "radial-gradient(circle at 30% 30%, rgba(69,183,209,0.3) 0%, rgba(155,206,180,0.1) 40%, transparent 70%)",
//             boxShadow: isDark
//               ? "inset 0 0 60px rgba(0,255,255,0.6), 0 0 100px rgba(0,255,255,0.2)"
//               : "inset 0 0 40px rgba(69,183,209,0.5), 0 0 80px rgba(69,183,209,0.15)",
//             filter: "blur(1px) saturate(1.6) brightness(1.1)",
//           }}
//         >
//           {/* Enhanced Inner Globe */}
//           <div
//             ref={innerGlobeRef}
//             className={`absolute inset-1/4 w-1/2 h-1/2 rounded-full border-[8px] transform-gpu ${
//               isDark ? "border-indigo-400/80 bg-indigo-900/5" : "border-teal-500/80 bg-teal-100/5"
//             }`}
//             style={{
//               opacity: 0.7,
//               background: isDark
//                 ? "radial-gradient(circle at 70% 70%, rgba(128,0,255,0.4) 0%, rgba(0,0,128,0.15) 40%, transparent 70%)"
//                 : "radial-gradient(circle at 70% 70%, rgba(100,100,255,0.4) 0%, rgba(50,50,200,0.15) 40%, transparent 70%)",
//               boxShadow: isDark
//                 ? "inset 0 0 40px rgba(128,0,255,0.8), 0 0 80px rgba(128,0,255,0.4)"
//                 : "inset 0 0 30px rgba(100,100,255,0.7), 0 0 60px rgba(100,100,255,0.3)",
//               filter: "blur(0.8px) saturate(1.4)",
//             }}
//           />
//         </div>
//       </div>

//       <SectionHeading>My Educational Journey</SectionHeading>

//       {/* Timeline with Ultra-Enhanced Cards */}
//       <div className="relative space-y-12">
//         {/* Holographic Beams with Stable Position */}
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div
//             key={i}
//             ref={(el) => (beamsRef.current[i] = el!)}
//             className={`absolute w-1 h-32 blur-md transform-gpu ${
//               isDark ? "bg-gradient-to-b from-cyan-400/50 to-transparent" : "bg-gradient-to-b from-blue-500/50 to-transparent"
//             }`}
//             style={{
//               left: `${15 + i * 15}%`,
//               top: `${10 + i * 10}%`,
//               transform: `rotate(${i * 60}deg)`,
//               opacity: 0.4,
//             }}
//           />
//         ))}

//         <Timeline
//           events={educationData}
//           iconName="GraduationCap"
//           className="space-y-8"
//           renderEvent={(event, index) => {
//             const isRightSide = index % 2 !== 0; 
//             const layoutClasses = isRightSide 
//                 ? "md:ml-auto md:mr-0"
//                 : "md:mr-auto md:ml-0";
            
//             return (
//               <div 
//                 key={index} 
//                 className={`flex w-full md:w-1/2 ${layoutClasses} p-2`}
//               >
//                 <div
//                   ref={(el) => (cardsRef.current[index] = el!)}
//                   className={`relative p-8 rounded-2xl transform-gpu w-full backdrop-blur-md transition-all duration-500
//                     ${isDark 
//                         ? "bg-gray-900/80 text-white border-2 border-cyan-500/60 shadow-cyan-900/80"
//                         : "bg-white/80 text-gray-900 border-2 border-blue-500/60 shadow-blue-300/60"
//                     } shadow-[0_0_40px_rgba(0,0,0,0.6)] card-glow`}
//                   style={{
//                     boxShadow: isDark 
//                       ? "inset 0 0 30px rgba(0,255,255,0.3), 0 0 25px rgba(0,0,0,0.9)" 
//                       : "inset 0 0 20px rgba(69,183,209,0.3), 0 0 20px rgba(0,0,0,0.2)",
//                   }}
//                 >
//                   <p className="text-sm font-light italic mb-2 opacity-80">{event.period}</p>
//                   <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-cyan-300 dark:to-indigo-300">{event.title}</h3>
//                   <p className="text-lg font-medium text-blue-500 dark:text-cyan-400 mb-4">{event.organization}</p>
                  
//                   <div className="space-y-2 mb-4">
//                     <p className="font-semibold">{event.grade}</p>
//                     <ul className="list-disc list-inside ml-4 text-sm space-y-1">
//                         {event.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
//                     </ul>
//                   </div>

//                   {/* Enhanced Skills Chips */}
//                   <div className="pt-4 flex flex-wrap gap-3 border-t border-gray-600/30 dark:border-gray-300/30">
//                     <span className="w-full text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Key Skills:</span>
//                     {event.skills.map((skill, skillIndex) => (
//                         <div
//                             key={skillIndex}
//                             className={`skill-chip px-4 py-1.5 text-xs font-bold rounded-full transform-gpu transition-all duration-300 cursor-pointer`}
//                             style={{
//                                 perspective: '500px',
//                                 boxShadow: isDark 
//                                     ? '0 6px 15px rgba(0, 0, 0, 0.8), 0 2px 5px rgba(0, 0, 0, 0.6)'
//                                     : '0 6px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
//                                 background: isDark 
//                                     ? 'linear-gradient(145deg, #1f2937, #374151)'
//                                     : 'linear-gradient(145deg, #f0f0f0, #e0e0e0)',
//                                 color: isDark ? '#38BDF8' : '#3B82F6',
//                             }}
//                             onMouseEnter={(e) => {
//                                 gsap.to(e.currentTarget, { 
//                                     scale: 1.2, 
//                                     z: 30, 
//                                     rotationX: 12,
//                                     rotationY: 12,
//                                     boxShadow: isDark 
//                                         ? '0 0 25px rgba(56,189,248,0.9), 0 12px 25px rgba(0,0,0,1)'
//                                         : '0 0 20px rgba(59,130,246,0.7), 0 8px 20px rgba(0,0,0,0.2)',
//                                     duration: 0.3
//                                 });
//                             }}
//                             onMouseLeave={(e) => {
//                                 gsap.to(e.currentTarget, { 
//                                     scale: 1, 
//                                     z: 0, 
//                                     rotationX: 0,
//                                     rotationY: 0,
//                                     boxShadow: isDark 
//                                         ? '0 6px 15px rgba(0, 0, 0, 0.8), 0 2px 5px rgba(0, 0, 0, 0.6)'
//                                         : '0 6px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     duration: 0.4 
//                                 });
//                             }}
//                         >
//                             {skill}
//                         </div>
//                     ))}
//                   </div>

//                   {/* Enhanced Magnetic Button */}
//                   <button className={`magnetic-btn mt-4 px-6 py-2 rounded-xl font-bold text-sm transform-gpu transition-all duration-300
//                     ${isDark 
//                         ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-gray-900 shadow-cyan-500/60 hover:from-cyan-500 hover:to-indigo-500' 
//                         : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/60 hover:from-blue-500 hover:to-purple-500'
//                     }
//                     shadow-xl hover:shadow-2xl`}>
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             );
//           }}
//         />
//       </div>
//     </Section>
//   );
// }































// // src/components/sections/education.tsx
// import { siteConfig } from "@/lib/data";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Timeline } from "@/components/timeline";

// export function Education() {
//   return (
//     <Section id="education">
//       <SectionHeading>My Educational Journey</SectionHeading>
//       <Timeline events={siteConfig.education} iconName="GraduationCap" />
//     </Section>
//   );
// }
