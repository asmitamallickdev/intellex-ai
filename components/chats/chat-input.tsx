"use client";

import React, { useRef, useEffect } from "react";
import { Paperclip, Mic, Send, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (text: string) => void;
  isSendDisabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isSendDisabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSendDisabled) {
        onSend(value);
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim() && !isSendDisabled) {
      onSend(value);
    }
  };

  const handleAttachClick = () => {
    toast.info("Staging attachment to conversation...");
  };

  const handleKnowledgeClick = () => {
    toast.info("Opening knowledge base attachment module...");
  };

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 focus-within:border-violet-500/80 focus-within:ring-1 focus-within:ring-violet-500/30 rounded-xl p-2 transition-all shadow-lg relative">
      
      {/* Input Textarea Field */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Intellex AI anything..."
        className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-505 resize-none px-3.5 pt-2 max-h-[120px] scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent min-h-[36px]"
      />

      {/* Toolbar row: Attachments & voice (left), Send button (right) */}
      <div className="flex items-center justify-between pt-2.5 px-2.5 border-t border-zinc-100 dark:border-zinc-900/60 mt-1 select-none">
        
        {/* Left: Attachment & voice controls */}
        <div className="flex items-center space-x-1.5">
          {/* Attach File */}
          <button
            type="button"
            onClick={handleAttachClick}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Attach local file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Attach Knowledge Source */}
          <button
            type="button"
            onClick={handleKnowledgeClick}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Link knowledge database source"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Voice Input (Disabled UI) */}
          <button
            type="button"
            className="p-1.5 rounded-lg text-zinc-405 dark:text-zinc-700 opacity-40 cursor-not-allowed"
            disabled
            title="Voice input (Disabled)"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Send & Shortcut helpers */}
        <div className="flex items-center space-x-2">
          {/* Keyboard helper hint */}
          <span className="hidden sm:inline text-[9px] font-bold text-zinc-400 dark:text-zinc-650 tracking-wider uppercase">
            Press Enter ↵
          </span>

          {/* Send Action */}
          <button
            type="button"
            onClick={handleSendClick}
            disabled={!value.trim() || isSendDisabled}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0",
              value.trim() && !isSendDisabled
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.2)] border border-violet-500/20"
                : "bg-zinc-100 dark:bg-zinc-950 text-zinc-400 dark:text-zinc-700 cursor-not-allowed"
            )}
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
