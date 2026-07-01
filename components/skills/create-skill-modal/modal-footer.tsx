"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ModalFooterProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  isLoading: boolean;
}

export default function ModalFooter({
  onCancel,
  isSubmitDisabled,
  isLoading,
}: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-900/60 mt-6">
      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="h-9 px-4 text-xs font-semibold text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        Cancel
      </Button>

      {/* Create Button */}
      <Button
        type="submit"
        disabled={isSubmitDisabled || isLoading}
        className="h-9 px-4 text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-lg cursor-pointer border border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-colors flex items-center justify-center min-w-[100px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Skill"
        )}
      </Button>
    </div>
  );
}
