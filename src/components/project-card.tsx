// src/components/project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { Project } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === project.image);

  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2 dark:hover:shadow-primary/10">
       <CardHeader className="p-4">
         {placeholder && (
            <div className="aspect-video w-full overflow-hidden rounded-md mb-4 border">
                <Image
                    src={placeholder.imageUrl}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                    data-ai-hint={placeholder.imageHint}
                />
            </div>
        )}
        <CardTitle className="text-xl font-headline">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4 pt-0">
        <ScrollArea className="h-24 pr-4 mb-4">
          <CardDescription className="text-sm">{project.description}</CardDescription>
        </ScrollArea>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild variant="outline" className="w-full" data-cursor-hover>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            Project Link
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
