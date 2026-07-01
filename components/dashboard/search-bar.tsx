"use client";

import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-[320px] group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search knowledge graph..."
        className="w-full h-8 pl-9 pr-12 text-xs bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700/80 focus:border-violet-500/80 focus:bg-zinc-900/80 focus:ring-1 focus:ring-violet-500/30 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all duration-200"
      />
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-0.5 h-5 select-none rounded border border-zinc-800 bg-zinc-950/80 px-1.5 font-mono text-[9px] font-medium text-zinc-500">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
