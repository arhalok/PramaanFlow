"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  FileText,
  Shield,
  HelpCircle,
  Building,
  MapPin,
  Scale
} from "lucide-react";
import { ProjectTwin, ApprovalNode } from "@/lib/regulatory-data";

interface ContextualCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTwin;
  currentTab: string;
  initialQuery?: string;
  onNavigateTab: (tab: string, approvalId?: string) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actionButton?: {
    label: string;
    tab: string;
    approvalId?: string;
  };
  citation?: {
    act: string;
    sourceUrl: string;
  };
}

export function ContextualCopilotDrawer({
  isOpen,
  onClose,
  project,
  currentTab,
  initialQuery,
  onNavigateTab
}: ContextualCopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your **PramaanFlow Statutory Copilot**.\n\nI have loaded your active project context: **${project.name}** located in **${project.district}, Maharashtra** (Fixed Capital: ₹${project.investmentCrores} Cr).\n\nHow can I assist you with your regulatory approvals, statutory citations, or document requirements today?`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleUserQuery(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Contextual intelligent responses grounded in Maharashtra regulatory statutes
    setTimeout(() => {
      let botResponse: Message;

      const lower = queryText.toLowerCase();

      if (lower.includes("why") && (lower.includes("cte") || lower.includes("consent"))) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Consent to Establish (CTE)** is mandatory for your API bulk drug manufacturing unit under **Section 25 of the Water Act 1974** and **Section 21 of the Air Act 1981**.\n\nBecause your facility discharges trade effluent (approx. 65 KLD) and operates power-driven synthesis reactors, Maharashtra Pollution Control Board (MPCB SRO Pimpri-Chinchwad) must approve your Zero Liquid Discharge (ZLD) mass balance prior to civil construction.`,
          citation: {
            act: "The Water (Prevention & Control of Pollution) Act 1974 Sec 25",
            sourceUrl: "https://mpcb.gov.in"
          },
          actionButton: {
            label: "Open Consent to Establish (CTE) Details",
            tab: "discover",
            approvalId: "cte-mpcb"
          }
        };
      } else if (lower.includes("what am i missing") || lower.includes("action") || lower.includes("clarification")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Tool Result: application_get_action_required**\n\nYour application **APP-MPCB-CTE-2026-0812** has **1 Urgent Clarification Requested** by Er. S. N. Patil (MPCB SRO Pimpri-Chinchwad):\n\n• **Issue:** Discrepancy between Form 1 base capacity (100 TPD) and EIA annexure maximum peak envelope (150 TPD).\n• **Statutory SLA Clock:** 5 Days remaining to respond under Maharashtra RTS Act 2015.\n\nResponding promptly unfreezes departmental review.`,
          actionButton: {
            label: "Respond to Departmental Query",
            tab: "applications",
            approvalId: "cte-mpcb"
          }
        };
      } else if (lower.includes("inspection") || lower.includes("slot") || lower.includes("audit")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Tool Result: inspection_get_available_slots**\n\nConsolidated Joint Site Audit slots for **Chakan MIDC Phase II**:\n\n1. **03 Oct 2026** (10:00 AM – 01:00 PM) • Lead: Er. A. R. Kulkarni\n2. **04 Oct 2026** (02:00 PM – 05:00 PM) • MPCB Inspector Er. S. N. Patil\n3. **06 Oct 2026** (10:00 AM – 01:00 PM) • DISH Inspector Er. P. M. Shinde\n\nBoth agencies participate simultaneously to prevent repeat site visits.`,
          actionButton: {
            label: "Select Inspection Window",
            tab: "applications",
            approvalId: "cte-mpcb"
          }
        };
      } else if (lower.includes("appeal") || lower.includes("grievance") || lower.includes("rts")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Tool Result: grievance_get_eligibility**\n\nYour application is eligible for **First Appeal under Maharashtra Right to Public Services Act 2015 (Sections 18–19)**:\n\n• **Appellate Authority:** Office of the District Collector & District Magistrate, Pune\n• **Grounds:** Unjustified departmental query loop & delay beyond notified 45-day statutory SLA.\n• **Statutory Requirement:** Hearing notice issued within 15 days of filing.`,
          citation: {
            act: "Maharashtra Right to Public Services Act 2015 Sec 18",
            sourceUrl: "https://aaplesarkar.mahaonline.gov.in"
          },
          actionButton: {
            label: "Lodge Formal RTS Appeal",
            tab: "applications"
          }
        };
      } else if (lower.includes("fire") || lower.includes("noc")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Provisional Fire Safety NOC** is required under the **Maharashtra Fire Prevention and Life Safety Measures Act 2006 (Section 3)**.\n\nYour API bulk manufacturing plant involves hazardous solvents with built-up area exceeding 10,000 sq.m., triggering mandatory 12m peripheral fire tender driveway access and a 200,000-liter dedicated static water reservoir.`,
          citation: {
            act: "Maharashtra Fire Prevention and Life Safety Act 2006",
            sourceUrl: "https://mahafireservice.gov.in"
          },
          actionButton: {
            label: "Inspect Fire Safety Requirements",
            tab: "discover",
            approvalId: "fire-noc"
          }
        };
      } else if (lower.includes("doc") || lower.includes("missing")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Tool Result: document_search & document_find_reusable**\n\nChecking your **Docling Document Vault**:\n\n• **MIDC Lease Deed**: Verified ✓ (Plot 44-B, 12.4 Acres - Auto-Reused in 4 Clearances)\n• **Factory Machine Layout**: Verified ✓ (Arch Reg COA/2014/58291)\n• **EIA Summary**: Flagged for 100 TPD vs 150 TPD discrepancy ⚠️\n• **Water Mass Balance Schedule**: Missing from vault ❌\n\nYou need to upload or attach the certified water mass balance schedule to proceed with your CTE application.`,
          actionButton: {
            label: "Open Document Vault",
            tab: "documents"
          }
        };
      } else if (lower.includes("incentive") || lower.includes("scheme") || lower.includes("psi")) {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `**Tool Result: knowledge_answer_with_sources**\n\nUnder the **Maharashtra Package Scheme of Incentives (PSI 2019)**, your facility in **Khed Taluka (Group C)** qualifies for:\n\n1. **100% Stamp Duty Waiver** on MIDC land lease (Approx. ₹1.45 Cr direct tax saving)\n2. **Electricity Duty Exemption** for 7 consecutive years (Approx. ₹68 Lakhs/yr)\n3. **Industrial Promotion Subsidy** up to 50% of eligible fixed capital investment.\n\nThese benefits can be claimed directly through your Single Window docket without duplicate filing.`,
          citation: {
            act: "Maharashtra Industries Department GR No. PSI-2019/CR-14/Ind-2",
            sourceUrl: "https://industry.maharashtra.gov.in"
          },
          actionButton: {
            label: "View Eligible Incentive Packages",
            tab: "discover"
          }
        };
      } else {
        botResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: `Based on **PramaanFlow Regulatory Intelligence** for **${project.name}**:\n\n• Location: **Chakan MIDC Phase II, Khed Taluka, Pune**\n• Clearances Needed: **8 Clearances across 5 Departments**\n• Critical Path: MIDC Land Allotment → MPCB CTE → Fire NOC → DISH Factory Licence.\n\nWhat specific clearance or legal statute would you like to examine?`,
          actionButton: {
            label: "Explore Approval Roadmap",
            tab: "discover"
          }
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Contextual Regulatory Copilot</h3>
            <p className="text-[10px] text-teal-700 font-medium">Grounded in Maharashtra Statutory Codes</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Context Badge */}
      <div className="px-4 py-2 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1 truncate max-w-[260px]">
          <Building className="h-3 w-3 text-teal-600 shrink-0" />
          <span className="truncate">{project.name}</span>
        </span>
        <span className="text-teal-800 font-mono font-bold shrink-0">
          Tab: {currentTab.toUpperCase()}
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {[
          "Why do I need Consent to Establish?",
          "What documents are missing?",
          "Explain Maharashtra PSI 2019",
          "Why is Fire NOC required?"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleUserQuery(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 shrink-0 font-medium transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[90%] ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-xs text-left"
                  : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 text-left"
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Action Button */}
              {msg.actionButton && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      onNavigateTab(msg.actionButton!.tab, msg.actionButton!.approvalId);
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>{msg.actionButton.label}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Legal Citation Card */}
              {msg.citation && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                    {msg.citation.act}
                  </span>
                  <a
                    href={msg.citation.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>Official Gazette</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-spin" />
            <span>Consulting Maharashtra regulatory statutes...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserQuery(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about clearances, statutes, documents..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
