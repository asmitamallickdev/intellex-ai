import { KnowledgeFile } from "@prisma/client";

export interface UploadResponse<T = KnowledgeFile> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface StorageObjectMetadata {
  storageKey: string;
  storageUrl: string;
  storedName: string;
  size: number;
  mimeType: string;
  extension: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
