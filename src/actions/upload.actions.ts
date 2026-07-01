"use server";

import { UploadService } from "../services/upload.service";
import { uploadFileSchema } from "../validators/upload.validator";
import { UploadResponse } from "../types/upload";
import { KnowledgeFile } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Uploads a file (base64 encoded) to Cloudflare R2 and creates a database reference.
 */
export async function uploadFileAction(
  skillId: string,
  filename: string,
  mimeType: string,
  size: number,
  base64Data: string
): Promise<UploadResponse<KnowledgeFile>> {
  try {
    // 1. Zod input validation
    const validated = uploadFileSchema.safeParse({
      skillId,
      filename,
      mimeType,
      size,
    });

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e: { message: string }) => e.message).join(" ");
      return {
        success: false,
        error: errorMsg,
        message: "File validation check failed.",
        statusCode: 400,
      };
    }

    // 2. Decode file buffer
    const buffer = Buffer.from(base64Data, "base64");

    // 3. Call upload service layer
    const knowledgeFile = await UploadService.uploadFile(
      skillId,
      filename,
      mimeType,
      buffer
    );

    revalidatePath("/knowledge");
    revalidatePath("/upload");

    return {
      success: true,
      data: knowledgeFile,
      message: "File uploaded successfully.",
      statusCode: 201,
    };
  } catch (err: any) {
    console.error("[Upload Actions] Error uploading file:", err);
    return {
      success: false,
      error: err.message || "Internal server error during upload.",
      statusCode: 500,
    };
  }
}

/**
 * Server Action: Deletes a file from Cloudflare R2 and database.
 */
export async function deleteFileAction(id: string): Promise<UploadResponse<null>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "File ID is required.",
        statusCode: 400,
      };
    }

    await UploadService.deleteFile(id);

    revalidatePath("/knowledge");
    revalidatePath("/upload");

    return {
      success: true,
      message: "File deleted successfully.",
      statusCode: 200,
    };
  } catch (err: any) {
    console.error(`[Upload Actions] Error deleting file ${id}:`, err);
    return {
      success: false,
      error: err.message || "Internal server error during delete.",
      statusCode: 500,
    };
  }
}

/**
 * Server Action: Replaces an existing file reference with a new upload.
 */
export async function replaceFileAction(
  id: string,
  newFilename: string,
  newMimeType: string,
  newSize: number,
  base64Data: string
): Promise<UploadResponse<KnowledgeFile>> {
  try {
    if (!id) {
      return {
        success: false,
        error: "File ID is required.",
        statusCode: 400,
      };
    }

    // Decode file buffer
    const buffer = Buffer.from(base64Data, "base64");

    const file = await UploadService.replaceFile(
      id,
      newFilename,
      newMimeType,
      buffer
    );

    revalidatePath("/knowledge");
    revalidatePath("/upload");

    return {
      success: true,
      data: file,
      message: "File replaced successfully.",
      statusCode: 200,
    };
  } catch (err: any) {
    console.error(`[Upload Actions] Error replacing file ${id}:`, err);
    return {
      success: false,
      error: err.message || "Internal server error during file replacement.",
      statusCode: 500,
    };
  }
}

/**
 * Server Action: Retrieves all uploaded files.
 */
export async function getAllFilesAction(): Promise<UploadResponse<KnowledgeFile[]>> {
  try {
    const files = await UploadService.findAllFiles();
    return {
      success: true,
      data: files,
      message: "Files retrieved successfully.",
      statusCode: 200,
    };
  } catch (err: any) {
    console.error("[Upload Actions] Error retrieving all files:", err);
    return {
      success: false,
      error: err.message || "Failed to retrieve files.",
      statusCode: 500,
    };
  }
}
