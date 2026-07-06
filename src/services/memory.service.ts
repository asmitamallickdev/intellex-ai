import prisma from "@/src/lib/prisma";
import { Memory, MemoryImportance } from "@prisma/client";
import { CreateMemoryInput, UpdateMemoryInput } from "../validators/memory.validator";
import { extractMemoriesFromConversation } from "../lib/memoryExtractor";

// DEV_USER_ID fallback matching other service files
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export class MemoryService {
  /**
   * Helper to ensure development user exists in database.
   */
  private static async ensureDevUserExists() {
    await prisma.user.upsert({
      where: { id: DEV_USER_ID },
      update: {},
      create: {
        id: DEV_USER_ID,
        email: "dev-chat-user@intellex.ai",
        passwordHash: "$2b$10$dummyhashforchatdevelopmentpurposesonly",
        name: "Development Chat User",
      },
    });
  }

  /**
   * Retrieves the count of all long-term memory nodes.
   */
  static async getMemoriesCount(): Promise<number> {
    return prisma.memory.count({
      where: { userId: DEV_USER_ID },
    });
  }

  /**
   * Creates a new long-term memory record manually.
   */
  static async createMemory(input: CreateMemoryInput): Promise<Memory> {
    await this.ensureDevUserExists();
    return prisma.memory.create({
      data: {
        userId: DEV_USER_ID,
        skillId: input.skillId,
        title: input.title,
        content: input.content,
        importance: input.importance,
        confidence: input.confidence,
        category: input.category,
        source: input.source || "Manual Entry",
        sourceChatId: input.sourceChatId,
        sourceMessageId: input.sourceMessageId,
      },
    });
  }

  /**
   * Retrieves a single Memory record by ID.
   */
  static async getMemory(id: string): Promise<Memory | null> {
    return prisma.memory.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing Memory record.
   */
  static async updateMemory(id: string, input: UpdateMemoryInput): Promise<Memory> {
    const data: any = { ...input };
    // Map custom logical updates if any
    return prisma.memory.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a Memory record.
   */
  static async deleteMemory(id: string): Promise<boolean> {
    await prisma.memory.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Lists all memories, optionally filtered by skillId.
   */
  static async listMemories(skillId?: string): Promise<Memory[]> {
    const where: any = { userId: DEV_USER_ID };
    if (skillId) {
      where.skillId = skillId;
    }
    return prisma.memory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Asynchronously parses recent chat messages and extracts long-term memories.
   * Runs conflict resolution before saving new or updating existing memories.
   */
  static async extractAndSaveMemoriesFromChat(
    chatId: string,
    messageLimit: number = 15
  ): Promise<Memory[]> {
    try {
      await this.ensureDevUserExists();

      // 1. Fetch chat thread context
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });
      if (!chat) {
        console.error(`[Memory Service] Chat not found: ID=${chatId}`);
        return [];
      }

      // 2. Load recent dialogue messages
      const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        take: messageLimit,
      });

      if (messages.length === 0) return [];

      // Reverse messages to chronological order
      const chronoMessages = messages.reverse();

      // 3. Invoke extractor
      console.log(`[Memory Service] Extracting memories for Skill=${chat.skillId}`);
      const extracted = await extractMemoriesFromConversation(chronoMessages);
      console.log(`[Memory Service] Extracted ${extracted.length} candidate memories.`);

      const savedMemories: Memory[] = [];

      // 4. Process each memory (check for duplicate or conflict, resolve)
      for (const item of extracted) {
        // Query to check for semantic overlap in title (case insensitive)
        const overlap = await prisma.memory.findFirst({
          where: {
            skillId: chat.skillId,
            title: {
              equals: item.title,
              mode: "insensitive",
            },
          },
        });

        if (overlap) {
          // CONFLICT RESOLUTION: Update existing memory details with latest info
          console.log(`[Memory Service] Resolving conflict. Updating memory ID=${overlap.id}`);
          const updated = await prisma.memory.update({
            where: { id: overlap.id },
            data: {
              content: item.content,
              importance: item.importance,
              confidence: item.confidence,
              category: item.category,
              source: `Updated via chat extraction from Chat ID=${chatId}`,
              lastAccessedAt: new Date(),
            },
          });
          savedMemories.push(updated);
        } else {
          // Create new memory
          const created = await prisma.memory.create({
            data: {
              userId: DEV_USER_ID,
              skillId: chat.skillId,
              title: item.title,
              content: item.content,
              importance: item.importance,
              confidence: item.confidence,
              category: item.category,
              source: `Extracted from Chat ID=${chatId}`,
              sourceChatId: chatId,
              lastAccessedAt: new Date(),
            },
          });
          savedMemories.push(created);
        }
      }

      return savedMemories;
    } catch (err) {
      console.error("[Memory Service] Memory background extraction failed:", err);
      return [];
    }
  }
}
