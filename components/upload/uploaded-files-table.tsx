"use client";

import React from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  FileImage, 
  FileArchive,
  Download, 
  Eye, 
  ArrowUpRight,
  User,
  Calendar,
  Trash2
} from "lucide-react";
import { UploadedFile } from "@/lib/upload-mock-data";
import StatusBadge from "./status-badge";
import FileActionMenu from "./file-action-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UploadedFilesTableProps {
  files: UploadedFile[];
  onDelete: (id: string) => void;
  onDownload: (filename: string) => void;
  onPreview: (filename: string) => void;
}

// Icon styles helper based on extension type
const getFileIconInfo = (ext: string) => {
  const e = ext.toLowerCase();
  if (["pdf"].includes(e)) {
    return {
      icon: FileText,
      colors: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15",
    };
  }
  if (["docx", "doc"].includes(e)) {
    return {
      icon: FileText,
      colors: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15",
    };
  }
  if (["xlsx", "xls", "csv"].includes(e)) {
    return {
      icon: FileSpreadsheet,
      colors: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15",
    };
  }
  if (["json", "js", "ts", "md"].includes(e)) {
    return {
      icon: FileCode,
      colors: "bg-violet-500/10 text-violet-650 dark:text-violet-400 border border-violet-500/15",
    };
  }
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(e)) {
    return {
      icon: FileImage,
      colors: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/15",
    };
  }
  return {
    icon: FileArchive,
    colors: "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50",
  };
};

export default function UploadedFilesTable({
  files,
  onDelete,
  onDownload,
  onPreview,
}: UploadedFilesTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm p-5 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Recently Uploaded
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium">
            Manage your index and RAG document library
          </p>
        </div>
        <button
          onClick={() => onPreview("All History")}
          className="flex items-center text-xs font-semibold text-violet-650 dark:text-violet-400 hover:text-violet-755 dark:hover:text-violet-300 transition-colors group/view cursor-pointer"
        >
          View All History
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-900/80 text-[10px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider h-8">
              <th className="pb-2 font-bold pl-1">Filename</th>
              <th className="pb-2 font-bold hidden sm:table-cell">Size</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 font-bold text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40">
            {files.map((file, idx) => {
              const { icon: Icon, colors: iconColors } = getFileIconInfo(file.type);
              const isUploading = file.status === "Processing" || file.status === "Embedding";

              return (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors duration-200"
                >
                  {/* Filename with type icon & meta details */}
                  <td className="py-3 pl-1 min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105",
                        iconColors
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 truncate block max-w-[250px] sm:max-w-sm md:max-w-md">
                          {file.filename}
                        </span>
                        
                        {/* Meta text row */}
                        <div className="flex items-center text-[10px] text-zinc-500 font-medium">
                          <span className="flex items-center">
                            <User className="w-2.5 h-2.5 mr-0.8 text-zinc-450 dark:text-zinc-650" />
                            {file.owner}
                          </span>
                          <span className="mx-1.5 text-zinc-350 dark:text-zinc-800">•</span>
                          <span className="flex items-center">
                            <Calendar className="w-2.5 h-2.5 mr-0.8 text-zinc-450 dark:text-zinc-650" />
                            {file.uploadedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* File Size */}
                  <td className="py-3 text-xs font-medium text-zinc-550 dark:text-zinc-400 hidden sm:table-cell">
                    {file.size}
                  </td>

                  {/* Pipeline Status & Progress bars */}
                  <td className="py-3 min-w-[120px]">
                    <div className="space-y-1.5 max-w-[160px]">
                      {/* Status Badge */}
                      <StatusBadge status={file.status} />

                      {/* Simulative upload / embed progress indicator */}
                      {isUploading && (
                        <div className="space-y-1">
                          <div className="relative h-1 w-full bg-zinc-100 dark:bg-zinc-955 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-900">
                            <motion.div
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                              className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full"
                            />
                          </div>
                          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider block">
                            {file.progress}% Completed
                          </span>
                        </div>
                      )}

                      {/* Completed indicator */}
                      {file.status === "Completed" && (
                        <div className="h-1 w-full bg-violet-600/30 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-violet-500" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions buttons */}
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Quick action: Preview */}
                      <button
                        onClick={() => onPreview(file.filename)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer hidden sm:inline-block"
                        title="Preview file content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick action: Download */}
                      <button
                        onClick={() => onDownload(file.filename)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer hidden sm:inline-block"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick action: Delete */}
                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Options drop popover menu */}
                      <FileActionMenu
                        filename={file.filename}
                        onPreview={() => onPreview(file.filename)}
                        onDownload={() => onDownload(file.filename)}
                        onDelete={() => onDelete(file.id)}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty search results fallback */}
        {files.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs text-zinc-650 dark:text-zinc-400 font-semibold">No files found matching search filters.</p>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-650 font-medium">Try checking search input text or changing filter tabs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
