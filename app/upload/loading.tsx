"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-violet-500/10 blur-xl animate-pulse" />
        <Loader2 className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin relative z-10" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-550 font-bold uppercase tracking-widest">
          Loading Document Library...
        </p>
      </div>
    </div>
  );
}
