/**
 * Reusable helper methods and placeholders for pgvector operations on Neon PostgreSQL.
 */

/**
 * Formats a numeric embedding array into pgvector string representation: '[0.1, 0.2, 0.3...]'
 */
export function formatVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

/**
 * Parses a pgvector string representation '[0.1,0.2,...]' back into a numeric array.
 */
export function parseVector(vectorStr: string): number[] {
  try {
    return JSON.parse(vectorStr);
  } catch (e) {
    const clean = vectorStr.replace(/[\[\]]/g, "");
    return clean.split(",").map(Number);
  }
}

/**
 * Placeholder for future cosine similarity search query execution.
 * To be implemented during RAG API integration.
 */
export async function querySimilarityPlaceholder<T>(
  tableName: string,
  vectorColumn: string,
  embedding: number[],
  limit: number = 5
): Promise<T[]> {
  console.log(`Executing similarity search query on ${tableName}.${vectorColumn} with limit ${limit}`);
  return [];
}

/**
 * SQL operators helper for raw DB queries
 */
export const pgvectorOperators = {
  cosineDistance: (column: string, vectorStr: string) => `${column} <=> '${vectorStr}'::vector`,
  l2Distance: (column: string, vectorStr: string) => `${column} <-> '${vectorStr}'::vector`,
  innerProductDistance: (column: string, vectorStr: string) => `${column} <#> '${vectorStr}'::vector`,
};
