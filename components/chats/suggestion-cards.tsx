"use client";

import React from "react";
import * as Icons from "lucide-react";
import { mockSuggestedPrompts, SuggestedPrompt } from "@/lib/chats-mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SuggestionCardsProps {
  onCardClick: (promptText: string) => void;
}

interface SuggestionCardItemProps {
  prompt: SuggestedPrompt;
  onClick: () => void;
  index: number;
}

function SuggestionCard({ prompt, onClick, index }: SuggestionCardItemProps) {
  const Icon = (Icons[prompt.iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-200 text-left cursor-pointer group shadow-sm hover:shadow-[0_8px_25px_rgba(139,92,246,0.03)] select-none"
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-all duration-300 mb-3 flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      {/* Description Text */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150">
          {prompt.title}
        </h4>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium leading-relaxed">
          {prompt.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function SuggestionCards({ onCardClick }: SuggestionCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {mockSuggestedPrompts.map((prompt, idx) => (
        <SuggestionCard
          key={prompt.id}
          prompt={prompt}
          onClick={() => onCardClick(prompt.title)}
          index={idx}
        />
      ))}
    </div>
  );
}
