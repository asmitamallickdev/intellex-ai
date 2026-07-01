"use client";

import React, { useState } from "react";
import { ChevronDown, Sliders, ToggleLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedSettingsData {
  embeddingStrategy: "Default" | "High Accuracy" | "Fast";
  chunkSize: "Small" | "Medium" | "Large";
  memoryExtraction: boolean;
  autoSummaries: boolean;
  enableOcr: boolean;
}

interface AdvancedSettingsProps {
  data: AdvancedSettingsData;
  onChange: (data: AdvancedSettingsData) => void;
}

export default function AdvancedSettings({
  data,
  onChange,
}: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateField = <K extends keyof AdvancedSettingsData>(
    field: K,
    value: AdvancedSettingsData[K]
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const ToggleSwitch = ({
    checked,
    onToggle,
  }: {
    checked: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-violet-600" : "bg-zinc-200 dark:bg-zinc-800"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-xl overflow-hidden">
      {/* Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2">
          <Sliders className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span>Advanced Model Configuration</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-450 dark:text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-200 dark:border-zinc-900 bg-zinc-100/20 dark:bg-zinc-955/20"
          >
            <div className="p-4 space-y-4 text-xs font-medium">
              {/* Segmented 1: Embedding Strategy */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider block">
                  Embedding Strategy
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-lg max-w-sm">
                  {(["Default", "High Accuracy", "Fast"] as const).map((strategy) => (
                    <button
                      key={strategy}
                      type="button"
                      onClick={() => updateField("embeddingStrategy", strategy)}
                      className={cn(
                        "h-7 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all",
                        data.embeddingStrategy === strategy
                          ? "bg-white dark:bg-zinc-950 text-violet-650 dark:text-violet-400 border border-zinc-200 dark:border-zinc-800 shadow"
                          : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                      )}
                    >
                      {strategy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Segmented 2: Chunk Size */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider block">
                  Chunk Size Strategy
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-lg max-w-sm">
                  {(["Small", "Medium", "Large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateField("chunkSize", size)}
                      className={cn(
                        "h-7 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all",
                        data.chunkSize === size
                          ? "bg-white dark:bg-zinc-950 text-violet-650 dark:text-violet-400 border border-zinc-200 dark:border-zinc-800 shadow"
                          : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles list */}
              <div className="space-y-3 pt-3.5 border-t border-zinc-200 dark:border-zinc-900/60 max-w-md">
                {/* 1. Memory Extraction */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold">Memory Extraction</span>
                    <p className="text-[10px] text-zinc-500 font-medium">Extract long-term cognitive insights from documents</p>
                  </div>
                  <ToggleSwitch
                    checked={data.memoryExtraction}
                    onToggle={() => updateField("memoryExtraction", !data.memoryExtraction)}
                  />
                </div>

                {/* 2. Auto Summaries */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold">Automatic Summaries</span>
                    <p className="text-[10px] text-zinc-500 font-medium">Generate initial abstract summaries for index nodes</p>
                  </div>
                  <ToggleSwitch
                    checked={data.autoSummaries}
                    onToggle={() => updateField("autoSummaries", !data.autoSummaries)}
                  />
                </div>

                {/* 3. Enable OCR */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold">Enable OCR</span>
                    <p className="text-[10px] text-zinc-500 font-medium">Scan text elements inside image attachments</p>
                  </div>
                  <ToggleSwitch
                    checked={data.enableOcr}
                    onToggle={() => updateField("enableOcr", !data.enableOcr)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export type { AdvancedSettingsData };
