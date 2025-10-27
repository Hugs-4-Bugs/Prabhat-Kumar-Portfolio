"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { submitContactForm, handleResumeUpload } from "@/app/actions";
import type { ContactFormState, ResumeAnalysisState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle, Lightbulb, User, Mail, Phone, Briefcase, List, Sparkles } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const initialFormState: ContactFormState = {
  success: false,
  message: "",
};

export function ContactFormHandler() {
  const { toast } = useToast();
  const [formState, formAction] = useFormState(submitContactForm, initialFormState);
  const [isPending, startTransition] = useTransition();

  const [resumeState, setResumeState] = useState<ResumeAnalysisState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? "Success" : "Error",
        description: formState.message,
        variant: formState.success ? "default" : "destructive",
      });
      if (formState.success) {
        form.reset();
      }
    }
  }, [formState, toast, form]);

  useEffect(() => {
    if (resumeState?.success && resumeState.data) {
      form.setValue("name", resumeState.data.autofill.name);
      form.setValue("email", resumeState.data.autofill.email);
    }
  }, [resumeState, form]);

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
          action={(formData) => startTransition(() => formAction(formData))}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="Your Name" data-cursor-hover/>
            {form.formState.errors.name && <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>}
            {formState.errors?.name && <p className="text-destructive text-sm mt-1">{formState.errors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="your.email@example.com" data-cursor-hover />
            {form.formState.errors.email && <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>}
            {formState.errors?.email && <p className="text-destructive text-sm mt-1">{formState.errors.email[0]}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...form.register("message")} placeholder="Let's build something amazing together!" rows={5} data-cursor-hover />
            {form.formState.errors.message && <p className="text-destructive text-sm mt-1">{form.formState.errors.message.message}</p>}
            {formState.errors?.message && <p className="text-destructive text-sm mt-1">{formState.errors.message[0]}</p>}
          </div>
          <Button type="submit" disabled={isPending} className="w-full" data-cursor-hover>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
