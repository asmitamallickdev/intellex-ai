"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  onClose: () => void;
}

export default function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-900/60 mb-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
          Create New Skill
        </h3>
        <p className="text-xs text-zinc-550 dark:text-zinc-500 font-medium leading-relaxed max-w-lg">
          Create a dedicated AI knowledge workspace for a specific topic, project, department, or technology.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
