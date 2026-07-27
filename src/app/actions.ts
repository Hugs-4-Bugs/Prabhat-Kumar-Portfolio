
"use server";

import { z } from "zod";
import { detectSpam } from "@/ai/flows/detect-spam-contact-form";
import { parseResumeAndAutofill } from "@/ai/flows/parse-resume-autofill-form";
import { extractMeetingFieldsFlow } from "@/ai/flows/extract-meeting-fields-flow";
import { suggestResumeImprovements } from "@/ai/flows/suggest-resume-improvements";
import { analyzeProjectDescription } from "@/ai/flows/analyze-project-description";
import type { AnalyzeProjectDescriptionOutput } from "@/ai/flows/analyze-project-description";
import { askPrabhatAI } from "@/ai/flows/ask-prabhat-ai-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { ai } from "@/ai/genkit";
import { prabhatData } from "@/lib/prabhat-data";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(120, "Name is too long."),
  email: z.string().email("Invalid email address.").refine(email => {
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"];
    const domain = email.split('@')[1];
    return validDomains.includes(domain);
  }, {
    message: "Please use a valid email provider (Gmail, Yahoo, Outlook, or iCloud)."
  }),
  message: z.string().min(10, "Message must be at least 10 characters.").max(5000, "Message is too long."),
});

