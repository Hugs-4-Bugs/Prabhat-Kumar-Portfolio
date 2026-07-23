export type MemoryCategory = 
  | 'UserPreferences'
  | 'CommunicationPreferences'
  | 'ProfessionalInterests'
  | 'MeetingPreferences'
  | 'PreferredLanguage'
  | 'Timezone'
  | 'TechnicalInterests'
  | 'ConversationPreferences'
  | 'Other';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  createdAt: number;
  lastUsedAt?: number;
  explicitConsent: boolean;
}

export interface MemoryStore {
  addMemory(category: MemoryCategory, content: string, hasConsent: boolean): Promise<MemoryItem | null>;
  getMemories(categories?: MemoryCategory[]): Promise<MemoryItem[]>;
  deleteMemory(id: string): Promise<boolean>;
  clearAll(): Promise<void>;
}
