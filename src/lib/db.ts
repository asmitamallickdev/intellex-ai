import prisma from "./prisma";

export interface DatabaseHealthStatus {
  status: "healthy" | "unhealthy";
  latencyMs?: number;
  extensions?: string[];
  error?: string;
}

/**
 * Validates the database connection by executing a simple query.
 * Gracefully handles connection failures.
 */
export async function validateConnection(): Promise<boolean> {
  if (typeof window !== "undefined") return false;
  
  try {
    // Run a basic test query
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error: any) {
    console.error("Database connection validation failed:", error.message || error);
    return false;
  }
}

/**
 * Perfroms a database health check, measuring query latency and listing active extensions.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  if (typeof window !== "undefined") {
    return { status: "unhealthy", error: "Database queries cannot run on the client side." };
  }

  const start = Date.now();
  try {
    // Query Neon PostgreSQL extension list to confirm pgvector setup
    const extensionsResult = await prisma.$queryRaw<{ extname: string }[]>`
      SELECT extname FROM pg_extension;
    `;
    const latencyMs = Date.now() - start;
    const extensions = Array.isArray(extensionsResult) 
      ? extensionsResult.map((e) => e.extname) 
      : [];

    return {
      status: "healthy",
      latencyMs,
      extensions,
    };
  } catch (error: any) {
    console.error("Database health check encountered error:", error.message || error);
    return {
      status: "unhealthy",
      error: error.message || String(error),
    };
  }
}

/**
 * Centralized exports for database operations.
 */
export { prisma };
export * from "./pgvector";
export * from "./prisma";
