"use client";

import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { Skill } from "@/lib/skills-mock-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SkillCardProps {
  skill: Skill;
  layoutMode: "grid" | "list";
  onPinToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const colorMap: Record<string, { bg: string; text: string; border: string; borderHover: string; glow: string; textDark: string }> = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/10", borderHover: "hover:border-amber-500/30", glow: "rgba(245,158,11,0.03)", textDark: "text-amber-300" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/10", borderHover: "hover:border-blue-500/30", glow: "rgba(59,130,246,0.03)", textDark: "text-blue-300" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/10", borderHover: "hover:border-violet-500/30", glow: "rgba(139,92,246,0.03)", textDark: "text-violet-300" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/10", borderHover: "hover:border-sky-500/30", glow: "rgba(14,165,233,0.03)", textDark: "text-sky-300" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/10", borderHover: "hover:border-rose-500/30", glow: "rgba(244,63,94,0.03)", textDark: "text-rose-300" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/10", borderHover: "hover:border-emerald-500/30", glow: "rgba(16,185,129,0.03)", textDark: "text-emerald-300" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/10", borderHover: "hover:border-indigo-500/30", glow: "rgba(99,102,241,0.03)", textDark: "text-indigo-300" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/10", borderHover: "hover:border-cyan-500/30", glow: "rgba(6,182,212,0.03)", textDark: "text-cyan-300" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/10", borderHover: "hover:border-orange-500/30", glow: "rgba(249,115,22,0.03)", textDark: "text-orange-300" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/10", borderHover: "hover:border-red-500/30", glow: "rgba(239,68,68,0.03)", textDark: "text-red-300" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/10", borderHover: "hover:border-pink-500/30", glow: "rgba(236,72,153,0.03)", textDark: "text-pink-300" },
  zinc: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/10", borderHover: "hover:border-gray-500/30", glow: "rgba(113,113,122,0.03)", textDark: "text-gray-300" },
};

