import { MemoryCategory } from './memory-types';

/**
 * Validates if the given content is permitted to be stored based on strict privacy rules.
 * Never stores passwords, payment details, or PII without explicit bounds.
 */
export function isAllowedMemory(content: string, hasConsent: boolean): boolean {
  if (!hasConsent) return false;
  
  // Basic heuristic list of forbidden keywords for safety (this should be an LLM filter in full production)
  const forbiddenKeywords = ['password', 'credit card', 'ssn', 'social security'];
  const lowerContent = content.toLowerCase();
  
  for (const keyword of forbiddenKeywords) {
    if (lowerContent.includes(keyword)) {
      return false;
    }
  }
  
  return true;
}
