"use client";

import React, { useState } from "react";
import { SkillRepository } from "@/lib/knowledge-mock-data";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import StatusBadge from "../upload/status-badge";

interface RepositoryRowProps {
  repository: SkillRepository;
  onDeleteDocument: (repoId: string, docId: string) => void;
}

export default function RepositoryRow({ repository, onDeleteDocument }: RepositoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = (Icons[repository.iconName as keyof typeof Icons] || Icons.Folder) as React.ComponentType<{ className?: string }>;

  const getBadgeStyles = (type?: string) => {
    switch (type) {
      case "priority":
        return "bg-violet-50 dark:bg-violet-500/10 text-violet-650 dark:text-violet-400 border-violet-200 dark:border-violet-500/20";
      case "internal":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/50";
      case "restricted":
        return "bg-rose-50 dark:bg-rose-500/10 text-rose-650 dark:text-rose-450 border-rose-200 dark:border-rose-500/20";
      case "public":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-805";
    }
  };

  const getDocIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t === "pdf") return <Icons.FileText className="w-3.5 h-3.5 text-rose-500" />;
    if (["xlsx", "xls", "csv"].includes(t)) return <Icons.FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
    if (["docx", "doc"].includes(t)) return <Icons.FileText className="w-3.5 h-3.5 text-blue-500" />;
    if (["json", "js", "ts", "md"].includes(t)) return <Icons.FileCode className="w-3.5 h-3.5 text-violet-500" />;
    return <Icons.FileArchive className="w-3.5 h-3.5 text-zinc-400" />;
  };

  const handleDownload = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Downloaded "${name}"`);
  };

  const handlePreview = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Opening preview for "${name}"`);
  };

  const handleDelete = (docId: string, docName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteDocument(repository.id, docId);
    toast.error(`Removed "${docName}" from index`);
  };

  const radius = 14;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (repository.progressPercent / 100) * circumference;

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 shadow-xs">
      {/* Clickable Header row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer select-none gap-4"
      >
        {/* Info Column */}
        <div className="flex items-start space-x-3.5 min-w-0 flex-1">
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 border",
            repository.accentColor
          )}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-zinc-850 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                {repository.name}
              </h4>
              {repository.badgeText && (
                <span className={cn(
                  "text-[9px] font-extrabold px-2 py-0.5 rounded border tracking-wider uppercase",
                  getBadgeStyles(repository.badgeType)
                )}>
                  {repository.badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
              {repository.description}
            </p>
          </div>
        </div>

        {/* Stats Columns */}
        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 flex-shrink-0 border-t border-zinc-100 dark:border-transparent pt-3 sm:pt-0">
          {/* Docs Stat */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {repository.docsCount}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">
              Docs
            </span>
          </div>

          {/* Chats Stat */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {repository.chatsCount}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">
              Chats
            </span>
          </div>

          {/* Progress circle */}
          <div className="relative flex items-center justify-center w-11 h-11 flex-shrink-0 select-none">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-zinc-150 dark:stroke-zinc-800"
                strokeWidth={stroke}
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-violet-500 dark:stroke-violet-400"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-zinc-800 dark:text-zinc-200">
              {repository.progressPercent}%
            </span>
          </div>

          {/* Expand Chevron */}
          <div className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            {isExpanded ? (
              <Icons.ChevronUp className="w-4 h-4" />
            ) : (
              <Icons.ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded sub-document area */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="border-t border-zinc-200 dark:border-zinc-900/60 bg-zinc-50/30 dark:bg-zinc-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">
                <span>Repository Contents ({repository.documents.length} files)</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-900 text-[9px] font-bold text-zinc-500 uppercase tracking-wider h-7">
                      <th className="pb-1.5 font-bold pl-1.5">Document Name</th>
                      <th className="pb-1.5 font-bold hidden md:table-cell">Size</th>
                      <th className="pb-1.5 font-bold hidden sm:table-cell">Added</th>
                      <th className="pb-1.5 font-bold">Status</th>
                      <th className="pb-1.5 font-bold text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40">
                    {repository.documents.map((doc) => {
                      const isProcessing = doc.status === "Processing" || doc.status === "Embedding";
                      return (
                        <tr key={doc.id} className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-900/10 transition-colors h-9">
                          {/* File Icon & Name */}
                          <td className="py-2 pl-1.5">
                            <div className="flex items-center space-x-2">
                              {getDocIcon(doc.type)}
                              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                {doc.name}
                              </span>
                            </div>
                          </td>

                          {/* Size */}
                          <td className="py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden md:table-cell">
                            {doc.size}
                          </td>

                          {/* Uploaded At */}
                          <td className="py-2 text-xs font-medium text-zinc-500 dark:text-zinc-455 hidden sm:table-cell">
                            {doc.uploadedAt}
                          </td>

                          {/* Pipeline Status */}
                          <td className="py-2">
                            <div className="flex flex-col space-y-1">
                              <StatusBadge status={doc.status} />
                              {isProcessing && typeof doc.progress === "number" && (
                                <div className="flex items-center space-x-1.5 w-24">
                                  <div className="h-1 flex-1 bg-zinc-200 dark:bg-zinc-850 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-violet-605 dark:bg-violet-500" 
                                      style={{ width: `${doc.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-[8px] font-bold text-zinc-500">
                                    {doc.progress}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-2 text-right pr-2">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={(e) => handlePreview(doc.name, e)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-805 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                                title="Preview content"
                              >
                                <Icons.Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownload(doc.name, e)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-805 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                                title="Download document"
                              >
                                <Icons.Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDelete(doc.id, doc.name, e)}
                                className="p-1 rounded-lg text-red-500 hover:text-red-750 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete document"
                              >
                                <Icons.Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {repository.documents.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs text-zinc-400">No documents found inside this repository.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
