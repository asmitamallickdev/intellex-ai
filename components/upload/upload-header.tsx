"use client";

import React from "react";
import { motion } from "framer-motion";

export default function UploadHeader() {
  return (
    <div className="space-y-1.5 border-b border-gray-200 dark:border-gray-900/60 pb-6">
      <motion.h2
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Upload Files
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed font-medium"
      >
        Upload documents to build your private AI knowledge base. These files will later be indexed, embedded, and used to answer your questions.
      </motion.p>
    </div>
  );
}
