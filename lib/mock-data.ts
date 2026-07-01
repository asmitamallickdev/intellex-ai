export interface NavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
}

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  trendType: "positive" | "stable" | "neutral";
  iconName: string;
}

export interface ActivityItem {
  id: string;
  type: "document" | "chat" | "skill";
  title: string;
  subtitle: string;
  timestamp: string;
  status: "Indexed" | "Completed" | "Ready" | "Processing";
  size?: string;
  meta?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export const sidebarNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", iconName: "LayoutDashboard" },
  { label: "Skills", href: "/skills", iconName: "Wrench", badge: "New" },
  { label: "Knowledge Base", href: "/knowledge", iconName: "Database" },
  { label: "Chats", href: "/chats", iconName: "MessageSquare" },
  { label: "Memory", href: "#", iconName: "Brain" },
  { label: "Search", href: "#", iconName: "Search" },
];

export const sidebarBottomItems: NavItem[] = [
  { label: "Settings", href: "#", iconName: "Settings" },
  { label: "Support", href: "#", iconName: "HelpCircle" },
  { label: "What's New", href: "#", iconName: "Sparkles" },
];

export const statsData: StatItem[] = [
  {
    id: "skills",
    label: "Total Skills",
    value: "8",
    trend: "+2 this week",
    trendType: "positive",
    iconName: "Wrench",
  },
  {
    id: "documents",
    label: "Uploaded Documents",
    value: "124",
    trend: "+12 today",
    trendType: "positive",
    iconName: "FileText",
  },
  {
    id: "chats",
    label: "Total Chats",
    value: "452",
    trend: "+45 active",
    trendType: "positive",
    iconName: "MessageSquare",
  },
  {
    id: "memories",
    label: "Stored Memories",
    value: "89",
    trend: "Stable",
    trendType: "stable",
    iconName: "Brain",
  },
  {
    id: "questions",
    label: "AI Questions Asked",
    value: "1,240",
    trend: "High volume",
    trendType: "neutral",
    iconName: "Sparkles",
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "act-1",
    type: "document",
    title: "Alpha_Technical_Specs.pdf",
    subtitle: "Document indexed for semantic search and retrieval.",
    timestamp: "Yesterday, 4:20 PM",
    status: "Indexed",
    size: "2.4 MB",
  },
  {
    id: "act-2",
    type: "chat",
    title: "Project Alpha Architecture Discussion",
    subtitle: "Automated summary generated from discussion session.",
    timestamp: "5 hours ago",
    status: "Completed",
    meta: "AI assisted",
  },
  {
    id: "act-3",
    type: "document",
    title: "Q3_Quarterly_Report.pptx",
    subtitle: "Extracted 15 key insights regarding global market performance.",
    timestamp: "Yesterday, 10:15 AM",
    status: "Indexed",
    size: "5.1 MB",
  },
  {
    id: "act-4",
    type: "skill",
    title: "React Skills Training Module",
    subtitle: "Custom tool compiled successfully for agent execution.",
    timestamp: "2 days ago",
    status: "Ready",
  },
];

export const knowledgeGraphData = {
  health: 78,
  description: "78% of memory nodes are optimized for fast retrieval. No cleanup required.",
  nodes: [
    { id: "1", label: "Specs", x: 40, y: 50, size: 8, color: "var(--color-primary)" },
    { id: "2", label: "Architecture", x: 120, y: 30, size: 10, color: "var(--color-primary)" },
    { id: "3", label: "Q3 Report", x: 90, y: 95, size: 7, color: "var(--color-primary)" },
    { id: "4", label: "React Skill", x: 180, y: 70, size: 9, color: "var(--color-primary)" },
    { id: "5", label: "User Prompt", x: 220, y: 110, size: 6, color: "var(--color-primary)" },
    { id: "6", label: "Semantic DB", x: 150, y: 120, size: 12, color: "var(--color-primary)" },
    { id: "7", label: "Graph Core", x: 130, y: 75, size: 14, color: "var(--color-primary)" },
  ] as GraphNode[],
  links: [
    { source: "7", target: "1" },
    { source: "7", target: "2" },
    { source: "7", target: "3" },
    { source: "7", target: "4" },
    { source: "7", target: "6" },
    { source: "2", target: "1" },
    { source: "4", target: "5" },
    { source: "6", target: "5" },
    { source: "6", target: "3" },
  ] as GraphLink[],
};
