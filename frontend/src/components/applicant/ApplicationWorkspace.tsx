"use client";

import React, { useState } from "react";
import {
  ApprovalNode,
  ProjectTwin
} from "@/lib/regulatory-data";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  MapPin,
  Building2,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Check,
  Eye,
  RefreshCw,
  FolderOpen,
  Scale
} from "lucide-react";

interface ApplicationWorkspaceProps {
  project: ProjectTwin;
  activeApproval?: ApprovalNode;
  onSubmitSuccess: (applicationId: string) => void;
  onCancel: () => void;
}

export function ApplicationWorkspace({
  project,
  activeApproval,
  onSubmitSuccess,
  onCancel
}: ApplicationWorkspaceProps) {
  // Current active approval being applied for (defaults to CTE or first approval)
  const approval = activeApproval || project.approvals[2] || project.approvals[0];

  // 5 Step Stepper
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State (Pre-filled from project twin, zero retyping)
  const [formData, setFormData] = useState({
    companyName: project.enterpriseName,
    projectName: project.name,
    sector: project.sector,
    subSector: "Active Pharmaceutical Ingredients (API) Bulk Manufacturing",
    investmentCrores: project.investmentCrores,
    capacityTpd: project.capacity,
    employmentTarget: project.employmentTarget,
    powerRequiredKw: 2500,
    waterRequiredKld: 150,
    address: "Plot 44-B, Chakan Industrial Area Phase II, Khed Taluka, Pune, Maharashtra",
    cadastralSurvey: "Survey No. 182/3, Chakan MIDC",
    zoning: "Notified Industrial Area (MIDC Act 1961)",
    zldCommitted: true,
    hazardousChemicals: true,
    applicantDesignation: "Director & Authorized Signatory"
  });

  // Attached Documents State (Zero Re-Upload: Auto-detects existing in vault)
  const [attachedDocs, setAttachedDocs] = useState<{
    [docKey: string]: { attached: boolean; fromVault: boolean; name: string; verified: boolean };
  }>({
    "MIDC Land Allotment Letter": {
      attached: true,
      fromVault: true,
      name: "MIDC_Lease_Deed_Plot_44B.pdf",
      verified: true
    },
    "Factory Machine Layout": {
      attached: true,
      fromVault: true,
      name: "Factory_Layout_Plan_Rev3.dwg.pdf",
      verified: true
    },
    "EIA Executive Summary": {
      attached: true,
      fromVault: true,
      name: "EIA_EMP_Executive_Summary.pdf",
      verified: true
    },
    "Water & Effluent Mass Balance": {
      attached: false,
      fromVault: false,
      name: "",
      verified: false
    }
  });

  // Pre-Submission X-Ray Checks State
  const [isDiscrepancyResolved, setIsDiscrepancyResolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Form Filling Assistant State (Section 7 of Master Prompt)
  const [aiNlpInput, setAiNlpInput] = useState("");
  const [aiExtractedChips, setAiExtractedChips] = useState<string[] | null>(null);
  const [extractedData, setExtractedData] = useState<{
    investment?: number;
    employment?: number;
    water?: number;
  }>({});

  const handleExtractWithAI = () => {
    if (!aiNlpInput.trim()) return;
    const chips: string[] = [];
    const extracted: { investment?: number; employment?: number; water?: number } = {};

    const invMatch = aiNlpInput.match(/(\d+)\s*(?:cr|crore)/i);
    if (invMatch) {
      extracted.investment = parseInt(invMatch[1], 10);
      chips.push(`Investment: ₹${extracted.investment} Cr`);
    }

    const empMatch = aiNlpInput.match(/(\d+)\s*(?:staff|employees|workers|personnel)/i);
    if (empMatch) {
      extracted.employment = parseInt(empMatch[1], 10);
      chips.push(`Employment: ${extracted.employment} Personnel`);
    }

    const waterMatch = aiNlpInput.match(/(\d+)\s*(?:kld|kl|liters?)/i);
    if (waterMatch) {
      extracted.water = parseInt(waterMatch[1], 10);
      chips.push(`Water: ${extracted.water} KLD`);
    }

    if (chips.length === 0) {
      chips.push("Detected: API Bulk Drug Synthesis parameters");
    }

    setExtractedData(extracted);
    setAiExtractedChips(chips);
  };

  const handleApplyAiExtracted = () => {
    setFormData((prev) => ({
      ...prev,
      investmentCrores: extractedData.investment || prev.investmentCrores,
      employmentTarget: extractedData.employment || prev.employmentTarget,
      waterRequiredKld: extractedData.water || prev.waterRequiredKld
    }));
    setAiExtractedChips(null);
    setAiNlpInput("");
  };

  // Step 3 helper to attach doc
  const handleAttachFromVault = (docKey: string) => {
    setAttachedDocs((prev) => ({
      ...prev,
      [docKey]: {
        attached: true,
        fromVault: true,
        name: `${docKey.replace(/\s+/g, "_")}_Vault_Docling.pdf`,
        verified: true
      }
    }));
  };

  // Step 5 Submit handler
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newAppId = `APP-MPCB-CTE-${new Date().getFullYear()}-0929`;
      onSubmitSuccess(newAppId);
    }, 1200);
  };

  const STEPS = [
    { num: 1, title: "1. Business Details" },
    { num: 2, title: "2. Site & Location" },
    { num: 3, title: "3. Documents" },
    { num: 4, title: "4. Check Before Submit" },
    { num: 5, title: "5. Review & Submit" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono border border-teal-200">
              GUIDED APPLICATION • {approval.shortCode}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Single Window Service</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Application for {approval.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Department: <strong>{approval.department}</strong> • Expected processing time: ~{approval.slaDays} Days
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 self-start sm:self-auto cursor-pointer"
        >
          Cancel &amp; Return
        </button>
      </div>

      {/* Persistent Autosave Status Bar & Information Reuse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-800">Saved automatically ✓</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">You can pause and resume anytime</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
          <Sparkles className="h-3 w-3 text-teal-600" />
          <span>Information pre-filled from your project profile</span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center justify-between min-w-[550px]">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.num as any);
                  }}
                  className={`flex items-center gap-2 ${isCompleted ? "cursor-pointer group" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-2xs"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.num}
                  </div>
                  <span
                    className={`text-xs ${
                      isCurrent
                        ? "font-bold text-teal-900"
                        : isCompleted
                        ? "font-semibold text-slate-800 group-hover:text-teal-700"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-3 ${
                      currentStep > idx + 1 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: BUSINESS DETAILS */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* AI Form Filling Assistant */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50/70 to-blue-50/70 border border-teal-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Help Me Fill This Form • Describe your details in plain English</span>
              </span>
              <span className="text-[10px] text-teal-700 font-medium">Auto-fill helper</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiNlpInput}
                onChange={(e) => setAiNlpInput(e.target.value)}
                placeholder="e.g. Factory with 250 staff, ₹150 Cr investment, and 160 KLD water requirement"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleExtractWithAI}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
            {aiExtractedChips && (
              <div className="flex items-center justify-between pt-1 text-[11px] flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {aiExtractedChips.map((chip, idx) => (
                    <span key={idx} className="bg-white border border-teal-200 text-teal-800 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                      {chip}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleApplyAiExtracted}
                  className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Apply Suggested Values ✓
                </button>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
            <span>
              <strong>Information pre-filled:</strong> We already filled in details from your project setup. You can review or edit anything below.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Enterprise Legal Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Facility / Project Name</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sector &amp; Classification</label>
              <input
                type="text"
                value={`${formData.sector} • Red Category (MPCB Order No. 42)`}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Total Fixed Capital Investment</label>
              <input
                type="text"
                value={`₹${formData.investmentCrores} Crores (Large Scale Unit)`}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Manufacturing Production Capacity</label>
              <input
                type="text"
                value={`${formData.capacityTpd} TPD (Active Pharmaceutical Ingredients)`}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Direct Employment Target</label>
              <input
                type="text"
                value={`${formData.employmentTarget} Personnel`}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SITE & LOCATION DETAILS */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
            <span>
              <strong>Geospatial Intelligence:</strong> Coordinates (18.7612° N, 73.8542° E) verified inside Chakan MIDC Phase II. Non-agricultural conversion exempt under MIDC Act 1961.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Premises Postal Address</label>
              <input
                type="text"
                value={formData.address}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Cadastral Survey &amp; Plot Number</label>
              <input
                type="text"
                value={formData.cadastralSurvey}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Competent Planning Authority</label>
              <input
                type="text"
                value="MIDC Pune Regional Office • Khed Taluka Sub-Division"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sub-Regional Pollution Office</label>
              <input
                type="text"
                value="MPCB SRO Pimpri-Chinchwad (Jurisdiction Code: MH-PUN-02)"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Local Authority / Panchayat</label>
              <input
                type="text"
                value="Industrial Township (Exempt from Gram Panchayat NOC under Sec 37)"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: DOCUMENT REUSE (DOCLING VAULT) */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Document Intelligence (Docling):</strong> Reusable files already verified in your vault are detected. You do not need to re-upload them.
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
              3 of 4 Attached
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(attachedDocs).map(([docTitle, docState]) => (
              <div
                key={docTitle}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      docState.attached ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{docTitle}</h4>
                    {docState.attached ? (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Attached: {docState.name}</span>
                        {docState.fromVault && (
                          <span className="text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 ml-1">
                            Auto-Reused from Vault
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-700 flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Missing document for this clearance</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {docState.attached ? (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Verified ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAttachFromVault(docTitle)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Attach from Vault</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: CHECK BEFORE SUBMISSION */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                <strong>Check Before Submission:</strong> We automatically verify your details and documents against government rules so your application won&apos;t get delayed or queried by officers.
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Auto Check Passed
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Rule 1 */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Enterprise Legal Profile Check</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Authorized signatory designation and enterprise registration confirmed against MCA21 registry.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                PASSED
              </span>
            </div>

            {/* Rule 2 */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">PostGIS Industrial Zoning Boundary Check</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Plot 44-B verified inside Chakan Phase II polygon. Gram Panchayat NOC waiver applied.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                PASSED
              </span>
            </div>

            {/* Rule 3 (Simulated Optical Discrepancy & Fix) */}
            <div
              className={`p-3.5 rounded-xl border transition-all text-xs flex items-start justify-between gap-3 ${
                isDiscrepancyResolved
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-amber-300 bg-amber-50/80"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isDiscrepancyResolved ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-slate-900">
                    Production Capacity &amp; EIA Annexure Consistency
                  </span>
                  {isDiscrepancyResolved ? (
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Resolved: Form 1 capacity synchronized to 100 TPD across all docket attachments.
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-900 mt-0.5">
                      Warning: Form 1 states 100 TPD while EIA report mentions 150 TPD peak envelope.
                    </p>
                  )}
                </div>
              </div>

              {isDiscrepancyResolved ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                  RESOLVED
                </span>
              ) : (
                <button
                  onClick={() => setIsDiscrepancyResolved(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  Synchronize to 100 TPD
                </button>
              )}
            </div>

            {/* Rule 4: Document Completeness with Deep Link */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Mandatory Document Dossier Verification</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {Object.values(attachedDocs).every((d) => d.attached)
                      ? "All required clearance documents attached and verified."
                      : "Notice: 1 document missing for zero-defect automated processing."}
                  </p>
                </div>
              </div>
              {!Object.values(attachedDocs).every((d) => d.attached) ? (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>Fix Issue in Step 3</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                  PASSED
                </span>
              )}
            </div>

            {/* Rule 5 */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Water Act 1974 Sec 25 Deterministic Rules</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zero Liquid Discharge (ZLD) commitment and continuous BOD/COD telemetry clauses accepted.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                PASSED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW, STATUTORY DECLARATION & SUBMIT */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                Smart Review • Verify Docket Prior to Submission
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Click &quot;Edit&quot; on any section to revise</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Clearance</span>
                <strong className="text-slate-900">{approval.name}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Department</span>
                <strong className="text-slate-900">{approval.department}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Location</span>
                <strong className="text-slate-900">Plot 44-B, Chakan MIDC Phase II, Pune</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Statutory SLA</span>
                <strong className="text-teal-700">{approval.slaDays} Days (RTS Act 2015)</strong>
              </div>
            </div>

            {/* Smart Review Sections with Direct In-Place Edit (Section 43 of Master Prompt) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">1. Enterprise Legal Details</span>
                  <span className="font-bold text-slate-800 text-[11px]">{formData.companyName} (₹{formData.investmentCrores} Cr)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-teal-700 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">2. Site &amp; PostGIS Coordinates</span>
                  <span className="font-bold text-slate-800 text-[11px]">Survey 182/3, Chakan MIDC II</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-teal-700 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">3. Document Dossier</span>
                  <span className="font-bold text-slate-800 text-[11px]">{Object.values(attachedDocs).filter((d) => d.attached).length} of 4 Attached</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-teal-700 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">4. Checks Before Submission</span>
                  <span className="font-bold text-emerald-700 text-[11px]">All Rules Passed ✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-teal-700 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Statutory Declaration Box */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-900 font-bold">
              <Scale className="h-4 w-4 text-teal-700" />
              <span>Statutory Legal Declaration</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              I hereby solemnly declare that all statements made and documents submitted in this application under Section 25 of the Water (Prevention and Control of Pollution) Act 1974 are true, complete, and correct to the best of my knowledge and belief. I acknowledge that misrepresentation constitutes an offence punishable under Section 41 of the Act.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="decl"
                defaultChecked
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <label htmlFor="decl" className="font-bold text-slate-800 text-xs">
                I agree and digitally sign this declaration as Authorized Signatory
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls (Back / Next / Submit) */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => {
            if (currentStep > 1) setCurrentStep((currentStep - 1) as any);
            else onCancel();
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{currentStep === 1 ? "Cancel" : "Back"}</span>
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep((currentStep + 1) as any)}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continue to {STEPS[currentStep].title}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Transmitting to Single Window...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Submit Application to Single Window</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
