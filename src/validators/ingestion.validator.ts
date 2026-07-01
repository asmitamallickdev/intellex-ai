import { z } from "zod";

export const ingestionTriggerSchema = z.object({
  fileId: z.string().uuid("A valid KnowledgeFile UUID is required."),
  chunkSize: z.number().min(100).max(10000).default(1000),
  chunkOverlap: z.number().min(0).max(2000).default(200),
});

export type IngestionTriggerInput = z.infer<typeof ingestionTriggerSchema>;
