import { MemoryItem, MemoryCategory, MemoryStore } from './memory-types';
import { isAllowedMemory } from './memory-policy';

const MEMORY_STORAGE_KEY = 'quantumai_longterm_memory_v1';

export class LocalMemoryStore implements MemoryStore {
  
  private readStore(): MemoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeStore(items: MemoryItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[MemoryStore] Failed to write memory', e);
    }
  }

  async addMemory(category: MemoryCategory, content: string, hasConsent: boolean): Promise<MemoryItem | null> {
    if (!isAllowedMemory(content, hasConsent)) {
      console.warn('[MemoryStore] Blocked by memory policy or lacking consent.');
      return null;
    }
    
    const items = this.readStore();
    const newItem: MemoryItem = {
      id: crypto.randomUUID(),
      category,
      content,
      createdAt: Date.now(),
      explicitConsent: hasConsent,
    };
    
    items.push(newItem);
    this.writeStore(items);
    return newItem;
  }

  async getMemories(categories?: MemoryCategory[]): Promise<MemoryItem[]> {
    const items = this.readStore();
    if (!categories || categories.length === 0) return items;
    return items.filter(item => categories.includes(item.category));
  }

  async deleteMemory(id: string): Promise<boolean> {
    const items = this.readStore();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length !== items.length) {
      this.writeStore(filtered);
      return true;
    }
    return false;
  }

  async clearAll(): Promise<void> {
    this.writeStore([]);
  }
}
