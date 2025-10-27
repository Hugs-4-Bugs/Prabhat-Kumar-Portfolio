// src/ai/flows/detect-spam-contact-form.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting spam in contact form messages.
 *
 * The flow uses a generative AI model to classify messages as spam or not spam.
 *
 * @fileOverview
 * - detectSpam: A function to classify contact form messages as spam or not spam.
 * - DetectSpamInput: The input type for the detectSpam function.
 * - DetectSpamOutput: The return type for the detectSpam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSpamInputSchema = z.object({
  message: z.string().describe('The message from the contact form.'),
});
export type DetectSpamInput = z.infer<typeof DetectSpamInputSchema>;

const DetectSpamOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the message is spam or not.'),
  reason: z.string().optional().describe('The reason why the message is classified as spam, if applicable.'),
});
export type DetectSpamOutput = z.infer<typeof DetectSpamOutputSchema>;

export async function detectSpam(input: DetectSpamInput): Promise<DetectSpamOutput> {
  return detectSpamFlow(input);
}

const detectSpamPrompt = ai.definePrompt({
  name: 'detectSpamPrompt',
  input: {schema: DetectSpamInputSchema},
  output: {schema: DetectSpamOutputSchema},
  prompt: `You are an AI assistant that classifies contact form messages as spam or not spam.

  Analyze the following message and determine if it is spam.

  Message: {{{message}}}

  Return a JSON object with the \"isSpam\" field set to true if the message is spam, and false otherwise.
  If the message is spam, include a \"reason\" field explaining why the message is classified as spam.
  `,
});

const detectSpamFlow = ai.defineFlow(
  {
    name: 'detectSpamFlow',
    inputSchema: DetectSpamInputSchema,
    outputSchema: DetectSpamOutputSchema,
  },
  async input => {
    const {output} = await detectSpamPrompt(input);
    return output!;
  }
); 
