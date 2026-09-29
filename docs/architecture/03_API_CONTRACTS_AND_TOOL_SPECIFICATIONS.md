# API Contracts & Tool Specifications
## Comprehensive Interface Specifications for PramaanFlow REST Endpoints & AI Tools

> **Document Version:** 2.0.0  
> **Target Audience:** API Developers, Frontend Engineers, and AI Integration Developers  
> **Status:** Authoritative Specification  

---

## 1. REST Endpoints Overview

All REST endpoints adhere to JSON payloads, standard HTTP status codes, and predictable error formats.

### 1.1 Endpoint Directory

| Method | Endpoint | Description | Request Payload | Response Contract |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/applicant/chat` | Unified Gemini Copilot stream & Tool Dispatcher | `{ messages, projectProfile, locationContext }` or `{ tool, input, context }` | SSE text stream or `ToolResult<T>` JSON |
| `POST` | `/api/applicant/analyze` | Natural Language Project Extraction | `{ description: string }` | Structured Project Profile JSON |
| `POST` | `/api/geospatial` | PostGIS Jurisdiction Containment | `{ lat: number, lng: number }` or `{ query: string }` | `ResolvedLocation` JSON |
| `GET` | `/api/approvals` | Deterministic Roadmap Discovery | `?projectId=...&sector=...` | List of `ApprovalNode` JSON |
| `POST` | `/api/documents` | Multipart Document Upload & Docling | `FormData (file, docType, projectId)` | Verified Extracted Metadata JSON |
| `POST` | `/api/inspections` | Joint Inspection Cluster & Route Optimizer | `{ inspectorId: string, date: string }` | OR-Tools Route & Schedule JSON |

---

## 2. The Standardized `ToolResult<T>` Envelope

Every tool in the Applicant AI Tool layer returns a predictable, auditable contract:

```typescript
export interface ToolResult<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: ToolErrorCode;
    message: string;
    suggestedUserAction?: string;
  };
  metadata: {
    toolName: string;
    source: ToolSource;
    riskLevel: ToolRiskLevel;
    latencyMs: number;
    statutoryActs?: string[];
  };
}

export type ToolSource =
  | "DETERMINISTIC_REGULATORY_GRAPH"
  | "POSTGIS_GEOSPATIAL"
  | "DOCLING_VAULT"
  | "OPA_POLICY_ENGINE"
  | "TEMPORAL_WORKFLOW"
  | "OR_TOOLS_OPTIMIZER"
  | "MAHARASHTRA_RTS_PORTAL";

export type ToolRiskLevel =
  | "READ_ONLY"                   // Safe to execute automatically
  | "LOW_RISK_DRAFT"             // Modifies draft state in browser
  | "USER_CONFIRMATION_REQUIRED"; // Submits binding legal declarations
