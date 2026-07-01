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
      className="p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm flex flex-col justify-between min-h-[110px] space-y-3 group hover:border-gray-300 dark:hover:border-gray-800 transition-colors"
    >
      {/* Card Header: Icon & Badge */}
      <div className="flex items-start justify-between">
        {/* Icon container */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20 dark:group-hover:bg-orange-500/15 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300 flex-shrink-0">
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
              : "bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700/40"
          )}
        >
          {trend}
        </span>
      </div>

      {/* Card Body: Label & Value */}
      <div className="space-y-0.5">
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight block">
          {value}
        </span>
      </div>
    </motion.div>
  );
}
