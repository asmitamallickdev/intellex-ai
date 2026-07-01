import prisma from "@/src/lib/prisma";
import { openai, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "../lib/openai";
import { updateChunkEmbedding, markChunkEmbeddingFailed } from "../lib/vector";
import { EmbeddingBatchResult } from "../types/embedding";

/**
 * Exponential backoff helper for OpenAI API request resilience.
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`[Embedding Service] API Call failed. Retrying in ${delay}ms... (Retries left: ${retries})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

export class EmbeddingService {
  /**
   * Processes all pending document chunks, fetches OpenAI embeddings, and writes to pgvector.
   */
  static async embedPendingChunks(
    documentId?: string | null,
    batchSize: number = 50
  ): Promise<EmbeddingBatchResult> {
    console.log(`[Embedding Service] Initializing embedding generation. DocumentId=${documentId || "ALL"}`);

    const result: EmbeddingBatchResult = {
      processedCount: 0,
      skippedCount: 0,
      failedCount: 0,
    };

    // 1. Fetch chunks needing embeddings (status is null, PENDING, or FAILED)
    const whereClause: any = {
      OR: [
        { embeddingStatus: null },
        { embeddingStatus: "PENDING" },
        { embeddingStatus: "FAILED" },
      ],
    };

    if (documentId) {
      whereClause.documentId = documentId;
    }

    const pendingChunks = await prisma.chunk.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });

    if (pendingChunks.length === 0) {
      console.log("[Embedding Service] No pending chunks found needing embeddings.");
      return result;
    }

    console.log(`[Embedding Service] Found ${pendingChunks.length} chunks to process.`);

    // 2. Loop through chunks in batches
    for (let i = 0; i < pendingChunks.length; i += batchSize) {
      const batch = pendingChunks.slice(i, i + batchSize);
      console.log(`[Embedding Service] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pendingChunks.length / batchSize)} (Size: ${batch.length})`);

      const batchContents: string[] = [];
      const validBatchChunks: typeof batch = [];

      for (const chunk of batch) {
        const cleanContent = chunk.content?.trim();
        if (!cleanContent) {
          // Skip empty chunks
          await prisma.chunk.update({
            where: { id: chunk.id },
            data: { embeddingStatus: "SKIPPED" },
          });
          result.skippedCount++;
          console.log(`[Embedding Service] Skipped empty chunk ID=${chunk.id}`);
        } else {
          batchContents.push(cleanContent);
          validBatchChunks.push(chunk);
        }
      }

      if (batchContents.length === 0) {
        continue;
      }

      try {
        // 3. Request embeddings batch from OpenAI
        const apiResponse = await retryWithBackoff(() =>
          openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: batchContents,
            dimensions: EMBEDDING_DIMENSIONS,
          })
        );

        if (!apiResponse.data || apiResponse.data.length !== validBatchChunks.length) {
          throw new Error("Mismatch in generated embeddings count returned from OpenAI API.");
        }

        // 4. Update embeddings inside PostgreSQL using raw pgvector commands
        for (let j = 0; j < validBatchChunks.length; j++) {
          const chunk = validBatchChunks[j];
          const embeddingVector = apiResponse.data[j].embedding;

          // Double check dimension constraints
          if (embeddingVector.length !== EMBEDDING_DIMENSIONS) {
            console.error(`[Embedding Service] Dimensions mismatch for chunk ${chunk.id}. Expected ${EMBEDDING_DIMENSIONS}, got ${embeddingVector.length}`);
            await markChunkEmbeddingFailed(chunk.id);
            result.failedCount++;
            continue;
          }

          await updateChunkEmbedding(
            chunk.id,
            embeddingVector,
            EMBEDDING_MODEL,
            EMBEDDING_DIMENSIONS
          );
          result.processedCount++;
        }

        console.log(`[Embedding Service] Successfully completed batch processing.`);
      } catch (err: any) {
        console.error(`[Embedding Service] Failed batch operations:`, err);
        // Mark all active chunks in this batch as FAILED
        for (const chunk of validBatchChunks) {
          await markChunkEmbeddingFailed(chunk.id).catch((dbErr) =>
            console.error(`[Embedding Service] DB status cleanup failure:`, dbErr)
          );
          result.failedCount++;
        }
      }
    }

    console.log(`[Embedding Service] Embedding generation pipeline finished. Processed: ${result.processedCount}, Skipped: ${result.skippedCount}, Failed: ${result.failedCount}`);
    return result;
  }
}
