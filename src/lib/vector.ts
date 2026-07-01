import prisma from "./prisma";

/**
 * Direct database vector operators using raw SQL pgvector queries.
 */

/**
 * Updates a Chunk record with its generated pgvector embedding array.
 */
export async function updateChunkEmbedding(
  chunkId: string,
  embedding: number[],
  model: string,
  dimensions: number
): Promise<void> {
  // Format numeric array to pgvector string: '[0.1,0.2,...]'
  const vectorStr = `[${embedding.join(",")}]`;

  // Parameterized binding updates pgvector column safely
  await prisma.$executeRawUnsafe(
    `UPDATE chunks 
     SET embedding = $1::vector, 
         "embeddingStatus" = 'COMPLETED',
         "embeddingModel" = $2,
         "embeddingDimensions" = $3,
         "embeddedAt" = NOW()
     WHERE id = $4::uuid`,
    vectorStr,
    model,
    dimensions,
    chunkId
  );
}

/**
 * Marks a chunk embedding process as FAILED.
 */
export async function markChunkEmbeddingFailed(chunkId: string): Promise<void> {
  await prisma.chunk.update({
    where: { id: chunkId },
    data: {
      embeddingStatus: "FAILED",
    },
  });
}
