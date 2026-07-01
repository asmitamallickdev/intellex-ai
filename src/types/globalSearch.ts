export type SearchResultType = "SKILL" | "FILE" | "DOCUMENT" | "CHAT" | "MESSAGE" | "MEMORY" | "CHUNK";

export interface UnifiedSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  score: number; // Normalized similarity/relevance score from 0.0 to 1.0
  skillId: string;
  skillName?: string;
  createdAt: string;
  updatedAt: string;
  matchedFields: string[];
  navigationId: {
    skillId: string;
    chatId?: string | null;
    fileId?: string | null;
    documentId?: string | null;
    messageId?: string | null;
    memoryId?: string | null;
  };
  metadata?: any;
}

export interface GroupedSearchResults {
  all: UnifiedSearchResult[];
  byType: Record<SearchResultType, UnifiedSearchResult[]>;
  totalCount: number;
}

export interface SearchFilters {
  skillId?: string | null;
  fileTypes?: string[] | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  categories?: string[] | null;
  memoryImportance?: string[] | null;
  scope?: SearchResultType[] | null;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sortBy?: "relevance" | "recent" | "alphabetical" | "referenced";
  limit?: number;
  offset?: number;
}

export interface GlobalSearchResponse<T = GroupedSearchResults> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}
