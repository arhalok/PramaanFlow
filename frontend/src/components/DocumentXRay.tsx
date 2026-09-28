"use client";

import React, { useState } from "react";
import { DocumentEvidenceItem, INITIAL_PROJECT } from "@/lib/regulatory-data";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  Search,
  ExternalLink,
  Eye,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";

export function DocumentXRay() {
  const [documents, setDocuments] = useState<DocumentEvidenceItem[]>(INITIAL_PROJECT.documents);
  const [selectedDoc, setSelectedDoc] = useState<DocumentEvidenceItem>(documents[0]);
  const [inspectingInconsistency, setInspectingInconsistency] = useState<boolean>(false);
  const [resolvedIssue, setResolvedIssue] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const handleSimulateUpload = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 1200);
  };

  const handleResolveInconsistency = () => {
    setResolvedIssue(true);
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === "DOC-EIA-REPORT") {
          return {
            ...doc,
            status: "VERIFIED",
            extractedEntities: {
              ...doc.extractedEntities,
              reportedCapacity: "100 TPD (Reconciled with Form 1)"
            },
            crossDocConsistency: undefined
          };
        }
        return doc;
      })
    );
    setInspectingInconsistency(false);
  };

  const flaggedDoc = documents.find((d) => d.status === "INCONSISTENCY_FLAGGED");

  return (
    <div className="space-y-6">
      {/* Top Banner: Application Readiness Scorecard */}
      <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                PRE-SUBMISSION INTELLIGENCE
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Docling &amp; Optical Entity X-Ray
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pre-Submission Document X-Ray &amp; Consistency Engine
            </h2>
            <p className="text-xs text-slate-600">
              Cross-document validation parses uploaded DPRs, Forms &amp; NOCs to eliminate query loops before submission.
            </p>
          </div>

          {/* Readiness Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Required Docs</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">3 / 3</p>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Uploaded</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Required Fields</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">42 / 42</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Verified</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Cross-Doc Checks</span>
              <p className={`text-base font-bold mt-0.5 ${resolvedIssue ? "text-emerald-700" : "text-amber-800"}`}>
                {resolvedIssue ? "10 / 10" : "9 / 10"}
              </p>
              <span className="text-[10px] text-slate-600 font-medium">
                {resolvedIssue ? "All Consistent" : "1 Inconsistency"}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 font-medium">Submission State</span>
              <p className={`text-base font-bold mt-0.5 ${resolvedIssue ? "text-emerald-700" : "text-amber-800"}`}>
                {resolvedIssue ? "100% READY" : "ACTION REQ"}
              </p>
              <span className="text-[10px] text-slate-600 font-medium">
                {resolvedIssue ? "Zero Defect" : "1 Flagged"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Callout if Inconsistency exists */}
        {!resolvedIssue && flaggedDoc && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
              <span>
                <strong>Cross-Document Conflict Detected:</strong> Capacity value in{" "}
                <span className="underline font-semibold">{flaggedDoc.title}</span> contradicts the Application Form.
              </span>
            </div>

            <button
              onClick={() => setInspectingInconsistency(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              Inspect &amp; Resolve Issue
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Grid: Document List & Evidence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Document List & Upload Dropzone */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>Parsed Statutory Filings ({documents.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Optical Extraction</span>
          </div>

          {/* Upload Dropzone Simulator */}
          <div
            onClick={handleSimulateUpload}
            className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 bg-white hover:bg-teal-50/20 cursor-pointer text-center transition-all group shadow-sm"
          >
            <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-teal-600 mx-auto transition-colors" />
            <p className="text-xs text-slate-800 font-medium mt-1.5">
              {isParsing ? "Docling Parser Running..." : "Upload New Statutory Filing"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports PDF, DWG Engineering Drawings, Land Khasra Extracts
            </p>
            {isParsing && (
              <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-teal-600 h-full w-2/3 animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Documents Card List */}
          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              const isFlagged = doc.status === "INCONSISTENCY_FLAGGED";

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    if (isFlagged) setInspectingInconsistency(true);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "border-teal-600 bg-teal-50/40 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <FileText className={`h-4 w-4 mt-0.5 shrink-0 ${isFlagged ? "text-amber-600" : "text-teal-600"}`} />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.category.replace(/_/g, " ")} • {doc.pageCount} Pages
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                        isFlagged
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {isFlagged ? "CONFLICT" : "VERIFIED"}
                    </span>
                  </div>

                  {/* Micro entities preview */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <div>Capacity: <span className="text-slate-900 font-mono font-medium">{doc.extractedEntities.reportedCapacity}</span></div>
                    <div>Inv: <span className="text-slate-900 font-mono font-medium">{doc.extractedEntities.investmentInr}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Optical Entity Inspector & PDF Evidence Viewer (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-600" />
              <span>Optical Entity Extraction &amp; Evidence Audit</span>
            </h3>
            <span className="text-[11px] font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">DocID: {selectedDoc.id}</span>
          </div>

          {/* Extracted Entities Grid */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
            <span className="text-xs font-semibold text-slate-900 block">
              Extracted Legal Entities ({selectedDoc.title})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Entity / Company</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedDoc.extractedEntities.companyName}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Site Address &amp; Jurisdiction</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedDoc.extractedEntities.siteAddress}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Reported Daily Capacity</span>
                <p className={`font-semibold mt-0.5 ${selectedDoc.crossDocConsistency ? "text-amber-800 font-bold" : "text-slate-900"}`}>
                  {selectedDoc.extractedEntities.reportedCapacity}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Declared Capital Investment</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedDoc.extractedEntities.investmentInr}</p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Inconsistency Deep Dive or Document Preview */}
          {inspectingInconsistency && selectedDoc.crossDocConsistency ? (
            <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/40 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Cross-Document Discrepancy X-Ray
                    </h4>
                    <p className="text-xs text-amber-800 font-medium">
                      Automated optical check detected mismatch between statutory filings
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Risk Score: {selectedDoc.crossDocConsistency.riskScore}/100
                </span>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Document A */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-teal-700 font-semibold">
                    Document A (Application Form &amp; DPR)
                  </span>
                  <p className="font-semibold text-slate-900">Declared Capacity: 100 TPD</p>
                  <p className="text-[11px] text-slate-600">
                    Source: Form 1 statutory declaration filed on Raj Nivesh portal.
                  </p>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700">
                    "Page 4, Table 2.1: Nominal active ingredient output: 100 MT/Day."
                  </div>
                </div>

                {/* Document B */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-amber-800 font-semibold">
                    Document B ({selectedDoc.title})
                  </span>
                  <p className="font-bold text-amber-900">Found Value: 150 TPD</p>
                  <p className="text-[11px] text-slate-600">
                    Source: Baseline EIA Hydrogeological Mass Balance annexure.
                  </p>
                  <div className="p-2 rounded bg-white border border-amber-200 font-mono text-[10px] text-amber-900">
                    "Annexure 3, Row 9: Peak reactor vessel capacity design: 150 MT/Day."
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900 block mb-1">Impact Analysis:</span>
                If submitted with this discrepancy, the RSPCB scrutinizing officer will issue a formal Section 25 clarification query, causing a <strong className="text-slate-900">16-24 day approval delay</strong> and stalling subsequent fire and factory clearances.
              </div>

              {/* Resolution Action */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setInspectingInconsistency(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-medium"
                >
                  Dismiss Inspector
                </button>

                <button
                  onClick={handleResolveInconsistency}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Auto-Reconcile EIA Annexure to 100 TPD</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Document Previewer */
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm min-h-[220px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-emerald-600" />
                    <span>Optical Scan Preview — {selectedDoc.title}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Rendered via Open-Source PDF.js</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-1.5">
                  <p className="text-slate-500">// Header Metadata Verified</p>
                  <p>REGISTERED OCCUPIER: Apex LifeSciences Healthcare Pvt. Ltd.</p>
                  <p>PLOT NO: E-142, RIICO Industrial Area Phase IV, Sitapura, Jaipur</p>
                  <p>KHASRA: 412/1, 412/2 (Industrial Land Allotment Deed)</p>
                  <p>TOTAL EFFLUENT DISCHARGE: 140 KLD (To be treated in 100% ZLD System)</p>
                  <p className="text-emerald-700 font-semibold">// Digital Signatures &amp; QR Validation: OK</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Verification State: <strong className="text-emerald-700">Fully Compliant</strong></span>
                <span className="text-[11px] font-medium text-slate-500">Ready for State Scrutiny Desk</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
