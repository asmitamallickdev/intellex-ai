"use client";

import React from "react";
import { CitationSource } from "@/lib/chats-mock-data";
import KnowledgeSourceCard from "./knowledge-source-card";
import ModelInfoCard from "./model-info-card";
import { Sparkles, Database, BookOpen, AlertCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface KnowledgeContextPanelProps {
  contextLoaded: boolean;
  citations: CitationSource[];
  onBrowseClick?: () => void;
}

export default function KnowledgeContextPanel({
  contextLoaded,
  citations,
  onBrowseClick,
}: KnowledgeContextPanelProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-900/60 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-900/80 flex items-center justify-between bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-violet-605 dark:text-violet-400" />
          <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Knowledge Context
          </h3>
        </div>
        {contextLoaded && citations.length > 0 && (
          <span className="flex items-center space-x-1 text-[9px] font-bold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-200 dark:border-violet-500/20">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{citations.length} Sources</span>
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!contextLoaded || citations.length === 0 ? (
          /* Empty Context State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
              <Database className="w-5 h-5 text-zinc-400 dark:text-zinc-605 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="space-y-1.5 max-w-[220px]">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                No Context Loaded
              </h4>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Reference manuals, memory nodes, and semantic context will populate here once the AI processes your query.
              </p>
            </div>
            {onBrowseClick && (
              <button
                onClick={onBrowseClick}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Skills</span>
              </button>
            )}
          </div>
        ) : (
          /* Staged citations view */
          <div className="space-y-3.5">
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider pl-1">
              <FileText className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-505" />
              <span>Reference Sources</span>
            </div>
            
            <div className="space-y-2.5">
              {citations.map((cite, index) => (
                <motion.div
                  key={cite.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <KnowledgeSourceCard citation={cite} />
                </motion.div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-3 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900/60 rounded-xl space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    The assistant generated insights by querying vector chunks matched against your active workspace libraries.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Status Card (Bottom Fixed) */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-900/80 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md">
        <ModelInfoCard />
      </div>
    </div>
  );
}