```

---

## 3. The 25+ Applicant Tool Catalog

### Category A: Profile & Project Context

#### 1. `applicant_get_profile`
* **Purpose:** Retrieves enterprise registration, authorized signatory name, PAN, and contact credentials.
* **Input Schema:** `{}`
* **Risk Level:** `READ_ONLY`

#### 2. `applicant_update_profile`
* **Purpose:** Updates applicant profile parameters with idempotency protection.
* **Input Schema:** `{ patch: { businessName?: string, employees?: number, investmentRange?: string }, idempotencyKey?: string }`
* **Risk Level:** `LOW_RISK_DRAFT`

#### 3. `project_create_draft`
* **Purpose:** Uses natural language extraction to parse a founder's project pitch into structured draft parameters.
* **Input Schema:** `{ naturalLanguageDescription: string, idempotencyKey?: string }`
* **Output Data:** `{ projectId: string, sector: string, estimatedInvestmentCrores: number, suggestedScale: string }`

---

### Category B: Geospatial & Jurisdiction

#### 4. `location_search`
* **Purpose:** Searches address strings across municipal and MIDC/RIICO industrial databases.
* **Input Schema:** `{ query: string, countryCode?: string }`
* **Output Data:** `results: Array<{ name: string, district: string, taluka: string, lat: number, lng: number, planningAuthority: string }>`

#### 5. `location_resolve`
* **Purpose:** Resolves coordinates into an authoritative jurisdiction, planning body, and environmental sub-regional office.
* **Input Schema:** `{ lat: number, lng: number }`
* **Output Data:** `{ displayAddress: string, industrialArea: string, planningAuthority: string, environmentalOffice: string, exemptions: string[] }`

---

### Category C: Approval Discovery & Knowledge Graph

#### 6. `approval_discover`
* **Purpose:** Deterministically evaluates applicable registrations, NOCs, and subsidies based on project attributes and PostGIS zoning.
* **Input Schema:** `{ projectId: string, filterCategory?: "ALL" | "PRE_ESTABLISHMENT" | "PRE_OPERATION" | "INCENTIVES" }`
* **Output Data:** `{ totalMapped: number, approvals: ApprovalNode[], incentives: SchemeItem[] }`

#### 7. `approval_get_requirements`
* **Purpose:** Returns the exact statutory prerequisites, fee schedules, and required document templates for a clearance.
* **Input Schema:** `{ approvalId: string }`
* **Output Data:** `{ approvalId: string, statutoryAct: string, slaDays: number, requiredDocuments: string[], feeInr: number }`

---

### Category D: Document Intelligence & Vault

#### 8. `document_vault_list`
* **Purpose:** Lists all indexed, cryptographic verified documents associated with the enterprise.
* **Input Schema:** `{ enterpriseId: string }`
* **Output Data:** `documents: Array<{ id: string, name: string, documentType: string, isVerified: boolean, sha256: string, extractedFields: Record<string, any> }>`

#### 9. `document_verify_and_extract`
* **Purpose:** Runs Docling layout parsing and schema validation on an uploaded document.
* **Input Schema:** `{ documentId: string, expectedSchemaType: string }`
* **Output Data:** `{ isReadable: boolean, confidence: number, extractedData: Record<string, any>, discrepanciesFound: string[] }`

---

### Category E: Form Filling & Pre-Submission Validation

#### 10. `form_autofill_suggest`
* **Purpose:** Generates zero-retyping field mappings from project profile and verified vault documents with visible AI-suggested tags.
* **Input Schema:** `{ approvalId: string, formSection: string }`
* **Output Data:** `{ fields: Record<string, { value: any, source: string, confidence: number, isReused: boolean }> }`

#### 11. `application_xray` (Check Before Submission)
* **Purpose:** Runs deterministic OPA Rego rules against application dockets to detect inconsistencies before submission.
* **Input Schema:** `{ applicationId: string }`
* **Output Data:** `{ passed: boolean, score: number, ruleResults: Array<{ ruleId: string, title: string, passed: boolean, message: string }> }`

---

### Category F: Applications, Queries & Tracking

#### 12. `application_get_action_required`
* **Purpose:** Returns the single highest-priority blocking action or government query facing the entrepreneur.
* **Input Schema:** `{ projectId: string }`
* **Output Data:** `{ hasBlockingAction: boolean, actionTitle: string, description: string, daysRemaining: number, deepLinkTab: string }`

#### 13. `application_respond_query`
* **Purpose:** Submits an official, factual clarification response and revised attachments to the reviewing officer.
* **Input Schema:** `{ applicationId: string, queryId: string, responseText: string, attachedDocumentIds?: string[] }`
* **Output Data:** `{ responseRecorded: boolean, newStatus: string, slaClockResumed: boolean }`

---

### Category G: Inspections, Compliance & RTS Appeals

#### 14. `inspection_get_slots`
* **Purpose:** Returns upcoming joint inspection windows scheduled by DISH and MPCB.
* **Input Schema:** `{ applicationId: string }`
* **Output Data:** `{ scheduledDate: string, inspectors: string[], preparationChecklist: string[] }`

#### 15. `grievance_check_rts_eligibility`
* **Purpose:** Checks whether an application has exceeded statutory SLAs under Maharashtra Right to Public Services Act 2015.
* **Input Schema:** `{ applicationId: string }`
* **Output Data:** `{ isEligibleForAppeal: boolean, slaDaysTotal: number, daysElapsed: number, appellateAuthority: string }`

#### 16. `grievance_submit_rts_appeal`
* **Purpose:** Lodges a First Appeal under Section 8 of Maharashtra RTS Act 2015 to the First Appellate Authority.
* **Input Schema:** `{ applicationId: string, appealGrounds: string, requestedHearing: boolean }`
* **Output Data:** `{ appealRegistrationNumber: string, hearingWindow: string, trackingUri: string }`

---

### Category H: What-If Sensitivity Simulator

#### 17. `simulation_run_what_if`
* **Purpose:** Simulates how adjusting capacity, investment, or location impacts approvals and eligible subsidies in real time.
* **Input Schema:** `{ baselineProjectId: string, simulatedPatch: { capacity?: number, investment?: number, district?: string } }`
* **Output Data:** `{ newClearancesAdded: string[], clearancesWaived: string[], incentiveChangeInr: number, criticalPathLeadDaysDelta: number }`
