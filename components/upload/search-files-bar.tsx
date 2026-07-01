"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilesBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: "All Files" | "Completed" | "Processing" | "Embedding" | "Images" | "Documents" | "Recently Uploaded";
  onFilterChange: (val: "All Files" | "Completed" | "Processing" | "Embedding" | "Images" | "Documents" | "Recently Uploaded") => void;
}

export default function SearchFilesBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: SearchFilesBarProps) {
  const filterOptions = [
    "All Files",
    "Completed",
    "Processing",
    "Embedding",
    "Images",
    "Documents",
    "Recently Uploaded",
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search Input bar */}
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-505 group-focus-within:text-violet-555 dark:group-focus-within:text-violet-400 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search uploaded files by name..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 focus:border-violet-500/80 focus:bg-white dark:focus:bg-zinc-900/60 focus:ring-1 focus:ring-violet-500/30 rounded-lg text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Horizontal scrolling category filter badges */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none mask-image-horizontal">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onFilterChange(opt)}
              className={cn(
                "h-7 px-3 text-[10px] font-bold rounded-lg border tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "bg-violet-50 dark:bg-violet-500/10 text-violet-650 dark:text-violet-300 border-violet-200 dark:border-violet-500/30 font-extrabold shadow-sm"
                  : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
