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
        <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-md inline-block shadow-sm">
          {message.text}
        </div>
        <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 tracking-wider block uppercase pr-1">
          {message.timestamp}
        </span>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5 shadow-sm">
        <User className="w-4 h-4" />
      </div>
      
    </div>
  );
}
