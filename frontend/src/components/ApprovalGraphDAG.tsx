"use client";

import React, { useState } from "react";
import { ApprovalNode } from "@/lib/regulatory-data";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  Shield,
  HelpCircle,
  Filter
} from "lucide-react";

interface ApprovalGraphDAGProps {
  approvals: ApprovalNode[];
  selectedApproval: ApprovalNode | null;
  onSelectApproval: (approval: ApprovalNode) => void;
  onOpenWhy: (approval: ApprovalNode) => void;
}

export function ApprovalGraphDAG({
  approvals,
  selectedApproval,
  onSelectApproval,
  onOpenWhy
}: ApprovalGraphDAGProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  const filteredApprovals = approvals.filter((a) => {
    if (filterRisk === "ALL") return true;
    return a.riskLevel === filterRisk;
  });

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

  const stage1 = approvals.filter((a) => a.dependencies.length === 0);
  const stage2 = approvals.filter((a) => a.dependencies.length > 0 && a.type === "PRE_ESTABLISHMENT");
  const stage3 = approvals.filter((a) => a.type === "PRE_OPERATION" || a.type === "CLEARANCE" || a.type === "INSPECTION");

  return (
    <div className="space-y-4">
      {/* Controls & Legend Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-teal-600" />
            <span>Interactive Approval DAG</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-2.5">
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

        {/* Zoom & Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(80, prev - 10))}
              className="p-1 text-slate-600 hover:text-slate-900"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-700 font-semibold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1 text-slate-600 hover:text-slate-900"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 text-slate-600 hover:text-slate-900 ml-1 border-l border-slate-200 pl-1.5"
              title="Reset Zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Filter className="h-3 w-3 text-slate-500 ml-1" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-[11px] text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* DAG Visualization Workspace */}
      <div className="rounded-2xl p-6 border border-slate-200 overflow-x-auto min-h-[460px] bg-white relative shadow-xs">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0284c7 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div
          className="transition-transform duration-200 origin-top-left flex flex-col md:flex-row items-stretch justify-between gap-8 min-w-[850px] relative z-10"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* COLUMN 1: STAGE 1 - ENTRY MILESTONES */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
                Stage 1: Site &amp; Title Acquisition
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                {stage1.length} Clearances
              </span>
            </div>

            <div className="space-y-4">
              {stage1.map((node) => {
                const isSelected = selectedApproval?.id === node.id;
                const status = getStatusBadge(node.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectApproval(node)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border relative ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/20 shadow-md ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{node.shortCode}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                      {node.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {node.department}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">SLA: {node.slaDays}d</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenWhy(node);
                        }}
                        className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why Required?</span>
                      </button>
                    </div>

                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-teal-600 border-2 border-white shadow"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONNECTOR DIVIDER 1 */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-300 px-2">
            <ArrowRight className="h-6 w-6 text-teal-500/60" />
            <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1 font-mono font-semibold">Unlock</span>
          </div>

          {/* COLUMN 2: STAGE 2 - STATUTORY PRE-ESTABLISHMENT */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
                Stage 2: Pre-Establishment Clearances
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                {stage2.length} Clearances
              </span>
            </div>

            <div className="space-y-4">
              {stage2.map((node) => {
                const isSelected = selectedApproval?.id === node.id;
                const status = getStatusBadge(node.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectApproval(node)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border relative ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/20 shadow-md ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white shadow-xs"
                    }`}
                  >
                    <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white shadow"></div>

                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                      {node.riskLevel === "HIGH" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          HIGH RISK
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                      {node.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {node.department}
                    </p>

                    {node.dependencies.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <span>Requires:</span>
                        <span className="text-slate-800 font-semibold">{node.dependencies.join(", ")}</span>
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">SLA: {node.slaDays}d</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenWhy(node);
                        }}
                        className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why Required?</span>
                      </button>
                    </div>

                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white shadow"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONNECTOR DIVIDER 2 */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-300 px-2">
            <ArrowRight className="h-6 w-6 text-indigo-500/60" />
            <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1 font-mono font-semibold">Prereq</span>
          </div>

          {/* COLUMN 3: STAGE 3 - PRE-OPERATION */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                Stage 3: Pre-Operation &amp; Commissioning
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                {stage3.length} Clearances
              </span>
            </div>

            <div className="space-y-4">
              {stage3.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Unlocks upon completion of CTE &amp; Construction phase
                </div>
              ) : (
                stage3.map((node) => {
                  const isSelected = selectedApproval?.id === node.id;
                  const status = getStatusBadge(node.status);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectApproval(node)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border relative ${
                        isSelected
                          ? "border-teal-500 bg-teal-50/20 shadow-md ring-2 ring-teal-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white shadow-xs"
                      }`}
                    >
                      <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-indigo-600 border-2 border-white shadow"></div>

                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">{node.shortCode}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                        {node.name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {node.department}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">SLA: {node.slaDays}d</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWhy(node);
                          }}
                          className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <HelpCircle className="h-3 w-3" />
                          <span>Why Required?</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
