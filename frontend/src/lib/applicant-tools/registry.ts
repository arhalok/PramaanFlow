/**
 * Applicant AI Tool Registry & Executor
 * In compliance with applicant-tool-spec (1)/03_GEMINI_AND_VERCEL_AI_SDK_TOOL_ROUTING.md & 09_ANTIGRAVITY_BUILD_PROMPT.md
 */

import { tool } from "ai";
import {
  ApplicantGetProfileSchema,
  ApplicantGetRecentContextSchema,
  ProjectCreateDraftSchema,
  ProjectGetSchema,
  ProjectConfirmContextSchema,
  LocationSearchSchema,
  LocationResolveSchema,
  ApprovalDiscoverSchema,
  ApprovalGetSchema,
  ApprovalGetRequirementsSchema,
  ApprovalGetApplicabilitySchema,
  KnowledgeSearchSchema,
  KnowledgeAnswerWithSourcesSchema,
  DependencyGetForProjectSchema,
  DocumentSearchSchema,
  DocumentFindReusableSchema,
  ApplicationGetActionRequiredSchema,
  ApplicationXraySchema,
  ApplicationGetTimelineSchema,
  ApplicationSubmitSchema,
  InspectionGetAvailableSlotsSchema,
  GrievanceGetEligibilitySchema,
  GrievanceSubmitSchema,
  ApplicantGetHomeContextSchema,
  ApprovalGetFullContextSchema,
  ApplicationGetWorkspaceContextSchema,
  ApplicationGetTrackingContextSchema,
  ProjectGetReadinessSnapshotSchema
} from "./schemas";
import {
  ApplicantDomainService,
  ProjectDomainService,
  LocationDomainService,
  ApprovalDomainService,
  KnowledgeDomainService,
  DependencyDomainService,
  DocumentDomainService,
  ApplicationDomainService,
  InspectionDomainService,
  GrievanceDomainService
} from "./domain-services";
import { AppTool, ToolExecutionContext, ToolResult } from "./types";

