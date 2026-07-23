import { defaultToolRegistry } from '../orchestrator/tool-registry';
import { AITool, ToolContext } from '../orchestrator/tool-types';
import { askPrabhatAI } from '../flows/ask-prabhat-ai-flow';

export const PortfolioKnowledgeTool: AITool = {
  name: 'PortfolioKnowledge',
  description: 'Answers general questions about Prabhat Kumar, his expertise, background, and overview of his portfolio.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    const response = await askPrabhatAI({
      question: context.question,
      history: context.conversationHistory,
    });
    
    return {
      toolName: 'PortfolioKnowledge',
      success: true,
      response: response.answer,
    };
  }
};

export const ProjectExplainerTool: AITool = {
  name: 'ProjectExplainer',
  description: 'Explains specific projects built by Prabhat, including QuantumFusion, CodeGuard AI, Trading Bots, and others.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    const response = await askPrabhatAI({
      question: context.question + " (Focus specifically on project details, architecture, and impact)",
      history: context.conversationHistory,
    });
    return { toolName: 'ProjectExplainer', success: true, response: response.answer };
  }
};

export const SkillsExplainerTool: AITool = {
  name: 'SkillsExplainer',
  description: 'Discusses Prabhat\'s specific technical skills, programming languages, frameworks like Java, Spring Boot, React, Next.js, AI mapping, AWS, etc.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    const response = await askPrabhatAI({
      question: context.question + " (Focus specifically on technical skills, proficiency, and application of technologies)",
      history: context.conversationHistory,
    });
    return { toolName: 'SkillsExplainer', success: true, response: response.answer };
  }
};

export const WorkExperienceTool: AITool = {
  name: 'WorkExperience',
  description: 'Discusses Prabhat\'s professional work history, roles at Netcore Cloud or CodeSpeedy, and internships.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    const response = await askPrabhatAI({
      question: context.question + " (Focus strictly on work history, employers, roles, and professional achievements)",
      history: context.conversationHistory,
    });
    return { toolName: 'WorkExperience', success: true, response: response.answer };
  }
};

export const ResumeInformationTool: AITool = {
  name: 'ResumeInformation',
  description: 'Discusses details found on a standard resume, including education, summary, and contact information for formal hiring contexts.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    const response = await askPrabhatAI({
      question: context.question + " (Focus on resume-specific details, education, and professional summary)",
      history: context.conversationHistory,
    });
    return { toolName: 'ResumeInformation', success: true, response: response.answer };
  }
};

export const MeetingSchedulingTool: AITool = {
  name: 'MeetingScheduling',
  description: 'Initiates or processes requests to schedule a meeting, call, or discussion with Prabhat.',
  matchIntent: async () => 0.5,
  execute: async (context: ToolContext) => {
    // Rely on the existing AI flow, but append instructions to trigger the meeting flow properly.
    // The existing meeting UI triggers extract-meeting-fields-flow independently on the client side,
    // so this tool mainly outputs a conversational prompt engaging the existing frontend workflow.
    const response = await askPrabhatAI({
      question: context.question + " (Acknowledge their request to schedule a meeting. Advise them you can help with that, and prompt for their name/email if not provided, or simply state you are opening the scheduler.)",
      history: context.conversationHistory,
    });
    return { toolName: 'MeetingScheduling', success: true, response: response.answer };
  }
};

// Register all core tools
defaultToolRegistry.registerTool(PortfolioKnowledgeTool);
defaultToolRegistry.registerTool(ProjectExplainerTool);
defaultToolRegistry.registerTool(SkillsExplainerTool);
defaultToolRegistry.registerTool(WorkExperienceTool);
defaultToolRegistry.registerTool(ResumeInformationTool);
defaultToolRegistry.registerTool(MeetingSchedulingTool);
