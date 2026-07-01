export interface EmbeddingResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface EmbeddingBatchResult {
  processedCount: number;
  skippedCount: number;
  failedCount: number;
}

export interface EmbeddingConfig {
  batchSize: number;
  model: string;
  dimensions: number;
}
