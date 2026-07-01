"use client";

import React from "react";
import { ShieldCheck, ArrowUpRight, Cpu, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthCard() {
  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/20 backdrop-blur-sm space-y-5">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/10 text-orange-600 dark:text-orange-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Knowledge Health
        </h3>
      </div>

      {/* Main score */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
            95%
          </span>
          <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wide">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>+2.4% this week</span>
          </span>
        </div>

        {/* Progress bar container */}
        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden border border-gray-200 dark:border-gray-900/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "95%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Detailed accuracy / latency metrics */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100 dark:border-gray-900/60">
        {/* Metric 1 */}
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            4.8/5
          </span>
          <span className="text-[9px] text-gray-600 dark:text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block">
            Search Accuracy
          </span>
        </div>

        {/* Metric 2 */}
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            1.2s
          </span>
          <span className="text-[9px] text-gray-600 dark:text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block">
            Retrieval Speed
          </span>
        </div>
      </div>

      {/* Extended platform details */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-900/60 text-[10px] text-gray-500 dark:text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400" />
            Total Embeddings:
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">24.5k chunks</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 dark:text-gray-500 dark:text-gray-400" />
            Index Status:
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Fully Optimized
          </span>
        </div>
      </div>
    </div>
  );
}
