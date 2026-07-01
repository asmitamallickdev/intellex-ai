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
      className="flex flex-col items-start p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 hover:bg-gray-50 dark:hover:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-800 transition-colors duration-200 text-left cursor-pointer group shadow-sm hover:shadow-[0_8px_25px_rgba(234,88,12,0.03)] select-none"
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-all duration-300 mb-3 flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      {/* Description Text */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-950 dark:group-hover:text-white transition-colors duration-150">
          {prompt.title}
        </h4>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
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
