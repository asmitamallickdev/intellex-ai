"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SkillsHeaderProps {
  onCreateClick: () => void;
}

export default function SkillsHeader({ onCreateClick }: SkillsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-900/60 pb-6">
      {/* Title & Subtitle */}
      <div className="space-y-1.5 flex-1">
        <motion.h2 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          Skills
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium"
        >
          Organize your knowledge into dedicated AI workspaces. Each skill contains documents, conversations, memories, and AI insights.
        </motion.p>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="flex-shrink-0"
      >
        <Button
          onClick={onCreateClick}
          className="bg-orange-600 hover:bg-orange-500 text-white rounded-lg h-9 px-4 font-semibold shadow-[0_0_15px_rgba(234,88,12,0.15)] border border-orange-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Skill
        </Button>
      </motion.div>
    </div>
  );
}
