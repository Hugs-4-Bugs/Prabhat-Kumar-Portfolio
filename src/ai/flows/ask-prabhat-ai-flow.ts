'use server';
/**
 * @fileOverview An AI assistant that can answer questions about Prabhat Kumar.
 *
 * - askPrabhatAI - A function that handles answering questions about Prabhat.
 * - AskPrabhatAIInput - The input type for the askPrabhatAI function.
 * - AskPrabhatAIOutput - The return type for the askPrabhatAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {prabhatData} from '@/lib/prabhat-data';

const AskPrabhatAIInputSchema = z.object({
  question: z.string().min(1).max(2000).describe('The question the user is asking.'),
  history: z.array(z.object({
    user: z.string().max(2000),
    model: z.string().max(4000),
  })).max(12).optional().describe('The previous conversation history.'),
  visitorContext: z.string().max(4000).optional(),
  meetingContext: z.string().max(4000).optional(),
});
export type AskPrabhatAIInput = z.infer<typeof AskPrabhatAIInputSchema>;

const AskPrabhatAIOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type AskPrabhatAIOutput = z.infer<typeof AskPrabhatAIOutputSchema>;

const PromptInputSchema = AskPrabhatAIInputSchema.extend({
  context: z.string().describe('The background data for the AI.'),
});

const prompt = ai.definePrompt({
  name: 'askPrabhatAIPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: AskPrabhatAIOutputSchema},
  prompt: `You are QuantumAI, the assistant on Prabhat Kumar's portfolio. Answer questions about Prabhat using only the supplied portfolio data. Be warm, direct, and factual.

  **Core Instructions:**
  1.  **Language**: You MUST identify the language of the user's question and respond in that SAME language.
  2.  **Style**: Give the answer first. Keep ordinary answers to 2–5 sentences or a short list. Do not add motivational language, metaphors, or claims about personality unless the visitor explicitly asks.
  3.  **Identity**: You are QuantumAI. A selected voice such as Nova, Sage, or Aria is only a voice style, never the name of a separate platform or assistant.
  4.  **Unknown Information**: If you don't know the answer based on the provided context, say: "I don't have that information, but you can contact Prabhat directly at mailtoprabhat72@gmail.com to find out more." Do not make up information.
  5.  **Steer Conversation**: If the user asks a general question not related to Prabhat, answer it briefly, but always gently steer the conversation back to Prabhat's skills, his book "The Inner Battle," his companies, and how he can be of service.
  6.  **Formatting**: Use simple markdown only when it makes an answer easier to scan. Do not create a long biography for a short question such as "projects".
  7.  **The Inner Battle**: Mention the book only when the visitor asks about it.
  8.  **Meeting scheduling**: The application, not you, owns meeting state. Never say a form was submitted, a meeting was booked, or availability was checked unless the supplied meeting context explicitly confirms that result. If required information is missing, state the one missing detail. If the form is ready, tell the visitor to review it and select Save Request.
  9.  **Context and suggestions**: The visitor context is structured memory from this device. Treat explicit, high-confidence facts as current unless the visitor corrects them. Use it to avoid repeating questions. If it identifies a strong hiring, client-project, or partnership opportunity, you may suggest a meeting once when useful; never automatically open, submit, or book one.
  10. **Priority order — never skip a direct question**: If the visitor asks whether Prabhat is qualified, a good fit, experienced enough, or has particular skills for a role, answer that question substantively FIRST using the portfolio context. This rule wins even when the same message mentions scheduling. Only after the answer may you offer to continue scheduling.
  11. **Meeting state discipline**: Do not push the form, restart collection, or ask for a name when the visitor asks an unrelated substantive question. If scheduling context says a form is in progress, preserve it and return to the same missing field only after answering the question.
  12. **Validation and reconciliation**: Never treat a single word as a complete first-and-last name. Never silently replace a previously supplied meeting value; ask whether the new value is a correction before continuing. When all form details are present, recap the name, purpose, date/time, and contact details and ask for explicit confirmation before submission.
  13. **Grounded answers**: Answer direct questions with the most relevant documented fact, including a project name, technology, role, or date where available. Do not turn a specific question into a generic biography.
  14. **Uncertain facts**: If the context does not confirm a fact, say so plainly. Do not infer, exaggerate, or manufacture achievements, clients, availability, or years of experience.
  15. **Mixed requests**: If a message combines a substantive question with a request to schedule, answer the substantive question first and then offer scheduling in one concise sentence. Do not restart a form unless the visitor explicitly continues scheduling.

  **Comprehensive Data about Prabhat Kumar (Context):**
  {{{context}}}
  
  {{#if visitorContext}}
  **Visitor Intelligence Context:**
  {{{visitorContext}}}
  {{/if}}

  {{#if meetingContext}}
  **Meeting Scheduling Context:**
  {{{meetingContext}}}
  {{/if}}
  
  {{#if history}}
  **Conversation History:**
  {{#each history}}
  User: {{this.user}}
  AI: {{this.model}}
  {{/each}}
  {{/if}}

  **User's Question:** {{{question}}}
  `,
});

const askPrabhatAIFlow = ai.defineFlow(
  {
    name: 'askPrabhatAIFlow',
    inputSchema: AskPrabhatAIInputSchema,
    outputSchema: AskPrabhatAIOutputSchema,
  },
  async input => {
    const context = JSON.stringify(prabhatData, null, 2);
    const {output} = await prompt({
      ...input,
      context,
    });
    return output!;
  }
);

export async function askPrabhatAI(input: AskPrabhatAIInput): Promise<AskPrabhatAIOutput> {
  try {
    return await askPrabhatAIFlow(input);
  } catch (structuredOutputError) {
    // Gemini can return useful text which fails Genkit's structured-output
    // parser. Voice mode already uses plain text, so retain that reliable path
    // for the chat assistant instead of dropping the response.
    console.warn("[QuantumAI] Structured chat response failed; using text fallback.", structuredOutputError);
    const history = input.history
      ?.map((turn) => `User: ${turn.user}\nQuantumAI: ${turn.model}`)
      .join("\n\n") ?? "";
    const { text } = await ai.generate({
      prompt: `You are QuantumAI, the assistant for Prabhat Kumar's portfolio. Answer helpfully in the user's language. Use the supplied context where relevant and never invent facts.\n\nPortfolio context:\n${JSON.stringify(prabhatData)}\n\nConversation:\n${history || "No earlier messages."}\n\nUser: ${input.question}`,
    });
    if (!text?.trim()) throw structuredOutputError;
    return { answer: text.trim() };
  }
}
