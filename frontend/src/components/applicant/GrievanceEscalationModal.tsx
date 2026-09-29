"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  FileText,
  Send,
  ShieldAlert,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Scale
} from "lucide-react";

interface GrievanceEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApplicationId?: string;
  defaultApplicationTitle?: string;
}

export function GrievanceEscalationModal({
  isOpen,
  onClose,
  defaultApplicationId = "APP-MPCB-CTE-2026-0812",
  defaultApplicationTitle = "Consent to Establish (CTE) - Water & Air Acts"
}: GrievanceEscalationModalProps) {
  const [category, setCategory] = useState("SLA_DELAY");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedCaseId(`RTS-MH-PUN-${Date.now().toString().slice(-4)}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Grievance &amp; RTS First Appeal Desk
              </h3>
              <p className="text-[11px] text-slate-500">
                Maharashtra Right to Public Services Act, 2015 (Section 18 &amp; 19)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!submittedCaseId ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-rose-900">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>Statutory Timeframe Guarantee:</span>
              </span>
              <p className="text-[11px] text-rose-900/90 leading-relaxed">
                If an authorized department fails to deliver services within statutory SLA or rejects documents unreasonably, applicants are entitled to file a First Appeal before the Designated Appellate Authority (District Collectorate).
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Linked Clearance Docket</span>
                <p className="font-bold text-slate-900 text-xs">{defaultApplicationTitle}</p>
                <span className="text-[10px] font-mono text-teal-700 font-semibold">{defaultApplicationId}</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Appeal / Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="SLA_DELAY">Statutory SLA Exceeded Without Official Order</option>
                  <option value="DOCUMENT_DISPUTE">Repeated Scrutiny Loops / Disputed Document Rejection</option>
                  <option value="INSPECTION_DELAY">Inspector Failure to Conduct Scheduled Joint Audit</option>
                  <option value="ILLEGAL_FEE">Demanded Fee Differs from Maharashtra RTS Schedule</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Detailed Statement of Facts</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the dates, notices received, and reasons why statutory rights under the RTS Act 2015 were impaired..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setDescription(
                    "Our application for Consent to Establish (CTE) has been pending with MPCB SRO Pimpri-Chinchwad since 12 September 2026. The statutory 45-day timeframe under Maharashtra Right to Public Services Act 2015 (Notification No. RTS-2015/CR-29) is at risk due to an unaddressed mass balance query. We request intervention from the First Appellate Authority."
                  )
                }
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
              >
                Auto-fill Sample RTS Act Appeal Text
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Lodging Appeal...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Lodge Statutory RTS Appeal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Submission Success State */
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-950">
                Statutory First Appeal Lodged Successfully
              </h4>
              <p className="text-emerald-800 text-[11px]">
                Case Reference Number: <strong className="font-mono">{submittedCaseId}</strong>
              </p>
            </div>

            <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                Statutory Escalation Timeline:
              </span>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>1. Appeal Registered on RTS Maharashtra Portal (Just Now)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-teal-600" />
                  <span>2. Notice to SRO Pimpri-Chinchwad (Within 48 Hours)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>3. Appellate Hearing &amp; Binding Decision Order (Within 30 Days)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
              >
                Close &amp; Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
