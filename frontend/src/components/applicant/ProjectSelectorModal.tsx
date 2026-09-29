"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  MapPin,
  Check,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  FolderKanban
} from "lucide-react";
import { ProjectTwin, INITIAL_PROJECT } from "@/lib/regulatory-data";

export interface ProjectSummary {
  id: string;
  name: string;
  enterpriseName: string;
  sector: string;
  subSector: string;
  district: string;
  investmentCrores: number;
  capacity: number;
  activeApplicationsCount: number;
  status: "ACTIVE" | "COMPLETED" | "PLANNING";
}

export const SAMPLE_PROJECTS: ProjectSummary[] = [
  {
    id: "PRJ-MH-PUN-0849",
    name: "Apex Bio-Pharmaceuticals & Active Ingredients Unit",
    enterpriseName: "Apex LifeSciences Healthcare Pvt. Ltd.",
    sector: "Pharmaceuticals",
    subSector: "Active Pharmaceutical Ingredients (API) Bulk Manufacturing",
    district: "Chakan MIDC Phase II, Pune",
    investmentCrores: 145.5,
    capacity: 100,
    activeApplicationsCount: 3,
    status: "ACTIVE"
  },
  {
    id: "PRJ-MH-NAG-1204",
    name: "Vidarbha Green Solar PV Cell & Ingot Assembly Plant",
    enterpriseName: "Vidarbha CleanTech Energy Solutions Ltd.",
    sector: "Renewable Energy",
    subSector: "Silicon Solar Wafer & PV Module Assembly",
    district: "Butibori Industrial Area, Nagpur",
    investmentCrores: 85.0,
    capacity: 50,
    activeApplicationsCount: 1,
    status: "ACTIVE"
  },
  {
    id: "PRJ-MH-PUN-0518",
    name: "Baramati Integrated Agro-Food Processing & Cold Chain",
    enterpriseName: "Sahyadri Agro-Industrial Infrastructure LLP",
    sector: "Food Processing",
    subSector: "Fruit Puree, IQF & Aseptic Packaging Facility",
    district: "Baramati MIDC, Pune",
    investmentCrores: 42.0,
    capacity: 75,
    activeApplicationsCount: 0,
    status: "COMPLETED"
  }
];

interface ProjectSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId: string;
  onSelectProject: (project: ProjectSummary) => void;
  onCreateNewProject: (newProject: ProjectSummary) => void;
}

