
"use server";

import { z } from "zod";
import { detectSpam } from "@/ai/flows/detect-spam-contact-form";
import { parseResumeAndAutofill } from "@/ai/flows/parse-resume-autofill-form";
import { suggestResumeImprovements } from "@/ai/flows/suggest-resume-improvements";
import { analyzeProjectDescription } from "@/ai/flows/analyze-project-description";
import type { AnalyzeProjectDescriptionOutput } from "@/ai/flows/analyze-project-description";
import { askPrabhatAI } from "@/ai/flows/ask-prabhat-ai-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { ai } from "@/ai/genkit";
import { prabhatData } from "@/lib/prabhat-data";

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

const architectureReviewSchema = z.object({
  email: z.string().email("Invalid email address."),
  description: z.string().min(20, "Please describe the product, bottleneck, or architecture in at least 20 characters."),
});

// Handles contact form delivery through Resend/Rizen while preserving AI spam checks when configured.
export async function submitContactForm(formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { message } = validatedFields.data;
  const { name, email } = validatedFields.data;

  try {
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      const spamResult = await detectSpam({ message });
      if (spamResult.isSpam) {
        console.log(`Spam detected: ${spamResult.reason}`);
        return {
          success: false,
          message: `Spam detected: ${spamResult.reason}.`,
        };
      }
    }
  } catch (error) {
    console.warn("Contact spam check failed; continuing with email delivery:", error);
  }

  try {
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const response = await sendPortfolioEmail({
      subject: `New portfolio message from ${name}`,
      replyTo: email,
      text: [
        "New Quantum Message Transmission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <h2 style="margin:0 0 16px;">New Quantum Message Transmission</h2>
          <p><strong>Name:</strong> ${escapedName}</p>
          <p><strong>Email:</strong> ${escapedEmail}</p>
          <p><strong>Message:</strong></p>
          <div style="padding:16px;border-left:4px solid #6366f1;background:#f8fafc;">${escapedMessage}</div>
        </div>
      `,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      message: "Message sent successfully. I will get back to you soon.",
    };
  } catch (error) {
    console.error("Error in form processing:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}

export async function submitArchitectureReviewRequest(formData: FormData) {
  const validatedFields = architectureReviewSchema.safeParse({
    email: formData.get("email"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please enter a valid email and architecture description.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, description } = validatedFields.data;
  const escapedEmail = escapeHtml(email);
  const escapedDescription = escapeHtml(description).replace(/\n/g, "<br />");

  const response = await sendPortfolioEmail({
    subject: `Architecture review request from ${email}`,
    replyTo: email,
    text: [
      "New System Architecture Review Request",
      "",
      `Requester Email: ${email}`,
      "",
      "Product / Bottleneck / Architecture:",
      description,
      "",
      "Suggested reply:",
      "Send a practical review checklist covering architecture, scalability, reliability, security, data model, API boundaries, deployment, monitoring, cost, and next steps.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 16px;">New System Architecture Review Request</h2>
        <p><strong>Requester Email:</strong> ${escapedEmail}</p>
        <p><strong>Product / Bottleneck / Architecture:</strong></p>
        <div style="padding:16px;border-left:4px solid #6366f1;background:#f8fafc;">${escapedDescription}</div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="color:#4b5563;"><strong>Reply with:</strong> a practical review checklist covering architecture, scalability, reliability, security, data model, API boundaries, deployment, monitoring, cost, and next steps.</p>
      </div>
    `,
  });

  if (!response.success) {
    return { success: false, message: response.message };
  }

  return {
    success: true,
    message: "Review request sent successfully. I will reply with a practical checklist.",
  };
}

async function sendPortfolioEmail({
  subject,
  replyTo,
  text,
  html,
}: {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY || process.env.RIZEN_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "mailtoprabhat72@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!resendApiKey) {
    return {
      success: false,
      message: "Email is not configured. Please add RESEND_API_KEY in environment variables.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      reply_to: replyTo,
      text,
      html,
    }),
  });

  if (!response.ok) {
    console.error("Resend email failed:", await response.text());
    return {
      success: false,
      message: "Email could not be sent right now. Please try again later.",
    };
  }

  return { success: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export type ResumeAnalysisState = {
  success: boolean;
  message: string;
  data?: {
    autofill: {
      name: string;
      email: string;
      phone: string;
      experienceSummary: string;
      skills: string[];
    };
    suggestions: string;
  } | null;
};

export async function analyzeProjectDescriptionAction(description: string): Promise<{
  success: boolean;
  data?: AnalyzeProjectDescriptionOutput;
  message?: string;
}> {
  if (!description.trim()) {
    return { success: false, message: "Please enter a project description." };
  }

  try {
    const data = await analyzeProjectDescription({ description });
    return { success: true, data };
  } catch (error) {
    console.error("Error analyzing project description:", error);
    return { success: false, message: "Could not analyze the project right now." };
  }
}

export async function handleResumeUpload(
  file: File
): Promise<ResumeAnalysisState> {
  if (!file) {
    return { success: false, message: "No file provided." };
  }

  if (file.size > 4 * 1024 * 1024) { // 4MB limit
    return { success: false, message: "File is too large. Maximum size is 4MB." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`;
    
    // Attempt to read text for suggestions. This might fail for non-text files (like PDFs), so we wrap it.
    let textContent = '';
    try {
      textContent = buffer.toString('utf-8');
    } catch (e) {
      console.warn('Could not read text content from file for resume suggestions.');
      textContent = 'Could not extract text from this file format for suggestions.';
    }


    const [autofillData, improvementData] = await Promise.all([
        parseResumeAndAutofill({ resumeDataUri: dataURI }),
        suggestResumeImprovements({ resumeText: textContent })
    ]);

    return {
      success: true,
      message: "Resume processed successfully.",
      data: {
        autofill: autofillData,
        suggestions: improvementData.suggestions,
      },
    };
  } catch (error) {
    console.error("Error processing resume:", error);
    return {
      success: false,
      message: "Failed to process resume. The file might be corrupted or in an unsupported format. Please try another file.",
    };
  }
}

// AI Assistant Actions
export async function getAIResponse(question: string, history: Array<{ user: string; model: string }>) {
  try {
    const response = await askPrabhatAI({ question, history });
    return { success: true, answer: response.answer };
  } catch (error) {
    console.error("Error getting AI response:", error);
    return { success: false, message: "Sorry, I couldn't get a response from the AI." };
  }
}

export async function getAIAudio(text: string, voiceAgentId?: string) {
    try {
        const audioDataUri = await textToSpeech(text, voiceAgentId);
        return { success: true, audio: audioDataUri };
    } catch (error) {
        console.error('Error generating TTS audio:', error);
        return { success: false, message: 'Sorry, I was unable to generate audio for that response.' };
    }
}

// AI Search Action
export async function getAISearchResponse(question: string, history: Array<{ user: string; model: string }>) {
  if (!question.trim()) {
    return { success: false, message: "Please enter a question." };
  }
  try {
    const response = await askPrabhatAI({ question, history });
    return { success: true, answer: response.answer };
  } catch (error) {
    console.error("Error getting AI search response:", error);
    return { success: false, message: "Sorry, I couldn't get a response from the AI." };
  }
}

/**
 * Specialized AI response action optimized for Voice Mode.
 * It enforces short, conversational, non-markdown responses and multilingual support.
 */
export async function getVoiceAIResponse(userMessage: string, history: Array<{ user: string; model: string }>) {
  if (!userMessage.trim()) {
    return { success: false, message: "Empty message." };
  }

  const portfolioKnowledge = JSON.stringify(prabhatData, null, 2);
  const conversationContext = history
    .map((turn) => `User: ${turn.user}\nQuantumAI: ${turn.model}`)
    .join('\n\n');

  const systemPrompt = `You are QuantumAI, the voice assistant for Prabhat Kumar's portfolio website prabhat.online.

VOICE RESPONSE RULES:
- Identify the language of the user's message and respond in THAT SAME language. 
- You must support English, Hindi, Spanish, French, German, or ANY language the user speaks.
- Keep responses to 1-3 sentences maximum unless detail is explicitly requested.
- Never use bullet points, markdown, asterisks, or lists — speak in natural sentences.
- Never start with "Certainly!", "Great question!", or "Of course!" — just answer.
- Be warm, direct, conversational.

ABOUT PRABHAT KUMAR:
Name: Prabhat Kumar
Role: Java Software Developer + Full Stack Engineer + AI enthusiast + Algorithmic Trader
Location: India

Current Job: Java Software Developer at Netcore Cloud (Jan 2023–Present)
- Spring Boot, Microservices, AWS (EC2, RDS, S3), MySQL, Hibernate, REST APIs, JWT
- Led backend for Real Estate Blog Management (team of 8)
- 40% performance gain, 1M+ requests scale, 99.9% uptime

Past: Java Intern at CodeSpeedy Technology (Oct–Dec 2022), Software Engineer at Walmart USA (Remote, 2022)

Skills: Java, Spring Boot, Hibernate, Microservices, Spring Security, JWT, MySQL, PostgreSQL, MongoDB, React, Next.js, Angular, Tailwind CSS, Node.js, TypeScript, AWS, Docker, GitHub Actions, Spring AI, OpenAI API, Python, Scikit-learn, Pandas

Projects (21+): Cryptocurrency Price Prediction (ML), QuantumFusion Solutions website, PrabhatVerse portfolio, ArticleHub (Angular+Node.js), AlgoByPrabhat trading models, Sharma AI personal assistant, Hospital Review System, REST API CRUD app, and more

Education: BE Computer Science, VTU (2019-2023, CGPA 7.3)
Trading: 4+ years in stocks, crypto, forex, futures and options, derivatives

Links: prabhat.online | prabhatblogs.lovable.app | GitHub: Hugs-4-Bugs

UPDATED PORTFOLIO KNOWLEDGE:
${portfolioKnowledge}

You can also answer general knowledge questions — be a full general assistant.
Never claim you lack information about Prabhat.`;

  try {
    const { text } = await ai.generate({
      prompt: `${systemPrompt}

CONVERSATION HISTORY:
${conversationContext || 'No previous voice conversation.'}

USER MESSAGE:
${userMessage}`
    });

    return { success: true, answer: text };
  } catch (error) {
    console.error("Error getting voice AI response:", error);
    return { success: false, message: "Sorry, I'm having trouble connecting right now." };
  }
}
