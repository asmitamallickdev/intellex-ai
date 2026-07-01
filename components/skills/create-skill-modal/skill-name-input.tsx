"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkillNameInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export default function SkillNameInput({
  value,
  onChange,
  error,
}: SkillNameInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Skill Name *
        </label>
        {error && (
          <span className="text-[10px] font-semibold text-red-500 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Electrical Engineering, Project Alpha, SAP Development..."
        className={cn(
          "w-full h-9 px-3 text-xs bg-white dark:bg-gray-900 border hover:border-gray-300 dark:hover:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all rounded-lg placeholder-gray-400 dark:placeholder-gray-600 text-gray-800 dark:text-gray-200",
          error
            ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            : "border-gray-200 dark:border-gray-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30"
        )}
      />
    </div>
  );
}
