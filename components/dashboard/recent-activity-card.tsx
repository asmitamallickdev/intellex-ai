"use client";

import React from "react";
import { 
  FileText, 
  MessageSquare, 
  Wrench, 
  ArrowUpRight, 
  Clock, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { recentActivities } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RecentActivityCard() {
  const router = useRouter();

  const handleActivityClick = (type: string) => {
    if (type === "chat") {
      router.push("/chats");
    } else if (type === "skill") {
      router.push("/skills");
    } else {
      router.push("/upload");
    }
  };
  // Helper to determine icon based on file extension / type
  const getItemStyles = (type: string, title: string) => {
    if (type === "chat") {
      return {
        icon: MessageSquare,
        wrapperClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15",
      };
    }
    if (type === "skill") {
      return {
        icon: Wrench,
        wrapperClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15",
      };
    }
    
    // Default document icons based on extension
    const ext = title.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return {
        icon: FileText,
        wrapperClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15",
      };
    }
    if (ext === "pptx") {
      return {
        icon: FileText,
        wrapperClass: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/15",
      };
    }
    
    return {
      icon: FileText,
      wrapperClass: "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50",
    };
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 backdrop-blur-sm p-5 md:p-6 h-full space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Recent Activity
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium">
            System uploads and active agent sessions
          </p>
        </div>
        <Link href="/skills" className="flex items-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-750 dark:hover:text-violet-300 transition-colors group/view cursor-pointer">
          View all
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 transition-transform duration-200" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-900/60">
        {recentActivities.map((activity, idx) => {
          const { icon: Icon, wrapperClass } = getItemStyles(activity.type, activity.title);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleActivityClick(activity.type)}
              className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group/item cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-transparent rounded-lg px-2 -mx-2 transition-colors"
            >
              {/* Left Detail */}
              <div className="flex items-center space-x-3.5 min-w-0 mr-4">
                {/* Icon wrapper */}
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-transform duration-300 group-hover/item:scale-105 flex-shrink-0",
                  wrapperClass
                )}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                
                {/* Text Info */}
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover/item:text-zinc-950 dark:group-hover/item:text-white transition-colors duration-150 truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center text-[10px] text-zinc-500 font-medium">
                    <span className="truncate">{activity.subtitle}</span>
                    {activity.size && (
                      <>
                        <span className="mx-1.5 text-zinc-350 dark:text-zinc-700">•</span>
                        <span>{activity.size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Detail: Timestamp & Status badge */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                {/* Clock & Timestamp */}
                <div className="flex items-center space-x-1 text-[10px] text-zinc-500 font-medium">
                  <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                  <span>{activity.timestamp}</span>
                </div>

                {/* Status Badge */}
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase",
                  activity.status === "Indexed"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                    : activity.status === "Completed"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/10"
                    : activity.status === "Ready"
                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/10"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                )}>
                  {activity.status}
                </span>
                
                <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-zinc-400 dark:text-zinc-700 group-hover/item:text-zinc-600 dark:group-hover/item:text-zinc-400 group-hover/item:translate-x-0.5 transition-all duration-200" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
