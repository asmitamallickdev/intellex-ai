"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dotTransition = (delay: number) => ({
    y: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
      delay: delay,
    },
  });

  return (
    <div className="flex items-start space-x-3.5 max-w-xl mr-auto select-none">
      
      {/* AI Icon Avatar */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.2)] border border-violet-400/20 text-white flex-shrink-0 mt-0.5">
        <BrainCircuit className="w-4.5 h-4.5 animate-pulse" />
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900/60 shadow-sm min-h-[36px]">
          
          {/* Pulsing Dots */}
          <div className="flex space-x-1">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={dotTransition(0)}
              className="w-1.8 h-1.8 rounded-full bg-violet-400"
            />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={dotTransition(0.15)}
              className="w-1.8 h-1.8 rounded-full bg-violet-400"
            />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={dotTransition(0.3)}
              className="w-1.8 h-1.8 rounded-full bg-violet-400"
            />
          </div>

          <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">
            Intellex AI is thinking...
          </span>
        </div>
      </div>
      
    </div>
  );
}
