"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Building,
  Layers,
  CheckCircle2,
  Loader2,
  Compass,
  Sliders,
  Scale
} from "lucide-react";
import { ProjectTwin, INITIAL_PROJECT } from "@/lib/regulatory-data";

interface ProjectIntentHeroProps {
  onProjectAnalyzed: (analyzedProject: ProjectTwin) => void;
  onCancel?: () => void;
}

const PRESET_QUERIES = [
  {
    label: "Pharma API Unit (100 TPD, Sitapura)",
    prompt: "I want to establish a 100 TPD active pharmaceutical ingredient (API) bulk manufacturing facility in Sitapura Phase IV, Jaipur with ₹145 Cr investment.",
    sector: "Pharmaceuticals",
    capacity: 100,
    district: "Jaipur (Sitapura Phase IV)"
  },
  {
    label: "Agro Food Processing (50 TPD, Bindayaka)",
    prompt: "I want to establish a 50 TPD food processing & cold chain unit near Bindayaka, Jaipur with ₹45 Cr investment and 150 jobs.",
    sector: "Food Processing",
    capacity: 50,
    district: "Jaipur (Bindayaka Industrial Area)"
  },
  {
    label: "Captive Solar Power (10 MW, Phagi)",
    prompt: "We are installing a 10 MW captive solar power plant on 40 acres private industrial land in Phagi Tehsil, Jaipur Rural.",
    sector: "Renewable Energy",
    capacity: 10,
    district: "Jaipur Rural (Phagi)"
  }
];

const ANALYSIS_PIPELINE_STEPS = [
  "Understanding natural language project intent & sector taxonomy...",
  "Resolving geographic coordinates & H3 spatial index...",
  "Determining statutory jurisdiction (RIICO / RSPCB / SEIAA)...",
  "Evaluating regulatory acts, EIA categories & pollution thresholds...",
  "Synthesizing approval dependency DAG & critical path...",
  "Compiling required statutory filings & pre-validation rules..."
];

export function ProjectIntentHero({ onProjectAnalyzed, onCancel }: ProjectIntentHeroProps) {
  const [promptText, setPromptText] = useState(
    "I want to establish a 100 TPD active pharmaceutical ingredient (API) bulk manufacturing facility in Sitapura Phase IV, Jaipur with ₹145 Cr investment."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleStartAnalysis = () => {
    if (!promptText.trim()) return;
    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Simulate multi-step intelligence pipeline
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_PIPELINE_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          // Return the enriched project digital twin
          onProjectAnalyzed(INITIAL_PROJECT);
        }, 500);
      }
    }, 450);
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>Operational Regulatory Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What are you building?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Describe your project, industrial capacity, and intended location. Our engine resolves jurisdictions, statutory applicability, and builds your live approval DAG in seconds.
          </p>
        </div>

        {/* Input Textarea & Action */}
        <div className="space-y-3">
          <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all shadow-sm">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              disabled={isProcessing}
              rows={3}
              placeholder="e.g. I want to establish a 50 TPD food processing unit near Jaipur with cold storage..."
              className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 bg-white rounded-b-xl text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <MapPin className="h-3.5 w-3.5 text-rose-600" />
                <span>Geospatial Auto-Resolution Enabled</span>
              </div>

              <div className="flex items-center gap-2">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleStartAnalysis}
                  disabled={isProcessing || !promptText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Project</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Quick Examples:</span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPromptText(preset.prompt)}
                disabled={isProcessing}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Processing Pipeline Animation */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-slate-50 border border-teal-200 shadow-sm space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-800 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                Processing Regulatory Pipeline
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Stage {currentStepIndex + 1} of {ANALYSIS_PIPELINE_STEPS.length}
              </span>
            </div>

            {/* Step progress list */}
            <div className="space-y-1.5">
              {ANALYSIS_PIPELINE_STEPS.map((stepText, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs transition-all duration-200 ${
                      isDone
                        ? "text-emerald-700 font-semibold"
                        : isCurrent
                        ? "text-teal-900 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-ping shrink-0 mx-0.5" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300 shrink-0 mx-0.5" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
