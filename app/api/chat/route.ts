import { NextRequest } from "next/server";
import { ChatService } from "@/src/services/chat.service";
import { sendMessageSchema } from "@/src/validators/chat.validator";
import { 
  formatStreamChunk, 
  formatStreamMetadata, 
  formatStreamError, 
  formatStreamDone 
} from "@/src/lib/stream";

export const dynamic = "force-dynamic";

/**
 * Route Handler: POST /api/chat
 * Streams AI RAG responses and sends citations/sources metadata at the end.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate incoming parameters using sendMessage Zod schema
    const validated = sendMessageSchema.safeParse(body);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((e) => e.message).join(" ");
      return new Response(formatStreamError(errorMsg), {
        status: 400,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    const encoder = new TextEncoder();

    // 2. Return SSE ReadableStream mapping chunks and final metadata
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          await ChatService.sendMessageStream(
            validated.data,
            (text) => {
              controller.enqueue(encoder.encode(formatStreamChunk(text)));
            },
            (payload) => {
              controller.enqueue(encoder.encode(formatStreamMetadata(payload.metadata)));
              controller.enqueue(encoder.encode(formatStreamDone()));
              controller.close();
            }
          );
        } catch (err: any) {
          console.error("[Route Handler] Error during message streaming session:", err);
          controller.enqueue(encoder.encode(formatStreamError(err.message || String(err))));
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("[Route Handler] Request parse error:", err);
    return new Response(formatStreamError("Failed to initiate chat stream: " + err.message), {
      status: 500,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  }
}