export function ProjectSelectorModal({
  isOpen,
  onClose,
  activeProjectId,
  onSelectProject,
  onCreateNewProject
}: ProjectSelectorModalProps) {
  const [projects, setProjects] = useState<ProjectSummary[]>(SAMPLE_PROJECTS);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Project Form State (Flow 1: Create Business Project)
  const [newProjectName, setNewProjectName] = useState("");
  const [newEnterpriseName, setNewEnterpriseName] = useState("");
  const [newSector, setNewSector] = useState("Pharmaceuticals");
  const [newDistrict, setNewDistrict] = useState("Chakan MIDC Phase II, Pune");
  const [newInvestment, setNewInvestment] = useState("120");
  const [newCapacity, setNewCapacity] = useState("80");

  // Natural Language Description Input (Section 6 of Master Prompt)
  const [nlpDescription, setNlpDescription] = useState("");
  const [nlpExtractedNotice, setNlpExtractedNotice] = useState<string | null>(null);

  const handleNlpExtract = () => {
    if (!nlpDescription.trim()) return;

    let detectedSector = newSector;
    let detectedDistrict = newDistrict;
    let detectedInvestment = newInvestment;
    let detectedCapacity = newCapacity;
    let detectedName = newProjectName;
    let detectedEnterprise = newEnterpriseName;

    const lower = nlpDescription.toLowerCase();

    if (lower.includes("food") || lower.includes("agro") || lower.includes("fruit")) {
      detectedSector = "Food Processing";
      detectedName = detectedName || "Agro-Food Processing & Cold Chain Unit";
      detectedEnterprise = detectedEnterprise || "Sahyadri Agro-Industrial Foods Pvt Ltd";
    } else if (lower.includes("solar") || lower.includes("renewable") || lower.includes("energy")) {
      detectedSector = "Renewable Energy";
      detectedName = detectedName || "Green Solar PV Manufacturing Facility";
      detectedEnterprise = detectedEnterprise || "Vidarbha CleanTech Energy Solutions Ltd";
    } else if (lower.includes("pharma") || lower.includes("api") || lower.includes("drug")) {
      detectedSector = "Pharmaceuticals";
      detectedName = detectedName || "Active Pharmaceutical Ingredient (API) Plant";
      detectedEnterprise = detectedEnterprise || "Apex LifeSciences Healthcare Pvt Ltd";
    }

    if (lower.includes("jaipur")) {
      detectedDistrict = "Jaipur Industrial Area, Rajasthan";
    } else if (lower.includes("baramati")) {
      detectedDistrict = "Baramati MIDC, Pune";
    } else if (lower.includes("nagpur") || lower.includes("butibori")) {
      detectedDistrict = "Butibori Industrial Area, Nagpur";
    } else if (lower.includes("chakan")) {
      detectedDistrict = "Chakan MIDC Phase II, Pune";
    }

    const invMatch = nlpDescription.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore)/i);
    if (invMatch) {
      detectedInvestment = invMatch[1];
    }

    const capMatch = nlpDescription.match(/(\d+)\s*(?:tpd|ton|tonne|mw)/i);
    if (capMatch) {
      detectedCapacity = capMatch[1];
    }

    setNewSector(detectedSector);
    setNewDistrict(detectedDistrict);
    setNewInvestment(detectedInvestment);
    setNewCapacity(detectedCapacity);
    if (!newProjectName) setNewProjectName(detectedName || "Proposed Industrial Unit");
    if (!newEnterpriseName) setNewEnterpriseName(detectedEnterprise || "Applicant Enterprise Pvt Ltd");

    setNlpExtractedNotice(`We understood your project: ${detectedSector}, ${detectedDistrict}, ~₹${detectedInvestment} Cr, ${detectedCapacity} units. Review details below.`);
  };

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newEnterpriseName.trim()) return;

    const created: ProjectSummary = {
      id: `PRJ-MH-${Date.now().toString().slice(-4)}`,
      name: newProjectName,
      enterpriseName: newEnterpriseName,
      sector: newSector,
      subSector: `${newSector} Manufacturing Facility`,
      district: newDistrict,
      investmentCrores: parseFloat(newInvestment) || 100,
      capacity: parseInt(newCapacity, 10) || 50,
      activeApplicationsCount: 1,
      status: "ACTIVE"
    };

    setProjects([created, ...projects]);
    onCreateNewProject(created);
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isCreatingNew ? "Create New Industrial Project" : "Switch Active Business Project"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isCreatingNew
                  ? "Flow 1: Initialize persistent project twin & jurisdiction space"
                  : "Select an enterprise workspace or create a new project"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode 1: Project List */}
        {!isCreatingNew ? (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                My Projects ({projects.length})
              </span>

              <button
                onClick={() => setIsCreatingNew(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? "bg-teal-50/40 border-teal-500 shadow-xs ring-2 ring-teal-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {proj.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 font-mono">
                            ACTIVE WORKSPACE
                          </span>
                        )}
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold font-mono ${
                            proj.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="text-slate-700 font-medium">{proj.enterpriseName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5 text-rose-600">
                          <MapPin className="h-3 w-3" />
                          <span>{proj.district}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-teal-700 font-medium">₹{proj.investmentCrores} Cr</span>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {proj.activeApplicationsCount} Clearances Active
                      </span>
                      {isActive ? (
                        <div className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <span className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-0.5">
                          <span>Switch</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mode 2: Create New Project Wizard (Flow 1 & Section 6) */
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
            {/* Natural Language Project Input (Section 6 of Master Prompt) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span>Tell Us About Your Project in Plain English</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Vercel AI SDK • Gemini</span>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={nlpDescription}
                  onChange={(e) => setNlpDescription(e.target.value)}
                  placeholder="e.g. I want to open a medium-sized food processing unit in Baramati with an investment of around ₹2 crore..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 resize-none"
                />
                <button
                  type="button"
                  onClick={handleNlpExtract}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shrink-0 self-end cursor-pointer"
                >
                  Extract Info
                </button>
              </div>
              {nlpExtractedNotice && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{nlpExtractedNotice}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project / Facility Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Pune Biopharma Synthesis Unit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Enterprise Legal Entity</label>
                <input
                  type="text"
                  required
                  value={newEnterpriseName}
                  onChange={(e) => setNewEnterpriseName(e.target.value)}
                  placeholder="e.g. Pune BioTech Innovations Pvt Ltd"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Industrial Sector</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Pharmaceuticals">Pharmaceuticals &amp; APIs</option>
                  <option value="Renewable Energy">Renewable Energy &amp; Solar</option>
                  <option value="Food Processing">Food Processing &amp; Cold Chain</option>
                  <option value="Automotive">Automotive &amp; Precision Engineering</option>
                  <option value="Chemicals">Specialty Chemical Manufacturing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proposed Site Location</label>
                <input
                  type="text"
                  required
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder="e.g. Chakan MIDC Phase II, Pune"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Fixed Capital Outlay (₹ Crores)</label>
                <input
                  type="number"
                  value={newInvestment}
                  onChange={(e) => setNewInvestment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Capacity (TPD / MW)</label>
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Initialize Workspace &amp; Discover Approvals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
