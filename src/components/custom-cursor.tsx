// src/components/custom-cursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

// Define the size constants
const LENS_SIZE_DEFAULT = 40; // Default size (subtle)
const LENS_SIZE_HOVER = 85;  // Large size for a prominent distortion effect
const DOT_SIZE = 4;          // Small dot for the focal point

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    setIsClient(true);

    const moveCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // --- Hover Detection ---
    const checkHoverTarget = (target: HTMLElement | null) => {
        // Targets: links, buttons, form controls, and elements marked with data-cursor-hover
        return target?.closest('a, button, input, textarea, select, [data-cursor-hover]');
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (checkHoverTarget(target)) {
            setIsHovering(true);
        }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const relatedTarget = e.relatedTarget as HTMLElement;
        
        if (checkHoverTarget(target) && !checkHoverTarget(relatedTarget)) {
            setIsHovering(false);
        }
    };
    // --- End Hover Detection ---

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isClient) {
    return null;
  }
  
  // --- Animation Variants ---
  
  const lensVariants = {
    default: {
      height: LENS_SIZE_DEFAULT,
      width: LENS_SIZE_DEFAULT,
      opacity: 0.8,
      // Subtle default filter
      filter: "blur(0px) brightness(1) contrast(1)", 
    },
    hover: {
      height: LENS_SIZE_HOVER,
      width: LENS_SIZE_HOVER,
      opacity: 1,
      // Strong filter for the "water drop" liquid distortion effect
      filter: "blur(3px) brightness(2) contrast(1.5) saturate(1.5)",
    },
  };

  const dotVariants = {
    default: {
      scale: 0.5, 
      opacity: 1 
    },
    hover: {
      scale: 0, 
      opacity: 0 
    }
  }

  // --- Transition Configurations ---
  
  // 1. FAST position tracking (Instant update to match system cursor speed)
  const fastTransition = {
      type: "tween", 
      duration: 0, 
  };
  
  // 2. SLOW/LIQUID effect for size/filter changes (The Wobble/Inertia)
  const liquidEffectTransition = {
    type: "spring",
    stiffness: 70,  // Low stiffness = slow reaction/wobble
    damping: 15,    
    mass: 1.8,      // High mass = heavy liquid feel
  };

  // Utility function to calculate center position
  const getPositionStyle = (size: number) => ({
    translateX: mousePosition.x - size / 2,
    translateY: mousePosition.y - size / 2,
  });

  return (
    <motion.div
      className={cn(
        // Ensure cursor is hidden on smaller screens (lg:block)
        "hidden lg:block fixed top-0 left-0 z-[9998] pointer-events-none rounded-full",
        // Border and background use theme-aware colors
        "border-2 border-foreground/50 bg-background/20", 
        // Backdrop blur for subtle depth effect
        "backdrop-filter backdrop-blur-sm",
        // CRITICAL for theming and distortion: inverts color contrast
        "mix-blend-difference" 
      )}
      style={{ 
        // Set the maximum possible size for consistent centering
        ...getPositionStyle(LENS_SIZE_HOVER), 
        width: LENS_SIZE_DEFAULT, 
        height: LENS_SIZE_DEFAULT,
      }}
      variants={lensVariants}
      animate={isHovering ? "hover" : "default"}
      transition={{
          // Apply liquid spring ONLY to the size/appearance/filter
          height: liquidEffectTransition,
          width: liquidEffectTransition,
          opacity: liquidEffectTransition,
          filter: liquidEffectTransition,
          // Apply fast transition to the position (for system speed)
          translateX: fastTransition,
          translateY: fastTransition,
      }}
    >
      {/* Small Focal Dot inside the Liquid Lens */}
      <motion.div
          className="absolute inset-0 m-auto rounded-full bg-foreground"
          variants={dotVariants}
          animate={isHovering ? "hover" : "default"}
          transition={liquidEffectTransition}
          style={{ width: DOT_SIZE, height: DOT_SIZE }}
      />
    </motion.div>
  );
}



















// // src/components/custom-cursor.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { cn } from '@/lib/utils';

// export function CustomCursor() {
//   const [isHovering, setIsHovering] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

//   useEffect(() => {
//     setIsClient(true);
//     const moveCursor = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
    
//     const handleMouseOver = (e: MouseEvent) => {
//         const target = e.target as HTMLElement;
//         if (target.closest('a, button, [data-cursor-hover]')) {
//             setIsHovering(true);
//         }
//     };
    
//     const handleMouseOut = (e: MouseEvent) => {
//         const target = e.target as HTMLElement;
//         if (target.closest('a, button, [data-cursor-hover]')) {
//             setIsHovering(false);
//         }
//     };

//     window.addEventListener('mousemove', moveCursor);
//     document.addEventListener('mouseover', handleMouseOver);
//     document.addEventListener('mouseout', handleMouseOut);

//     return () => {
//       window.removeEventListener('mousemove', moveCursor);
//       document.removeEventListener('mouseover', handleMouseOver);
//       document.removeEventListener('mouseout', handleMouseOut);
//     };
//   }, []);

//   if (!isClient) {
//     return null;
//   }
  
//   const variants = {
//     default: {
//       x: mousePosition.x - 8,
//       y: mousePosition.y - 8,
//       height: 16,
//       width: 16,
//       backgroundColor: "hsl(var(--primary))",
//       mixBlendMode: 'difference' as const,
//     },
//     hover: {
//       x: mousePosition.x - 24,
//       y: mousePosition.y - 24,
//       height: 48,
//       width: 48,
//       backgroundColor: "hsl(var(--accent))",
//       mixBlendMode: 'difference' as const,
//     },
//   };

//   const spring = {
//     type: "spring",
//     stiffness: 500,
//     damping: 28,
//   };

//   return (
//     <motion.div
//       className={cn(
//         "hidden lg:block fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
//       )}
//       variants={variants}
//       animate={isHovering ? "hover" : "default"}
//       transition={spring}
//     />
//   );
// }
