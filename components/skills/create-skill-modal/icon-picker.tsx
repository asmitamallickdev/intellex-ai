"use client";

import React from "react";
import * as Icons from "lucide-react";
import { modalIcons } from "@/lib/modal-mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface IconPickerProps {
  selectedIcon: string;
  onChange: (iconName: string) => void;
  accentColor: string; // Dynamic border glow
}

export default function IconPicker({
  selectedIcon,
  onChange,
  accentColor,
}: IconPickerProps) {
  // Border highlight class map based on color selection
  const accentBorderMap: Record<string, string> = {
    violet: "border-violet-500/80 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    blue: "border-blue-500/80 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    indigo: "border-indigo-500/80 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400",
    emerald: "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    orange: "border-orange-500/80 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    red: "border-red-500/80 bg-red-500/10 text-red-600 dark:text-red-400",
    zinc: "border-zinc-400 dark:border-zinc-500/80 bg-zinc-100 dark:bg-zinc-500/10 text-zinc-650 dark:text-zinc-400",
    teal: "border-teal-500/80 bg-teal-500/10 text-teal-600 dark:text-teal-400",
  };

  const accentCheckMap: Record<string, string> = {
    violet: "bg-violet-500 text-white",
    blue: "bg-blue-500 text-white",
    indigo: "bg-indigo-500 text-white",
    emerald: "bg-emerald-500 text-white",
    orange: "bg-orange-500 text-white",
    red: "bg-red-500 text-white",
    zinc: "bg-zinc-500 text-white",
    teal: "bg-teal-500 text-white",
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
        Workspace Icon
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900/60 p-2.5 rounded-xl">
        {modalIcons.map((iconName) => {
          const ItemIcon = (Icons[iconName as keyof typeof Icons] || Icons.Wrench) as React.ComponentType<{ className?: string }>;
          const isSelected = selectedIcon === iconName;
          
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={cn(
                "relative w-9 h-9 rounded-lg bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-zinc-450 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95",
                isSelected
                  ? accentBorderMap[accentColor] || accentBorderMap.violet
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              <ItemIcon className="w-4.5 h-4.5" />
              
              {/* Check indicator in the corner */}
              {isSelected && (
                <div className={cn(
                  "absolute -top-1.2 -right-1.2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] border border-white dark:border-zinc-950 font-bold",
                  accentCheckMap[accentColor] || accentCheckMap.violet
                )}>
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
