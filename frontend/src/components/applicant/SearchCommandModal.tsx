"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  X,
  FileCheck2,
  Building,
  Scale
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "APPROVAL" | "DOCUMENT" | "APPLICATION" | "SCHEME" | "STATUTE";
  subtitle: string;
  department?: string;
  badge?: string;
  tabTarget?: string;
  approvalId?: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    id: "appr-cte",
    title: "Consent to Establish (CTE) - Water & Air Acts",
    category: "APPROVAL",
    subtitle: "Mandatory statutory pre-establishment clearance under Water Act 1974 & Air Act 1981",
    department: "Maharashtra Pollution Control Board (MPCB)",
    badge: "Statutory SLA: 45d",
    tabTarget: "discover",
    approvalId: "cte-mpcb"
  },
  {
    id: "appr-land",
    title: "MIDC Industrial Land Possession & Allotment",
    category: "APPROVAL",
    subtitle: "Execution of 95-year industrial lease deed in Chakan MIDC Phase II",
    department: "Maharashtra Industrial Development Corporation (MIDC)",
    badge: "Completed",
    tabTarget: "discover",
    approvalId: "midc-allotment"
  },
  {
    id: "appr-fire",
    title: "Fire Safety Provisional NOC",
    category: "APPROVAL",
    subtitle: "Building plan fire compliance under Maharashtra Fire Prevention Act 2006",
    department: "Directorate of Maharashtra Fire Services",
    badge: "Statutory SLA: 30d",
    tabTarget: "discover",
    approvalId: "fire-noc"
  },
  {
    id: "appr-factory",
    title: "Factory Licence & Plan Approval (Form 1)",
    category: "APPROVAL",
    subtitle: "Occupational health and machinery layout approval under Factories Act 1948",
    department: "Directorate of Industrial Safety & Health (DISH)",
    badge: "Statutory SLA: 60d",
    tabTarget: "discover",
    approvalId: "dish-factory"
  },
  {
    id: "appr-power",
    title: "HT Industrial Power Sanction (2.5 MVA)",
    category: "APPROVAL",
    subtitle: "High-tension 11kV grid connection feasibility under MERC Supply Code",
    department: "Maharashtra State Electricity Distribution Co. (MSEDCL)",
    badge: "Statutory SLA: 21d",
    tabTarget: "discover",
    approvalId: "msedcl-power"
  },
  {
    id: "doc-land",
    title: "MIDC Land Allotment Letter & Possession Receipt",
    category: "DOCUMENT",
    subtitle: "Plot 44-B, Chakan Phase II, 12.4 Acres • Verified via Docling",
    badge: "Verified",
    tabTarget: "documents"
  },
  {
    id: "doc-eia",
    title: "Environmental Impact Assessment (EIA) Executive Summary",
    category: "DOCUMENT",
    subtitle: "Form 1 + EMP baseline air & water quality report (150 TPD capacity)",
    badge: "Flagged Discrepancy",
    tabTarget: "documents"
  },
  {
    id: "doc-layout",
    title: "Factory Machine Layout & Structural Stability Plan",
    category: "DOCUMENT",
    subtitle: "Architect certified blueprint with fire evacuation corridors",
    badge: "Verified",
    tabTarget: "documents"
  },
  {
    id: "scheme-psi",
    title: "Maharashtra Package Scheme of Incentives (PSI 2019)",
    category: "SCHEME",
    subtitle: "Industrial promotion subsidy for Large/Mega Units in Group C & D+ Talukas",
    department: "Directorate of Industries, Maharashtra",
    badge: "Up to 50% Capital Subsidy",
    tabTarget: "discover"
  },
  {
    id: "scheme-stamp",
    title: "100% Stamp Duty Exemption on Industrial Land Purchase",
    category: "SCHEME",
    subtitle: "Government Resolution IID-2019/CR-14/Ind-2 for eligible manufacturing investments",
    department: "Inspector General of Registration & Stamps",
    badge: "100% Waiver",
    tabTarget: "discover"
  },
  {
    id: "scheme-elec",
    title: "Electricity Duty Exemption for 7 Years",
    category: "SCHEME",
    subtitle: "Zero state electricity tax on HT power consumption for eligible new units",
    department: "Energy Department, Govt of Maharashtra",
    badge: "7 Year Waiver",
    tabTarget: "discover"
  },
  {
    id: "stat-water",
    title: "The Water (Prevention & Control of Pollution) Act, 1974 - Sec 25",
    category: "STATUTE",
    subtitle: "Prohibition on establishment of industrial plant discharging sewage or trade effluent without MPCB consent",
    badge: "Central Act No. 6 of 1974",
    tabTarget: "discover"
  },
  {
    id: "stat-factories",
    title: "The Factories Act, 1948 - Section 6",
    category: "STATUTE",
    subtitle: "Approval, licensing and registration of factories before installing power-driven machinery",
    badge: "Act No. 63 of 1948",
    tabTarget: "discover"
  },
  {
    id: "stat-rts",
    title: "Maharashtra Right to Public Services Act, 2015",
    category: "STATUTE",
    subtitle: "Statutory SLA timeframes guaranteeing transparent, accountable public service delivery",
    badge: "Maharashtra Act No. XXXI of 2015",
    tabTarget: "applications"
  }
];

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, approvalId?: string) => void;
}

export function SearchCommandModal({
  isOpen,
  onClose,
  onNavigate
}: SearchCommandModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Toggle handled outside
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          const item = filteredResults[selectedIndex];
          onNavigate(item.tabTarget || "discover", item.approvalId);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex]);

  const filteredResults = SEARCH_DATABASE.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.department && item.department.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="h-5 w-5 text-teal-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search approvals, documents, schemes, statutory acts, or departments..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-600 font-semibold hidden sm:inline">
            ESC to close
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto text-xs">
          {["ALL", "APPROVAL", "DOCUMENT", "SCHEME", "STATUTE"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat === "ALL" ? "All Items" : cat.charAt(0) + cat.slice(1).toLowerCase() + "s"}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 hidden sm:inline">
            {filteredResults.length} matches
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
              <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No regulatory items found for "{query}"</p>
              <p className="text-slate-400 mt-1">Try searching for "Water Act", "MIDC", "Fire", "Subsidy", or "EIA"</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.tabTarget || "discover", item.approvalId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-teal-50/80 border border-teal-200 shadow-2xs ring-1 ring-teal-500/20"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.category === "APPROVAL"
                          ? "bg-teal-100 text-teal-700"
                          : item.category === "DOCUMENT"
                          ? "bg-blue-100 text-blue-700"
                          : item.category === "SCHEME"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.category === "APPROVAL" && <Shield className="h-4 w-4" />}
                      {item.category === "DOCUMENT" && <FileText className="h-4 w-4" />}
                      {item.category === "SCHEME" && <Sparkles className="h-4 w-4" />}
                      {item.category === "STATUTE" && <Scale className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>

                      {item.department && (
                        <p className="text-[10px] text-teal-700 font-medium mt-1">
                          {item.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`h-4 w-4 shrink-0 mt-2 transition-transform ${
                      isSelected ? "text-teal-600 translate-x-1" : "text-slate-300"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-semibold">↑</kbd>
              {" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-semibold">↓</kbd>
              {" to navigate"}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-semibold">↵</kbd>
              {" to select"}
            </span>
          </div>
          <span className="font-medium text-teal-700">PramaanFlow Regulatory Index</span>
        </div>
      </div>
    </div>
  );
}
