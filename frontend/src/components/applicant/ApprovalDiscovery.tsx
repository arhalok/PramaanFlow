"use client";

import React, { useState } from "react";
import {
  ApprovalNode,
  ProjectTwin
} from "@/lib/regulatory-data";
import {
  Search,
  Filter,
  Layers,
  LayoutGrid,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Building,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Check,
  Scale,
  X,
  FileCheck2
} from "lucide-react";
import { ApprovalGraphDAG } from "@/components/ApprovalGraphDAG";
import { ApprovalDetailModal } from "@/components/applicant/ApprovalDetailModal";

interface ApprovalDiscoveryProps {
  project: ProjectTwin;
  onStartApplication: (approval: ApprovalNode) => void;
  onOpenWhyEvidence: (approval: ApprovalNode) => void;
}

interface SchemeItem {
  id: string;
  name: string;
  authority: string;
  benefitType: string;
  benefitAmount: string;
  eligibility: string[];
  evidenceRequired: string[];
  officialAct: string;
  sourceUrl: string;
  isEligible: boolean;
}

const SCHEMES_DATABASE: SchemeItem[] = [
  {
    id: "psi-2019-capital",
    name: "Maharashtra Package Scheme of Incentives (PSI 2019) - Capital Subsidy",
    authority: "Directorate of Industries, Maharashtra",
    benefitType: "Industrial Promotion Subsidy (IPS)",
    benefitAmount: "Up to 50% of Eligible Capital Investment (₹45 Cr Max)",
    eligibility: [
      "Manufacturing unit located in Group C / D / D+ Taluka (Khed Taluka qualifies)",
      "Fixed capital investment exceeds ₹100 Cr (Large Enterprise)",
      "Minimum 75% employment to local domicile residents"
    ],
    evidenceRequired: [
      "MIDC Industrial Land Allotment Lease Deed",
      "Detailed Project Report (DPR) certified by Chartered Engineer",
      "Consent to Establish (CTE) from MPCB"
    ],
    officialAct: "Government Resolution No. PSI-2019/CR-14/Ind-2 (2019)",
    sourceUrl: "https://industry.maharashtra.gov.in",
    isEligible: true
  },
  {
    id: "stamp-duty-waiver",
    name: "100% Exemption on Stamp Duty for Industrial Land Acquisition",
    authority: "Inspector General of Registration & Stamps, Maharashtra",
    benefitType: "Stamp Duty Exemption",
    benefitAmount: "100% Waiver on Stamp Duty & Registration Fees (Approx. ₹1.45 Cr)",
    eligibility: [
      "Purchase or long-term lease of industrial land in notified MIDC industrial area",
      "Industrial enterprise registered under MSME or Large Scale Category",
      "Execution of deed within effective PSI policy window"
    ],
    evidenceRequired: [
      "MIDC Allotment Order & Letter of Intent",
      "Eligibility Certificate issued by Joint Director of Industries (Pune Region)"
    ],
    officialAct: "Bombay Stamp Act 1958 Section 9(a) Notification",
    sourceUrl: "https://igrmaharashtra.gov.in",
    isEligible: true
  },
  {
    id: "electricity-duty-exemption",
    name: "Electricity Duty Exemption on HT Industrial Power (7 Years)",
    authority: "Energy Department, Govt of Maharashtra",
    benefitType: "Tax / Tariff Exemption",
    benefitAmount: "Zero State Electricity Duty for 7 consecutive years (Approx. ₹68 Lakhs/yr)",
    eligibility: [
      "New manufacturing facility drawing HT power (11kV or 33kV)",
      "Commercial production initiated within 36 months of allotment",
      "Unit maintains active Consent to Operate (CTO)"
    ],
    evidenceRequired: [
      "MSEDCL HT Power Sanction Letter (2.5 MVA)",
      "Directorate of Industries Eligibility Certificate",
      "Energy Meter Installation & Energization Certificate"
    ],
    officialAct: "Maharashtra Electricity Duty Act 2016 Section 3(2)",
    sourceUrl: "https://mahadiscom.in",
    isEligible: true
  },
  {
    id: "green-etp-subsidy",
    name: "Green Technology & Zero Liquid Discharge (ZLD) ETP Capital Subsidy",
    authority: "Maharashtra Pollution Control Board (MPCB)",
    benefitType: "Environmental Clean Tech Grant",
    benefitAmount: "₹50 Lakhs or 25% of ETP Equipment Cost",
    eligibility: [
      "Installation of multi-effect evaporator (MEE) or RO ZLD plant",
      "Red Category pharmaceutical / chemical manufacturing unit",
      "Continuous online effluent monitoring telemetry connected to CPCB/MPCB server"
    ],
    evidenceRequired: [
      "Environmental Impact Assessment (EIA) Report",
      "ETP Engineering Design & Mass Balance Blueprint",
      "Vendor commissioning invoices & performance warranty"
    ],
    officialAct: "State Environmental Clean-Tech Assistance Fund 2021",
    sourceUrl: "https://mpcb.gov.in",
    isEligible: true
  }
];

