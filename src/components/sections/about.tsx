// src/components/sections/about.tsx
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function About() {
  const { about } = siteConfig;
  const profilePic = PlaceHolderImages.find(p => p.id === "profile-picture");

  return (
    <Section id="about" className="bg-secondary/30">
      <SectionHeading>About Me</SectionHeading>
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3 space-y-4 text-lg text-muted-foreground">
          <p>{about.p1}</p>
          <p>{about.p2}</p>
          <p>{about.p3}</p>
        </div>
        <div className="md:col-span-2 flex flex-col items-center gap-6">
          {profilePic && (
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
              <Image
                src={profilePic.imageUrl}
                alt={profilePic.description}
                fill
                className="object-cover"
                data-ai-hint={profilePic.imageHint}
              />
            </div>
          )}
          <div className="text-center">
             <h3 className="font-bold text-xl font-headline mb-3">Interests</h3>
             <div className="flex flex-wrap gap-2 justify-center">
                {about.interests.map((interest) => (
                    <Badge key={interest} variant="default" className="text-sm font-normal bg-primary/10 text-primary hover:bg-primary/20" data-cursor-hover>{interest}</Badge>
                ))}
             </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
