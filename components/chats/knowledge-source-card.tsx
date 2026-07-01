"use client";

import React, { useState } from "react";
import { CitationSource } from "@/lib/chats-mock-data";
import { FileText, Brain, MessageSquare, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeSourceCardProps {
  citation: CitationSource;
}

export default function KnowledgeSourceCard({ citation }: KnowledgeSourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (citation.type) {
      case "document":
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case "memory":
        return <Brain className="w-3.5 h-3.5 text-violet-400" />;
      case "conversation":
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/20";
    if (score >= 80) return "text-violet-650 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-250 dark:border-violet-500/20";
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-250 dark:border-amber-500/20";
  };

  return (
    <div className="group border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 hover:shadow-md hover:shadow-violet-950/5">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start justify-between p-3 cursor-pointer select-none"
      >
        <div className="flex items-start space-x-2.5 min-w-0">
          <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex-shrink-0 group-hover:bg-zinc-200/50 dark:group-hover:bg-zinc-800/80 transition-colors">
            {getIcon()}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors">
              {citation.title}
            </h4>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {citation.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
          {/* Confidence Badge */}
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wide uppercase",
            getConfidenceColor(citation.confidence)
          )}>
            {citation.confidence}% match
          </span>
          <div className="text-zinc-505 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>

      {/* Snippet (Expanded) */}
      <AnimatePresence initial={false}>
        {isExpanded && citation.snippet && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-3 pb-3 pt-0 border-t border-zinc-200 dark:border-zinc-900/60 bg-zinc-50/20 dark:bg-zinc-950/20">
              <div className="mt-2 p-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-light italic">
                "{citation.snippet}"
              </div>
              <div className="flex items-center justify-end space-x-1.5 mt-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wide">
                  Verified Reference
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
