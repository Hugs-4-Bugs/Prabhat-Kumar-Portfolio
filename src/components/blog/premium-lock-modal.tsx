
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface PremiumLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumLockModal({ isOpen, onClose }: PremiumLockModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="relative border-primary/20 shadow-2xl shadow-primary/10">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose} data-cursor-hover>
                <X />
              </Button>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/30">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Premium Content</CardTitle>
                <CardDescription className="text-base">
                  This is a premium article.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  The payment gateway is coming soon to unlock exclusive content. Stay tuned!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
