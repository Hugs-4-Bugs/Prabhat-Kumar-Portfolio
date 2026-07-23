import { ai } from '@/ai/genkit';
import { AITool, ToolContext } from './tool-types';
import { z } from 'zod';

const IntentSchema = z.object({
  selectedTool: z.string().describe('The name of the best matching tool, or "none" if no tool is a good match.'),
  confidence: z.number().describe('Confidence score between 0 and 1'),
  reasoning: z.string().describe('Why this tool was selected (for logging / debugging)'),
});

export class ToolRouter {
  async route(context: ToolContext, tools: AITool[]): Promise<{ tool?: AITool, score: number }> {
    if (tools.length === 0) return { score: 0 };
    
    // Fast LLM-based intent routing to avoid hardcoded keyword matching
    const toolDescriptions = tools.map(t => `- ${t.name}: ${t.description}`).join('\n');
    
    try {
      const { output } = await ai.generate({
        prompt: `
You are an intelligent intent router. Based on the user's question and conversation history, select the appropriate tool to handle the request.
Here are the available tools:
${toolDescriptions}
- none: Use this if no specific tool is required and generic conversation is preferred.

Conversation History:
${context.conversationHistory.map(h => `User: ${h.user}\nAI: ${h.model}`).join('\n')}

Latest Question: ${context.question}

Select the absolute best tool.
`,
        output: { schema: IntentSchema }
      });
      
      const { selectedTool, confidence, reasoning } = output!;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[ToolRouter] Selected: ${selectedTool} | Confidence: ${confidence} | Reasoning: ${reasoning}`);
      }
      
      if (selectedTool !== 'none' && confidence > 0.6) {
        const tool = tools.find(t => t.name === selectedTool);
        if (tool) return { tool, score: confidence };
      }
    } catch (e) {
      console.error("[ToolRouter] Error routing intent", e);
    }
    
    return { score: 0 };
  }
}
