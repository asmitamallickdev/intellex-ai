"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import EmptyChatState from "./empty-chat-state";
import Conversation from "./conversation";
import ChatInput from "./chat-input";
import KnowledgeContextPanel from "./knowledge-context-panel";
import { CitationSource } from "@/lib/chats-mock-data";
import { toast } from "sonner";
import { BookOpen, MessageSquarePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { 
  getChatsBySkillAction, 
  getChatMessagesAction, 
  createChatAction,
  deleteChatAction
} from "@/src/actions/chat.actions";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  citations?: CitationSource[];
}

export default function ChatPage({ skillId }: { skillId: string }) {

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [contextLoaded, setContextLoaded] = useState(false);
  const [activeCitations, setActiveCitations] = useState<CitationSource[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  const {
    messages: aiMessages,
    status,
    sendMessage,
    regenerate,
    setMessages: setAiMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      body: { skillId },
    }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const isThinking = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isThinking]);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspaceChat() {
      const currentSkillId = skillId;
      if (!currentSkillId) return;

      try {
        const listRes = await getChatsBySkillAction(currentSkillId);
        if (cancelled) return;

        if (listRes.success && listRes.data && listRes.data.length > 0) {
          const chat = listRes.data[0];
          setActiveChatId(chat.id);

          const msgRes = await getChatMessagesAction(chat.id);
          if (cancelled) return;

          if (msgRes.success && msgRes.data) {
            const uiMessages = msgRes.data.map((msg) => ({
              id: msg.id,
              role: msg.role.toLowerCase() === "user" ? "user" as const : "assistant" as const,
              parts: [{ type: "text" as const, text: msg.content }] as any,
              createdAt: new Date(msg.createdAt),
            }));

            setAiMessages(uiMessages as any);
          }
        } else {
          const createRes = await createChatAction(currentSkillId, "Workspace Discussion");
          if (!cancelled && createRes.success && createRes.data) {
            setActiveChatId(createRes.data.id);
          }
        }
      } catch (err) {
        console.error("Failed to initialize workspace chat:", err);
        if (!cancelled) toast.error("Failed to load chat history.");
      }
    }

    loadWorkspaceChat();
    return () => { cancelled = true; };
  }, [skillId]);

  useEffect(() => {
    const handleNewChatEvent = () => {
      handleNewChat();
    };
    window.addEventListener("new-chat", handleNewChatEvent);
    return () => window.removeEventListener("new-chat", handleNewChatEvent);
  }, [skillId]);

  const handleNewChat = async () => {
    setAiMessages([]);
    setContextLoaded(false);
    setActiveCitations([]);

    const currentSkillId = skillId;
    if (currentSkillId) {
      try {
        const createRes = await createChatAction(currentSkillId, "Workspace Discussion");
        if (createRes.success && createRes.data) {
          setActiveChatId(createRes.data.id);
          toast.success("Initialized a new secure chat session.");
        }
      } catch (err) {
        toast.error("Failed to create new chat session.");
      }
    }
  };

  const handleSendMessage = useCallback((textToSend: string) => {
    if (!textToSend.trim() || isStreaming || isThinking) return;
    setInputText("");
    sendMessage({ text: textToSend });
  }, [isStreaming, isThinking, sendMessage]);

  const handleRegenerate = useCallback((id: string) => {
    regenerate({ messageId: id });
  }, [regenerate]);

  const messages: Message[] = aiMessages.map((msg) => {
    const textPart = (msg.parts ?? []).find((p) => p.type === "text") as { text: string } | undefined;
    return {
      id: msg.id,
      sender: msg.role === "user" ? "user" : "assistant",
      text: textPart?.text ?? "",
      timestamp: (msg as any).createdAt
        ? new Date((msg as any).createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden text-zinc-800 dark:text-zinc-100 font-sans relative -m-4 md:-m-6 lg:-m-8">
      <div className="flex-1 flex flex-col h-full bg-zinc-50/20 dark:bg-zinc-955/10 relative min-w-0 border-r border-zinc-200 dark:border-zinc-900/60">
        
        <header className="flex h-14 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-900/80 bg-white/80 dark:bg-zinc-950/40 backdrop-blur-md z-10 flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Skill Discussion Space
            </span>
            <div className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-500 dark:text-zinc-505 uppercase tracking-wide border border-zinc-200 dark:border-zinc-850">
              Intellex AI Assistant
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeChatId && (
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this chat conversation history?")) {
                    try {
                      await deleteChatAction(activeChatId);
                      toast.success("Chat history deleted successfully.");
                      setAiMessages([]);
                      setActiveChatId(null);
                      setActiveCitations([]);
                      setContextLoaded(false);
                    } catch (err) {
                      toast.error("Failed to delete chat session.");
                    }
                  }
                }}
                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent transition-all flex items-center gap-1 cursor-pointer"
                title="Delete Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all flex items-center gap-1 cursor-pointer"
              title="Reset Chat Session"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={cn(
                "hidden md:inline-flex items-center gap-1 h-7.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer",
                showRightPanel 
                  ? "bg-violet-50 dark:bg-violet-500/10 text-violet-650 dark:text-violet-300 border-violet-200 dark:border-violet-500/20" 
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-855"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Context Details</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-36 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {messages.length === 0 && !isThinking ? (
            <EmptyChatState onSuggestionClick={handleSendMessage} />
          ) : (
            <Conversation
              messages={messages}
              isThinking={isThinking}
              onRegenerate={handleRegenerate}
              conversationEndRef={conversationEndRef}
            />
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-slate-50/90 dark:via-zinc-950/90 to-transparent p-4 md:p-6 z-10">
          <div className="max-w-2xl mx-auto">
            <ChatInput
              value={inputText}
              onChange={setInputText}
              onSend={handleSendMessage}
              isSendDisabled={isStreaming || isThinking}
            />
            <p className="text-center text-[9px] text-zinc-400 dark:text-zinc-600 font-medium tracking-wide uppercase mt-2.5">
              Intellex AI Enterprise v2.4 • AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </div>

      <div className={cn(
        "hidden lg:block lg:w-[320px] lg:flex-shrink-0 h-full bg-zinc-50/20 dark:bg-zinc-955/10 z-10 transition-all duration-300 border-l border-zinc-200 dark:border-zinc-900",
        !showRightPanel && "lg:hidden lg:w-0 lg:border-l-0"
      )}>
        <KnowledgeContextPanel
          contextLoaded={contextLoaded}
          citations={activeCitations}
          onBrowseClick={() => {}}
        />
      </div>

      {!showRightPanel && (
        <button
          onClick={() => setShowRightPanel(true)}
          className="lg:hidden absolute bottom-28 right-6 z-40 w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          title="Open Knowledge Context"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}

      {showRightPanel && (
        <div className="lg:hidden">
          <div 
            onClick={() => setShowRightPanel(false)}
            className="fixed inset-0 bg-black/85 z-40" 
          />
          <div className="fixed inset-y-0 right-0 w-[300px] md:w-[320px] bg-white dark:bg-zinc-955 border-l border-zinc-200 dark:border-zinc-900 z-50 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-900 flex-shrink-0">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Knowledge Context</span>
              <button 
                onClick={() => setShowRightPanel(false)}
                className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <KnowledgeContextPanel
                contextLoaded={contextLoaded}
                citations={activeCitations}
                onBrowseClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export type { CitationSource };
