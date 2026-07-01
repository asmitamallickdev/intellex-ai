import { openai } from "./openai";
import { MEMORY_EXTRACTION_SYSTEM_PROMPT } from "./memoryPrompt";
import { ExtractedMemory } from "../types/memory";
import { Message } from "@prisma/client";

/**
 * Invokes OpenAI chat completions API to analyze conversation history and extract new long-term memories.
 */
export async function extractMemoriesFromConversation(
  messages: Message[]
): Promise<ExtractedMemory[]> {
  try {
    if (messages.length < 2) return [];

    // Format the conversation text for the LLM
    const formattedDialogue = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MEMORY_EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: `Please analyze the following conversation history and extract long-term memories:\n\n${formattedDialogue}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // low temperature for precise extraction
    });

    const rawJson = response.choices[0]?.message?.content?.trim();
    if (!rawJson) return [];

    const parsed = JSON.parse(rawJson);
    
    // Look for an array inside the parsed object (or support root array)
    const memories: ExtractedMemory[] = Array.isArray(parsed) 
      ? parsed 
      : (Array.isArray(parsed.memories) ? parsed.memories : []);

    return memories.filter(
      (m) => m.title && m.content && m.importance
    );
  } catch (err) {
    console.error("[Memory Extractor] Error extracting memories from conversation:", err);
    return [];
  }
}
