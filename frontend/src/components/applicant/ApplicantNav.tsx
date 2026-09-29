"use client";

import React, { useState } from "react";
import {
  Home,
  Compass,
  FileText,
  FolderOpen,
  CalendarCheck2,
  SlidersHorizontal,
  Search,
  Bell,
  Sparkles,
  MapPin,
  Building2,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FolderKanban,
  X
} from "lucide-react";
import { ProjectTwin } from "@/lib/regulatory-data";

export type ApplicantTab =
  | "home"
  | "discover"
  | "workspace"
  | "applications"
  | "documents"
  | "compliance"
  | "simulator";

interface ApplicantNavProps {
  activeTab: ApplicantTab;
  onTabChange: (tab: ApplicantTab) => void;
  project: ProjectTwin;
  onOpenSearch: () => void;
  onOpenCopilot: (initialQuery?: string) => void;
  onOpenProjectSelector?: () => void;
  onStartNewProject?: () => void;
  onOpenImpactSimulator?: () => void;
  onOpenGrievanceModal?: () => void;
  hasPendingQuery?: boolean;
}

export function ApplicantNav({
  activeTab,
  onTabChange,
  project,
  onOpenSearch,
  onOpenCopilot,
  onOpenProjectSelector,
  onStartNewProject,
  onOpenImpactSimulator,
  onOpenGrievanceModal,
  hasPendingQuery = true
}: ApplicantNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);

  const TABS = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Find Approvals", icon: Compass },
    { id: "workspace", label: "Application Form", icon: FileText },
    { id: "applications", label: "My Applications", icon: CalendarCheck2, badge: hasPendingQuery ? "1 Action" : undefined },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "compliance", label: "Rules & Renewals", icon: ShieldCheck },
    { id: "simulator", label: "What-If Simulator", icon: SlidersHorizontal }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        {/* Top Context & Utilities Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Active Business & Location Context Chip */}
          <div
            onClick={() => setShowContextModal(true)}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
          >
            <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="h-4 w-4" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {project.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold font-mono">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-slate-700">{project.enterpriseName}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-0.5 text-rose-600 font-medium">
                  <MapPin className="h-3 w-3" />
                  <span>{project.district}, Maharashtra</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-teal-700 font-medium">₹{project.investmentCrores} Cr</span>
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 ml-1 transition-transform" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onStartNewProject && (
              <button
                onClick={onStartNewProject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Guided Step-by-Step New Project Setup"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>+ Start New Project</span>
              </button>
            )}

            {onOpenProjectSelector && (
              <button
                onClick={onOpenProjectSelector}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                title="Switch Active Project Workspace"
              >
                <FolderKanban className="h-3.5 w-3.5 text-slate-500" />
                <span>Switch Project</span>
              </button>
            )}
          </div>

          {/* Right Action Utilities: Search, Notifications, Copilot */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-teal-600" />
              <span>Search approvals, acts, docs...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {hasPendingQuery && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    1
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Statutory Notifications
                    </span>
                    <span className="text-[10px] font-semibold text-teal-700">1 Unresolved Query</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {hasPendingQuery && (
                      <div
                        onClick={() => {
                          setShowNotifications(false);
                          onTabChange("applications");
                        }}
                        className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-amber-900">
                              Clarification Requested by MPCB SRO
                            </span>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              Explain effluent mass balance discrepancy for Consent to Establish (CTE). 5 days remaining.
                            </p>
                            <span className="text-[10px] text-teal-800 font-semibold mt-1 inline-block underline">
                              Open Clarification Desk →
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800">
                            MIDC Land Allotment Registered
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Plot 44-B Chakan Phase II lease deed indexed in Docling Vault.
                          </p>
                          <span className="text-[10px] text-slate-400">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => onOpenCopilot("Analyze what clearances and documents are still missing for my project.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-200" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as ApplicantTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white text-teal-700" : "bg-rose-500 text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Business / Digital Twin Context Modal */}
      {showContextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Project Profile &amp; Digital Twin</h3>
                  <p className="text-[11px] text-slate-500">Auto-synced with NSWS &amp; Maharashtra MAITRI</p>
                </div>
              </div>
              <button
                onClick={() => setShowContextModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Project Name</span>
                <p className="font-bold text-slate-900 mt-0.5">{project.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Enterprise</span>
                <p className="font-bold text-slate-900 mt-0.5">{project.enterpriseName}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Sector / Product</span>
                <p className="font-bold text-teal-700 mt-0.5">{project.sector} • API Manufacturing</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Operating Scale</span>
                <p className="font-bold text-slate-900 mt-0.5">{project.capacity} TPD • ₹{project.investmentCrores} Cr</p>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Jurisdiction &amp; Site</span>
                <p className="font-bold text-slate-900 mt-0.5">Plot 44-B, Chakan Industrial Area Phase II, Khed Taluka, Pune</p>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Authorities: MIDC Pune Regional Office • MPCB SRO Pimpri-Chinchwad • DISH Pune
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {onOpenProjectSelector && (
                  <button
                    onClick={() => {
                      setShowContextModal(false);
                      onOpenProjectSelector();
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Switch / New Project
                  </button>
                )}

                {onOpenImpactSimulator && (
                  <button
                    onClick={() => {
                      setShowContextModal(false);
                      onOpenImpactSimulator();
                    }}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Simulate Impact (Flow 22)
                  </button>
                )}

                {onOpenGrievanceModal && (
                  <button
                    onClick={() => {
                      setShowContextModal(false);
                      onOpenGrievanceModal();
                    }}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    RTS Appeal (Flow 21)
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowContextModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Context
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
