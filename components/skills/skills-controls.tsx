"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Grid, List, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterBy: "All" | "Recently Updated" | "Most Documents" | "Most Chats" | "Pinned";
  onFilterChange: (val: "All" | "Recently Updated" | "Most Documents" | "Most Chats" | "Pinned") => void;
  sortBy: "Name" | "Last Updated" | "Created Date";
  onSortChange: (val: "Name" | "Last Updated" | "Created Date") => void;
  layoutMode: "grid" | "list";
  onLayoutChange: (val: "grid" | "list") => void;
}

export default function SkillsControls({
  searchQuery,
  onSearchChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  layoutMode,
  onLayoutChange,
}: SkillsControlsProps) {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = ["All", "Recently Updated", "Most Documents", "Most Chats", "Pinned"] as const;
  const sortOptions = ["Name", "Last Updated", "Created Date"] as const;

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between py-1 z-20 relative">
      {/* Search Input bar */}
      <div className="relative flex-1 max-w-md group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-violet-555 dark:group-focus-within:text-violet-400 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 focus:border-violet-500/80 focus:bg-white dark:focus:bg-zinc-900/60 focus:ring-1 focus:ring-violet-500/30 rounded-lg text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Filters, Sorting & Layout Toggles */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Dropdown */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => {
              setFilterDropdownOpen(!filterDropdownOpen);
              setSortDropdownOpen(false);
            }}
            className={cn(
              "flex items-center justify-between gap-2 h-9 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer",
              filterDropdownOpen && "border-zinc-300 dark:border-zinc-700 bg-zinc-55 dark:bg-zinc-900/50 text-zinc-950 dark:text-white"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-450 dark:text-zinc-500" />
            <span>Filter: {filterBy}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-450 dark:text-zinc-500 transition-transform duration-200", filterDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {filterDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-48 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl z-30"
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                       onFilterChange(opt);
                      setFilterDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full h-8 px-2.5 rounded-md text-left text-xs text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-medium cursor-pointer",
                      filterBy === opt && "text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 font-semibold"
                    )}
                  >
                    <span>{opt}</span>
                    {filterBy === opt && <Check className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => {
              setSortDropdownOpen(!sortDropdownOpen);
              setFilterDropdownOpen(false);
            }}
            className={cn(
              "flex items-center justify-between gap-2 h-9 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer",
              sortDropdownOpen && "border-zinc-300 dark:border-zinc-700 bg-zinc-55 dark:bg-zinc-900/50 text-zinc-955 dark:text-white"
            )}
          >
            <span className="text-zinc-450 dark:text-zinc-500 font-medium">Sort By:</span>
            <span>{sortBy}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-450 dark:text-zinc-500 transition-transform duration-200", sortDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {sortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-44 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-1 shadow-xl z-30"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onSortChange(opt);
                      setSortDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full h-8 px-2.5 rounded-md text-left text-xs text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-medium cursor-pointer",
                      sortBy === opt && "text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 font-semibold"
                    )}
                  >
                    <span>{opt}</span>
                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-violet-550 dark:text-violet-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-900 hidden sm:block" />

        {/* Layout Toggle (Grid / List) */}
        <div className="flex items-center rounded-lg bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-0.5 select-none">
          <button
            onClick={() => onLayoutChange("grid")}
            className={cn(
              "flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer",
              layoutMode === "grid"
                ? "bg-zinc-100 dark:bg-zinc-900 text-violet-600 dark:text-violet-400 border border-zinc-200 dark:border-zinc-850 shadow-inner"
                : "text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
            aria-label="Grid layout"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={cn(
              "flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer",
              layoutMode === "list"
                ? "bg-zinc-100 dark:bg-zinc-900 text-violet-600 dark:text-violet-400 border border-zinc-200 dark:border-zinc-850 shadow-inner"
                : "text-zinc-450 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
            aria-label="List layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
