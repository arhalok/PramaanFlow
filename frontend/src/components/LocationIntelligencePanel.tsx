"use client";

import React, { useState } from "react";
import {
  MapPin, Building2, Leaf, Landmark, CheckCircle2, AlertCircle,
  ExternalLink, Info, ChevronDown, ChevronUp, FileText,
  Shield, Zap, Navigation, Globe, Clock, ArrowRight, Loader2, Sparkles, X
} from "lucide-react";
import { LocationAnalysisResult, ApplicableAuthority, ApplicableService } from "@/lib/maharashtra-geospatial";

interface LocationIntelligencePanelProps {
  result: LocationAnalysisResult | null;
  loading: boolean;
  onExplainAuthority?: (authority: ApplicableAuthority) => void;
  onViewServices?: () => void;
}

function SourceBadge({ sourceType, sourceName }: { sourceType: string; sourceName: string }) {
  const isOfficial = sourceType === "official_geometry";
  return (
    <span
      title={`Source: ${sourceName}`}
      className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
        isOfficial
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <Globe className="h-2.5 w-2.5" />
      {isOfficial ? "Official GIS" : "Official Text"}
    </span>
  );
}

function SectionHeader({ icon, label, color = "teal" }: { icon: React.ReactNode; label: string; color?: string }) {
  const colorMap: Record<string, string> = {
    teal: "text-teal-700 bg-teal-50 border-teal-200",
    blue: "text-blue-700 bg-blue-50 border-blue-200",
    green: "text-green-700 bg-green-50 border-green-200",
    orange: "text-orange-700 bg-orange-50 border-orange-200",
    purple: "text-purple-700 bg-purple-50 border-purple-200",
  };
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border mb-2 ${colorMap[color] || colorMap.teal}`}>
      <span className="h-4 w-4 flex-shrink-0">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function DataRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] text-slate-500 font-medium shrink-0 min-w-[110px]">{label}</span>
      <div className="text-right">
        <span className="text-[11px] font-semibold text-slate-800 leading-tight">{value}</span>
        {sub && <div className="text-[9px] text-slate-400 font-mono mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export function LocationIntelligencePanel({
  result,
  loading,
  onExplainAuthority,
  onViewServices
}: LocationIntelligencePanelProps) {
  const [expandedAuth, setExpandedAuth] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-slate-400">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-teal-100 border-t-teal-500 animate-spin" />
          <MapPin className="h-5 w-5 text-teal-600 absolute inset-0 m-auto" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-600">Analyzing Location</div>
          <div className="text-xs text-slate-400 mt-1">Running spatial analysis…</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-slate-300">
        <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <MapPin className="h-7 w-7 text-slate-300" />
        </div>
        <div className="text-center px-4">
          <div className="text-sm font-semibold text-slate-400">Select a Location</div>
          <div className="text-xs text-slate-300 mt-1 leading-relaxed">
            Click anywhere on the map or use a preset scenario to analyse jurisdictions
          </div>
        </div>
      </div>
    );
  }

  const { administrative, industrial, environmental, planning, localAuthority, applicableAuthorities, applicableServices, nearbyContext, dataSources } = result;
  const activeServices = applicableServices.filter(s => !s.isExempted);
  const exemptedServices = applicableServices.filter(s => s.isExempted);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-2xl">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-teal-200 shrink-0" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-200 mb-0.5">Location Analysis</div>
            <div className="text-sm font-bold leading-tight">{result.location.formattedAddress}</div>
            <div className="text-[10px] text-teal-200 mt-1 font-mono">
              {result.location.lat.toFixed(4)}°N, {result.location.lng.toFixed(4)}°E
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5 text-teal-200" />
            {applicableAuthorities.length} Authorities
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 text-teal-200" />
            {activeServices.length} Services
          </div>
          {industrial.insideMidc && (
            <div className="flex items-center gap-1.5 bg-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
              Inside MIDC
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">

        {/* Administrative */}
        {administrative && (
          <div>
            <SectionHeader icon={<Landmark className="h-4 w-4" />} label="Administrative" color="blue" />
            <div className="bg-slate-50/80 rounded-xl px-3 py-1 border border-slate-100">
              <DataRow label="State" value={administrative.state} />
              <DataRow label="District" value={administrative.district} />
              <DataRow label="Taluka" value={administrative.taluka} />
              {localAuthority && <DataRow label="Local Body" value={localAuthority.name} sub={localAuthority.type.replace(/_/g, " ")} />}
            </div>
            <div className="flex justify-end mt-1">
              <SourceBadge sourceType={administrative.sourceType} sourceName={administrative.source} />
            </div>
          </div>
        )}

        {/* Industrial */}
        <div>
          <SectionHeader icon={<Building2 className="h-4 w-4" />} label="Industrial" color="teal" />
          <div className="bg-slate-50/80 rounded-xl px-3 py-1 border border-slate-100">
            <DataRow
              label="MIDC Area"
              value={industrial.insideMidc ? (industrial.industrialArea || "MIDC Notified") : "Outside MIDC"}
            />
            {industrial.insideMidc && (
              <>
                <DataRow label="Region" value={industrial.midcRegion || "—"} />
                <DataRow label="Planning Authority" value="MIDC (Special Planning Authority)" sub="Sec 40(1) MRTP Act 1966" />
                <DataRow label="CETP Available" value={industrial.cetpAvailable ? "Yes" : "No"} />
                <DataRow label="EE Division" value={industrial.executiveEngineerDivision || "—"} />
              </>
            )}
            {!industrial.insideMidc && (
              <DataRow label="Land Status" value="Agricultural / Revenue Land" sub="NA Conversion Required (Sec 44 MLRC)" />
            )}
          </div>
          <div className="flex justify-end mt-1">
            <SourceBadge sourceType={industrial.sourceType} sourceName={industrial.source} />
          </div>
        </div>

        {/* Environmental */}
        {environmental && (
          <div>
            <SectionHeader icon={<Leaf className="h-4 w-4" />} label="Environment" color="green" />
            <div className="bg-slate-50/80 rounded-xl px-3 py-1 border border-slate-100">
              <DataRow label="Authority" value="Maharashtra Pollution Control Board" />
              <DataRow label="Regional Office" value={environmental.regionalOffice} />
              <DataRow label="Sub-Regional Office" value={environmental.subRegionalOffice} />
              <DataRow label="Basis" value={environmental.jurisdictionBasis} />
            </div>
            <div className="flex justify-end mt-1">
              <SourceBadge sourceType={environmental.sourceType} sourceName={environmental.source} />
            </div>
          </div>
        )}

        {/* Planning */}
        {planning && (
          <div>
            <SectionHeader icon={<Globe className="h-4 w-4" />} label="Planning" color="purple" />
            <div className="bg-slate-50/80 rounded-xl px-3 py-1 border border-slate-100">
              <DataRow label="Planning Body" value={planning.authority} />
              <DataRow label="Role" value={planning.role} />
              <DataRow label="Regulations" value={planning.buildingRuleType} />
            </div>
          </div>
        )}

        {/* Nearby Context */}
        {(nearbyContext.highways.length > 0 || nearbyContext.railways.length > 0 || nearbyContext.waterBodies.length > 0) && (
          <div>
            <SectionHeader icon={<Navigation className="h-4 w-4" />} label="Nearby Context (OSM)" color="orange" />
            <div className="space-y-1.5">
              {nearbyContext.highways.slice(0, 2).map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-orange-50/60 rounded-lg px-3 py-2 border border-orange-100">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-5 bg-orange-400 rounded-full" />
                    <span className="text-[11px] font-medium text-slate-700 truncate max-w-[140px]">{h.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{h.distanceKm} km</span>
                </div>
              ))}
              {nearbyContext.railways.slice(0, 1).map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-5 bg-slate-500 rounded-full" />
                    <span className="text-[11px] font-medium text-slate-700 truncate max-w-[140px]">{r.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{r.distanceKm} km</span>
                </div>
              ))}
              {nearbyContext.waterBodies.slice(0, 1).map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-blue-50/60 rounded-lg px-3 py-2 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-5 bg-blue-400 rounded-full" />
                    <span className="text-[11px] font-medium text-slate-700 truncate max-w-[140px]">{w.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{w.distanceKm} km</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applicable Authorities */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <SectionHeader icon={<Shield className="h-4 w-4" />} label={`Authorities (${applicableAuthorities.length})`} color="teal" />
          </div>
          <div className="space-y-2">
            {applicableAuthorities.map((auth) => (
              <div
                key={auth.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <button
                  className="w-full flex items-start gap-2.5 p-3 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedAuth(expandedAuth === auth.id ? null : auth.id)}
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">{auth.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{auth.role}</div>
                  </div>
                  {expandedAuth === auth.id
                    ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-1" />
                    : <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-1" />
                  }
                </button>
                {expandedAuth === auth.id && (
                  <div className="px-3 pb-3 border-t border-slate-100 pt-2 space-y-2">
                    <div className="text-[10px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-700">Why this applies:</strong> This authority has jurisdiction over your selected location based on official boundary data.
                    </div>
                    <div className="flex items-center justify-between">
                      <SourceBadge sourceType={auth.sourceType} sourceName={auth.source} />
                      <div className="flex items-center gap-2">
                        {onExplainAuthority && (
                          <button
                            onClick={() => onExplainAuthority(auth)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 hover:text-purple-700 px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 transition-colors"
                          >
                            <Sparkles className="h-3 w-3" /> Explain Why
                          </button>
                        )}
                        <a
                          href={auth.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-semibold text-teal-600 hover:text-teal-700 px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> Visit
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View Services CTA */}
        <button
          onClick={onViewServices}
          className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl px-4 py-3.5 font-semibold text-sm transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4" />
            <div className="text-left">
              <div className="text-sm font-bold">View Applicable Services</div>
              <div className="text-[10px] text-teal-200 font-normal">
                {activeServices.length} required · {exemptedServices.length} exempted
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Data Sources */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Info className="h-3 w-3" /> Data Sources
          </div>
          <div className="space-y-1.5">
            {dataSources.map((ds, i) => (
              <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-[10px] font-semibold text-slate-700">{ds.agency}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{ds.versionOrDate}</div>
                </div>
                <a href={ds.officialUrl} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-600 shrink-0 mt-0.5">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
