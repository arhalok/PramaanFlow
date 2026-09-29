"use client";

import React, { useState, useEffect } from "react";
import {
  ApprovalNode,
  ProjectTwin,
  INITIAL_PROJECT
} from "@/lib/regulatory-data";
import { ContextDrawer } from "@/components/ContextDrawer";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { DocumentXRay } from "@/components/DocumentXRay";

// Applicant Sub-components (Implementing applicant-frontend-md specifications)
import { ApplicantNav, ApplicantTab } from "@/components/applicant/ApplicantNav";
import { ApplicantHome } from "@/components/applicant/ApplicantHome";
import { ApprovalDiscovery } from "@/components/applicant/ApprovalDiscovery";
import { ApplicationWorkspace as ApplicationBuilder } from "@/components/applicant/ApplicationWorkspace";
import { MyApplicationsView } from "@/components/applicant/MyApplicationsView";
import { DocumentVaultView } from "@/components/applicant/DocumentVaultView";
import { ComplianceRenewalsView } from "@/components/applicant/ComplianceRenewalsView";
import { ContextualCopilotDrawer } from "@/components/applicant/ContextualCopilotDrawer";
import { SearchCommandModal } from "@/components/applicant/SearchCommandModal";
import { ProjectSelectorModal, ProjectSummary } from "@/components/applicant/ProjectSelectorModal";
import { ProjectChangeImpactModal } from "@/components/applicant/ProjectChangeImpactModal";
import { GrievanceEscalationModal } from "@/components/applicant/GrievanceEscalationModal";
import { GuidedProjectOnboarding } from "@/components/applicant/GuidedProjectOnboarding";
import { GovernmentQueryModal } from "@/components/applicant/GovernmentQueryModal";

interface ApplicantWorkspaceProps {
  externalSubTab?: string;
  onOpenCopilotWithContext?: (query: string) => void;
}

