export interface UploadedFile {
  id: string;
  filename: string;
  type: string; // e.g. 'pdf' | 'docx' | 'xlsx' | 'json' | 'png' | 'md'
  size: string;
  uploadedAt: string;
  uploadedAtMs: number;
  status: "Completed" | "Processing" | "Embedding" | "Queued" | "Failed";
  progress: number; // 0 to 100
  category: "Documents" | "Images" | "Data";
  owner: string;
}

export const mockUploadedFiles: UploadedFile[] = [
  {
    id: "file-1",
    filename: "Q3_Revenue_Forecast.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "2 hours ago",
    uploadedAtMs: Date.now() - 2 * 60 * 60 * 1000,
    status: "Completed",
    progress: 100,
    category: "Documents",
    owner: "User",
  },
  {
    id: "file-2",
    filename: "Compliance_Guidelines_2024.docx",
    type: "docx",
    size: "4.1 MB",
    uploadedAt: "5 hours ago",
    uploadedAtMs: Date.now() - 5 * 60 * 60 * 1000,
    status: "Embedding",
    progress: 45,
    category: "Documents",
    owner: "User",
  },
  {
    id: "file-3",
    filename: "Raw_Customer_Feedback.json",
    type: "json",
    size: "820 KB",
    uploadedAt: "Yesterday, 3:15 PM",
    uploadedAtMs: Date.now() - 27 * 60 * 60 * 1000,
    status: "Processing",
    progress: 75,
    category: "Data",
    owner: "User",
  },
  {
    id: "file-4",
    filename: "Electrical_Cable_Specifications.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadedAt: "Yesterday, 10:30 AM",
    uploadedAtMs: Date.now() - 32 * 60 * 60 * 1000,
    status: "Completed",
    progress: 100,
    category: "Documents",
    owner: "User",
  },
  {
    id: "file-5",
    filename: "Project_Alpha_Architecture.docx",
    type: "docx",
    size: "3.2 MB",
    uploadedAt: "2 days ago",
    uploadedAtMs: Date.now() - 48 * 60 * 60 * 1000,
    status: "Completed",
    progress: 100,
    category: "Documents",
    owner: "User",
  },
  {
    id: "file-6",
    filename: "Company_SOP_Template.xlsx",
    type: "xlsx",
    size: "95 KB",
    uploadedAt: "3 days ago",
    uploadedAtMs: Date.now() - 72 * 60 * 60 * 1000,
    status: "Queued",
    progress: 0,
    category: "Data",
    owner: "User",
  },
  {
    id: "file-7",
    filename: "Platform_Database_Schema.png",
    type: "png",
    size: "1.4 MB",
    uploadedAt: "4 days ago",
    uploadedAtMs: Date.now() - 96 * 60 * 60 * 1000,
    status: "Completed",
    progress: 100,
    category: "Images",
    owner: "User",
  },
];
