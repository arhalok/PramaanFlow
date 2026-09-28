"use client";

import React, { useState } from "react";
import { BOTTLENECK_DATA } from "@/lib/regulatory-data";
import {
  AlertOctagon,
  GitBranch,
  Building,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";

export function BottleneckBlastRadius() {
  const [selectedBottleneck, setSelectedBottleneck] = useState(
    BOTTLENECK_DATA.activeDepartmentBottlenecks[0]
  );
  const [investigating, setInvestigating] = useState(false);
  const [mitigated, setMitigated] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                SYSTEMIC BOTTLENECK ENGINE
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Inter-Departmental Blast Radius &amp; Cascade Impact
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bottleneck Intelligence &amp; Dependency Blast Radius
            </h2>
            <p className="text-xs text-slate-600">
              When a single departmental clearance stalls, see the exact cascade of downstream applications, factory licenses, and industrial investments blocked in the pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMitigated(!mitigated)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{mitigated ? "Reset Simulation" : "Simulate Workload Re-Balancing"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Bottlenecks Summary & Visual Blast Radius Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Department Bottlenecks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <span>Active Stalls ({BOTTLENECK_DATA.activeDepartmentBottlenecks.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Click to inspect blast radius</span>
          </div>

          <div className="space-y-3">
            {BOTTLENECK_DATA.activeDepartmentBottlenecks.map((item, idx) => {
              const isSelected = selectedBottleneck.department === item.department;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedBottleneck(item)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "border-rose-300 bg-rose-50/40 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-rose-600 shrink-0" />
                      <h4 className="text-xs font-bold text-slate-900">{item.department}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      +{item.avgDelayDays}d Delay
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {item.rootCause}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Cases Affected: <strong className="text-slate-900 font-semibold">{item.affectedApplications}</strong>
                    </span>
                    <span className="text-rose-700 font-bold">
                      SLA Breach: {item.slaBreachRate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Blast Radius Tree (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span>Cascade Dependency Blast Radius Tree</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Stall Root: <strong className="text-slate-900 font-semibold">{selectedBottleneck.department}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-rose-700 block font-bold">
                {selectedBottleneck.affectedApplications} Downstream Clearances Blocked
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {selectedBottleneck.criticalPathCasesCount} High-Value Critical Path Units
              </span>
            </div>
          </div>

          {/* Visual Blast Radius Tree Graph */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-3">
            {/* Root Node */}
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping"></div>
              <span>ROOT CHOKEPOINT: [ {selectedBottleneck.department} ]</span>
            </div>

            {/* Branch 1 */}
            <div className="pl-6 border-l-2 border-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <span>├── DIRECT STALL:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 shadow-sm">
                  Boiler Plan Approvals &amp; ETP Structural Clearances (143 Units)
                </span>
              </div>

              {/* Sub-branch 1.1 */}
              <div className="pl-6 border-l-2 border-slate-300 space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <span>├── BLOCKS:</span>
                  <span className="text-rose-700 font-semibold">Fire &amp; Emergency Final Hydrant NOC</span>
                  <span className="text-slate-500 font-sans">(Cannot inspect without vetted structural plan)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <span>├── BLOCKS:</span>
                  <span className="text-rose-700 font-semibold">Discom 33kV HT Power Energization</span>
                  <span className="text-slate-500 font-sans">(Requires Electrical Inspector certificate)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <span>└── BLOCKS:</span>
                  <span className="text-rose-800 font-bold">Consent to Operate (CTO - RSPCB)</span>
                  <span className="text-slate-500 font-sans">(Commercial manufacturing blocked)</span>
                </div>
              </div>
            </div>

            {/* Branch 2: Commercial Investment Impact */}
            <div className="pl-6 border-l-2 border-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-teal-800">
                <span>└── CAPITAL AT STAKE:</span>
                <span className="bg-teal-50 text-teal-900 px-2 py-0.5 rounded border border-teal-200 font-bold shadow-sm">
                  ₹2,140 Crores Cumulative Industrial Investment Idle in Pipeline
                </span>
              </div>
            </div>
          </div>

          {/* Targeted Mitigation / Recommendation Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-800 font-semibold">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>Algorithmic Mitigation Recommendation</span>
              </div>
              <p className="text-slate-700 text-[11px] font-medium leading-relaxed">
                {selectedBottleneck.recommendation}
              </p>
            </div>

            <button
              onClick={() => setInvestigating(true)}
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              {investigating ? "Audit Opened" : "Investigate Root Causes"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
