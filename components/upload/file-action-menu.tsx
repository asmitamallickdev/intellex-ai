"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileActionMenuProps {
  filename: string;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export default function FileActionMenu({
  filename,
  onPreview,
  onDownload,
  onDelete,
}: FileActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors cursor-pointer"
        aria-label="File options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-36 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-2xl z-30"
          >
            {/* Preview */}
            <button
              onClick={() => {
                onPreview();
                setOpen(false);
              }}
              className="flex items-center w-full h-7.5 px-2.5 rounded-md text-left text-[11px] text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer font-medium"
            >
              <Eye className="w-3.5 h-3.5 mr-2 text-zinc-450 dark:text-zinc-505" />
              Preview
            </button>

            {/* Download */}
            <button
              onClick={() => {
                onDownload();
                setOpen(false);
              }}
              className="flex items-center w-full h-7.5 px-2.5 rounded-md text-left text-[11px] text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5 mr-2 text-zinc-450 dark:text-zinc-505" />
              Download
            </button>

            <div className="border-t border-zinc-100 dark:border-zinc-900 my-1 mx-1" />

            {/* Delete */}
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex items-center w-full h-7.5 px-2.5 rounded-md text-left text-[11px] text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500 dark:text-red-500/80" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
