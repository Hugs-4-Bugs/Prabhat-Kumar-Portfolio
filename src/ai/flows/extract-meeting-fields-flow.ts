'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MeetingFormData } from '@/lib/meeting/meeting-types';

const ExtractMeetingFieldsInputSchema = z.object({
  query: z.string(),
  currentData: z.record(z.string(), z.any()),
});

const ExtractMeetingFieldsOutputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  reasonForMeeting: z.string().optional(),
  preferredDate: z.string().optional().describe("ISO date string YYYY-MM-DD"),
  preferredTime: z.string().optional().describe("HH:MM 24h"),
  timezone: z.string().optional().describe("IANA timezone, e.g. 'Asia/Kolkata'"),
  additionalNotes: z.string().optional(),
}).describe("Extracted meeting fields from user natural language.");

export const extractMeetingFieldsFlow = ai.defineFlow(
  {
    name: 'extractMeetingFieldsFlow',
    inputSchema: ExtractMeetingFieldsInputSchema,
    outputSchema: ExtractMeetingFieldsOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
      prompt: `You are an executive assistant extracting meeting scheduling fields from a user's message.
      Already known data: ${JSON.stringify(input.currentData)}
      User Message: "${input.query}"
      
      Only return values for fields that you can extract from the user's message. If a field is not present or implied in the message, do NOT include it. Use standard formats (e.g. ISO date for preferredDate [YYYY-MM-DD], HH:MM for preferredTime, IANA string for timezone).`,
      output: { schema: ExtractMeetingFieldsOutputSchema }
    });
    return output!;
  }
);
