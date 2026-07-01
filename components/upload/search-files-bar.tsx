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
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search uploaded files by name..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 focus:border-orange-500/80 focus:bg-white dark:focus:bg-gray-900/60 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200"
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
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-500/30 font-extrabold shadow-sm"
                  : "bg-white dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800"
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
