"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AIIllustrationCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/40 p-5 flex flex-col items-center justify-center text-center space-y-4 select-none min-h-[220px]">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-orange-600/10 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-950/80 pointer-events-none" />

      {/* 3D Glowing SVG Knowledge Crystal */}
      <div className="relative w-36 h-28 flex items-center justify-center">
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="z-10"
        >
          <svg className="w-24 h-24 drop-shadow-[0_0_20px_rgba(234,88,12,0.25)]" viewBox="0 0 100 100">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="crystalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="crystalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="crystalGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c2410c" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Crystal Shards */}
            {/* Center Main Shard */}
            <polygon points="50,15 62,50 50,85 38,50" fill="url(#crystalGrad3)" stroke="#fdba74" strokeWidth="0.5" strokeOpacity="0.4" />
            
            {/* Left Shard */}
            <polygon points="38,50 50,85 28,60 26,40" fill="url(#crystalGrad1)" stroke="#fb923c" strokeWidth="0.5" strokeOpacity="0.3" />
            
            {/* Right Shard */}
            <polygon points="50,85 62,50 74,40 72,60" fill="url(#crystalGrad2)" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Top Cap Shards */}
            <polygon points="50,15 38,50 26,40" fill="url(#crystalGrad1)" stroke="#fb923c" strokeWidth="0.5" strokeOpacity="0.3" />
            <polygon points="50,15 62,50 74,40" fill="url(#crystalGrad2)" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
        </motion.div>

        {/* Pulse aura rings */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-20 h-20 rounded-full border border-orange-500/20"
        />
        <motion.div
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-28 h-28 rounded-full border border-amber-500/10"
        />
      </div>

      {/* Motivational Text */}
      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-wide leading-relaxed max-w-[200px] z-10">
        "Every uploaded document strengthens your AI's understanding of your organization."
      </p>
    </div>
  );
}
