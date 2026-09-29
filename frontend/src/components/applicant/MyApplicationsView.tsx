"use client";

import React, { useState } from "react";
import {
  ApprovalNode,
  ProjectTwin
} from "@/lib/regulatory-data";
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  MapPin,
  Send,
  Upload,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Paperclip,
  Check
} from "lucide-react";

interface MyApplicationsViewProps {
  project: ProjectTwin;
  initialApprovalId?: string;
  onOpenCopilot: (query: string) => void;
  onOpenGrievanceModal?: (appId: string, title: string) => void;
}

interface ApplicationItem {
  id: string;
  approvalId: string;
  title: string;
  shortCode: string;
  department: string;
  submittedAt: string;
  status: "APPROVED" | "IN_REVIEW" | "ACTION_REQUIRED";
  slaDaysTotal: number;
  slaDaysRemaining: number;
  hasQuery: boolean;
  queryDetails?: {
    officer: string;
    date: string;
    text: string;
    clause: string;
  };
  inspection?: {
    scheduledDate: string;
    inspector: string;
    window: string;
    checklist: string[];
  };
  timeline: {
    stage: string;
    timestamp: string;
    actor: "APPLICANT" | "DEPARTMENT" | "SYSTEM" | "INSPECTOR";
    note: string;
    isCurrent?: boolean;
    isPassed?: boolean;
  }[];
}

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "APP-MPCB-CTE-2026-0812",
    approvalId: "cte-mpcb",
    title: "Consent to Establish (CTE) - Water & Air Acts",
    shortCode: "MPCB-CTE",
    department: "Maharashtra Pollution Control Board (SRO Pimpri-Chinchwad)",
    submittedAt: "12 Sep 2026",
    status: "ACTION_REQUIRED",
    slaDaysTotal: 45,
    slaDaysRemaining: 18,
    hasQuery: true,
    queryDetails: {
      officer: "Er. S. M. Deshmukh (Sub-Regional Officer)",
      date: "28 Sep 2026",
      text: "Discrepancy observed between Form 1 capacity (100 TPD) and EIA Executive Summary envelope (150 TPD). Requisite clarification and certified mass balance calculation required under Section 25 of Water Act 1974.",
      clause: "Water (Prevention & Control of Pollution) Act 1974 Section 25(4)"
    },
    inspection: {
      scheduledDate: "14 Oct 2026",
      inspector: "Er. A. R. Kulkarni (Joint Inspection DISH/MPCB)",
      window: "10:30 AM – 01:00 PM",
      checklist: [
        "Site civil engineer present with original MIDC allotment letter",
        "Zero Liquid Discharge (ZLD) plant foundation blueprint",
        "Effluent treatment continuous monitoring telemetry layout"
      ]
    },
    timeline: [
      {
        stage: "Application Submitted",
        timestamp: "12 Sep 2026, 11:20 AM",
        actor: "APPLICANT",
        note: "Single Window Common Application Form submitted with 4 attached dockets.",
        isPassed: true
      },
      {
        stage: "Preliminary Verification",
        timestamp: "14 Sep 2026, 04:15 PM",
        actor: "SYSTEM",
        note: "Docling optical entity verification completed with 0 blocking schema errors.",
        isPassed: true
      },
      {
        stage: "Departmental Scrutiny",
        timestamp: "18 Sep 2026, 10:00 AM",
        actor: "DEPARTMENT",
        note: "Application taken up for technical scrutiny by SRO Pimpri-Chinchwad.",
        isPassed: true
      },
      {
        stage: "Clarification Requested",
        timestamp: "28 Sep 2026, 02:30 PM",
        actor: "DEPARTMENT",
        note: "Official query raised regarding 100 TPD vs 150 TPD envelope consistency.",
        isCurrent: true
      },
      {
        stage: "Final Order & Grant",
        timestamp: "Pending Resolution",
        actor: "DEPARTMENT",
        note: "Final statutory Consent to Establish order will be issued upon query clearance."
      }
    ]
  },
  {
    id: "APP-MIDC-LAND-2026-0419",
    approvalId: "midc-allotment",
    title: "MIDC Industrial Land Allotment & Lease Deed",
    shortCode: "MIDC-POSS",
    department: "Maharashtra Industrial Development Corporation (MIDC)",
    submittedAt: "10 Aug 2026",
    status: "APPROVED",
    slaDaysTotal: 30,
    slaDaysRemaining: 0,
    hasQuery: false,
    timeline: [
      {
        stage: "Application Submitted",
        timestamp: "10 Aug 2026",
        actor: "APPLICANT",
        note: "Plot application for 12.4 Acres in Chakan Phase II.",
        isPassed: true
      },
      {
        stage: "Allotment Letter Issued",
        timestamp: "22 Aug 2026",
        actor: "DEPARTMENT",
        note: "Land Allotment Order No. MIDC/PUN/2026/4102 granted.",
        isPassed: true
      },
      {
        stage: "Possession & 95-Yr Lease Registered",
        timestamp: "28 Aug 2026",
        actor: "DEPARTMENT",
        note: "Possession receipt executed. Indexed into Docling Vault.",
        isPassed: true,
        isCurrent: true
      }
    ]
  },
  {
    id: "APP-DISH-FAC-2026-0742",
    approvalId: "dish-factory",
    title: "Factory Licence & Machine Layout Plan Approval",
    shortCode: "DISH-FAC",
    department: "Directorate of Industrial Safety & Health (DISH)",
    submittedAt: "18 Sep 2026",
    status: "IN_REVIEW",
    slaDaysTotal: 60,
    slaDaysRemaining: 48,
    hasQuery: false,
    inspection: {
      scheduledDate: "14 Oct 2026",
      inspector: "Er. A. R. Kulkarni (Assistant Director of Factories, Pune)",
      window: "10:30 AM – 01:00 PM",
      checklist: [
        "Factory building architectural elevation blueprints",
        "Machinery emergency shutdown interlocking plan",
        "Ventilation and illumination lux calculations"
      ]
    },
    timeline: [
      {
        stage: "Form 1 Submitted",
        timestamp: "18 Sep 2026, 03:40 PM",
        actor: "APPLICANT",
        note: "Architectural plan & Form 1 filed via Maharashtra Single Window.",
        isPassed: true
      },
      {
        stage: "Under Scrutiny",
        timestamp: "22 Sep 2026, 11:00 AM",
        actor: "DEPARTMENT",
        note: "Initial plan scrutiny completed with positive recommendation.",
        isPassed: true
      },
      {
        stage: "Site Inspection Scheduled",
        timestamp: "27 Sep 2026, 04:30 PM",
        actor: "DEPARTMENT",
        note: "Joint site inspection scheduled for 14 Oct 2026.",
        isCurrent: true
      }
    ]
  },
  {
    id: "APP-MSEDCL-HT-2026-0610",
    approvalId: "msedcl-power",
    title: "HT Industrial Power Sanction (2.5 MVA)",
    shortCode: "MSEDCL-HT",
    department: "Maharashtra State Electricity Distribution Co. Ltd.",
    submittedAt: "20 Sep 2026",
    status: "IN_REVIEW",
    slaDaysTotal: 21,
    slaDaysRemaining: 12,
    hasQuery: false,
    timeline: [
      {
        stage: "Demand Note Filed",
        timestamp: "20 Sep 2026",
        actor: "APPLICANT",
        note: "2.5 MVA 11kV connection requisition submitted.",
        isPassed: true
      },
      {
        stage: "Substation Feasibility Study",
        timestamp: "25 Sep 2026",
        actor: "DEPARTMENT",
        note: "Chakan 132kV Substation load capacity verified.",
        isPassed: true,
        isCurrent: true
      }
    ]
  }
];

