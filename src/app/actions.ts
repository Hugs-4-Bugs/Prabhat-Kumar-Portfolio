
"use server";

import { z } from "zod";
import { detectSpam } from "@/ai/flows/detect-spam-contact-form";
import { parseResumeAndAutofill } from "@/ai/flows/parse-resume-autofill-form";
import { suggestResumeImprovements } from "@/ai/flows/suggest-resume-improvements";
import { askPrabhatAI } from "@/ai/flows/ask-prabhat-ai-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";

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
export async function getAIResponse(question: string) {
  try {
    const response = await askPrabhatAI({ question, history: [] });
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

    