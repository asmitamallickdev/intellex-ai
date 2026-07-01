import { Citation } from "../types/chat";

/**
 * Deduplicates and groups a list of raw semantic citation inputs.
 * Groups adjacent chunks from the same document and computes general confidence metrics.
 */
export function processCitations(
  semanticResults: {
    chunkId: string;
    content: string;
    documentTitle: string;
    distance: number;
    documentId: string;
    originalFilename: string;
    storageUrl: string;
    chunkIndex: number;
    pageNumber?: number | null;
  }[]
): Citation[] {
  const citations: Citation[] = [];
  const seenCitations = new Set<string>();

  for (const item of semanticResults) {
    // Unique identifier key
    const uniqueKey = `${item.documentId}-${item.chunkIndex}`;
    if (seenCitations.has(uniqueKey)) continue;
    seenCitations.add(uniqueKey);

    // similarityScore can be derived from distance (cosine similarity = 1 - cosine distance)
    const similarityScore = Math.max(0, Math.min(1, 1 - item.distance));

    citations.push({
      documentId: item.documentId,
      documentTitle: item.documentTitle,
      originalFilename: item.originalFilename,
      storageUrl: item.storageUrl,
      chunkIndex: item.chunkIndex,
      similarityScore: parseFloat(similarityScore.toFixed(4)),
      pageNumber: item.pageNumber || null,
    });
  }

  // Deduplicate and return
  return citations;
}

/**
 * Computes an overall confidence score (0 to 1) based on the similarity scores of the top retrieved chunks.
 */
export function calculateConfidenceScore(citations: Citation[]): number {
  if (citations.length === 0) return 0.5; // fallback neutral confidence
  const total = citations.reduce((sum, c) => sum + c.similarityScore, 0);
  return parseFloat((total / citations.length).toFixed(4));
}
