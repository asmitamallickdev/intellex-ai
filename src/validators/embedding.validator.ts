import { z } from "zod";

export const embedTriggerSchema = z.object({
  documentId: z.string().uuid("A valid Document UUID is required.").optional().nullable(),
  batchSize: z.number().min(1).max(500).default(50),
});

export type EmbedTriggerInput = z.infer<typeof embedTriggerSchema>;
