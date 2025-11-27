
// src/components/blog/PaidModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaidModal({ isOpen, onClose }: PaidModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-card border-2 border-yellow-500/50 rounded-2xl p-8 text-center shadow-2xl shadow-yellow-500/20"
          >
            <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={onClose} data-cursor-hover>
                    <X className="h-5 w-5"/>
                </Button>
            </div>
            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-yellow-500 dark:text-yellow-400"/>
            </div>
            <h2 className="text-2xl font-headline text-yellow-500 dark:text-yellow-300 mb-4">Premium Article</h2>
            <p className="text-muted-foreground">
              This is a premium article. Payment gateway integration is coming soon to unlock exclusive content.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
