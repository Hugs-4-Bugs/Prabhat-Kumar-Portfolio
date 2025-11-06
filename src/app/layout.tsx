
"use client";

import type { Metadata } from 'next';
import { useState } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SmoothScroll } from '@/components/smooth-scroll';
import { CustomCursor } from '@/components/custom-cursor';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AIAssistant } from '@/components/ai-assistant';
import { AISearch } from '@/components/ai-search';
import { siteConfig } from '@/lib/data';

// We cannot use Metadata API in a client component
// export const metadata: Metadata = {
//   title: siteConfig.title,
//   description: siteConfig.description,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Set document title
  if (typeof window !== 'undefined') {
    document.title = siteConfig.title;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content={siteConfig.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BalancerProvider>
            <SmoothScroll>
              <CustomCursor />
              {isSearchOpen && <AISearch isVisible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
              <div className="flex flex-col min-h-screen">
                <Header onSearchClick={() => setIsSearchOpen(true)} />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <AIAssistant isSearchOpen={isSearchOpen} />
            </SmoothScroll>
          </BalancerProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
