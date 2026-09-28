"use client";

import React, { useState, useEffect } from "react";
import { BOTTLENECK_DATA } from "@/lib/regulatory-data";
import {
  AlertCircle,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Building,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Activity,
  GitBranch,
  FileDiff,
  Building2,
  Layers
} from "lucide-react";
import { ProcessXRay } from "@/components/ProcessXRay";
import { BottleneckBlastRadius } from "@/components/BottleneckBlastRadius";
import { RegulatoryChangeCenter } from "@/components/RegulatoryChangeCenter";
import { Organization360View } from "@/components/Organization360View";

interface GovernmentCommandProps {
  externalSubTab?: string;
  onNavigateToImpactMap?: () => void;
}

export function GovernmentCommand({
  externalSubTab,
  onNavigateToImpactMap
}: GovernmentCommandProps) {
  const [selectedBottleneck, setSelectedBottleneck] = useState(
    BOTTLENECK_DATA.activeDepartmentBottlenecks[0]
  );
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "process-xray" | "bottlenecks" | "regulatory-diff" | "org-360"
  >("overview");

  // Sync external sub-tab commands from Judge Demo Stepper
  useEffect(() => {
    if (!externalSubTab) return;
    if (externalSubTab === "process-xray") {
      setActiveSubTab("process-xray");
    } else if (externalSubTab === "bottlenecks") {
      setActiveSubTab("bottlenecks");
    } else if (externalSubTab === "regulatory-diff") {
      setActiveSubTab("regulatory-diff");
    } else if (externalSubTab === "org-360") {
      setActiveSubTab("org-360");
    } else if (externalSubTab === "overview") {
      setActiveSubTab("overview");
    }
  }, [externalSubTab]);

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                STATE LEVEL REGULATORY COMMAND &amp; SLA MONITOR
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Live Single Window Sync (Raj Nivesh)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Government Regulatory Command Center
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Cross-departmental coordination, process mining discovery, systemic bottleneck blast radius &amp; gazette diff.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Total Active Cases</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {BOTTLENECK_DATA.slaBreakdown.totalActive}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Within SLA</span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">
                {BOTTLENECK_DATA.slaBreakdown.withinSla} (78.5%)
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Near Breach (&lt;5d)</span>
              <p className="text-base font-bold text-amber-800 mt-0.5">
                {BOTTLENECK_DATA.slaBreakdown.nearBreach}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">SLA Breached</span>
              <p className="text-base font-bold text-rose-700 mt-0.5">
                {BOTTLENECK_DATA.slaBreakdown.breached}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tabs for Government Command */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "overview"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Operational Radar</span>
          </button>

          <button
            onClick={() => setActiveSubTab("process-xray")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "process-xray"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Process Mining X-Ray</span>
          </button>

          <button
            onClick={() => setActiveSubTab("bottlenecks")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "bottlenecks"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>Bottleneck Blast Radius</span>
          </button>

          <button
            onClick={() => setActiveSubTab("regulatory-diff")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "regulatory-diff"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileDiff className="h-3.5 w-3.5" />
            <span>Gazette Diff &amp; Impact</span>
          </button>

          <button
            onClick={() => setActiveSubTab("org-360")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "org-360"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Organization 360</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OPERATIONAL RADAR */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Department Bottleneck Radar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Systemic Departmental Bottlenecks</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">Identified via Process Mining</span>
            </div>

            <div className="space-y-3">
              {BOTTLENECK_DATA.activeDepartmentBottlenecks.map((b, idx) => {
                const isSelected = selectedBottleneck.department === b.department;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedBottleneck(b)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/40 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-teal-600" />
                          <h3 className="font-semibold text-slate-900 text-sm">{b.department}</h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {b.rootCause}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-rose-700 block font-mono">
                          +{b.avgDelayDays} Days Delay
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {b.affectedApplications} Cases Affected
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-amber-800 font-semibold">
                        SLA Breach Rate: {b.slaBreachRate}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSubTab("bottlenecks");
                        }}
                        className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                      >
                        <span>View Blast Radius</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Critical Path Application Monitor */}
            <div className="rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-3 mt-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Critical Path Inter-Departmental Queue
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="pb-2">Application ID</th>
                      <th className="pb-2">Enterprise</th>
                      <th className="pb-2">Stalled Clearance</th>
                      <th className="pb-2">Holding Dept</th>
                      <th className="pb-2 text-right">Escalation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900">#RAJ-2026-0849</td>
                      <td className="py-2.5 font-sans font-medium text-slate-900">Apex Bio-Pharmaceuticals</td>
                      <td className="py-2.5 text-teal-700 font-sans font-medium">Boiler &amp; Pressure Vessel Drawing</td>
                      <td className="py-2.5 text-amber-800 font-sans font-medium">Factories &amp; Boilers</td>
                      <td className="py-2.5 text-right font-sans">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          Urgent SLA Risk
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900">#RAJ-2026-0612</td>
                      <td className="py-2.5 font-sans font-medium text-slate-900">Marwar Bulk Synthetics</td>
                      <td className="py-2.5 text-teal-700 font-sans font-medium">Category B2 EIA Clarification</td>
                      <td className="py-2.5 text-amber-800 font-sans font-medium">SEIAA Rajasthan</td>
                      <td className="py-2.5 text-right font-sans">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                          Near Breach
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Operational Insights */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>Executive Alert</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Boiler inspection cadre deficit in Jaipur South region is causing a <strong className="text-slate-900">19.4-day average delay</strong>, affecting ₹2,140 Crores of industrial capital projects.
              </p>

              <button
                onClick={() => setActiveSubTab("bottlenecks")}
                className="w-full mt-2 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all text-center"
              >
                Inspect Chokepoints &amp; Blast Radius
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PROCESS MINING X-RAY */}
      {activeSubTab === "process-xray" && <ProcessXRay />}

      {/* VIEW 3: BOTTLENECK BLAST RADIUS */}
      {activeSubTab === "bottlenecks" && <BottleneckBlastRadius />}

      {/* VIEW 4: REGULATORY CHANGE CENTER */}
      {activeSubTab === "regulatory-diff" && (
        <RegulatoryChangeCenter onShowOnMap={onNavigateToImpactMap} />
      )}

      {/* VIEW 5: ORGANIZATION 360 */}
      {activeSubTab === "org-360" && <Organization360View />}
    </div>
  );
}
