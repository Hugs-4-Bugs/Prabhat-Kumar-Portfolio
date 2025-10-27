'use server';
/**
 * @fileOverview Parses a resume to extract information for auto-filling a contact form and key resume details.
 *
 * - parseResumeAndAutofill - A function that takes resume data as input and returns extracted information.
 * - ParseResumeAndAutofillInput - The input type for the parseResumeAndAutofill function.
 * - ParseResumeAndAutofillOutput - The return type for the parseResumeAndAutofill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeAndAutofillInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeAndAutofillInput = z.infer<typeof ParseResumeAndAutofillInputSchema>;

const ParseResumeAndAutofillOutputSchema = z.object({
  name: z.string().describe('The name of the resume owner.'),
  email: z.string().email().describe('The email address of the resume owner.'),
  phone: z.string().describe('The phone number of the resume owner.'),
  experienceSummary: z.string().describe('A brief summary of the resume owner\'s experience.'),
  skills: z.array(z.string()).describe('An array of skills listed in the resume.'),
});
export type ParseResumeAndAutofillOutput = z.infer<typeof ParseResumeAndAutofillOutputSchema>;

export async function parseResumeAndAutofill(input: ParseResumeAndAutofillInput): Promise<ParseResumeAndAutofillOutput> {
  return parseResumeAndAutofillFlow(input);
}

const resumeParsingPrompt = ai.definePrompt({
  name: 'resumeParsingPrompt',
  input: {schema: ParseResumeAndAutofillInputSchema},
  output: {schema: ParseResumeAndAutofillOutputSchema},
  prompt: `You are an expert resume parser, extracting information to pre-fill a contact form and key resume details.

  Analyze the resume content provided and extract the following information:
  - Name
  - Email Address
  - Phone Number
  - A brief summary of the person\'s experience
  - A list of skills

  Resume Content: {{media url=resumeDataUri}}
  `,
});

const parseResumeAndAutofillFlow = ai.defineFlow(
  {
    name: 'parseResumeAndAutofillFlow',
    inputSchema: ParseResumeAndAutofillInputSchema,
    outputSchema: ParseResumeAndAutofillOutputSchema,
  },
  async input => {
    const {output} = await resumeParsingPrompt(input);
    return output!;
  }
);
