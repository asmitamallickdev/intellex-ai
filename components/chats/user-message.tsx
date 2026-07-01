"use client";

import React from "react";
import { User } from "lucide-react";
import { Message } from "./chat-page";

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start justify-end space-x-3 max-w-2xl ml-auto group select-text">
      
      {/* Message Balloon */}
      <div className="space-y-1 text-right">
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-850 text-zinc-800 dark:text-zinc-200 px-4 py-2.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-md inline-block shadow-sm">
          {message.text}
        </div>
        <span className="text-[9px] font-semibold text-zinc-450 dark:text-zinc-650 tracking-wider block uppercase pr-1">
          {message.timestamp}
        </span>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0 mt-0.5 shadow-sm">
        <User className="w-4 h-4" />
      </div>
      
    </div>
  );
}
