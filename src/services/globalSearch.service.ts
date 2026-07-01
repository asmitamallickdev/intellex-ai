import { SearchOptions, GroupedSearchResults, SearchResultType } from "../types/globalSearch";
import { aggregateSearchResults } from "../lib/searchAggregator";
import { sortSearchResults } from "../lib/searchRanking";

export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export class GlobalSearchService {
  /**
   * Performs a consolidated global search across all workspace entities.
   */
  static async search(
    options: SearchOptions
  ): Promise<GroupedSearchResults> {
    const startTime = Date.now();
    console.log(`[Global Search Service] Initializing query search. Query="${options.query}"`);

    // 1. Fetch matching rows across different models
    const rawResults = await aggregateSearchResults(DEV_USER_ID, options);

    // 2. Remove duplicates (using entity type and id comparison)
    const seen = new Set<string>();
    const deduplicated = rawResults.filter((r) => {
      const key = `${r.type}-${r.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 3. Sort search results
    const sorted = sortSearchResults(deduplicated, options.sortBy || "relevance");

    // 4. Apply pagination offsets
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    const paginated = sorted.slice(offset, offset + limit);

    // 5. Group by result type
    const byType: Record<SearchResultType, any[]> = {
      SKILL: [],
      FILE: [],
      DOCUMENT: [],
      CHAT: [],
      MESSAGE: [],
      MEMORY: [],
      CHUNK: [],
    };

    paginated.forEach((item) => {
      if (byType[item.type]) {
        byType[item.type].push(item);
      }
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Global Search Service] Completed query in ${elapsed}ms. Found ${deduplicated.length} total hits.`);

    return {
      all: paginated,
      byType,
      totalCount: deduplicated.length,
    };
  }
}
