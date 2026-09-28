"use client";

import React, { useState } from "react";
import { PROCESS_XRAY_STEPS, ProcessMiningStep } from "@/lib/regulatory-data";
import {
  Activity,
  Repeat,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building,
  Layers,
  Sparkles
} from "lucide-react";

export function ProcessXRay() {
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [highlightLoops, setHighlightLoops] = useState<boolean>(true);

  const filteredSteps = PROCESS_XRAY_STEPS.filter((step) => {
    if (selectedDept === "ALL") return true;
    return step.department.toLowerCase().includes(selectedDept.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                PM4PY PROCESS MINING ENGINE
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Conformance Checking &amp; Bottleneck Discovery
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Process Mining X-Ray: Expected vs Observed Reality
            </h2>
            <p className="text-xs text-slate-600">
              Mined directly from state event logs (Raj Nivesh Single Window) to reveal hidden rework loops, ping-pong scrutiny, and silent wait bottlenecks.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-slate-800 focus:outline-none cursor-pointer text-xs font-medium"
              >
                <option value="ALL">All Departments</option>
                <option value="Factories">Factories &amp; Boilers</option>
                <option value="Query">Query Resolution Cell</option>
                <option value="Inspection">Joint Inspection</option>
              </select>
            </div>

            <button
              onClick={() => setHighlightLoops(!highlightLoops)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                highlightLoops
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Repeat className="h-3.5 w-3.5" />
              <span>{highlightLoops ? "Loops Highlighted" : "Show All Steps"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison: Ideal Happy Path vs Mined Real Process */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Expected Statutory Standard Process */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Statutory Intended Process (Happy Path)</span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-600">Total SLA: 23.5 Days</span>
          </div>

          <div className="space-y-3">
            {[
              { name: "Online Submission", days: 1, note: "Citizen portal upload" },
              { name: "Automated Pre-Validation", days: 0.5, note: "Optical entity match" },
              { name: "Department Desk Scrutiny", days: 7, note: "Single pass officer check" },
              { name: "Joint Site Inspection", days: 10, note: "Coordinated single visit" },
              { name: "Statutory Sanction & Delivery", days: 5, note: "Digital signature release" }
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold flex items-center justify-center border border-emerald-200">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{step.name}</h4>
                    <p className="text-[11px] text-slate-500">{step.note}</p>
                  </div>
                </div>

                <span className="font-mono text-emerald-700 font-semibold">{step.days}d</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
            Assumes zero applicant defect and timely inter-departmental concurrency.
          </div>
        </div>

        {/* Right: Observed Mined Reality (PM4Py Event Logs) */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Observed Reality (Mined from 4,820 Event Logs)</span>
            </span>
            <span className="text-xs font-mono text-rose-700 font-bold">Median: 67.8 Days</span>
          </div>

          <div className="space-y-3">
            {filteredSteps.map((step, idx) => {
              const hasLoop = step.isLoop;
              const isBottleneck = step.bottleneckFlag;

              return (
                <div
                  key={step.stepId}
                  className={`p-3 rounded-lg border transition-all text-xs ${
                    isBottleneck
                      ? "border-rose-200 bg-rose-50/50 shadow-sm"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center mt-0.5 shadow-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{step.activityName}</h4>
                          {hasLoop && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                              <Repeat className="h-2.5 w-2.5" /> {step.reworkFrequencyRate} Rework
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.department}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-mono font-bold block ${isBottleneck ? "text-rose-700" : "text-slate-900"}`}>
                        {step.observedMedianDays} Days
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        (+{step.waitingTimeDays}d idle wait)
                      </span>
                    </div>
                  </div>

                  {isBottleneck && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200 flex items-center justify-between text-[11px] text-rose-800 font-medium">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-rose-600" />
                        Scrutiny ping-pong query loop identified
                      </span>
                      <span className="font-mono text-[10px]">Deviation: +{(step.observedMedianDays - step.expectedDurationDays).toFixed(1)}d</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <strong>Key Root Cause Discovered:</strong> 42.8% of applications undergo 2+ scrutiny query cycles due to incomplete boiler engineering schematics, tripling the duration.
          </div>
        </div>

      </div>
    </div>
  );
}
