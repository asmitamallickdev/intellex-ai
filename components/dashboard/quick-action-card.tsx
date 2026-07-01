"use client";

import React from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  iconName: string;
  onClick?: () => void;
  className?: string;
}

export default function QuickActionCard({
  title,
  subtitle,
  iconName,
  onClick,
  className,
}: QuickActionCardProps) {
  const Icon = (Icons[iconName as keyof typeof Icons] || Icons.Plus) as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-800/80 transition-colors duration-250 cursor-pointer group shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.04)]",
        className
      )}
    >
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/20 dark:group-hover:bg-violet-500/25 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-all duration-300 flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>

      {/* Text Info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 truncate">
          {title}
        </h3>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-450 font-medium truncate mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Decorative arrow showing interactability */}
      <Icons.ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200" />
    </motion.div>
  );
}
