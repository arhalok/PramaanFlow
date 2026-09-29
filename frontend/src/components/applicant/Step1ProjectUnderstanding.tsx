"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Leaf,
  Sun,
  Cpu
} from "lucide-react";

interface Step1ProjectUnderstandingProps {
  initialPrompt?: string;
  onSubmit: (prompt: string) => void;
}

const QUICK_STARTS = [
  {
    id: "pharma",
    title: "Pharma API Manufacturing",
    icon: Building2,
    badge: "Red Category · High Impact",
    prompt:
      "I want to establish a 100 TPD active pharmaceutical ingredient (API) bulk manufacturing facility in Chakan MIDC, Pune with ₹145 Cr investment.",
    description: "Bulk drug synthesis, solvent storage, effluent treatment requirements"
  },
  {
    id: "food",
    title: "Food Processing Unit",
    icon: Leaf,
    badge: "Orange Category · Agro Park",
    prompt:
      "I want to establish a 50 TPD food processing & cold chain unit near Baramati, Pune with ₹45 Cr investment.",
    description: "Agro processing, cold storage, FSSAI central licensing"
  },
  {
    id: "solar",
    title: "Captive Solar Plant",
    icon: Sun,
    badge: "Green / White · Renewable",
    prompt:
      "We are installing a 10 MW captive solar power plant on 40 acres private industrial land in Kurkumbh.",
    description: "Grid connectivity, CEIG electrical safety, land zoning"
  }
];

export function Step1ProjectUnderstanding({
  initialPrompt,
  onSubmit
}: Step1ProjectUnderstandingProps) {
  const [promptText, setPromptText] = useState(
    initialPrompt ||
      "I want to establish a 100 TPD active pharmaceutical ingredient (API) bulk manufacturing facility in Chakan MIDC, Pune with ₹145 Cr investment."
  );

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    onSubmit(promptText.trim());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          <span>National Single Window System &amp; State Regulatory Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What are you planning to build?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Describe your project in your own words. We&apos;ll ask only the questions needed to determine the applicable approvals.
        </p>
      </div>

      {/* Main Conversational Input Box */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-md hover:shadow-lg focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-2 sm:p-3">
        <div className="p-2">
          <label htmlFor="project-intent-input" className="sr-only">
            Project Description
          </label>
          <textarea
            id="project-intent-input"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={4}
            placeholder="e.g. I want to establish a 100 TPD active pharmaceutical ingredient (API) facility in Chakan MIDC, Pune with ₹145 Cr investment..."
            className="w-full bg-transparent text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Input Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 px-3 pb-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Intelligent parameter extraction active</span>
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={!promptText.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick-Start Prompts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Or select a quick-start project template:
          </span>
          <span className="text-[11px] text-slate-500">Starting prompts · Fully customizable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {QUICK_STARTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setPromptText(item.prompt)}
                className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/20 cursor-pointer transition-all shadow-xs space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-medium group-hover:text-teal-700">
                  <span>Use Template</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works info cards */}
      <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-teal-100 text-teal-700 font-bold shrink-0">1</div>
          <div>
            <p className="font-semibold text-slate-800">Natural Language Intake</p>
            <p className="text-[11px] text-slate-500 mt-0.5">No confusing departmental forms or administrative codes needed.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-teal-100 text-teal-700 font-bold shrink-0">2</div>
          <div>
            <p className="font-semibold text-slate-800">Adaptive Q&amp;A</p>
            <p className="text-[11px] text-slate-500 mt-0.5">We only ask for details not already in your initial description.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-teal-100 text-teal-700 font-bold shrink-0">3</div>
          <div>
            <p className="font-semibold text-slate-800">Deterministic DAG</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Backend rules assemble your legally grounded dependency roadmap.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
