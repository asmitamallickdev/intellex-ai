"use server";

import { ChatService } from "../services/chat.service";
import { 
  createChatSchema, 
  renameChatSchema, 
  sendMessageSchema,
  SendMessageInput
} from "../validators/chat.validator";
import { ChatResponse, ChatMessagesResponse } from "../types/chat";
import { Chat, Message } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Creates a new Chat Thread.
 */
export async function createChatAction(
  skillId: string,
  title: string
): Promise<ChatResponse<Chat>> {
  try {
    const validated = createChatSchema.safeParse({ skillId, title });
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return { success: false, error: errorMsg, statusCode: 400 };
    }

    const chat = await ChatService.createChat(validated.data.skillId, validated.data.title);
    revalidatePath("/chat/" + validated.data.skillId);
    return { success: true, data: chat, message: "Chat created successfully.", statusCode: 201 };
  } catch (err: any) {
    console.error("[Chat Actions] Failed to create chat:", err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Retrieves a Chat Thread metadata.
 */
export async function getChatAction(id: string): Promise<ChatResponse<Chat | null>> {
  try {
    if (!id) return { success: false, error: "Chat ID is required.", statusCode: 400 };
    const chat = await ChatService.getChat(id);
    if (!chat) return { success: false, error: "Chat thread not found.", statusCode: 404 };
    return { success: true, data: chat, statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Failed to fetch chat ${id}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Loads all messages within a specific Chat Thread.
 */
export async function getChatMessagesAction(chatId: string): Promise<ChatMessagesResponse> {
  try {
    if (!chatId) return { success: false, error: "Chat ID is required.", statusCode: 400 };
    const messages = await ChatService.getChatMessages(chatId);
    return { success: true, data: messages, statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Failed to fetch chat messages for ${chatId}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Renames an active Chat Thread title.
 */
export async function renameChatAction(id: string, title: string): Promise<ChatResponse<Chat>> {
  try {
    const validated = renameChatSchema.safeParse({ title });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message, statusCode: 400 };
    }

    const chat = await ChatService.renameChat(id, validated.data.title);
    revalidatePath("/chat");
    return { success: true, data: chat, message: "Chat renamed successfully.", statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Failed to rename chat ${id}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Deletes a Chat Session thread.
 */
export async function deleteChatAction(id: string): Promise<ChatResponse<null>> {
  try {
    if (!id) return { success: false, error: "Chat ID is required.", statusCode: 400 };
    await ChatService.deleteChat(id);
    revalidatePath("/chat");
    return { success: true, message: "Chat session deleted.", statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Failed to delete chat ${id}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Posts a message to the AI Chat Service, invoking the RAG pipeline.
 */
export async function sendMessageAction(input: SendMessageInput): Promise<ChatResponse<Message>> {
  try {
    const validated = sendMessageSchema.safeParse(input);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return { success: false, error: errorMsg, statusCode: 400 };
    }

    const message = await ChatService.sendMessage(validated.data);
    revalidatePath("/chat");
    return { success: true, data: message, message: "AI response generated.", statusCode: 200 };
  } catch (err: any) {
    console.error("[Chat Actions] Error sending message:", err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Triggers regeneration of the last assistant answer.
 */
export async function regenerateResponseAction(
  chatId: string,
  options: Omit<SendMessageInput, "chatId" | "content">
): Promise<ChatResponse<Message>> {
  try {
    if (!chatId) return { success: false, error: "Chat ID is required.", statusCode: 400 };
    const message = await ChatService.regenerateResponse(chatId, options);
    revalidatePath("/chat");
    return { success: true, data: message, message: "AI response regenerated.", statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Error regenerating response in chat ${chatId}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}

/**
 * Server Action: Retrieves all Chat Threads for a given Skill ID.
 */
export async function getChatsBySkillAction(skillId: string): Promise<ChatResponse<Chat[]>> {
  try {
    if (!skillId) return { success: false, error: "Skill ID is required.", statusCode: 400 };
    const chats = await ChatService.getChatsBySkill(skillId);
    return { success: true, data: chats, statusCode: 200 };
  } catch (err: any) {
    console.error(`[Chat Actions] Failed to fetch chats for skill ${skillId}:`, err);
    return { success: false, error: err.message || "Internal server error.", statusCode: 500 };
  }
}
