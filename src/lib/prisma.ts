import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (typeof window === "undefined") {
  // Configure WebSocket support for edge / serverless connection pooling
  neonConfig.webSocketConstructor = ws;
  
  const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/intellex";
  const adapter = new PrismaNeon({ connectionString: databaseUrl });

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} else {
  // Client-side execution fallback
  prisma = {} as PrismaClient;
}

export default prisma;
export * from "@prisma/client";
