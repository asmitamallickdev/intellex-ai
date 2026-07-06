"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  Wrench, 
  ArrowUpRight, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllFilesAction } from "@/src/actions/upload.actions";
import { getAllSkillsAction } from "@/src/actions/skill.actions";

interface Activity {
  id: string;
  type: "file" | "skill" | "chat";
  title: string;
  subtitle: string;
  size?: string;
  timestamp: string;
  status: string;
  timeMs: number;
}

export default function RecentActivityCard() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const [filesRes, skillsRes] = await Promise.all([
          getAllFilesAction(),
          getAllSkillsAction()
        ]);

        const combined: Activity[] = [];

        if (filesRes.success && filesRes.data) {
          filesRes.data.slice(0, 3).forEach((file) => {
            const sizeInMB = file.size / (1024 * 1024);
            const sizeStr = sizeInMB > 1 
              ? `${sizeInMB.toFixed(1)} MB` 
              : `${(file.size / 1024).toFixed(0)} KB`;

            combined.push({
              id: file.id,
              type: "file",
              title: file.originalName,
              subtitle: `Uploaded file in workspace`,
              size: sizeStr,
              timestamp: new Date(file.uploadedAt).toLocaleDateString(),
              status: file.status === "READY" ? "Indexed" : "Processing",
              timeMs: new Date(file.uploadedAt).getTime()
            });
          });
        }

        if (skillsRes.success && skillsRes.data) {
          skillsRes.data.slice(0, 2).forEach((skill) => {
            combined.push({
              id: skill.id,
              type: "skill",
              title: skill.name,
              subtitle: `Created workspace skill`,
              timestamp: new Date(skill.createdAt).toLocaleDateString(),
              status: "Ready",
              timeMs: new Date(skill.createdAt).getTime()
            });
          });
        }

        // Sort by recency
        combined.sort((a, b) => b.timeMs - a.timeMs);
        setActivities(combined);
      } catch (err) {
        console.error("Failed to load dashboard activities:", err);
      }
    }

    loadActivities();
  }, []);

  const handleActivityClick = (type: string) => {
    if (type === "chat") {
      router.push("/chats");
    } else if (type === "skill") {
      router.push("/skills");
    } else {
      router.push("/upload");
    }
  };

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
    
    const ext = title.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return {
        icon: FileText,
        wrapperClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15",
      };
    }
    return {
      icon: FileText,
      wrapperClass: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50",
    };
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-900/10 backdrop-blur-sm p-5 md:p-6 h-full space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Recent Activity
          </h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-500 font-medium">
            System uploads and active agent sessions
          </p>
        </div>
        <Link href="/skills" className="flex items-center text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group/view cursor-pointer">
          View all
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 transition-transform duration-200" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-900/60">
        {activities.map((activity, idx) => {
          const { icon: Icon, wrapperClass } = getItemStyles(activity.type, activity.title);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleActivityClick(activity.type)}
              className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group/item cursor-pointer hover:bg-gray-50/50 dark:hover:bg-transparent rounded-lg px-2 -mx-2 transition-colors"
            >
              {/* Left Detail */}
              <div className="flex items-center space-x-3.5 min-w-0 mr-4">
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-transform duration-300 group-hover/item:scale-105 flex-shrink-0",
                  wrapperClass
                )}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-gray-955 dark:group-hover/item:text-white transition-colors duration-150 truncate">
                    {activity.title}
                  </h4>
                  <div className="flex items-center text-[10px] text-gray-600 dark:text-gray-500 font-medium">
                    <span className="truncate">{activity.subtitle}</span>
                    {activity.size && (
                      <>
                        <span className="mx-1.5 text-gray-300 dark:text-gray-700">•</span>
                        <span>{activity.size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Detail */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                <div className="flex items-center space-x-1 text-[10px] text-gray-600 dark:text-gray-500 font-medium">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-600" />
                  <span>{activity.timestamp}</span>
                </div>

                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase",
                  activity.status === "Indexed"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                    : activity.status === "Completed"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/10"
                    : activity.status === "Ready"
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/10"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-500 border-gray-200 dark:border-gray-750"
                )}>
                  {activity.status}
                </span>
                
                <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-gray-400 dark:text-gray-700 group-hover/item:text-gray-600 dark:group-hover/item:text-gray-550 group-hover/item:translate-x-0.5 transition-all duration-200" />
              </div>
            </motion.div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No recent activity recorded.
          </div>
        )}
      </div>
    </div>
  );
}
