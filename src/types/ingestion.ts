import { Document, Chunk } from "@prisma/client";

export interface IngestionResponse<T = { document: Document; chunksCount: number }> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface IngestionConfig {
  chunkSize: number;
  chunkOverlap: number;
}

export interface ParsedDocumentResult {
  text: string;
  title: string;
  pageCount?: number;
  metadata?: Record<string, any>;
  isUnsupported: boolean;
}

export interface DocumentChunkResult {
  content: string;
  chunkIndex: number;
  tokenCount: number;
}
