# Complete Applicant Tool Catalog

This is the canonical tool inventory Gemini can use.

Tool naming convention:

`domain_action`

---

# A. Applicant / Profile

## applicant_get_profile
**READ**

Returns the authenticated applicant profile and reusable business identity data.

Input:
```json
{}
```

Output:
- applicantId
- name
- contact
- businesses[]
- verified fields
- saved locations
- preferences

Use for:
"Use my business information."

---

## applicant_get_business
**READ**

Input:
```json
{"businessId":"string"}
```

Returns business profile.

---

## applicant_update_profile
**WRITE_LOW_RISK**

Input:
```json
{
  "patch": {
    "businessName": "string",
    "businessType": "string",
    "employees": 45,
    "investmentRange": "string"
  },
  "idempotencyKey": "string"
}
```

---

## applicant_get_recent_context
**READ**

Returns recent projects, applications, documents, searches and locations.

Use to accelerate returning-user journeys.

---

# B. Project / Business Context

## project_create_draft
**WRITE_LOW_RISK**

Input:
```json
{
  "naturalLanguageDescription":"string",
  "idempotencyKey":"string"
}
```

Use after applicant says:
"I want to open a food processing factory..."

The backend may call Gemini extraction or a deterministic parser, then save a draft.

Return:
- projectId
- extracted fields
- fields requiring confirmation

---

## project_get
**READ**

Input:
```json
{"projectId":"string"}
```

---

## project_update
**WRITE_LOW_RISK**

Input:
```json
{
  "projectId":"string",
  "patch": {},
  "idempotencyKey":"string"
}
```

---

## project_confirm_context
**WRITE_LOW_RISK**

Input:
```json
{
  "projectId":"string",
  "confirmedFields": {},
  "idempotencyKey":"string"
}
```

Use when applicant confirms AI-extracted data.

---

# C. Location / Jurisdiction / GIS

## location_search
**READ**

Input:
```json
{"query":"string","countryCode":"IN"}
```

Returns geocoded candidate locations.

---

## location_resolve
**READ**

Input:
```json
{
  "latitude":26.9124,
  "longitude":75.7873
}
```

Returns:
- address
- H3 cell
- state
- district
- local body
- jurisdiction hierarchy
- responsible authorities
- source/confidence metadata

H3/GIS remain internal.

---

## location_get_project_location
**READ**

Input:
```json
{"projectId":"string"}
```

---

## location_set_project_location
**WRITE_LOW_RISK**

Input:
```json
{
  "projectId":"string",
  "latitude":26.9124,
  "longitude":75.7873,
  "address":"string",
  "idempotencyKey":"string"
}
```

After setting location, backend should invalidate/recalculate jurisdiction-sensitive outputs.

---

## jurisdiction_get_for_project
**READ**

Input:
```json
{"projectId":"string"}
```

---

# D. Approval Discovery

## approval_discover
**READ**

This is one of the most important tools.

Input:
```json
{
  "projectId":"string",
  "includeConditional":true,
  "includeLaterStage":true
}
```

Backend combines:
- project/business context
- location
- jurisdiction
- OPA rules
- Neo4j relationships
- PostgreSQL data
- regulatory knowledge where needed

Output:
```json
{
  "required":[...],
  "conditional":[...],
  "laterStage":[...],
  "renewals":[...],
  "explanations":[...]
}
```

---

## approval_get
**READ**

Input:
```json
{"approvalId":"string"}
```

Returns:
- official name
- department
- jurisdiction
- purpose
- applicability
- requirements
- documents
- prerequisites
- sequence
- official sources
- process metadata

---

## approval_get_applicability
**READ**

Input:
```json
{
  "approvalId":"string",
  "projectId":"string"
}
```

Returns structured rationale.

Do not return invented legal conclusions.

---

## approval_get_requirements
**READ**

Input:
```json
{"approvalId":"string","projectId":"string"}
```

Returns requirements applicable to the specific project.

---

## approval_get_related_approvals
**READ**

Input:
```json
{"approvalId":"string","projectId":"string"}
```

Uses graph relationships.

---

# E. Regulatory Knowledge / RAG

## knowledge_search
**READ**

Input:
```json
{
  "query":"string",
  "projectId":"string",
  "filters":{
    "jurisdiction":"string",
    "authority":"string",
    "approvalId":"string",
    "documentType":"string"
  },
  "topK":8
}
```

