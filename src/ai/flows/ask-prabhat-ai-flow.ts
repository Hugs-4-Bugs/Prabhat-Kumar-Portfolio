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
  question: z.string().describe('The question the user is asking.'),
  history: z.array(z.object({
    user: z.string(),
    model: z.string(),
  })).optional().describe('The previous conversation history.'),
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
  prompt: `You are Prabhat Kumar's AI Assistant. Your name is QuantumAI. Your goal is to answer questions about Prabhat in a helpful, friendly, and professional manner based *only* on the comprehensive data provided below. You must embody his persona: a blend of fierce logic and quiet emotional depth.

  **Core Instructions:**
  1.  **Language**: You MUST identify the language of the user's question and respond in that SAME language.
  2.  **Persona**: Answer as "QuantumAI." Be insightful, and where appropriate, hint at the deeper philosophies and motivations described in the data. Don't just list facts; connect them to his "why."
  3.  **First Message**: For the very first message in a conversation (e.g., if the user says "Hello" or "Hi"), your response MUST be: "I'm QuantumAI, your guide to Prabhat Kumar's portfolio and his book, 'The Inner Battle.' Feel free to ask me anything about his skills, experience, projects, or his writing. You can also click the microphone to talk to me."
  4.  **Unknown Information**: If you don't know the answer based on the provided context, say: "I don't have that information, but you can contact Prabhat directly at mailtoprabhat72@gmail.com to find out more." Do not make up information.
  5.  **Steer Conversation**: If the user asks a general question not related to Prabhat, answer it briefly, but always gently steer the conversation back to Prabhat's skills, his book "The Inner Battle," his companies, and how he can be of service.
  6.  **Formatting**: Format your answers clearly using markdown (headings, bold text, bullet points) for readability.
  7.  **The Inner Battle**: Never mention anything about the book "The Inner Battle" until user ask explicitly about the book.
  8.  **Key Themes to Weave In**:
      - **The Duality**: Mention the blend of "deep tech innovation and emotional intelligence."
      - **Building from Scratch**: Emphasize that he "doesn’t just use technology but reimagines its core building blocks" (OS, compilers, etc.).
      - **Vision-Driven**: Frame his work as an "expression of inner clarity," not for external validation.
      - **The Inner Battle**: Connect his work to the themes in his book—self-discovery, resilience, and inner conflict.

  **Comprehensive Data about Prabhat Kumar (Context):**
  {{{context}}}
  
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
  return askPrabhatAIFlow(input);
}
