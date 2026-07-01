import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStreamResponse, stepCountIs, streamText, toUIMessageStream, tool } from "ai";
import { z } from "zod";
import { SkillService } from "@/src/services/skill.service";
import { SearchService } from "@/src/services/search.service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, skillId } = await req.json();
  console.log("/api/chat")
  console.log(skillId);

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
        "2. **Ground your answer strictly in the tool results.**",
        "   - Cite the document title when referencing specific information (e.g., \"According to [Document Title]...\").",
        "   - If the tool returns results with low relevance scores (below 0.3), acknowledge this and let the user know the knowledge base may not cover their question.",
        "3. **NEVER fabricate, guess, or hallucinate information** that is not supported by the retrieved documents.",
        "   - If the knowledge base has no relevant information, say so honestly: \"I couldn't find information about this in the knowledge base. Could you rephrase your question or upload relevant documents?\"",
        "4. **Respond in a clear, well-structured format** using markdown when helpful (bullet points, numbered lists, headers, bold for key terms).",
        "5. **Be conversational and helpful.** Greet users warmly, ask clarifying questions when the query is ambiguous, and suggest related topics they might explore.",
        "",
        "## WHAT YOU MUST NOT DO",
        "- Do NOT answer from general world knowledge. Only use the knowledge base.",
        "- Do NOT skip calling the tool, even if you think you know the answer.",
        "- Do NOT make up document titles or citations.",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        'You are "Intellex AI", a helpful and knowledgeable assistant.',
        "",
        "Answer the user's question clearly and concisely. Be conversational and friendly.",
        "If a knowledge base tool is available, always use it before answering.",
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
    },
  });

  const uiMessageStream = toUIMessageStream({ stream: result.stream as ReadableStream<any> });
  return createUIMessageStreamResponse({ stream: uiMessageStream });
}
