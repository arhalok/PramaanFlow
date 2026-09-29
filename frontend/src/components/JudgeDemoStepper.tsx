"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";

export interface JudgeStep {
  id: number;
  title: string;
  persona: "applicant" | "government" | "inspector";
  subTab: string;
  description: string;
  actionHint: string;
}

export const JUDGE_DEMO_STEPS: JudgeStep[] = [
  {
    id: 1,
    title: "1. Natural Intent & Project Intake",
    persona: "applicant",
    subTab: "intent",
    description: "Type '50 TPD food processing' or click sample. Watch the natural language engine parse intent and resolve coordinates.",
    actionHint: "Understanding project → Resolving location → Finding applicable requirements"
  },
  {
    id: 2,
    title: "2. Maharashtra Jurisdiction Intelligence (PostGIS + H3)",
    persona: "applicant",
    subTab: "gis",
    description: "PostGIS point-in-polygon engine resolves Chakan MIDC, Khed Taluka, MPCB SRO Pimpri-Chinchwad, and 8 Aaple Sarkar RTS services with verified legal provenance.",
    actionHint: "Drop pin or switch Maharashtra industrial corridors to watch statutory authority shift"
  },
  {
    id: 3,
    title: "3. Interactive Approval DAG",
    persona: "applicant",
    subTab: "graph",
    description: "Visual Directed Acyclic Graph connecting Land Allotment → EIA Clearance → Consent to Establish → Fire NOC.",
    actionHint: "Click any node to see upstream prerequisites & downstream blocked clearances"
  },
  {
    id: 4,
    title: "4. 'WHY?' Statutory Evidence Chain",
    persona: "applicant",
    subTab: "drawer",
    description: "Complete legal provenance: Project → Sector → Jurisdiction → 1974 Water Act Sec 25 Gazette citation.",
    actionHint: "Clear distinction between deterministic statutory rules vs AI reasoning"
  },
  {
    id: 5,
    title: "5. What-If Threshold Simulator",
    persona: "applicant",
    subTab: "simulator",
    description: "Modulate capacity from 100 to 150 TPD. See instant EIA Category A escalation and CGWA deep water trigger.",
    actionHint: "Real deterministic counter animation: Approvals 12 → 14, Inspections 4 → 5"
  },
  {
    id: 6,
    title: "6. Pre-Submission Document X-Ray",
    persona: "applicant",
    subTab: "validator",
    description: "Optical entity extraction detects 100 TPD (Form 1) vs 150 TPD (EIA Annexure) discrepancy before submission.",
    actionHint: "Click 'Inspect & Resolve' to prevent a 24-day departmental query stall"
  },
  {
    id: 7,
    title: "7. Govt Command & Process Mining X-Ray",
    persona: "government",
    subTab: "process-xray",
    description: "PM4Py event logs reveal expected 23.5 days vs observed 67.8 days with 42.8% repeated scrutiny loops.",
    actionHint: "Exposes silent idle waiting time (+12.4d) at Directorate of Factories"
  },
  {
    id: 8,
    title: "8. Bottleneck Blast Radius",
    persona: "government",
    subTab: "bottlenecks",
    description: "Visual cascade tree showing how 143 boiler stalls block downstream Fire & Discom energization for ₹2,140 Cr.",
    actionHint: "Algorithmic root cause discovery and automated workload re-balancing"
  },
  {
    id: 9,
    title: "9. Coordinated Inspection Optimization",
    persona: "inspector",
    subTab: "inspector",
    description: "Google OR-Tools CP-SAT multi-inspector route optimizer bundles Sitapura audits, cutting 34% road travel & SLA risk.",
    actionHint: "Statutory checklist with mandatory geofenced photographic evidence"
  },
  {
    id: 10,
    title: "10. Regulatory Change Gazette Diff",
    persona: "government",
    subTab: "regulatory-diff",
    description: "Gazette notification F.14 parsed: Old grab sampling vs New continuous VOC telemetry with +2 documents.",
    actionHint: "Immediate blast radius calculation: 38 industrial units affected statewide"
  },
  {
    id: 11,
    title: "11. Statewide Change Impact Map",
    persona: "applicant",
    subTab: "gis-impact",
    description: "Spatially plots all 38 affected active chemical enterprises across Jaipur, Pali, Bhiwadi & Neemrana.",
    actionHint: "Regulatory change instantly propagated to active project twins"
  },
  {
    id: 12,
    title: "12. Single Window Organization 360",
    persona: "government",
    subTab: "org-360",
    description: "Corporate twin with MCA21 & GSTN entity resolution, 3 industrial plants, and 19 held clearances.",
    actionHint: "100% end-to-end operational intelligence computational system complete"
  }
];

interface JudgeDemoStepperProps {
  currentStepIndex: number;
  onStepChange: (step: JudgeStep) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function JudgeDemoStepper({
  currentStepIndex,
  onStepChange,
  isOpen,
  onToggleOpen
}: JudgeDemoStepperProps) {
  const currentStep = JUDGE_DEMO_STEPS[currentStepIndex] || JUDGE_DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStepIndex < JUDGE_DEMO_STEPS.length - 1) {
      onStepChange(JUDGE_DEMO_STEPS[currentStepIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onStepChange(JUDGE_DEMO_STEPS[currentStepIndex - 1]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all border border-teal-500"
      >
        <Sparkles className="h-4 w-4" />
        <span>Judge Demo Walkthrough (12 Steps)</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 p-4 shadow-2xl bg-white/95 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Judge Demo Mode • Step {currentStep.id} of {JUDGE_DEMO_STEPS.length}
          </span>
        </div>

        <button
          onClick={onToggleOpen}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          title="Minimize Guide"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Step Content */}
      <div className="py-3 space-y-2">
        <h4 className="text-sm font-bold text-teal-800 leading-snug">
          {currentStep.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {currentStep.description}
        </p>

        <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-[11px] text-teal-900 flex items-start gap-1.5 font-medium">
          <Sparkles className="h-3 w-3 shrink-0 text-teal-700 mt-0.5" />
          <span>{currentStep.actionHint}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-xs font-semibold transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>

        {/* Step Selector Dropdown */}
        <select
          value={currentStepIndex}
          onChange={(e) => onStepChange(JUDGE_DEMO_STEPS[Number(e.target.value)])}
          className="bg-white text-slate-800 text-[11px] font-mono rounded px-2 py-1 border border-slate-200 focus:outline-none cursor-pointer shadow-sm"
        >
          {JUDGE_DEMO_STEPS.map((s, i) => (
            <option key={s.id} value={i}>
              Step {s.id}
            </option>
          ))}
        </select>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === JUDGE_DEMO_STEPS.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-30 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
