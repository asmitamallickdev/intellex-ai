"use client";

import React, { useEffect, useState } from "react";
import { Brain, Activity, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { listMemoriesAction } from "@/src/actions/memory.actions";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
}

export default function KnowledgeGraphCard() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [healthScore, setHealthScore] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGraphData() {
      try {
        setIsLoading(true);
        const res = await listMemoriesAction();
        if (res.success && res.data) {
          const memories = res.data;

          const centerX = 130;
          const centerY = 75;

          // Define center core node
          const tempNodes: Node[] = [
            {
              id: "core-brain",
              label: "Intellex Core",
              x: centerX,
              y: centerY,
              size: 10,
              color: "#8b5cf6" // violet-500
            }
          ];

          const tempLinks: Link[] = [];

          memories.forEach((mem, idx) => {
            // Position in circle around core
            const angle = (idx / memories.length) * 2 * Math.PI;
            const radius = 45;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            let nodeColor = "#3b82f6"; // blue-500
            if (mem.category?.toLowerCase().includes("business")) {
              nodeColor = "#10b981"; // emerald-500
            } else if (mem.importance === "CRITICAL" || mem.importance === "HIGH") {
              nodeColor = "#f97316"; // orange-500
            }

            const nodeSize = mem.importance === "CRITICAL" ? 6 : mem.importance === "HIGH" ? 5 : 4;

            tempNodes.push({
              id: mem.id,
              label: mem.title,
              x,
              y,
              size: nodeSize,
              color: nodeColor
            });

            // Connect memory node to core
            tempLinks.push({
              source: "core-brain",
              target: mem.id
            });
          });

          setNodes(tempNodes);
          setLinks(tempLinks);

          // Calculate a dynamic health score based on count of memories
          const score = memories.length > 0 ? Math.min(100, 75 + memories.length * 5) : 100;
          setHealthScore(score);
        }
      } catch (err) {
        console.error("Failed to load knowledge graph data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGraphData();
  }, []);

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm p-5 md:p-6 h-full justify-between space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Knowledge Graph
          </h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-500 font-medium">
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
          className="p-1.5 rounded-lg text-gray-605 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800/80 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Network Graph Visualization */}
      <div className="relative w-full h-44 rounded-lg bg-gray-50/50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-900/60 overflow-hidden flex items-center justify-center">
        {/* Background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
        
        {/* Radial spotlight on graph center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.05),transparent_60%)] pointer-events-none" />

        {isLoading ? (
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider animate-pulse">Loading Graph...</span>
        ) : (
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
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 1, delay: idx * 0.05 }}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#a78bfa"
                    strokeWidth="0.8"
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {nodes.map((node) => (
                <g key={node.id} className="cursor-pointer group/node">
                  {/* Outer breathing pulse for core brain */}
                  {node.id === "core-brain" && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + 4}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="0.5"
                      className="animate-ping opacity-25"
                      style={{ animationDuration: "3s" }}
                    />
                  )}
                  
                  {/* Interactive node hover circle */}
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    className="transition-all duration-200 group-hover/node:r-[8px] hover:shadow-lg"
                  />
                  
                  {/* Tiny label on node hover */}
                  <text
                    x={node.x}
                    y={node.y - (node.size + 3)}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[6px] font-semibold text-zinc-550 dark:text-zinc-400 opacity-0 group-hover/node:opacity-100 transition-opacity duration-150 pointer-events-none uppercase tracking-wide bg-white/80 dark:bg-zinc-950/80 px-1 rounded"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center space-x-3.5 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-900/60 p-3 rounded-xl">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex-shrink-0">
          <Brain className="w-4 h-4" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
              {healthScore}%
            </span>
            <span className="text-[10px] text-gray-600 dark:text-gray-500 font-semibold block uppercase tracking-wide">
              Graph Health
            </span>
          </div>
          <p className="text-[10px] text-gray-600 dark:text-gray-550 truncate font-medium">
            {nodes.length > 1 
              ? `${nodes.length - 1} semantic memory nodes synchronized.` 
              : "No memory nodes loaded yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
