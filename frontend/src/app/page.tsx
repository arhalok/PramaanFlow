"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ApplicantWorkspace } from "@/components/ApplicantWorkspace";
import { GovernmentCommand } from "@/components/GovernmentCommand";
import { InspectorWorkspace } from "@/components/InspectorWorkspace";
import { AICopilotModal } from "@/components/AICopilotModal";
import { JudgeDemoStepper, JUDGE_DEMO_STEPS, JudgeStep } from "@/components/JudgeDemoStepper";
import { MaharashtraJurisdictionMap } from "@/components/MaharashtraJurisdictionMap";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"applicant" | "government" | "inspector" | "gis-map">(
    "applicant"
  );

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>("");

  // Sub-tab orchestration for Applicant & Government
  const [applicantSubTab, setApplicantSubTab] = useState<string>("home");
  const [governmentSubTab, setGovernmentSubTab] = useState<string>("overview");

  // Judge Demo Stepper state
  const [judgeStepIndex, setJudgeStepIndex] = useState<number>(0);
  const [isJudgeStepperOpen, setIsJudgeStepperOpen] = useState<boolean>(true);

  const handleJudgeStepChange = (step: JudgeStep) => {
    setJudgeStepIndex(step.id - 1);
    setActiveTab(step.persona);

    if (step.persona === "applicant") {
      setApplicantSubTab(step.subTab);
    } else if (step.persona === "government") {
      setGovernmentSubTab(step.subTab);
    }
  };

  const handleOpenCopilotWithQuery = (query: string) => {
    setCopilotInitialQuery(query);
    setIsCopilotOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCopilot={() => {
          setCopilotInitialQuery("Analyze current regulatory clearances, critical path dependencies, and SLA status for our facility.");
          setIsCopilotOpen(true);
        }}
      />

      {/* Main Workspace Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "applicant" && (
          <ApplicantWorkspace
            externalSubTab={applicantSubTab}
            onOpenCopilotWithContext={handleOpenCopilotWithQuery}
          />
        )}
        {activeTab === "government" && (
          <GovernmentCommand
            externalSubTab={governmentSubTab}
            onNavigateToImpactMap={() => {
              setActiveTab("applicant");
              setApplicantSubTab("gis-impact");
            }}
          />
        )}
        {activeTab === "inspector" && <InspectorWorkspace />}
        {activeTab === "gis-map" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Intelligence Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">Maharashtra Geospatial Platform</span>
            </div>
            <MaharashtraJurisdictionMap />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Regulatory OS • National Single Window System (NSWS) &amp; Raj Nivesh Architecture
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              SYNTHETIC OPERATIONAL DATA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Gemini AI &amp; Google OR-Tools CP-SAT Connected
            </span>
            <button
              onClick={() => setIsJudgeStepperOpen(true)}
              className="text-teal-600 hover:text-teal-700 font-semibold underline"
            >
              Open Judge Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Floating AI Copilot Modal */}
      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Floating Judge Demo Stepper */}
      <JudgeDemoStepper
        currentStepIndex={judgeStepIndex}
        onStepChange={handleJudgeStepChange}
        isOpen={isJudgeStepperOpen}
        onToggleOpen={() => setIsJudgeStepperOpen(!isJudgeStepperOpen)}
      />
    </div>
  );
}
