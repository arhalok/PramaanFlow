/**
 * Domain Service Implementation for the Applicant AI Tool Layer
 * In compliance with applicant-tool-spec (1)/04_DOMAIN_SERVICE_IMPLEMENTATION.md & 05_TOOL_BUILDING_WITH_YOUR_TECHNOLOGIES.md
 */

import {
  INITIAL_PROJECT,
  INITIAL_INSPECTIONS,
  BOTTLENECK_DATA,
  ApprovalNode,
  ProjectTwin
} from "@/lib/regulatory-data";
import {
  generateRegulatoryRoadmap,
  DEFAULT_PROJECT_PROFILE,
  DEFAULT_RESOLVED_LOCATION,
  ProjectProfile,
  ResolvedLocation,
  extractProjectParameters
} from "@/lib/project-state";
import { analyzeMaharashtraLocation } from "@/lib/maharashtra-geospatial";
import { SAMPLE_PROJECTS } from "@/components/applicant/ProjectSelectorModal";
import { ToolResult, ToolSource, ToolExecutionContext } from "./types";

// Helper to construct structured ToolResult
function makeResult<T>(
  tool: string,
  data?: T,
  sources?: ToolSource[],
  error?: { code: any; message: string; recoverable: boolean }
): ToolResult<T> {
  return {
    ok: !error,
    data,
    error,
    meta: {
      tool,
      executedAt: new Date().toISOString(),
      requestId: `req-${Date.now().toString(36)}`,
      freshness: "LIVE",
      sources,
      latencyMs: 12
    }
  };
}

// 1. APPLICANT & PROFILE SERVICE
export const ApplicantDomainService = {
  async getProfile(ctx: ToolExecutionContext): Promise<ToolResult> {
    return makeResult("applicant_get_profile", {
      applicantId: ctx.userId || "APP-MH-USER-8921",
      name: "Dr. Rajeshwar Kulkarni",
      designation: "Managing Director & Authorized Signatory",
      enterprise: INITIAL_PROJECT.enterpriseName,
      cin: "U24239MH2024PTC394812",
      pan: "AAACA7829E",
      gstin: "27AAACA7829E1Z9",
      contact: {
        email: "legal@apexlifesciences.in",
        phone: "+91 98230 44819",
        registeredOffice: "Senapati Bapat Road, Pune, Maharashtra 411016"
      },
      verifiedFieldsCount: 18,
      savedLocations: [
        { name: "Chakan MIDC Phase II, Pune", lat: 18.7612, lng: 73.8542 },
        { name: "Butibori Industrial Area, Nagpur", lat: 20.9167, lng: 79.0012 }
      ]
    });
  },

  async getRecentContext(ctx: ToolExecutionContext): Promise<ToolResult> {
    return makeResult("applicant_get_recent_context", {
      activeProject: INITIAL_PROJECT.name,
      activeApplicationId: "APP-MPCB-CTE-2026-0812",
      recentClearanceShortCode: "CTE-MPCB",
      pendingAction: {
        actionRequired: true,
        title: "Clarification Requested: Effluent Mass Balance Discrepancy",
        slaDeadlineDays: 5,
        targetDesk: "MPCB SRO Pimpri-Chinchwad"
      },
      readyToApplyCount: 2,
      inScrutinyCount: 2,
      approvedCount: 2
    });
  }
};

