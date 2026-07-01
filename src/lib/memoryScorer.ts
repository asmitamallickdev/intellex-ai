import { Memory, MemoryImportance } from "@prisma/client";

const ImportanceWeights: Record<MemoryImportance, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

/**
 * Ranks and scores memories based on keyword matching with the query, significance ratings, and access recency.
 */
export function scoreAndRankMemories(
  memories: Memory[],
  query: string
): (Memory & { score: number })[] {
  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);

  const scored = memories.map((memory) => {
    let score = 0;

    // 1. Keyword relevance scoring
    if (queryTokens.length > 0) {
      const contentLower = memory.content.toLowerCase();
      const titleLower = memory.title.toLowerCase();

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 3.0; // higher weight for title match
        if (contentLower.includes(token)) score += 1.5;
      }
    } else {
      score += 1.0; // fallback default
    }

    // 2. Importance multipliers
    const importanceVal = ImportanceWeights[memory.importance] || 2;
    score += importanceVal * 0.5;

    // 3. Recency access weight boost (if accessed in the last 24h, slight boost)
    if (memory.lastAccessedAt) {
      const msSinceAccess = Date.now() - new Date(memory.lastAccessedAt).getTime();
      const hoursSinceAccess = msSinceAccess / (1000 * 60 * 60);
      if (hoursSinceAccess < 24) {
        score += 0.5;
      }
    }

    return {
      ...memory,
      score: parseFloat(score.toFixed(4)),
    };
  });

  // Sort descending by calculated relevance score
  return scored.sort((a, b) => b.score - a.score);
}
