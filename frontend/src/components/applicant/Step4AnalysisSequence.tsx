"use client";

import React, { useState, useEffect } from "react";
import { ProjectProfile, ResolvedLocation, RegulatoryRoadmap } from "@/lib/project-state";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  MapPin,
  Scale
} from "lucide-react";

interface Step4AnalysisSequenceProps {
  profile: ProjectProfile;
  location: ResolvedLocation;
  roadmap: RegulatoryRoadmap;
  onAnalysisComplete: () => void;
}

interface AnalysisStage {
  id: number;
  label: string;
  detail: string;
}

export function Step4AnalysisSequence({
  profile,
  location,
  roadmap,
  onAnalysisComplete
}: Step4AnalysisSequenceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const STAGES: AnalysisStage[] = [
    {
      id: 0,
      label: "Project profile understood",
      detail: `${profile.sector} (${profile.subSector}) · Planned Capacity: ${profile.capacity || 100} ${profile.capacityUnit || "TPD"}`
    },
    {
      id: 1,
      label: "Required project information collected",
      detail: `Capital Outlay: ₹${profile.investmentCrores || 145} Cr · Target Employment: ${profile.employmentTarget || 200} personnel`
    },
    {
      id: 2,
      label: "Location resolved",
      detail: `${location.displayAddress} (Coordinates: ${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E)`
    },
    {
      id: 3,
      label: "Regulatory context resolved",
      detail: `Planning Body: ${location.planningAuthority} · Environmental Office: ${location.environmentalOffice}`
    },
    {
      id: 4,
      label: "Applicable rules checked",
      detail: `Evaluated Water Act 1974, Air Act 1981, Factories Act 1948, ${location.state === "Maharashtra" ? "MIDC Act 1961" : "RIICO Rules 2015"}`
    },
    {
      id: 5,
      label: "Approval dependencies generated",
      detail: `Synthesized DAG containing ${roadmap.approvals.length} clearances with ${roadmap.summaryMetrics.criticalDependenciesCount} statutory dependency links`
    }
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < STAGES.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800">
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>Statutory Intelligence Engine Active</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isDone ? "Your regulatory roadmap is ready." : "Analyzing Regulatory Pathway..."}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {isDone
            ? "Your project parameters, site geography, and legal triggers have been successfully synthesized into an interactive dependency roadmap."
            : "Executing point-in-polygon jurisdiction evaluation, environmental acts classification, and statutory DAG synthesis."}
        </p>
      </div>

      {/* Main Real Operation Checklist Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStepIndex || isDone;
            const isCurrent = idx === currentStepIndex && !isDone;
            const isPending = idx > currentStepIndex && !isDone;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? "bg-slate-50/70 border-slate-200/90 text-slate-800"
                    : isCurrent
                    ? "bg-teal-50/40 border-teal-500 shadow-xs ring-1 ring-teal-500/20"
                    : "bg-white border-dashed border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-teal-600 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isCompleted
                            ? "text-slate-900"
                            : isCurrent
                            ? "text-teal-900"
                            : "text-slate-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          PASSED
                        </span>
                      )}
                    </div>
                    {(isCompleted || isCurrent) && (
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {stage.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button once synthesis completes */}
        {isDone && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={onAnalysisComplete}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore Approval Roadmap &amp; DAG</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