// 2. PROJECT SERVICE
export const ProjectDomainService = {
  async createDraft(description: string, ctx: ToolExecutionContext): Promise<ToolResult> {
    const extracted = extractProjectParameters(description);
    const newProjectId = `PRJ-MH-${Date.now().toString().slice(-4)}`;
    return makeResult("project_create_draft", {
      projectId: newProjectId,
      status: "DRAFT",
      extracted: {
        sector: extracted.extracted.sector || "Pharmaceuticals",
        subSector: extracted.extracted.subSector || "API Bulk Manufacturing",
        capacity: extracted.extracted.capacity || 100,
        capacityUnit: extracted.extracted.capacityUnit || "TPD",
        investmentCrores: extracted.extracted.investmentCrores || 145,
        location: extracted.extractedLocation?.query || "Chakan MIDC, Pune"
      },
      missingFields: extracted.missingFields,
      requiresConfirmation: true
    });
  },

  async getProject(projectId: string): Promise<ToolResult> {
    const matched = SAMPLE_PROJECTS.find((p) => p.id === projectId) || SAMPLE_PROJECTS[0];
    return makeResult("project_get", {
      ...matched,
      polygonBoundary: "Notified Industrial Area (MIDC Act 1961)",
      waterRequirementKld: 150,
      powerRequirementKw: 2500,
      pollutionCategory: "RED"
    });
  },

  async confirmContext(projectId: string, confirmedFields: any): Promise<ToolResult> {
    return makeResult("project_confirm_context", {
      projectId,
      status: "CONFIRMED",
      confirmedFields,
      timestamp: new Date().toISOString()
    });
  },

  async getReadinessSnapshot(projectId: string): Promise<ToolResult> {
    return makeResult("project_get_readiness_snapshot", {
      projectId,
      overallReadinessPercentage: 91,
      legalProfileReady: true,
      locationJurisdictionReady: true,
      prerequisitesFulfilled: 3,
      prerequisitesPending: 0,
      documentsReady: 5,
      documentsMissing: 1,
      missingDocumentName: "Water & Effluent Mass Balance",
      nextRecommendedAction: "Attach Water & Effluent Mass Balance in Application Workspace"
    });
  }
};

// 3. LOCATION & GIS SERVICE
export const LocationDomainService = {
  async search(query: string): Promise<ToolResult> {
    return makeResult("location_search", {
      query,
      results: [
        {
          name: "Chakan Industrial Area Phase II, Pune",
          state: "Maharashtra",
          district: "Pune",
          taluka: "Khed",
          lat: 18.7612,
          lng: 73.8542,
          planningAuthority: "Maharashtra Industrial Development Corporation (MIDC)",
          pollutionControlOffice: "MPCB Sub-Regional Office Pimpri-Chinchwad"
        },
        {
          name: "Butibori Industrial Area, Nagpur",
          state: "Maharashtra",
          district: "Nagpur",
          taluka: "Nagpur Rural",
          lat: 20.9167,
          lng: 79.0012,
          planningAuthority: "MIDC Nagpur",
          pollutionControlOffice: "MPCB SRO Nagpur II"
        },
        {
          name: "Baramati MIDC, Pune",
          state: "Maharashtra",
          district: "Pune",
          taluka: "Baramati",
          lat: 18.1519,
          lng: 74.5771,
          planningAuthority: "MIDC Baramati",
          pollutionControlOffice: "MPCB SRO Pune I"
        }
      ]
    });
  },

  async resolve(lat: number, lng: number): Promise<ToolResult> {
    const geoAnalysis = analyzeMaharashtraLocation(lat, lng);
    return makeResult("location_resolve", {
      coordinates: { lat, lng },
      geospatialJurisdiction: geoAnalysis,
      h3Index: "8860145b25fffff",
      statutoryExemptions: [
        "Non-agricultural land conversion (Section 44 MLRC 1966) exempt inside MIDC notified area",
        "Gram Panchayat construction NOC exempt under Section 37 of MIDC Act 1961"
      ]
    }, [
      {
        type: "official",
        title: "Maharashtra Industrial Development Act 1961 (Sec 37 & 43)",
        url: "https://midcindia.org"
      }
    ]);
  }
};

