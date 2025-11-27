'use server';
/**
 * @fileOverview A Genkit flow to summarize blog content or answer questions about it.
 *
 * - summarizeAndAnswerBlog - A function that takes blog content and a task ('summarize' or 'answer').
 * - SummarizeAndAnswerBlogInput - The input type for the function.
 * - SummarizeAndAnswerBlogOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAndAnswerBlogInputSchema = z.object({
  content: z.string().describe('The full HTML content of the blog post.'),
  task: z.enum(['summarize', 'answer']).describe("The task to perform: either 'summarize' the content or 'answer' a question about it."),
  question: z.string().optional().describe('The user\'s question about the blog content. Required only if task is \'answer\'.'),
});
export type SummarizeAndAnswerBlogInput = z.infer<typeof SummarizeAndAnswerBlogInputSchema>;

const SummarizeAndAnswerBlogOutputSchema = z.object({
  response: z.string().describe("The AI's generated summary or answer."),
});
export type SummarizeAndAnswerBlogOutput = z.infer<typeof SummarizeAndAnswerBlogOutputSchema>;

export async function summarizeAndAnswerBlog(
  input: SummarizeAndAnswerBlogInput
): Promise<SummarizeAndAnswerBlogOutput> {
  return summarizeAndAnswerBlogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAndAnswerBlogPrompt',
  input: {schema: SummarizeAndAnswerBlogInputSchema},
  output: {schema: SummarizeAndAnswerBlogOutputSchema},
  prompt: `You are an intelligent AI assistant integrated into a blog. Your task is to help users understand the blog content better.

  Here is the blog content (in HTML format):
  ---
  {{{content}}}
  ---

  The user wants you to perform the following task: "{{task}}"

  {{#if (eq task 'summarize')}}
  Please provide a concise, easy-to-read summary of the key points and main takeaways from the article. The summary should be about 3-4 sentences long.
  {{/if}}

  {{#if (eq task 'answer')}}
  The user has a question: "{{question}}"
  Please answer the user's question based *only* on the information provided in the blog content above. If the answer cannot be found in the text, respond with: "I'm sorry, but I couldn't find the answer to that question in the article content."
  {{/if}}
  `,
});

const summarizeAndAnswerBlogFlow = ai.defineFlow(
  {
    name: 'summarizeAndAnswerBlogFlow',
    inputSchema: SummarizeAndAnswerBlogInputSchema,
    outputSchema: SummarizeAndAnswerBlogOutputSchema,
  },
  async input => {
    // A simple text extraction from HTML. For a real app, a more robust library would be better.
    const plainTextContent = input.content.replace(/<[^>]*>?/gm, ' ');
    
    const {output} = await prompt({...input, content: plainTextContent});
    return output!;
  }
);
