# ANTIGRAVITY PROMPT — BUILD THE COMPLETE TOOL LAYER

## Mission

The existing project has an applicant frontend and an AI concept, but the backend tool layer has not been built.

Implement the **complete typed tool layer** so Gemini can genuinely answer applicant questions and perform supported actions through backend services.

This is not a mock chatbot.

Build real tools with real service boundaries.

---

## STEP 1 — AUDIT

Inspect:
- existing app
- frontend
- backend
- database
- AI endpoints
- Gemini integration
- Vercel AI SDK
- schemas
- auth
- document handling
- map
- location
- all existing services

Do not replace working systems unnecessarily.

---

## STEP 2 — CREATE TOOL ARCHITECTURE

Create a structure similar to:

```text
backend/
├── ai/
│   ├── model/
│   ├── prompts/
│   └── tool-registry/
│       ├── index.ts
│       ├── types.ts
│       ├── schemas.ts
│       ├── executor.ts
│       ├── permissions.ts
│       ├── confirmation.ts
│       └── audit.ts
│
├── tools/
│   ├── applicant/
│   ├── project/
│   ├── location/
│   ├── approvals/
│   ├── knowledge/
│   ├── dependencies/
│   ├── documents/
│   ├── applications/
│   ├── inspections/
│   ├── notifications/
│   ├── grievance/
│   ├── compliance/
│   ├── search/
│   └── ui/
│
├── services/
│   ├── ApplicantService
│   ├── ProjectService
│   ├── LocationService
│   ├── JurisdictionService
│   ├── ApprovalService
│   ├── KnowledgeService
│   ├── DependencyService
│   ├── DocumentService
│   ├── ApplicationService
│   ├── ValidationService
│   ├── WorkflowService
│   ├── InspectionService
│   ├── NotificationService
│   ├── GrievanceService
│   ├── ComplianceService
│   └── SearchService
│
└── adapters/
    ├── postgres/
    ├── pgvector/
    ├── neo4j/
    ├── h3/
    ├── postgis/
    ├── opa/
    ├── docling/
    ├── airweave/
    ├── temporal/
    └── availability/
```

Adapt to the actual repository.

---

## STEP 3 — IMPLEMENT THE TOOL REGISTRY

All tools must be registered centrally.

Example:

```ts
export const applicantTools = {
  applicant_get_profile,
  project_get,
  project_create_draft,
  location_search,
  location_resolve,
  approval_discover,
  approval_get,
  knowledge_search,
  dependency_get_for_project,
  document_search,
  document_upload,
  document_get_extraction,
  document_find_reusable,
  application_create_draft,
  application_get,
  application_get_prefill,
  application_validate,
  application_xray,
  application_get_action_required,
  application_submit,
  application_get_timeline,
  inspection_get_available_slots,
  inspection_schedule,
  notification_list,
  grievance_get_eligibility,
  grievance_create_draft,
  grievance_submit,
  global_search,
  ui_open_route,
  ui_focus_field
};
```

Use exact names from:

`01_COMPLETE_TOOL_CATALOG.md`

---

## STEP 4 — USE ZOD FOR EVERY INPUT

No untyped tool input.

Example:

```ts
const applicationXrayInput = z.object({
  applicationId: z.string().min(1)
});
```

Use the project’s existing validation library if equivalent.

---

## STEP 5 — BUILD SERVICE LAYER

Do not put business logic in Gemini tool definitions.

Example:

```text
Gemini
 ↓
application_xray tool
 ↓
ApplicationService
 ↓
ValidationService
 ↓
OPA
 ↓
PostgreSQL
 ↓
ToolResult
```

---

## STEP 6 — CONNECT TECHNOLOGIES

Use the existing technologies in their correct roles:

### PostgreSQL
authoritative transactional data

### pgvector
semantic retrieval

### RAG
regulatory grounding

### Airweave
knowledge/connectors retrieval where configured

### Docling
document parsing/extraction

### Neo4j
relationship/dependency intelligence

### H3/PostGIS
location and jurisdiction resolution

