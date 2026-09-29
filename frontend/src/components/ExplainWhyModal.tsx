"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Loader2, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { ApplicableAuthority } from "@/lib/maharashtra-geospatial";

interface ExplainWhyModalProps {
  authority: ApplicableAuthority | null;
  locationAddress: string;
  onClose: () => void;
}

export function ExplainWhyModal({ authority, locationAddress, onClose }: ExplainWhyModalProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!authority || hasLoaded.current) return;
    hasLoaded.current = true;
    fetchExplanation();
  }, [authority]);

  const fetchExplanation = async () => {
    if (!authority) return;
    setLoading(true);
    setError(null);
    setExplanation("");

    try {
      const prompt = `You are a regulatory assistant for Maharashtra, India. 
Explain in plain, friendly language (3-4 sentences, no jargon) why the following government authority applies to a project at this location:

Location: ${locationAddress}
Authority: ${authority.name}
Authority Role: ${authority.role}
Data Source: ${authority.source}

Important rules:
- Do NOT invent any facts, URLs, or office names
- Explain only what you know from the provided data
- Use simple language an entrepreneur can understand
- Mention the data source briefly
- Do not guess or fabricate jurisdiction boundaries`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) throw new Error("AI explanation unavailable");

      // Stream response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE data
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "text-delta" && data.textDelta) {
                  fullText += data.textDelta;
                  setExplanation(fullText);
                }
              } catch {
                // non-JSON line, skip
              }
            }
          }
        }
      }

      if (!fullText) {
        // Fallback static explanation based on authority type
        setExplanation(generateStaticExplanation(authority, locationAddress));
      }
    } catch {
      setExplanation(generateStaticExplanation(authority, locationAddress));
    } finally {
      setLoading(false);
    }
  };

  if (!authority) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="p-2 rounded-xl bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-semibold text-purple-200 uppercase tracking-widest mb-0.5">AI Explanation</div>
            <div className="text-sm font-bold leading-tight">{authority.name}</div>
            <div className="text-[10px] text-purple-200 mt-1">{authority.role}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-100">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-700 font-medium">
            AI explains structured results only. Jurisdiction is determined by official GIS data, not AI.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="h-3.5 w-3.5 text-teal-500" />
            <span className="font-medium">Why does <strong className="text-slate-700">{authority.name}</strong> apply to your location?</span>
          </div>

          <div className="min-h-[80px] rounded-xl bg-slate-50 border border-slate-200 p-4">
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Generating explanation…</span>
              </div>
            )}
            {!loading && explanation && (
              <p className="text-sm text-slate-700 leading-relaxed">{explanation}</p>
            )}
          </div>

          {/* Source */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="h-4 w-4 text-blue-500 shrink-0 mt-0.5">ⓘ</div>
            <div>
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-0.5">Data Source</div>
              <div className="text-[11px] text-blue-700">{authority.source}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <a
              href={authority.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Official Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateStaticExplanation(authority: ApplicableAuthority, location: string): string {
  const explanations: Record<string, string> = {
    POLLUTION_CONTROL_BOARD: `The Maharashtra Pollution Control Board (MPCB) has jurisdiction over your selected location based on official gazette notifications that define regional and sub-regional office boundaries. Any industrial project at ${location} requires MPCB approval — specifically a Consent to Establish (CTE) before construction and a Consent to Operate (CTO) before starting production. These are mandatory under the Water Act 1974 and Air Act 1981.`,
    PLANNING_AUTHORITY: `This planning authority has statutory jurisdiction over your location based on official boundary notifications. They are responsible for approving building plans, development layouts, and land use permissions for your proposed project. All construction and development activities require their clearance before commencement.`,
    INDUSTRIAL_DEVELOPMENT_CORP: `MIDC (Maharashtra Industrial Development Corporation) has jurisdiction because your project location falls within a notified MIDC industrial estate boundary. As a Special Planning Authority (SPA) under Section 40(1) of the MRTP Act 1966, MIDC handles building approvals, water connections, and infrastructure services within this zone.`,
    ADMINISTRATIVE_REVENUE: `The District Collector's office has administrative jurisdiction over all land-related matters in this district. For industrial projects, this includes issuing Non-Agricultural (NA) land conversion permissions, certifying land ownership, and other revenue administration functions required for project establishment.`,
    SAFETY_INSPECTION_DIRECTORATE: `The Directorate of Industrial Safety & Health (DISH) has statutory jurisdiction over all manufacturing facilities under the Factories Act 1948. They review factory layout drawings, approve safety schematics, conduct safety inspections, and issue the Factory License required before starting operations.`,
    POWER_UTILITY: `MSEDCL (Maharashtra State Electricity Distribution Co. Ltd.) is the licensed electricity distribution company responsible for your area. They assess technical feasibility, approve load requirements, and provide the High Tension (HT) industrial power connection needed for manufacturing operations.`,
  };

  return explanations[authority.type] || 
    `This authority has jurisdiction over your location at ${location} based on official government boundary data (${authority.source}). Their role is: ${authority.role}. Please visit their official website for detailed information about the specific services and approvals they provide.`;
}
