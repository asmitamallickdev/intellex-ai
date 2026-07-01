"use client";

import React from "react";
import { Cpu, FileText, MessageSquare, Plus, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-900 bg-gradient-to-r from-gray-100/80 via-gray-50/45 to-white dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-950/20 px-6 py-8 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-orange-600/10 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[200px] h-[200px] bg-amber-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Left Content */}
      <div className="flex-1 space-y-5 text-center md:text-left z-10">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            Good morning, Alex.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed font-medium"
          >
            Your knowledge base is synced and indexed. AI insights were extracted from your recent documentation.
          </motion.p>
        </div>

        {/* Buttons Row (Matching reference screenshot) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-3"
        >
          <Button asChild className="h-8.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg px-4 text-xs font-semibold shadow-[0_0_15px_rgba(234,88,12,0.15)] border border-orange-500/20 cursor-pointer transition-all">
            <Link href="/skills?create=true">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Skill
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-8.5 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 rounded-lg px-4 text-xs font-semibold cursor-pointer transition-all">
            <Link href="/upload">
              <Upload className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              Upload Files
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-8.5 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 rounded-lg px-4 text-xs font-semibold cursor-pointer transition-all">
            <Link href="/skills">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
              New Chat
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Right Animated Orbital Graphic (Matching reference screenshot) */}
      <div className="relative w-44 h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 flex items-center justify-center z-10 select-none">
        {/* Outer Orbit (Dashed) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[95%] h-[95%] border border-dashed border-orange-500/10 dark:border-orange-500/20 rounded-full"
        />

        {/* Middle Orbit (Dashed) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[75%] h-[75%] border border-dashed border-gray-200 dark:border-gray-800 rounded-full"
        >
          {/* Orbital Node 1 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
          {/* Orbital Node 2 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        </motion.div>

        {/* Inner Orbit (Dashed) */}
        <motion.div
          animate={{ rotate: 180 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[50%] h-[50%] border border-dashed border-orange-500/20 dark:border-orange-500/30 rounded-full"
        >
          {/* Orbital Node 3 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
        </motion.div>

        {/* Center Node */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-[0_0_20px_rgba(234,88,12,0.15)]">
          <Cpu className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-orange-500/40"
          />
        </div>

        {/* Orbit Connection lines (Simulated background SVGs) */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100">
          <path d="M 50 15 A 35 35 0 0 0 15 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500 dark:text-orange-400" />
          <path d="M 50 85 A 35 35 0 0 0 85 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500 dark:text-orange-400" />
          <line x1="50" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-orange-500 dark:text-orange-400" />
          <line x1="50" y1="50" x2="77" y2="23" stroke="currentColor" strokeWidth="0.5" className="text-orange-500 dark:text-orange-400" />
        </svg>
      </div>
    </div>
  );
}
