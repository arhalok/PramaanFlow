"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Building,
  ChevronRight
} from "lucide-react";

interface ComplianceItem {
  id: string;
  title: string;
  department: string;
  grantDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: "ACTIVE" | "RENEWAL_DUE_SOON" | "PERMANENT";
  statute: string;
  orderNumber: string;
  recurringObligation: string;
}

const ACTIVE_COMPLIANCES: ComplianceItem[] = [
  {
    id: "comp-midc-land",
    title: "MIDC Industrial Land Lease (95-Year Allotment)",
    department: "Maharashtra Industrial Development Corporation (MIDC)",
    grantDate: "28 Aug 2026",
    expiryDate: "27 Aug 2121",
    daysRemaining: 34650,
    status: "PERMANENT",
    statute: "MIDC Act 1961 Section 32",
    orderNumber: "MIDC/PUN/2026/4102-L",
    recurringObligation: "Annual nominal lease rent payment (₹12,400 due March 31)"
  },
  {
    id: "comp-cte-mpcb",
    title: "Consent to Establish (CTE) - Water & Air Pollution Acts",
    department: "Maharashtra Pollution Control Board (MPCB)",
    grantDate: "15 Sep 2026",
    expiryDate: "14 Sep 2031",
    daysRemaining: 1812,
    status: "ACTIVE",
    statute: "Water Act 1974 Sec 25 & Air Act 1981 Sec 21",
    orderNumber: "MPCB/SRO-PUN/CTE/26090014",
    recurringObligation: "Six-monthly environmental compliance report submission"
  },
  {
    id: "comp-fac-annual",
    title: "Factory Licence Annual Renewal & Form 27 Filing",
    department: "Directorate of Industrial Safety & Health (DISH)",
    grantDate: "18 Sep 2026",
    expiryDate: "31 Dec 2026",
    daysRemaining: 68,
    status: "RENEWAL_DUE_SOON",
    statute: "Maharashtra Factories Rules 1963 Rule 4",
    orderNumber: "DISH/PUN/LIC/2026/0891",
    recurringObligation: "Annual factory return & prescribed renewal fee before Dec 31"
  },
  {
    id: "comp-fire-audit",
    title: "Annual Fire Fighting Equipment & Pressure Test Audit",
    department: "Directorate of Maharashtra Fire Services",
    grantDate: "22 Sep 2026",
    expiryDate: "21 Sep 2027",
    daysRemaining: 357,
    status: "ACTIVE",
    statute: "Maharashtra Fire Prevention & Life Safety Act 2006",
    orderNumber: "MFS/PUN/AUDIT/2026/512",
    recurringObligation: "Form B biannual fire safety certificate from licensed agency"
  }
];

export function ComplianceRenewalsView() {
  const [items, setItems] = useState<ComplianceItem[]>(ACTIVE_COMPLIANCES);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleFastTrackRenewal = (item: ComplianceItem) => {
    setRenewingId(item.id);
    setTimeout(() => {
      setRenewingId(null);
      alert(`Fast-track renewal application initialized for ${item.title}. Pre-filled verified data and documents attached automatically.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono border border-emerald-200 uppercase">
              POST-APPROVAL CONTINUITY
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Compliance &amp; Renewals Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Active Licences &amp; Statutory Renewals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The approval journey does not end at initial grant. Monitor expiry dates, recurring filings, and fast-track renewals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>4 Active Authorizations</span>
        </div>
      </div>

      {/* 2. Urgent Renewal Warning Card */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Renewal Window Open (68 Days Remaining)
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Factory Licence Annual Renewal &amp; Form 27 (DISH Pune)
            </h3>
            <p className="text-xs text-slate-600">
              Under Rule 4 of Maharashtra Factories Rules 1963, renewals submitted before Dec 31 incur 0 penalty and qualify for automated renewal.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleFastTrackRenewal(items[2])}
          disabled={renewingId === items[2].id}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          {renewingId === items[2].id ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Generating Renewal Docket...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Initiate Fast-Track Renewal</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Active Licences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-2xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : item.status === "RENEWAL_DUE_SOON"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {item.status.replace(/_/g, " ")}
                </span>

                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {item.orderNumber}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.department}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Statutory Basis:</span>
                  <strong className="text-slate-800 font-medium">{item.statute}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Validity:</span>
                  <strong className="text-slate-800 font-medium">{item.grantDate} → {item.expiryDate}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Obligation:</span>
                  <strong className="text-teal-800 font-medium truncate max-w-[220px]">
                    {item.recurringObligation}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => alert(`Downloading verified statutory order: ${item.orderNumber}`)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Order</span>
              </button>

              {item.status === "RENEWAL_DUE_SOON" ? (
                <button
                  onClick={() => handleFastTrackRenewal(item)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Renew Now</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Compliant</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
