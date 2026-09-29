"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Eye,
  Download,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Building,
  X,
  FileSpreadsheet
} from "lucide-react";

interface VaultDocument {
  id: string;
  title: string;
  fileName: string;
  category: "LAND" | "ENVIRONMENTAL" | "STRUCTURAL" | "LEGAL" | "UTILITIES";
  uploadedAt: string;
  status: "VERIFIED" | "FLAGGED_DISCREPANCY" | "SCANNING";
  reusedInClearances: string[];
  extractedEntities: { [key: string]: string };
  fileSizeBytes: string;
  ocrSnippet: string;
}

const VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-midc-lease",
    title: "MIDC Industrial Land Allotment & Lease Deed",
    fileName: "MIDC_Lease_Deed_Plot_44B.pdf",
    category: "LAND",
    uploadedAt: "28 Aug 2026",
    status: "VERIFIED",
    reusedInClearances: ["MIDC-POSS", "MPCB-CTE", "DISH-FAC", "MSEDCL-HT"],
    extractedEntities: {
      "Plot Number": "Plot 44-B, Sector II",
      "Total Land Area": "12.40 Acres (50,181 sq.m.)",
      "Cadastral Survey": "Survey No. 182/3",
      "Lease Tenure": "95 Years (Exp. 2121)",
      "Industrial Zone": "Chakan MIDC Phase II"
    },
    fileSizeBytes: "4.2 MB",
    ocrSnippet: "MAHARASHTRA INDUSTRIAL DEVELOPMENT CORPORATION. Indenture of Lease executed on 28th Day of August 2026 between MIDC and Applicant Enterprise for industrial development of Plot 44-B, Khed Taluka, District Pune..."
  },
  {
    id: "doc-eia-emp",
    title: "Environmental Impact Assessment (EIA) Executive Summary",
    fileName: "EIA_EMP_Executive_Summary_Rev2.pdf",
    category: "ENVIRONMENTAL",
    uploadedAt: "05 Sep 2026",
    status: "FLAGGED_DISCREPANCY",
    reusedInClearances: ["MPCB-CTE", "FIRE-NOC"],
    extractedEntities: {
      "Production Envelope": "150 TPD Peak / 100 TPD Base",
      "Effluent Volume": "65 KLD Trade Effluent",
      "ZLD Treatment": "RO + Multi-Effect Evaporator",
      "Air Scrubbing": "Wet Scrubber with 30m Stack"
    },
    fileSizeBytes: "8.7 MB",
    ocrSnippet: "EXECUTIVE SUMMARY FOR ENVIRONMENTAL APPRAISAL. Active Pharmaceutical Ingredient manufacturing facility. Proposed production envelope comprises 100 TPD primary synthesis with 150 TPD maximum peak utility capacity..."
  },
  {
    id: "doc-factory-layout",
    title: "Factory Machine Layout & Architectural Elevation Plan",
    fileName: "Factory_Layout_Plan_Rev3.dwg.pdf",
    category: "STRUCTURAL",
    uploadedAt: "15 Sep 2026",
    status: "VERIFIED",
    reusedInClearances: ["DISH-FAC", "FIRE-NOC"],
    extractedEntities: {
      "Architect Reg No": "COA/2014/58291",
      "Built-Up Area": "18,400 sq.m.",
      "Emergency Exits": "6 Pressurized Stairwells",
      "Floor Load Capacity": "1,500 kg/sq.m."
    },
    fileSizeBytes: "14.1 MB",
    ocrSnippet: "APPROVED FACTORY STRUCTURAL DRAWINGS. Scale 1:100. Showing ground floor chemical synthesis block, quality control laboratories, solvent tank farm, and 12-meter unobstructed peripheral fire tender access road..."
  },
  {
    id: "doc-power-sanction",
    title: "MSEDCL HT Grid Power Feasibility & Demand Note",
    fileName: "MSEDCL_2.5MVA_Feasibility_Letter.pdf",
    category: "UTILITIES",
    uploadedAt: "19 Sep 2026",
    status: "VERIFIED",
    reusedInClearances: ["MSEDCL-HT", "DISH-FAC"],
    extractedEntities: {
      "Contract Demand": "2,500 kVA (2.5 MVA)",
      "Supply Voltage": "11 kV High Tension",
      "Feeding Substation": "Chakan 132/33/11 kV Substation",
      "Sanction Ref": "SE/PUN/HT/2026/9102"
    },
    fileSizeBytes: "1.8 MB",
    ocrSnippet: "MAHARASHTRA STATE ELECTRICITY DISTRIBUTION CO. LTD. Feasibility sanction granted for 2.5 MVA HT supply at 11 kV to Plot 44-B Chakan MIDC, subject to applicant providing dedicated transformer yard..."
  },
  {
    id: "doc-moa-aoa",
    title: "Memorandum & Articles of Association (MoA & AoA)",
    fileName: "Certificate_of_Incorporation_MCA21.pdf",
    category: "LEGAL",
    uploadedAt: "10 Aug 2026",
    status: "VERIFIED",
    reusedInClearances: ["MIDC-POSS", "MPCB-CTE", "DISH-FAC", "MSEDCL-HT", "FIRE-NOC"],
    extractedEntities: {
      "CIN": "U24239MH2024PTC394812",
      "Authorized Capital": "₹50,00,00,000",
      "Registered Office": "Pune, Maharashtra, India",
      "Main Object Clause": "Manufacture of bulk drugs & API"
    },
    fileSizeBytes: "3.5 MB",
    ocrSnippet: "MINISTRY OF CORPORATE AFFAIRS. Certificate of Incorporation pursuant to Section 7 of the Companies Act 2013. I hereby certify that the company is incorporated on this tenth day of August..."
  },
  {
    id: "doc-fire-plan",
    title: "Provisional Fire Hydrant & Evacuation Scheme",
    fileName: "Fire_Safety_Plan_Hydrant_Network.pdf",
    category: "ENVIRONMENTAL",
    uploadedAt: "18 Sep 2026",
    status: "VERIFIED",
    reusedInClearances: ["FIRE-NOC", "DISH-FAC"],
    extractedEntities: {
      "Water Storage": "200,000 Liters Underground Tank",
      "Fire Pump Rating": "2,850 LPM at 7 bar",
      "Hydrant Points": "18 External Yard Hydrants",
      "Code Compliance": "NBC 2016 Part 4"
    },
    fileSizeBytes: "6.2 MB",
    ocrSnippet: "MAHARASHTRA FIRE SERVICES. Scheme for external and internal fire hydrant installation, automatic sprinkler coverage, and foam deluge system for chemical storage area..."
  }
];

