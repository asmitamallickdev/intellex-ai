"use client";

import React, { useState, useEffect } from "react";
import { getFilesBySkillAction } from "@/src/actions/upload.actions";
import ModelInfoCard from "./model-info-card";
import { Database, FileText, ExternalLink, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KnowledgeFile } from "@prisma/client";

interface KnowledgeContextPanelProps {
  skillId: string;
}

const fileTypeIcons: Record<string, string> = {
  pdf: "text-red-500",
  doc: "text-blue-500",
  docx: "text-blue-500",
  xls: "text-emerald-500",
  xlsx: "text-emerald-500",
  ppt: "text-orange-500",
  pptx: "text-orange-500",
  txt: "text-gray-600 dark:text-gray-500 dark:text-gray-400",
  csv: "text-emerald-500",
  json: "text-violet-500",
  md: "text-sky-500",
};

export default function KnowledgeContextPanel({
  skillId,
}: KnowledgeContextPanelProps) {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFiles() {
      setLoading(true);
      try {
        const res = await getFilesBySkillAction(skillId);
        if (cancelled) return;
        if (res.success && res.data) {
          setFiles(res.data);
        }
      } catch (err) {
        console.error("Failed to load knowledge files:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFiles();
    return () => { cancelled = true; };
  }, [skillId]);

  function getExtension(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return ext;
  }

  function getFileTypeColor(ext: string): string {
    return fileTypeIcons[ext] || "text-gray-500 dark:text-gray-400";
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-900/60 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-900/80 flex items-center justify-between bg-white/40 dark:bg-gray-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Knowledge Files
          </h3>
        </div>
        {files.length > 0 && (
          <span className="flex items-center space-x-1 text-[9px] font-bold text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-500/20">
            <FileText className="w-2.5 h-2.5" />
            <span>{files.length}</span>
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-orange-500 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-1 max-w-[200px]">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-500 dark:text-gray-400">
                No files uploaded
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                Upload documents to this skill to see them here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {files.map((file) => {
              const ext = getExtension(file.filename);
              return (
                <a
                  key={file.id}
                  href={file.storageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700 transition-all group cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <FileText className={cn("w-4 h-4", getFileTypeColor(ext))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {file.originalName}
                    </p>
                    <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
                      {ext || file.mimeType}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-500 dark:text-gray-400 flex-shrink-0 transition-colors" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Status Card (Bottom Fixed) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-900/80 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md">
        <ModelInfoCard />
      </div>
    </div>
  );
}
