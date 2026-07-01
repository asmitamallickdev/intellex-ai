import prisma from "@/src/lib/prisma";
import { scoreAndRankMemories } from "./memoryScorer";
import { Memory } from "@prisma/client";

/**
 * Retrieves the most relevant memories for the current skill context.
 */
export async function getRelevantMemoriesForPrompt(
  skillId: string,
  query: string,
  limit: number = 5,
  minConfidence: number = 0.5
): Promise<Memory[]> {
  try {
    // 1. Load active memories from database for this skill
    const memories = await prisma.memory.findMany({
      where: {
        skillId,
        confidence: { gte: minConfidence },
      },
    });

    if (memories.length === 0) return [];

    // 2. Score and rank them against the user query
    const ranked = scoreAndRankMemories(memories, query);

    // 3. Return top memories within limit
    const topMemories = ranked.slice(0, limit);

    // 4. Update access timestamp asynchronously
    const idsToUpdate = topMemories.map((m) => m.id);
    if (idsToUpdate.length > 0) {
      prisma.memory.updateMany({
        where: { id: { in: idsToUpdate } },
        data: { lastAccessedAt: new Date() },
      }).catch((err) => console.error("[Memory Retriever] Access log update failed:", err));
    }

    return topMemories;
  } catch (err) {
    console.error("[Memory Retriever] Failed to retrieve memories:", err);
    return [];
  }
}

/**
 * Formats retrieved memories into a block of text to be injected into system prompt instructions.
 */
export function formatMemoriesForPrompt(memories: Memory[]): string {
  if (memories.length === 0) return "";

  let result = "\n=== PERSISTENT USER MEMORIES & PREFERENCES ===\n";
  memories.forEach((m, idx) => {
    result += `\n[Memory ${idx + 1}: Category="${m.category || "General"}"]\n- ${m.title}: ${m.content}\n`;
  });
  result += "\n=============================================\n";
  return result;
}
