/**
 * Server-Sent Events (SSE) streaming formatters.
 */

export function formatStreamChunk(text: string): string {
  return `data: ${JSON.stringify({ type: "text", content: text })}\n\n`;
}

export function formatStreamMetadata(payload: any): string {
  return `data: ${JSON.stringify({ type: "metadata", payload })}\n\n`;
}

export function formatStreamError(error: string): string {
  return `data: ${JSON.stringify({ type: "error", error })}\n\n`;
}

export function formatStreamDone(): string {
  return `data: [DONE]\n\n`;
}
