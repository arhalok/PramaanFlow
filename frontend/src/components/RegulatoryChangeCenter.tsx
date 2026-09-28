"use client";

import React, { useState } from "react";
import { REGULATORY_DIFF_DATA, RegulatoryDiffItem } from "@/lib/regulatory-data";
import {
  FileDiff,
  AlertTriangle,
  MapPin,
  Building,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface RegulatoryChangeCenterProps {
  onShowOnMap?: () => void;
}

export function RegulatoryChangeCenter({ onShowOnMap }: RegulatoryChangeCenterProps) {
  const [diffData, setDiffData] = useState<RegulatoryDiffItem>(REGULATORY_DIFF_DATA);
  const [isParsingNewDraft, setIsParsingNewDraft] = useState(false);

  const handleSimulateNewNotification = () => {
    setIsParsingNewDraft(true);
    setTimeout(() => {
      setIsParsingNewDraft(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                REGULATORY DIFF &amp; AMENDMENT ENGINE
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Gazette Parsing &amp; Enterprise Impact Matrix
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Regulatory Change Center: Gazette Diff &amp; Blast Radius
            </h2>
            <p className="text-xs text-slate-600">
              When new state statutory orders or gazette amendments are notified, our engine computes immediate compliance delta and maps affected active enterprises.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onShowOnMap && (
              <button
                onClick={onShowOnMap}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <MapPin className="h-4 w-4" />
                <span>Show Affected Plants On Map</span>
              </button>
            )}

            <button
              onClick={handleSimulateNewNotification}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-medium transition-colors"
            >
              <UploadCloud className="h-4 w-4 text-teal-600" />
              <span>{isParsingNewDraft ? "Parsing..." : "Upload Gazette Notification"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gazette Notification Details Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {diffData.notificationNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">Effective: {diffData.effectiveDate}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {diffData.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Authority: <strong className="text-slate-900 font-semibold">{diffData.issuingAuthority}</strong>
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-center">
            Statutory Amendment Active
          </span>
        </div>

        {/* SIDE BY SIDE DIFF: OLD vs NEW STATUTORY REQUIREMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Old Baseline */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500 block">
              Previous Requirement (Pre-Notification)
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {diffData.oldRequirement}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
              <span>Grab sampling via manual quarterly laboratory audit.</span>
            </div>
          </div>

          {/* New Mandate */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase font-mono text-teal-800 block">
                New Statutory Mandate (Gazette Order)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                +2 Documents Required
              </span>
            </div>
            <p className="text-slate-900 leading-relaxed font-semibold">
              {diffData.newRequirement}
            </p>
            <div className="pt-2 text-[11px] text-teal-800 flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-teal-600 animate-ping"></span>
              <span>24x7 Telemetric PID Sensor connected to RSPCB Central Gateway.</span>
            </div>
          </div>
        </div>

        {/* Impact Metrics Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Affected Units</span>
            <p className="text-lg font-bold text-rose-700 mt-0.5 font-mono">
              {diffData.impactMetrics.affectedProjectsCount} Enterprises
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Chemical &amp; Pharma</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Applications</span>
            <p className="text-lg font-bold text-amber-800 mt-0.5 font-mono">
              {diffData.impactMetrics.affectedApplicationsCount} In-Flight
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Requires Filings Update</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Approval Shift</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
              +{diffData.impactMetrics.delayedDaysEstimate} Days
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Hardware Commissioning</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">New Compliance</span>
            <p className="text-lg font-bold text-emerald-700 mt-0.5 font-mono">
              +{diffData.impactMetrics.documentsAdded} Docs / +1 Audit
            </p>
            <span className="text-[10px] text-slate-500 font-medium">LDAR Bi-annual</span>
          </div>
        </div>
      </div>

      {/* Affected Projects List */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building className="h-4 w-4 text-teal-600" />
            <span>High-Priority Enterprises Requiring Immediate Notification</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Automated SMS &amp; Portal Alert Dispatched</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {diffData.affectedProjects.map((prj) => (
            <div
              key={prj.id}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
            >
              <div>
                <h4 className="font-semibold text-slate-900">{prj.name}</h4>
                <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="h-3 w-3 text-rose-600" />
                  <span>{prj.district}</span>
                </p>
                <p className="text-[11px] text-amber-800 mt-1 font-mono font-medium">
                  Stage: {prj.currentStatus}
                </p>
              </div>

              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm shrink-0">
                {prj.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
