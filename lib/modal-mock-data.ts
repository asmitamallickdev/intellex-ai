export const modalCategories = [
  "Engineering",
  "Software Development",
  "Artificial Intelligence",
  "Cloud Computing",
  "Mechanical",
  "Electrical",
  "Finance",
  "Healthcare",
  "Research",
  "Business",
  "Custom",
] as const;

export const modalIcons = [
  "Brain",
  "BookOpen",
  "Code",
  "Cpu",
  "Database",
  "FileText",
  "Briefcase",
  "Cloud",
  "Bolt",
  "Building",
  "FolderKanban",
  "Bot",
  "Shield",
  "Network",
  "Boxes",
  "Sparkles",
] as const;

export interface ColorOption {
  name: string;
  colorName: string; // Tailwind name (e.g. violet, blue)
  bgClass: string;
  glowClass: string;
}

export const modalColors: ColorOption[] = [
  { name: "Purple", colorName: "violet", bgClass: "bg-violet-500", glowClass: "rgba(139,92,246,0.2)" },
  { name: "Blue", colorName: "blue", bgClass: "bg-blue-500", glowClass: "rgba(59,130,246,0.2)" },
  { name: "Indigo", colorName: "indigo", bgClass: "bg-indigo-500", glowClass: "rgba(99,102,241,0.2)" },
  { name: "Green", colorName: "emerald", bgClass: "bg-emerald-500", glowClass: "rgba(16,185,129,0.2)" },
  { name: "Orange", colorName: "orange", bgClass: "bg-orange-500", glowClass: "rgba(249,115,22,0.2)" },
  { name: "Red", colorName: "red", bgClass: "bg-red-500", glowClass: "rgba(239,68,68,0.2)" },
  { name: "Slate", colorName: "zinc", bgClass: "bg-zinc-500", glowClass: "rgba(113,113,122,0.2)" },
  { name: "Teal", colorName: "teal", bgClass: "bg-teal-500", glowClass: "rgba(20,184,166,0.2)" },
];

export const modalSuggestedTags = [
  "Cable",
  "PLC",
  "React",
  "SAP",
  "Project Alpha",
  "Documentation",
  "AI",
];
