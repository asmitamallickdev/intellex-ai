import prisma from "@/src/lib/prisma";
import { Skill } from "@prisma/client";
import { CreateSkillInput, UpdateSkillInput, SkillFilterOptions } from "@/src/types/skill";

// Global Dev User ID conforming to Database UUID constraints
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Centrally manages the current session user ID.
 * Replace with auth() logic later to switch to production authentication.
 */
export function getUserId(): string {
  return DEV_USER_ID;
}

/**
 * Automatically ensures that the temporary development user exists in the database
 * to prevent foreign key constraint violations during development.
 */
async function ensureDevUserExists() {
  const userId = getUserId();
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: "dev-user@intellex.ai",
      passwordHash: "$2b$10$placeholderhashforsecuritydevelopment",
      name: "Development User",
    },
  });
}

export class SkillService {
  /**
   * Creates a new custom agent Skill in the database.
   */
  static async create(input: CreateSkillInput): Promise<Skill> {
    await ensureDevUserExists();
    const userId = getUserId();

    const skill = await prisma.skill.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        category: input.category,
        icon: input.icon,
        color: input.color,
      },
    });

    console.log(`[Skill Service] Skill Created: ID=${skill.id}, Name="${skill.name}"`);
    return skill;
  }

  /**
   * Updates an existing Skill's attributes and properties.
   */
  static async update(id: string, input: UpdateSkillInput): Promise<Skill> {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        icon: input.icon,
        color: input.color,
        isPinned: input.isPinned,
      },
    });

    console.log(`[Skill Service] Skill Updated: ID=${skill.id}, Name="${skill.name}"`);
    return skill;
  }

  /**
   * Deletes a Skill from the database by ID.
   */
  static async delete(id: string): Promise<Skill> {
    const skill = await prisma.skill.delete({
      where: { id },
    });

    console.log(`[Skill Service] Skill Deleted: ID=${skill.id}, Name="${skill.name}"`);
    return skill;
  }

  /**
   * Retrieves a single Skill by ID.
   */
  static async findById(id: string): Promise<Skill | null> {
    return prisma.skill.findUnique({
      where: { id },
    });
  }

  /**
   * Lists all Skills for the current user, applying sorting and filters.
   */
  static async findAll(options: SkillFilterOptions = {}): Promise<Skill[]> {
    await ensureDevUserExists();
    const userId = getUserId();

    const whereClause: any = {
      userId,
    };

    // Category filter
    if (options.category) {
      whereClause.category = options.category;
    }

    // Pinned filter
    if (options.pinned !== undefined) {
      whereClause.isPinned = options.pinned;
    }

    // Recently Updated filter (updated in the last 7 days)
    if (options.recentlyUpdated) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      whereClause.updatedAt = { gte: sevenDaysAgo };
    }

    // Search query: Case-insensitive search on name, description, and category
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      whereClause.OR = [
        { name: { contains: searchLower, mode: "insensitive" } },
        { description: { contains: searchLower, mode: "insensitive" } },
        { category: { contains: searchLower, mode: "insensitive" } },
      ];
    }

    // Sorting order
    let orderByClause: any = { createdAt: "desc" }; // default newest
    if (options.sortBy) {
      switch (options.sortBy) {
        case "oldest":
          orderByClause = { createdAt: "asc" };
          break;
        case "updated":
          orderByClause = { updatedAt: "desc" };
          break;
        case "alphabetical":
          orderByClause = { name: "asc" };
          break;
        case "newest":
        default:
          orderByClause = { createdAt: "desc" };
          break;
      }
    }

    return prisma.skill.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        _count: {
          select: {
            knowledgeFiles: true,
            chats: true,
          },
        },
      },
    });
  }

  /**
   * Finds skills strictly belonging to a specific category.
   */
  static async findByCategory(category: string): Promise<Skill[]> {
    const userId = getUserId();
    return prisma.skill.findMany({
      where: {
        userId,
        category,
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            knowledgeFiles: true,
            chats: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves pinned skills for quick access.
   */
  static async findPinned(): Promise<Skill[]> {
    const userId = getUserId();
    return prisma.skill.findMany({
      where: {
        userId,
        isPinned: true,
      },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            knowledgeFiles: true,
            chats: true,
          },
        },
      },
    });
  }
}
