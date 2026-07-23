import { ToolContext, ToolResult } from './tool-types';
import { defaultToolRegistry } from './tool-registry';
import { ToolRouter } from './tool-router';

export class ToolOrchestrator {
  private router = new ToolRouter();

  async execute(context: ToolContext): Promise<ToolResult | null> {
    const tools = defaultToolRegistry.getAllTools();
    const routeDecision = await this.router.route(context, tools);
    
    if (routeDecision.tool) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[ToolOrchestrator] Executing tool: ${routeDecision.tool.name}`);
      }
      return routeDecision.tool.execute(context);
    }
    
    // No specific tool matched, fallback to null (caller should handle default flow)
    return null;
  }
}

export const toolOrchestrator = new ToolOrchestrator();
