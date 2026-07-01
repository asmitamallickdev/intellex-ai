"use client";

import React from "react";

interface DescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DescriptionInput({
  value,
  onChange,
}: DescriptionInputProps) {
  const maxLength = 300;

  return (
    <div className="space-y-1.5 relative">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        Description
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="Describe what this knowledge workspace will be used for..."
          maxLength={maxLength}
          rows={3}
          className="w-full p-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/30 rounded-lg text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition-all resize-none pb-7"
        />
        <span className="absolute bottom-2 right-3 text-[9px] font-semibold text-zinc-400 dark:text-zinc-600">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
