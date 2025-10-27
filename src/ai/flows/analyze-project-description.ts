'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing project descriptions and suggesting improvements.
 *
 * It exports:
 * - `analyzeProjectDescription`: A function that takes a project description as input and returns an analysis with suggestions for improvement.
 * - `AnalyzeProjectDescriptionInput`: The input type for the `analyzeProjectDescription` function.
 * - `AnalyzeProjectDescriptionOutput`: The output type for the `analyzeProjectDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProjectDescriptionInputSchema = z.object({
  description: z.string().describe('The project description to analyze.'),
});
export type AnalyzeProjectDescriptionInput = z.infer<typeof AnalyzeProjectDescriptionInputSchema>;

const AnalyzeProjectDescriptionOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the project description.'),
  suggestions: z.string().describe('Suggestions for improving the project description.'),
});
export type AnalyzeProjectDescriptionOutput = z.infer<typeof AnalyzeProjectDescriptionOutputSchema>;

export async function analyzeProjectDescription(
  input: AnalyzeProjectDescriptionInput
): Promise<AnalyzeProjectDescriptionOutput> {
  return analyzeProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProjectDescriptionPrompt',
  input: {schema: AnalyzeProjectDescriptionInputSchema},
  output: {schema: AnalyzeProjectDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter. Analyze the following project description and provide suggestions for improvement to make it more effective at attracting attention and showcasing the project\'s value.\n\nProject Description:\n{{description}}\n\nProvide an analysis of the description, and then provide concrete suggestions for improvement. Focus on clarity, conciseness, and impact.`,
});

const analyzeProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeProjectDescriptionFlow',
    inputSchema: AnalyzeProjectDescriptionInputSchema,
    outputSchema: AnalyzeProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
