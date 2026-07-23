import { MemoryItem, MemoryCategory } from './memory-types';

export class MemorySearch {
  
  /**
   * Extremely simple fallback term frequency search.
   * In a future production environment with a vector DB, this would run embedding searches.
   */
  async searchMemories(items: MemoryItem[], query: string, topK: number = 3): Promise<MemoryItem[]> {
    if (!query) return items.slice(0, topK);
    
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (terms.length === 0) return items.slice(0, topK);

    const scored = items.map(item => {
      let score = 0;
      const lowerContent = item.content.toLowerCase();
      terms.forEach(t => {
        if (lowerContent.includes(t)) score++;
      });
      return { item, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.item);
  }
}
