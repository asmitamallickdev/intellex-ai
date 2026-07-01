"use server";

import { SkillService } from "@/src/services/skill.service";
import { createSkillSchema, updateSkillSchema } from "@/src/validators/skill.validator";
import { CreateSkillInput, UpdateSkillInput, SkillResponse, SkillListResponse, SkillFilterOptions } from "@/src/types/skill";
import { Skill } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Standardizes successful Server Action responses.
 */
function successResponse<T>(data: T, message?: string, statusCode: number = 200): SkillResponse<T> {
  return {
    success: true,
    data,
    message,
    statusCode,
  };
}

/**
 * Standardizes error Server Action responses.
 */
function errorResponse(error: string, statusCode: number = 500, message?: string): SkillResponse<any> {
  return {
    success: false,
    error,
    message,
    statusCode,
  };
}

/**
 * Server Action: Creates a new Skill Agent.
 */
export async function createSkillAction(input: CreateSkillInput): Promise<SkillResponse<Skill>> {
  try {
    // Validate inputs
    const validated = createSkillSchema.safeParse(input);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e: { message: string }) => e.message).join(" ");
      return errorResponse(errorMsg, 400, "Validation check failed.");
    }

    const skill = await SkillService.create(validated.data as CreateSkillInput);
    revalidatePath("/skills");
    revalidatePath("/");
    
    return successResponse(skill, "Skill created successfully.", 211);
  } catch (err: any) {
    console.error("[Skill Actions] Error creating skill:", err);
    return errorResponse(err.message || "Failed to create skill.");
  }
}

/**
 * Server Action: Updates an existing Skill.
 */
export async function updateSkillAction(id: string, input: UpdateSkillInput): Promise<SkillResponse<Skill>> {
  try {
    if (!id) return errorResponse("Skill identifier is required.", 400);

    // Validate inputs
    const validated = updateSkillSchema.safeParse(input);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e: { message: string }) => e.message).join(" ");
      return errorResponse(errorMsg, 400, "Validation check failed.");
    }

    const skill = await SkillService.update(id, validated.data as UpdateSkillInput);
    revalidatePath("/skills");
    revalidatePath("/");
    
    return successResponse(skill, "Skill updated successfully.");
  } catch (err: any) {
    console.error(`[Skill Actions] Error updating skill ${id}:`, err);
    return errorResponse(err.message || "Failed to update skill.");
  }
}

/**
 * Server Action: Deletes a Skill.
 */
export async function deleteSkillAction(id: string): Promise<SkillResponse<Skill>> {
  try {
    if (!id) return errorResponse("Skill identifier is required.", 400);

    const skill = await SkillService.delete(id);
    revalidatePath("/skills");
    revalidatePath("/");
    
    return successResponse(skill, "Skill deleted successfully.");
  } catch (err: any) {
    console.error(`[Skill Actions] Error deleting skill ${id}:`, err);
    return errorResponse(err.message || "Failed to delete skill.");
  }
}

/**
 * Server Action: Fetches a single Skill by ID.
 */
export async function getSkillAction(id: string): Promise<SkillResponse<Skill | null>> {
  try {
    if (!id) return errorResponse("Skill identifier is required.", 400);

    const skill = await SkillService.findById(id);
    if (!skill) {
      return errorResponse("Skill not found.", 404);
    }
    
    return successResponse(skill, "Skill retrieved successfully.");
  } catch (err: any) {
    console.error(`[Skill Actions] Error retrieving skill ${id}:`, err);
    return errorResponse(err.message || "Failed to retrieve skill.");
  }
}

/**
 * Server Action: Lists all user Skills with filters and sorting options.
 */
export async function getAllSkillsAction(options: SkillFilterOptions = {}): Promise<SkillListResponse<Skill>> {
  try {
    const skills = await SkillService.findAll(options);
    return {
      success: true,
      data: skills,
      message: "Skills retrieved successfully.",
      statusCode: 200,
    };
  } catch (err: any) {
    console.error("[Skill Actions] Error retrieving all skills:", err);
    return {
      success: false,
      error: err.message || "Failed to retrieve skills list.",
      statusCode: 500,
    };
  }
}

/**
 * Server Action: Pins a Skill to the dashboard for quick access.
 */
export async function pinSkillAction(id: string): Promise<SkillResponse<Skill>> {
  try {
    if (!id) return errorResponse("Skill identifier is required.", 400);

    const skill = await SkillService.update(id, { isPinned: true });
    revalidatePath("/skills");
    revalidatePath("/");
    
    return successResponse(skill, "Skill pinned successfully.");
  } catch (err: any) {
    console.error(`[Skill Actions] Error pinning skill ${id}:`, err);
    return errorResponse(err.message || "Failed to pin skill.");
  }
}

/**
 * Server Action: Unpins a Skill.
 */
export async function unpinSkillAction(id: string): Promise<SkillResponse<Skill>> {
  try {
    if (!id) return errorResponse("Skill identifier is required.", 400);

    const skill = await SkillService.update(id, { isPinned: false });
    revalidatePath("/skills");
    revalidatePath("/");
    
    return successResponse(skill, "Skill unpinned successfully.");
  } catch (err: any) {
    console.error(`[Skill Actions] Error unpinning skill ${id}:`, err);
    return errorResponse(err.message || "Failed to unpin skill.");
  }
}
