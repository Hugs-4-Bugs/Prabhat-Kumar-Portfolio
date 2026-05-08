
// "use client";

// import type { Metadata } from 'next';
// import { useState } from 'react';
// import './globals.css';
// import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
// import { SmoothScroll } from '@/components/smooth-scroll';
// import { CustomCursor } from '@/components/custom-cursor';
// import { Provider as BalancerProvider } from 'react-wrap-balancer';
// import { Header } from '@/components/header';
// import { Footer } from '@/components/footer';
// import { AIAssistant } from '@/components/ai-assistant';
// import { AISearch } from '@/components/ai-search';
// import { siteConfig } from '@/lib/data';

// // We cannot use Metadata API in a client component
// // export const metadata: Metadata = {
// //   title: siteConfig.title,
// //   description: siteConfig.description,
// // };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [isSearchOpen, setIsSearchOpen] = useState(true);

//   // Set document title
//   if (typeof window !== 'undefined') {
//     document.title = siteConfig.title;
//   }

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <meta name="description" content={siteConfig.description} />
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
//       </head>
//       <body className="font-body bg-background text-foreground antialiased selection:bg-primary/20">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <BalancerProvider>
//             <SmoothScroll>
//               <CustomCursor />
//               {isSearchOpen && <AISearch isVisible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
//               <div className="flex flex-col min-h-screen">
//                 <Header onSearchClick={() => setIsSearchOpen(true)} />
//                 <main className="flex-grow">{children}</main>
//                 <Footer />
//               </div>
//               <AIAssistant isSearchOpen={isSearchOpen} />
//             </SmoothScroll>
//           </BalancerProvider>
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }






import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/data';
import { RootClientShell } from '@/components/RootClientShell';

const siteUrl = "https://www.prabhat.online";
const ogImageUrl = `${siteUrl}/Prabhat%20image.png`;
const sameAsLinks = [
  siteConfig.socials.github,
  siteConfig.socials.linkedin,
  siteConfig.socials.twitter,
  siteConfig.socials.instagram,
  siteConfig.socials.stackoverflow,
  siteConfig.socials.youtube,
  "https://dev.to/hugs-4-bugs",
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prabhat Kumar",
  jobTitle: "Java Software Developer",
  url: siteUrl,
  sameAs: sameAsLinks,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#030712" media="(prefers-color-scheme: dark)" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content={siteConfig.title} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.title} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Microsoft Clarity Code Starts */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wnf9oybwni");
            `,
          }}
        />
        {/* Microsoft Clarity Code Ends */}

        {/* Google Analytics Code Starts */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CRE6HM3RDS"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-CRE6HM3RDS');
            `,
          }}
        />
        {/* Google Analytics Code Ends */}
      </head>

      <body className="font-body bg-background text-foreground antialiased selection:bg-primary/20">
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
  );
}
