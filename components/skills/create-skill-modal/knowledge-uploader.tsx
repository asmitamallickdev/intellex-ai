"use client";

import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePlaceholder {
  name: string;
  size: string;
  type: string;
}

interface KnowledgeUploaderProps {
  onFileAdd: (file: File) => void;
  onError: (errMsg: string) => void;
}

export default function KnowledgeUploader({
  onFileAdd,
  onError,
}: KnowledgeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > 50) {
        onError(`File "${file.name}" exceeds the 50MB limit.`);
        return;
      }

      let sizeStr = "";
      if (file.size > 1024 * 1024) {
        sizeStr = `${sizeInMB.toFixed(1)} MB`;
      } else {
        sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "";

      onFileAdd(file);
    });
  };

  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
          Initial Knowledge (Optional)
        </label>
        <p className="text-[9px] text-zinc-450 dark:text-zinc-500 font-semibold tracking-wide uppercase">
          Upload documents now or skip this step and add them later
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={cn(
          "flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-955/20 backdrop-blur-xs cursor-pointer select-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10",
          isDragging && "border-violet-500 bg-violet-500/5 shadow-[0_0_15px_rgba(139,92,246,0.05)]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.csv,.json,.md,image/*"
        />

        <div className={cn(
          "flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 mb-2 border border-zinc-200 dark:border-zinc-850",
          isDragging && "bg-violet-500 text-white border-violet-400"
        )}>
          <Upload className="w-4 h-4" />
        </div>

        <div className="text-center space-y-0.5">
          <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-300">
            Drag & Drop Files
          </span>
          <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-semibold block">
            or <span className="text-violet-650 dark:text-violet-400 underline decoration-2 underline-offset-1">Click to Browse</span>
          </span>
          <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-semibold block pt-1.5 uppercase tracking-wide">
            PDF, DOCX, PPTX, XLSX, TXT, CSV, MD, Images (Max 50MB)
          </span>
        </div>
      </div>
    </div>
  );
}
