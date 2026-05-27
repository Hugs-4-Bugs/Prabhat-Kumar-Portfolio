// src/components/RootClientShell.tsx
"use client";

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CustomCursor } from '@/components/custom-cursor';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AIAssistant } from '@/components/ai-assistant';
import { AISearch } from '@/components/ai-search';
import { siteConfig } from '@/lib/data';

export function RootClientShell({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = siteConfig.title;
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <BalancerProvider>
        <CustomCursor />

        {isSearchOpen && (
          <AISearch
            isVisible={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}

        <div className="flex flex-col min-h-screen">
          <Header onSearchClick={() => setIsSearchOpen(true)} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>

        {!isSearchOpen && <AIAssistant isSearchOpen={isSearchOpen} />}
      </BalancerProvider>

      <Toaster />
    </ThemeProvider>
  );
}
