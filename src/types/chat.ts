import { Chat, Message } from "@prisma/client";
export type { Chat, Message };

export interface ChatResponse<T = Chat> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ChatMessagesResponse {
  success: boolean;
  message?: string;
  data?: Message[];
  error?: string;
  statusCode: number;
}

export interface ChatConfig {
  maxHistory: number;
  maxChunks: number;
  temperature: number;
  maxTokens: number;
}

export interface ChatHistoryMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  originalFilename: string;
  storageUrl: string;
  chunkIndex: number;
  similarityScore: number;
  pageNumber?: number | null;
}

export interface GenerationMetadata {
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  temperature: number;
  finishReason?: string;
  timestamp: string;
}

export interface ResponseMetadataPayload {
  sources: string[];
  citations: Citation[];
  documentsUsed: string[];
  confidenceScore: number;
  generationMetadata: GenerationMetadata;
}

export interface ChatSession {
  id: string;
  title: string;
  skillId: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
