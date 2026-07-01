import prisma from "@/src/lib/prisma";
import { UnifiedSearchResult, SearchOptions, SearchFilters } from "../types/globalSearch";
import { buildPrismaWhereFilters } from "./searchFilters";
import { normalizeScore } from "./searchRanking";
import { generateHighlightSnippet } from "./searchHighlights";
import { SearchService } from "../services/search.service";

/**
 * Aggregates search results across Skills, Files, Chats, Messages, Memories, and Document Chunks.
 */
export async function aggregateSearchResults(
  userId: string,
  options: SearchOptions
): Promise<UnifiedSearchResult[]> {
  const { query, filters, limit = 20 } = options;
  const results: UnifiedSearchResult[] = [];

  const prismaFilters = buildPrismaWhereFilters(filters);
  const scope = filters?.scope || ["SKILL", "FILE", "CHAT", "MESSAGE", "MEMORY", "CHUNK"];

  // 1. SEARCH SKILLS
  if (scope.includes("SKILL")) {
    const skills = await prisma.skill.findMany({
      where: {
        userId,
        // Map common fields manually
        createdAt: prismaFilters.createdAt,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
    });

    skills.forEach((s) => {
      const isTitleMatch = s.name.toLowerCase().includes(query.toLowerCase());
      const rawScore = isTitleMatch ? 1.0 : 0.6;
      results.push({
        id: s.id,
        type: "SKILL",
        title: s.name,
        snippet: generateHighlightSnippet(s.description || "No description provided.", query),
        score: normalizeScore(rawScore, "fuzzy"),
        skillId: s.id,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        matchedFields: isTitleMatch ? ["name"] : ["description"],
        navigationId: { skillId: s.id },
      });
    });
  }

  // 2. SEARCH KNOWLEDGE FILES
  if (scope.includes("FILE")) {
    const files = await prisma.knowledgeFile.findMany({
      where: {
        skill: { userId },
        ...prismaFilters,
        OR: [
          { originalName: { contains: query, mode: "insensitive" } },
          { extension: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { skill: true },
      take: limit,
    });

    files.forEach((f) => {
      const isNameMatch = f.originalName.toLowerCase().includes(query.toLowerCase());
      const rawScore = isNameMatch ? 1.0 : 0.5;
      results.push({
        id: f.id,
        type: "FILE",
        title: f.originalName,
        snippet: `File format: ${f.extension.toUpperCase()} (${(f.size / 1024).toFixed(1)} KB). Status: ${f.status}`,
        score: normalizeScore(rawScore, "fuzzy"),
        skillId: f.skillId,
        skillName: f.skill.name,
        createdAt: f.uploadedAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        matchedFields: isNameMatch ? ["originalName"] : ["extension"],
        navigationId: { skillId: f.skillId, fileId: f.id },
      });
    });
  }

  // 3. SEARCH CHATS
  if (scope.includes("CHAT")) {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
        ...prismaFilters,
        title: { contains: query, mode: "insensitive" },
      },
      include: { skill: true },
      take: limit,
    });

    chats.forEach((c) => {
      results.push({
        id: c.id,
        type: "CHAT",
        title: c.title,
        snippet: `Chat thread in Skill workspace "${c.skill.name}". Created at ${c.createdAt.toLocaleDateString()}`,
        score: normalizeScore(1.0, "fuzzy"),
        skillId: c.skillId,
        skillName: c.skill.name,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        matchedFields: ["title"],
        navigationId: { skillId: c.skillId, chatId: c.id },
      });
    });
  }

  // 4. SEARCH MESSAGES
  if (scope.includes("MESSAGE")) {
    const messages = await prisma.message.findMany({
      where: {
        chat: { userId },
        ...prismaFilters,
        content: { contains: query, mode: "insensitive" },
      },
      include: { chat: { include: { skill: true } } },
      take: limit,
    });

    messages.forEach((m) => {
      results.push({
        id: m.id,
        type: "MESSAGE",
        title: `Message in "${m.chat.title}"`,
        snippet: generateHighlightSnippet(m.content, query),
        score: normalizeScore(0.8, "fuzzy"),
        skillId: m.chat.skillId,
        skillName: m.chat.skill.name,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.createdAt.toISOString(),
        matchedFields: ["content"],
        navigationId: { skillId: m.chat.skillId, chatId: m.chatId, messageId: m.id },
      });
    });
  }

  // 5. SEARCH MEMORIES
  if (scope.includes("MEMORY")) {
    const memories = await prisma.memory.findMany({
      where: {
        userId,
        ...prismaFilters,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { skill: true },
      take: limit,
    });

    memories.forEach((mem) => {
      const isTitleMatch = mem.title.toLowerCase().includes(query.toLowerCase());
      const rawScore = isTitleMatch ? 1.0 : 0.7;
      results.push({
        id: mem.id,
        type: "MEMORY",
        title: mem.title,
        snippet: generateHighlightSnippet(mem.content, query),
        score: normalizeScore(rawScore, "fuzzy"),
        skillId: mem.skillId,
        skillName: mem.skill.name,
        createdAt: mem.createdAt.toISOString(),
        updatedAt: mem.updatedAt.toISOString(),
        matchedFields: isTitleMatch ? ["title"] : ["content"],
        navigationId: { skillId: mem.skillId, memoryId: mem.id },
      });
    });
  }

  // 6. SEARCH DOCUMENT CHUNKS (SEMANTIC SEARCH)
  if (scope.includes("CHUNK") && filters?.skillId) {
    // Run semantic similarity search via pgvector on specified skill
    const chunks = await SearchService.querySemanticIndex(
      query,
      filters.skillId,
      limit
    );

    chunks.forEach((c) => {
      results.push({
        id: c.chunkId,
        type: "CHUNK",
        title: `Snippet in "${c.documentTitle}"`,
        snippet: generateHighlightSnippet(c.content, query),
        score: normalizeScore(c.distance, "vector"),
        skillId: filters.skillId as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        matchedFields: ["content"],
        navigationId: { skillId: filters.skillId as string },
      });
    });
  }

  return results;
}
