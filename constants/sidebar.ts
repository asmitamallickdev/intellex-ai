import { APP_ROUTES } from "./routes";

export interface SidebarNavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD, iconName: "LayoutDashboard" },
  { label: "Skills", href: APP_ROUTES.SKILLS, iconName: "Wrench", badge: "New" },
  { label: "Knowledge Base", href: APP_ROUTES.KNOWLEDGE_BASE, iconName: "Database" },
  { label: "Chats", href: APP_ROUTES.CHATS, iconName: "MessageSquare" },
  { label: "Memory", href: "#", iconName: "Brain" },
  { label: "Search", href: "#", iconName: "Search" },
];

export const SIDEBAR_BOTTOM_ITEMS: SidebarNavItem[] = [
  { label: "Settings", href: "#", iconName: "Settings" },
  { label: "Support", href: "#", iconName: "HelpCircle" },
  { label: "What's New", href: "#", iconName: "Sparkles" },
];
