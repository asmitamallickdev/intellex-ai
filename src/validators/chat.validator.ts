import { z } from "zod";

export const createChatSchema = z.object({
  skillId: z.string().uuid("A valid Skill UUID is required."),
  title: z.string().min(1, "Title is required.").max(100, "Title is too long."),
});

export const renameChatSchema = z.object({
  title: z.string().min(1, "Title is required.").max(100, "Title is too long."),
});

export const sendMessageSchema = z.object({
  chatId: z.string().uuid("A valid Chat UUID is required."),
  content: z.string().min(1, "Message content cannot be empty."),
  temperature: z.number().min(0).max(2).default(0.7),
  maxChunks: z.number().min(1).max(20).default(5),
  maxHistory: z.number().min(1).max(50).default(10),
  maxTokens: z.number().min(1).max(4000).default(1000),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type RenameChatInput = z.infer<typeof renameChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
