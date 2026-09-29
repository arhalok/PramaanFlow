"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Layers,
  MapPin,
  RefreshCw,
  Scale,
  Sparkles,
  X,
  FileText
} from "lucide-react";
import { ProjectTwin } from "@/lib/regulatory-data";

interface ProjectChangeImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTwin;
  onConfirmChange: (updatedParams: { capacity: number; location: string; investment: number }) => void;
}

export function ProjectChangeImpactModal({
  isOpen,
  onClose,
  project,
  onConfirmChange
}: ProjectChangeImpactModalProps) {
  const [newCapacity, setNewCapacity] = useState<number>(150); // Escalated from 100 TPD
  const [newLocation, setNewLocation] = useState<string>("Butibori Industrial Area, Nagpur");
  const [newInvestment, setNewInvestment] = useState<number>(210);

  if (!isOpen) return null;

  const isCapacityEscalated = newCapacity >= 150;
  const isLocationChanged = newLocation !== project.district;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Project Attribute Change • Blast Radius &amp; Impact Preview
              </h3>
              <p className="text-[11px] text-slate-500">
                Flow 22 &amp; Wow #9: System reasons about regulatory impact before modifying your active docket
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Change Inputs */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
            Simulate Modified Project Parameters:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Production Capacity</label>
              <select
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value={100}>100 TPD (Current - Baseline)</option>
                <option value={150}>150 TPD (EIA Cat A Trigger)</option>
                <option value={200}>200 TPD (Mega Unit Escalation)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Site Location</label>
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="Chakan MIDC Phase II, Pune">Chakan MIDC (Pune SRO)</option>
                <option value="Butibori Industrial Area, Nagpur">Butibori MIDC (Nagpur RO)</option>
                <option value="Waluj MIDC, Chhatrapati Sambhajinagar">Waluj MIDC (Marathwada)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Capital Outlay (₹ Cr)</label>
              <input
                type="number"
                value={newInvestment}
                onChange={(e) => setNewInvestment(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Impact Blast Radius Results */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Approval Plan Impact Identified:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Modifying capacity to <strong>{newCapacity} TPD</strong> and location to <strong>{newLocation}</strong> triggers 2 new statutory approvals and shifts jurisdiction from Pune to Nagpur.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Affected Clearances &amp; Rule Shifts:
            </h4>

            {isCapacityEscalated && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-2.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono mt-0.5">
                  +NEW
                </span>
                <div>
                  <span className="font-bold text-slate-900">Central EIA Category A Clearance (MoEFCC)</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Synthetic organic chemical units &gt;100 TPD escalate from State SEAC to Central Ministry appraisal with mandatory 45-day public hearing.
                  </p>
                </div>
              </div>
            )}

            {isCapacityEscalated && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-2.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono mt-0.5">
                  +NEW
                </span>
                <div>
                  <span className="font-bold text-slate-900">CGWA Deep Groundwater Extraction NOC</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Water requirement exceeding 150 KLD in non-notified aquifers requires Central Ground Water Authority piezometer telemetry installation.
                  </p>
                </div>
              </div>
            )}

            {isLocationChanged && (
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start gap-2.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono mt-0.5">
                  JURISDICTION SHIFT
                </span>
                <div>
                  <span className="font-bold text-slate-900">Pollution Board SRO Re-routed</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Applications transferred from <strong>MPCB SRO Pimpri-Chinchwad</strong> to <strong>MPCB Regional Office Nagpur-I</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            Keep Existing Plan
          </button>

          <button
            onClick={() => {
              onConfirmChange({
                capacity: newCapacity,
                location: newLocation,
                investment: newInvestment
              });
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Apply Changes &amp; Re-Plan Docket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
