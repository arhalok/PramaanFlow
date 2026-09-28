"use client";

import React from "react";
import { ORGANIZATION_360_DATA } from "@/lib/regulatory-data";
import {
  Building2,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";

export function Organization360View() {
  const org = ORGANIZATION_360_DATA;

  return (
    <div className="space-y-6">
      {/* Entity Resolution Header */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>MCA21 &amp; GSTN ENTITY RESOLVED (98.4% Match)</span>
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Single Window Corporate Twin
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {org.companyName}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-2 font-medium">
              <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>{org.corporateHq}</span>
              <span className="text-slate-400">•</span>
              <span>CIN: {org.cin}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Portfolio CapEx</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">₹{org.portfolioSummary.totalInvestmentInrCrores} Cr</p>
              <span className="text-[10px] text-slate-500 font-medium">Across 3 Units</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Clearances Held</span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">{org.portfolioSummary.statutoryClearancesHeld}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Valid</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Employment</span>
              <p className="text-base font-bold text-teal-800 mt-0.5">{org.portfolioSummary.totalEmployment}</p>
              <span className="text-[10px] text-slate-500 font-medium">Active Workforce</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Compliance Score</span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">{org.complianceHealthScore} / 100</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Star Rating A+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Metadata & Multi-Unit Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Statutory Identifiers & KYC */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-600" />
            <span>Statutory KYC Credentials</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-600 font-medium">GSTIN</span>
              <span className="font-mono font-bold text-slate-900">{org.gstin}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-600 font-medium">Income Tax PAN</span>
              <span className="font-mono font-bold text-slate-900">{org.pan}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-600 font-medium">Incorporation Date</span>
              <span className="font-mono text-slate-900 font-medium">{org.incorporationDate}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-600 font-medium">Director Aadhaar KYC</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified e-Sign
              </span>
            </div>
          </div>
        </div>

        {/* Right: Multi-Unit Portfolio (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span>Statewide Manufacturing Units ({org.projectsPortfolio.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Consolidated Single Window View</span>
          </div>

          <div className="space-y-3">
            {org.projectsPortfolio.map((prj) => (
              <div
                key={prj.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{prj.name}</h4>
                    <span className="font-mono text-[10px] text-slate-500">#{prj.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="h-3 w-3 text-rose-600" />
                    <span>District: {prj.district}, Rajasthan</span>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-emerald-700 font-semibold block text-[11px]">
                    {prj.stage}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Autonomous Compliance Monitoring</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
