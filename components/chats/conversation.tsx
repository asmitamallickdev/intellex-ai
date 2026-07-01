"use client";

import React from "react";
import { Message } from "./chat-page";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import TypingIndicator from "./typing-indicator";

interface ConversationProps {
  messages: Message[];
  isThinking: boolean;
  onRegenerate: (id: string) => void;
  conversationEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function Conversation({
  messages,
  isThinking,
  onRegenerate,
  conversationEndRef,
}: ConversationProps) {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto flex flex-col justify-end">
      {messages.map((msg) => {
        if (msg.sender === "user") {
          return <UserMessage key={msg.id} message={msg} />;
        } else {
          return (
            <AssistantMessage
              key={msg.id}
              message={msg}
              onRegenerate={onRegenerate}
            />
          );
        }
      })}

      {/* Typing/Thinking dot animation */}
      {isThinking && <TypingIndicator />}

      {/* Auto-scroll anchor */}
      <div ref={conversationEndRef} />
    </div>
  );
}
