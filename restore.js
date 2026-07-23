const fs = require('fs');
let code = fs.readFileSync('src/app/actions.ts', 'utf8');

// I'll manually replace the broken block for getAISearchResponse.
code = code.replace(
  /\/\/ AI Search Action[\s\S]*?(?=\/\*\*\n \* Specialized AI response action)/m,
  `// AI Search Action
export async function getAISearchResponse(question: string, history: Array<{ user: string; model: string }>) {
  if (!question.trim()) {
    return { success: false, message: "Please enter a question." };
  }
  try {
    const response = await askPrabhatAI({ question, history });
    return { success: true, answer: response.answer };
  } catch (error) {
    console.error("Error getting AI search response:", error);
    return { success: false, message: "Sorry, I couldn't get a response from the AI." };
  }
}

export async function extractMeetingFieldsAction(query: string, currentData: Record<string, any>) {
  try {
    const result = await extractMeetingFieldsFlow({ query, currentData });
    return { success: true, data: result };
  } catch (e: any) {
    console.error("Error extracting meeting fields:", e);
    return { success: false };
  }
}

`
);
fs.writeFileSync('src/app/actions.ts', code);
