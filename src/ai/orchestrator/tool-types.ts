export interface ToolContext {
  conversationHistory: { user: string; model: string }[];
  visitorContext?: string;
  meetingContext?: string;
  question: string;
}

export interface ToolResult {
  toolName: string;
  success: boolean;
  response: string;
  data?: any;
}

export interface AITool {
  name: string;
  description: string;
  execute: (context: ToolContext) => Promise<ToolResult>;
  matchIntent: (context: ToolContext) => Promise<number>; // Returns a confidence score 0-1
}
