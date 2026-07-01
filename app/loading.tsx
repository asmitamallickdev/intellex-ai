"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 gap-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Pulsing glow background */}
        <div className="absolute w-16 h-16 rounded-full bg-orange-500/20 blur-xl animate-pulse" />
        
        {/* Spinning loading icon */}
        <Loader2 className="w-10 h-10 text-orange-600 dark:text-orange-400 animate-spin relative z-10" />
      </div>
      
      <div className="space-y-1 text-center relative z-10">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
          Intellex AI
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-300 font-semibold uppercase tracking-wider animate-pulse">
          Synchronizing secure workspace...
        </p>
      </div>
    </div>
  );
}
