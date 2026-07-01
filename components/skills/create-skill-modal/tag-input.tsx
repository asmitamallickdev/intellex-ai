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
      <label className="text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider block">
        Tags
      </label>

      {/* Input container with stacked tag pills */}
      <div className="flex flex-wrap gap-2 p-2 min-h-[44px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 rounded-xl focus-within:border-violet-500/80 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center space-x-1 pl-2.5 pr-1.5 py-0.8 text-[10px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-300 rounded-full border border-violet-200 dark:border-violet-500/20"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="p-0.5 rounded-full hover:bg-violet-100 dark:hover:bg-violet-500/20 text-violet-500 dark:text-violet-400 hover:text-violet-750 dark:hover:text-violet-200 transition-colors cursor-pointer"
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
          className="flex-1 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none min-w-[120px] h-6"
        />
      </div>

      {/* Suggested Quick-add tags */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">
        <span className="text-zinc-400 dark:text-zinc-600">Quick Add:</span>
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
                  ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-900 text-zinc-400 dark:text-zinc-650 opacity-50 cursor-not-allowed"
                  : "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              <Plus className="w-2 h-2 text-zinc-400 dark:text-zinc-505" />
              {sTag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
