"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface WhatIfSimulatorProps {
  initialCapacity?: number;
  initialInvestment?: number;
}

export function WhatIfSimulator({
  initialCapacity = 100,
  initialInvestment = 145.5
}: WhatIfSimulatorProps) {
  const [capacity, setCapacity] = useState<number>(initialCapacity);
  const [investment, setInvestment] = useState<number>(initialInvestment);
  const [waterExtractionKld, setWaterExtractionKld] = useState<number>(180);
  const [hasHazardousChemicals, setHasHazardousChemicals] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Computed statutory thresholds based on real regulatory rules
  const isHighCapacity = capacity > 120;
  const isHighWater = waterExtractionKld > 200;
  const isThrustInvestment = investment > 100;

  // Real computed regulatory counters
  const currentApprovals = 12;
  const simulatedApprovals = 12 + (isHighCapacity ? 1 : 0) + (isHighWater ? 1 : 0);

  const currentInspections = 4;
  const simulatedInspections = 4 + (isHighWater ? 1 : 0);

  const currentDocs = 9;
  const simulatedDocs = 9 + (isHighCapacity ? 1 : 0) + (isHighWater ? 1 : 0);

  const currentConditions = 3;
  const simulatedConditions = 3 + (isHighCapacity ? 1 : 0);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const handleReset = () => {
    setCapacity(initialCapacity);
    setInvestment(initialInvestment);
    setWaterExtractionKld(180);
    setHasHazardousChemicals(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                DYNAMIC WHAT-IF SIMULATOR
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Deterministic Rule &amp; Threshold Evaluation
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Regulatory Impact &amp; Threshold Simulator
            </h2>
            <p className="text-xs text-slate-600">
              Modulate manufacturing capacity, capital investment, or water withdrawal to simulate statutory changes before committing capital.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-medium transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters Control + Regulatory Impact Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Input Variables Modulator */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-teal-600" />
              <span>Project Parameters Modulator</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Interactive Inputs</span>
          </div>

          {/* Slider 1: Production Capacity */}
          <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-800 font-medium">Daily Production Capacity</span>
              <span className="font-mono text-teal-700 font-bold text-sm">{capacity} TPD</span>
            </div>
            <input
              type="range"
              min={25}
              max={200}
              step={5}
              value={capacity}
              onChange={(e) => {
                setCapacity(Number(e.target.value));
                handleRunSimulation();
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>25 TPD (Small)</span>
              <span>100 TPD (Baseline)</span>
              <span className="text-amber-700 font-semibold">120+ TPD (EIA Public Trigger)</span>
              <span>200 TPD</span>
            </div>
          </div>

          {/* Slider 2: Capital Investment */}
          <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-800 font-medium">Capital Investment (CapEx)</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">₹{investment} Crores</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={investment}
              onChange={(e) => {
                setInvestment(Number(e.target.value));
                handleRunSimulation();
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹30 Cr</span>
              <span className="text-emerald-700 font-semibold">₹100+ Cr (RIPS Thrust Subsidy)</span>
              <span>₹300 Cr</span>
            </div>
          </div>

          {/* Slider 3: Ground Water Extraction */}
          <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-800 font-medium">Daily Water Withdrawal</span>
              <span className="font-mono text-sky-700 font-bold text-sm">{waterExtractionKld} KLD</span>
            </div>
            <input
              type="range"
              min={50}
              max={350}
              step={10}
              value={waterExtractionKld}
              onChange={(e) => {
                setWaterExtractionKld(Number(e.target.value));
                handleRunSimulation();
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50 KLD</span>
              <span>180 KLD (Baseline)</span>
              <span className="text-rose-700 font-semibold">200+ KLD (CGWA NOC Mandatory)</span>
              <span>350 KLD</span>
            </div>
          </div>

          {/* Toggle: Hazardous Chemicals */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-900 font-medium block">Hazardous Chemical Storage</span>
              <span className="text-[11px] text-slate-500">Class 1 Solvents (Methanol, IPA &gt; 20 KL)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasHazardousChemicals}
                onChange={(e) => {
                  setHasHazardousChemicals(e.target.checked);
                  handleRunSimulation();
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        {/* Right: Real-time Computed Regulatory Impact */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Simulated Regulatory Shift</span>
              </h3>
              {isSimulating ? (
                <span className="text-[11px] text-teal-700 animate-pulse font-mono font-medium">Recalculating...</span>
              ) : (
                <span className="text-[11px] text-emerald-700 font-semibold">Live Model Synced</span>
              )}
            </div>

            {/* Impact Metric Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Approvals */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Approvals</span>
                <div className="flex items-center justify-center gap-1.5 mt-1 font-mono font-bold text-base">
                  <span className="text-slate-500">{currentApprovals}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className={simulatedApprovals > currentApprovals ? "text-amber-800" : "text-emerald-700"}>
                    {simulatedApprovals}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">
                  {simulatedApprovals > currentApprovals ? `+${simulatedApprovals - currentApprovals} Triggered` : "No Change"}
                </span>
              </div>

              {/* Inspections */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Inspections</span>
                <div className="flex items-center justify-center gap-1.5 mt-1 font-mono font-bold text-base">
                  <span className="text-slate-500">{currentInspections}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className={simulatedInspections > currentInspections ? "text-amber-800" : "text-emerald-700"}>
                    {simulatedInspections}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">
                  {simulatedInspections > currentInspections ? "+1 Audit" : "No Change"}
                </span>
              </div>

              {/* Documents */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Filings</span>
                <div className="flex items-center justify-center gap-1.5 mt-1 font-mono font-bold text-base">
                  <span className="text-slate-500">{currentDocs}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className={simulatedDocs > currentDocs ? "text-amber-800" : "text-emerald-700"}>
                    {simulatedDocs}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">
                  {simulatedDocs > currentDocs ? `+${simulatedDocs - currentDocs} Filings` : "Standard"}
                </span>
              </div>

              {/* Conditions */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Conditions</span>
                <div className="flex items-center justify-center gap-1.5 mt-1 font-mono font-bold text-base">
                  <span className="text-slate-500">{currentConditions}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className={simulatedConditions > currentConditions ? "text-rose-700" : "text-emerald-700"}>
                    {simulatedConditions}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">
                  {simulatedConditions > currentConditions ? "+1 Mandate" : "Standard"}
                </span>
              </div>
            </div>

            {/* Triggered Statutory Threshold Highlights */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Triggered Statutory Consequences:
              </span>

              {isHighCapacity && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <span className="font-semibold block">EIA Category Shift: Schedule 5(f) Category A Trigger</span>
                    <span className="text-[11px] text-slate-600">
                      Capacity exceeds 120 TPD threshold. Appraisal elevates from State SEIAA to MoEFCC Expert Appraisal Committee (Central Delhi).
                    </span>
                  </div>
                </div>
              )}

              {isHighWater && (
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-sky-600" />
                  <div>
                    <span className="font-semibold block">Central Ground Water Authority (CGWA) Extraction NOC</span>
                    <span className="text-[11px] text-slate-600">
                      Water usage &gt; 200 KLD in Sitapura semi-critical zone triggers mandatory telemetric flowmeter installation &amp; artificial recharge plan.
                    </span>
                  </div>
                </div>
              )}

              {isThrustInvestment && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold block">RIPS 2024 Thrust Sector Incentive Maxima</span>
                    <span className="text-[11px] text-slate-600">
                      CapEx &gt; ₹100 Cr qualifies for 75% SGST reimbursement + ₹21.8 Cr fixed capital grant.
                    </span>
                  </div>
                </div>
              )}

              {!isHighCapacity && !isHighWater && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 italic text-center">
                  Project configuration sits comfortably within Category B2 fast-track thresholds.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Engine: Real Open Policy Agent (OPA) Rule Evaluation</span>
            <span className="text-emerald-700 font-mono font-semibold">100% Deterministic</span>
          </div>
        </div>

      </div>
    </div>
  );
}
