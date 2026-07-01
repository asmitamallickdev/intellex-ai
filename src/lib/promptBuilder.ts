import { DEFAULT_SYSTEM_PROMPT } from "./systemPrompt";
import { ChatHistoryMessage } from "../types/chat";
import { Memory } from "@prisma/client";
import { formatMemoriesForPrompt } from "./memoryRetriever";

/**
 * Builds structured prompts for the OpenAI Chat Completions API.
 * Segregates core system guidelines, long-term memories, vector document context, conversation history, and current question.
 */
export function buildRAGPrompt(
  retrievedContext: { content: string; documentTitle: string }[],
  history: ChatHistoryMessage[],
  currentQuestion: string,
  memories: Memory[] = []
): ChatHistoryMessage[] {
  
  // 1. Build Memories block
  const memoriesSection = formatMemoriesForPrompt(memories);

  // 2. Build Document Context block
  let contextSection = "";
  if (retrievedContext.length > 0) {
    contextSection = "\n=== RETRIEVED DOCUMENT CONTEXT ===\n";
    retrievedContext.forEach((ctx, index) => {
      contextSection += `\n[Doc ${index + 1}: Title="${ctx.documentTitle}"]\n${ctx.content}\n`;
    });
    contextSection += "\n==================================\n";
  } else {
    contextSection = "\n[No relevant document context found. Answer using general knowledge if needed.]\n";
  }

  // 3. System Instruction Message
  const systemInstruction = `${DEFAULT_SYSTEM_PROMPT}\n${memoriesSection}\nUse the following document content to formulate your response:\n${contextSection}`;

  const messages: ChatHistoryMessage[] = [
    {
      role: "system",
      content: systemInstruction,
    },
  ];

  // 4. Inject formatted conversation history
  messages.push(...history);

  // 5. Inject current user question
  messages.push({
    role: "user",
    content: currentQuestion,
  });

  return messages;
}
