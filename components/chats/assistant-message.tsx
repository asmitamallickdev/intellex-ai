"use client";

import React, { useState } from "react";
import { BrainCircuit, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, FileText } from "lucide-react";
import { Message } from "./chat-page";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AssistantMessageProps {
  message: Message;
  onRegenerate: (id: string) => void;
}

export default function AssistantMessage({
  message,
  onRegenerate,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    toast.success("Message copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    toast.success("Code block copied.");
  };

  // ----------------------------------------------------
  // CUSTOM HIGH-FIDELITY MARKDOWN BLOCK PARSER
  // Parses text block segments into formatted JSX elements
  // ----------------------------------------------------
  const renderMessageContent = (text: string) => {
    if (!text) return <p className="text-zinc-550 italic animate-pulse">Streaming response...</p>;

    // Split text by code blocks
    const parts = text.split("```");
    return parts.map((part, idx) => {
      // If index is odd, it is a code block
      if (idx % 2 === 1) {
        const lines = part.split("\n");
        const lang = lines[0].trim() || "code";
        const codeContent = lines.slice(1).join("\n").trim();

        return (
          <div key={`code-${idx}`} className="my-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-955/80 overflow-hidden shadow-inner font-mono text-[10.5px]">
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-950 text-zinc-550 dark:text-zinc-500 font-semibold select-none text-[9px] uppercase tracking-wider">
              <span>{lang}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeContent)}
                className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            {/* Code Content */}
            <pre className="p-4 overflow-x-auto text-zinc-800 dark:text-zinc-300 leading-relaxed font-mono">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // If index is even, it is normal text, lists, tables, or blockquotes
      const lines = part.split("\n");
      const elements: React.JSX.Element[] = [];
      let inTable = false;
      let tableRows: string[][] = [];

      const flushTable = (key: string) => {
        if (tableRows.length === 0) return null;
        const headers = tableRows[0];
        const body = tableRows.slice(2); // Skip separator row
        inTable = false;
        const rowsToRender = tableRows;
        tableRows = [];

        return (
          <div key={key} className="my-4 overflow-x-auto border border-zinc-200 dark:border-zinc-900 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20 shadow-inner">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-250 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-950/30 text-zinc-800 dark:text-zinc-300 font-semibold h-9">
                  {headers.map((h, i) => (
                    <th key={`th-${i}`} className="p-2.5 pl-4 first:rounded-tl-xl last:rounded-tr-xl font-bold">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
                {body.map((row, rIdx) => (
                  <tr key={`tr-${rIdx}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors h-9">
                    {row.map((cell, cIdx) => (
                      <td key={`td-${cIdx}`} className="p-2.5 pl-4 text-zinc-600 dark:text-zinc-400 font-medium">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };

      lines.forEach((line, lineIdx) => {
        const key = `part-${idx}-line-${lineIdx}`;

        // Table Detection (| cell | cell |)
        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          inTable = true;
          const cells = line.split("|").slice(1, -1);
          tableRows.push(cells);
          
          // If this is the last line, flush the table
          if (lineIdx === lines.length - 1) {
            const tableElem = flushTable(key);
            if (tableElem) elements.push(tableElem);
          }
          return;
        } else if (inTable) {
          // Table ended, flush it
          const tableElem = flushTable(key);
          if (tableElem) elements.push(tableElem);
        }

        // H3 Heading (### text)
        if (line.trim().startsWith("### ")) {
          elements.push(
            <h3 key={key} className="text-sm font-bold text-zinc-850 dark:text-white tracking-tight mt-4 mb-2">
              {line.replace("### ", "").trim()}
            </h3>
          );
          return;
        }

        // H4 Heading (#### text)
        if (line.trim().startsWith("#### ")) {
          elements.push(
            <h4 key={key} className="text-xs font-bold text-zinc-850 dark:text-zinc-200 tracking-tight mt-3 mb-1.5">
              {line.replace("#### ", "").trim()}
            </h4>
          );
          return;
        }

        // Blockquotes (> text)
        if (line.trim().startsWith("> ")) {
          elements.push(
            <blockquote key={key} className="border-l-2 border-violet-500 pl-4 py-0.5 my-3 italic text-zinc-550 dark:text-zinc-400 font-medium">
              {line.replace("> ", "").trim()}
            </blockquote>
          );
          return;
        }

        // Unordered lists (* text or - text)
        if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
          const listText = line.replace(/^[\*\-]\s+/, "");
          
          // Bold inline text parsing (**text**)
          const boldParsedText = parseBoldText(listText);

          elements.push(
            <li key={key} className="list-disc pl-1 ml-5 my-1 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {boldParsedText}
            </li>
          );
          return;
        }

        // Plain paragraph (or inline bold checks)
        if (line.trim() !== "") {
          const boldParsedText = parseBoldText(line);
          elements.push(
            <p key={key} className="my-2.5 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {boldParsedText}
            </p>
          );
        }
      });

      return elements;
    });
  };

  // Helper to parse double asterisks **text** into bold tags
  const parseBoldText = (text: string) => {
    const regex = /\*\*([^*]+)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${match.index}`} className="font-extrabold text-zinc-900 dark:text-white">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="flex items-start space-x-3.5 max-w-3xl mr-auto group select-text">
      
      {/* AI Icon Avatar */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.2)] border border-violet-400/20 text-white flex-shrink-0 mt-0.5 animate-none">
        <BrainCircuit className="w-4.5 h-4.5" />
      </div>

      {/* Message Content Container */}
      <div className="flex-1 space-y-3.5 min-w-0">
        
        {/* Rendered Text Balloon */}
        <div className="text-xs text-zinc-700 dark:text-zinc-300 select-text">
          {renderMessageContent(message.text)}
        </div>

        {/* Source Citation Pill Badges (loaded once completed) */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 select-none">
            {message.citations.map((cite, idx) => (
              <span
                key={cite.id}
                className="inline-flex items-center space-x-1.5 px-2.5 py-0.8 rounded-full border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 text-[9px] font-bold text-violet-650 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/10 cursor-pointer transition-all"
                title={`${cite.title} (${cite.confidence}% Match)`}
              >
                <FileText className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                <span>[{idx + 1}] {cite.title.split("_").join(" ")}</span>
                <span className="text-[8px] font-bold text-violet-500">{cite.confidence}%</span>
              </span>
            ))}
          </div>
        )}

        {/* Bottom Toolbar row: copy, regenerate, likes, timestamps */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1.5 text-[10px] text-zinc-500 dark:text-zinc-550 border-t border-zinc-200 dark:border-zinc-900/60 select-none">
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Copy button */}
            <button
              onClick={handleCopyMessage}
              className="p-1 rounded-md hover:text-zinc-805 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Regenerate button */}
            <button
              onClick={() => onRegenerate(message.id)}
              className="p-1 rounded-md hover:text-zinc-805 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer"
              title="Regenerate response"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Vertical separator */}
            <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-900" />

            {/* Thumbs Up Liked */}
            <button
              onClick={() => setLiked(liked === true ? null : true)}
              className={cn(
                "p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer",
                liked === true ? "text-emerald-600 dark:text-emerald-400" : "hover:text-zinc-800 dark:hover:text-zinc-350"
              )}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            {/* Thumbs Down Disliked */}
            <button
              onClick={() => setLiked(liked === false ? null : false)}
              className={cn(
                "p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer",
                liked === false ? "text-rose-600 dark:text-rose-400" : "hover:text-zinc-800 dark:hover:text-zinc-350"
              )}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timestamp */}
          <span className="font-semibold uppercase tracking-wider block pr-1 text-[9px] text-zinc-400 dark:text-zinc-600">
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