// 4. APPROVAL DISCOVERY & STATUTORY PROVENANCE SERVICE
export const ApprovalDomainService = {
  async discover(projectId: string, filterCategory?: string): Promise<ToolResult> {
    const approvals = INITIAL_PROJECT.approvals;
    return makeResult("approval_discover", {
      projectId,
      totalCount: approvals.length,
      approvals: approvals.map((a) => ({
        id: a.id,
        shortCode: a.shortCode,
        name: a.name,
        department: a.department,
        slaDays: a.slaDays,
        status: a.status,
        act: a.act,
        riskLevel: a.riskLevel,
        prerequisites: a.dependencies,
        whyApplicable: a.whyRequired?.clause
      }))
    });
  },

  async getApproval(approvalId: string): Promise<ToolResult> {
    const approval =
      INITIAL_PROJECT.approvals.find(
        (a) => a.id === approvalId || a.shortCode.toLowerCase() === approvalId.toLowerCase()
      ) || INITIAL_PROJECT.approvals[2];

    return makeResult("approval_get", approval, [
      {
        type: "official",
        title: `${approval.act} (${approval.department})`,
        url: approval.whyRequired?.sourceUrl || "https://mpcb.gov.in"
      }
    ]);
  },

  async getRequirements(approvalId: string): Promise<ToolResult> {
    const approval =
      INITIAL_PROJECT.approvals.find(
        (a) => a.id === approvalId || a.shortCode.toLowerCase() === approvalId.toLowerCase()
      ) || INITIAL_PROJECT.approvals[2];

    return makeResult("approval_get_requirements", {
      approvalId: approval.id,
      name: approval.name,
      slaDays: approval.slaDays,
      statutoryFeeInr: approval.statutoryFeeInr,
      requiredDocuments: approval.requiredDocuments,
      inspections: approval.inspectionsRequired,
      prerequisites: approval.dependencies
    });
  },

  async getFullContext(approvalId: string): Promise<ToolResult> {
    const approval =
      INITIAL_PROJECT.approvals.find(
        (a) => a.id === approvalId || a.shortCode.toLowerCase() === approvalId.toLowerCase()
      ) || INITIAL_PROJECT.approvals[2];

    return makeResult("approval_get_full_context", {
      approval,
      readiness: {
        canApplyNow: true,
        businessProfileComplete: true,
        locationConfirmed: true,
        prerequisitesMet: true,
        documentsInVaultCount: 3,
        missingDocumentsCount: 1,
        missingDocument: "Water & Effluent Mass Balance"
      },
      statutorySources: [
        {
          act: approval.act,
          authority: approval.department,
          slaDays: approval.slaDays,
          sourceUrl: approval.whyRequired?.sourceUrl
        }
      ]
    });
  }
};

