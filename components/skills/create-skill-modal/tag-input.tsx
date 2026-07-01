"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { modalSuggestedTags } from "@/lib/modal-mock-data";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tagText: string) => {
    const cleanTag = tagText.trim().replace(/,/g, "");
    if (cleanTag && !tags.includes(cleanTag)) {
      onChange([...tags, cleanTag]);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
        Tags
      </label>

      {/* Input container with stacked tag pills */}
      <div className="flex flex-wrap gap-2 p-2 min-h-[44px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 rounded-xl focus-within:border-orange-500/80 focus-within:ring-1 focus-within:ring-orange-500/30 transition-all">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center space-x-1 pl-2.5 pr-1.5 py-0.8 text-[10px] font-semibold bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 rounded-full border border-orange-200 dark:border-orange-500/20"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="p-0.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-200 transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type tag & hit Enter..." : "Add tag..."}
          className="flex-1 bg-transparent text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none min-w-[120px] h-6"
        />
      </div>

      {/* Suggested Quick-add tags */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
        <span className="text-gray-400 dark:text-gray-600">Quick Add:</span>
        {modalSuggestedTags.map((sTag) => {
          const isAdded = tags.includes(sTag);
          return (
            <button
              key={sTag}
              type="button"
              onClick={() => !isAdded && addTag(sTag)}
              disabled={isAdded}
              className={cn(
                "h-5 px-2 rounded border transition-colors flex items-center gap-0.5 cursor-pointer text-[9px] font-bold uppercase tracking-wider",
                isAdded
                  ? "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              )}
            >
              <Plus className="w-2 h-2 text-gray-400 dark:text-gray-500" />
              {sTag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
