"use server";

import { MemoryService } from "../services/memory.service";
import { 
  createMemorySchema, 
  updateMemorySchema, 
  memoryQuerySchema 
} from "../validators/memory.validator";
import { MemoryResponse, MemoryListResponse } from "../types/memory";
import { Memory } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Creates a new Memory record manually.
 */
export async function createMemoryAction(
  input: any
): Promise<MemoryResponse<Memory>> {
  try {
    const validated = createMemorySchema.safeParse(input);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return { success: false, error: errorMsg, statusCode: 400 };
    }

    const memory = await MemoryService.createMemory(validated.data);
    revalidatePath("/skills");
    return { success: true, data: memory, message: "Memory registered successfully.", statusCode: 201 };
  } catch (err: any) {
    console.error("[Memory Actions] Create memory error:", err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Retrieves a Memory record by ID.
 */
export async function getMemoryAction(id: string): Promise<MemoryResponse<Memory | null>> {
  try {
    if (!id) return { success: false, error: "Memory ID is required.", statusCode: 400 };
    const memory = await MemoryService.getMemory(id);
    if (!memory) return { success: false, error: "Memory not found.", statusCode: 404 };
    return { success: true, data: memory, statusCode: 200 };
  } catch (err: any) {
    console.error(`[Memory Actions] Get memory ${id} error:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Updates an existing Memory record.
 */
export async function updateMemoryAction(
  id: string,
  input: any
): Promise<MemoryResponse<Memory>> {
  try {
    const validated = updateMemorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message, statusCode: 400 };
    }

    const memory = await MemoryService.updateMemory(id, validated.data);
    revalidatePath("/skills");
    return { success: true, data: memory, message: "Memory updated successfully.", statusCode: 200 };
  } catch (err: any) {
    console.error(`[Memory Actions] Update memory ${id} error:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Deletes a Memory record.
 */
export async function deleteMemoryAction(id: string): Promise<MemoryResponse<null>> {
  try {
    if (!id) return { success: false, error: "Memory ID is required.", statusCode: 400 };
    await MemoryService.deleteMemory(id);
    revalidatePath("/skills");
    return { success: true, message: "Memory record deleted.", statusCode: 200 };
  } catch (err: any) {
    console.error(`[Memory Actions] Delete memory ${id} error:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Lists all memories.
 */
export async function listMemoriesAction(skillId?: string): Promise<MemoryListResponse> {
  try {
    const memories = await MemoryService.listMemories(skillId);
    return { success: true, data: memories, statusCode: 200 };
  } catch (err: any) {
    console.error("[Memory Actions] List memories error:", err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Asynchronously triggers new memory extraction from the active chat log.
 */
export async function extractAndSaveMemoriesAction(
  chatId: string,
  messageLimit?: number
): Promise<MemoryListResponse> {
  try {
    if (!chatId) return { success: false, error: "Chat ID is required.", statusCode: 400 };
    const memories = await MemoryService.extractAndSaveMemoriesFromChat(chatId, messageLimit);
    revalidatePath("/skills");
    return { 
      success: true, 
      data: memories, 
      message: `Memory extraction completed. Extracted ${memories.length} records.`, 
      statusCode: 200 
    };
  } catch (err: any) {
    console.error(`[Memory Actions] Background memory extraction for chat ${chatId} failed:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Retrieves the count of all extracted memory nodes.
 */
export async function getMemoriesCountAction(): Promise<MemoryResponse<number>> {
  try {
    const count = await MemoryService.getMemoriesCount();
    return { success: true, data: count, statusCode: 200 };
  } catch (err: any) {
    console.error("[Memory Actions] Failed to fetch memories count:", err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}
