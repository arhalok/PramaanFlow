"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ProjectProfile,
  ResolvedLocation,
  RegulatoryRoadmap
} from "@/lib/project-state";
import { ApprovalNode } from "@/lib/regulatory-data";
import { ContextDrawer } from "@/components/ContextDrawer";
import {
  Layers,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building2,
  ExternalLink,
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ChevronRight,
  Scale
} from "lucide-react";

interface Step5CommandCenterProps {
  profile: ProjectProfile;
  location: ResolvedLocation;
  roadmap: RegulatoryRoadmap;
  onRestart?: () => void;
}

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  referencedApprovalId?: string;
  verifiedSourceUrl?: string;
}

export function Step5CommandCenter({
  profile,
  location,
  roadmap,
  onRestart
}: Step5CommandCenterProps) {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalNode>(
    roadmap.approvals[1] || roadmap.approvals[0]
  );
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(
    selectedApproval?.id || null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  // Connected AI Assistant State
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      content: `### Welcome to your Regulatory Roadmap
Based on the verified regulatory rules for **${profile.sector}** at **${location.displayAddress}**, I've resolved **${roadmap.summaryMetrics.totalApprovals} applicable clearances** across **${roadmap.summaryMetrics.departmentsInvolvedCount} authorities**.

You can click any node in the dependency graph on the left, or ask me questions about prerequisites, documents, or legal citations.`,
      referencedApprovalId: selectedApproval?.id,
      verifiedSourceUrl: selectedApproval?.whyRequired?.sourceUrl
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAssistantStreaming, setIsAssistantStreaming] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAssistantStreaming]);

  // Handle clicking on a DAG node
  const handleNodeClick = (node: ApprovalNode) => {
    setSelectedApproval(node);
    setHighlightedNodeId(node.id);
  };

  const handleOpenWhyDrawer = (node: ApprovalNode) => {
    setSelectedApproval(node);
    setHighlightedNodeId(node.id);
    setIsDrawerOpen(true);
  };

  // Connected AI Query Sender
  const handleSendQuery = async (queryText?: string) => {
    const text = queryText || chatInput;
    if (!text.trim() || isAssistantStreaming) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsAssistantStreaming(true);

    try {
      const response = await fetch("/api/applicant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          })),
          projectProfile: profile,
          locationContext: location,
          currentApprovalId: selectedApproval?.id
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantMsgId = `ai-${Date.now()}`;

      setChatMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          referencedApprovalId: selectedApproval?.id,
          verifiedSourceUrl: selectedApproval?.whyRequired?.sourceUrl
        }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const textContent = JSON.parse(line.substring(2));
              assistantText += textContent;
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: assistantText } : m
                )
              );
            } catch (_e) { }
          } else if (line.trim() && !line.startsWith("d:") && !line.startsWith("e:")) {
            assistantText += line;
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: assistantText } : m
              )
            );
          }
        }
      }

      // Check if the response references a specific node to highlight
      roadmap.approvals.forEach((a) => {
        if (
          assistantText.includes(a.name) ||
          assistantText.includes(a.shortCode) ||
          assistantText.includes(a.id)
        ) {
          setHighlightedNodeId(a.id);
        }
      });
    } catch (err) {
      console.error("AI response stream error:", err);
    } finally {
      setIsAssistantStreaming(false);
    }
  };

  // Group approvals into 3 functional stages
  const stage1 = roadmap.approvals.filter((a) => a.dependencies.length === 0);
  const stage2 = roadmap.approvals.filter((a) => a.dependencies.length > 0 && a.type === "PRE_ESTABLISHMENT");
  const stage3 = roadmap.approvals.filter((a) => a.type === "PRE_OPERATION" || a.type === "CLEARANCE");

  const getStatusBadge = (status: ApprovalNode["status"]) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "APPROVED",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2
        };
      case "IN_REVIEW":
        return {
          label: "IN SCRUTINY",
          className: "bg-teal-50 text-teal-700 border-teal-200",
          icon: Clock
        };
      case "ACTION_REQUIRED":
        return {
          label: "ACTION REQ",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertTriangle
        };
      case "BLOCKED":
        return {
          label: "BLOCKED",
          className: "bg-rose-50 text-rose-700 border-rose-200",
          icon: AlertTriangle
        };
      default:
        return {
          label: "PENDING",
          className: "bg-slate-100 text-slate-600 border-slate-200",
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Concise Project-Level Summary Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                REGULATORY ROADMAP
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Sector: {profile.sector}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Single Window Aligned
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {profile.name || `${profile.capacity || 100} ${profile.capacityUnit || "TPD"} ${profile.subSector}`}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>{location.displayAddress}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>Capital Outlay: <strong className="text-slate-800">₹{profile.investmentCrores || 145} Cr</strong></span>
              <span className="text-slate-300">•</span>
              <span>Capacity: <strong className="text-slate-800">{profile.capacity || 100} {profile.capacityUnit || "TPD"}</strong></span>
            </div>
          </div>

          {/* Quick Metrics Cards (Dynamic Values) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Applicable Approvals</span>
              <p className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                {roadmap.summaryMetrics.totalApprovals}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Critical Deps</span>
              <p className="text-base font-bold text-rose-600 mt-0.5 font-mono">
                {roadmap.summaryMetrics.criticalDependenciesCount}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Documents Req.</span>
              <p className="text-base font-bold text-teal-700 mt-0.5 font-mono">
                {roadmap.summaryMetrics.totalDocumentsRequired}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Authorities</span>
              <p className="text-base font-bold text-indigo-700 mt-0.5 font-mono">
                {roadmap.summaryMetrics.departmentsInvolvedCount}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Pending Actions</span>
              <p className="text-base font-bold text-amber-700 mt-0.5 font-mono">
                {roadmap.summaryMetrics.pendingActionsCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Layout: DAG (Left/Center) + Connected AI Assistant (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Column: APPROVAL DEPENDENCY DAG (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* DAG Toolbar */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-600" />
                <span>Approval Dependency DAG</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Approved
                </span>
                <span className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span> In Scrutiny
                </span>
                <span className="flex items-center gap-1 text-[11px] text-rose-700 font-medium">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span> Blocked
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[11px] font-mono px-2 text-slate-700 font-semibold">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 text-slate-600 hover:text-slate-900 ml-1 border-l border-slate-200 pl-1.5 cursor-pointer"
                  title="Reset Zoom"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {onRestart && (
                <button
                  onClick={onRestart}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Re-Plan</span>
                </button>
              )}
            </div>
          </div>

          {/* DAG Canvas */}
          <div className="rounded-2xl p-5 border border-slate-200 overflow-x-auto min-h-[480px] bg-white relative shadow-xs">
            <div
              className="transition-transform duration-200 origin-top-left flex flex-col md:flex-row items-stretch justify-between gap-6 min-w-[760px] relative z-10"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* STAGE 1 */}
              <div className="flex-1 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
                    Stage 1: Site &amp; Title
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                    {stage1.length} Nodes
                  </span>
                </div>

                <div className="space-y-3">
                  {stage1.map((node) => renderDAGNode(node))}
                </div>
              </div>

              {/* CONNECTOR 1 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-300 px-1">
                <ArrowRight className="h-5 w-5 text-teal-500/70" />
                <span className="text-[8px] uppercase tracking-widest text-slate-400 mt-1 font-mono font-bold">Unlocks</span>
              </div>

              {/* STAGE 2 */}
              <div className="flex-1 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
                    Stage 2: Pre-Establishment
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                    {stage2.length} Nodes
                  </span>
                </div>

                <div className="space-y-3">
                  {stage2.map((node) => renderDAGNode(node))}
                </div>
              </div>

              {/* CONNECTOR 2 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-300 px-1">
                <ArrowRight className="h-5 w-5 text-indigo-500/70" />
                <span className="text-[8px] uppercase tracking-widest text-slate-400 mt-1 font-mono font-bold">Prereq</span>
              </div>

              {/* STAGE 3 */}
              <div className="flex-1 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                    Stage 3: Pre-Operation
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                    {stage3.length} Nodes
                  </span>
                </div>

                <div className="space-y-3">
                  {stage3.map((node) => renderDAGNode(node))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI REGULATORY ASSISTANT (Connected to DAG) (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px] overflow-hidden">
          {/* Assistant Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">AI Regulatory Assistant</h3>
                <p className="text-[10px] text-slate-500">Connected directly to active DAG</p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              Ground Truth Aligned
            </span>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendQuery(`Why do I need ${selectedApproval?.name}?`)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 shrink-0 font-medium transition-colors cursor-pointer"
            >
              Why do I need this?
            </button>
            <button
              onClick={() => handleSendQuery(`What comes before ${selectedApproval?.name}?`)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 shrink-0 font-medium transition-colors cursor-pointer"
            >
              What comes before this?
            </button>
            <button
              onClick={() => handleSendQuery("What documents should I prepare first?")}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 shrink-0 font-medium transition-colors cursor-pointer"
            >
              Required documents
            </button>
            <button
              onClick={() => handleSendQuery("Who handles these approvals?")}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 shrink-0 font-medium transition-colors cursor-pointer"
            >
              Who handles this?
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`space-y-1.5 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[92%] ${msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-xs text-left"
                      : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60 text-left"
                    }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatAssistantMarkdown(msg.content)
                    }}
                  />
                </div>

                {/* Verified Source Citation Card */}
                {msg.role === "assistant" && msg.verifiedSourceUrl && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pl-1 pt-0.5">
                    <span className="font-semibold text-slate-600">OFFICIAL SOURCE:</span>
                    <a
                      href={msg.verifiedSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Department Portal</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}

            {isAssistantStreaming && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-spin" />
                <span>Consulting verified statutory knowledge base...</span>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Assistant Chat Input */}
          <div className="p-2.5 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                placeholder="Ask about approvals, dependencies, documents..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={!chatInput.trim() || isAssistantStreaming}
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Evidence Drawer (Opens when user inspects a node) */}
      <ContextDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        approval={selectedApproval}
        onOpenCopilotWithContext={(query) => {
          setIsDrawerOpen(false);
          handleSendQuery(query);
        }}
      />
    </div>
  );

  // Helper to render an interactive node on the DAG
  function renderDAGNode(node: ApprovalNode) {
    const isSelected = selectedApproval?.id === node.id;
    const isHighlighted = highlightedNodeId === node.id;
    const status = getStatusBadge(node.status);
    const StatusIcon = status.icon;

    return (
      <div
        key={node.id}
        onClick={() => handleNodeClick(node)}
        className={`p-3.5 rounded-xl cursor-pointer transition-all border relative ${isHighlighted
            ? "border-teal-500 bg-teal-50/25 shadow-md ring-2 ring-teal-500/30 scale-[1.01]"
            : isSelected
              ? "border-teal-400 bg-teal-50/10 shadow-sm"
              : "border-slate-200 hover:border-slate-300 bg-white shadow-2xs"
          }`}
      >
        <div className="flex items-start justify-between gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">{node.shortCode}</span>
        </div>

        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-2 leading-snug">
          {node.name}
        </h4>

        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
          {node.department}
        </p>

        {node.dependencies.length > 0 && (
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span>Requires:</span>
            <span className="text-slate-800 font-semibold">{node.dependencies.join(", ")}</span>
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">SLA: {node.slaDays}d</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenWhyDrawer(node);
            }}
            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-0.5 text-[11px] cursor-pointer"
          >
            <HelpCircle className="h-3 w-3" />
            <span>Why Required?</span>
          </button>
        </div>
      </div>
    );
  }
}

function formatAssistantMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, "<strong class='block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1'>$1</strong>")
    .replace(/^#### (.*$)/gim, "<strong class='block text-[11px] font-semibold text-slate-800 mt-1 mb-0.5'>$1</strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='px-1 py-0.2 bg-slate-200/80 rounded font-mono text-[10px]'>$1</code>")
    .replace(/^\> (.*$)/gim, "<blockquote class='border-l-2 border-teal-500 pl-2 my-1 text-slate-600 italic text-[11px]'>$1</blockquote>")
    .replace(/\n/g, "<br/>");
}
