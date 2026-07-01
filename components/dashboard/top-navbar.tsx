"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, HelpCircle, Menu, User } from "lucide-react";
import SearchBar from "./search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ThemeToggle from "../theme-toggle";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const [activeTab, setActiveTab] = useState<"shared" | "recent">("shared");
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith("/skills")) return "Skills";
    if (pathname.startsWith("/knowledge")) return "Knowledge Base";
    if (pathname.startsWith("/chats")) return "Chat Workspace";
    if (pathname.startsWith("/upload")) return "Upload Files";
    return "Dashboard";
  };

  const isDashboard = pathname === "/";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-900/80 bg-white/80 dark:bg-zinc-955/80 px-4 md:px-6 lg:px-8 backdrop-blur-xl transition-all">
      {/* Left: Mobile Menu & Dashboard Title & Tabs */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="flex lg:hidden items-center justify-center p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dashboard/Page Title */}
        <div className="flex items-center space-x-5">
          <h1 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
            {getPageTitle()}
          </h1>

          {/* Sub Tabs (Shared, Recent) - only visible on dashboard */}
          {isDashboard && (
            <div className="flex items-center space-x-1.5 self-center h-8">
              <button
                onClick={() => setActiveTab("shared")}
                className={cn(
                  "relative text-xs px-2.5 py-1 rounded-md transition-all font-medium",
                  activeTab === "shared"
                    ? "text-violet-600 dark:text-violet-300 font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                )}
              >
                Shared
                {activeTab === "shared" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-violet-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={cn(
                  "relative text-xs px-2.5 py-1 rounded-md transition-all font-medium",
                  activeTab === "recent"
                    ? "text-violet-600 dark:text-violet-300 font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                )}
              >
                Recent
                {activeTab === "recent" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-violet-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Search Bar - hidden on small mobile */}
        <div className="hidden sm:block">
          <SearchBar />
        </div>

        {/* Upgrade Plan Button */}
        <button 
          onClick={() => toast.success("Redirecting to Pro billing configurations...", {
            style: { background: "#09090b", color: "#f4f4f5", border: "1px solid #27272a" }
          })}
          className="hidden md:inline-flex items-center justify-center h-7 px-3 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 hover:from-violet-600/20 hover:to-fuchsia-600/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 hover:border-violet-500/30 transition-all shadow-[0_0_10px_rgba(139,92,246,0.05)] cursor-pointer"
        >
          Upgrade Plan
        </button>

        {/* Theme Toggle Switch */}
        <ThemeToggle />

        {/* Notifications Icon */}
        <button 
          onClick={() => toast.info("No unread alerts. Your semantic databases are fully synchronized.", {
            style: { background: "#09090b", color: "#f4f4f5", border: "1px solid #27272a" }
          })}
          className="relative p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-violet-500 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
        </button>

        {/* Help Icon */}
        <button 
          onClick={() => toast.info("Opening Intellex Help Center documentation...", {
            style: { background: "#09090b", color: "#f4f4f5", border: "1px solid #27272a" }
          })}
          className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-850" />

        {/* User avatar & name */}
        <div 
          onClick={() => toast.info("Opening user profile settings...", {
            style: { background: "#09090b", color: "#f4f4f5", border: "1px solid #27272a" }
          })}
          className="flex items-center space-x-2.5 px-1 py-0.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-all cursor-pointer"
        >
          <div className="w-6.5 h-6.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-zinc-550 dark:text-zinc-400" />
          </div>
          <span className="hidden lg:inline text-xs font-medium text-zinc-700 dark:text-zinc-350">
            Alex Chen
          </span>
        </div>
      </div>
    </header>
  );
}