export function ApprovalDiscovery({
  project,
  onStartApplication,
  onOpenWhyEvidence
}: ApprovalDiscoveryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "graph">("cards");
  const [selectedApprovalModal, setSelectedApprovalModal] = useState<ApprovalNode | null>(null);
  const [selectedSchemeModal, setSelectedSchemeModal] = useState<SchemeItem | null>(null);

  // Filter approvals based on search & category
  const filteredApprovals = project.approvals.filter((approval) => {
    const matchesSearch =
      approval.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.act.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "SITE" && (approval.shortCode === "MIDC-POSS" || approval.shortCode === "MSEDCL-HT")) return true;
    if (selectedCategory === "ENV" && (approval.shortCode === "MPCB-CTE" || approval.shortCode === "FIRE-NOC")) return true;
    if (selectedCategory === "STRUCTURAL" && approval.shortCode === "DISH-FAC") return true;
    if (selectedCategory === "OPERATIONAL" && approval.shortCode === "DISCOM-NOC") return true;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & View Mode Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                FIND REQUIRED APPROVALS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Maharashtra Single Window
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Approvals &amp; Government Incentives
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified automatically for: <strong>{project.name}</strong> • Chakan MIDC, Khed Taluka, Pune
            </p>
          </div>

          {/* Mode Switcher: Cards vs Approval Route Graph */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white text-teal-700 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards View ({filteredApprovals.length})</span>
            </button>

            <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "graph"
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Approval Sequence</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {[
              { id: "ALL", label: `All Clearances (${project.approvals.length})` },
              { id: "SITE", label: "Site & Land" },
              { id: "ENV", label: "Environmental & Fire" },
              { id: "STRUCTURAL", label: "Factory & Buildings" },
              { id: "SCHEMES", label: `Incentives & Subsidies (${SCHEMES_DATABASE.length})` }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search approvals, acts, depts..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* VIEW: INCENTIVES & SUBSIDIES SCHEMES */}
      {selectedCategory === "SCHEMES" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-700 shrink-0" />
              <span>
                Based on your investment of <strong>₹{project.investmentCrores} Cr</strong> in <strong>Khed Taluka (Group C)</strong>, your enterprise is pre-qualified for 4 Maharashtra state incentive packages.
              </span>
            </div>
            <span className="font-mono font-bold text-purple-800 text-[11px] hidden sm:inline">
              Estimated Value: ₹50+ Cr
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCHEMES_DATABASE.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 shadow-2xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {scheme.benefitType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Eligible
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {scheme.authority}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Estimated Benefit</span>
                    <p className="font-extrabold text-purple-900">{scheme.benefitAmount}</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-700">Pre-Qualified Criteria:</span>
                    {scheme.eligibility.slice(0, 2).map((crit, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedSchemeModal(scheme)}
                    className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View eligibility checklist</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={scheme.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: CARDS GRID (When not on Schemes) */}
      {selectedCategory !== "SCHEMES" && viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApprovals.map((approval) => {
            const hasPrereqs = approval.dependencies.length > 0;

            return (
              <div
                key={approval.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {approval.shortCode}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-teal-600" />
                          <span>SLA: {approval.slaDays} Days</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {approval.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {approval.department}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                        approval.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : approval.status === "IN_REVIEW"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : approval.status === "ACTION_REQUIRED"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {approval.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Plain-Language "Why Required" Highlight */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
                      <HelpCircle className="h-3 w-3 text-teal-600" />
                      <span>Why Applicable to Your Facility:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {approval.whyRequired?.clause || approval.description}
                    </p>
                  </div>

                  {/* Prerequisites & Vault Document Count */}
                  <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="font-semibold text-slate-700">Prerequisites:</span>
                      {hasPrereqs ? (
                        <span className="font-mono text-slate-600 font-medium">
                          {approval.dependencies.join(", ")}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">None (Can start immediately)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                      <FileCheck2 className="h-3.5 w-3.5" />
                      <span>{approval.requiredDocuments.length} Documents Required</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedApprovalModal(approval)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => onOpenWhyEvidence(approval)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Why Required?</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onStartApplication(approval)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Start Application</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: DEPENDENCY DAG (When Graph mode is active) */}
      {selectedCategory !== "SCHEMES" && viewMode === "graph" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Visual Approval Sequence &amp; Clearances Route
              </h3>
              <p className="text-xs text-slate-500">
                Shows which approvals can run in parallel, and which ones depend on previous clearances.
              </p>
            </div>
          </div>

          <ApprovalGraphDAG
            approvals={project.approvals}
            selectedApproval={project.approvals[2]}
            onSelectApproval={(appr) => onOpenWhyEvidence(appr)}
            onOpenWhy={(appr) => onOpenWhyEvidence(appr)}
          />
        </div>
      )}

      {/* SCHEME DETAIL MODAL */}
      {selectedSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-700" />
                <h3 className="text-sm font-bold text-slate-900">Government Scheme Eligibility Docket</h3>
              </div>
              <button
                onClick={() => setSelectedSchemeModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono">
                  {selectedSchemeModal.benefitType}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {selectedSchemeModal.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authority: {selectedSchemeModal.authority}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-purple-900 uppercase">Estimated Statutory Benefit</span>
                <p className="text-base font-extrabold text-purple-950 font-mono">
                  {selectedSchemeModal.benefitAmount}
                </p>
                <p className="text-[11px] text-purple-800">
                  Statute Basis: {selectedSchemeModal.officialAct}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900">Eligibility Factors Checked:</span>
                {selectedSchemeModal.eligibility.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-900">Required Proof Documents:</span>
                {selectedSchemeModal.evidenceRequired.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 pl-1">
                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={selectedSchemeModal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View Official Gazette</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={() => {
                  setSelectedSchemeModal(null);
                  alert(`Incentive claim initialized for ${selectedSchemeModal.name}. Linked to Single Window docket.`);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Claim Incentive via Single Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL DETAIL MODAL (Flow 5 & Screen 08) */}
      {selectedApprovalModal && (
        <ApprovalDetailModal
          isOpen={!!selectedApprovalModal}
          onClose={() => setSelectedApprovalModal(null)}
          approval={selectedApprovalModal}
          onStartApplication={onStartApplication}
          onOpenWhyEvidence={onOpenWhyEvidence}
        />
      )}
    </div>
  );
}
