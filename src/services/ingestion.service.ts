import prisma from "@/src/lib/prisma";
import { r2Client, R2_BUCKET_NAME } from "../lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { parseDocument } from "../lib/parser";
import { cleanText } from "../lib/textCleaner";
import { chunkText } from "../lib/chunker";
import { generateStorageKey } from "../lib/storage";
import { Document, KnowledgeFileStatus } from "@prisma/client";
import { IngestionConfig } from "../types/ingestion";

// Global constant fallback DEV_USER_ID mapping
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export class IngestionService {
  /**
   * Processes a KnowledgeFile after it reaches S3:
   * Downloads from R2, parses text content, cleans it, segments it, and stores chunks.
   */
  static async ingestFile(
    fileId: string,
    config: IngestionConfig = { chunkSize: 1000, chunkOverlap: 200 }
  ): Promise<{ document: Document; chunksCount: number }> {
    console.log(`[Ingestion Service] Initializing ingestion pipeline for FileId=${fileId}`);

    // 1. Fetch file reference details
    const fileRecord = await prisma.knowledgeFile.findUnique({
      where: { id: fileId },
    });

    if (!fileRecord) {
      throw new Error(`Knowledge file record not found in database: ID=${fileId}`);
    }

    // Update status to PROCESSING
    await prisma.knowledgeFile.update({
      where: { id: fileId },
      data: { status: KnowledgeFileStatus.PROCESSING },
    });

    const storageKey = generateStorageKey(DEV_USER_ID, fileRecord.skillId, fileRecord.filename);

    try {
      // 2. Download raw file from Cloudflare R2
      console.log(`[Ingestion Service] Downloading object from R2: Key="${storageKey}"`);
      const getCommand = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: storageKey,
      });

      const r2Response = await r2Client.send(getCommand);
      const byteArray = await r2Response.Body?.transformToByteArray();
      if (!byteArray) {
        throw new Error("Empty body stream received from R2 storage.");
      }
      const fileBuffer = Buffer.from(byteArray);
      console.log(`[Ingestion Service] Download completed. Size: ${fileBuffer.length} bytes`);

      // 3. Extract text content
      console.log(`[Ingestion Service] Extracting text content from "${fileRecord.originalName}"`);
      const parsedResult = await parseDocument(fileRecord.originalName, fileBuffer);

      if (parsedResult.isUnsupported) {
        console.log(`[Ingestion Service] Skiped unsupported format: "${fileRecord.originalName}". Flagged for OCR.`);
        
        // Finalize state as READY with no parsed documents
        await prisma.knowledgeFile.update({
          where: { id: fileId },
          data: { status: KnowledgeFileStatus.READY },
        });

        // Create document shell marking pageCount
        const docShell = await prisma.document.create({
          data: {
            knowledgeFileId: fileId,
            title: fileRecord.originalName,
            summary: "Document format is not indexable. OCR processing required.",
            pageCount: parsedResult.pageCount || 1,
            language: "unknown",
          },
        });

        return { document: docShell, chunksCount: 0 };
      }

      // 4. Clean extracted text
      console.log(`[Ingestion Service] Cleaning text content...`);
      const cleanedText = cleanText(parsedResult.text);

      if (!cleanedText) {
        throw new Error("No readable text content extracted from document.");
      }

      // 5. Segment cleaned text into chunks
      console.log(`[Ingestion Service] Segmenting text into chunks (Size: ${config.chunkSize}, Overlap: ${config.chunkOverlap})...`);
      const chunksData = chunkText(cleanedText, config.chunkSize, config.chunkOverlap);
      console.log(`[Ingestion Service] Created ${chunksData.length} chunks.`);

      // 6. DB Transaction: Create Document & Chunks
      console.log(`[Ingestion Service] Persisting Document and Chunks to Neon Database...`);
      
      const transactionResult = await prisma.$transaction(async (tx) => {
        // Create Document row
        const document = await tx.document.create({
          data: {
            knowledgeFileId: fileId,
            title: parsedResult.title || fileRecord.originalName,
            summary: "Summary will be generated during the embedding phase.",
            pageCount: parsedResult.pageCount || 1,
            language: "en",
          },
        });

        // Batch insert Chunk rows
        if (chunksData.length > 0) {
          await tx.chunk.createMany({
            data: chunksData.map((chk) => ({
              documentId: document.id,
              chunkIndex: chk.chunkIndex,
              content: chk.content,
              tokenCount: chk.tokenCount,
              metadata: {},
            })),
          });
        }

        // Update KnowledgeFile status to READY
        await tx.knowledgeFile.update({
          where: { id: fileId },
          data: { status: KnowledgeFileStatus.READY },
        });

        return { document, chunksCount: chunksData.length };
      });

      console.log(`[Ingestion Service] Ingestion pipeline finished successfully. Chunks created: ${transactionResult.chunksCount}`);
      return transactionResult;
    } catch (err: any) {
      console.error(`[Ingestion Service] Ingestion pipeline failed for FileId ${fileId}:`, err);
      
      // Update database record status to FAILED
      await prisma.knowledgeFile.update({
        where: { id: fileId },
        data: { status: KnowledgeFileStatus.FAILED },
      }).catch((dbErr) => console.error("[Ingestion Service] DB status cleanup error:", dbErr));

      throw err;
    }
  }
}
