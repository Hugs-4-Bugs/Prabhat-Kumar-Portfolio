// // src/components/sections/about.tsx
// import Image from "next/image";
// import { siteConfig } from "@/lib/data";
// import { PlaceHolderImages } from "@/lib/placeholder-images";
// import { Section } from "@/components/section-wrapper";
// import { SectionHeading } from "@/components/section-heading";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle } from "lucide-react";

// export function About() {
//   const { about } = siteConfig;
//   const profilePic = PlaceHolderImages.find(p => p.id === "profile-picture");

//   return (
//     <Section id="about" className="bg-secondary/30">
//       <SectionHeading>About Me</SectionHeading>
//       <div className="grid md:grid-cols-5 gap-12 items-center">
//         <div className="md:col-span-3 space-y-4 text-lg text-muted-foreground">
//           <p>{about.p1}</p>
//           <p>{about.p2}</p>
//           <p>{about.p3}</p>
//         </div>
//         <div className="md:col-span-2 flex flex-col items-center gap-6">
//           {profilePic && (
//             <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
//               <Image
//                 src={profilePic.imageUrl}
//                 alt={profilePic.description}
//                 fill
//                 className="object-cover"
//                 data-ai-hint={profilePic.imageHint}
//               />
//             </div>
//           )}
//           <div className="text-center">
//              <h3 className="font-bold text-xl font-headline mb-3">Interests</h3>
//              <div className="flex flex-wrap gap-2 justify-center">
//                 {about.interests.map((interest) => (
//                     <Badge key={interest} variant="default" className="text-sm font-normal bg-primary/10 text-primary hover:bg-primary/20" data-cursor-hover>{interest}</Badge>
//                 ))}
//              </div>
//           </div>
//         </div>
//       </div>
//     </Section>
//   );
// }










// src/components/sections/about.tsx
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  const { about } = siteConfig;
  const profilePic = PlaceHolderImages.find(p => p.id === "profile-picture");

  return (
    <Section 
      id="about" 
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(74, 222, 128, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 60% 80%, rgba(248, 113, 113, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 10% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 90% 60%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, 
            hsl(var(--secondary)/0.4) 0%, 
            hsl(var(--secondary)/0.3) 30%, 
            hsl(var(--secondary)/0.2) 70%, 
            hsl(var(--secondary)/0.4) 100%
          )
        `,
        backdropFilter: 'blur(20px) saturate(160%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, 
                ${i % 3 === 0 ? 'rgba(74, 222, 128, 0.2)' : 
                  i % 3 === 1 ? 'rgba(96, 165, 250, 0.15)' : 
                  'rgba(192, 132, 252, 0.18)'})`,
              filter: 'blur(12px)',
              width: `${Math.random() * 120 + 80}px`,
              height: `${Math.random() * 120 + 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, (Math.random() - 0.5) * 40],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <SectionHeading>
        <motion.span
          className="inline-block"
          animate={{
            textShadow: [
              '0 0 20px rgba(74, 222, 128, 0.6)',
              '0 0 25px rgba(96, 165, 250, 0.6)',
              '0 0 30px rgba(192, 132, 252, 0.6)',
              '0 0 20px rgba(74, 222, 128, 0.6)'
            ],
            transform: [
              'perspective(500px) rotateX(0deg)',
              'perspective(500px) rotateX(5deg)',
              'perspective(500px) rotateX(0deg)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          About Me
        </motion.span>
      </SectionHeading>
      
      <div className="grid md:grid-cols-5 gap-12 items-center relative z-10">
        <div className="md:col-span-3 space-y-6">
          <motion.p 
            className="text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {about.p1}
          </motion.p>
          
          <motion.p 
            className="text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {about.p2}
          </motion.p>
          
          <motion.p 
            className="text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {about.p3}
          </motion.p>
        </div>
        
        <div className="md:col-span-2 flex flex-col items-center gap-8">
          {profilePic && (
            <motion.div 
              className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(74, 222, 128, 0.4) 0%, transparent 70%),
                  radial-gradient(circle at 70% 70%, rgba(96, 165, 250, 0.3) 0%, transparent 70%),
                  radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2) 0%, transparent 70%)
                `,
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.15),
                  0 8px 25px rgba(74, 222, 128, 0.3),
                  0 4px 15px rgba(96, 165, 250, 0.2),
                  inset 0 1px 0 rgba(255,255,255,0.2)
                `,
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  <Image
                    src={profilePic.imageUrl}
                    alt={profilePic.description}
                    fill
                    className="object-cover transform hover:scale-110 transition-transform duration-300"
                    data-ai-hint={profilePic.imageHint}
                  />
                </div>
              </div>
              
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(74, 222, 128, 0.4)',
                    '0 0 30px rgba(96, 165, 250, 0.4)',
                    '0 0 25px rgba(192, 132, 252, 0.4)',
                    '0 0 20px rgba(74, 222, 128, 0.4)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.h3 
              className="font-bold text-2xl font-headline mb-4"
              animate={{
                textShadow: [
                  '0 2px 8px rgba(74, 222, 128, 0.4)',
                  '0 2px 12px rgba(96, 165, 250, 0.4)',
                  '0 2px 10px rgba(192, 132, 252, 0.4)'
                ],
                transform: [
                  'perspective(500px) translateZ(0px)',
                  'perspective(500px) translateZ(10px)',
                  'perspective(500px) translateZ(0px)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Interests
            </motion.h3>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {about.interests.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -2
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1 
                  }}
                >
                  <Badge 
                    variant="default" 
                    className="relative text-sm font-medium px-4 py-2 cursor-pointer group"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(74, 222, 128, 0.9) 0%, 
                          rgba(96, 165, 250, 0.8) 50%, 
                          rgba(192, 132, 252, 0.7) 100%
                        )
                      `,
                      boxShadow: `
                        0 8px 25px rgba(74, 222, 128, 0.4),
                        0 4px 12px rgba(96, 165, 250, 0.3),
                        0 2px 6px rgba(192, 132, 252, 0.2),
                        inset 0 1px 0 rgba(255,255,255,0.3)
                      `,
                      border: '1px solid rgba(255,255,255,0.2)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      transform: 'perspective(500px) translateZ(0)'
                    }}
                    data-cursor-hover
                  >
                    {/* 3D effect */}
                    <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-md"
                      animate={{
                        boxShadow: [
                          '0 0 10px rgba(74, 222, 128, 0.6)',
                          '0 0 15px rgba(96, 165, 250, 0.6)',
                          '0 0 12px rgba(192, 132, 252, 0.6)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <span className="relative z-10 text-white font-semibold">
                      {interest}
                    </span>
                    
                    {/* Sparkle icon */}
                    <motion.div
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                      animate={{
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}