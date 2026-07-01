"use server";

import { EmbeddingService } from "../services/embedding.service";
import { embedTriggerSchema } from "../validators/embedding.validator";
import { EmbeddingResponse, EmbeddingBatchResult } from "../types/embedding";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Triggers the vector embedding generation pipeline for pending document chunks.
 */
export async function triggerEmbeddingAction(
  documentId?: string | null,
  batchSize: number = 50
): Promise<EmbeddingResponse<EmbeddingBatchResult>> {
  try {
    // 1. Zod input validation
    const validated = embedTriggerSchema.safeParse({
      documentId,
      batchSize,
    });

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return {
        success: false,
        error: errorMsg,
        message: "Embedding parameters validation failed.",
        statusCode: 400,
      };
    }

    // 2. Call service layer
    const result = await EmbeddingService.embedPendingChunks(
      validated.data.documentId,
      validated.data.batchSize
    );

    revalidatePath("/knowledge");
    revalidatePath("/upload");

    return {
      success: true,
      data: result,
      message: `Embedding generation complete. Processed: ${result.processedCount}, Skipped: ${result.skippedCount}, Failed: ${result.failedCount}.`,
      statusCode: 200,
    };
  } catch (err: any) {
    console.error(`[Embedding Actions] Pipeline execution error for document ${documentId || "ALL"}:`, err);
    return {
      success: false,
      error: err.message || "Failed to generate vector embeddings.",
      statusCode: 500,
    };
  }
}
