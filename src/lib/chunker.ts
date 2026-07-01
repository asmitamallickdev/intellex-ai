import { DocumentChunkResult } from "../types/ingestion";

/**
 * Splits text content into structural, paragraph-aware semantic chunks.
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): DocumentChunkResult[] {
  if (!text) return [];

  const chunks: DocumentChunkResult[] = [];
  const paragraphs = text.split("\n\n");
  
  let currentChunk = "";
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (!para) continue;

    // If paragraph itself is larger than chunk size, split it into sentences
    if (para.length > chunkSize) {
      const sentences = para.match(/[^.!?]+[.!?]+(\s|$)/g) || [para];
      
      for (const sentence of sentences) {
        const cleanSentence = sentence.trim();
        if (!cleanSentence) continue;

        if ((currentChunk + " " + cleanSentence).length > chunkSize) {
          if (currentChunk) {
            chunks.push(createChunkResult(currentChunk, chunkIndex++));
            // Keep overlap
            currentChunk = getOverlapText(currentChunk, overlap) + " " + cleanSentence;
          } else {
            // Sentence itself is larger than chunkSize, force split it
            chunks.push(createChunkResult(cleanSentence, chunkIndex++));
            currentChunk = "";
          }
        } else {
          currentChunk = currentChunk ? `${currentChunk} ${cleanSentence}` : cleanSentence;
        }
      }
    } else {
      // Paragraph fits in chunk size limits
      if ((currentChunk + "\n\n" + para).length > chunkSize) {
        if (currentChunk) {
          chunks.push(createChunkResult(currentChunk, chunkIndex++));
          // Keep overlap
          currentChunk = getOverlapText(currentChunk, overlap) + "\n\n" + para;
        } else {
          currentChunk = para;
        }
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
      }
    }
  }

  // Push remaining text
  if (currentChunk.trim()) {
    chunks.push(createChunkResult(currentChunk, chunkIndex++));
  }

  return chunks;
}

/**
 * Helper to build the chunk structure and calculate approximate token count.
 * Approx tokens: charLength / 4 (roughly 1 token per 4 English characters).
 */
function createChunkResult(content: string, chunkIndex: number): DocumentChunkResult {
  const trimmed = content.trim();
  return {
    content: trimmed,
    chunkIndex,
    tokenCount: Math.ceil(trimmed.length / 4),
  };
}

/**
 * Grabs the overlap tail of the string.
 */
function getOverlapText(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) return text;
  return text.slice(-overlapSize);
}