// 5. REGULATORY KNOWLEDGE & RAG SERVICE
export const KnowledgeDomainService = {
  async search(query: string): Promise<ToolResult> {
    const results = [
      {
        title: "Consent to Establish (CTE) Guidelines under Water Act 1974 & Air Act 1981",
        act: "The Water (Prevention and Control of Pollution) Act 1974",
        section: "Section 25",
        summary: "Mandatory prior consent before commencing any civil construction or machinery erection for industrial facilities with trade effluent or air emissions.",
        sourceUrl: "https://mpcb.gov.in/consent-management",
        score: 0.94
      },
      {
        title: "Maharashtra Industrial Development Corporation (MIDC) Land Disposal Regulations",
        act: "Maharashtra Industrial Development Act 1961",
        section: "Section 37 & 43",
        summary: "Notified industrial areas are planning authorities under their own statute; exempted from Gram Panchayat building sanctions.",
        sourceUrl: "https://midcindia.org/circulars",
        score: 0.89
      },
      {
        title: "Maharashtra Package Scheme of Incentives (PSI 2019)",
        act: "Industries, Energy and Labour Department GR No. IID-2019/CR-14",
        section: "Clause 5.2",
        summary: "100% stamp duty waiver and electricity duty exemption for large scale investments exceeding ₹100 Cr in Group C Talukas (Khed Taluka).",
        sourceUrl: "https://maitri.mahaonline.gov.in",
        score: 0.86
      }
    ];

    return makeResult("knowledge_search", { query, results });
  },

  async answerWithSources(question: string): Promise<ToolResult> {
    let answer = `Under Section 25 of the Water Act 1974 and Section 21 of the Air Act 1981, Consent to Establish (CTE) is a non-waivable statutory requirement for all Red Category industrial enterprises in Maharashtra prior to starting civil construction.`;
    const lower = question.toLowerCase();

    if (lower.includes("groundwater") || lower.includes("borewell") || lower.includes("cgwa")) {
      answer = `Under Central Ground Water Authority (CGWA) guidelines 2020 and Maharashtra Groundwater Authority regulations, active extraction exceeding 100 KLD requires prior NOC with mandatory piezometer installation and telemetry reporting.`;
    } else if (lower.includes("incentive") || lower.includes("subsidy") || lower.includes("stamp")) {
      answer = `Under Maharashtra PSI 2019, your facility qualifies for a 100% Stamp Duty Exemption on the MIDC lease deed and a 7-year Electricity Duty Waiver (estimated ₹4.2 Cr in tax savings) due to your ₹145.5 Cr capital outlay in Khed Taluka.`;
    }

    return makeResult("knowledge_answer_with_sources", {
      question,
      answer,
      sources: [
        {
          type: "official",
          title: "The Water (Prevention and Control of Pollution) Act 1974 Sec 25",
          url: "https://mpcb.gov.in"
        },
        {
          type: "official",
          title: "Maharashtra Right to Public Services Act 2015 (SLA Order 24)",
          url: "https://aaplesarkar.mahaonline.gov.in"
        }
      ]
    });
  }
};

// 6. DEPENDENCY & KNOWLEDGE GRAPH SERVICE (Neo4j DAG)
export const DependencyDomainService = {
  async getProjectDependencies(projectId: string): Promise<ToolResult> {
    return makeResult("dependency_get_for_project", {
      projectId,
      criticalPathDays: 90,
      dagNodes: [
        { id: "MIDC-POSS", title: "Industrial Land Possession", status: "COMPLETED", level: 1 },
        { id: "MPCB-CTE", title: "Consent to Establish (CTE)", status: "IN_PROGRESS", level: 2, prereqs: ["MIDC-POSS"] },
        { id: "FIRE-NOC", title: "Provisional Fire Safety NOC", status: "IN_PROGRESS", level: 2, prereqs: ["MIDC-POSS"] },
        { id: "DISH-FAC", title: "Factory Machinery & Plan Approval", status: "WAITING", level: 3, prereqs: ["MPCB-CTE", "FIRE-NOC"] },
        { id: "MSEDCL-HT", title: "2.5 MVA HT Power Energization", status: "WAITING", level: 3, prereqs: ["DISH-FAC"] },
        { id: "MPCB-CTO", title: "Consent to Operate (CTO)", status: "BLOCKED", level: 4, prereqs: ["MPCB-CTE", "DISH-FAC", "MSEDCL-HT"] }
      ]
    });
  }
};

