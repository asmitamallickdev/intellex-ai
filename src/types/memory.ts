import { Memory, MemoryImportance } from "@prisma/client";
export type { Memory, MemoryImportance };

export interface MemoryResponse<T = Memory> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface MemoryListResponse {
  success: boolean;
  message?: string;
  data?: Memory[];
  error?: string;
  statusCode: number;
}

export interface ExtractedMemory {
  title: string;
  content: string;
  importance: MemoryImportance;
  confidence: number;
  category: string;
}

export interface MemoryNode {
  id: string;
  label: string;
  category: string;
  val: number;
  importance: string;
}

export interface MemoryLink {
  source: string;
  target: string;
  weight: number;
}
