# Copy/Paste Brief for Antigravity

Paste the following instruction into Antigravity from the repository root.

---

## BUILD BRIEF

You are implementing the existing project into an **Intelligent Regulatory Approval & Compliance Orchestration Platform**.

First read all files under:

```text
approval-platform-implementation-md/
```

especially:

```text
00_ANTIGRAVITY_MASTER.md
01_SYSTEM_ARCHITECTURE.md
02_POSTGRES_DATA_MODEL.md
03_REGULATORY_KNOWLEDGE_GRAPH_NEO4J.md
04_RAG_DOCLING_AIRWEAVE_PGVECTOR.md
05_OPA_APPLICABILITY_RISK.md
06_TEMPORAL_WORKFLOW_ENGINE.md
07_INSPECTION_OR_TOOLS.md
08_DOCUMENT_INTELLIGENCE_VERIFIED_DATA.md
09_SLA_COMPLIANCE_RENEWAL_GRIEVANCE.md
10_PM4PY_PROCESS_MINING.md
11_OBSERVABILITY_SECURITY_AUDIT.md
12_API_CONTRACTS.md
13_FRONTEND_JUDGE_DEMO.md
14_IMPLEMENTATION_PHASES_CHECKLIST.md
15_VROOM_REMOVAL_AND_MIGRATION.md
16_AI_AGENT_ARCHITECTURE.md
```

### A. First action: inspect the existing repository

Before editing:

1. identify framework, runtime and package manager;
2. inspect existing frontend/backend/database/AI code;
3. detect current authentication;
4. detect current H3/GIS implementation;
5. detect existing RAG/document pipeline;
6. inspect current schema and migrations;
7. search for VROOM and remove it from implementation;
8. identify reusable modules instead of rebuilding them.

Do not delete working features without a migration reason.

### B. Target architecture

Implement this stack:

```text
PostgreSQL + PostGIS + pgvector
Neo4j
Docling
Airweave/adapters
OPA + Rego
Temporal
PM4Py
Google OR-Tools
H3
OpenTelemetry + Jaeger + Prometheus + Grafana
```

Do not introduce VROOM.

### C. Build the core lifecycle first

The critical path is:

```text
Create business/entity
 ↓
Create industrial project
 ↓
Resolve H3 + authoritative jurisdiction
 ↓
Evaluate applicable approvals
 ↓
Build approval dependency graph
 ↓
Generate customized document checklist
 ↓
Upload/parse/validate document
 ↓
Create verified reusable facts
 ↓
Create application records
 ↓
Start Temporal workflows
 ↓
Run departmental workflow in parallel where dependencies permit
 ↓
Track SLA
 ↓
Handle queries
 ↓
Create inspections
 ↓
Optimize inspector assignment
 ↓
Record inspection
 ↓
Complete decision flow
 ↓
Create compliance/renewal obligations
 ↓
Emit events for PM4Py analytics
```

### D. Do not build disconnected mock screens

Every major UI screen must read real state from the backend.

A button labeled “Submit” must call the application submission API/workflow.

A query must create a database record and workflow state.

An inspection assignment must call the optimizer.

An approval plan must be generated from applicability services.

Synthetic data is allowed only for explicit demo fixtures and must be labeled `DEMO/SYNTHETIC`.

### E. PostgreSQL

Create migrations for:

```text
business_entities
projects
jurisdictions
authorities
approvals
approval_rules
approval_dependencies
project_approval_plan_items
applications
application_documents
document_versions
verified_facts
queries
inspectors
inspector_availability
inspections
compliance_obligations
incentives
incentive_rules
grievances
domain_events
audit_events
knowledge_sources
knowledge_documents
knowledge_chunks
```

Use PostGIS for authoritative spatial geometry and H3 as a derived spatial index. Do not use an H3 cell as the legal boundary.

Use pgvector for regulatory embeddings.

### F. Regulatory knowledge graph

Create Neo4j nodes/relationships for:

```text
Approval
Requirement
DocumentType
Authority
Jurisdiction
Industry
ProjectStage
InspectionType
Scheme
LegalSource
RuleVersion
```

Relationships include:

```text
REQUIRES
DEPENDS_ON
ISSUED_BY
APPLIES_TO
VALID_IN
APPLIES_AT_STAGE
REQUIRES_INSPECTION
SUPPORTED_BY
HAS_RULE_VERSION
```

All decision-relevant graph data must preserve legal/source provenance.

### G. RAG

Implement:

```text
source
 → Airweave/custom adapter
 → raw file
 → Docling
 → structure-aware chunks
 → embeddings
 → PostgreSQL/pgvector
 → metadata-filtered hybrid retrieval
 → citations
 → LLM explanation
```

Regulatory answers must contain citations/source metadata.

If evidence is absent, say evidence is unavailable. Do not invent an answer.

