import { create } from "zustand";
import { ChatSession } from "@/types/chat";
import { ChatMessage } from "@/types/message";

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isThinking: boolean;
  isStreaming: boolean;
  
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSessionId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setThinking: (status: boolean) => void;
  setStreaming: (status: boolean) => void;
  clearSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isThinking: false,
  isStreaming: false,
  
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setThinking: (isThinking) => set({ isThinking }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearSession: () => set({ activeSessionId: null, messages: [], isThinking: false, isStreaming: false }),
}));
