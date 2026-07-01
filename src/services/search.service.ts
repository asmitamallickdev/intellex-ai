import prisma from "@/src/lib/prisma";
import { openai, EMBEDDING_MODEL } from "../lib/openai";

export class SearchService {
  /**
   * Queries Neon PostgreSQL pgvector for the most semantically relevant chunks.
   */
  static async querySemanticIndex(
    query: string,
    skillId: string,
    limit: number = 5
  ): Promise<{ chunkId: string; content: string; documentTitle: string; distance: number }[]> {
    try {
      // 1. Generate embedding for the user search query
      const embedResponse = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query,
      });
      const embedding = embedResponse.data[0].embedding;
      const vectorStr = `[${embedding.join(",")}]`;

      // 2. Query chunks ordered by pgvector cosine distance, filtering by skillId
      const results = await prisma.$queryRawUnsafe<any[]>(
        `SELECT 
          c.id, 
          c.content, 
          d.title as "documentTitle",
          d.id as "documentId",
          kf."originalName" as "originalFilename",
          kf."storageUrl" as "storageUrl",
          c."chunkIndex" as "chunkIndex",
          d."pageCount" as "pageNumber",
          (c.embedding <=> $1::vector) as distance
         FROM chunks c
         JOIN documents d ON c."documentId" = d.id
         JOIN knowledge_files kf ON d."knowledgeFileId" = kf.id
         WHERE kf."skillId" = $2::uuid 
           AND c."embeddingStatus" = 'COMPLETED'
         ORDER BY distance ASC
         LIMIT $3`,
        vectorStr,
        skillId,
        limit
      );

      return results.map((r) => ({
        chunkId: r.id,
        content: r.content,
        documentTitle: r.documentTitle,
        documentId: r.documentId,
        originalFilename: r.originalFilename,
        storageUrl: r.storageUrl,
        chunkIndex: Number(r.chunkIndex),
        pageNumber: r.pageNumber ? Number(r.pageNumber) : null,
        distance: Number(r.distance),
      }));
    } catch (err: any) {
      console.error("[Search Service] Error querying semantic index:", err);
      return [];
    }
  }
}
