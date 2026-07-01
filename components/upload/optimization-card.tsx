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
    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/10 text-amber-600 dark:text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Optimization Tips
        </h3>
      </div>

      {/* Checklist Grid */}
      <ul className="space-y-2.5">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start space-x-2 text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-normal">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-50 dark:bg-orange-600/10 border border-orange-100 dark:border-orange-500/10 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
