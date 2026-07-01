"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all flex items-center justify-center cursor-pointer"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className="h-4.5 w-4.5 text-amber-400" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-violet-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
