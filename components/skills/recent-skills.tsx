"use client";

import React from "react";
import * as Icons from "lucide-react";
import { Skill } from "@/lib/skills-mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RecentSkillsProps {
  skills: Skill[];
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-650 dark:text-amber-400", border: "border-amber-500/15" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/15" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/15" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/15" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/15" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/15" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-650 dark:text-indigo-400", border: "border-indigo-500/15" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/15" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/15" },
  red: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/15" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/15" },
  zinc: { bg: "bg-zinc-500/10", text: "text-zinc-600 dark:text-zinc-400", border: "border-zinc-500/15" },
};

export default function RecentSkills({ skills }: RecentSkillsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icons.Clock className="w-3.5 h-3.5 text-zinc-500 animate-none" />
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Recently Accessed
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, idx) => {
          const Icon = (Icons[skill.icon as keyof typeof Icons] || Icons.Wrench) as React.ComponentType<{ className?: string }>;
          const colorStyles = colorMap[skill.color] || colorMap.zinc;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm group hover:bg-zinc-55 dark:hover:bg-zinc-900/20 transition-all duration-200"
            >
              {/* Left detail: icon, name, timestamp */}
              <div className="flex items-center space-x-3.5 min-w-0 mr-4">
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-all duration-300",
                  colorStyles.bg,
                  colorStyles.border
                )}>
                  <Icon className={cn("w-5 h-5", colorStyles.text)} />
                </div>
                
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 truncate">
                    {skill.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    Last opened: {skill.lastUpdated}
                  </p>
                </div>
              </div>

              {/* Right detail: continue button */}
              <button className="flex items-center justify-center h-7 px-3 text-[10px] font-bold rounded-lg bg-violet-50 dark:bg-violet-600/10 hover:bg-violet-100 dark:hover:bg-violet-600/20 text-violet-600 dark:text-violet-300 border border-violet-200/50 dark:border-violet-500/20 hover:border-violet-350 dark:hover:border-violet-500/30 transition-all duration-200 cursor-pointer flex-shrink-0">
                Continue
                <Icons.ArrowRight className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