Backend:
- pgvector
- Airweave where configured
- indexed official sources
- metadata filters
- reranking if available

Return each source with:
- sourceId
- title
- relevant excerpt
- jurisdiction
- authority
- effective/updated metadata
- URL/document reference
- retrieval score
- citation marker

Never expose raw embeddings.

---

## knowledge_answer_with_sources
**READ**

Input:
```json
{
  "question":"string",
  "projectId":"string",
  "approvalId":"string"
}
```

This tool retrieves grounded knowledge and returns evidence.

Gemini then writes the final response.

---

# F. Knowledge Graph / Dependencies

## dependency_get_for_project
**READ**

Input:
```json
{"projectId":"string"}
```

Returns an applicant-friendly dependency graph.

---

## dependency_get_for_approval
**READ**

Input:
```json
{
  "approvalId":"string",
  "projectId":"string"
}
```

Returns:
- prerequisites
- blockers
- downstream approvals
- parallelizable branches

---

## dependency_check_ready
**READ**

Input:
```json
{
  "approvalId":"string",
  "projectId":"string"
}
```

Returns:
- ready: boolean
- completedPrerequisites
- missingPrerequisites
- blockers
- parallelOpportunities

---

# G. Documents / Docling

## document_list
**READ**

Input:
```json
{
  "projectId":"string",
  "applicationId":"string",
  "status":"all"
}
```

---

## document_search
**READ**

Input:
```json
{
  "query":"string",
  "projectId":"string"
}
```

Examples:
"Find my GST certificate."

---

## document_get
**READ**

Input:
```json
{"documentId":"string"}
```

---

## document_upload
**WRITE_LOW_RISK**

The frontend normally uploads the bytes to storage and sends metadata to the tool/service.

Input:
```json
{
  "projectId":"string",
  "fileId":"string",
  "fileName":"string",
  "mimeType":"string",
  "idempotencyKey":"string"
}
```

---

## document_process
**WRITE_LOW_RISK**

Starts Docling processing.

Input:
```json
{
  "documentId":"string",
  "idempotencyKey":"string"
}
```

Return processing status.

---

## document_get_extraction
**READ**

Returns structured extracted information plus provenance.

---

## document_classify
**READ**

Input:
```json
{"documentId":"string"}
```

Returns likely document type + reasons + needsConfirmation.

---

## document_match_to_requirement
**READ**

Input:
```json
{
  "documentId":"string",
  "requirementId":"string",
  "applicationId":"string"
}
```

Returns:
- match
- missing information
- validation issues
- needsConfirmation

---

## document_find_reusable
**READ**

Input:
```json
{
  "requirementId":"string",
  "applicationId":"string"
}
```

Finds existing eligible documents.

---

## document_reuse
**WRITE_LOW_RISK**

Input:
```json
{
  "documentId":"string",
  "applicationId":"string",
  "requirementId":"string",
  "idempotencyKey":"string"
}
```

---

# H. Application Creation / Forms

## application_create_draft
**WRITE_LOW_RISK**

Input:
```json
{
  "projectId":"string",
  "approvalId":"string",
  "idempotencyKey":"string"
}
```

---

## application_get
**READ**

Input:
```json
{"applicationId":"string"}
```

---

## application_get_form_schema
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns dynamically applicable sections/fields.

---

## application_get_prefill
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns reusable applicant/project/document data.

---

## application_update
**WRITE_LOW_RISK**

Input:
```json
{
  "applicationId":"string",
  "patch": {},
  "idempotencyKey":"string"
}
```

---

## application_get_missing_information
**READ**

Input:
```json
{"applicationId":"string"}
```

---

## application_validate
**READ**

Input:
```json
{"applicationId":"string"}
```

Runs authoritative validation.

---

## application_xray
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns an overall readiness report:
- pass
- warning
- blocking
- missing documents
- policy failures
- dependency failures
- field errors

Use OPA and deterministic validators.

---

## application_get_review
**READ**

Returns final applicant-readable review data.

---

## application_submit
**WRITE_CONFIRM**

Input:
```json
{
  "applicationId":"string",
  "declarationAccepted":true,
  "idempotencyKey":"string"
}
```

Must re-run final validation server-side.

Do not trust prior client validation.

---

# I. Application Tracking / Temporal

## application_list
**READ**

