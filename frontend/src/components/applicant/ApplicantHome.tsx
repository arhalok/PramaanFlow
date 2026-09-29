"use client";

import React, { useState } from "react";
import {
  ProjectTwin,
  ApprovalNode
} from "@/lib/regulatory-data";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  MapPin,
  ArrowRight,
  Shield,
  FileText,
  Sparkles,
  ChevronRight,
  Building2,
  Layers,
  Calendar,
  AlertCircle,
  Award,
  Zap,
  HelpCircle,
  Upload,
  Check,
  Circle,
  ExternalLink,
  Info,
  Scale
} from "lucide-react";

interface ApplicantHomeProps {
  project: ProjectTwin;
  onNavigateTab: (tab: string, approvalId?: string) => void;
  onOpenCopilot: (query: string) => void;
  onOpenProjectSelector?: () => void;
  onStartNewProject?: () => void;
  onOpenImpactSimulator?: () => void;
  onOpenGrievanceModal?: () => void;
  onOpenQueryModal?: () => void;
}

export function ApplicantHome({
  project,
  onNavigateTab,
  onOpenCopilot,
  onOpenProjectSelector,
  onStartNewProject,
  onOpenImpactSimulator,
  onOpenGrievanceModal,
  onOpenQueryModal
}: ApplicantHomeProps) {
  // State simulation: Action Required vs Waiting on Government
  const [isWaitingMode, setIsWaitingMode] = useState<boolean>(false);
  const [activeApprovalTab, setActiveApprovalTab] = useState<"action" | "review" | "done">("action");
  const [selectedJourneyStep, setSelectedJourneyStep] = useState<number>(4);

  // Approval counts
  const approvedCount = project.approvals.filter((a) => a.status === "APPROVED").length;
  const inReviewCount = project.approvals.filter((a) => a.status === "IN_REVIEW").length;
  const actionRequiredCount = project.approvals.filter((a) => a.status === "ACTION_REQUIRED").length;

  // Visual Approval Journey Nodes (Google Maps style route)
  const JOURNEY_STEPS = [
    {
      num: 1,
      title: "Project Setup",
      subtitle: "Basic details & enterprise profile",
      status: "completed",
      why: "Sets up your basic business identity and operating scale.",
      whatNeeded: "Company registration, PAN, investment figure.",
      whatNext: "Used across all government forms without retyping."
    },
    {
      num: 2,
      title: "Location Verification",
      subtitle: "Address, industrial zone & local office",
      status: "completed",
      why: "Determines which specific municipal or industrial authorities have jurisdiction.",
      whatNeeded: "Site address or GPS pin inside notified industrial area.",
      whatNext: "Auto-routes applications to the nearest regional desk."
    },
    {
      num: 3,
      title: "Land Approval",
      subtitle: "Plot allotment & lease deed",
      status: "completed",
      why: "Verifies legal possession and zoning permissions for industrial activity.",
      whatNeeded: "Registered lease deed, cadastral survey number.",
      whatNext: "Unlocks factory layout and environmental clearance filings."
    },
    {
      num: 4,
      title: "Pollution Control Approval",
      subtitle: "Consent to Establish (CTE)",
      status: "current",
      why: "Ensures air, water, and waste treatment systems meet statutory environmental limits before construction.",
      whatNeeded: "Effluent treatment design, water mass balance, raw material list.",
      whatNext: "Pollution board review, site verification, and formal consent letter."
    },
    {
      num: 5,
      title: "Fire Safety Clearance",
      subtitle: "Provisional fire NOC",
      status: "upcoming",
      why: "Mandated building safety clearance before equipment and civil structures are installed.",
      whatNeeded: "Architectural building plan, hydrant placement layout.",
      whatNext: "Site inspection by Chief Fire Officer."
    },
    {
      num: 6,
      title: "Factory Registration",
      subtitle: "Machinery & worker welfare license",
      status: "upcoming",
      why: "Legal authorization to employ industrial workforce and operate heavy machinery under Factories Act.",
      whatNeeded: "Machine horsepower ratings, ventilation plan, emergency exits.",
      whatNext: "Joint safety inspection by DISH inspector."
    },
    {
      num: 7,
      title: "Final Operating Consent",
      subtitle: "Consent to Operate (CTO)",
      status: "upcoming",
      why: "Final green light to begin commercial production and manufacturing operations.",
      whatNeeded: "Trial run report, effluent treatment compliance proof.",
      whatNext: "Final digital license issued with 5-year validity."
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Friendly Entrepreneur Greeting & Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Guided Government Service
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Step-by-step route to launch</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Good morning, Rahul 👋
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-teal-600" />
              {project.name}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              {project.district}, Maharashtra
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold">
              ₹{project.investmentCrores} Cr • {project.capacity} TPD
            </span>
          </div>
          <p className="text-xs text-slate-500 pt-0.5">
            You don&apos;t need to know which approvals or departments apply. We&apos;ll identify them for you and guide you step by step.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          {/* Interactive Simulation Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-500 px-1.5">View mode:</span>
            <button
              onClick={() => setIsWaitingMode(false)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                !isWaitingMode ? "bg-amber-500 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Action Required
            </button>
            <button
              onClick={() => setIsWaitingMode(true)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                isWaitingMode ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Waiting on Gov
            </button>
          </div>

          {onStartNewProject && (
            <button
              onClick={onStartNewProject}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              <span>New Project</span>
            </button>
          )}

          {onOpenProjectSelector && (
            <button
              onClick={onOpenProjectSelector}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-teal-300 bg-white text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Switch Project</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. THE MOST IMPORTANT SCREEN: "YOUR NEXT STEP" HERO BANNER */}
      {isWaitingMode ? (
        /* Reassuring "Nothing Required" State */
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                Under Government Review
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">Nothing required from you right now</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              Your applications are being reviewed by government officers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              MPCB and DISH officers are scrutinizing your submitted documents. Under the statutory Right to Services rules, decisions are expected within 18 days. We will notify you immediately if anything needs your input.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("applications")}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>View Review Status</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Action-First Dominant Next Step */
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30 uppercase tracking-wide">
                Your Next Step
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">Primary action to move forward</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📄</span>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                Complete Pollution Control Application
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              You&apos;re <strong className="text-teal-300">80% through</strong> this application. 3 quick items left to review before automatic submission.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-48 sm:w-64 bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full w-[80%] transition-all duration-500"></div>
              </div>
              <span className="text-xs font-bold text-teal-300 font-mono">
                80% Done
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("workspace")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Continue Application</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. YOU HAVE 3 THINGS TO DO (Actionable Task Cards) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>You Have 3 Things To Do</span>
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete these items to keep your approvals moving without delays.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            3 pending tasks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Task 1 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Due Today
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">
                Upload Fire Safety Plan
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your building requires fire-safety clearance before construction starts. Upload the architectural site layout.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab("documents")}
              className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Plan</span>
            </button>
          </div>

          {/* Task 2 */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-50/80 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Due in 5 Days
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">
                Answer Pollution Clarification
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                The Pollution Control Board asked about water usage. They found a difference between two numbers.
              </p>
            </div>

            <button
              onClick={() => {
                if (onOpenQueryModal) {
                  onOpenQueryModal();
                } else {
                  onNavigateTab("applications", "cte-mpcb");
                }
              }}
              className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>See What They Asked →</span>
            </button>
          </div>

          {/* Task 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Due in 8 Days
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">
                Verify Factory Information
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Confirm total worker count (250) and machine power rating (2,500 KW) for factory licensing.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab("workspace")}
              className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Review Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. SIGNATURE UX: "YOUR PROJECT JOURNEY" (Google Maps for Approvals) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span>Your Project Journey</span>
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow this route from start to your opening day. Click any step to see details.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700">
            Step 4 of 7 Active
          </span>
        </div>

        {/* Horizontal / Responsive Step Trail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {JOURNEY_STEPS.map((step) => {
            const isSelected = selectedJourneyStep === step.num;
            const isDone = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <button
                key={step.num}
                onClick={() => setSelectedJourneyStep(step.num)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/50"
                    : isCurrent
                    ? "border-amber-400 bg-amber-50/30"
                    : isDone
                    ? "border-slate-200 bg-slate-50/60 hover:bg-slate-100/60"
                    : "border-slate-200 bg-white hover:bg-slate-50 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isDone ? "✓" : step.num}
                    </span>

                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isDone
                          ? "text-emerald-700 bg-emerald-50"
                          : isCurrent
                          ? "text-amber-800 bg-amber-100"
                          : "text-slate-400"
                      }`}
                    >
                      {isDone ? "Done" : isCurrent ? "Current" : "Upcoming"}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {step.title}
                  </h4>
                </div>

                <span className="text-[10px] text-slate-500 mt-2 block truncate">
                  {step.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Explanation Card (Answers the 4 essential questions) */}
        {(() => {
          const activeStep = JOURNEY_STEPS.find((s) => s.num === selectedJourneyStep) || JOURNEY_STEPS[3];
          return (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    {activeStep.num}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {activeStep.title} • {activeStep.subtitle}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeStep.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : activeStep.status === "current"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {activeStep.status === "completed"
                    ? "✓ Completed"
                    : activeStep.status === "current"
                    ? "● In Progress"
                    : "○ Upcoming"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Why is this required?
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {activeStep.why}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    What is needed?
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {activeStep.whatNeeded}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    What happens next?
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {activeStep.whatNext}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() =>
                    onOpenCopilot(`Explain more about Step ${activeStep.num} (${activeStep.title}) in simple language for my project.`)
                  }
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Explain this step to me</span>
                </button>

                {activeStep.status === "current" && (
                  <button
                    onClick={() => onNavigateTab("workspace")}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Continue this step</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* 5. APPROVALS DIVIDED BY ACTION (Section 12 of User Prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              All Approvals For Your Project
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Organized by what needs your attention right now versus what is with the government.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveApprovalTab("action")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeApprovalTab === "action"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <span>Do this now (2)</span>
            </button>

            <button
              onClick={() => setActiveApprovalTab("review")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeApprovalTab === "review"
                  ? "bg-teal-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>Waiting for government (2)</span>
            </button>

            <button
              onClick={() => setActiveApprovalTab("done")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeApprovalTab === "done"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Check className="h-3 w-3" />
              <span>Completed (2)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Do This Now */}
        {activeApprovalTab === "action" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-900">
                    Fire Safety Clearance
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-rose-100 text-rose-800">
                    Action Needed
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Why: Your building requires fire-safety clearance before operations can begin.
                </p>
                <p className="text-[11px] text-rose-700 font-medium">
                  What you need to do: Upload the architectural site layout and building plan.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("documents")}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Upload Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900">
                    Factory License Registration
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 text-amber-900">
                    Details Missing
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Why: Legal permit to operate machinery and employ workers on site under Factories Act.
                </p>
                <p className="text-[11px] text-amber-800 font-medium">
                  What you need to do: Complete worker headcount and total machinery power rating.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("workspace")}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Complete Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Waiting for Government */}
        {activeApprovalTab === "review" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-900">
                    Pollution Control Approval (Consent to Establish)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-teal-100 text-teal-800">
                    Under Scrutiny
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Handled by: Maharashtra Pollution Control Board (SRO Pimpri-Chinchwad)
                </p>
                <p className="text-[11px] text-slate-500">
                  Statutory SLA: 60 Days • 18 days remaining under Right to Services rules.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("applications", "cte-mpcb")}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Track Progress</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Industrial Water Supply Connection
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-200 text-slate-700">
                    Pipeline Scrutiny
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Handled by: MIDC Pune Regional Water Works Department
                </p>
                <p className="text-[11px] text-slate-500">
                  Estimated processing time: 7 days remaining.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("applications")}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <span>View Timeline</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Completed */}
        {activeApprovalTab === "done" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    MIDC Land Allotment &amp; Possession Order
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Plot 44-B, Chakan Industrial Area Phase II (12.4 Acres). Registered and active.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("documents")}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Order Document</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    MSEDCL Power Feasibility Approval (2,500 KW)
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Sub-station feeder connection sanctioned from Chakan 220kV grid.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab("documents")}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Feasibility Letter</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. CONTEXTUAL AI: "HELP ME WITH THIS" (Section 9 of User Prompt) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-slate-50 to-blue-50 border border-teal-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wide">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>Need Help With Your Project?</span>
          </div>
          <span className="text-[10px] text-slate-400">Contextual Guide</span>
        </div>

        <p className="text-xs text-slate-600">
          Our assistant knows your active project, location, and required approvals. Click any question to get plain-language answers immediately:
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          <button
            onClick={() => onOpenCopilot("Why do I need pollution control approval (Consent to Establish) for my project?")}
            className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-900 text-xs font-medium hover:bg-teal-50 transition-colors shadow-2xs cursor-pointer"
          >
            &ldquo;Why do I need pollution approval?&rdquo;
          </button>

          <button
            onClick={() => onOpenCopilot("What documents are required to get fire safety clearance?")}
            className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-900 text-xs font-medium hover:bg-teal-50 transition-colors shadow-2xs cursor-pointer"
          >
            &ldquo;What documents do I need for fire safety?&rdquo;
          </button>

          <button
            onClick={() => onOpenCopilot("What happens after I submit my application to the Single Window?")}
            className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-900 text-xs font-medium hover:bg-teal-50 transition-colors shadow-2xs cursor-pointer"
          >
            &ldquo;What happens after submission?&rdquo;
          </button>

          <button
            onClick={() => onOpenCopilot("Explain the water usage clarification requested by MPCB in simple terms.")}
            className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-medium hover:bg-amber-50 transition-colors shadow-2xs cursor-pointer"
          >
            &ldquo;Explain the water clarification&rdquo;
          </button>
        </div>
      </div>
    </div>
  );
}
