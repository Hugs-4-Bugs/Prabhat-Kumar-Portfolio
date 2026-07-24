import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Service | Prabhat Kumar",
  description: "Terms of Service for prabhat.online.",
};

const lastUpdated = "July 24, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 text-foreground">
      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-5 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            These terms govern your use of prabhat.online, the personal portfolio of Prabhat Kumar / QuantumFusion Solutions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <div className="space-y-6 rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md md:p-8">
            <TermsSection title="Using this site">
              <p>You may use this portfolio and its contact tools for lawful, respectful purposes. Do not interfere with the site, attempt unauthorized access, or use it in a way that harms others or its operation.</p>
            </TermsSection>

            <TermsSection title="AI-Powered Resume Assistant">
              <p>Upload only files you are authorized to share. Do not upload malicious files or another person&apos;s personal or resume information without their consent. Do not attempt to abuse, automate, overload, reverse engineer, or circumvent limits on QuantumAI chat, voice, resume, or meeting features.</p>
              <p className="mt-3">AI-generated answers, autofill, and resume suggestions are advisory only. They are not professional career, legal, financial, or employment advice, and no outcome—including interview, hiring, or employment outcome—is guaranteed.</p>
            </TermsSection>

            <TermsSection title="Meeting scheduling">
              <p>Meeting scheduling is a request and availability service. A calendar event and Google Meet link are created only when the requested time is available and the scheduling service confirms the event. You must provide accurate contact details and may schedule only for yourself or with the attendee&apos;s permission. Please do not use the feature to submit spam, impersonate another person, or create duplicate requests.</p>
            </TermsSection>

            <TermsSection title="Intellectual property">
              <p>Unless stated otherwise, the site&apos;s design, code, written content, and original materials belong to Prabhat Kumar / QuantumFusion Solutions. You may not reproduce, distribute, or commercially use them without prior written permission.</p>
            </TermsSection>

            <TermsSection title="Disclaimer and limitation of liability">
              <p>This site and its AI features are provided on an “as is” and “as available” basis. To the extent permitted by law, Prabhat Kumar / QuantumFusion Solutions is not liable for indirect, incidental, special, consequential, or loss-of-data damages arising from your use of, or inability to use, the site or its suggestions.</p>
            </TermsSection>

            <TermsSection title="Governing law">
              <p>These terms are governed by the laws of India. Courts in Bengaluru, Karnataka will have jurisdiction over disputes arising from these terms or the site.</p>
            </TermsSection>

            <TermsSection title="Changes to these terms">
              <p>These terms may be updated from time to time. Continued use of the site after an update means you accept the revised terms. The current version and its last-updated date will be posted here.</p>
            </TermsSection>

            <p className="border-t pt-6 text-sm text-muted-foreground">Questions? Email <a href="mailto:mailtoprabhat72@gmail.com" className="text-primary underline underline-offset-4 hover:text-primary/80">mailtoprabhat72@gmail.com</a>. Review the <Link href="/privacy-policy" className="text-primary underline underline-offset-4 hover:text-primary/80">Privacy Policy</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TermsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
