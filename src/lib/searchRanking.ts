import { UnifiedSearchResult } from "../types/globalSearch";

/**
 * Normalizes a raw relevance score from database query outputs into standard [0, 1] range.
 */
export function normalizeScore(
  rawScore: number,
  type: "vector" | "text" | "fuzzy"
): number {
  if (rawScore === undefined || rawScore === null || isNaN(rawScore)) {
    return 0.1;
  }

  switch (type) {
    case "vector":
      // Cosine distance <=> range is [0, 2]. Similarity is 1 - distance.
      // Boost relevance range mapping
      const similarity = 1 - rawScore;
      return parseFloat(Math.max(0, Math.min(1, similarity)).toFixed(4));

    case "text":
      // ts_rank range is usually [0, 1+] but is technically unbounded.
      // Map using a logarithmic scale formula: score / (score + 1)
      const mapped = rawScore / (rawScore + 1);
      return parseFloat(Math.max(0, Math.min(1, mapped)).toFixed(4));

    case "fuzzy":
    default:
      // Default linear scale helper
      return parseFloat(Math.max(0, Math.min(1, rawScore)).toFixed(4));
  }
}

/**
 * Reranks combined search results based on options.
 */
export function sortSearchResults(
  results: UnifiedSearchResult[],
  sortBy: "relevance" | "recent" | "alphabetical" | "referenced"
): UnifiedSearchResult[] {
  switch (sortBy) {
    case "recent":
      return results.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case "alphabetical":
      return results.sort((a, b) => a.title.localeCompare(b.title));

    case "referenced":
      // Sort based on references / hierarchy depth (like count of matches or importance)
      return results.sort((a, b) => b.matchedFields.length - a.matchedFields.length);

    case "relevance":
    default:
      return results.sort((a, b) => b.score - a.score);
  }
}
