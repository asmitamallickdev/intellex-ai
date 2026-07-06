"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SkillRepository } from "@/lib/knowledge-mock-data";
import RepositoryRow from "./repository-row";
import HealthCard from "./health-card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  FolderPlus, 
  CloudDownload, 
  Upload, 
  Search, 
  Library, 
  FileText, 
  HardDrive, 
  Sparkles, 
  RotateCw
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  getAllSkillsAction, 
  createSkillAction 
} from "@/src/actions/skill.actions";
import { 
  getAllFilesAction, 
  deleteFileAction 
} from "@/src/actions/upload.actions";

export default function KnowledgePage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<SkillRepository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load Skills and KnowledgeFiles from DB
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [skillsRes, filesRes] = await Promise.all([
        getAllSkillsAction(),
        getAllFilesAction()
      ]);

      if (skillsRes.success && skillsRes.data) {
        const dbSkills = skillsRes.data;
        const dbFiles = filesRes.success && filesRes.data ? filesRes.data : [];

        // Group files by skillId
        const mappedRepos: SkillRepository[] = dbSkills.map((skill) => {
          const filesForSkill = dbFiles.filter((f) => f.skillId === skill.id);
          
          return {
            id: skill.id,
            name: skill.name,
            description: skill.description || "",
            badgeText: skill.category || "General",
            badgeType: "public",
            docsCount: filesForSkill.length,
            chatsCount: 0,
            progressPercent: 100,
            iconName: skill.icon || "Folder",
            accentColor: "text-gray-600 dark:text-gray-500 bg-gray-500/10 border-gray-500/20",
            documents: filesForSkill.map((file) => {
              const sizeInMB = file.size / (1024 * 1024);
              const sizeStr = sizeInMB > 1 
                ? `${sizeInMB.toFixed(1)} MB` 
                : `${(file.size / 1024).toFixed(0)} KB`;

              let status: "Completed" | "Processing" | "Embedding" | "Queued" | "Failed" = "Completed";
              if (file.status === "UPLOADING" || file.status === "PROCESSING") status = "Processing";
              else if (file.status === "EMBEDDING") status = "Embedding";
              else if (file.status === "FAILED") status = "Failed";

              return {
                id: file.id,
                name: file.originalName,
                type: file.extension || "bin",
                size: sizeStr,
                uploadedAt: new Date(file.uploadedAt).toLocaleDateString(),
                status,
                progress: file.status === "READY" ? 100 : 50,
              };
            }),
          };
        });

        setRepositories(mappedRepos);
      }
    } catch (err) {
      console.error("Failed to load knowledge base:", err);
      toast.error("Failed to sync knowledge catalog.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler to delete document from specific repository
  const handleDeleteDocument = async (repoId: string, docId: string) => {
    try {
      const res = await deleteFileAction(docId);
      if (res.success) {
        toast.success("Document deleted successfully.");
        loadData();
      } else {
        toast.error(res.error || "Failed to delete document.");
      }
    } catch (err) {
      toast.error("Error deleting document.");
    }
  };

  // Handler to create a new folder repository
  const handleCreateFolder = async () => {
    const name = window.prompt("Enter repository name:");
    if (!name || !name.trim()) return;

    const description = window.prompt("Enter description:") || "General workspace folder.";
    
    try {
      const res = await createSkillAction({
        name: name.trim(),
        description: description.trim(),
        category: "General",
        icon: "Folder",
        color: "zinc",
      });

      if (res.success) {
        toast.success(`Successfully created repository "${name}"`);
        loadData();
      } else {
        toast.error(res.error || "Failed to create folder repository.");
      }
    } catch (err) {
      toast.error("Error creating folder repository.");
    }
  };

  const handleImport = () => {
    toast.success("Import wizard successfully initialized.");
  };

  const handleUploadFilesClick = () => {
    router.push("/upload");
  };

  // Compute stats
  const totalSkills = repositories.length;
  const totalFiles = useMemo(() => {
    return repositories.reduce((sum, repo) => sum + repo.docsCount, 0);
  }, [repositories]);

  // Filter repositories based on query
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      const matchesName = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDesc = repo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDocs = repo.documents.some((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesName || matchesDesc || matchesDocs;
    });
  }, [repositories, searchQuery]);

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Header section with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-900/60 pb-6">
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            Knowledge Base
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed font-medium"
          >
            Manage and organize documents across all Skills.
          </motion.p>
        </div>

        {/* Top Header Buttons */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Create Folder button */}
          <button
            onClick={handleCreateFolder}
            className="flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            Create Folder
          </button>

          {/* Import button */}
          <button
            onClick={handleImport}
            className="flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <CloudDownload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            Import
          </button>

          {/* Upload Files primary button */}
          <button
            onClick={handleUploadFilesClick}
            className="flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white border border-orange-500/25 shadow-[0_0_15px_rgba(234,88,12,0.1)] transition-all cursor-pointer hover:scale-101"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Stats cards section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Stat 1: Total Skills */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between text-gray-400 dark:text-gray-600">
            <Library className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Total</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{totalSkills}</span>
            <p className="text-[10px] text-gray-600 dark:text-gray-500 font-semibold block">Active Skills</p>
          </div>
        </div>

        {/* Stat 2: Total Files */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between text-gray-400 dark:text-gray-600">
            <FileText className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Documents</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{totalFiles}</span>
            <p className="text-[10px] text-gray-600 dark:text-gray-500 font-semibold block">Total Files</p>
          </div>
        </div>

        {/* Stat 3: Capacity */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between text-gray-400 dark:text-gray-600">
            <HardDrive className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Capacity</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">0.05</span>
            <p className="text-[10px] text-gray-600 dark:text-gray-500 font-semibold block">GB Used</p>
          </div>
        </div>

        {/* Stat 4: Efficiency */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between text-gray-400 dark:text-gray-600">
            <Sparkles className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Efficiency</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">100%</span>
            <p className="text-[10px] text-gray-600 dark:text-gray-500 font-semibold block">Embedded Docs</p>
          </div>
        </div>

        {/* Stat 5: Pending */}
        <div className="p-4 rounded-xl bg-orange-600 border border-orange-500 shadow-md flex flex-col justify-between h-24 text-white col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-orange-250">
            <RotateCw className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Pending</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-extrabold">
              {repositories.reduce((sum, repo) => sum + repo.documents.filter(d => d.status !== "Completed").length, 0)}
            </span>
            <p className="text-[10px] text-orange-100 font-semibold block">In Processing</p>
          </div>
        </div>
      </div>

      {/* Main Content: 2 Column Grid */}
      {isLoading ? (
        <div className="flex h-48 w-full items-center justify-center p-8 text-zinc-500 font-medium">
          Loading knowledge base...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">
          {/* Left Column (Skill Repositories) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                Skill Repositories
              </h3>

              {/* Filter/Search Bar */}
              <div className="relative w-full sm:w-64 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files or repos..."
                  className="w-full h-8.5 pl-9 pr-4 text-xs bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 focus:border-orange-500/80 focus:bg-white dark:focus:bg-gray-900/60 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all duration-200 shadow-2xs"
                />
              </div>
            </div>

            {/* Repository lists */}
            <div className="space-y-4">
              {filteredRepositories.map((repo) => (
                <RepositoryRow
                  key={repo.id}
                  repository={repo}
                  onDeleteDocument={handleDeleteDocument}
                />
              ))}

              {filteredRepositories.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-900 rounded-xl bg-white dark:bg-gray-900/10">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">No repositories or files found matching query.</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">Try resetting search string or creating a new folder.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Health Dashboard) */}
          <div className="lg:col-span-3 space-y-6">
            <HealthCard />
          </div>
        </div>
      )}
    </div>
  );
}
