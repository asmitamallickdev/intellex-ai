import { CitationSource } from "@/lib/chats-mock-data";

export interface MessageCitation {
  id: string;
  title: string;
  location: string;
  confidence: number;
  snippet?: string;
  type: "document" | "memory" | "conversation";
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  citations?: MessageCitation[];
  createdAt: Date;
}
