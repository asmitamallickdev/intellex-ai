"use client";

import React from "react";
import { Cpu, Activity, Database, Check } from "lucide-react";

export default function ModelInfoCard() {
  return (
    <div className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/60 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
            <Cpu className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 dark:text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Active LLM Engine
            </h5>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
              Intellex-Core-5.5
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-extrabold text-emerald-650 dark:text-emerald-400 uppercase tracking-wide">
            Online
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-900/80 my-2" />

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-500 dark:text-gray-400">
          <Database className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="truncate">Memory Graph:</span>
          <span className="text-gray-700 dark:text-gray-300 font-semibold ml-auto">Active</span>
        </div>
        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-500 dark:text-gray-400">
          <Activity className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="truncate">Latency:</span>
          <span className="text-gray-700 dark:text-gray-300 font-semibold ml-auto">180ms</span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-900 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[9px] text-gray-500 dark:text-gray-500 dark:text-gray-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          Zero-Data Retention Policy
        </span>
        <span className="text-[8px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-800">
          SECURE
        </span>
      </div>
    </div>
  );
}
