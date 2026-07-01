"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, ShieldCheck, Sparkles, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
}

export default function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
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
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleContainerClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-955/20 backdrop-blur-xs cursor-pointer select-none transition-all duration-300 group",
        isDragging 
          ? "border-violet-500 bg-violet-500/5 shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
          : "hover:border-zinc-300 dark:hover:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="hidden-file-input"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.csv,.json,.md,image/*"
      />

      {/* Background Radial Glow */}
      <div className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04),transparent_60%)] pointer-events-none transition-opacity duration-300",
        isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )} />

      {/* Upload icon circle */}
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300",
        isDragging 
          ? "bg-violet-500 text-white scale-110 shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-450 dark:text-zinc-400 group-hover:bg-violet-650/10 dark:group-hover:bg-violet-600/10 group-hover:text-violet-600 dark:group-hover:text-violet-400 border border-zinc-200 dark:border-zinc-800 group-hover:border-violet-500/20"
      )}>
        <Upload className={cn("w-6 h-6", isDragging && "animate-bounce")} />
      </div>

      {/* Label and Subtexts */}
      <div className="text-center space-y-1.5 z-10 max-w-sm">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150">
          Drag & Drop files here or <span className="text-violet-650 dark:text-violet-400 underline decoration-2 underline-offset-2">click to browse</span>
        </h3>
        <p className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
          Supported: PDF, DOCX, PPTX, XLSX, TXT, CSV, MD, Images
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold italic">
          Maximum file size: 50 MB per file
        </p>
      </div>

      {/* Feature Badges list */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-900/60 w-full flex flex-wrap items-center justify-center gap-4 text-[10px] text-zinc-500 font-semibold tracking-wide uppercase z-10">
        <div className="flex items-center space-x-1 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>AI Ready</span>
        </div>
        <div className="flex items-center space-x-1 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
          <Languages className="w-3.5 h-3.5 text-sky-500" />
          <span>OCR Supported</span>
        </div>
        <div className="flex items-center space-x-1 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Auto Indexing</span>
        </div>
        <div className="flex items-center space-x-1 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Vector Embeddings</span>
        </div>
      </div>
    </motion.div>
  );
}
