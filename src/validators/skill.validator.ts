import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(3, "Skill name must be at least 3 characters long.")
    .max(80, "Skill name cannot exceed 80 characters."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional()
    .nullable(),
  category: z.string().min(1, "Category is required."),
  icon: z.string().min(1, "Icon is required."),
  color: z.string().min(1, "Color is required."),
});

export const updateSkillSchema = createSkillSchema.partial().extend({
  isPinned: z.boolean().optional(),
});

export type CreateSkillZodInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillZodInput = z.infer<typeof updateSkillSchema>;
