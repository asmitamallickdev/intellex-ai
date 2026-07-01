import prisma from "@/src/lib/prisma";
import { openai } from "../lib/openai";
import { SearchService } from "./search.service";
import { getFormattedHistory } from "../lib/chatHistory";
import { buildRAGPrompt } from "../lib/promptBuilder";
import { Chat, Message, MessageRole } from "@prisma/client";
import { SendMessageInput } from "../validators/chat.validator";
import { processCitations, calculateConfidenceScore } from "../lib/citations";
import { extractUniqueSources, extractUniqueDocumentIds } from "../lib/sourceFormatter";
import { buildResponseMetadata } from "../lib/responseMetadata";
import { ResponseMetadataPayload } from "../types/chat";
import { estimateTokenCount } from "../lib/tokenizer";
import { getRelevantMemoriesForPrompt } from "../lib/memoryRetriever";
import { MemoryService } from "./memory.service";

// Global constant fallback DEV_USER_ID mapping
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export class ChatService {
  /**
   * Helper to ensure development user exists in database to fulfill foreign key constraints.
   */
  private static async ensureDevUserExists() {
    await prisma.user.upsert({
      where: { id: DEV_USER_ID },
      update: {},
      create: {
        id: DEV_USER_ID,
        email: "dev-chat-user@intellex.ai",
        passwordHash: "$2b$10$dummyhashforchatdevelopmentpurposesonly",
        name: "Development Chat User",
      },
    });
  }

  /**
   * Creates a new chat session thread in the database.
   */
  static async createChat(skillId: string, title: string): Promise<Chat> {
    await this.ensureDevUserExists();
    return prisma.chat.create({
      data: {
        userId: DEV_USER_ID,
        skillId,
        title,
      },
    });
  }

  /**
   * Retrieves a chat session record by ID.
   */
  static async getChat(id: string): Promise<Chat | null> {
    return prisma.chat.findUnique({
      where: { id },
    });
  }

  /**
   * Lists all messages in a specific chat session thread.
   */
  static async getChatMessages(chatId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Retrieves all chat sessions linked to a specific skill ID.
   */
  static async getChatsBySkill(skillId: string): Promise<Chat[]> {
    return prisma.chat.findMany({
      where: { skillId, userId: DEV_USER_ID },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Renames a chat thread title.
   */
  static async renameChat(id: string, title: string): Promise<Chat> {
    return prisma.chat.update({
      where: { id },
      data: { title },
    });
  }

  /**
   * Deletes a chat thread session.
   */
  static async deleteChat(id: string): Promise<boolean> {
    await prisma.chat.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Sends a user query to the RAG AI pipeline and persists assistant responses in database.
   */
  static async sendMessage(input: SendMessageInput): Promise<Message> {
    const startTime = Date.now();
    await this.ensureDevUserExists();

    const { chatId, content, temperature, maxChunks, maxHistory, maxTokens } = input;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new Error(`Chat session thread not found: ID=${chatId}`);
    }

    // 1. Save user query message to database
    await prisma.message.create({
      data: {
        chatId,
        role: MessageRole.USER,
        content: content.trim(),
      },
    });

    try {
      // 2. Fetch recent conversation history
      const historyStartTime = Date.now();
      const history = await getFormattedHistory(chatId, maxHistory);
      const historyTime = Date.now() - historyStartTime;

      // 3. Retrieve relevant long-term memories for current Skill
      const memoryStartTime = Date.now();
      const relevantMemories = await getRelevantMemoriesForPrompt(
        chat.skillId,
        content,
        5, // limit max memories
        0.5 // min confidence score
      );
      const memoryTime = Date.now() - memoryStartTime;

      // 4. Query pgvector semantic search against skill knowledge base
      const retrievalStartTime = Date.now();
      const retrievedChunks = await SearchService.querySemanticIndex(
        content,
        chat.skillId,
        maxChunks
      );
      const retrievalTime = Date.now() - retrievalStartTime;

      console.log(`[Chat Service] Semantic Search returned ${retrievedChunks.length} chunks.`);

      // 5. Assemble structured prompt (System Instructions + Memories + Context Chunks + History + Current Query)
      const promptStartTime = Date.now();
      const promptMessages = buildRAGPrompt(
        retrievedChunks,
        history,
        content,
        relevantMemories
      );
      const promptTime = Date.now() - promptStartTime;

      // 6. Send payload to OpenAI Chat Completions API
      console.log(`[Chat Service] Sending request to OpenAI API...`);
      const apiStartTime = Date.now();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: promptMessages as any,
        temperature,
        max_tokens: maxTokens,
      });
      const apiLatency = Date.now() - apiStartTime;

      const assistantReply = completion.choices[0]?.message?.content || "No response received from AI model.";
      const finishReason = completion.choices[0]?.finish_reason || "stop";

      // 7. Build Citations, Sources and Response Metadata
      const citations = processCitations(retrievedChunks as any);
      const confidenceScore = calculateConfidenceScore(citations);
      const sources = extractUniqueSources(citations);
      const documentsUsed = extractUniqueDocumentIds(citations);

      const inputTokens = completion.usage?.prompt_tokens || estimateTokenCount(JSON.stringify(promptMessages));
      const outputTokens = completion.usage?.completion_tokens || estimateTokenCount(assistantReply);
      const totalTokens = inputTokens + outputTokens;

      const generationMetadata = buildResponseMetadata(
        "gpt-4o-mini",
        inputTokens,
        outputTokens,
        apiLatency,
        temperature,
        finishReason
      );

      const responseMetadataPayload: ResponseMetadataPayload = {
        sources,
        citations,
        documentsUsed,
        confidenceScore,
        generationMetadata,
      };

      const totalRequestTime = Date.now() - startTime;

      console.log(`[Chat Service] Structured Performance Log:
        - History Loading Time: ${historyTime}ms
        - Memory Retrieval Time: ${memoryTime}ms
        - Vector Retrieval Time: ${retrievalTime}ms
        - Prompt Assembly Time: ${promptTime}ms
        - OpenAI API Latency: ${apiLatency}ms
        - Total Request Time: ${totalRequestTime}ms`);

      // 8. Save assistant response message in DB with JSON metadata
      const assistantMessage = await prisma.message.create({
        data: {
          chatId,
          role: MessageRole.ASSISTANT,
          content: assistantReply,
          tokenUsage: totalTokens,
          metadata: responseMetadataPayload as any,
        },
      });

      // 9. Asynchronously extract new memories from the chat thread logs (doesn't delay response)
      MemoryService.extractAndSaveMemoriesFromChat(chatId).catch((err) =>
        console.error("[Chat Service] Background memory extraction task failed:", err)
      );

      return assistantMessage;
    } catch (err: any) {
      console.error(`[Chat Service] Error processing RAG chat completion:`, err);
      
      // Save error message block to DB to keep thread interactive
      return prisma.message.create({
        data: {
          chatId,
          role: MessageRole.ASSISTANT,
          content: `Sorry, I encountered an error while processing your request: ${err.message || String(err)}`,
        },
      });
    }
  }

  /**
   * Regenerates the last assistant response by fetching the last user query.
   */
  static async regenerateResponse(
    chatId: string,
    options: Omit<SendMessageInput, "chatId" | "content">
  ): Promise<Message> {
    // 1. Fetch last messages in the thread
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      take: 2,
    });

    if (messages.length === 0) {
      throw new Error("Cannot regenerate response for an empty chat session thread.");
    }

    let lastUserMessage = messages.find((m) => m.role === MessageRole.USER);
    const lastAssistantMessage = messages.find((m) => m.role === MessageRole.ASSISTANT);

    if (!lastUserMessage) {
      // Look deeper in thread if needed
      const found = await prisma.message.findFirst({
        where: { chatId, role: MessageRole.USER },
        orderBy: { createdAt: "desc" },
      });
      lastUserMessage = found || undefined;
    }

    if (!lastUserMessage) {
      throw new Error("No user message found to regenerate response for.");
    }

    // 2. Clean up previous assistant response if exists to keep thread clean
    if (lastAssistantMessage) {
      await prisma.message.delete({
        where: { id: lastAssistantMessage.id },
      });
    }

    // 3. Re-run Send Message query using the same content
    return this.sendMessage({
      chatId,
      content: lastUserMessage.content,
      ...options,
    });
  }
}
