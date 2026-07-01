"use client";

import React from "react";
import { Brain, Activity, RefreshCw } from "lucide-react";
import { knowledgeGraphData } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function KnowledgeGraphCard() {
  const { health, description, nodes, links } = knowledgeGraphData;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm p-5 md:p-6 h-full justify-between space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Knowledge Graph
          </h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-500 dark:text-gray-400 font-medium">
            Active semantic memory network
          </p>
        </div>
        <button 
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 1500)),
              {
                loading: "Optimizing memory graph vectors...",
                success: "Semantic connections optimized successfully!",
                error: "Failed to optimize graph.",
              }
            );
          }}
          className="p-1.5 rounded-lg text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800/80 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Network Graph Visualization */}
      <div className="relative w-full h-44 rounded-lg bg-gray-50/50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-900/60 overflow-hidden flex items-center justify-center select-none">
        {/* Background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
        
        {/* Radial spotlight on graph center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.05),transparent_60%)] pointer-events-none" />

        <svg className="w-full h-full p-2 z-10" viewBox="0 0 260 150">
          {/* Connection Lines (Links) */}
          <g>
            {links.map((link, idx) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;
              
              return (
                <motion.line
                  key={`link-${idx}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className="stroke-orange-500/25 dark:stroke-orange-500/15"
                  strokeWidth="1"
                  initial={{ strokeDasharray: "4 4", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -20 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              );
            })}
          </g>

          {/* Floating Nodes (Circles & Labels) */}
          <g>
            {nodes.map((node) => {
              const isCore = node.id === "7";
              const isLarge = node.size > 8;
              
              // Seed different values for float timings so they move asynchronously
              const floatOffset = parseInt(node.id) * 0.5;

              return (
                <motion.g
                  key={node.id}
                  animate={{
                    y: [0, -3, 0],
                    x: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 3 + floatOffset,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Connection Glow */}
                  {isCore && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + 4}
                      className="fill-orange-500/10 dark:fill-orange-500/5 animate-pulse"
                    />
                  )}
                  
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    className={cn(
                      isCore 
                        ? "fill-orange-600 dark:fill-orange-500 stroke-orange-400 dark:stroke-orange-300 stroke-[1.5px]" 
                        : isLarge 
                        ? "fill-orange-500/20 dark:fill-orange-600/30 stroke-orange-500/40 dark:stroke-orange-500/50 stroke-[1px]" 
                        : "fill-gray-200 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700 stroke-[1px]"
                    )}
                  />

                  {/* Pulsing indicator for active retrieval nodes */}
                  {(isCore || node.id === "2" || node.id === "4") && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2 + 2}
                      className="stroke-orange-600/45 dark:stroke-orange-400/30"
                      strokeWidth="0.5"
                      fill="none"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.5 + floatOffset, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}

                  {/* Node Labels (Only show core & primary nodes to keep it clean) */}
                  {(isCore || isLarge || node.id === "1" || node.id === "4") && (
                    <text
                      x={node.x}
                      y={node.y - (node.size / 2 + 3)}
                      textAnchor="middle"
                      className="font-sans pointer-events-none fill-gray-500 dark:fill-gray-400"
                      fontSize="7"
                      fontWeight={isCore ? "bold" : "normal"}
                    >
                      {node.label}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Progress & Description Section */}
      <div className="space-y-3">
        {/* Progress labels */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <Brain className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
            <span>Memory Health</span>
          </div>
          <span className="font-bold text-orange-600 dark:text-orange-400">{health}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden border border-gray-200 dark:border-gray-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${health}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full relative"
          >
            {/* Glowing tip */}
            <div className="absolute right-0 top-0 h-full w-2 bg-white/20 blur-xs rounded-full" />
          </motion.div>
        </div>

        {/* Description Text */}
        <p className="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          {description}
        </p>

        {/* Optimisation status detail list */}
        <div className="border-t border-gray-100 dark:border-gray-900/80 pt-3.5 flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-emerald-555 dark:text-emerald-500" />
            <span>Optimization: Active</span>
          </div>
          <span>Nodes: 342 active</span>
        </div>
      </div>
    </div>
  );
}
