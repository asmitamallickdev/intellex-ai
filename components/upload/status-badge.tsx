"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Completed" | "Processing" | "Embedding" | "Queued" | "Failed";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const stylesMap = {
    Completed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/15",
    Processing: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/15",
    Embedding: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/15",
    Queued: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/15",
    Failed: "bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 border-red-200 dark:border-red-500/15",
  };

  const dotStylesMap = {
    Completed: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
    Processing: "bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]",
    Embedding: "bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.5)]",
    Queued: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    Failed: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase",
        stylesMap[status] || stylesMap.Queued
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotStylesMap[status] || dotStylesMap.Queued)} />
      <span>{status}</span>
    </span>
  );
}