// Central Tool Dictionary with Schemas and Risk Levels
export const APPLICANT_TOOLS_CATALOG: Record<string, AppTool> = {
  applicant_get_profile: {
    name: "applicant_get_profile",
    description: "Returns the authenticated applicant enterprise profile, CIN, GSTIN, and verified attributes. Use when the applicant asks about their company or profile details.",
    risk: "READ",
    inputSchema: ApplicantGetProfileSchema,
    execute: async (_input, ctx) => ApplicantDomainService.getProfile(ctx)
  },

  applicant_get_recent_context: {
    name: "applicant_get_recent_context",
    description: "Returns recent active applications, pending actions, and overall progress stats to accelerate applicant navigation.",
    risk: "READ",
    inputSchema: ApplicantGetRecentContextSchema,
    execute: async (_input, ctx) => ApplicantDomainService.getRecentContext(ctx)
  },

  project_create_draft: {
    name: "project_create_draft",
    description: "Creates a new project draft from an applicant's natural-language project description (e.g. 'I want to build a food processing plant in Baramati'). Extracts sector, location, scale, and investment.",
    risk: "WRITE_LOW_RISK",
    inputSchema: ProjectCreateDraftSchema,
    execute: async (input, ctx) => ProjectDomainService.createDraft(input.naturalLanguageDescription, ctx)
  },

  project_get: {
    name: "project_get",
    description: "Retrieves details of an industrial project including sector, scale, coordinates, and utilities.",
    risk: "READ",
    inputSchema: ProjectGetSchema,
    execute: async (input) => ProjectDomainService.getProject(input.projectId)
  },

  location_search: {
    name: "location_search",
    description: "Searches industrial areas, talukas, and notified MIDC parks in Maharashtra.",
    risk: "READ",
    inputSchema: LocationSearchSchema,
    execute: async (input) => LocationDomainService.search(input.query)
  },

  location_resolve: {
    name: "location_resolve",
    description: "Resolves latitude and longitude coordinates into administrative and industrial jurisdictions (District, Taluka, MIDC, MPCB SRO, planning authority) via PostGIS point-in-polygon.",
    risk: "READ",
    inputSchema: LocationResolveSchema,
    execute: async (input) => LocationDomainService.resolve(input.lat, input.lng)
  },

  approval_discover: {
    name: "approval_discover",
    description: "Discovers the personalized list of statutory approvals and clearances required for an industrial project based on activity, location, and scale. NEVER invent approvals.",
    risk: "READ",
    inputSchema: ApprovalDiscoverSchema,
    execute: async (input) => ApprovalDomainService.discover(input.projectId, input.filterCategory)
  },

  approval_get: {
    name: "approval_get",
    description: "Retrieves complete details of a specific statutory clearance, issuing authority, statutory SLA, and official citations.",
    risk: "READ",
    inputSchema: ApprovalGetSchema,
    execute: async (input) => ApprovalDomainService.getApproval(input.approvalId)
  },

  approval_get_requirements: {
    name: "approval_get_requirements",
    description: "Retrieves the exact list of mandatory statutory documents, fees, and inspection criteria for a clearance.",
    risk: "READ",
    inputSchema: ApprovalGetRequirementsSchema,
    execute: async (input) => ApprovalDomainService.getRequirements(input.approvalId)
  },

  knowledge_search: {
    name: "knowledge_search",
    description: "Performs semantic search across Maharashtra regulatory acts, government resolutions (GRs), and environmental guidelines.",
    risk: "READ",
    inputSchema: KnowledgeSearchSchema,
    execute: async (input) => KnowledgeDomainService.search(input.query)
  },

  knowledge_answer_with_sources: {
    name: "knowledge_answer_with_sources",
    description: "Answers regulatory queries grounded in official statutory acts (Water Act 1974, Air Act 1981, MIDC Act 1961, RTS Act 2015, PSI 2019) with official citations.",
    risk: "READ",
    inputSchema: KnowledgeAnswerWithSourcesSchema,
    execute: async (input) => KnowledgeDomainService.answerWithSources(input.question)
  },

  dependency_get_for_project: {
    name: "dependency_get_for_project",
    description: "Retrieves the directed acyclic graph (DAG) of clearance dependencies and critical path sequence for the project.",
    risk: "READ",
    inputSchema: DependencyGetForProjectSchema,
    execute: async (input) => DependencyDomainService.getProjectDependencies(input.projectId)
  },

  document_search: {
    name: "document_search",
    description: "Searches the applicant's Document Vault for verified documents, OCR snippets, and previous clearance reuse records.",
    risk: "READ",
    inputSchema: DocumentSearchSchema,
    execute: async (input) => DocumentDomainService.search(input.query)
  },

  document_find_reusable: {
    name: "document_find_reusable",
    description: "Checks if a document required by a new clearance is already verified in the applicant's vault to avoid re-upload.",
    risk: "READ",
    inputSchema: DocumentFindReusableSchema,
    execute: async (input) => DocumentDomainService.findReusable(input.requiredDocumentName)
  },

  application_get_action_required: {
    name: "application_get_action_required",
    description: "Checks whether the department has requested any clarifications, missing documents, or applicant actions. Use when the user asks 'What am I missing?' or 'Do I need to do anything?'.",
    risk: "READ",
    inputSchema: ApplicationGetActionRequiredSchema,
    execute: async (input) => ApplicationDomainService.getActionRequired(input.applicationId)
  },

  application_xray: {
    name: "application_xray",
    description: "Runs pre-submission statutory validation checks (OPA rules, boundary verification, EIA consistency) prior to filing.",
    risk: "READ",
    inputSchema: ApplicationXraySchema,
    execute: async (input) => ApplicationDomainService.runXray(input.applicationId)
  },

  application_get_timeline: {
    name: "application_get_timeline",
    description: "Retrieves the real-time 5-stage application tracking timeline, SLA days remaining, and statutory deadline.",
    risk: "READ",
    inputSchema: ApplicationGetTimelineSchema,
    execute: async (input) => ApplicationDomainService.getTimeline(input.applicationId)
  },

  application_submit: {
    name: "application_submit",
    description: "Submits a clearance application to the Single Window gateway after digital declaration. Requires applicant confirmation.",
    risk: "WRITE_CONFIRM",
    inputSchema: ApplicationSubmitSchema,
    execute: async (input) => ApplicationDomainService.submit(input.applicationId, input.declarationConfirmed)
  },

  inspection_get_available_slots: {
    name: "inspection_get_available_slots",
    description: "Retrieves consolidated joint inspection appointment slots (MPCB + DISH) for the facility's location.",
    risk: "READ",
    inputSchema: InspectionGetAvailableSlotsSchema,
    execute: async () => InspectionDomainService.getAvailableSlots()
  },

  grievance_get_eligibility: {
    name: "grievance_get_eligibility",
    description: "Evaluates whether an application has breached statutory SLA timelines under the Maharashtra Right to Public Services Act 2015 for First Appeal escalation.",
    risk: "READ",
    inputSchema: GrievanceGetEligibilitySchema,
    execute: async (input) => GrievanceDomainService.getEligibility(input.applicationId)
  },

  grievance_submit: {
    name: "grievance_submit",
    description: "Submits a formal First Appeal under Maharashtra RTS Act 2015 to the First Appellate Authority (District Collector).",
    risk: "WRITE_CONFIRM",
    inputSchema: GrievanceSubmitSchema,
    execute: async (input) => GrievanceDomainService.submitGrievance(input.applicationId, input.category, input.description)
  },

  // Composite Fast-Path Tools (09_ANTIGRAVITY_BUILD_PROMPT.md Step 7)
  applicant_get_home_context: {
    name: "applicant_get_home_context",
    description: "Retrieves consolidated home context: applicant profile, active project, situation awareness, and pending actions in a single call.",
    risk: "READ",
    inputSchema: ApplicantGetHomeContextSchema,
    execute: async (_input, ctx) => {
      const [profileRes, recentRes] = await Promise.all([
        ApplicantDomainService.getProfile(ctx),
        ApplicantDomainService.getRecentContext(ctx)
      ]);
      return {
        ok: true,
        data: {
          profile: profileRes.data,
          recentContext: recentRes.data
        },
        meta: {
          tool: "applicant_get_home_context",
          executedAt: new Date().toISOString(),
          requestId: `req-composite-${Date.now()}`
        }
      };
    }
  },

  approval_get_full_context: {
    name: "approval_get_full_context",
    description: "Retrieves complete clearance context: overview, statutory rules, required documents, dependencies, and 'Can I Apply Now?' readiness.",
    risk: "READ",
    inputSchema: ApprovalGetFullContextSchema,
    execute: async (input) => ApprovalDomainService.getFullContext(input.approvalId)
  },

  project_get_readiness_snapshot: {
    name: "project_get_readiness_snapshot",
    description: "Retrieves instant pre-flight readiness snapshot across profile, location, prerequisites, and documents for an active project.",
    risk: "READ",
    inputSchema: ProjectGetReadinessSnapshotSchema,
    execute: async (input) => ProjectDomainService.getReadinessSnapshot(input.projectId)
  }
};

