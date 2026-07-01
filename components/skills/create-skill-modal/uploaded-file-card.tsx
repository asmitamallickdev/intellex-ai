"use client";

import React from "react";
import { X, FileText, FileSpreadsheet, FileCode, FileImage, FileArchive } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePlaceholder {
  name: string;
  size: string;
  type: string;
}

interface UploadedFileCardProps {
  file: FilePlaceholder;
  onRemove: () => void;
}

// Icon helper based on extension type
const getFileIconStyles = (ext: string) => {
  const e = ext.toLowerCase();
  if (["pdf"].includes(e)) {
    return { icon: FileText, colors: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15" };
  }
  if (["docx", "doc"].includes(e)) {
    return { icon: FileText, colors: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15" };
  }
  if (["xlsx", "xls", "csv"].includes(e)) {
    return { icon: FileSpreadsheet, colors: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15" };
  }
  if (["json", "js", "ts", "md"].includes(e)) {
    return { icon: FileCode, colors: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/15" };
  }
  if (["png", "jpg", "jpeg", "webp"].includes(e)) {
    return { icon: FileImage, colors: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/15" };
  }
  return { icon: FileArchive, colors: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50" };
};

export default function UploadedFileCard({
  file,
  onRemove,
}: UploadedFileCardProps) {
  const { icon: Icon, colors: iconColors } = getFileIconStyles(file.type);

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-900 transition-all hover:border-gray-300 dark:hover:border-gray-800 select-none">
      {/* File Info */}
      <div className="flex items-center space-x-2.5 min-w-0 mr-4">
        <div className={cn(
          "flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 border",
          iconColors
        )}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-300 truncate block max-w-[200px] sm:max-w-xs">
            {file.name}
          </span>
          <span className="text-[9px] font-bold text-gray-500 block uppercase">
            {file.size}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="p-1 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all cursor-pointer flex-shrink-0"
        title="Remove file"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
