import { GenerationMetadata } from "../types/chat";

/**
 * Constructs standard metadata logs for the assistant message responses.
 */
export function buildResponseMetadata(
  modelName: string,
  inputTokens: number,
  outputTokens: number,
  latencyMs: number,
  temperature: number,
  finishReason?: string
): GenerationMetadata {
  return {
    modelName,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    latencyMs,
    temperature,
    finishReason: finishReason || "stop",
    timestamp: new Date().toISOString(),
  };
}
