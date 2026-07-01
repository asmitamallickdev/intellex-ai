import { R2_PUBLIC_URL } from "./r2";
import { FileValidationResult } from "../types/upload";

// 100MB File Size Limit
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file extensions & mime types
export const ALLOWED_EXTENSIONS = [
  "pdf", "docx", "pptx", "xlsx", "csv", "txt", "md",
  "png", "jpg", "jpeg", "svg", "webp", "dwg"
];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "text/csv",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
  "image/vnd.dwg",
  "image/x-dwg",
];

/**
 * Validates the file extension and mime type.
 */
export function validateFileType(mimeType: string, filename: string): FileValidationResult {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Unsupported file extension .${ext || "unknown"}. Supported: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType) && !mimeType.startsWith("text/")) {
    return {
      isValid: false,
      error: `Unsupported mime type: ${mimeType}.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates that the file size doesn't exceed 100MB limit.
 */
export function validateFileSize(size: number): FileValidationResult {
  if (size <= 0) {
    return { isValid: false, error: "File cannot be empty." };
  }
  if (size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the 100MB limit (Current: ${(size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }
  return { isValid: true };
}

/**
 * Generates a unique filename using a random UUID, preserving the original extension.
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  const uuid = typeof window === "undefined" 
    ? require("crypto").randomUUID() 
    : "client-uuid-placeholder";
  return `${uuid}.${ext}`;
}

/**
 * Generates the storage object S3 key path.
 * Format: uploads/{userId}/{skillId}/{uniqueFilename}
 */
export function generateStorageKey(userId: string, skillId: string, uniqueFilename: string): string {
  return `uploads/${userId}/${skillId}/${uniqueFilename}`;
}

/**
 * Generates the public CDN URL to access the uploaded file.
 */
export function generatePublicUrl(storageKey: string): string {
  // Strip trailing slashes from public url
  const base = R2_PUBLIC_URL.endsWith("/") ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
  return `${base}/${storageKey}`;
}
