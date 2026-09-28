"use client";

import React, { useState, useEffect } from "react";
import {
  ApprovalNode,
  ProjectTwin,
  INITIAL_PROJECT
} from "@/lib/regulatory-data";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  MapPin,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  FileText,
  Zap,
  Building,
  Layers,
  ArrowRight,
  Sparkles,
  Compass,
  HelpCircle
} from "lucide-react";
import { ContextDrawer } from "@/components/ContextDrawer";
import { ProjectIntentHero } from "@/components/ProjectIntentHero";
import { ApprovalGraphDAG } from "@/components/ApprovalGraphDAG";
import { H3RegulatoryMap } from "@/components/H3RegulatoryMap";
import { DocumentXRay } from "@/components/DocumentXRay";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";

interface ApplicantWorkspaceProps {
  externalSubTab?: string;
  onOpenCopilotWithContext?: (query: string) => void;
}

export function ApplicantWorkspace({
  externalSubTab,
  onOpenCopilotWithContext
}: ApplicantWorkspaceProps) {
  const [project, setProject] = useState<ProjectTwin>(INITIAL_PROJECT);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalNode>(
    project.approvals[2] // Consent to Establish (CTE)
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"intent" | "graph" | "gis" | "validator" | "simulator">("graph");

  // Sync external sub-tab commands from Judge Demo Stepper
  useEffect(() => {
    if (!externalSubTab) return;
    if (externalSubTab === "intent") {
      setActiveSubTab("intent");
    } else if (externalSubTab === "gis" || externalSubTab === "gis-impact") {
      setActiveSubTab("gis");
    } else if (externalSubTab === "graph") {
      setActiveSubTab("graph");
    } else if (externalSubTab === "drawer") {
      setActiveSubTab("graph");
      setIsDrawerOpen(true);
    } else if (externalSubTab === "validator") {
      setActiveSubTab("validator");
    } else if (externalSubTab === "simulator") {
      setActiveSubTab("simulator");
    }
  }, [externalSubTab]);

  const handleSelectApproval = (approval: ApprovalNode) => {
    setSelectedApproval(approval);
    setIsDrawerOpen(true);
  };

  const handleOpenWhy = (approval: ApprovalNode) => {
    setSelectedApproval(approval);
    setIsDrawerOpen(true);
  };

  const handleProjectAnalyzed = (newProject: ProjectTwin) => {
    setProject(newProject);
    setActiveSubTab("graph");
  };

  return (
    <div className="space-y-6">
      {/* Digital Twin Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                PROJECT DIGITAL TWIN #{project.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Phase: {project.currentPhase.replace("_", " ")}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                NSWS Auto-Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-slate-700 font-medium">{project.enterpriseName}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{project.district}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-teal-700 font-medium">Sector: {project.sector}</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Total Investment</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">₹{project.investmentCrores} Cr</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Employment</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{project.employmentTarget} Jobs</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Readiness Score</span>
              <p className="text-lg font-bold text-teal-600 mt-0.5 font-mono">{project.overallReadiness}%</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-medium">SLA Health</span>
              <p className="text-lg font-bold text-emerald-600 mt-0.5 font-mono">{project.slaHealthScore}/100</p>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("intent")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "intent"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-200" />
            <span>What Are You Building?</span>
          </button>

          <button
            onClick={() => setActiveSubTab("graph")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "graph"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Approval Dependency DAG</span>
          </button>

          <button
            onClick={() => setActiveSubTab("gis")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "gis"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Site Regulatory Fingerprint (H3)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("validator")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "validator"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Pre-Submission Doc X-Ray</span>
          </button>

          <button
            onClick={() => setActiveSubTab("simulator")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "simulator"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>What-If Regulatory Simulator</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTENT & PROJECT INTAKE */}
      {activeSubTab === "intent" && (
        <ProjectIntentHero
          onProjectAnalyzed={handleProjectAnalyzed}
          onCancel={() => setActiveSubTab("graph")}
        />
      )}

      {/* VIEW 2: APPROVAL DEPENDENCY DAG & PIPELINE */}
      {activeSubTab === "graph" && (
        <div className="space-y-6">
          <ApprovalGraphDAG
            approvals={project.approvals}
            selectedApproval={selectedApproval}
            onSelectApproval={handleSelectApproval}
            onOpenWhy={handleOpenWhy}
          />

          {/* Detailed Pipeline Card List */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <span>Statutory Clearances Registry ({project.approvals.length} Clearances)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Click any card to inspect legal evidence chain</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.approvals.map((approval) => {
                const isSelected = selectedApproval.id === approval.id;
                return (
                  <div
                    key={approval.id}
                    onClick={() => handleSelectApproval(approval)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/20 shadow-md ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500 font-bold">
                            {approval.shortCode}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-semibold text-teal-700 font-mono">
                            SLA: {approval.slaDays}d
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                          {approval.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {approval.department}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          approval.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : approval.status === "IN_REVIEW"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {approval.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1 truncate max-w-[280px]">
                        <HelpCircle className="h-3 w-3 text-teal-600 shrink-0" />
                        <span className="text-teal-700 font-semibold shrink-0">Why Required: </span>
                        <span className="text-slate-700 truncate">{approval.whyRequired.clause}</span>
                      </span>

                      <span className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 shrink-0">
                        Evidence <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: H3 GEOSPATIAL REGULATORY FINGERPRINT */}
      {activeSubTab === "gis" && (
        <H3RegulatoryMap
          onLocationSelected={(loc) => {
            console.log("Selected Location:", loc);
          }}
          highlightImpactProjects={externalSubTab === "gis-impact"}
        />
      )}

      {/* VIEW 4: DOCUMENT X-RAY & VALIDATOR */}
      {activeSubTab === "validator" && <DocumentXRay />}

      {/* VIEW 5: WHAT-IF SIMULATOR */}
      {activeSubTab === "simulator" && (
        <WhatIfSimulator
          initialCapacity={project.capacity}
          initialInvestment={project.investmentCrores}
        />
      )}

      {/* UNIVERSAL CONTEXT DRAWER ("WHY REQUIRED?" EVIDENCE CHAIN) */}
      <ContextDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        approval={selectedApproval}
        onOpenCopilotWithContext={onOpenCopilotWithContext}
        onOpenSimulator={() => {
          setIsDrawerOpen(false);
          setActiveSubTab("simulator");
        }}
      />
    </div>
  );
}