export function DocumentVaultView() {
  const [documents, setDocuments] = useState<VaultDocument[]>(VAULT_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [isScanningNewDoc, setIsScanningNewDoc] = useState(false);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "ALL" || doc.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Simulated Docling Upload
  const handleSimulatedUpload = () => {
    setIsScanningNewDoc(true);

    setTimeout(() => {
      setIsScanningNewDoc(false);
      const newDoc: VaultDocument = {
        id: `doc-${Date.now()}`,
        title: "Chartered Engineer Plant & Machinery Valuation Certificate",
        fileName: "CE_Machinery_Valuation_Certified.pdf",
        category: "STRUCTURAL",
        uploadedAt: "Just Now",
        status: "VERIFIED",
        reusedInClearances: ["DISH-FAC", "PSI-2019-SCHEME"],
        extractedEntities: {
          "Total Machinery Value": "₹94.20 Crores",
          "Chartered Engineer": "Er. P. B. Joshi (FIE 84910)",
          "Appraisal Standard": "ASME Sec VIII Div 1"
        },
        fileSizeBytes: "2.9 MB",
        ocrSnippet: "INSTITUTION OF ENGINEERS (INDIA). Certified plant and equipment appraisal for API manufacturing facility. Total plant, machinery, reactor vessels, and piping valuated at ₹94.20 Crores..."
      };

      setDocuments((prev) => [newDoc, ...prev]);
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Actions Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-200 uppercase">
              CENTRAL DOCUMENT VAULT
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Docling Optical Intelligence Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Enterprise Verified Documents ({documents.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero re-upload architecture: Documents uploaded once automatically satisfy multiple clearances.
          </p>
        </div>

        <button
          onClick={handleSimulatedUpload}
          disabled={isScanningNewDoc}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          {isScanningNewDoc ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Scanning with Docling...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload New Document</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All Files (${documents.length})` },
            { id: "LAND", label: "Land & Site" },
            { id: "ENVIRONMENTAL", label: "Environment & Fire" },
            { id: "STRUCTURAL", label: "Drawings & Civil" },
            { id: "UTILITIES", label: "Power & Water" },
            { id: "LEGAL", label: "Corporate Legal" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                filterCategory === cat.id
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified documents..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* 3. Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                  <FileText className="h-5 w-5" />
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    doc.status === "VERIFIED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
                      : "bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                  }`}
                >
                  {doc.status === "VERIFIED" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>DOCLING VERIFIED</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>DISCREPANCY FLAGGED</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {doc.fileName} • {doc.fileSizeBytes}
                </p>
              </div>

              {/* Extracted Entities Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-teal-600" />
                  <span>Docling Extracted Metadata:</span>
                </span>
                {Object.entries(doc.extractedEntities).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{key}:</span>
                    <strong className="text-slate-800 font-medium">{val}</strong>
                  </div>
                ))}
              </div>

              {/* Cross-Clearance Reuse Indicator */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                  Reused in {doc.reusedInClearances.length} Clearances: {doc.reusedInClearances.join(", ")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview OCR &amp; Entities</span>
              </button>

              <span className="text-[10px] text-slate-400">
                Uploaded: {doc.uploadedAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Document Preview & OCR Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Docling OCR &amp; Entity Inspection Docket
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedDoc.fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {/* Status Header */}
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase block">Verification Pipeline</span>
                  <p className="text-xs font-bold text-teal-950 mt-0.5">
                    Docling v2 Document Structure &amp; Table Hierarchy Verified
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-teal-800">
                  {selectedDoc.fileSizeBytes}
                </span>
              </div>

              {/* Extracted Structured Key-Values */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                  Extracted Regulatory Entities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(selectedDoc.extractedEntities).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">{key}</span>
                      <strong className="text-slate-900 font-medium text-xs">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw OCR Text Snippet */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                  Optical Character Recognition (OCR) Stream
                </h4>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto shadow-inner">
                  {selectedDoc.ocrSnippet}
                </div>
              </div>

              {/* Connected Approvals */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                  Attached Statutory Approvals
                </h4>
                <p className="text-slate-600">
                  This single file is auto-linked to {selectedDoc.reusedInClearances.length} clearance dockets:{" "}
                  <strong>{selectedDoc.reusedInClearances.join(", ")}</strong>.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>

              <button
                onClick={() => {
                  alert(`Downloading original ${selectedDoc.fileName}`);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Verified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