// 7. DOCUMENT VAULT & DOCLING SERVICE
export const DocumentDomainService = {
  async search(query?: string): Promise<ToolResult> {
    const docs = [
      { id: "doc-midc-lease", title: "MIDC Industrial Land Allotment & Lease Deed", fileName: "MIDC_Lease_Deed_Plot_44B.pdf", status: "VERIFIED", category: "LAND", reusedInCount: 4 },
      { id: "doc-eia-emp", title: "EIA Executive Summary & Environmental Plan", fileName: "EIA_EMP_Executive_Summary_Rev2.pdf", status: "FLAGGED_DISCREPANCY", category: "ENVIRONMENTAL", reusedInCount: 2 },
      { id: "doc-factory-layout", title: "Factory Machine Layout & Elevation Drawings", fileName: "Factory_Layout_Plan_Rev3.dwg.pdf", status: "VERIFIED", category: "STRUCTURAL", reusedInCount: 2 },
      { id: "doc-power-sanction", title: "MSEDCL HT Grid Power Feasibility & Demand Note", fileName: "MSEDCL_2.5MVA_Feasibility_Letter.pdf", status: "VERIFIED", category: "UTILITIES", reusedInCount: 2 },
      { id: "doc-moa-aoa", title: "Certificate of Incorporation & MoA / AoA", fileName: "Certificate_of_Incorporation_MCA21.pdf", status: "VERIFIED", category: "LEGAL", reusedInCount: 5 }
    ];

    return makeResult("document_search", { documents: docs });
  },

  async findReusable(requiredDocumentName: string): Promise<ToolResult> {
    const lower = requiredDocumentName.toLowerCase();
    let matchedDoc = null;

    if (lower.includes("land") || lower.includes("allotment") || lower.includes("lease")) {
      matchedDoc = { id: "doc-midc-lease", title: "MIDC Industrial Land Allotment & Lease Deed", fileName: "MIDC_Lease_Deed_Plot_44B.pdf", confidence: 0.98 };
    } else if (lower.includes("layout") || lower.includes("machine") || lower.includes("drawing")) {
      matchedDoc = { id: "doc-factory-layout", title: "Factory Machine Layout & Architectural Elevation", fileName: "Factory_Layout_Plan_Rev3.dwg.pdf", confidence: 0.95 };
    } else if (lower.includes("eia") || lower.includes("environment")) {
      matchedDoc = { id: "doc-eia-emp", title: "EIA Executive Summary", fileName: "EIA_EMP_Executive_Summary_Rev2.pdf", confidence: 0.92 };
    }

    return makeResult("document_find_reusable", {
      requiredDocumentName,
      foundInVault: !!matchedDoc,
      matchedDocument: matchedDoc,
      action: matchedDoc ? "AUTO_ATTACH_AVAILABLE" : "UPLOAD_REQUIRED"
    });
  }
};

// 8. APPLICATION & TEMPORAL WORKFLOW SERVICE
export const ApplicationDomainService = {
  async getActionRequired(applicationId?: string): Promise<ToolResult> {
    return makeResult("application_get_action_required", {
      applicationId: applicationId || "APP-MPCB-CTE-2026-0812",
      approvalName: "Consent to Establish (CTE) - Water & Air Acts",
      hasBlockingAction: true,
      actionTitle: "Respond to Departmental Clarification",
      description: "MPCB SRO Pimpri-Chinchwad requested an updated effluent mass balance confirming 100 TPD base synthesis. 5 days remaining before automatic hearing notice.",
      targetFieldId: "effluentMassBalance",
      deepLinkTab: "applications",
      officer: "Er. S. N. Patil, Sub-Regional Officer",
      clause: "Section 25(2) of Water Act 1974"
    });
  },

  async runXray(applicationId: string): Promise<ToolResult> {
    return makeResult("application_xray", {
      applicationId,
      overallScorePercentage: 91,
      checks: [
        { name: "Enterprise Legal Profile Check", status: "PASSED", detail: "MCA21 registration confirmed" },
        { name: "PostGIS Industrial Zoning Check", status: "PASSED", detail: "Verified inside Chakan MIDC Phase II boundary" },
        { name: "Capacity & EIA Consistency", status: "WARNING", detail: "Form 1 states 100 TPD while EIA annexure mentions 150 TPD envelope", fixAvailable: true },
        { name: "Water Act 1974 Sec 25 Deterministic Rules", status: "PASSED", detail: "Zero Liquid Discharge (ZLD) clause accepted" },
        { name: "Mandatory Document Dossier", status: "PASSED", detail: "3 of 4 required attachments verified in vault" }
      ],
      submissionReady: true
    });
  },

  async getTimeline(applicationId: string): Promise<ToolResult> {
    return makeResult("application_get_timeline", {
      applicationId,
      currentStage: "Departmental Scrutiny (Stage 3 of 5)",
      slaDaysTotal: 45,
      slaDaysElapsed: 27,
      slaDaysRemaining: 18,
      statutoryDeadline: "17 Oct 2026",
      stages: [
        { stage: "Application Submission", date: "02 Sep 2026", status: "COMPLETED" },
        { stage: "Pre-Flight Document Validation", date: "03 Sep 2026", status: "COMPLETED" },
        { stage: "MPCB Department Scrutiny", date: "In Progress (SRO Pimpri-Chinchwad)", status: "ACTIVE" },
        { stage: "Joint Industrial Site Inspection", date: "Scheduled 03 Oct 2026", status: "PENDING" },
        { stage: "Statutory CTE Order Issuance", date: "Estimated 17 Oct 2026", status: "PENDING" }
      ]
    });
  },

  async submit(applicationId: string, declarationConfirmed: boolean): Promise<ToolResult> {
    if (!declarationConfirmed) {
      return makeResult("application_submit", null, undefined, {
        code: "VALIDATION_ERROR",
        message: "Digital declaration must be accepted by authorized signatory prior to submission.",
        recoverable: true
      });
    }

    const trackingId = `APP-MPCB-CTE-${new Date().getFullYear()}-0929`;
    return makeResult("application_submit", {
      applicationId,
      trackingId,
      status: "SUBMITTED",
      timestamp: new Date().toISOString(),
      statutoryDepartment: "Maharashtra Pollution Control Board",
      slaCommitmentDays: 45,
      rtsServiceId: "RTS-MH-MAITRI-024"
    });
  }
};

