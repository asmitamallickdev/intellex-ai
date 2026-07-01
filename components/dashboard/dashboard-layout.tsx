"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import TopNavbar from "./top-navbar";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
      {/* Desktop Sidebar (visible on lg+) */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-shrink-0 border-r border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/40 backdrop-blur-xl">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-900 p-0 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="relative flex-1 flex flex-col h-full">
                {/* Close Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-4 top-5 p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
                <Sidebar onItemClick={() => setSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-gray-50/20 dark:bg-gray-950/20">
        <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/60 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
