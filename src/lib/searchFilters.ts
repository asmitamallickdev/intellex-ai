import { SearchFilters } from "../types/globalSearch";

/**
 * Maps standard filters to Prisma prisma.model.findMany query WHERE clauses.
 */
export function buildPrismaWhereFilters(
  filters: SearchFilters | undefined
): any {
  if (!filters) return {};

  const clauses: any = {};

  // 1. Skill scope mapping
  if (filters.skillId) {
    clauses.skillId = filters.skillId;
  }

  // 2. Date filters mapping
  if (filters.dateFrom || filters.dateTo) {
    clauses.createdAt = {};
    if (filters.dateFrom) {
      clauses.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      clauses.createdAt.lte = new Date(filters.dateTo);
    }
  }

  // 3. Category filters
  if (filters.categories && filters.categories.length > 0) {
    clauses.category = { in: filters.categories };
  }

  // 4. Memory importance levels
  if (filters.memoryImportance && filters.memoryImportance.length > 0) {
    clauses.importance = { in: filters.memoryImportance };
  }

  return clauses;
}