// 9. INSPECTIONS & APPOINTMENT SCHEDULER SERVICE
export const InspectionDomainService = {
  async getAvailableSlots(): Promise<ToolResult> {
    return makeResult("inspection_get_available_slots", {
      district: "Pune (Chakan MIDC)",
      jointInspectionAgencies: [
        "Maharashtra Pollution Control Board (MPCB)",
        "Directorate of Industrial Safety & Health (DISH)"
      ],
      availableSlots: [
        { slotId: "SLOT-03-OCT-MORN", date: "03 Oct 2026", timeWindow: "10:00 AM – 01:00 PM", inspectorName: "Er. A. R. Kulkarni (Joint Inspection Lead)" },
        { slotId: "SLOT-04-OCT-AFTN", date: "04 Oct 2026", timeWindow: "02:00 PM – 05:00 PM", inspectorName: "Er. S. N. Patil (MPCB Inspector)" },
        { slotId: "SLOT-06-OCT-MORN", date: "06 Oct 2026", timeWindow: "10:00 AM – 01:00 PM", inspectorName: "Er. P. M. Shinde (DISH Inspector)" }
      ]
    });
  }
};

// 10. GRIEVANCE & RTS APPEALS SERVICE (Maharashtra RTS Act 2015)
export const GrievanceDomainService = {
  async getEligibility(applicationId: string): Promise<ToolResult> {
    return makeResult("grievance_get_eligibility", {
      applicationId,
      eligibleForRTSAppeal: true,
      statutoryAct: "Maharashtra Right to Public Services Act 2015 (Sections 18–19)",
      appellateAuthority: "First Appellate Authority: District Collector & District Magistrate, Pune",
      grounds: [
        "Failure by designated officer to deliver statutory service within notified SLA timeline",
        "Unjustified query loop or demand for pre-cleared documentation"
      ]
    });
  },

  async submitGrievance(applicationId: string, category: string, description: string): Promise<ToolResult> {
    const caseId = `RTS-MH-PUN-${Date.now().toString().slice(-4)}`;
    return makeResult("grievance_submit", {
      caseId,
      applicationId,
      category,
      appellateAuthority: "Office of the District Collector, Pune",
      hearingNoticeWindowDays: 15,
      status: "FIRST_APPEAL_LODGED",
      statutoryCitation: "Maharashtra RTS Act 2015 Sec 18"
    });
  }
};
