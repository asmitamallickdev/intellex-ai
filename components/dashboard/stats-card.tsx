"use client";

import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendType?: "positive" | "stable" | "neutral";
  iconName: string;
}

export default function StatsCard({
  label,
  value,
  trend,
  trendType = "neutral",
  iconName,
}: StatsCardProps) {
  const Icon = (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm flex flex-col justify-between min-h-[110px] space-y-3 group hover:border-zinc-350 dark:hover:border-zinc-800 transition-colors"
    >
      {/* Card Header: Icon & Badge */}
      <div className="flex items-start justify-between">
        {/* Icon container */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/20 dark:group-hover:bg-violet-500/15 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300 flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>

        {/* Status / Trend Badge */}
        <span
          className={cn(
            "text-[9px] font-bold px-1.8 py-0.5 rounded-full border tracking-wide uppercase",
            trendType === "positive"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
              : trendType === "stable"
              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/10"
              : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-650 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/40"
          )}
        >
          {trend}
        </span>
      </div>

      {/* Card Body: Label & Value */}
      <div className="space-y-0.5">
        <span className="text-[10px] font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight block">
          {value}
        </span>
      </div>
    </motion.div>
  );
}
