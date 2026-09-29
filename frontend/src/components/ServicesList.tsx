"use client";

import React, { useState } from "react";
import {
  X, FileText, CheckCircle2, AlertTriangle, Clock,
  ExternalLink, Building2, Leaf, Shield, ChevronRight, Info, Filter
} from "lucide-react";
import { ApplicableService, LocationAnalysisResult } from "@/lib/maharashtra-geospatial";

interface ServicesListProps {
  result: LocationAnalysisResult;
  onClose: () => void;
}

function SLABadge({ days }: { days: number }) {
  const color = days <= 21 ? "green" : days <= 30 ? "blue" : days <= 45 ? "amber" : "red";
  const colorMap = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${colorMap[color]}`}>
      <Clock className="h-3 w-3" /> {days} days SLA
    </span>
  );
}

export function ServicesList({ result, onClose }: ServicesListProps) {
  const [filter, setFilter] = useState<"all" | "required" | "exempted">("required");

  const activeServices = result.applicableServices.filter(s => !s.isExempted);
  const exemptedServices = result.applicableServices.filter(s => s.isExempted);
  const shown = filter === "all" ? result.applicableServices
    : filter === "required" ? activeServices
    : exemptedServices;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-teal-700 to-teal-600 text-white shrink-0">
          <div className="p-2 rounded-xl bg-white/10">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-semibold text-teal-200 uppercase tracking-widest mb-0.5">
              Services Relevant to This Location
            </div>
            <div className="text-sm font-bold">{result.location.formattedAddress}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 border-b border-slate-100 shrink-0">
          {[
            { label: "Required", count: activeServices.length, id: "required", color: "teal" },
            { label: "Exempted", count: exemptedServices.length, id: "exempted", color: "slate" },
            { label: "All", count: result.applicableServices.length, id: "all", color: "slate" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex flex-col items-center py-3 transition-colors border-b-2 ${
                filter === tab.id
                  ? "border-teal-600 bg-teal-50/50"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className={`text-xl font-black ${filter === tab.id ? "text-teal-700" : "text-slate-700"}`}>{tab.count}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 border-b border-blue-100 shrink-0">
          <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <p className="text-[10px] text-blue-700 font-medium">
            These are <strong>potentially applicable services</strong> based on your location's jurisdiction. Verify mandatory requirements with the relevant authority.
          </p>
        </div>

        {/* Services List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {shown.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          {shown.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <div className="text-sm font-medium">No services in this category</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 flex items-center justify-between shrink-0">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Source: Maharashtra Aaple Sarkar (RTS Act 2015) · MIDC · MPCB
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ApplicableService }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      service.isExempted
        ? "border-slate-200 bg-slate-50/60 opacity-75"
        : "border-teal-100 bg-white shadow-sm hover:shadow-md"
    }`}>
      <button
        className="w-full flex items-start gap-3 p-3.5 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`mt-0.5 shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
          service.isExempted
            ? "bg-slate-200"
            : "bg-teal-100"
        }`}>
          {service.isExempted
            ? <AlertTriangle className="h-3 w-3 text-slate-500" />
            : <CheckCircle2 className="h-3 w-3 text-teal-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <span className={`text-[12px] font-bold leading-tight ${service.isExempted ? "text-slate-500 line-through" : "text-slate-800"}`}>
              {service.name}
            </span>
            {!service.isExempted && <SLABadge days={service.slaDays} />}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-500">{service.authority}</span>
            {service.isExempted && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 uppercase tracking-wide">Exempted</span>
            )}
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 mt-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-2.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Department</div>
            <div className="text-[11px] text-slate-700 font-medium">{service.department}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Why this applies</div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              {service.isExempted ? service.exemptionReason : service.reasonMatched}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Statutory Basis</div>
            <div className="text-[10px] text-slate-500 font-mono">{service.statutoryAct}</div>
          </div>
          {!service.isExempted && (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Official Service Portal
            </a>
          )}
        </div>
      )}
    </div>
  );
}
