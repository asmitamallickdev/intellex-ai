"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import EmptyChatState from "./empty-chat-state";
import Conversation from "./conversation";
import ChatInput from "./chat-input";
import KnowledgeContextPanel from "./knowledge-context-panel";
import { CitationSource } from "@/lib/chats-mock-data";
import { toast } from "sonner";
import { BookOpen, MessageSquarePlus, Trash2, PanelLeftOpen, PanelLeftClose, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatHistoryPanel from "./chat-history-panel";
import { 
  getChatMessagesAction, 
  deleteChatAction 
} from "@/src/actions/chat.actions";
import { uploadFileAction } from "@/src/actions/upload.actions";
import { triggerIngestionAction } from "@/src/actions/ingestion.actions";
import KnowledgeUploader from "@/components/skills/create-skill-modal/knowledge-uploader";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  citations?: CitationSource[];
}

export default function ChatPage({ skillId, chatId }: { skillId: string; chatId: string }) {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [knowledgeRefreshKey, setKnowledgeRefreshKey] = useState(0);
  const uploadsInProgress = useRef(0);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  const {
    messages: aiMessages,
    status,
    sendMessage,
    regenerate,
    setMessages: setAiMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      body: { skillId, chatId },
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

    async function loadChatMessages() {
      if (!chatId) return;

      try {
        const msgRes = await getChatMessagesAction(chatId);
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
      } catch (err) {
        console.error("Failed to load chat messages:", err);
        if (!cancelled) toast.error("Failed to load chat history.");
      }
    }

    loadChatMessages();
    return () => { cancelled = true; };
  }, [chatId]);

  useEffect(() => {
    const handleNewChatEvent = () => {
      handleNewChat();
    };
    window.addEventListener("new-chat", handleNewChatEvent);
    return () => window.removeEventListener("new-chat", handleNewChatEvent);
  }, [skillId]);

  const handleNewChat = () => {
    router.push(`/chat/${skillId}`);
  };

  const handleDeleteChat = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this chat conversation history?")) return;
    try {
      await deleteChatAction(chatId);
      toast.success("Chat history deleted successfully.");
      router.push(`/chat/${skillId}`);
    } catch (err) {
      toast.error("Failed to delete chat session.");
    }
  }, [chatId, skillId, router]);

  const handleSendMessage = useCallback((textToSend: string) => {
    if (!textToSend.trim() || isStreaming || isThinking) return;
    setInputText("");
    sendMessage({ text: textToSend });
  }, [isStreaming, isThinking, sendMessage]);

  const handleFileUpload = async (file: File) => {
    uploadsInProgress.current++;
    const toastId = toast.loading(`Uploading "${file.name}"...`);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => resolve();
        reader.onerror = () => reject(new Error("Failed to read file"));
      });

      const base64Data = (reader.result as string).split(",")[1];
      const uploadRes = await uploadFileAction(
        skillId,
        file.name,
        file.type || "application/octet-stream",
        file.size,
        base64Data
      );

      if (!uploadRes.success || !uploadRes.data) throw new Error(uploadRes.error || "Upload failed");

      const ingestRes = await triggerIngestionAction(uploadRes.data.id);
      if (!ingestRes.success) throw new Error(ingestRes.error);

      setKnowledgeRefreshKey((k) => k + 1);
      toast.success(`"${file.name}" uploaded & indexed`, { id: toastId });
    } catch (err: any) {
      toast.error(`"${file.name}": ${err.message}`, { id: toastId });
    } finally {
      uploadsInProgress.current--;
      if (uploadsInProgress.current <= 0) {
        setShowUploadModal(false);
      }
    }
  };

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
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden text-gray-800 dark:text-gray-100 font-sans relative -m-4 md:-m-6 lg:-m-8">
      {/* Left Panel � Chat History */}
      <div className={cn(
        "hidden lg:block lg:w-[280px] lg:flex-shrink-0 h-full bg-gray-50/20 dark:bg-gray-950/10 z-10 transition-all duration-300 border-r border-gray-200 dark:border-gray-900",
        !showChatHistory && "lg:hidden lg:w-0 lg:border-r-0"
      )}>
        <ChatHistoryPanel
          skillId={skillId}
          activeChatId={chatId}
          onClose={() => setShowChatHistory(false)}
        />
      </div>

      {!showChatHistory && (
        <button
          onClick={() => setShowChatHistory(true)}
          className="lg:hidden absolute top-4 left-4 z-40 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          title="Open Chat History"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      {showChatHistory && (
        <div className="lg:hidden">
          <div
            onClick={() => setShowChatHistory(false)}
            className="fixed inset-0 bg-black/85 z-40"
          />
          <div className="fixed inset-y-0 left-0 w-[300px] md:w-[320px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-900 z-50 shadow-2xl flex flex-col">
            <ChatHistoryPanel
              skillId={skillId}
              activeChatId={chatId}
              onClose={() => setShowChatHistory(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full bg-gray-50/20 dark:bg-gray-950/10 relative min-w-0 border-r border-gray-200 dark:border-gray-900/60">
        
        <header className="flex h-14 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-900/80 bg-white/80 dark:bg-gray-950/40 backdrop-blur-md z-10 flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Skill Discussion Space
            </span>
            <div className="bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide border border-gray-200 dark:border-gray-800">
              Intellex AI Assistant
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className={cn(
                "p-1.5 rounded-lg border border-transparent transition-all flex items-center gap-1 cursor-pointer",
                showChatHistory
                  ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20"
                  : "text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-800"
              )}
              title={showChatHistory ? "Close Chat History" : "Open Chat History"}
            >
              {showChatHistory ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDeleteChat}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent transition-all flex items-center gap-1 cursor-pointer"
              title="Delete Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all flex items-center gap-1 cursor-pointer"
              title="Reset Chat Session"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={cn(
                "hidden md:inline-flex items-center gap-1 h-7.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer",
                showRightPanel 
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-500/20" 
                  : "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Context Details</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-36 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
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

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-50 dark:from-gray-950 via-slate-50/90 dark:via-gray-950/90 to-transparent p-4 md:p-6 z-10">
          <div className="max-w-2xl mx-auto">
            <ChatInput
              value={inputText}
              onChange={setInputText}
              onSend={handleSendMessage}
              isSendDisabled={isStreaming || isThinking}
              onAttachClick={() => setShowUploadModal(true)}
            />
            <p className="text-center text-[9px] text-gray-400 dark:text-gray-600 font-medium tracking-wide uppercase mt-2.5">
              Intellex AI Enterprise v2.4 � AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </div>

      <div className={cn(
        "hidden lg:block lg:w-[320px] lg:flex-shrink-0 h-full bg-gray-50/20 dark:bg-gray-950/10 z-10 transition-all duration-300 border-l border-gray-200 dark:border-gray-900",
        !showRightPanel && "lg:hidden lg:w-0 lg:border-l-0"
      )}>
        <KnowledgeContextPanel
          skillId={skillId}
          refreshKey={knowledgeRefreshKey}
        />
      </div>

      {!showRightPanel && (
        <button
          onClick={() => setShowRightPanel(true)}
          className="lg:hidden absolute bottom-28 right-6 z-40 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
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
          <div className="fixed inset-y-0 right-0 w-[300px] md:w-[320px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-900 z-50 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-900 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-wider">Knowledge Context</span>
              <button 
                onClick={() => setShowRightPanel(false)}
                className="text-xs font-semibold text-gray-500 dark:text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <KnowledgeContextPanel
                skillId={skillId}
                refreshKey={knowledgeRefreshKey}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Knowledge Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Upload Knowledge
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <KnowledgeUploader
              onFileAdd={handleFileUpload}
              onError={(msg) => toast.error(msg)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export type { CitationSource };
