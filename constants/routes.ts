/**
 * Centralized application route constants.
 */
export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/",
  SKILLS: "/skills",
  KNOWLEDGE_BASE: "/knowledge",
  CHATS: "/chats",
  UPLOAD: "/upload",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const API_ROUTES = {
  AUTH: "/api/auth",
  SKILLS: "/api/skills",
  CHATS: "/api/chats",
  KNOWLEDGE: "/api/knowledge",
  UPLOAD: "/api/upload",
  SEARCH: "/api/search",
  MEMORY: "/api/memory",
} as const;
