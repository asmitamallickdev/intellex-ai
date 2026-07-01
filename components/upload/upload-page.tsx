"use client";

import React, { useState, useMemo, useEffect } from "react";
import UploadHeader from "./upload-header";
import UploadDropzone from "./upload-dropzone";
import StorageCard from "./storage-card";
import OptimizationCard from "./optimization-card";
import AIIllustrationCard from "./ai-illustration-card";
import UploadedFilesTable from "./uploaded-files-table";
import SearchFilesBar from "./search-files-bar";
import { UploadedFile } from "@/lib/upload-mock-data";
import { toast } from "sonner";
import { Plus, FolderPlus, Cloud } from "lucide-react";
import { 
  uploadFileAction, 
  deleteFileAction, 
  getAllFilesAction 
} from "@/src/actions/upload.actions";
import { 
  createSkillAction, 
  getAllSkillsAction 
} from "@/src/actions/skill.actions";
import { 
  triggerIngestionAction 
} from "@/src/actions/ingestion.actions";

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All Files" | "Completed" | "Processing" | "Embedding" | "Images" | "Documents" | "Recently Uploaded"
  >("All Files");
  const [activeSkillId, setActiveSkillId] = useState<string>("");

  // Helper mapper to structure database models into UI representation
  const mapDbFileToMockFile = (dbFile: any): UploadedFile => {
    const sizeInMB = dbFile.size / (1024 * 1024);
    const sizeStr = sizeInMB > 1 
      ? `${sizeInMB.toFixed(1)} MB` 
      : `${(dbFile.size / 1024).toFixed(0)} KB`;
      
    let status: "Completed" | "Processing" | "Embedding" | "Failed" = "Completed";
    if (dbFile.status === "UPLOADING") status = "Processing";
    else if (dbFile.status === "PROCESSING") status = "Processing";
    else if (dbFile.status === "EMBEDDING") status = "Embedding";
    else if (dbFile.status === "FAILED") status = "Failed";

    const ext = dbFile.extension || "bin";
    let category: "Documents" | "Images" | "Data" = "Documents";
    if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
      category = "Images";
    } else if (["csv", "json", "xlsx", "xls"].includes(ext)) {
      category = "Data";
    }

    return {
      id: dbFile.id,
      filename: dbFile.originalName,
      type: ext,
      size: sizeStr,
      uploadedAt: new Date(dbFile.uploadedAt).toLocaleDateString(),
      uploadedAtMs: new Date(dbFile.uploadedAt).getTime(),
      status,
      progress: dbFile.status === "READY" ? 100 : 50,
      category,
      owner: "Alex Chen",
    };
  };

  // Load active skill and uploaded file lists on mount
  useEffect(() => {
    async function loadSkillsAndFiles() {
      try {
        const skillsRes = await getAllSkillsAction();
        let skillId = "";
        if (skillsRes.success && skillsRes.data && skillsRes.data.length > 0) {
          skillId = skillsRes.data[0].id;
          setActiveSkillId(skillId);
        } else {
          // Create default workspace if none exist to bind uploads
          const defaultSkill = await createSkillAction({
            name: "Default Workspace",
            description: "General workspace for files and chats.",
            category: "General",
            icon: "Brain",
            color: "violet",
          });
          if (defaultSkill.success && defaultSkill.data) {
            skillId = defaultSkill.data.id;
            setActiveSkillId(skillId);
          }
        }

        const filesRes = await getAllFilesAction();
        if (filesRes.success && filesRes.data) {
          const mapped = filesRes.data.map(mapDbFileToMockFile);
          setFiles(mapped);
        }
      } catch (err) {
        console.error("Error loading uploads assets:", err);
      }
    }
    loadSkillsAndFiles();
  }, []);

  // Handles raw base64 buffer conversion and triggers ingestion pipelines
  const handleFileUpload = async (fileList: FileList | File[]) => {
    if (!activeSkillId) {
      toast.error("No active skill workspace found. Creating default...");
      return;
    }

    const filesArr = Array.from(fileList);
    for (const file of filesArr) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 100MB size limit.`);
        continue;
      }

      toast.info(`Uploading "${file.name}" to Cloudflare R2...`);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Data = (event.target?.result as string).split(",")[1];
          
          const res = await uploadFileAction(
            activeSkillId,
            file.name,
            file.type || "application/octet-stream",
            file.size,
            base64Data
          );

          if (res.success && res.data) {
            const mapped = mapDbFileToMockFile(res.data);
            setFiles((prev) => [mapped, ...prev]);
            toast.success(`Successfully uploaded "${file.name}". Starting ingestion...`);

            // Synchronously run text extraction, parsing, and paragraph chunking
            const ingestRes = await triggerIngestionAction(res.data.id);
            if (ingestRes.success) {
              toast.success(`Successfully ingested and indexed "${file.name}"!`);
              setFiles((prev) =>
                prev.map((f) => (f.id === res.data!.id ? { ...f, status: "Completed", progress: 100 } : f))
              );
            } else {
              toast.error(`Ingestion failed: ${ingestRes.error}`);
              setFiles((prev) =>
                prev.map((f) => (f.id === res.data!.id ? { ...f, status: "Failed" } : f))
              );
            }
          } else {
            toast.error(res.error || `Upload failed for file: ${file.name}`);
          }
        } catch (err: any) {
          toast.error(`Error uploading "${file.name}": ${err.message}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggers R2 S3 Object deletion and DB rows cleanups
  const handleDeleteFile = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    try {
      await deleteFileAction(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.error(`Removed "${target.filename}" from knowledge base.`);
    } catch (err) {
      toast.error("Failed to delete file.");
    }
  };

  const handleDownloadFile = (filename: string) => {
    toast.success(`Downloaded "${filename}"`);
  };

  const handlePreviewFile = (filename: string) => {
    toast.info(`Opening preview for "${filename}"`);
  };

  // Filter & Search Logic
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Search query match
      const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter category/status match
      switch (activeFilter) {
        case "Completed":
          return file.status === "Completed";
        case "Processing":
          return file.status === "Processing";
        case "Embedding":
          return file.status === "Embedding";
        case "Images":
          return file.category === "Images";
        case "Documents":
          return file.category === "Documents";
        case "Recently Uploaded":
          return Date.now() - file.uploadedAtMs < 24 * 60 * 60 * 1000;
        case "All Files":
        default:
          return true;
      }
    });
  }, [files, searchQuery, activeFilter]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <UploadHeader />

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">
        {/* Left Column (70% on lg) */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          {/* Upload Dropzone Drop Area */}
          <UploadDropzone onFilesSelected={handleFileUpload} />

          {/* Search files control bar */}
          <SearchFilesBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Files List Table */}
          <UploadedFilesTable
            files={filteredFiles}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
            onPreview={handlePreviewFile}
          />
        </div>

        {/* Right Column (30% on lg) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Storage capacity card */}
          <StorageCard />

          {/* Tips card */}
          <OptimizationCard />

          {/* AI Graphic illustration card */}
          <AIIllustrationCard />
        </div>
      </div>

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 select-none">
        {/* Cloud Import (Disabled) */}
        <button
          className="flex items-center justify-center gap-1.5 h-8 px-3 text-[10px] font-bold rounded-full bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-555 opacity-55 cursor-not-allowed shadow-lg"
          disabled
        >
          <Cloud className="w-3.5 h-3.5" />
          Cloud Import
        </button>

        {/* Create Folder button */}
        <button
          onClick={() => {
            toast.success("Folder creation successfully initialized");
          }}
          className="flex items-center justify-center gap-1.5 h-8 px-3 text-[10px] font-bold rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-855 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-955 dark:hover:text-white transition-all shadow-lg cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-550" />
          New Folder
        </button>

        {/* Upload More Trigger */}
        <button
          onClick={() => {
            const fileInput = document.getElementById("hidden-file-input");
            fileInput?.click();
          }}
          className="flex items-center justify-center gap-1.5 h-8 px-3.5 text-[10px] font-bold rounded-full bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/25 shadow-lg cursor-pointer transition-all hover:scale-103"
        >
          <Plus className="w-3.5 h-3.5" />
          Upload More
        </button>
      </div>
    </div>
  );
}
