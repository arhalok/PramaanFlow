"use client";

import React, { useState } from "react";
import { H3CellData, H3_CELLS_DATA, REGULATORY_DIFF_DATA } from "@/lib/regulatory-data";
import {
  MapPin,
  Layers,
  Shield,
  Compass,
  Eye,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Info,
  Sparkles
} from "lucide-react";

interface H3RegulatoryMapProps {
  onLocationSelected?: (loc: { lat: number; lng: number; zoneName: string }) => void;
  highlightImpactProjects?: boolean;
}

export function H3RegulatoryMap({
  onLocationSelected,
  highlightImpactProjects = false
}: H3RegulatoryMapProps) {
  const [selectedCell, setSelectedCell] = useState<H3CellData>(H3_CELLS_DATA[0]);
  const [activePin, setActivePin] = useState<{ lat: number; lng: number; name: string }>({
    lat: 26.7825,
    lng: 75.8362,
    name: "Sitapura Industrial Area Phase IV, Jaipur"
  });

  // Layer toggles
  const [showH3Grid, setShowH3Grid] = useState<boolean>(true);
  const [showProjects, setShowProjects] = useState<boolean>(true);
  const [showInspections, setShowInspections] = useState<boolean>(true);
  const [showEcoBuffers, setShowEcoBuffers] = useState<boolean>(true);

  // Pin drop simulation state
  const [pinDropProcessing, setPinDropProcessing] = useState<boolean>(false);
  const [spatialAnalysisResult, setSpatialAnalysisResult] = useState<any>(null);

  const handleSelectZone = (cell: H3CellData) => {
    setSelectedCell(cell);
    setActivePin({
      lat: cell.center.lat,
      lng: cell.center.lng,
      name: cell.zoneName
    });

    setPinDropProcessing(true);
    setSpatialAnalysisResult(null);

    setTimeout(() => {
      setPinDropProcessing(false);
      setSpatialAnalysisResult({
        approvalsCount: 12,
        inspectionsCount: 4,
        documentsCount: 9,
        conditionsCount: 3,
        schemesCount: 2,
        jurisdiction: "RIICO Regional Office & RSPCB South",
        groundwater: cell.groundwaterStatus
      });
      onLocationSelected?.({
        lat: cell.center.lat,
        lng: cell.center.lng,
        zoneName: cell.zoneName
      });
    }, 400);
  };

  const getIntensityBadge = (intensity: H3CellData["regulatoryIntensity"]) => {
    switch (intensity) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "HIGH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "MEDIUM":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-teal-600" />
            <span>Open Spatial PostGIS &amp; H3 Engine</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Click any industrial cluster or H3 cell to trigger spatial regulatory evaluation
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={showH3Grid}
              onChange={(e) => setShowH3Grid(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-0"
            />
            <span>H3 Hex Grid</span>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={showProjects}
              onChange={(e) => setShowProjects(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-0"
            />
            <span>Active Projects</span>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={showInspections}
              onChange={(e) => setShowInspections(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-0"
            />
            <span>Inspections</span>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={showEcoBuffers}
              onChange={(e) => setShowEcoBuffers(e.target.checked)}
              className="rounded border-slate-300 text-amber-600 focus:ring-0"
            />
            <span>Eco Buffers</span>
          </label>
        </div>
      </div>

      {/* Main Map Workspace: Visual GIS Canvas + Side Regulatory Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive GIS Vector Canvas (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 p-4 relative overflow-hidden bg-slate-50 min-h-[460px] flex flex-col justify-between shadow-xs">
          
          {/* Subtle GIS Map Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#0284c7 1px, transparent 1px), linear-gradient(90deg, #0284c7 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />

          {/* Map Top Status Bar */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-slate-700 text-[11px] font-semibold">
                PROJECTION: EPSG:4326 (WGS84) • H3 RES 8 (0.737 km²)
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
              PIN: {activePin.lat.toFixed(4)}°N, {activePin.lng.toFixed(4)}°E
            </div>
          </div>

          {/* Interactive Vector GIS Canvas */}
          <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
            <svg
              viewBox="0 0 700 360"
              className="w-full h-full max-h-[360px] select-none filter drop-shadow-sm"
            >
              {/* Base background with subtle geographic highway lines */}
              <rect width="100%" height="100%" fill="#ffffff" rx="12" stroke="#e2e8f0" strokeWidth="1" />
              
              <path
                d="M 50,180 Q 200,160 400,200 T 650,150"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="4"
                strokeDasharray="4 2"
              />
              <text x="320" y="175" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                NH-48 Jaipur-Ajmer Expressway
              </text>

              <path
                d="M 350,30 L 350,330"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
              <text x="360" y="80" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Tonk Road Corridor (NH-52)
              </text>

              {/* Eco-sensitive buffers */}
              {showEcoBuffers && (
                <g opacity="0.6">
                  <circle cx="530" cy="90" r="45" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="495" y="93" fill="#065f46" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Nahargarh Eco Buffer</text>

                  <path d="M 120,240 Q 220,280 340,260" fill="none" stroke="#bae6fd" strokeWidth="6" opacity="0.8" />
                  <text x="180" y="275" fill="#0369a1" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Dravyavati Catchment</text>
                </g>
              )}

              {/* H3 Hexagonal Grid Cells */}
              {showH3Grid && (
                <g>
                  {/* Sitapura Phase IV Cell */}
                  <g
                    onClick={() => handleSelectZone(H3_CELLS_DATA[0])}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <polygon
                      points="420,200 455,220 455,260 420,280 385,260 385,220"
                      fill={selectedCell.h3Index === H3_CELLS_DATA[0].h3Index ? "#ccfbf1" : "#f1f5f9"}
                      stroke="#0d9488"
                      strokeWidth={selectedCell.h3Index === H3_CELLS_DATA[0].h3Index ? "2.5" : "1.5"}
                      opacity="0.9"
                    />
                    <text x="400" y="243" fill="#0f766e" fontSize="10" fontWeight="bold">
                      Sitapura
                    </text>
                    <text x="403" y="255" fill="#0d9488" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      HIGH INT.
                    </text>
                  </g>

                  {/* Phagi Renewable Corridor Cell */}
                  <g
                    onClick={() => handleSelectZone(H3_CELLS_DATA[1])}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <polygon
                      points="240,240 275,260 275,300 240,320 205,300 205,260"
                      fill={selectedCell.h3Index === H3_CELLS_DATA[1].h3Index ? "#e0f2fe" : "#f8fafc"}
                      stroke="#0284c7"
                      strokeWidth={selectedCell.h3Index === H3_CELLS_DATA[1].h3Index ? "2.5" : "1.2"}
                      opacity="0.9"
                    />
                    <text x="228" y="283" fill="#0369a1" fontSize="9" fontWeight="bold">
                      Phagi
                    </text>
                  </g>

                  {/* Bindayaka & Bagru Cell */}
                  <g
                    onClick={() => handleSelectZone(H3_CELLS_DATA[2])}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <polygon
                      points="200,120 235,140 235,180 200,200 165,180 165,140"
                      fill={selectedCell.h3Index === H3_CELLS_DATA[2].h3Index ? "#ffe4e6" : "#fff1f2"}
                      stroke="#e11d48"
                      strokeWidth={selectedCell.h3Index === H3_CELLS_DATA[2].h3Index ? "2.5" : "1.5"}
                      opacity="0.9"
                    />
                    <text x="182" y="163" fill="#9f1239" fontSize="9" fontWeight="bold">
                      Bindayaka
                    </text>
                    <text x="180" y="174" fill="#be123c" fontSize="7" fontFamily="monospace" fontWeight="bold">
                      CRITICAL
                    </text>
                  </g>

                  {/* VKIA Industrial Area Cell */}
                  <g
                    onClick={() => handleSelectZone(H3_CELLS_DATA[3])}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <polygon
                      points="400,60 435,80 435,120 400,140 365,120 365,80"
                      fill={selectedCell.h3Index === H3_CELLS_DATA[3].h3Index ? "#fef3c7" : "#fffbeb"}
                      stroke="#d97706"
                      strokeWidth={selectedCell.h3Index === H3_CELLS_DATA[3].h3Index ? "2.5" : "1.5"}
                      opacity="0.9"
                    />
                    <text x="388" y="103" fill="#92400e" fontSize="10" fontWeight="bold">
                      VKIA
                    </text>
                  </g>
                </g>
              )}

              {/* Active Projects Markers */}
              {showProjects && (
                <g>
                  {/* Apex Pharma Pin at Sitapura */}
                  <g transform="translate(420, 235)">
                    <circle r="7" fill="#0284c7" />
                    <circle r="3.5" fill="#ffffff" />
                  </g>

                  {/* Solar Park Pin at Phagi */}
                  <g transform="translate(240, 275)">
                    <circle r="5" fill="#0891b2" />
                    <circle r="2.5" fill="#ffffff" />
                  </g>

                  {/* Agro hub at Bindayaka */}
                  <g transform="translate(200, 155)">
                    <circle r="5" fill="#e11d48" />
                    <circle r="2.5" fill="#ffffff" />
                  </g>
                </g>
              )}

              {/* Highlight Impact Projects if Regulatory Diff Mode is active */}
              {highlightImpactProjects && (
                <g>
                  {REGULATORY_DIFF_DATA.affectedProjects.map((prj, i) => (
                    <g key={prj.id} transform={`translate(${160 + i * 110}, ${110 + (i % 2) * 90})`}>
                      <circle r="12" fill="none" stroke="#e11d48" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                      <circle r="6" fill="#e11d48" />
                      <text x="10" y="4" fill="#9f1239" fontSize="8" fontWeight="bold">
                        {prj.name.split(" ")[0]}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Scheduled Inspections Markers */}
              {showInspections && (
                <g>
                  <g transform="translate(440, 250)">
                    <rect x="-4" y="-4" width="8" height="8" fill="#10b981" rx="2" />
                  </g>
                  <g transform="translate(215, 170)">
                    <rect x="-4" y="-4" width="8" height="8" fill="#10b981" rx="2" />
                  </g>
                </g>
              )}

              {/* Active User Dropped Pin */}
              <g transform="translate(420, 235)">
                <path
                  d="M 0,0 L 0,-18 A 6,6 0 1,1 0,-30 A 6,6 0 0,1 0,-18 Z"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-24" r="2.5" fill="#ffffff" />
              </g>
            </svg>
          </div>

          {/* Map Bottom Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600"></span> Active Project Twin
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-emerald-600"></span> Statutory Inspection
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-600"></span> Critical Zone
              </span>
            </div>

            <div className="text-slate-500 font-semibold italic">
              PostGIS + H3 Spatial Indexing (100% Free &amp; Open Source)
            </div>
          </div>
        </div>

        {/* Right: Contextual Regulatory Cell & Spatial Fingerprint (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>H3 Cell Regulatory Intelligence</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getIntensityBadge(selectedCell.regulatoryIntensity)}`}>
              {selectedCell.regulatoryIntensity} INTENSITY
            </span>
          </div>

          {/* Cell Overview Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                Spatial H3 Index: #{selectedCell.h3Index}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedCell.zoneName}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Dominant Sector: <strong className="text-slate-900">{selectedCell.dominantSector}</strong>
              </p>
            </div>

            {/* Cell Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Projects</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{selectedCell.activeProjects}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Applications</span>
                <span className="text-base font-bold text-teal-700 mt-0.5 block">{selectedCell.pendingApplications}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Inspections</span>
                <span className="text-base font-bold text-emerald-700 mt-0.5 block">{selectedCell.scheduledInspections}</span>
              </div>
            </div>

            {/* Environmental & Groundwater Status */}
            <div className="space-y-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                <Shield className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold font-mono">Eco-Buffer Status</span>
                  <span className="text-slate-800 font-medium">{selectedCell.environmentalBuffer}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold font-mono">Groundwater Table</span>
                  <span className="text-slate-800 font-medium">{selectedCell.groundwaterStatus}</span>
                </div>
              </div>
            </div>

            {/* Signature Pin Drop Evaluation Result */}
            {pinDropProcessing ? (
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-teal-500 animate-ping"></span>
                <span>Running PostGIS spatial overlay &amp; rule evaluation...</span>
              </div>
            ) : spatialAnalysisResult ? (
              <div className="p-3 rounded-lg bg-white border border-emerald-300 text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 font-bold text-[11px]">
                  <span>Site Evaluation Complete</span>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                  <div>Approvals: <strong className="text-slate-900">{spatialAnalysisResult.approvalsCount}</strong></div>
                  <div>Inspections: <strong className="text-slate-900">{spatialAnalysisResult.inspectionsCount}</strong></div>
                  <div>Documents: <strong className="text-slate-900">{spatialAnalysisResult.documentsCount}</strong></div>
                  <div>Schemes: <strong className="text-emerald-700 font-bold">{spatialAnalysisResult.schemesCount} Eligible</strong></div>
                </div>
              </div>
            ) : null}

            {/* Quick Switch Buttons for Zones */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-600 block mb-2 font-semibold">Select Industrial Cluster:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {H3_CELLS_DATA.map((c) => (
                  <button
                    key={c.h3Index}
                    onClick={() => handleSelectZone(c)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] truncate transition-colors border font-medium ${
                      selectedCell.h3Index === c.h3Index
                        ? "bg-teal-600 text-white border-teal-600 font-semibold shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    {c.zoneName.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
