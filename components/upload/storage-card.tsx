"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { motion } from "framer-motion";

export default function StorageCard() {
  const used = 14.2;
  const total = 50;
  const percentage = (used / total) * 100;

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm space-y-4">
      {/* Header Info */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/10 text-violet-600 dark:text-violet-400">
          <HardDrive className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Vector Storage
        </h3>
      </div>

      {/* Progress & Label */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">
          <span>Used Space</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-bold">{used} GB / {total} GB</span>
        </div>

        {/* Progress bar container */}
        <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-900/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full"
          />
        </div>
      </div>

      {/* Detailed Platform Description */}
      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-150 dark:border-zinc-900/50">
        Your knowledge base is optimized for semantic search and Retrieval-Augmented Generation (RAG). Vector indices are updated in real-time as you upload.
      </p>
    </div>
  );
}
