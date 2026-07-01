"use client";

import React from "react";
import { Plus, BrainCircuit, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 lg:p-16 rounded-2xl border border-zinc-900 border-dashed bg-zinc-950/20 max-w-xl mx-auto my-6 space-y-6"
    >
      {/* Centered Graphic illustration */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-600">
        <SearchX className="w-8 h-8 text-zinc-500" />
        <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-violet-600/10 border border-violet-500/20 rounded-full flex items-center justify-center">
          <BrainCircuit className="w-2.5 h-2.5 text-violet-400 animate-pulse" />
        </div>
      </div>

      {/* Texts */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-200">
          No workspaces found
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed font-medium">
          Create your first knowledge workspace (Skill) to begin building your AI database and compiling domain-specific models.
        </p>
      </div>

      {/* Button */}
      <div>
        <Button
          onClick={onCreateClick}
          className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg h-8.5 px-4 text-xs font-semibold shadow-[0_0_12px_rgba(139,92,246,0.15)] border border-violet-500/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Skill
        </Button>
      </div>
    </motion.div>
  );
}
