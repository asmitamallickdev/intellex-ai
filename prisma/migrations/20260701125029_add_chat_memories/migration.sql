-- CreateTable
CREATE TABLE "chat_memories" (
    "id" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "chatId" UUID,
    "context" TEXT NOT NULL,
    "summary" TEXT,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_memories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_memories_skillId_idx" ON "chat_memories"("skillId");

-- CreateIndex
CREATE INDEX "chat_memories_createdAt_idx" ON "chat_memories"("createdAt");

-- AddForeignKey
ALTER TABLE "chat_memories" ADD CONSTRAINT "chat_memories_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
