"use client";

import React from "react";
import * as Icons from "lucide-react";
import { Skill } from "@/lib/skills-mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PinnedSkillsProps {
  skills: Skill[];
  onPinToggle: (id: string) => void;
}

const colorMap: Record<string, { bg: string; text: string; border: string; borderHover: string; glow: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-650 dark:text-amber-400", border: "border-amber-500/10", borderHover: "group-hover:border-amber-500/30", glow: "rgba(245,158,11,0.02)" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/10", borderHover: "group-hover:border-blue-500/30", glow: "rgba(59,130,246,0.02)" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/10", borderHover: "group-hover:border-violet-500/30", glow: "rgba(139,92,246,0.02)" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/10", borderHover: "group-hover:border-sky-500/30", glow: "rgba(14,165,233,0.02)" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/10", borderHover: "group-hover:border-rose-500/30", glow: "rgba(244,63,94,0.02)" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/10", borderHover: "group-hover:border-emerald-500/30", glow: "rgba(16,185,129,0.02)" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-650 dark:text-indigo-400", border: "border-indigo-500/10", borderHover: "group-hover:border-indigo-500/30", glow: "rgba(99,102,241,0.02)" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/10", borderHover: "group-hover:border-cyan-500/30", glow: "rgba(6,182,212,0.02)" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/10", borderHover: "group-hover:border-orange-500/30", glow: "rgba(249,115,22,0.02)" },
  red: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/10", borderHover: "group-hover:border-red-500/30", glow: "rgba(239,68,68,0.02)" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/10", borderHover: "group-hover:border-pink-500/30", glow: "rgba(236,72,153,0.02)" },
  zinc: { bg: "bg-gray-500/10", text: "text-gray-600 dark:text-gray-400", border: "border-gray-500/10", borderHover: "group-hover:border-gray-500/30", glow: "rgba(113,113,122,0.02)" },
};

export default function PinnedSkills({ skills, onPinToggle }: PinnedSkillsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icons.Pin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 rotate-45" />
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Pinned Workspaces
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill, idx) => {
          const Icon = (Icons[skill.icon as keyof typeof Icons] || Icons.Wrench) as React.ComponentType<{ className?: string }>;
          const colorStyles = colorMap[skill.color] || colorMap.zinc;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="group relative flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900/20"
              style={{
                boxShadow: `inset 0 0 12px ${colorStyles.glow}`,
              }}
            >
              {/* Left side: Icon & Title info */}
              <div className="flex items-center space-x-3 min-w-0 mr-4">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-300",
                  colorStyles.bg,
                  colorStyles.border
                )}>
                  <Icon className={cn("w-4.5 h-4.5", colorStyles.text)} />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-950 group-hover:dark:text-white transition-colors duration-150 truncate">
                    {skill.name}
                  </h4>
                  <div className="flex items-center text-[9px] text-gray-500 font-semibold tracking-wide uppercase">
                    <span>{skill.category}</span>
                    <span className="mx-1">•</span>
                    <span>{skill.documents} Docs</span>
                  </div>
                </div>
              </div>

              {/* Right side: Actions (Unpin button) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPinToggle(skill.id);
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-900/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800 cursor-pointer"
                title="Unpin from dashboard"
              >
                <Icons.PinOff className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
