import prisma from "@/src/lib/prisma";
import { r2Client, R2_BUCKET_NAME } from "../lib/r2";
import { 
  PutObjectCommand, 
  DeleteObjectCommand, 
  HeadObjectCommand 
} from "@aws-sdk/client-s3";
import { 
  validateFileType, 
  validateFileSize, 
  generateUniqueFilename, 
  generateStorageKey, 
  generatePublicUrl 
} from "../lib/storage";
import { KnowledgeFile, KnowledgeFileStatus } from "@prisma/client";

// Global constant fallback DEV_USER_ID mapping
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Centrally manages the current session user ID.
 * Replace with auth() logic later to switch to production authentication.
 */
export function getUserId(): string {
  return DEV_USER_ID;
}

export class UploadService {
  /**
   * Helper method to verify if a file exists in the R2 bucket.
   */
  static async fileExists(storageKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
      });
      await r2Client.send(command);
      return true;
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  /**
   * Cleans up database and S3 objects in case of pipeline failures.
   */
  static async cleanupFailedUpload(storageKey: string, fileId?: string): Promise<void> {
    try {
      // 1. Remove partially uploaded file from R2
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
      });
      await r2Client.send(deleteCommand);
      console.log(`[Upload Service] Cleaned up failed upload from R2: Key="${storageKey}"`);
    } catch (s3Err) {
      console.error(`[Upload Service] S3 cleanup error for Key "${storageKey}":`, s3Err);
    }

    if (fileId) {
      try {
        // 2. Mark database record as FAILED
        await prisma.knowledgeFile.update({
          where: { id: fileId },
          data: { status: KnowledgeFileStatus.FAILED },
        });
        console.log(`[Upload Service] Marked file record as FAILED: ID=${fileId}`);
      } catch (dbErr) {
        console.error(`[Upload Service] DB status cleanup error for ID "${fileId}":`, dbErr);
      }
    }
  }

  /**
   * Uploads a file buffer to Cloudflare R2 and persists structural database records.
   */
  static async uploadFile(
    skillId: string,
    filename: string,
    mimeType: string,
    fileBuffer: Buffer
  ): Promise<KnowledgeFile> {
    // Standard validation
    const typeValidation = validateFileType(mimeType, filename);
    if (!typeValidation.isValid) {
      throw new Error(typeValidation.error);
    }

    const sizeValidation = validateFileSize(fileBuffer.length);
    if (!sizeValidation.isValid) {
      throw new Error(sizeValidation.error);
    }

    const userId = getUserId();
    const extension = filename.split(".").pop()?.toLowerCase() || "bin";
    const uniqueFilename = generateUniqueFilename(filename);
    const storageKey = generateStorageKey(userId, skillId, uniqueFilename);
    const storageUrl = generatePublicUrl(storageKey);

    // 1. Stage database record in UPLOADING status to prevent orphan uploads
    const fileRecord = await prisma.knowledgeFile.create({
      data: {
        skillId,
        filename: uniqueFilename, // Stored name
        originalName: filename,
        mimeType,
        extension,
        size: fileBuffer.length,
        storageUrl,
        status: KnowledgeFileStatus.UPLOADING,
      },
    });

    try {
      // 2. Put file object into S3/R2 Bucket
      const uploadCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await r2Client.send(uploadCommand);
      console.log(`[Upload Service] File uploaded to R2: Key="${storageKey}"`);

      // 3. Mark database status as READY
      const updatedRecord = await prisma.knowledgeFile.update({
        where: { id: fileRecord.id },
        data: { status: KnowledgeFileStatus.READY },
      });

      console.log(`[Upload Service] Skill Created: ID=${updatedRecord.id}, Name="${updatedRecord.originalName}"`);
      return updatedRecord;
    } catch (err: any) {
      console.error(`[Upload Service] Failed upload pipeline:`, err);
      // Run cleanup flow
      await this.cleanupFailedUpload(storageKey, fileRecord.id);
      throw err;
    }
  }

  /**
   * Deletes an active file from R2 and removes the database record.
   */
  static async deleteFile(id: string): Promise<boolean> {
    const fileRecord = await prisma.knowledgeFile.findUnique({
      where: { id },
    });

    if (!fileRecord) {
      throw new Error("File not found in database.");
    }

    const userId = getUserId();
    const storageKey = generateStorageKey(userId, fileRecord.skillId, fileRecord.filename);

    try {
      // 1. Delete object from R2
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
      });
      await r2Client.send(deleteCommand);
      console.log(`[Upload Service] Object removed from R2: Key="${storageKey}"`);
    } catch (s3Err) {
      console.warn(`[Upload Service] File key not found in S3 bucket, removing DB record. Key="${storageKey}"`, s3Err);
    }

    // 2. Remove database row
    await prisma.knowledgeFile.delete({
      where: { id },
    });

    console.log(`[Upload Service] File Deleted: ID=${id}, Name="${fileRecord.originalName}"`);
    return true;
  }

  /**
   * Replaces an existing file with a new file.
   */
  static async replaceFile(
    id: string,
    newFilename: string,
    newMimeType: string,
    fileBuffer: Buffer
  ): Promise<KnowledgeFile> {
    const fileRecord = await prisma.knowledgeFile.findUnique({
      where: { id },
    });

    if (!fileRecord) {
      throw new Error("File to replace not found in database.");
    }

    const userId = getUserId();
    const oldStorageKey = generateStorageKey(userId, fileRecord.skillId, fileRecord.filename);

    // Delete old file first
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: oldStorageKey,
      });
      await r2Client.send(deleteCommand);
    } catch (s3Err) {
      console.warn(`[Upload Service] Old S3 object delete warn for replace:`, s3Err);
    }

    // Process new file upload
    const extension = newFilename.split(".").pop()?.toLowerCase() || "bin";
    const uniqueFilename = generateUniqueFilename(newFilename);
    const newStorageKey = generateStorageKey(userId, fileRecord.skillId, uniqueFilename);
    const newStorageUrl = generatePublicUrl(newStorageKey);

    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: newStorageKey,
        Body: fileBuffer,
        ContentType: newMimeType,
      });

      await r2Client.send(uploadCommand);

      const updatedRecord = await prisma.knowledgeFile.update({
        where: { id },
        data: {
          filename: uniqueFilename,
          originalName: newFilename,
          mimeType: newMimeType,
          extension,
          size: fileBuffer.length,
          storageUrl: newStorageUrl,
          status: KnowledgeFileStatus.READY,
        },
      });

      console.log(`[Upload Service] File Updated: ID=${updatedRecord.id}, Name="${updatedRecord.originalName}"`);
      return updatedRecord;
    } catch (err: any) {
      await this.cleanupFailedUpload(newStorageKey, id);
      throw err;
    }
  }

  /**
   * Retrieves all knowledge files stored in the database.
   */
  static async findAllFiles(): Promise<KnowledgeFile[]> {
    return prisma.knowledgeFile.findMany({
      orderBy: { uploadedAt: "desc" },
    });
  }
}
