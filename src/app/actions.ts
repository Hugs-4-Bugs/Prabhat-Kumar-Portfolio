
"use server";

import { z } from "zod";
import { detectSpam } from "@/ai/flows/detect-spam-contact-form";
import { parseResumeAndAutofill } from "@/ai/flows/parse-resume-autofill-form";
import { suggestResumeImprovements } from "@/ai/flows/suggest-resume-improvements";
import { askPrabhatAI } from "@/ai/flows/ask-prabhat-ai-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { ai } from "@/ai/genkit";

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

// This server action is no longer directly used by the form, 
// but we keep it for the AI spam check, which FormSubmit can call via a webhook if needed.
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

  try {
    const spamResult = await detectSpam({ message });
    if (spamResult.isSpam) {
      // This part is for potential future use with FormSubmit webhooks.
      // For now, FormSubmit handles the submission directly.
      console.log(`Spam detected: ${spamResult.reason}`);
      return {
        success: false,
        message: `Spam detected: ${spamResult.reason}.`,
      };
    }
    
    // Email sending is now handled by formsubmit.co
    // We can add other logic here if needed, like saving to a database.

    return {
      success: true,
      message: "Form data is valid and not spam.",
    };
  } catch (error) {
    console.error("Error in form processing:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
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

export async function getAIAudio(text: string) {
    try {
        const audioDataUri = await textToSpeech(text);
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

  const systemPrompt = `You are QuantumAI, the voice assistant for Prabhat Kumar's portfolio website prabhat.online.

VOICE RESPONSE RULES:
- Identify the language of the user's message and respond in THAT SAME language.
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

You can also answer general knowledge questions — be a full general assistant.
Never claim you lack information about Prabhat.`;

  try {
    const { text } = await ai.generate({
      system: systemPrompt,
      prompt: [
        ...history.flatMap(h => [
          { role: 'user' as const, content: [{ text: h.user }] },
          { role: 'model' as const, content: [{ text: h.model }] }
        ]),
        { role: 'user' as const, content: [{ text: userMessage }] }
      ]
    });

    return { success: true, answer: text };
  } catch (error) {
    console.error("Error getting voice AI response:", error);
    return { success: false, message: "Sorry, I'm having trouble connecting right now." };
  }
}
