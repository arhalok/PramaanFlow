"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Layers,
  Compass,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICopilotModal({ isOpen, onClose }: AICopilotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      content: `### Welcome to Regulatory Copilot
I am your AI Orchestrator powered by **Vercel AI SDK** and **Google Gemini**.

I can assist you with:
- **Discovering required NOCs & statutory dependencies**
- **Triggering VROOM inspection route optimization**
- **Evaluating Process Mining bottleneck radar**
- **Computing GIS Regulatory Site Fingerprints**

Ask a question or select one of the suggested prompts below.`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textContent = JSON.parse(line.substring(2));
              assistantText += textContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, content: assistantText } : m
                )
              );
            } catch (_e) {
              // fallback raw parse
            }
          } else if (line.trim() && !line.startsWith('d:') && !line.startsWith('e:')) {
            assistantText += line;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId ? { ...m, content: assistantText } : m
              )
            );
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `⚠️ Failed to fetch response: ${err.message || "Network issue"}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: "Approvals for Bio-Pharma Unit",
      icon: Layers,
      query: "Which statutory approvals and NOCs are required for my Bio-Pharmaceuticals project?"
    },
    {
      label: "Optimize Inspections (VROOM)",
      icon: Compass,
      query: "Optimize today's field inspection route using VROOM engine and calculate distance savings."
    },
    {
      label: "Department Bottleneck Radar",
      icon: AlertCircle,
      query: "Show me active process bottlenecks and applications at risk of statutory SLA breach."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[650px] bg-white border border-slate-200 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Regulatory Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                  Vercel AI SDK + Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Statutory Reasoning, Dependency Analysis &amp; Routing Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${m.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${m.role === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none"
                  }`}
              >
                <div className="prose prose-xs max-w-none space-y-2 whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
                <span>Regulatory Copilot is evaluating rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((qp, i) => {
            const Icon = qp.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(qp.query)}
                disabled={loading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-[11px] whitespace-nowrap transition-colors shadow-sm font-medium"
              >
                <Icon className="h-3 w-3 text-teal-600" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about regulations, VROOM routes, or SLA delays..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