export default function SkillCard({
  skill,
  layoutMode,
  onPinToggle,
  onDelete,
  onDuplicate,
  onRename,
}: SkillCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(skill.name);

  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const Icon = (Icons[skill.icon as keyof typeof Icons] || Icons.Wrench) as React.ComponentType<{ className?: string }>;
  const colorStyles = colorMap[skill.color] || colorMap.zinc;

  // Click outside to close actions menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus rename input
  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue.trim() !== skill.name) {
      onRename(skill.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setRenameValue(skill.name);
      setIsRenaming(false);
    }
  };

  // ----------------------------------------------------
  // GRID CARD VIEW (Default)
  // ----------------------------------------------------
  if (layoutMode === "grid") {
    return (
      <motion.div
        whileHover={{ 
          y: -4, 
        }}
        className={cn(
          "relative flex flex-col justify-between p-5 rounded-2xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/20 backdrop-blur-sm transition-all duration-200 group shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]",
          colorStyles.borderHover
        )}
        style={{
          boxShadow: `inset 0 0 16px ${colorStyles.glow}`,
        }}
      >
        {/* Card Header: Icon, Tags & 3-Dot Menu */}
        <div className="flex items-start justify-between relative">
          <div className="flex items-center space-x-2">
            {/* Color-coded Icon Box */}
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 border",
              colorStyles.bg,
              colorStyles.border
            )}>
              <Icon className={cn("w-5 h-5", colorStyles.text)} />
            </div>

            {/* Pinned overlay badge */}
            {skill.isPinned && (
              <Icons.Pin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 rotate-45" />
            )}
          </div>

          {/* Action Menu (3-dot Dropdown) */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800 cursor-pointer"
              aria-label="Actions menu"
            >
              <Icons.MoreHorizontal className="w-4.5 h-4.5" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1 w-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 shadow-2xl z-30"
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      // Custom workspace open behavior
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    <Icons.ExternalLink className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                    Open Workspace
                  </button>

                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    <Icons.Edit className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                    Rename
                  </button>

                  <button
                    onClick={() => {
                      onDuplicate(skill.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    <Icons.Copy className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                    Duplicate
                  </button>

                  <button
                    onClick={() => {
                      onPinToggle(skill.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    <Icons.Pin className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                    {skill.isPinned ? "Unpin" : "Pin"}
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    <Icons.Archive className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                    Archive
                  </button>

                  <div className="border-t border-gray-100 dark:border-gray-900 my-1 mx-1" />

                  <button
                    onClick={() => {
                      onDelete(skill.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
                  >
                    <Icons.Trash2 className="w-3.5 h-3.5 mr-2 text-red-500/80" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card Body: Info */}
        <div className="mt-4 flex-1 space-y-1.5">
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-semibold bg-gray-50 dark:bg-gray-900 border border-orange-500 px-2 py-0.5 rounded text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
          ) : (
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight group-hover:text-gray-950 dark:group-hover:text-white transition-colors duration-150 truncate">
              {skill.name}
            </h3>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-medium h-12 overflow-hidden line-clamp-3">
            {skill.description}
          </p>
        </div>

        {/* Stats Row Block */}
        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-900/60 grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-gray-500 font-medium">
          <div className="flex items-center space-x-1">
            <Icons.FileText className="w-3.5 h-3.5 text-orange-500 dark:text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-400 font-semibold">{skill.documents}</span>
            <span className="text-black dark:text-gray-600">Docs</span>
          </div>

          <div className="flex items-center space-x-1">
            <Icons.MessageSquare className="w-3.5 h-3.5 text-orange-500 dark:text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-400 font-semibold">{skill.chats}</span>
            <span className="text-black dark:text-gray-600">Chats</span>
          </div>

          {/* <div className="flex items-center space-x-1">
            <Icons.Brain className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-400 font-semibold">{skill.memories}</span>
            <span className="text-black dark:text-gray-600">Nodes</span>
          </div>

          <div className="flex items-center space-x-1">
            <Icons.HardDrive className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-400 font-semibold">{skill.storage}</span>
          </div> */}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-1 border-t border-transparent">
          <span className="text-[10px] text-gray-500 font-medium flex items-center">
            <Icons.Calendar className="w-3 h-3 text-gray-400 dark:text-gray-600 mr-1 flex-shrink-0" />
            Upd: {skill.lastUpdated}
          </span>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onDelete(skill.id)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer border border-transparent"
              title="Delete Workspace"
            >
              <Icons.Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => router.push(`/chat/${skill.id}`)}
              className="flex items-center justify-center h-7 px-3.5 text-[10px] font-bold rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer"
            >
              Open Space
              <Icons.ArrowRight className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ----------------------------------------------------
  // LIST ROW VIEW
  // ----------------------------------------------------
  return (
    <motion.div
      whileHover={{ }}
      className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950/20 backdrop-blur-sm transition-all duration-200 group gap-4 shadow-sm hover:shadow-md dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
        colorStyles.borderHover
      )}
      style={{
        boxShadow: `inset 0 0 16px ${colorStyles.glow}`,
      }}
    >
      {/* Icon & General Info (left side) */}
      <div className="flex items-start md:items-center space-x-3.5 min-w-0 flex-1">
        {/* Color-coded Icon Box */}
        <div className={cn(
          "flex items-center justify-center w-8.5 h-8.5 rounded-lg flex-shrink-0 border",
          colorStyles.bg,
          colorStyles.border
        )}>
          <Icon className={cn("w-4.5 h-4.5", colorStyles.text)} />
        </div>

        {/* Detail Info */}
        <div className="min-w-0 flex-1 space-y-0.5 pr-2">
          <div className="flex items-center space-x-2 flex-wrap">
            {isRenaming ? (
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                className="text-xs font-semibold bg-gray-50 dark:bg-gray-900 border border-orange-500 px-2 py-0.5 rounded text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50"
              />
            ) : (
              <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-950 dark:group-hover:text-white transition-colors duration-150 truncate">
                {skill.name}
              </h3>
            )}
            
            {skill.isPinned && (
              <Icons.Pin className="w-3 h-3 text-orange-600 dark:text-orange-400 rotate-45 flex-shrink-0" />
            )}
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-800 uppercase tracking-wide">
              {skill.category}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1 max-w-xl">
            {skill.description}
          </p>
        </div>
      </div>

      {/* Stats Block (middle side) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-gray-500 font-semibold tracking-wide uppercase flex-shrink-0">
        <div className="flex items-center space-x-1 min-w-[50px]">
          <Icons.FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{skill.documents}</span>
        </div>

        <div className="flex items-center space-x-1 min-w-[50px]">
          <Icons.MessageSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{skill.chats}</span>
        </div>

        <div className="flex items-center space-x-1 min-w-[50px]">
          <Icons.Brain className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{skill.memories}</span>
        </div>

        <div className="flex items-center space-x-1 min-w-[60px]">
          <Icons.HardDrive className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{skill.storage}</span>
        </div>

        <span className="text-[10px] text-gray-500 font-medium normal-case flex items-center min-w-[100px]">
          <Icons.Calendar className="w-3 h-3 text-gray-400 dark:text-gray-600 mr-1 flex-shrink-0" />
          {skill.lastUpdated}
        </span>
      </div>

      {/* Button & Dropdown Actions (right side) */}
      <div className="flex items-center space-x-2 flex-shrink-0 w-full md:w-auto justify-end md:justify-start border-t md:border-t-0 border-gray-100 dark:border-gray-900/60 pt-3 md:pt-0">
        <button 
          onClick={() => onDelete(skill.id)}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer border border-transparent"
          title="Delete Workspace"
        >
          <Icons.Trash2 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => router.push(`/chat/${skill.id}`)}
          className="flex items-center justify-center h-7 px-3 text-[10px] font-bold rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer"
        >
          Open
        </button>

        {/* 3-dot list action menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800 cursor-pointer"
            aria-label="Actions menu"
          >
            <Icons.MoreHorizontal className="w-4.5 h-4.5" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-1 w-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 shadow-2xl z-30"
              >
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                >
                  <Icons.Edit className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                  Rename
                </button>

                <button
                  onClick={() => {
                    onDuplicate(skill.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                >
                  <Icons.Copy className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                  Duplicate
                </button>

                <button
                  onClick={() => {
                    onPinToggle(skill.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                >
                  <Icons.Pin className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                  {skill.isPinned ? "Unpin" : "Pin"}
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer font-medium"
                >
                  <Icons.Archive className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500" />
                  Archive
                </button>

                <div className="border-t border-gray-100 dark:border-gray-900 my-1 mx-1" />

                <button
                  onClick={() => {
                    onDelete(skill.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full h-8 px-2.5 rounded-md text-left text-[11px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
                >
                  <Icons.Trash2 className="w-3.5 h-3.5 mr-2 text-red-500/80" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
