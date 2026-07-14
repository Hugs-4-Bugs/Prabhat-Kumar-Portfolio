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
import {prabhatData} from '@/lib/prabhat-data';

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
  prompt: `You are QuantumAI's project analysis engine for Prabhat Kumar's portfolio.

You can analyze:
- Any project listed in Prabhat's portfolio.
- Any project idea pasted by a visitor, even if it is not part of Prabhat's portfolio.
- Short project names, rough notes, long descriptions, architecture summaries, or business ideas.

When the visitor mentions one of Prabhat's known projects, use the portfolio context below to recognize it and analyze it accurately. When the visitor gives an unrelated project, analyze it as an external product/project idea.

Portfolio context:
${JSON.stringify(prabhatData.projects, null, 2)}

Project or request to analyze:
{{description}}

Return a practical, senior-engineer-style analysis and concrete suggestions. Cover value proposition, target users, technical strength, missing details, scalability, reliability, UI/UX, business impact, and how to describe the project more strongly. Keep it useful and direct.`,
});

const analyzeProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeProjectDescriptionFlow',
    inputSchema: AnalyzeProjectDescriptionInputSchema,
    outputSchema: AnalyzeProjectDescriptionOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (output?.analysis && output?.suggestions) {
        return output;
      }
    } catch (error) {
      console.warn('Project analyzer AI failed; using local fallback:', error);
    }

    return buildFallbackAnalysis(input.description);
  }
);

function buildFallbackAnalysis(description: string): AnalyzeProjectDescriptionOutput {
  const normalizedDescription = description.trim();
  const knownProject = prabhatData.projects.top_projects.find((project) => {
    const name = project.name.toLowerCase();
    const query = normalizedDescription.toLowerCase();
    return query.includes(name) || name.includes(query);
  });

  const subject = knownProject
    ? `${knownProject.name}: ${knownProject.summary}`
    : normalizedDescription;

  return {
    analysis: [
      `This project has a clear foundation, but the description should explain the problem, the target user, and the measurable outcome more sharply.`,
      knownProject
        ? `From Prabhat's portfolio context, ${knownProject.name} is strongest when positioned around this core value: ${knownProject.summary}`
        : `Based on the provided idea, the strongest angle is to turn "${subject}" into a clear product story: who it helps, what pain it removes, and why the implementation is credible.`,
      `A stronger analysis should mention the architecture, key workflows, data flow, security or reliability concerns, and the business result expected from the project.`,
    ].join('\n\n'),
    suggestions: [
      `Rewrite the description with this structure: problem, solution, core features, technology, impact, and proof.`,
      `Add concrete details such as APIs, database design, authentication, cloud deployment, automation, performance, analytics, or AI integration where relevant.`,
      `Mention the target users and success metrics, for example conversion lift, cost reduction, faster workflow, improved reliability, or better decision-making.`,
      `If this is a portfolio project, connect it to Prabhat's strengths in Java, Spring Boot, AI systems, cloud architecture, full-stack execution, and production-grade thinking.`,
    ].join('\n\n'),
  };
}
