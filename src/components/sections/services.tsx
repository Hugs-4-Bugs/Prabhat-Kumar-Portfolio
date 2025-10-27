// src/components/sections/services.tsx
"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Loader2, Lightbulb, BarChart } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeProjectDescription } from "@/ai/flows/analyze-project-description";
import type { AnalyzeProjectDescriptionOutput } from "@/ai/flows/analyze-project-description";

export function Services() {
  const { services } = siteConfig;
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeProjectDescriptionOutput | null>(null);
  const [description, setDescription] = useState(
    "We built a new e-commerce platform with a focus on user experience and mobile-first design. It has product search, a shopping cart, and a checkout process. We hope to increase sales."
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const handleAnalysis = () => {
    startTransition(async () => {
      setAnalysisResult(null);
      const result = await analyzeProjectDescription({ description });
      if (result) {
        setAnalysisResult(result);
        toast({
          title: "Analysis Complete",
          description: "AI suggestions are ready.",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "Could not get a response from the AI.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Section id="services">
      <SectionHeading>My Cutting-Edge Services</SectionHeading>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            className="h-full"
          >
            <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-24">
        <h3 className="text-2xl md:text-3xl font-bold font-headline text-center mb-4 flex items-center justify-center gap-3">
            <BrainCircuit className="text-primary"/> AI Feature Showcase
        </h3>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Explore one of the AI tools I've built. This feature analyzes a project description and provides suggestions for improvement, just like I do for my clients.
        </p>

        <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardHeader>
                <CardTitle>Project Description Analyzer</CardTitle>
                <CardDescription>Enter a project description below and let the AI enhance it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Textarea
                    placeholder="Enter your project description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="text-base"
                    data-cursor-hover
                />
                 <Button onClick={handleAnalysis} disabled={isPending || !description} data-cursor-hover>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Analyze with AI
                </Button>
            </CardContent>
            {analysisResult && (
                 <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t"
                 >
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><BarChart className="text-primary"/> AI Analysis</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{analysisResult.analysis}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="text-accent"/> Suggestions</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{analysisResult.suggestions}</p>
                        </div>
                    </div>
                 </motion.div>
            )}
        </Card>
      </div>

    </Section>
  );
}
