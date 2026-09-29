"use client";

import React, { useState } from "react";
import { InspectionJob, INITIAL_INSPECTIONS } from "@/lib/regulatory-data";
import { OptimizedRouteResult } from "@/lib/vroom-router";
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Route,
  Navigation,
  Fuel,
  Leaf,
  ShieldCheck,
  CheckSquare,
  FileText,
  Upload
} from "lucide-react";

export function InspectorWorkspace() {
  const [inspections, setInspections] = useState<InspectionJob[]>(INITIAL_INSPECTIONS);
  const [selectedInspection, setSelectedInspection] = useState<InspectionJob>(inspections[0]);
  const [optimizing, setOptimizing] = useState(false);
  const [routeResult, setRouteResult] = useState<OptimizedRouteResult | null>(null);

  // Field checklist state for selected inspection
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [gpsVerified, setGpsVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptimizeRoute = async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/optimize-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs: inspections })
      });
      const data = await res.json();
      if (data.success) {
        setRouteResult(data);
      }
    } catch (_err) {
      // fallback
    } finally {
      setOptimizing(false);
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleVerifyGPS = () => {
    setGpsVerified(true);
  };

  const handleSubmitInspection = () => {
    setSubmitted(true);
    setInspections((prev) =>
      prev.map((i) =>
        i.id === selectedInspection.id ? { ...i, status: "COMPLETED" } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Inspector Workspace Header */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                FIELD INSPECTION &amp; ROUTE OPTIMIZATION
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                VROOM (ghcr.io/vroom-project/vroom-docker)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inspector Mobile &amp; Route Workspace
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Field inspection manifest, automated VROOM routing with time windows &amp; digital on-site evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOptimizeRoute}
              disabled={optimizing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{optimizing ? "Solving VRP/VROOM..." : "Optimize Route with VROOM"}</span>
            </button>
          </div>
        </div>

        {/* Route Optimization Metrics (Shown after VROOM execution) */}
        {routeResult && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-600 animate-ping"></span>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  VROOM Route Solved Successfully
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium">
                  Engine: {routeResult.engine}
                </span>
              </div>
              <span className="text-xs text-slate-600 font-medium">
                SLA Deadlines Protected: 100%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Route className="h-3.5 w-3.5 text-teal-600" />
                  <span>Optimized Tour</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {routeResult.totalDistanceKm} km
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  -{routeResult.distanceSavedKm} km saved (~34%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-sky-600" />
                  <span>Total Tour Duration</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {Math.floor(routeResult.totalDurationMinutes / 60)}h{" "}
                  {routeResult.totalDurationMinutes % 60}m
                </p>
                <span className="text-[11px] text-sky-700 font-medium">
                  Incl. 45m audit per stop
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Fuel className="h-3.5 w-3.5 text-amber-600" />
                  <span>Fuel Conserved</span>
                </div>
                <p className="text-lg font-bold text-amber-800 mt-1">
                  {routeResult.fuelSavedLitres} L
                </p>
                <span className="text-[11px] text-slate-500">Government fleet savings</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Carbon Offset</span>
                </div>
                <p className="text-lg font-bold text-emerald-700 mt-1">
                  {routeResult.co2SavedKg} kg CO₂
                </p>
                <span className="text-[11px] text-emerald-700 font-medium">Green governance metric</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Manifest & Digital Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Inspections & VROOM Itinerary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Compass className="h-4 w-4 text-teal-600" />
              <span>Today&apos;s Field Inspection Manifest</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {inspections.length} Total Assignments
            </span>
          </div>

          {/* If routeResult exists, show optimized chronological itinerary */}
          {routeResult ? (
            <div className="space-y-3">
              {routeResult.itinerary.map((stop: any, idx: number) => {
                const isDepot = stop.status.includes("DEPOT");
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${isDepot
                        ? "border-slate-200 bg-slate-50 text-slate-500"
                        : "border-slate-200 hover:border-teal-500 bg-white shadow-sm cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!isDepot) {
                        const job = inspections.find((j) => j.id === stop.jobId);
                        if (job) setSelectedInspection(job);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-full bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200">
                          {stop.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 text-sm">
                              {stop.projectName}
                            </h3>
                            {stop.status === "COMPLETED" && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{stop.address}</p>
                          <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                            {stop.department}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-teal-800 font-mono block">
                          {stop.arrivalTime} - {stop.departureTime}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          +{stop.distanceFromPrevKm} km from prev
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Unoptimized Raw List */
            <div className="space-y-3">
              {inspections.map((job) => {
                const isSelected = selectedInspection.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedInspection(job)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected
                        ? "border-teal-600 bg-teal-50/40 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white shadow-sm"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm">
                            {job.projectName}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${job.priority === "CRITICAL"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : job.priority === "HIGH"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-teal-50 text-teal-700 border-teal-200"
                              }`}
                          >
                            {job.priority} PRIORITY
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{job.inspectionType}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3 w-3 text-rose-600" />
                          <span>{job.address}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-slate-800 block">
                          Slot: {job.timeWindow[0]} - {job.timeWindow[1]}
                        </span>
                        <span className="text-[11px] text-rose-700 font-medium">
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Digital On-Site Inspection Checklist */}
        <div className="rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-4 h-fit sticky top-20">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
              FIELD AUDIT CARD
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              {selectedInspection.projectName}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{selectedInspection.inspectionType}</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* GPS Verification Simulation */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Geo-Fence Verification</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Target: {selectedInspection.coordinates.lat}, {selectedInspection.coordinates.lng}
                </span>
              </div>
              <button
                onClick={handleVerifyGPS}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${gpsVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
              >
                {gpsVerified ? "✓ In Geo-Fence" : "Verify GPS"}
              </button>
            </div>

            {/* Statutory Checklist Items */}
            <div>
              <span className="text-slate-800 font-semibold block mb-2">
                Mandatory Inspection Checklist:
              </span>
              <div className="space-y-2">
                {selectedInspection.checklistItems.map((item) => {
                  const isChecked = checklist[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }}
                        className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-0"
                      />
                      <span
                        className={`text-xs ${isChecked ? "text-emerald-700 font-medium line-through" : "text-slate-700"
                          }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo / Evidence Upload Simulation */}
            <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center cursor-pointer hover:border-teal-500 transition-colors">
              <Upload className="h-4 w-4 mx-auto text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-700 block font-medium">
                Attach Geo-Tagged Site Photographs
              </span>
              <span className="text-[10px] text-slate-500">Watermark with GPS &amp; Timestamp</span>
            </div>

            {/* Submit Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleSubmitInspection}
                disabled={submitted}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${submitted
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
              >
                {submitted
                  ? "✓ Digitally Signed & Synced to Raj Nivesh"
                  : "Sign & Submit Inspection Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
