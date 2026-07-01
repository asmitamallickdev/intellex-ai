export interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Completed" | "Processing" | "Embedding" | "Failed";
  progress?: number;
  userId: string;
  skillId?: string | null;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeFolder {
  id: string;
  name: string;
  description: string;
  userId: string;
  accentColor?: string;
  badgeText?: string;
  badgeType?: "priority" | "internal" | "restricted" | "public";
  items: KnowledgeItem[];
  createdAt: Date;
  updatedAt: Date;
}
