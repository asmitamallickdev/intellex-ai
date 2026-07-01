import { z } from "zod";

export const uploadFileSchema = z.object({
  skillId: z.string().uuid("A valid Skill UUID is required."),
  filename: z.string().min(1, "Original filename is required."),
  mimeType: z.string().min(1, "Mime type is required."),
  size: z.number().positive("File size must be greater than zero.").max(100 * 1024 * 1024, "File size cannot exceed 100MB."),
});

export type UploadFileZodInput = z.infer<typeof uploadFileSchema>;