export function ApplicantWorkspace({
  externalSubTab,
  onOpenCopilotWithContext
}: ApplicantWorkspaceProps) {
  const [project, setProject] = useState<ProjectTwin>(INITIAL_PROJECT);
  const [activeTab, setActiveTab] = useState<ApplicantTab>("home");

  // Selected approval for detailed examination / applying
  const [selectedApproval, setSelectedApproval] = useState<ApprovalNode>(
    project.approvals[2] // Consent to Establish (CTE)
  );

  // Evidence Drawer State ("Why Required?" statutory provenance)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Contextual Copilot Drawer State
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>("");

  // Global Search Modal State (⌘K)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Multi-Project Workspace Switcher Modal State (Flow 1 & Screen 03)
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState<boolean>(false);

  // Parameter Change Impact Simulator Modal State (Flow 22 & Wow #9)
  const [isImpactModalOpen, setIsImpactModalOpen] = useState<boolean>(false);

  // Statutory Grievance & RTS Appeal Desk State (Flow 21 & Screen 21)
  const [isGrievanceOpen, setIsGrievanceOpen] = useState<boolean>(false);
  const [grievanceTargetAppId, setGrievanceTargetAppId] = useState<string | undefined>(undefined);
  const [grievanceTargetAppTitle, setGrievanceTargetAppTitle] = useState<string | undefined>(undefined);

  // Focused application ID when navigating to applications
  const [focusedApprovalId, setFocusedApprovalId] = useState<string | undefined>("cte-mpcb");

  // Guided Project Onboarding Modal / Wizard State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Government Query Response Modal State
  const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);

  // Sync external sub-tab commands from Judge Demo Stepper
  useEffect(() => {
    if (!externalSubTab) return;
    if (externalSubTab === "intent" || externalSubTab === "discovery") {
      setActiveTab("discover");
    } else if (externalSubTab === "graph") {
      setActiveTab("discover");
    } else if (externalSubTab === "drawer") {
      setActiveTab("discover");
      setIsDrawerOpen(true);
    } else if (externalSubTab === "validator") {
      setActiveTab("workspace");
    } else if (externalSubTab === "simulator") {
      setActiveTab("simulator");
    } else if (externalSubTab === "gis-impact") {
      setActiveTab("home");
    }
  }, [externalSubTab]);

  // Global ⌘K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Universal Navigation Handler
  const handleNavigate = (tab: string, approvalId?: string) => {
    if (approvalId) {
      const match = project.approvals.find((a) => a.id === approvalId || a.shortCode.toLowerCase().includes(approvalId.toLowerCase()));
      if (match) {
        setSelectedApproval(match);
      }
      setFocusedApprovalId(approvalId);
    }

    if (
      tab === "home" ||
      tab === "discover" ||
      tab === "workspace" ||
      tab === "applications" ||
      tab === "documents" ||
      tab === "compliance" ||
      tab === "simulator"
    ) {
      setActiveTab(tab as ApplicantTab);
    } else {
      setActiveTab("discover");
    }
  };

  const handleStartApplication = (approvalNode: ApprovalNode) => {
    setSelectedApproval(approvalNode);
    setActiveTab("workspace");
  };

  const handleOpenWhyEvidence = (approvalNode: ApprovalNode) => {
    setSelectedApproval(approvalNode);
    setIsDrawerOpen(true);
  };

  const handleOpenCopilot = (query?: string) => {
    if (query) setCopilotInitialQuery(query);
    setIsCopilotDrawerOpen(true);
  };

  const handleOpenGrievance = (appId?: string, title?: string) => {
    setGrievanceTargetAppId(appId);
    setGrievanceTargetAppTitle(title);
    setIsGrievanceOpen(true);
  };

  const handleSelectProject = (selected: ProjectSummary) => {
    setProject((prev) => ({
      ...prev,
      id: selected.id,
      name: selected.name,
      enterpriseName: selected.enterpriseName,
      sector: selected.sector,
      subSector: selected.subSector,
      district: selected.district,
      investmentCrores: selected.investmentCrores,
      capacity: selected.capacity
    }));
    setIsProjectSelectorOpen(false);
  };

  const handleCreateNewProject = (newProject: ProjectSummary) => {
    setProject((prev) => ({
      ...prev,
      id: newProject.id,
      name: newProject.name,
      enterpriseName: newProject.enterpriseName,
      sector: newProject.sector,
      subSector: newProject.subSector,
      district: newProject.district,
      investmentCrores: newProject.investmentCrores,
      capacity: newProject.capacity
    }));
    setIsProjectSelectorOpen(false);
  };

  const handleConfirmProjectChange = (updatedParams: { capacity: number; location: string; investment: number }) => {
    setProject((prev) => ({
      ...prev,
      capacity: updatedParams.capacity,
      district: updatedParams.location,
      investmentCrores: updatedParams.investment
    }));
    setIsImpactModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Persistent Context & Tab Navigation Header */}
      <ApplicantNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        project={project}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCopilot={handleOpenCopilot}
        onOpenProjectSelector={() => setIsProjectSelectorOpen(true)}
        onStartNewProject={() => setIsOnboardingOpen(true)}
        onOpenImpactSimulator={() => setIsImpactModalOpen(true)}
        onOpenGrievanceModal={() => handleOpenGrievance()}
        hasPendingQuery={true}
      />

      {/* 2. Main Tab View Router */}
      <div className="min-h-[550px]">
        {/* TAB 1: HOME (Decision Surface & Situation Awareness) */}
        {activeTab === "home" && (
          <ApplicantHome
            project={project}
            onNavigateTab={handleNavigate}
            onOpenCopilot={handleOpenCopilot}
            onOpenProjectSelector={() => setIsProjectSelectorOpen(true)}
            onStartNewProject={() => setIsOnboardingOpen(true)}
            onOpenImpactSimulator={() => setIsImpactModalOpen(true)}
            onOpenGrievanceModal={() => handleOpenGrievance()}
            onOpenQueryModal={() => setIsQueryModalOpen(true)}
          />
        )}

        {/* TAB 2: DISCOVER APPROVALS & SCHEMES (Categorized Universe + DAG Toggle + Incentives) */}
        {activeTab === "discover" && (
          <ApprovalDiscovery
            project={project}
            onStartApplication={handleStartApplication}
            onOpenWhyEvidence={handleOpenWhyEvidence}
          />
        )}

        {/* TAB 3: APPLICATION WORKSPACE (5-Step Single Window Form Builder with Pre-Flight X-Ray) */}
        {activeTab === "workspace" && (
          <ApplicationBuilder
            project={project}
            activeApproval={selectedApproval}
            onSubmitSuccess={(appId) => {
              setActiveTab("applications");
            }}
            onCancel={() => setActiveTab("discover")}
          />
        )}

        {/* TAB 4: MY APPLICATIONS (5-Stage Timeline & Clarification Response Desk) */}
        {activeTab === "applications" && (
          <MyApplicationsView
            project={project}
            initialApprovalId={focusedApprovalId}
            onOpenCopilot={handleOpenCopilot}
            onOpenGrievanceModal={(appId, title) => handleOpenGrievance(appId, title)}
          />
        )}

        {/* TAB 5: DOCUMENT VAULT (Docling Extracted Metadata, Verification & Cross-Clearance Reuse) */}
        {activeTab === "documents" && <DocumentVaultView />}

        {/* TAB 6: COMPLIANCE & RENEWALS (Post-Approval Continuity & Annual Filings) */}
        {activeTab === "compliance" && <ComplianceRenewalsView />}

        {/* TAB 7: WHAT-IF SIMULATOR (Dynamic Parameter Sensitivity Testing) */}
        {activeTab === "simulator" && (
          <WhatIfSimulator
            initialCapacity={project.capacity}
            initialInvestment={project.investmentCrores}
          />
        )}
      </div>

      {/* 3. UNIVERSAL CONTEXT DRAWER ("WHY REQUIRED?" STATUTORY EVIDENCE CHAIN) */}
      <ContextDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        approval={selectedApproval}
        onOpenCopilotWithContext={(query) => {
          setIsDrawerOpen(false);
          handleOpenCopilot(query);
        }}
        onOpenSimulator={() => {
          setIsDrawerOpen(false);
          setActiveTab("simulator");
        }}
      />

      {/* 4. CONTEXTUAL AI COPILOT DRAWER (Sliding Assistant Grounded in Active Context) */}
      <ContextualCopilotDrawer
        isOpen={isCopilotDrawerOpen}
        onClose={() => setIsCopilotDrawerOpen(false)}
        project={project}
        currentTab={activeTab}
        initialQuery={copilotInitialQuery}
        onNavigateTab={handleNavigate}
      />

      {/* 5. GLOBAL REGULATORY SEARCH MODAL (⌘K / Ctrl+K) */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 6. MULTI-PROJECT WORKSPACE SELECTOR (Flow 1 & Screen 03) */}
      <ProjectSelectorModal
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        activeProjectId={project.id}
        onSelectProject={handleSelectProject}
        onCreateNewProject={handleCreateNewProject}
      />

      {/* 7. PARAMETER CHANGE IMPACT SIMULATOR (Flow 22 & Wow #9) */}
      <ProjectChangeImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        project={project}
        onConfirmChange={handleConfirmProjectChange}
      />

      {/* 8. STATUTORY GRIEVANCE & RTS FIRST APPEAL (Flow 21 & Screen 21) */}
      <GrievanceEscalationModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        defaultApplicationId={grievanceTargetAppId}
        defaultApplicationTitle={grievanceTargetAppTitle}
      />

      {/* 9. GUIDED FIRST-TIME PROJECT SETUP WIZARD (Google Maps-Style Navigation) */}
      {isOnboardingOpen && (
        <GuidedProjectOnboarding
          onComplete={(onboardedData) => {
            setProject((prev) => ({
              ...prev,
              ...onboardedData,
              id: onboardedData.id || `proj-${Date.now().toString().slice(-4)}`
            }));
            setIsOnboardingOpen(false);
            setActiveTab("home");
          }}
          onCancelOrContinueExisting={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* 10. PLAIN-LANGUAGE GOVERNMENT QUERY & CLARIFICATION RESPONSE MODAL */}
      <GovernmentQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSuccess={(selectedFigure: string, notes: string) => {
          setIsQueryModalOpen(false);
        }}
        onAskCopilot={(q: string) => handleOpenCopilot(q)}
      />
    </div>
  );
}
