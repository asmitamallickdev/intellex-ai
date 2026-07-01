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
      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Description
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="Describe what this knowledge workspace will be used for..."
          maxLength={maxLength}
          rows={3}
          className="w-full p-3 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all resize-none pb-7"
        />
        <span className="absolute bottom-2 right-3 text-[9px] font-semibold text-gray-400 dark:text-gray-600">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