const architectureReviewSchema = z.object({
  email: z.string().email("Invalid email address."),
  description: z.string().min(20, "Please describe the product, bottleneck, or architecture in at least 20 characters.").max(5000, "Description is too long."),
});

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

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
        console.warn("[Contact] Spam submission rejected.");
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
    const escapedName = escapeHtml(name.trim());
    const escapedEmail = escapeHtml(email.trim());
    const escapedMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");
    const timestamp = new Date().toUTCString();

    const response = await sendPortfolioEmail({
      subject: `New Portfolio Contact - ${name.trim()}`,
      replyTo: email.trim(),
      text: [
        "New Portfolio Contact Form Submission",
        "=====================================",
        "",
        `Name:      ${name.trim()}`,
        `Email:     ${email.trim()}`,
        `Time:      ${timestamp}`,
        `Source:    prabhat.online`,
        "",
        "Message:",
        "--------",
        message.trim(),
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:25px;border:1px solid #e5e7eb;border-radius:16px;background-color:#ffffff;">
          <div style="background:linear-gradient(135deg,#4f46e5,#0891b2);padding:20px 25px;border-radius:10px;margin-bottom:24px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Portfolio Contact</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">prabhat.online · ${timestamp}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:15px;">
            <tr>
              <td style="padding:10px 0;font-weight:600;color:#4b5563;width:80px;vertical-align:top;border-bottom:1px solid #f3f4f6;">Name</td>
              <td style="padding:10px 0;color:#111827;vertical-align:top;border-bottom:1px solid #f3f4f6;">${escapedName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-weight:600;color:#4b5563;vertical-align:top;border-bottom:1px solid #f3f4f6;">Email</td>
              <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #f3f4f6;">
                <a href="mailto:${escapedEmail}" style="color:#4f46e5;text-decoration:none;font-weight:500;">${escapedEmail}</a>
              </td>
            </tr>
          </table>
          <p style="font-weight:600;color:#4b5563;margin:0 0 10px;font-size:15px;">Message</p>
          <div style="padding:20px;border-left:4px solid #4f46e5;background-color:#f9fafb;border-radius:4px;font-size:15px;color:#1f2937;line-height:1.7;white-space:normal;">${escapedMessage}</div>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
            Sent from prabhat.online · Reply directly to respond to ${escapedName}
          </p>
        </div>
      `,
    });

    if (!response.success) {
      return { success: false, message: response.message };
    }

    return {
      success: true,
      message: "Message sent successfully. I will get back to you soon.",
    };
  } catch (error) {
    console.error("Error in form processing:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
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
  const escapedEmail = escapeHtml(email.trim());
  const escapedDescription = escapeHtml(description.trim()).replace(/\n/g, "<br />");
  const timestamp = new Date().toUTCString();

  const response = await sendPortfolioEmail({
    subject: `Architecture Review Request - ${email.trim()}`,
    replyTo: email.trim(),
    text: [
      "System Architecture Review Request",
      "===================================",
      "",
      `Requester: ${email.trim()}`,
      `Time:      ${timestamp}`,
      `Source:    prabhat.online`,
      "",
      "Description:",
      "-------------",
      description.trim(),
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:25px;border:1px solid #e5e7eb;border-radius:16px;background-color:#ffffff;">
        <div style="background:linear-gradient(135deg,#0891b2,#0f766e);padding:20px 25px;border-radius:10px;margin-bottom:24px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Architecture Review Request</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">prabhat.online · ${timestamp}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:15px;">
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#4b5563;width:80px;vertical-align:top;border-bottom:1px solid #f3f4f6;">Email</td>
            <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #f3f4f6;">
              <a href="mailto:${escapedEmail}" style="color:#0891b2;text-decoration:none;font-weight:500;">${escapedEmail}</a>
            </td>
          </tr>
        </table>
        <p style="font-weight:600;color:#4b5563;margin:0 0 10px;font-size:15px;">Architecture &amp; Bottleneck Description</p>
        <div style="padding:20px;border-left:4px solid #0891b2;background-color:#f9fafb;border-radius:4px;font-size:15px;color:#1f2937;line-height:1.7;margin-bottom:24px;white-space:normal;">${escapedDescription}</div>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
          Sent from prabhat.online · Reply directly to respond to the requester
        </p>
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
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "mailtoprabhat72@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  // Config guard — both must be set for production delivery
  if (!resendApiKey) {
    console.error("[Email] RESEND_API_KEY is not set.");
    return { success: false, message: "Email service is not configured." };
  }
  if (!fromEmail) {
    console.error("[Email] RESEND_FROM_EMAIL is not set. Set it to a verified domain sender, e.g. 'Prabhat Kumar <hello@prabhat.online>'.");
    return { success: false, message: "Email service is not configured." };
  }

  // Security: strip newlines from replyTo to block header injection
  const safeReplyTo = replyTo.replace(/[\r\n]/g, "").trim();
  // Validate replyTo is a plausible email (basic check — Zod already validates upstream)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeReplyTo)) {
    console.error("[Email] Invalid replyTo address:", safeReplyTo);
    return { success: false, message: "Invalid email address." };
  }

  const payload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: safeReplyTo,
    subject,
    text,
    html,
  };

  console.log("[Email] Sending contact submission.");

  // 10-second timeout to avoid hanging on Resend network issues
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const responseBody = await response.text();

    if (!response.ok) {
      console.error(`[Email] Resend HTTP ${response.status}:`, responseBody);
      return { success: false, message: "Email could not be delivered. Please try again later." };
    }

    console.log("[Email] Contact submission delivered.");
    return { success: true };
  } catch (error: any) {
    clearTimeout(timeout);
    if (error?.name === "AbortError") {
      console.error("[Email] Request timed out after 10s.");
      return { success: false, message: "Email timed out. Please try again." };
    }
    console.error("[Email] Network error:", error);
    return { success: false, message: "Email could not be delivered. Please try again later." };
  }
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

  if (!ALLOWED_RESUME_TYPES.has(file.type)) {
    return { success: false, message: "Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT resume." };
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
        if (!audioDataUri) {
          // ElevenLabs unavailable — signal the client to use browser Web Speech API
          return { success: false, message: 'use_browser_tts' };
        }
        return { success: true, audio: audioDataUri };
    } catch (error) {
        console.error('Error generating TTS audio:', error);
        return { success: false, message: 'use_browser_tts' };
    }
}

// AI Search Action
export async function getAISearchResponse(
  question: string,
  history: Array<{ user: string; model: string }>,
  visitorContext?: string,
  meetingContext?: string
) {
  if (!question.trim()) {
    return { success: false, message: "Please enter a question." };
  }
  // Avoid a misleading silent failure when a deployment was created without
  // the server-only Gemini key. The browser must never receive the key itself.
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error("[QuantumAI] Missing Gemini API key in this deployment.");
    return { success: false, message: "QuantumAI is temporarily unavailable because its AI service is not configured." };
  }
  try {
    const response = await askPrabhatAI({ question, history, visitorContext, meetingContext });
    return { success: true, answer: response.answer };
  } catch (primaryError) {
    // Structured prompt output can fail independently of the model request
    // (for example during a provider/model schema change). Voice mode already
    // uses direct generation, so retain a small, safe fallback for text chat.
    console.error("[QuantumAI] Structured chat request failed:", primaryError);
    try {
      const context = JSON.stringify(prabhatData);
      const { text } = await ai.generate({
        prompt: `You are QuantumAI, the helpful assistant for Prabhat Kumar's portfolio. Answer in the user's language, accurately and concisely.\n\nPortfolio context: ${context}\n\nQuestion: ${question}`,
      });
      if (text?.trim()) return { success: true, answer: text };
    } catch (fallbackError) {
      console.error("[QuantumAI] Direct chat fallback failed:", fallbackError);
    }
    return { success: false, message: "QuantumAI could not reach its AI service. Please try again in a moment." };
  }
}

export async function extractMeetingFieldsAction(query: string, currentData: Record<string, any>) {
  try {
    const result = await extractMeetingFieldsFlow({ query, currentData });
    return { success: true, data: result };
  } catch (e: any) {
    console.error("Error extracting meeting fields:", e);
    return { success: false };
  }
}

/**
 * Specialized AI response action optimized for Voice Mode.
 * It enforces short, conversational, non-markdown responses and multilingual support.
 */
export async function getVoiceAIResponse(
  userMessage: string,
  history: Array<{ user: string; model: string }>,
  voiceAgentId?: string,
  visitorContext?: string,
  meetingContext?: string
) {
  if (!userMessage.trim()) {
    return { success: false, message: "Empty message." };
  }

  let prompt = `User's message: "${userMessage}"
  
  Remember: Short, conversational, spoken-style.`;

  if (visitorContext) {
    prompt += `\n\nVisitor Context: ${visitorContext}`;
  }
  if (meetingContext) {
    prompt += `\n\nMeeting Context: ${meetingContext}`;
  }

  let agentName = "QuantumAI";
  if (voiceAgentId) {
    const idLower = voiceAgentId.toLowerCase().trim();
    if (idLower === "quantum") agentName = "Quantum";
    else if (idLower === "nova") agentName = "Nova";
    else if (idLower === "sage") agentName = "Sage";
    else if (idLower === "aria") agentName = "Aria";
    else if (idLower === "echo") agentName = "Echo";
    else if (idLower === "orion") agentName = "Orion";
    else if (idLower === "luna") agentName = "Luna";
  }

  const portfolioKnowledge = JSON.stringify(prabhatData, null, 2);
  const conversationContext = history
    .map((turn) => `User: ${turn.user}\n${agentName}: ${turn.model}`)
    .join('\n\n');

  const systemPrompt = `You are ${agentName}, the voice assistant for Prabhat Kumar's portfolio website prabhat.online.

VOICE RESPONSE RULES:
- Identify the language of the user's message and respond in THAT SAME language. 
- You must support English, Hindi, Spanish, French, German, or ANY language the user speaks.
- Keep responses to 1-3 sentences maximum unless detail is explicitly requested.
- Never use bullet points, markdown, asterisks, or lists — speak in natural sentences.
- Never start with "Certainly!", "Great question!", or "Of course!" — just answer.
- Be warm, direct, conversational.
- Since you are representing yourself as ${agentName}, always introduce yourself or refer to yourself as ${agentName} if asked.
- You can help a visitor schedule a meeting with Prabhat. If they ask to meet, connect, book a call, discuss a project, or check availability, let them know that the meeting form is open and guide them through its required details. Never say that meeting scheduling is unavailable.

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
 
${prompt}`
    });

    return { success: true, answer: text };
  } catch (error) {
    console.error("Error getting voice AI response:", error);
    return { success: false, message: "Sorry, I'm having trouble connecting right now." };
  }
}
