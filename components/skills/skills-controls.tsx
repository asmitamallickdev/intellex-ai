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
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 focus:border-orange-500/80 focus:bg-white dark:focus:bg-gray-900/60 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 dark:placeholder-gray-500 focus:outline-none transition-all duration-200"
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
              "flex items-center justify-between gap-2 h-9 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer",
              filterDropdownOpen && "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-950 dark:text-white"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400" />
            <span>Filter: {filterBy}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 transition-transform duration-200", filterDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {filterDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 shadow-xl z-30"
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                       onFilterChange(opt);
                      setFilterDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full h-8 px-2.5 rounded-md text-left text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-medium cursor-pointer",
                      filterBy === opt && "text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10 font-semibold"
                    )}
                  >
                    <span>{opt}</span>
                    {filterBy === opt && <Check className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />}
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
              "flex items-center justify-between gap-2 h-9 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer",
              sortDropdownOpen && "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-950 dark:text-white"
            )}
          >
            <span className="text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 font-medium">Sort By:</span>
            <span>{sortBy}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 transition-transform duration-200", sortDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {sortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1.5 w-44 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 shadow-xl z-30"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onSortChange(opt);
                      setSortDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full h-8 px-2.5 rounded-md text-left text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-medium cursor-pointer",
                      sortBy === opt && "text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10 font-semibold"
                    )}
                  >
                    <span>{opt}</span>
                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-900 hidden sm:block" />

        {/* Layout Toggle (Grid / List) */}
        <div className="flex items-center rounded-lg bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 p-0.5 select-none">
          <button
            onClick={() => onLayoutChange("grid")}
            className={cn(
              "flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer",
              layoutMode === "grid"
                ? "bg-gray-100 dark:bg-gray-900 text-orange-600 dark:text-orange-400 border border-gray-200 dark:border-gray-800 shadow-inner"
                : "text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                ? "bg-gray-100 dark:bg-gray-900 text-orange-600 dark:text-orange-400 border border-gray-200 dark:border-gray-800 shadow-inner"
                : "text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
