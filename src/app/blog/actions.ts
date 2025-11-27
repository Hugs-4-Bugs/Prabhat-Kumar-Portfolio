// src/app/blog/actions.ts
'use server';

import { summarizeAndAnswerBlog } from '@/ai/flows/summarize-and-qa-blog-flow';

export async function getBlogSummary(content: string) {
  try {
    const result = await summarizeAndAnswerBlog({ content, task: 'summarize' });
    return { success: true, summary: result.response };
  } catch (error) {
    console.error('Error getting blog summary:', error);
    return { success: false, message: 'Could not generate summary.' };
  }
}

export async function getBlogAnswer(content: string, question: string) {
    if (!question.trim()) {
        return { success: false, message: 'Please enter a question.' };
    }
  try {
    const result = await summarizeAndAnswerBlog({ content, task: 'answer', question });
    return { success: true, answer: result.response };
  } catch (error) {
    console.error('Error getting blog answer:', error);
    return { success: false, message: 'Could not get an answer from the AI.' };
  }
}
