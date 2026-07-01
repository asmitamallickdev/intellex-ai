"use server";

import { GlobalSearchService } from "../services/globalSearch.service";
import { globalSearchSchema } from "../validators/globalSearch.validator";
import { GlobalSearchResponse, GroupedSearchResults } from "../types/globalSearch";

/**
 * Server Action: Executes a consolidated global workspace search.
 */
export async function triggerGlobalSearchAction(
  query: string,
  options?: {
    filters?: {
      skillId?: string | null;
      fileTypes?: string[] | null;
      dateFrom?: string | null;
      dateTo?: string | null;
      categories?: string[] | null;
      memoryImportance?: string[] | null;
      scope?: any[] | null;
    };
    sortBy?: "relevance" | "recent" | "alphabetical" | "referenced";
    limit?: number;
    offset?: number;
  }
): Promise<GlobalSearchResponse<GroupedSearchResults>> {
  try {
    // 1. Zod schema validation
    const payload = {
      query,
      filters: options?.filters,
      sortBy: options?.sortBy || "relevance",
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    };

    const validated = globalSearchSchema.safeParse(payload);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return {
        success: false,
        error: errorMsg,
        message: "Search parameters validation failed.",
        statusCode: 400,
      };
    }

    // 2. Query search aggregator service
    const results = await GlobalSearchService.search(validated.data as any);

    return {
      success: true,
      data: results,
      message: `Search complete. Found ${results.totalCount} matching records.`,
      statusCode: 200,
    };
  } catch (err: any) {
    console.error(`[Global Search Action] Consolidated query failed for query "${query}":`, err);
    return {
      success: false,
      error: err.message || "Failed to execute global search query.",
      statusCode: 500,
    };
  }
}
