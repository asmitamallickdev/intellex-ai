/*
  Warnings:

  - Added the required column `skillId` to the `chunks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillId` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chunks" ADD COLUMN     "skillId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "skillId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "chunks_skillId_idx" ON "chunks"("skillId");

-- CreateIndex
CREATE INDEX "documents_skillId_idx" ON "documents"("skillId");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