/**
 * Executes a tool by name with runtime input validation and structured result wrapping.
 */
export async function executeApplicantTool(
  toolName: string,
  input: any,
  ctx?: Partial<ToolExecutionContext>
): Promise<ToolResult> {
  const toolDef = APPLICANT_TOOLS_CATALOG[toolName];
  if (!toolDef) {
    return {
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: `Tool '${toolName}' is not registered in the Applicant Tool Layer.`,
        recoverable: false
      },
      meta: {
        tool: toolName,
        executedAt: new Date().toISOString(),
        requestId: `req-${Date.now().toString(36)}`
      }
    };
  }

  const execContext: ToolExecutionContext = {
    requestId: `req-${Date.now().toString(36)}`,
    userId: ctx?.userId || "APP-MH-USER-8921",
    sessionId: ctx?.sessionId || "sess-default",
    role: "applicant",
    activeProjectId: ctx?.activeProjectId,
    activeApplicationId: ctx?.activeApplicationId,
    locale: "en-IN",
    timezone: "Asia/Kolkata",
    ...ctx
  };

  try {
    const validatedInput = toolDef.inputSchema.parse(input || {});
    return await toolDef.execute(validatedInput, execContext);
  } catch (err: any) {
    return {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message || "Invalid tool input parameters.",
        recoverable: true
      },
      meta: {
        tool: toolName,
        executedAt: new Date().toISOString(),
        requestId: execContext.requestId
      }
    };
  }
}

/**
 * Vercel AI SDK compatible tool definitions for Gemini.
 */
export function createVercelAiTools(ctx?: Partial<ToolExecutionContext>) {
  const vercelTools: Record<string, any> = {};

  for (const [name, toolDef] of Object.entries(APPLICANT_TOOLS_CATALOG)) {
    vercelTools[name] = tool({
      description: toolDef.description,
      parameters: toolDef.inputSchema,
      execute: async (args: any) => {
        const result = await executeApplicantTool(name, args, ctx);
        return result.data || result.error;
      }
    });
  }

  return vercelTools;
}