### OPA
deterministic policy/eligibility validation

### Temporal
long-running workflow/application state

### PM4Py
process analytics / useful derived workflow insights

### Skills + Availability
inspection matching and appointment availability

---

## STEP 7 — BUILD COMPOSITE TOOLS

Implement:

```text
applicant_get_home_context
project_get_readiness_snapshot
approval_get_full_context
application_get_workspace_context
application_get_tracking_context
```

These reduce round trips and improve frontend latency.

---

## STEP 8 — CONNECT GEMINI

The Vercel AI SDK must expose the tools to Gemini.

Gemini must:

- understand user intent
- select tools
- call tools
- inspect results
- call follow-up tools when necessary
- answer using actual results
- create UI actions
- ask for confirmation before writes

---

## STEP 9 — BUILD TOOL ROUTING LOGIC

Examples:

"What approvals do I need?"
→ `approval_discover`

"Why do I need this?"
→ `approval_get_applicability`
→ `knowledge_answer_with_sources` if evidence is needed

"What am I missing?"
→ `application_get_action_required`

"Can I submit?"
→ `application_xray`

"Find my GST certificate"
→ `document_search`

"Show my application"
→ `application_list`

"Why is my application waiting?"
→ `application_get_tracking_context`

"When is my inspection?"
→ `inspection_get_status`

"Book inspection"
→ availability
→ confirmation
→ schedule

---

## STEP 10 — BUILD WRITE CONFIRMATION

Never allow Gemini to directly submit.

Required sequence:

```text
User intent
 ↓
Read/validate
 ↓
UI confirmation
 ↓
short-lived confirmation token
 ↓
write tool
 ↓
audit
 ↓
result
```

Apply this to:
- application submission
- inspection booking
- grievance submission
- department response

---

## STEP 11 — BUILD UI ACTIONS

The model should be able to tell the frontend:

```text
OPEN APPLICATION
OPEN APPROVAL
OPEN DOCUMENT
FOCUS FIELD
SHOW DEPENDENCY GRAPH
SHOW X-RAY
```

But only through an allow-listed route/action schema.

Never execute arbitrary model-generated routes.

---

## STEP 12 — ERROR HANDLING

Build structured errors.

Examples:

```text
Application not found
Document unavailable
Knowledge service unavailable
Jurisdiction unresolved
Validation failed
Submission blocked
Appointment no longer available
```

Gemini must explain the actual failure.

Never fabricate success.

---

## STEP 13 — TEST WITH REAL USER QUESTIONS

Create automated tests for at least:

```text
What approvals do I need?
Why do I need this approval?
What documents do I need?
Find my GST certificate.
Use my GST certificate.
What am I missing?
Can I submit?
Why is my application waiting?
What happens next?
When is my inspection?
Book the inspection.
Show my applications.
Raise a grievance.
Search environmental requirements.
```

For each test assert:
- correct tool
- correct parameters
- correct authorization
- correct result
- correct UI action
- no fabricated answer

---

## STEP 14 — SPEED

Optimize the tool layer for responsiveness.

Implement:
- composite read tools
- parallel independent reads
- caching where safe
- request deduplication
- semantic search limits
- efficient graph queries
- indexes
- database connection pooling
- timeout budgets
- graceful degradation

The applicant should not feel the complexity of the architecture.

---

## STEP 15 — FINAL ACCEPTANCE

A user should be able to type:

> "I want to start a food processing factory in Jaipur. What approvals do I need?"

and the system should genuinely:

```text
interpret project
↓
resolve location
↓
resolve jurisdiction
↓
discover approvals
↓
check dependencies
↓
return grounded results
↓
show applicant-friendly UI
```

Then:

> "What am I missing?"

should inspect the actual application.

Then:

> "Find my site plan."

should search the actual document repository.

Then:

> "Can I submit?"

should run actual validation/X-Ray.

Then:

> "Submit it."

should require explicit confirmation and execute the actual submission tool.

The finished result must be a **real tool-enabled AI application**, not a chatbot demo.
