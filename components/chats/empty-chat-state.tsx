"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import SuggestionCards from "./suggestion-cards";
import { motion } from "framer-motion";

interface EmptyChatStateProps {
  onSuggestionClick: (promptText: string) => void;
}

export default function EmptyChatState({ onSuggestionClick }: EmptyChatStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-10 md:py-16 space-y-6 md:space-y-8 select-none"
    >
      {/* Centered AI Emblem */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-violet-400/20">
        <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
      </div>

      {/* Typography */}
      <div className="space-y-2 max-w-lg">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-850 dark:text-white tracking-tight">
          How can I help you today?
        </h2>
        <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
          I'm your Intellex AI assistant. Ask questions about your uploaded documents, previous conversations, or use my general knowledge to help solve problems.
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="w-full pt-4">
        <SuggestionCards onCardClick={onSuggestionClick} />
      </div>
    </motion.div>
  );
}
