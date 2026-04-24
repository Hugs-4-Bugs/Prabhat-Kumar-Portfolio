
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-project-description.ts';
import '@/ai/flows/detect-spam-contact-form.ts';
import '@/ai/flows/parse-resume-autofill-form.ts';
import '@/ai/flows/suggest-resume-improvements.ts';
import '@/ai/flows/ask-prabhat-ai-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';

