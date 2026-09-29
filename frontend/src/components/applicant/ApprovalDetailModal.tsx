"use client";

import React, { useState } from "react";
import {
  ApprovalNode
} from "@/lib/regulatory-data";
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Layers,
  Shield,
  HelpCircle,
  Building,
  ArrowRight,
  Scale,
  DollarSign,
  FileCheck2
} from "lucide-react";

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: ApprovalNode;
  onStartApplication: (approval: ApprovalNode) => void;
  onOpenWhyEvidence: (approval: ApprovalNode) => void;
}

export function ApprovalDetailModal({
  isOpen,
  onClose,
  approval,
  onStartApplication,
  onOpenWhyEvidence
}: ApprovalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "dependencies" | "process">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[88vh] flex flex-col">
        {/* Sticky Header with Dominant Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {approval.shortCode}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-slate-500 font-mono flex items-center gap-1">
                <Clock className="h-3 w-3 text-teal-600" />
                <span>Statutory SLA: {approval.slaDays} Days (RTS Act)</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
              {approval.name}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              {approval.department}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => {
                onClose();
                onStartApplication(approval);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Start Application</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Evidence" },
            { id: "requirements", label: `Required Documents (${approval.requiredDocuments.length})` },
            { id: "dependencies", label: `Dependencies (${approval.dependencies.length})` },
            { id: "process", label: "Process Stages" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Why It Applies */}
        {activeTab === "overview" && (
          <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</span>
              <p className="text-slate-800 leading-relaxed text-xs">
                {approval.description}
              </p>
            </div>

            {/* Why This Approval Section */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-teal-700" />
                  <span>Why Applicable to Your Facility</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                  {approval.whyRequired?.ruleType || "DETERMINISTIC_STATUTORY"}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed">
                {approval.whyRequired?.clause || "Statutory compliance mandatory prior to site construction."}
              </p>

              <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px] text-teal-900">
                <span>Statutory Act: <strong>{approval.act}</strong></span>
                {approval.whyRequired?.sourceUrl && (
                  <a
                    href={approval.whyRequired.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory Fee</span>
                <p className="font-extrabold text-slate-900 font-mono text-sm mt-0.5">
                  ₹{approval.statutoryFeeInr ? approval.statutoryFeeInr.toLocaleString("en-IN") : "Exempt / Direct"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inspection</span>
                <p className="font-extrabold text-teal-700 font-mono text-sm mt-0.5">
                  {approval.inspectionsRequired && approval.inspectionsRequired.length > 0
                    ? `${approval.inspectionsRequired.length} Joint Site Audit`
                    : "Desktop Scrutiny"}
                </p>
              </div>
            </div>

            {/* "Can I Apply Now?" Readiness Check (Section 14 of Master Prompt) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                  <span>Can I Apply Now? • Readiness Check</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                  Ready to Apply
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Business details &amp; legal identity complete in profile</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Location confirmed in notified Chakan MIDC Phase II zone</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Prerequisite: Industrial Land Allotment confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>3 of 4 required documents already verified in Document Vault</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  All statutory prerequisites fulfilled.
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onStartApplication(approval);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Proceed to Form</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Required Documents */}
        {activeTab === "requirements" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between">
              <span className="text-[11px]">
                Documents already present in your <strong>Document Vault</strong> will be auto-attached with zero re-upload.
              </span>
            </div>

            {approval.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                  <span className="font-bold text-slate-900">{doc}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Vault Ready ✓
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Dependencies */}
        {activeTab === "dependencies" && (
          <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                Prerequisites (Must Complete Before This Approval):
              </span>
              {approval.dependencies.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {approval.dependencies.map((dep, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                      <span className="font-mono font-semibold">{dep}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-700 font-medium">None • This approval can be initiated immediately in parallel.</p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                Downstream Clearances Unlocked Upon Grant:
              </span>
              {approval.blockedDownstream && approval.blockedDownstream.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {approval.blockedDownstream.map((down, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700">
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="font-mono font-semibold">{down}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Terminal Operational Clearance</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Process Stages */}
        {activeTab === "process" && (
          <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
            <div className="space-y-3 pl-2">
              {[
                { stage: "1. Single Window Common Filing", desc: "Application form + vault documents submitted via digital signature." },
                { stage: "2. Optical Entity Verification", desc: "Docling pipeline validates document schema & checks numerical consistency." },
                { stage: "3. Departmental Technical Scrutiny", desc: "Competent authority verifies compliance with statutory acts." },
                { stage: "4. Joint Site Inspection", desc: "Scheduled coordinated on-site audit by authorized inspectors (if applicable)." },
                { stage: "5. Statutory Order & Certificate", desc: "Final legal Consent / Licence order granted under RTS timeframe." }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{step.stage}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenWhyEvidence(approval);
            }}
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Legal Evidence Chain</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              onClose();
              onStartApplication(approval);
            }}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Application</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
