import prisma from "@/src/lib/prisma";
import { openai, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "../lib/openai";
import crypto from "crypto";
import type { ChatMemory } from "@prisma/client";

export class ChatMemoryService {
  static async searchMemory(
    query: string,
    skillId: string,
    limit: number = 5,
  ): Promise<{ context: string; summary: string | null; score: number }[]> {
    try {
      const embedResponse = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query,
      });
      const embedding = embedResponse.data[0].embedding;
      const vectorStr = `[${embedding.join(",")}]`;

      const results = await prisma.$queryRawUnsafe<any[]>(
        `SELECT context, summary, (embedding <=> $1::vector) as distance
         FROM chat_memories
         WHERE "skillId" = $2::uuid
         ORDER BY distance ASC
         LIMIT $3`,
        vectorStr,
        skillId,
        limit,
      );

      return results.map((r) => ({
        context: r.context,
        summary: r.summary,
        score: +(1 - Number(r.distance)).toFixed(4),
      }));
    } catch (err: any) {
      console.error("[ChatMemoryService] Error searching memory:", err);
      return [];
    }
  }

  static async saveMemory(
    skillId: string,
    chatId: string | null,
    context: string,
    summary?: string
  ): Promise<ChatMemory> {
    const id = crypto.randomUUID();

    const embedResponse = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: context,
      dimensions: EMBEDDING_DIMENSIONS,
    });
    const embedding = embedResponse.data[0].embedding;
    const vectorStr = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO chat_memories (id, "skillId", "chatId", context, summary, embedding, "createdAt")
       VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6::vector, NOW())`,
      id,
      skillId,
      chatId,
      context,
      summary || null,
      vectorStr,
    );

    return prisma.chatMemory.findUnique({ where: { id } }) as Promise<ChatMemory>;
  }
}