export function MyApplicationsView({
  project,
  initialApprovalId,
  onOpenCopilot,
  onOpenGrievanceModal
}: MyApplicationsViewProps) {
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>(
    initialApprovalId
      ? applications.find((a) => a.approvalId === initialApprovalId)?.id || applications[0].id
      : applications[0].id
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Query Resolution Form State
  const [responseText, setResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSuccessMessage, setResponseSuccessMessage] = useState("");

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const filteredApps = applications.filter((app) => {
    if (filterStatus === "ALL") return true;
    return app.status === filterStatus;
  });

  // Handle Query Submission (Scene 10: Applicant responds and timeline updates)
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmittingResponse(true);

    setTimeout(() => {
      setIsSubmittingResponse(false);
      setResponseSuccessMessage("Clarification response successfully recorded and transmitted to MPCB SRO. Application status transitioned to Under Scrutiny.");

      // Update application state
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === selectedApp.id) {
            return {
              ...app,
              status: "IN_REVIEW",
              hasQuery: false,
              timeline: [
                ...app.timeline,
                {
                  stage: "Clarification Submitted",
                  timestamp: "Just Now",
                  actor: "APPLICANT",
                  note: `Applicant clarified: "${responseText.substring(0, 80)}..." Revised mass balance annexed.`,
                  isPassed: true,
                  isCurrent: true
                }
              ]
            };
          }
          return app;
        })
      );

      setResponseText("");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono border border-teal-200 uppercase">
              APPLICATION TRACKING
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Clearances &amp; Departmental Progress</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            My Applications ({applications.length})
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "ALL", label: `All (${applications.length})` },
            { id: "ACTION_REQUIRED", label: "Action Required (1)" },
            { id: "IN_REVIEW", label: "Under Review (2)" },
            { id: "APPROVED", label: "Approved (1)" }
          ].map((filt) => (
            <button
              key={filt.id}
              onClick={() => setFilterStatus(filt.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                filterStatus === filt.id
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Layout: Application Cards (Left 4 cols) + Application Timeline & Query Desk (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Applications List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {filteredApps.map((app) => {
            const isSelected = app.id === selectedApp.id;

            return (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedAppId(app.id);
                  setResponseSuccessMessage("");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-teal-50/25 border-teal-500 shadow-md ring-2 ring-teal-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {app.shortCode}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      app.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : app.status === "IN_REVIEW"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {app.title}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {app.department}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Filed: {app.submittedAt}</span>
                  <span className="font-semibold text-teal-700 font-mono">
                    {app.status === "APPROVED"
                      ? "Granted"
                      : `${app.slaDaysRemaining}d remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Application Dashboard (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Application Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {selectedApp.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-teal-700 font-semibold font-mono">
                    SLA: {selectedApp.slaDaysTotal} Days
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedApp.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.department}
                </p>
              </div>

              <div className="text-right self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Statutory Clock
                </span>
                <span className="text-base font-extrabold font-mono text-teal-700">
                  {selectedApp.status === "APPROVED"
                    ? "COMPLETED"
                    : `${selectedApp.slaDaysRemaining} / ${selectedApp.slaDaysTotal} Days`}
                </span>

                {onOpenGrievanceModal && selectedApp.status !== "APPROVED" && (
                  <button
                    onClick={() => onOpenGrievanceModal(selectedApp.id, selectedApp.title)}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 hover:underline block mt-1 cursor-pointer"
                    title="Lodge statutory appeal under Maharashtra RTS Act 2015"
                  >
                    Lodge RTS Appeal (Flow 21) →
                  </button>
                )}
              </div>
            </div>

            {/* Notification alert banner if response succeeded */}
            {responseSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{responseSuccessMessage}</span>
              </div>
            )}

            {/* SCENE 9 & 10: INTERACTIVE DEPARTMENT CLARIFICATION / QUERY DESK */}
            {selectedApp.hasQuery && selectedApp.queryDetails && (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Official Department Clarification Notice
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                    URGENT • 5 DAYS
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-amber-950">
                  <p className="text-slate-800 font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200">
                    "{selectedApp.queryDetails.text}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-amber-800 pt-1">
                    <span>Officer: <strong>{selectedApp.queryDetails.officer}</strong></span>
                    <span>Legal Basis: <strong>{selectedApp.queryDetails.clause}</strong></span>
                  </div>
                </div>

                {/* Applicant Response Editor */}
                <form onSubmit={handleQuerySubmit} className="space-y-3 pt-2 border-t border-amber-200/60">
                  <label className="text-xs font-bold text-slate-900 block">
                    Submit Applicant Clarification &amp; Attachments
                  </label>
                  <textarea
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Provide your official factual explanation to the Sub-Regional Officer here..."
                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setResponseText(
                          "We confirm that the operational manufacturing capacity under Form 1 is strictly 100 TPD of Active Pharmaceutical Ingredients. The 150 TPD figure in the EIA summary represented a peak instantaneous utility contingency envelope. A certified Zero Liquid Discharge (ZLD) mass balance schedule is hereby attached for your records."
                        )
                      }
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline text-left cursor-pointer"
                    >
                      Fill Sample Clarification Text
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingResponse || !responseText.trim()}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmittingResponse ? (
                        <span>Transmitting Response...</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Official Response to SRO</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* WOW #7: INSPECTION EXPERIENCE & PREPARATION CHECKLIST */}
            {selectedApp.inspection && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span className="font-bold text-slate-900 uppercase tracking-wide">
                      Site Inspection Scheduled (DISH / MPCB Joint Audit)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                    {selectedApp.inspection.scheduledDate}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Inspector</span>
                    <strong className="text-slate-900">{selectedApp.inspection.inspector}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Time Window</span>
                    <strong className="text-slate-900">{selectedApp.inspection.window}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-800 block text-[11px]">
                    Mandatory Site Preparation Checklist:
                  </span>
                  {selectedApp.inspection.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5-STAGE INTERACTIVE APPLICATION TIMELINE */}
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                <span>Statutory Event Timeline</span>
              </h4>

              <div className="space-y-4 pl-2">
                {selectedApp.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-l-0">
                    {/* Event Circle Dot */}
                    <div
                      className={`absolute -left-[7px] top-0.5 h-3.5 w-3.5 rounded-full border-2 bg-white ${
                        event.isPassed
                          ? "border-emerald-500 bg-emerald-500"
                          : event.isCurrent
                          ? "border-amber-500 bg-amber-500 ring-4 ring-amber-500/20"
                          : "border-slate-300"
                      }`}
                    />

                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{event.stage}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                            event.actor === "APPLICANT"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : event.actor === "DEPARTMENT"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {event.actor}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
