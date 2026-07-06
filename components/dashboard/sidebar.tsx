"use client";

import React from "react";
import * as Icons from "lucide-react";
import { sidebarNavItems, sidebarBottomItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
  onItemClick?: () => void;
}

export default function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Compute active navigation item dynamically based on router path
  const activeItem = pathname.startsWith("/skills")
    ? "Skills"
    : pathname.startsWith("/knowledge")
    ? "Knowledge Base"
    : pathname.startsWith("/chats")
    ? "Chats"
    : pathname.startsWith("/upload")
    ? "Upload Files"
    : "Dashboard";

  const handleNewChatClick = () => {
    if (onItemClick) onItemClick();
    const chatMatch = pathname.match(/^\/chats\/(.+)$/);
    if (chatMatch) {
      window.dispatchEvent(new Event("new-chat"));
    } else {
      router.push("/skills");
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    if (href === "#") {
      e.preventDefault();
      toast.info(`"${label}" section is coming soon!`);
    } else if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-950/60 backdrop-blur-xl border-r border-gray-200 dark:border-gray-900 p-5 select-none justify-between">
      {/* Top Section: Brand & Action */}
      <div className="flex flex-col space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-2 py-1.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 shadow-[0_0_15px_rgba(234,88,12,0.3)] border border-orange-400/20">
            <Icons.BrainCircuit className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] tracking-tight bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 dark:from-gray-50 dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Intellex AI
            </span>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-500 dark:text-gray-400 tracking-wide">
              Enterprise Hub
            </span>
          </div>
        </div>

        {/* Primary CTA: New Chat */}
        <div className="px-1">
          <Button
            className="w-full justify-start h-9 bg-orange-600 hover:bg-orange-500 text-white rounded-lg px-3.5 font-medium transition-all shadow-[0_0_15px_rgba(234,88,12,0.15)] hover:shadow-[0_0_20px_rgba(234,88,12,0.25)] border border-orange-500/20 group/btn cursor-pointer"
            onClick={handleNewChatClick}
          >
            <Icons.Plus className="w-4 h-4 mr-2 text-orange-200 transition-transform group-hover/btn:rotate-90 duration-300" />
            New Chat
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1.5 px-1">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-500 dark:text-gray-400 tracking-wider uppercase px-3 block mb-2">
            Navigation
          </span>
          {sidebarNavItems.map((item) => {
            const Icon = (Icons[item.iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;
            const isActive = item.label === activeItem;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.label, item.href)}
                className={cn(
                  "relative flex items-center justify-between h-9 px-3 rounded-lg text-sm transition-all duration-200 group border-l-2",
                  isActive
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500 pl-[10px] font-medium"
                    : "text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900/40 border-transparent hover:pl-3.5"
                )}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors duration-200",
                      isActive
                        ? "text-orange-500 dark:text-orange-400"
                        : "text-gray-600 dark:text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    isActive 
                      ? "bg-orange-500/20 text-orange-600 dark:text-orange-300" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Utility Navigation & Profile */}
      <div className="flex flex-col space-y-4">
        {/* Secondary Navigation */}
        <nav className="space-y-1 px-1">
          {sidebarBottomItems.map((item) => {
            const Icon = (Icons[item.iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.label, item.href)}
                className="flex items-center space-x-2.5 h-9 px-3 rounded-lg text-sm text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900/40 border-l-2 border-transparent hover:pl-3.5 transition-all duration-200 group"
              >
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-900/80 mx-1 pt-4" />

        {/* User Profile */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors duration-200 group">
          <div className="flex items-center space-x-3">
            {/* Avatar with status indicator */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-orange-950 dark:to-gray-900">
                AC
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-tight group-hover:text-gray-950 dark:group-hover:text-white transition-colors duration-150">
                User
              </span>
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-500 dark:text-gray-400 tracking-wide">
                Enterprise Pro
              </span>
            </div>
          </div>
          
          <button className="text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
            <Icons.MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
