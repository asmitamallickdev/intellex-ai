"use client";

import React from "react";
import { Sparkles, HelpCircle, Check } from "lucide-react";

export default function OptimizationCard() {
  const tips = [
    "Clear headings improve extraction quality.",
    "Limit files to specific topics for better retrieval.",
    "Markdown (.md) is highly recommended.",
    "Avoid duplicate files to optimize index storage.",
    "Keep large manuals separated by subject.",
  ];

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/10 text-amber-600 dark:text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Optimization Tips
        </h3>
      </div>

      {/* Checklist Grid */}
      <ul className="space-y-2.5">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start space-x-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-normal">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-50 dark:bg-violet-600/10 border border-violet-100 dark:border-violet-500/10 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
