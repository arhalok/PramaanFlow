/**
 * Applicant AI Tool Layer — Zod Input Schemas
 * In compliance with applicant-tool-spec (1)/01_COMPLETE_TOOL_CATALOG.md and 02_TOOL_SCHEMAS_AND_RESULT_CONTRACT.md
 */

import { z } from "zod";

// A. Applicant / Profile
export const ApplicantGetProfileSchema = z.object({});

export const ApplicantUpdateProfileSchema = z.object({
  patch: z.object({
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    employees: z.number().optional(),
    investmentRange: z.string().optional()
  }),
  idempotencyKey: z.string().optional()
});

export const ApplicantGetRecentContextSchema = z.object({});

// B. Project / Business Context
export const ProjectCreateDraftSchema = z.object({
  naturalLanguageDescription: z.string().min(3),
  idempotencyKey: z.string().optional()
});

export const ProjectGetSchema = z.object({
  projectId: z.string().min(1)
});

export const ProjectUpdateSchema = z.object({
  projectId: z.string().min(1),
  patch: z.record(z.any()),
  idempotencyKey: z.string().optional()
});

export const ProjectConfirmContextSchema = z.object({
  projectId: z.string().min(1),
  confirmedFields: z.record(z.any()),
  idempotencyKey: z.string().optional()
});

// C. Location / Jurisdiction / GIS
export const LocationSearchSchema = z.object({
  query: z.string().min(2),
  countryCode: z.string().default("IN")
});

export const LocationResolveSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

export const JurisdictionGetForProjectSchema = z.object({
  projectId: z.string().min(1)
});

// D. Approval Discovery
export const ApprovalDiscoverSchema = z.object({
  projectId: z.string().min(1),
  filterCategory: z.enum(["ALL", "PRE_ESTABLISHMENT", "PRE_OPERATION", "INCENTIVES"]).optional()
});

export const ApprovalGetSchema = z.object({
  approvalId: z.string().min(1)
});

export const ApprovalGetRequirementsSchema = z.object({
  approvalId: z.string().min(1)
});

export const ApprovalGetApplicabilitySchema = z.object({
  approvalId: z.string().min(1),
  projectId: z.string().optional()
});

// E. Regulatory Knowledge / RAG
export const KnowledgeSearchSchema = z.object({
  query: z.string().min(2),
  jurisdiction: z.string().optional(),
  approvalId: z.string().optional()
});

export const KnowledgeAnswerWithSourcesSchema = z.object({
  question: z.string().min(3),
  approvalId: z.string().optional(),
  projectId: z.string().optional()
});

// F. Dependencies & Knowledge Graph
export const DependencyGetForProjectSchema = z.object({
  projectId: z.string().min(1)
});

// G. Documents & Docling
export const DocumentSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional()
});

export const DocumentUploadSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  category: z.string().optional()
});

export const DocumentGetExtractionSchema = z.object({
  documentId: z.string().min(1)
});

export const DocumentFindReusableSchema = z.object({
  requiredDocumentName: z.string().min(1)
});

// H. Application Drafts & Forms
export const ApplicationCreateDraftSchema = z.object({
  approvalId: z.string().min(1),
  projectId: z.string().min(1),
  idempotencyKey: z.string().optional()
});

export const ApplicationGetSchema = z.object({
  applicationId: z.string().min(1)
});

export const ApplicationGetPrefillSchema = z.object({
  approvalId: z.string().min(1),
  projectId: z.string().optional()
});

export const ApplicationValidateSchema = z.object({
  applicationId: z.string().min(1)
});

export const ApplicationXraySchema = z.object({
  applicationId: z.string().min(1)
});

export const ApplicationGetActionRequiredSchema = z.object({
  applicationId: z.string().optional()
});

export const ApplicationSubmitSchema = z.object({
  applicationId: z.string().min(1),
  declarationConfirmed: z.boolean(),
  idempotencyKey: z.string().optional()
});

export const ApplicationGetTimelineSchema = z.object({
  applicationId: z.string().min(1)
});

// I. Inspections & Scheduling
export const InspectionGetAvailableSlotsSchema = z.object({
  applicationId: z.string().optional(),
  district: z.string().optional()
});

export const InspectionScheduleSchema = z.object({
  applicationId: z.string().min(1),
  slotId: z.string().min(1),
  scheduledDate: z.string().min(1)
});

// J. Notifications & Grievance
export const NotificationListSchema = z.object({
  unreadOnly: z.boolean().optional()
});

export const GrievanceGetEligibilitySchema = z.object({
  applicationId: z.string().min(1)
});

export const GrievanceSubmitSchema = z.object({
  applicationId: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(5),
  idempotencyKey: z.string().optional()
});

// K. Global Search & UI Navigation
export const GlobalSearchSchema = z.object({
  query: z.string().min(2)
});

export const UiOpenRouteSchema = z.object({
  routeId: z.enum(["HOME", "DISCOVER", "APPLICATION", "DOCUMENTS", "APPROVAL", "TRACKING", "DEPENDENCIES", "SIMULATOR"]),
  params: z.record(z.string()).optional()
});

export const UiFocusFieldSchema = z.object({
  applicationId: z.string(),
  fieldId: z.string()
});

// L. Composite Fast-Path Tools (Section 7 of 09_ANTIGRAVITY_BUILD_PROMPT.md)
export const ApplicantGetHomeContextSchema = z.object({
  projectId: z.string().optional()
});

export const ProjectGetReadinessSnapshotSchema = z.object({
  projectId: z.string().min(1)
});

export const ApprovalGetFullContextSchema = z.object({
  approvalId: z.string().min(1),
  projectId: z.string().optional()
});

export const ApplicationGetWorkspaceContextSchema = z.object({
  approvalId: z.string().min(1),
  projectId: z.string().optional()
});

export const ApplicationGetTrackingContextSchema = z.object({
  applicationId: z.string().min(1)
});
