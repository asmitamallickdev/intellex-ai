import prisma from "@/src/lib/prisma";
import { ChatHistoryMessage } from "../types/chat";

/**
 * Loads recent messages from database for a specific chat thread, returning formatted history.
 */
export async function getFormattedHistory(
  chatId: string,
  limit: number = 10
): Promise<ChatHistoryMessage[]> {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Reverse since it was fetched newest first
    return messages.reverse().map((msg) => ({
      role: msg.role.toLowerCase() as "system" | "user" | "assistant",
      content: msg.content,
    }));
  } catch (err) {
    console.error("[Chat History] Failed to load messages history:", err);
    return [];
  }
}
