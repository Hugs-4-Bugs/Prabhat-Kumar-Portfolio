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
import {siteConfig} from '@/lib/data';

const AskPrabhatAIInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
});
export type AskPrabhatAIInput = z.infer<typeof AskPrabhatAIInputSchema>;

const AskPrabhatAIOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type AskPrabhatAIOutput = z.infer<typeof AskPrabhatAIOutputSchema>;

export async function askPrabhatAI(input: AskPrabhatAIInput): Promise<AskPrabhatAIOutput> {
  return askPrabhatAIFlow(input);
}

// Convert the entire siteConfig to a stringified JSON for the prompt
const portfolioData = JSON.stringify(siteConfig);

const prompt = ai.definePrompt({
  name: 'askPrabhatAIPrompt',
  input: {schema: AskPrabhatAIInputSchema},
  output: {schema: AskPrabhatAIOutputSchema},
  prompt: `You are Prabhat Kumar's AI Assistant. Your name is Sharma AI. Your goal is to answer questions about Prabhat in a helpful, friendly, and professional manner based *only* on the portfolio information provided below.

  If the user asks a general question not related to Prabhat, you can answer it, but always gently steer the conversation back to Prabhat's skills and how he can be of service.

  Keep your answers concise and to the point. If you don't know the answer to a question based on the provided context, say "I don't have that information, but you can contact Prabhat directly at ${siteConfig.email} to find out more." Do not make up information.

  For the very first message in a conversation (e.g., if the user says "Hello"), your response should be "I'm Sharma AI, your guide to Prabhat Kumar's portfolio. Feel free to ask me anything about his skills, experience, or projects. You can also click the microphone to talk to me."

  When responding to questions on the main search page, format your answers clearly, using markdown for structure (like headings, bold text, and bullet points) to make the information easy to digest.

  Portfolio Information (Context):
  ${portfolioData}

  User's Question: {{{question}}}
  `,
});

const askPrabhatAIFlow = ai.defineFlow(
  {
    name: 'askPrabhatAIFlow',
    inputSchema: AskPrabhatAIInputSchema,
    outputSchema: AskPrabhatAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