Input:
```json
{
  "status":"all",
  "projectId":"string"
}
```

---

## application_get_timeline
**READ**

Input:
```json
{"applicationId":"string"}
```

Source workflow state from Temporal / persisted application state.

---

## application_get_current_stage
**READ**

Input:
```json
{"applicationId":"string"}
```

---

## application_get_next_step
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns the next applicant-relevant action.

---

## application_get_action_required
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns only genuine applicant actions.

---

# J. Inspection / Skills / Availability

## inspection_get_requirement
**READ**

Input:
```json
{"applicationId":"string"}
```

---

## inspection_get_available_slots
**READ**

Input:
```json
{
  "applicationId":"string",
  "from":"2026-10-01",
  "to":"2026-10-15"
}
```

Backend matches:
- jurisdiction
- inspection skill requirement
- inspector/resource availability
- workflow state

---

## inspection_schedule
**WRITE_CONFIRM**

Input:
```json
{
  "applicationId":"string",
  "slotId":"string",
  "idempotencyKey":"string"
}
```

---

## inspection_get_status
**READ**

Input:
```json
{"applicationId":"string"}
```

---

# K. Notifications

## notification_list
**READ**

Input:
```json
{"unreadOnly":false}
```

---

## notification_mark_read
**WRITE_LOW_RISK**

Input:
```json
{"notificationId":"string","idempotencyKey":"string"}
```

---

## notification_get_action
**READ**

Input:
```json
{"notificationId":"string"}
```

Returns exact deep-link/action.

---

# L. Grievance / Escalation

## grievance_get_eligibility
**READ**

Input:
```json
{"applicationId":"string"}
```

Returns whether contextual grievance/escalation is available and why.

---

## grievance_create_draft
**WRITE_LOW_RISK**

Input:
```json
{
  "applicationId":"string",
  "issueType":"string",
  "description":"string"
}
```

---

## grievance_submit
**WRITE_CONFIRM**

Input:
```json
{
  "grievanceDraftId":"string",
  "idempotencyKey":"string"
}
```

---

# M. Compliance / Renewal

## compliance_list
**READ**

Input:
```json
{"businessId":"string"}
```

---

## renewal_list
**READ**

Input:
```json
{"businessId":"string"}
```

---

## renewal_get
**READ**

Input:
```json
{"renewalId":"string"}
```

---

# N. Search

## global_search
**READ**

Input:
```json
{
  "query":"string",
  "projectId":"string",
  "scope":["approvals","applications","documents","knowledge"]
}
```

Search may combine PostgreSQL full-text + pgvector/RAG.

---

# O. UI / Navigation

## ui_open_route
**UI_ACTION**

Input:
```json
{
  "route":"/applicant/applications/APP-123/xray"
}
```

---

## ui_focus_field
**UI_ACTION**

Input:
```json
{
  "route":"/applicant/applications/APP-123",
  "fieldId":"sitePlan"
}
```

---

## ui_open_document
**UI_ACTION**

Input:
```json
{
  "documentId":"DOC-123"
}
```

---

## ui_show_dependency_graph
**UI_ACTION**

Input:
```json
{
  "projectId":"PRJ-123"
}
```

---

# P. Composite Orchestration Tools

Composite tools are preferred when several reads are always required together.

## applicant_get_home_context
Returns:
- current project
- active application
- action-required items
- recent notifications
- application summary

---

## project_get_readiness_snapshot
Returns:
- project completeness
- jurisdiction
- approval count
- blockers
- documents
- readiness

---

## approval_get_full_context
Returns:
- approval details
- applicability
- requirements
- documents
- dependencies
- sources
- readiness

This prevents Gemini from making six unnecessary round trips.

---

## application_get_workspace_context
Returns:
- form schema
- current values
- missing fields
- reusable documents
- validation status
- X-Ray
- next action

Use this to power the application workspace.

---

## application_get_tracking_context
Returns:
- status
- timeline
- current stage
- parallel branches
- applicant action
- inspection state
- SLA state
- latest activity

---

# Tool-selection rule

Gemini should prefer:

1. Composite context tool when the UI needs a complete page state.
2. Narrow read tool for focused questions.
3. UI_ACTION after obtaining facts.
4. WRITE_LOW_RISK for reversible applicant-owned drafts.
5. WRITE_CONFIRM for submissions, scheduling, responses, grievances and external actions.
