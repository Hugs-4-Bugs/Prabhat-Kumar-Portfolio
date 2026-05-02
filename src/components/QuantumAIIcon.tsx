"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function QuantumAIIcon() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="relative cursor-pointer w-7 h-7 flex items-center justify-center">
      {/* Pulse Dot (Active Indicator) */}
      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-500 rounded-full z-10">
        <motion.div
          className="absolute inset-0 bg-purple-500 rounded-full"
          animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </div>

      {/* Main Icon Container */}
      <motion.div
        className="relative flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        onTap={() => {
          setIsClicked(true);
          setTimeout(() => setIsClicked(false), 600);
        }}
      >
        {/* Click Burst */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 border-2 border-purple-400 rounded-full"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Orbit Rings */}
        <motion.div
          className="absolute inset-0 border border-purple-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 border border-blue-500/20 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Neural Core */}
        <div className="relative w-4 h-4">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-[1px]"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 5px rgba(168, 85, 247, 0.4)",
                "0 0 15px rgba(168, 85, 247, 0.7)",
                "0 0 5px rgba(168, 85, 247, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full shadow-white shadow-[0_0_2px_rgba(255,255,255,1)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
