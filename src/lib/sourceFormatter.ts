import { Citation } from "../types/chat";

/**
 * Deduplicates and extracts unique document titles/original filenames that were referenced during answer generation.
 */
export function extractUniqueSources(citations: Citation[]): string[] {
  const sources = new Set<string>();
  for (const c of citations) {
    if (c.originalFilename) {
      sources.add(c.originalFilename);
    }
  }
  return Array.from(sources);
}

/**
 * Extracts unique document IDs.
 */
export function extractUniqueDocumentIds(citations: Citation[]): string[] {
  const docIds = new Set<string>();
  for (const c of citations) {
    if (c.documentId) {
      docIds.add(c.documentId);
    }
  }
  return Array.from(docIds);
}
