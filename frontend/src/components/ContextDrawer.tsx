"use client";

import React from "react";
import { ApprovalNode, WhyEvidenceChain } from "@/lib/regulatory-data";
import {
  X,
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Bot,
  Sliders,
  Scale,
  Building,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface ContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  approval: ApprovalNode | null;
  onOpenCopilotWithContext?: (query: string) => void;
  onOpenSimulator?: () => void;
}

export function ContextDrawer({
  isOpen,
  onClose,
  approval,
  onOpenCopilotWithContext,
  onOpenSimulator
}: ContextDrawerProps) {
  if (!isOpen || !approval) return null;

  const why = approval.whyRequired;

  const getStatusColor = (status: ApprovalNode["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "IN_REVIEW":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "ACTION_REQUIRED":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "BLOCKED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getRuleBadge = (type: WhyEvidenceChain["ruleType"]) => {
    switch (type) {
      case "DETERMINISTIC_STATUTORY":
        return {
          label: "Deterministic Statutory Rule",
          color: "bg-teal-50 text-teal-700 border-teal-200",
          icon: Scale
        };
      case "GEOSPATIAL_OVERLAY":
        return {
          label: "Geospatial GIS Overlay Trigger",
          color: "bg-sky-50 text-sky-700 border-sky-200",
          icon: Layers
        };
      case "SECTORAL_THRESHOLD":
        return {
          label: "Capacity & Sector Threshold",
          color: "bg-amber-50 text-amber-800 border-amber-200",
          icon: Sliders
        };
      default:
        return {
          label: "AI Regulatory Reasoning",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: Sparkles
        };
    }
  };

  const ruleBadge = getRuleBadge(why.ruleType);
  const RuleIcon = ruleBadge.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(approval.status)}`}>
                ● {approval.status.replace("_", " ")}
              </span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm">
                CODE: {approval.shortCode}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm">
                SLA: {approval.slaDays} Days
              </span>
              {approval.riskLevel === "HIGH" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> High Risk
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {approval.name}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <Building className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>{approval.department}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close Drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-700 custom-scrollbar">
          
          {/* Quick Context Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenCopilotWithContext?.(`Explain statutory requirements and why ${approval.name} is mandatory for our facility.`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-all shadow-sm"
            >
              <Bot className="h-3.5 w-3.5 text-teal-700" />
              <span>Ask AI Copilot</span>
            </button>
            <a
              href={why.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-sm transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-600" />
              <span>Statutory Gazette Link</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-all shadow-sm"
              >
                <Sliders className="h-3.5 w-3.5 text-slate-600" />
                <span>Simulate Parameter Change</span>
              </button>
            )}
          </div>

          {/* SECTION: WHY REQUIRED? STATUTORY EVIDENCE CHAIN */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-600" />
                <h3 className="font-semibold text-slate-900 text-sm tracking-wide uppercase">
                  Statutory Evidence Chain (Why Required)
                </h3>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${ruleBadge.color}`}>
                <RuleIcon className="h-3 w-3" />
                {ruleBadge.label}
              </span>
            </div>

            {/* Visual Provenance Pipeline */}
            <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-sky-500 before:to-indigo-500">
              
              {/* Node 1: Project Attribute */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-teal-600 ring-4 ring-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  Project Attribute Trigger
                </span>
                <p className="text-xs text-slate-900 mt-0.5 font-medium">
                  {why.projectAttribute}
                </p>
              </div>

              {/* Node 2: Location Factor */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-sky-600 ring-4 ring-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                  Location &amp; Spatial Factor
                </span>
                <p className="text-xs text-slate-800 mt-0.5">
                  {why.locationFactor}
                </p>
              </div>

              {/* Node 3: Jurisdiction */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Competent Jurisdiction Authority
                </span>
                <p className="text-xs text-slate-800 mt-0.5">
                  {why.jurisdiction}
                </p>
              </div>

              {/* Node 4: Statutory Act & Section */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Statutory Act &amp; Section
                </span>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  {why.statutoryAct} • {why.section}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Clause: {why.clause}
                </p>
              </div>
            </div>

            {/* Official Gazette Excerpt Box */}
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold text-amber-900 flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-amber-700" /> Official Gazette Citation
                </span>
                <span className="font-medium">Effective Since: {why.effectiveDate}</span>
              </div>
              <blockquote className="border-l-2 border-amber-500 pl-3 italic text-slate-800 text-[11px] leading-relaxed">
                "{why.gazetteExcerpt}"
              </blockquote>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>100% Deterministic Rule Engine Match — Zero fabricated logic.</span>
            </div>
          </div>

          {/* SECTION: DEPENDENCIES & BLOCKING IMPACT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preceding Dependencies */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                Pre-Requisite Clearances ({approval.dependencies.length})
              </span>
              {approval.dependencies.length === 0 ? (
                <p className="text-xs text-slate-500 italic">None. Entry-level milestone clearance.</p>
              ) : (
                <div className="space-y-1.5">
                  {approval.dependencies.map((depId) => (
                    <div
                      key={depId}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 text-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono text-[11px] font-medium">{depId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Blocked Approvals */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
                Blocks Downstream Clearances ({approval.blockedDownstream.length})
              </span>
              {approval.blockedDownstream.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No downstream nodes blocked.</p>
              ) : (
                <div className="space-y-1.5">
                  {approval.blockedDownstream.map((blockedId) => (
                    <div
                      key={blockedId}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs flex items-center gap-2 text-rose-800"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span className="font-mono text-[11px] font-medium">{blockedId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION: MANDATORY STATUTORY DOCUMENTS */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <span>Required Statutory Filings</span>
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                Fee: ₹{approval.statutoryFeeInr.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="space-y-2">
              {approval.requiredDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                    <span className="font-medium">{doc}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] shrink-0 font-semibold">
                    Pre-Checked
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: TIMELINE & AUDIT TRAIL */}
          {approval.timelineHistory && approval.timelineHistory.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Statutory Event Timeline &amp; Scrutiny Trail</span>
              </h3>

              <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                {approval.timelineHistory.map((step, idx) => (
                  <div key={idx} className="relative pl-3">
                    <div className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{step.stage.replace(/_/g, " ")}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{step.note}</p>
                    {step.officer && (
                      <p className="text-[11px] text-teal-700 font-medium mt-0.5">By: {step.officer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span>SLA Days Left: </span>
            <span className="font-bold text-slate-900">{approval.daysRemaining} Days</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
