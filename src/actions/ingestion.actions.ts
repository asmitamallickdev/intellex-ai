"use server";

import { IngestionService } from "../services/ingestion.service";
import { ingestionTriggerSchema } from "../validators/ingestion.validator";
import { IngestionResponse } from "../types/ingestion";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Triggers the document text ingestion and chunking pipeline.
 */
export async function triggerIngestionAction(
  fileId: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<IngestionResponse> {
  try {
    // 1. Zod input validation
    const validated = ingestionTriggerSchema.safeParse({
      fileId,
      chunkSize,
      chunkOverlap,
    });

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e: { message: string }) => e.message).join(" ");
      return {
        success: false,
        error: errorMsg,
        message: "Ingestion parameters validation failed.",
        statusCode: 400,
      };
    }

    // 2. Call service layer
    const result = await IngestionService.ingestFile(fileId, {
      chunkSize,
      chunkOverlap,
    });

    revalidatePath("/knowledge");
    revalidatePath("/upload");

    return {
      success: true,
      data: result,
      message: `Document ingestion completed. Extracted ${result.chunksCount} chunks.`,
      statusCode: 200,
    };
  } catch (err: any) {
    console.error(`[Ingestion Actions] Ingestion execution error for file ${fileId}:`, err);
    return {
      success: false,
      error: err.message || "Failed to complete document ingestion pipeline.",
      statusCode: 500,
    };
  }
}
