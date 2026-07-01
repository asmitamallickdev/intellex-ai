"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChatsBySkillAction } from "@/src/actions/chat.actions";
import { MessageSquare, Plus, History, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chat } from "@prisma/client";

interface ChatHistoryPanelProps {
  skillId: string;
  activeChatId: string;
  onClose: () => void;
}

export default function ChatHistoryPanel({
  skillId,
  activeChatId,
  onClose,
}: ChatHistoryPanelProps) {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadChats() {
      setLoading(true);
      try {
        const res = await getChatsBySkillAction(skillId);
        if (cancelled) return;
        if (res.success && res.data) {
          setChats(res.data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadChats();
    return () => { cancelled = true; };
  }, [skillId]);

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${skillId}/${chatId}`);
    onClose();
  };

  const handleNewChat = () => {
    router.push(`/chat/${skillId}`);
    onClose();
  };

  function formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-900/60 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-900/80 flex items-center justify-between bg-white/40 dark:bg-gray-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Chat History
          </h3>
        </div>
        <button
          onClick={handleNewChat}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
          title="New Chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-orange-500 animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                No chats yet
              </h4>
              <p className="text-[10px] text-gray-400 max-w-[180px]">
                Start a new conversation to see it here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer group",
                  chat.id === activeChatId
                    ? "bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent"
                )}
              >
                <MessageSquare className={cn(
                  "w-3.5 h-3.5 flex-shrink-0",
                  chat.id === activeChatId
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-400 dark:text-gray-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs font-medium truncate",
                    chat.id === activeChatId
                      ? "text-orange-800 dark:text-orange-200"
                      : "text-gray-700 dark:text-gray-300"
                  )}>
                    {chat.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-gray-400" />
                    <span className="text-[9px] text-gray-400 font-medium">
                      {formatTime(new Date(chat.createdAt))}
                    </span>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-3.5 h-3.5 flex-shrink-0 transition-opacity",
                  chat.id === activeChatId
                    ? "text-orange-400 opacity-100"
                    : "text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100"
                )} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
