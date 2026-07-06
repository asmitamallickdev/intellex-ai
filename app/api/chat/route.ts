import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStreamResponse, generateText, stepCountIs, streamText, toUIMessageStream, tool } from "ai";
import { z } from "zod";
import { SkillService } from "@/src/services/skill.service";
import { SearchService } from "@/src/services/search.service";
import { ChatService } from "@/src/services/chat.service";
import { ChatMemoryService } from "@/src/services/chatMemory.service";
import prisma from "@/src/lib/prisma";
import { MessageRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, skillId, chatId } = await req.json();
  console.log("/api/chat", { skillId, chatId });

  if (chatId) {
    const lastUserMsg = messages?.filter((m: any) => m.role === "user").pop();
    if (lastUserMsg) {
      const textPart = (lastUserMsg.parts ?? []).find((p: any) => p.type === "text") as { text: string } | undefined;
      if (textPart?.text) {
        await prisma.message.create({
          data: {
            chatId,
            role: MessageRole.USER,
            content: textPart.text,
          },
        }).catch((err) => console.error("[API] Failed to save user message:", err));
      }
    }
  }

  const skill = await SkillService.findById(skillId);

  const systemMessage = skill
    ? [
        `You are "Intellex AI", an expert assistant for the skill "${skill.name}".`,
        skill.description ? `Skill description: ${skill.description}` : "",
        "",
        "## CRITICAL INSTRUCTIONS — FOLLOW EVERY TIME",
        "",
        "1. **ALWAYS call the \`searchKnowledgeBase\` tool FIRST** before composing any answer.",
        "   - Formulate a clear, relevant search query derived from the user's question.",
        "   - If the user's question is broad, break it into focused sub-queries and call the tool for each.",
        "2. **Ground your answer in the tool results when they are relevant.**",
        "   - Cite the document title when referencing specific information (e.g., \"According to [Document Title]...\").",
        "   - If the tool returns results with good relevance scores (≥0.3), use them as your primary source.",
        "   - If no relevant results are found (below 0.3 or empty), you may answer from your general knowledge about the skill topic. Clearly tell the user: \"I couldn't find specific documents about this in the knowledge base, but here's what I know regarding [skill]:\"",
        "3. **NEVER fabricate, guess, or hallucinate information.**",
        "   - When using your general knowledge, stick to well-established facts about the skill domain.",
        "   - If you are unsure, say so rather than making things up.",
        "4. **Respond in a clear, well-structured format** using markdown when helpful (bullet points, numbered lists, headers, bold for key terms).",
        "5. **Be conversational and helpful.** Greet users warmly, ask clarifying questions when the query is ambiguous, and suggest related topics they might explore.",
        "6. **Use the \`saveToMemory\` tool when the user explicitly asks to remember something, or when you encounter important context worth preserving.** The tool saves the recent conversation context to long-term memory.",
        "7. **Use the \`searchMemory\` tool when the user refers to something from a past conversation or asks about previously remembered information.** Formulate a clear search query to retrieve relevant memories.",
        "",
        "## WHAT YOU MUST NOT DO",
        "- Do NOT skip calling the \`searchKnowledgeBase\` tool — call it first, then decide.",
        "- Do NOT make up document titles or citations.",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        'You are "Intellex AI", a helpful and knowledgeable assistant.',
        "",
        "Answer the user's question clearly and concisely. Be conversational and friendly.",
        "If a knowledge base tool is available, always use it first. If no relevant results are found, you may answer from your general knowledge.",
      ].join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    tools: {
      searchKnowledgeBase: tool({
        description:
          "Search the skill's knowledge base for relevant context using semantic similarity. You MUST call this tool for EVERY user question to retrieve grounding context before answering. Formulate a clear search query based on the user's question.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "A focused search query to find relevant content in the knowledge base. Derive this from the user's question — rephrase for better retrieval if needed."
            ),
        }),
        execute: async ({ query }) => {
          const results = await SearchService.querySemanticIndex(query, skillId, 5);
          return results.map((r) => ({
            content: r.content,
            title: r.documentTitle,
            score: +(1 - r.distance).toFixed(4),
          }));
        },
      }),
      searchMemory: tool({
        description:
          "Search past conversation memories for relevant context using semantic similarity. Call this when the user refers to something discussed in a previous conversation or asks about previously remembered information.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "A focused search query to find relevant past conversation memories."
            ),
        }),
        execute: async ({ query }) => {
          const results = await ChatMemoryService.searchMemory(query, skillId, 5);
          return results.map((r) => ({
            context: r.context,
            summary: r.summary,
            score: r.score,
          }));
        },
      }),
      saveToMemory: tool({
        description:
          "Save important conversation context to long-term memory. Call this when the user explicitly asks to remember something, or when critical information is shared that should be preserved for future conversations.",
        inputSchema: z.object({
          summary: z
            .string()
            .describe("A brief title or summary of what to remember (max 10 words)"),
        }),
        execute: async ({ summary }) => {
          const recentMessages = messages.slice(-10);
          const context = recentMessages
            .map((m: any) => {
              const role = m.role === "user" ? "User" : "Assistant";
              const text = (m.parts ?? []).find((p: any) => p.type === "text")?.text || "";
              return `${role}: ${text}`;
            })
            .join("\n");

          await ChatMemoryService.saveMemory(skillId, chatId, context, summary);
          return { success: true, message: "Conversation context saved to long-term memory." };
        },
      }),
    },
  });

  const uiMessageStream = toUIMessageStream({
    stream: result.stream as ReadableStream<any>,
    onEnd: async ({ messages: updatedMessages }) => {
      if (chatId) {
        const lastAssistantMsg = updatedMessages?.filter((m) => m.role === "assistant").pop();
        if (lastAssistantMsg) {
          const textPart = (lastAssistantMsg.parts ?? []).find((p) => p.type === "text") as { text: string } | undefined;
          if (textPart?.text) {
            await prisma.message.create({
              data: {
                chatId,
                role: MessageRole.ASSISTANT,
                content: textPart.text,
              },
            }).catch((err) => console.error("[API] Failed to save assistant message:", err));
          }
        }

        // Auto-rename chat after first exchange
        const msgCount = await prisma.message.count({ where: { chatId } });
        if (msgCount === 2) {
          const lastUserMsg = updatedMessages?.filter((m) => m.role === "user").pop();
          const lastAssistantMsgForTitle = updatedMessages?.filter((m) => m.role === "assistant").pop();
          const userText = ((lastUserMsg?.parts ?? []).find((p: any) => p.type === "text") as { text: string } | undefined)?.text || "";
          const assistantText = ((lastAssistantMsgForTitle?.parts ?? []).find((p: any) => p.type === "text") as { text: string } | undefined)?.text || "";

          if (userText && assistantText) {
            generateText({
              model: openai("gpt-4o-mini"),
              system: "Generate a concise title (max 6 words) summarizing this chat conversation. Return ONLY the title — no quotes, no punctuation, no explanation.",
              prompt: `User: ${userText}\n\nAI: ${assistantText}`,
              maxOutputTokens: 30,
              temperature: 0.3,
            }).then(({ text: title }) => {
              if (title?.trim()) {
                ChatService.renameChat(chatId, title.trim()).catch((err) =>
                  console.error("[API] Failed to rename chat:", err)
                );
              }
            }).catch((err) => console.error("[API] Title generation failed:", err));
          }
        }
      }
    },
  });
  return createUIMessageStreamResponse({ stream: uiMessageStream });
}
