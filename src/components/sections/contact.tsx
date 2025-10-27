// src/components/sections/contact.tsx
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactFormHandler } from "@/components/contact-form-handler";

export function Contact() {
  const { email, phone, location } = siteConfig;

  return (
    <Section id="contact" className="bg-secondary/30">
      <SectionHeading>Contact Me</SectionHeading>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
                 <h3 className="text-2xl font-bold font-headline mb-4">Let's Connect</h3>
                <p className="text-muted-foreground mb-8">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out using the form, or connect with me through my other channels.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-4" data-cursor-hover>
                        <Mail className="w-6 h-6 text-primary" />
                        <a href={`mailto:${email}`} className="text-lg hover:text-primary transition-colors">{email}</a>
                    </div>
                    <div className="flex items-center gap-4" data-cursor-hover>
                        <Phone className="w-6 h-6 text-primary" />
                        <a href={`tel:${phone}`} className="text-lg hover:text-primary transition-colors">{phone}</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="w-6 h-6 text-primary" />
                        <p className="text-lg">{location}</p>
                    </div>
                </div>
            </div>
            <div className="hidden md:block">
                 {/* This space is intentionally left for the form on the right side on larger screens */}
            </div>
        </div>
        <ContactFormHandler />
      </div>
    </Section>
  );
}
