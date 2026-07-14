
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { handleResumeUpload, submitContactForm } from "@/app/actions";
import type { ResumeAnalysisState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Sparkles, Lightbulb, User, Mail, Phone, Briefcase, List, AlertTriangle } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").refine(email => {
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"];
    const domain = email.split('@')[1];
    return validDomains.includes(domain);
  }, {
    message: "Please use a valid email provider (Gmail, Yahoo, Outlook, or iCloud)."
  }),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactFormHandler() {
  const { toast } = useToast();
  const [resumeState, setResumeState] = useState<ResumeAnalysisState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await submitContactForm(formData);

    toast({
      title: result.success ? "Message Sent" : "Message Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      reset();
    }
  };

  useEffect(() => {
    if (resumeState?.success && resumeState.data) {
      setValue("name", resumeState.data.autofill.name);
      setValue("email", resumeState.data.autofill.email);
    }
  }, [resumeState, setValue]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setResumeState(null);
      try {
        const result = await handleResumeUpload(file);
        setResumeState(result);
        toast({
          title: result.success ? "Analysis Complete" : "Analysis Failed",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold font-headline">AI-Powered Resume Assistant</h3>
          <p className="text-muted-foreground">
            Upload your resume to autofill the contact form and get AI-powered suggestions for improvement.
          </p>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            disabled={isUploading}
          />
          <Button onClick={handleUploadClick} disabled={isUploading} className="w-full md:w-auto" data-cursor-hover>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </>
            )}
          </Button>
           <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, TXT. Max 4MB.</p>
        </div>

        <AnimatePresence>
          {isUploading && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Loader2 className="animate-spin" /> Processing Your Resume</CardTitle>
                        <CardDescription>Our AI is analyzing your document. This may take a moment.</CardDescription>
                    </CardHeader>
                </Card>
             </motion.div>
          )}
          {resumeState && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {resumeState.success && resumeState.data ? (
                <>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-primary"><Sparkles size={20}/> AI Analysis Results</CardTitle>
                       <CardDescription>We've extracted the following details and have some suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3"><User size={16} className="mt-1 shrink-0 text-primary" /><p><strong className="font-semibold">Name:</strong> {resumeState.data.autofill.name}</p></div>
                            <div className="flex items-start gap-3"><Mail size={16} className="mt-1 shrink-0 text-primary" /><p><strong className="font-semibold">Email:</strong> {resumeState.data.autofill.email}</p></div>
                            <div className="flex items-start gap-3"><Phone size={16} className="mt-1 shrink-0 text-primary" /><p><strong className="font-semibold">Phone:</strong> {resumeState.data.autofill.phone}</p></div>
                        </div>
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Briefcase size={16} className="text-primary"/> Experience Summary</h4>
                            <p className="text-sm text-muted-foreground">{resumeState.data.autofill.experienceSummary}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><List size={16} className="text-primary"/> Skills Detected</h4>
                            <div className="flex flex-wrap gap-2">
                                {resumeState.data.autofill.skills.slice(0, 15).map(skill => (
                                    <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/5 border-accent/20">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-accent-foreground"><Lightbulb size={20} className="text-accent" /> Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground">{resumeState.data.suggestions}</div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-destructive/5 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive-foreground"><AlertTriangle className="text-destructive"/> Analysis Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{resumeState.message}</p>
                    </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <h3 className="text-2xl font-bold font-headline mb-4">Get in Touch</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="Your Name" data-cursor-hover/>
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="your.email@example.com" data-cursor-hover />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...register("message")} placeholder="Let's build something amazing together!" rows={5} data-cursor-hover />
            {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} data-cursor-hover>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
