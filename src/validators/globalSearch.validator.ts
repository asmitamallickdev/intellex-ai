import { z } from "zod";

export const globalSearchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty."),
  filters: z.object({
    skillId: z.string().uuid().optional().nullable(),
    fileTypes: z.array(z.string()).optional().nullable(),
    dateFrom: z.string().datetime().optional().nullable(),
    dateTo: z.string().datetime().optional().nullable(),
    categories: z.array(z.string()).optional().nullable(),
    memoryImportance: z.array(z.string()).optional().nullable(),
    scope: z.array(z.enum(["SKILL", "FILE", "DOCUMENT", "CHAT", "MESSAGE", "MEMORY", "CHUNK"])).optional().nullable(),
  }).optional(),
  sortBy: z.enum(["relevance", "recent", "alphabetical", "referenced"]).default("relevance"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type GlobalSearchInput = z.infer<typeof globalSearchSchema>;
