import { Skill } from "@prisma/client";
export type { Skill };

export interface CreateSkillInput {
  name: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
}

export interface UpdateSkillInput {
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  isPinned?: boolean;
}

export interface SkillResponse<T = Skill> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface SkillListResponse<T = Skill> {
  success: boolean;
  data?: T[];
  message?: string;
  error?: string;
  statusCode: number;
}

export type SortOrder = "newest" | "oldest" | "updated" | "alphabetical";

export interface SkillFilterOptions {
  category?: string;
  pinned?: boolean;
  recentlyUpdated?: boolean;
  search?: string;
  sortBy?: SortOrder;
}
