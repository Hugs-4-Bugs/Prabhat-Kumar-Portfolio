import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | Prabhat Kumar",
  description: "Privacy Policy for prabhat.online.",
};

const lastUpdated = "July 24, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 text-foreground">
      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="container max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            This policy explains the limited information handling on prabhat.online, the personal portfolio of Prabhat Kumar, operating as QuantumFusion Solutions in Bengaluru, India.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <div className="space-y-6 rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md md:p-8">
            <PolicySection title="Information collected">
              <p>When you use the contact form, I collect the name, email address, and message you provide. If you use QuantumAI chat or voice mode, I process the questions, conversation context, and any meeting details you choose to provide. If you use the AI-Powered Resume Assistant, I process the content of the resume file you upload (PDF, DOC, DOCX, or TXT, up to 4 MB).</p>
            </PolicySection>

            <PolicySection title="How information is used">
              <p>Contact-form information is used to respond to your inquiry. QuantumAI inputs are used to answer questions about the portfolio and to help collect meeting details when you ask to schedule. Resume content is used only to prefill contact-form fields and generate resume-improvement suggestions. Meeting details are used to check calendar availability, create the requested Google Calendar/Meet event, and send confirmations. I do not sell personal data to any third party, ever.</p>
            </PolicySection>

            <PolicySection title="Resume processing and retention">
              <p>Your uploaded resume is processed in memory only for the duration of the request. It is not stored, saved, logged, or retained after the response is returned to your browser. No database write or file storage is used for uploaded resumes.</p>
            </PolicySection>

            <PolicySection title="Browser storage">
              <p>QuantumAI conversation history, selected voice preference, and an in-progress meeting draft may be stored in your browser&apos;s local storage so the experience can continue during the session or after a refresh. You can clear this data from your browser settings or by using the relevant clear/cancel controls. The site does not provide user accounts, login, or payment processing.</p>
            </PolicySection>

            <PolicySection title="Service providers">
              <p>Contact-form and meeting confirmation emails are delivered through <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">Resend</a>. QuantumAI chat, voice-response generation, resume analysis, and optional contact spam screening use Google&apos;s Gemini API through Genkit. When an ElevenLabs voice is available, the text of a QuantumAI voice response is sent to <a href="https://elevenlabs.io/privacy" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">ElevenLabs</a> to create audio; otherwise your browser&apos;s speech features may be used.</p>
              <p className="mt-3">When you submit a meeting request, the necessary meeting details are sent to Google Calendar to check availability, create a calendar event and Google Meet link, and send the attendee invitation. Google&apos;s handling of data is governed by its <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">Privacy Policy</a>. Prabhat Kumar / QuantumFusion Solutions does not control how a third-party API handles data on its own systems beyond the request made to it.</p>
            </PolicySection>

            <PolicySection title="Analytics and cookies">
              <p>This site uses Google Analytics and Microsoft Clarity to understand site usage and improve the experience. These services may use cookies or similar technologies. Their respective privacy notices explain their data practices: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">Google</a> and <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">Microsoft</a>.</p>
            </PolicySection>

            <PolicySection title="Your choices and contact">
              <p>For questions about this policy or concerns about information you submitted, email <a href="mailto:mailtoprabhat72@gmail.com" className="text-primary underline underline-offset-4 hover:text-primary/80">mailtoprabhat72@gmail.com</a>. This site is not directed to children under 13, and please do not submit personal information if you are under 13.</p>
            </PolicySection>

            <PolicySection title="Law and updates">
              <p>This policy is governed by the laws of India. It may be updated from time to time; the latest version will always appear on this page with its revised date.</p>
            </PolicySection>

            <p className="border-t pt-6 text-sm text-muted-foreground">See also the <Link href="/terms" className="text-primary underline underline-offset-4 hover:text-primary/80">Terms of Service</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
