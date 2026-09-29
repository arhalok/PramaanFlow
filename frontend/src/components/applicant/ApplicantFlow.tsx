"use client";

import React, { useState } from "react";
import {
  ProjectProfile,
  ResolvedLocation,
  RegulatoryRoadmap,
  DEFAULT_PROJECT_PROFILE,
  DEFAULT_RESOLVED_LOCATION,
  generateRegulatoryRoadmap
} from "@/lib/project-state";
import { Step1ProjectUnderstanding } from "@/components/applicant/Step1ProjectUnderstanding";
import { Step2ConversationalQA } from "@/components/applicant/Step2ConversationalQA";
import { Step3LocationPicker } from "@/components/applicant/Step3LocationPicker";
import { Step4AnalysisSequence } from "@/components/applicant/Step4AnalysisSequence";
import { Step5CommandCenter } from "@/components/applicant/Step5CommandCenter";
import { Check, Sparkles } from "lucide-react";

interface ApplicantFlowProps {
  initialPrompt?: string;
  onOpenCopilotWithContext?: (query: string) => void;
}

export function ApplicantFlow({
  initialPrompt,
  onOpenCopilotWithContext
}: ApplicantFlowProps) {
  // Step Navigation (1 to 5)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Central Project State
  const [promptText, setPromptText] = useState<string>(
    initialPrompt ||
      "I want to establish a 100 TPD active pharmaceutical ingredient (API) bulk manufacturing facility in Chakan MIDC, Pune with ₹145 Cr investment."
  );

  const [profile, setProfile] = useState<ProjectProfile>(DEFAULT_PROJECT_PROFILE);
  const [location, setLocation] = useState<ResolvedLocation>(DEFAULT_RESOLVED_LOCATION);
  const [suggestedLocationQuery, setSuggestedLocationQuery] = useState<string>("Chakan MIDC, Pune");

  // Verified Regulatory Roadmap generated deterministically
  const [roadmap, setRoadmap] = useState<RegulatoryRoadmap>(() =>
    generateRegulatoryRoadmap(DEFAULT_PROJECT_PROFILE, DEFAULT_RESOLVED_LOCATION)
  );

  // Step 1 -> Step 2
  const handleStep1Submit = (prompt: string) => {
    setPromptText(prompt);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleStep2Complete = (updatedProfile: ProjectProfile, locSuggestion?: string) => {
    setProfile(updatedProfile);
    if (locSuggestion) {
      setSuggestedLocationQuery(locSuggestion);
    }
    setCurrentStep(3);
  };

  // Step 3 -> Step 4
  const handleStep3LocationConfirmed = (resolvedLocation: ResolvedLocation) => {
    setLocation(resolvedLocation);

    // Call backend or local deterministic engine
    const computedRoadmap = generateRegulatoryRoadmap(profile, resolvedLocation);
    setRoadmap(computedRoadmap);

    setCurrentStep(4);
  };

  // Step 4 -> Step 5
  const handleStep4Complete = () => {
    setCurrentStep(5);
  };

  // Reset / Re-Plan
  const handleRestart = () => {
    setCurrentStep(1);
  };

  const STEPS_NAV = [
    { num: 1, label: "Project Intent" },
    { num: 2, label: "AI Clarifications" },
    { num: 3, label: "Site Location" },
    { num: 4, label: "Jurisdiction Analysis" },
    { num: 5, label: "Approval Roadmap" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stepper Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:px-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto">
          {STEPS_NAV.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <div
                  onClick={() => {
                    // Allow navigating backwards to previously completed steps
                    if (isCompleted) {
                      setCurrentStep(s.num as any);
                    }
                  }}
                  className={`flex items-center gap-2 shrink-0 ${
                    isCompleted ? "cursor-pointer group" : ""
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-xs"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.num}
                  </div>

                  <span
                    className={`text-xs hidden sm:inline transition-colors ${
                      isCompleted
                        ? "font-semibold text-slate-800 group-hover:text-teal-700"
                        : isCurrent
                        ? "font-bold text-teal-900"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < STEPS_NAV.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 sm:mx-4 min-w-[20px] transition-colors ${
                      currentStep > idx + 1 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <Step1ProjectUnderstanding
            initialPrompt={promptText}
            onSubmit={handleStep1Submit}
          />
        )}

        {currentStep === 2 && (
          <Step2ConversationalQA
            initialPrompt={promptText}
            onComplete={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3LocationPicker
            initialQuery={suggestedLocationQuery}
            onLocationConfirmed={handleStep3LocationConfirmed}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4AnalysisSequence
            profile={profile}
            location={location}
            roadmap={roadmap}
            onAnalysisComplete={handleStep4Complete}
          />
        )}

        {currentStep === 5 && (
          <Step5CommandCenter
            profile={profile}
            location={location}
            roadmap={roadmap}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
