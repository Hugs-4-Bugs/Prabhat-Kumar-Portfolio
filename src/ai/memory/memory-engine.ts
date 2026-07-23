import { LocalMemoryStore } from './memory-store';
import { MemorySearch } from './memory-search';
import { MemoryItem, MemoryCategory } from './memory-types';

export class MemoryEngine {
  private store = new LocalMemoryStore();
  private search = new MemorySearch();

  async remember(category: MemoryCategory, content: string, hasConsent: boolean = true): Promise<MemoryItem | null> {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MemoryEngine] Storing: (${category}) "${content}"`);
    }
    return this.store.addMemory(category, content, hasConsent);
  }

  async recallContext(query: string, maxItems: number = 3): Promise<string> {
    const memories = await this.store.getMemories();
    if (memories.length === 0) return '';
    
    // Search applicable memories based on query
    const relevant = await this.search.searchMemories(memories, query, maxItems);
    
    if (relevant.length === 0) return '';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MemoryEngine] Recalled context:`, relevant);
    }
    
    // Injectable context string
    return relevant.map(m => `- [${m.category}]: ${m.content}`).join('\n');
  }

  async forget(id: string): Promise<boolean> {
    return this.store.deleteMemory(id);
  }

  async clear(): Promise<void> {
    return this.store.clearAll();
  }
}

export const memoryEngine = new MemoryEngine();
