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
        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
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
          "w-full h-9 px-3 text-xs bg-white dark:bg-zinc-900 border hover:border-zinc-300 dark:hover:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 text-zinc-800 dark:text-zinc-200",
          error
            ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            : "border-zinc-200 dark:border-zinc-900 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/30"
        )}
      />
    </div>
  );
}
