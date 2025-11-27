// src/app/blog/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SmoothScroll } from '@/components/smooth-scroll';
import { siteConfig } from '@/lib/data';
import '../globals.css';

export const metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: `Articles and insights from ${siteConfig.name}`,
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
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
          <SmoothScroll>
            <main>{children}</main>
          </SmoothScroll>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
