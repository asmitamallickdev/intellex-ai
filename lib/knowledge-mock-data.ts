export interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: "Completed" | "Processing" | "Embedding" | "Failed";
  progress?: number;
}

export interface SkillRepository {
  id: string;
  name: string;
  description: string;
  badgeText?: string;
  badgeType?: "priority" | "internal" | "restricted" | "public";
  docsCount: number;
  chatsCount: number;
  progressPercent: number;
  iconName: string;
  accentColor: string;
  documents: KnowledgeDocument[];
}

export const mockRepositories: SkillRepository[] = [
  {
    id: "repo-1",
    name: "Electrical Engineering",
    description: "Schematics, PLC logs, and hardware specifications for global facilities.",
    badgeText: "HIGH PRIORITY",
    badgeType: "priority",
    docsCount: 42,
    chatsCount: 18,
    progressPercent: 90,
    iconName: "Zap",
    accentColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    documents: [
      {
        id: "doc-1-1",
        name: "EE_Schematic_v4.2.pdf",
        type: "pdf",
        size: "8.4 MB",
        uploadedAt: "2 hours ago",
        status: "Completed",
      },
      {
        id: "doc-1-2",
        name: "PLC_Logs_2026.csv",
        type: "csv",
        size: "1.2 MB",
        uploadedAt: "Yesterday",
        status: "Completed",
      },
      {
        id: "doc-1-3",
        name: "Hardware_Specs_Global.docx",
        type: "docx",
        size: "4.5 MB",
        uploadedAt: "3 days ago",
        status: "Completed",
      },
      {
        id: "doc-1-4",
        name: "Facilities_Overview_Draft.pptx",
        type: "pptx",
        size: "12.0 MB",
        uploadedAt: "Just now",
        status: "Processing",
        progress: 65,
      },
    ],
  },
  {
    id: "repo-2",
    name: "Project Alpha",
    description: "Confidential product roadmap, R&D notes, and competitive analysis.",
    badgeText: "INTERNAL",
    badgeType: "internal",
    docsCount: 15,
    chatsCount: 892,
    progressPercent: 78,
    iconName: "Rocket",
    accentColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    documents: [
      {
        id: "doc-2-1",
        name: "Alpha_Product_Roadmap_2026.pdf",
        type: "pdf",
        size: "3.1 MB",
        uploadedAt: "Yesterday",
        status: "Completed",
      },
      {
        id: "doc-2-2",
        name: "RD_Notes_Phase3.docx",
        type: "docx",
        size: "2.8 MB",
        uploadedAt: "5 hours ago",
        status: "Completed",
      },
      {
        id: "doc-2-3",
        name: "Competitor_Analysis_Q2.xlsx",
        type: "xlsx",
        size: "4.2 MB",
        uploadedAt: "Last week",
        status: "Completed",
      },
    ],
  },
  {
    id: "repo-3",
    name: "Finance & Accounting",
    description: "Quarterly balance sheets, fiscal audits, and global tax compliance reports.",
    badgeText: "RESTRICTED",
    badgeType: "restricted",
    docsCount: 24,
    chatsCount: 115,
    progressPercent: 95,
    iconName: "Scale",
    accentColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    documents: [
      {
        id: "doc-3-1",
        name: "Q4_Balance_Sheet_Final.pdf",
        type: "pdf",
        size: "6.8 MB",
        uploadedAt: "2 days ago",
        status: "Completed",
      },
      {
        id: "doc-3-2",
        name: "Fiscal_Audits_2025.xlsx",
        type: "xlsx",
        size: "14.5 MB",
        uploadedAt: "2 weeks ago",
        status: "Completed",
      },
      {
        id: "doc-3-3",
        name: "Tax_Compliance_Europe.docx",
        type: "docx",
        size: "1.9 MB",
        uploadedAt: "3 weeks ago",
        status: "Completed",
      },
    ],
  },
  {
    id: "repo-4",
    name: "Customer Support KB",
    description: "Troubleshooting logs, product manuals, and automated reply templates.",
    badgeText: "PUBLIC",
    badgeType: "public",
    docsCount: 68,
    chatsCount: 1240,
    progressPercent: 88,
    iconName: "HeartHandshake",
    accentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    documents: [
      {
        id: "doc-4-1",
        name: "Troubleshooting_Faq_v2.md",
        type: "md",
        size: "245 KB",
        uploadedAt: "Yesterday",
        status: "Completed",
      },
      {
        id: "doc-4-2",
        name: "Customer_Reply_Templates.txt",
        type: "txt",
        size: "112 KB",
        uploadedAt: "Last month",
        status: "Completed",
      },
      {
        id: "doc-4-3",
        name: "Product_Manual_ModelS.pdf",
        type: "pdf",
        size: "18.4 MB",
        uploadedAt: "3 days ago",
        status: "Completed",
      },
    ],
  },
];
