"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { motion } from "framer-motion";

export default function StorageCard() {
  const used = 14.2;
  const total = 50;
  const percentage = (used / total) * 100;

  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm space-y-4">
      {/* Header Info */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/10 text-orange-600 dark:text-orange-400">
          <HardDrive className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Vector Storage
        </h3>
      </div>

      {/* Progress & Label */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          <span>Used Space</span>
          <span className="text-gray-700 dark:text-gray-300 font-bold">{used} GB / {total} GB</span>
        </div>

        {/* Progress bar container */}
        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden border border-gray-200 dark:border-gray-900/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Detailed Platform Description */}
      <p className="text-[10px] text-gray-500 dark:text-gray-500 dark:text-gray-400 leading-relaxed font-medium bg-gray-50/50 dark:bg-gray-900/30 p-2.5 rounded-lg border border-gray-100 dark:border-gray-900/50">
        Your knowledge base is optimized for semantic search and Retrieval-Augmented Generation (RAG). Vector indices are updated in real-time as you upload.
      </p>
    </div>
  );
}
