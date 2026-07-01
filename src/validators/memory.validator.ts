import { z } from "zod";
import { MemoryImportance } from "@prisma/client";

export const createMemorySchema = z.object({
  skillId: z.string().uuid("A valid Skill UUID is required."),
  title: z.string().min(1, "Title is required.").max(150),
  content: z.string().min(1, "Memory content cannot be empty."),
  importance: z.nativeEnum(MemoryImportance).default(MemoryImportance.MEDIUM),
  confidence: z.number().min(0).max(1).default(1.0),
  category: z.string().max(50).default("General"),
  source: z.string().max(255).optional().nullable(),
  sourceChatId: z.string().uuid().optional().nullable(),
  sourceMessageId: z.string().uuid().optional().nullable(),
});

export const updateMemorySchema = z.object({
  title: z.string().min(1, "Title is required.").max(150).optional(),
  content: z.string().min(1, "Memory content cannot be empty.").optional(),
  importance: z.nativeEnum(MemoryImportance).optional(),
  confidence: z.number().min(0).max(1).optional(),
  category: z.string().max(50).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const memoryQuerySchema = z.object({
  skillId: z.string().uuid("A valid Skill UUID is required."),
  query: z.string().optional(),
  limit: z.number().min(1).max(50).default(5),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type MemoryQueryInput = z.infer<typeof memoryQuerySchema>;
