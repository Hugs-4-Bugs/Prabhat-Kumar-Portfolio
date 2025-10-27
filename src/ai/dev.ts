import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-project-description.ts';
import '@/ai/flows/detect-spam-contact-form.ts';
import '@/ai/flows/parse-resume-autofill-form.ts';
import '@/ai/flows/suggest-resume-improvements.ts';