### H. Applicability + OPA

Build a deterministic applicability engine.

Input:

```text
sector
subsector
investment
capacity
workers
stage
location
jurisdiction
other relevant project facts
```

Flow:

```text
ProjectContext
 ↓
candidate approvals
 ↓
OPA/Rego policy evaluation
 ↓
Neo4j dependency resolution
 ↓
ApprovalPlan
```

Persist:

```text
applicable/not applicable
reason
rule version
source
policy version
```

### I. Temporal

Implement:

```text
ProjectApprovalLifecycleWorkflow
ApprovalApplicationWorkflow
```

Use child workflows where appropriate.

Use timers for SLA warnings/breaches and renewal reminders.

Use signals/updates for:

```text
document uploaded
query response
inspection completed
department decision
withdrawal
correction
```

All retried activities must be idempotent.

### J. Inspection optimizer

Do NOT use VROOM.

Implement a separate Python optimizer using Google OR-Tools.

The optimizer must accept:

```text
inspections
inspectors
skills
jurisdictions
availability
working hours
time windows
inspection durations
SLA deadlines
priority
workload limits
locations
```

Hard constraints:

```text
skill match
jurisdiction authorization
availability
no overlap
time window
working hours
daily capacity
statutory deadline feasibility where applicable
```

Soft objectives:

```text
minimize travel
minimize SLA lateness
balance workload
reduce unnecessary movement
```

Return assignment + schedule + applied constraints + infeasibility reasons.

### K. Document validation and reuse

Use Docling for parsing/extraction.

Create deterministic validation rules.

Create `verified_facts` linked to source document versions.

When another application needs an already verified fact, pre-fill/reuse it and show the evidence source.

Do not let an LLM mark a fact verified.

### L. Query, SLA, renewal and grievance

Implement:

```text
Query lifecycle
SLA clocks
SLA warnings
SLA breaches
Policy-based escalations
Compliance obligations
Renewal windows
Grievances
```

Every result must be auditable.

### M. PM4Py

Emit normalized events and build process-mining analysis.

Measure:

```text
median cycle time
p90 cycle time
waiting vs active time
query rate
rework rate
SLA breach rate
inspection lead time
```

Use PM4Py to identify process bottlenecks and deviations.

### N. Observability

Prefer:

```text
OpenTelemetry
Jaeger
Prometheus
Grafana
```

Trace API → Temporal → OPA → DB → Neo4j → optimizer/RAG.

Record correlation IDs, workflow IDs and application IDs.

### O. Security

Implement server-side authorization with:

```text
authentication
role
organization
jurisdiction
resource ownership
OPA policy where appropriate
```

Protect documents with private storage and auditable access.

### P. Frontend

Build these main views:

```text
Applicant Dashboard
Project Onboarding
Approval Plan / Dependency Graph
Document Center
Application Timeline
Query Center
Inspection Board
Map/Jurisdiction View
Compliance + Renewal Center
Department Queue
Government Command Dashboard
Evidence/Explain Panel
```

The UI should make the architecture visible without overwhelming the user.

### Q. Explainability

For every approval, policy decision, document validation and inspection assignment provide a structured explanation.

Examples:

```text
Approval required because:
Rule R-102
Source Section 4.2
Effective from 2026-01-01
```

```text
Inspector assigned because:
FIRE skill ✓
Jurisdiction ✓
Availability ✓
Time window ✓
SLA protected ✓
```

### R. Testing

Implement:

- unit tests for rules;
- OPA policy tests;
- graph query tests;
- document validation tests;
- Temporal workflow tests;
- optimizer fixture tests;
- API tests;
- permission tests;
- RAG citation tests;
- end-to-end scenario test.

### S. Final acceptance scenario

Use one synthetic project and run it fully:

```text
Applicant creates project
 → jurisdiction resolved
 → approval plan generated
 → dependency graph displayed
 → documents requested
 → sample document parsed
 → document validated
 → verified fact created
 → application submitted
 → Temporal workflow starts
 → department scrutiny
 → query raised
 → applicant responds
 → inspection required
 → OR-Tools assignment
 → inspector completes inspection
 → approval completed
 → compliance obligation created
 → renewal reminder scheduled
 → events analyzed by PM4Py
```

At the end, the judge should be able to open an evidence panel and trace:

```text
Decision
 → policy/rule
 → source document
 → graph relationship
 → workflow history
 → audit event
```

### T. Final cleanup

Run repository-wide checks for:

- VROOM references/dependencies;
- fake approval/timeline data accidentally used as production truth;
- hard-coded statutory dates/fees;
- frontend-only workflow transitions;
- un-audited consequential decisions;
- missing authorization checks;
- missing citation metadata.

Before final delivery, document all environment variables, local startup commands, migrations, seed commands, worker startup commands, optimizer startup commands and test commands.

---
