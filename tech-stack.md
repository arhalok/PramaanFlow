# Regulatory OS — Advanced Technology Stack

## 1. Product Engineering Principle

The platform is designed as a **regulatory intelligence and orchestration system**, not another single-window CRUD portal.

Core progression:

```text
Government / External Data
        ↓
Document + Data Ingestion
        ↓
Regulatory Knowledge
        ↓
Ontology / Knowledge Graph
        ↓
Executable Policy
        ↓
Project Digital Twin
        ↓
Process Intelligence
        ↓
Optimization
        ↓
Workflow Orchestration
        ↓
Human Decision / Government Action
        ↓
Audit + Feedback
```

Technology is selected for four criteria:

1. Fast implementation for the prototype.
2. Strong open-source ecosystem.
3. Visible user-facing "magic".
4. Credible path to production government infrastructure.

---

# 2. Recommended Core Stack

| Layer | Primary Technology | Purpose | Prototype Priority |
|---|---|---|---|
| Web application | Next.js + TypeScript | Applicant + government application | P0 |
| UI | Tailwind CSS + shadcn/ui | Fast polished UX | P0 |
| AI UI | Vercel AI SDK | Streaming, tool calls, structured AI UI | P0 |
| Main API | FastAPI + Python | AI/data/optimization backend | P0 |
| Primary DB | PostgreSQL | System of record | P0 |
| Spatial DB | PostGIS | Jurisdiction/site/geospatial computation | P0 |
| Spatial index | H3 | Hierarchical regulatory geography | P0 |
| Vector retrieval | pgvector | Semantic document retrieval | P0 |
| Graph DB | Neo4j | Regulatory/entity/dependency ontology | P0 |
| Documents | S3/Supabase Storage | Source documents and evidence | P0 |
| Document AI | Docling | PDF/table/layout extraction | P0 |
| LLM | Tool-calling LLM | Extraction, reasoning, copilot | P0 |
| Policy engine | Open Policy Agent | Deterministic rules | P1 |
| Process mining | PM4Py | Process discovery and bottlenecks | P1 |
| Optimization | Google OR-Tools | Inspections/resources/routing | P1 |
| Workflow | Temporal | Durable long-running workflows | P1 |
| Maps | MapLibre GL JS | Open interactive maps | P0 |
| Geospatial visualization | deck.gl | H3/layers/large datasets | P0 |
| Realtime | Supabase Realtime | Live application updates | P0 |
| Validation | Pydantic + Zod | Structured data contracts | P0 |
| Testing | Vitest + Pytest + Playwright | Unit/API/E2E testing | P1 |

---

# 3. AI / Intelligence Stack

## 3.1 LLM

Use an LLM primarily as:

- Natural-language interface
- Structured information extractor
- Regulatory document analyzer
- Tool orchestrator
- Explanation generator
- Summarization layer
- Change-impact reasoning assistant

Do NOT use the LLM as the final statutory decision-maker.

Architecture:

```text
User
  ↓
LLM
  ↓
Tool Selection
  ↓
Deterministic Service / Database / Rule Engine
  ↓
Evidence
  ↓
LLM explanation
```

### Required capabilities

- Structured outputs
- Function/tool calling
- Streaming
- JSON schema validation
- Long-context document analysis
- Multilingual input/output

---

# 4. AI Agent Architecture

Do not create many autonomous agents initially.

Use one **Regulatory Copilot Orchestrator** with bounded tools.

```text
                 REGULATORY COPILOT
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
     Project Tools  Regulation Tools  Ops Tools
          │             │             │
          ↓             ↓             ↓
     PostgreSQL       Neo4j/OPA       PM4Py
     PostGIS          pgvector        OR-Tools
```

## Tool examples

```text
get_project_profile()
get_site_regulatory_fingerprint()
find_applicable_approvals()
explain_approval()
get_required_documents()
validate_documents()
check_application_status()
get_sla_status()
find_bottlenecks()
find_dependency_impact()
simulate_project_change()
find_affected_applications()
optimize_inspections()
find_incentives()
search_regulation_source()
```

This creates an AI interface over the actual platform instead of a generic chatbot.

---

# 5. Document Intelligence

## Primary

**Docling**

Use for:

- PDF parsing
- Layout extraction
- Tables
- Headings
- Sections
- Reading order
- OCR-supported documents
- Structured document representation

Pipeline:

```text
Government PDF
      ↓
Docling
      ↓
Document Structure
      ↓
Chunks + Tables + Sections
      ↓
LLM Structured Extraction
      ↓
Regulatory Facts
```

## Optional future technologies

| Technology | Use |
|---|---|
| PaddleOCR | Specialized OCR fallback |
| Tesseract | Lightweight OCR fallback |
| Unstructured | Alternative document ingestion |
| Apache Tika | General document metadata/extraction |

Do not add these unless Docling cannot handle a required document class.

---

# 6. Hybrid Retrieval

Do NOT rely exclusively on vector RAG.

Use:

```text
                USER QUESTION
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Keyword      Vector      Graph
       Search       Search      Traversal
          │           │           │
          └───────────┼───────────┘
                      ↓
               Evidence Ranking
                      ↓
                 LLM Answer
```

## Technologies

- PostgreSQL full-text search
- pgvector
- Neo4j traversal
- Optional BM25/OpenSearch later

This makes regulatory answers much more reliable.

---

# 7. Regulatory Knowledge Graph

## Primary

**Neo4j**

Represent:

```text
Company
Project
Site
Jurisdiction
Sector
Regulation
Clause
Rule
Approval
Document
Department
Officer
Inspection
Query
Application
SLA
Scheme
Certificate
Event
```

Relationships:

```text
Company ──owns──> Project
Project ──located_at──> Site
Site ──inside──> Jurisdiction
Jurisdiction ──activates──> Regulation
Regulation ──contains──> Clause
Clause ──defines──> Rule
Rule ──requires──> Approval
Approval ──requires──> Document
Approval ──processed_by──> Department
Approval ──may_require──> Inspection
Application ──creates──> Event
Inspection ──assigned_to──> Officer
```

## Advanced graph capabilities

Later use Neo4j Graph Data Science for:

- Shortest path
- Dependency analysis
- Centrality
- Similarity
- Community detection
- Impact analysis
- Relationship discovery

---

# 8. Spatial Intelligence

## PostgreSQL + PostGIS

Use for:

- Point-in-polygon
- Jurisdiction boundaries
- Industrial zones
- Distances
- Buffers
- Spatial intersections
- Nearby infrastructure
- Site constraints

## H3

Use H3 as the common spatial identity.

```text
Latitude / Longitude
        ↓
H3 Cell
        ↓
Regulatory Spatial Index
        ↓
Jurisdiction
        ↓
Rules
        ↓
Approvals
```

## Frontend

- MapLibre GL JS
- deck.gl
- H3 layers

## Magic feature

### Regulatory Fingerprint

```text
Site
 ↓
H3
 ↓
PostGIS
 ↓
Spatial rules
 ↓
Regulatory graph
 ↓
Regulatory profile
```

Output:

```text
Applicable jurisdictions
Potential approvals
Inspection requirements
Environmental constraints
Incentives
Infrastructure context
```

---

# 9. Regulatory Policy-as-Code

## Primary

**Open Policy Agent (OPA)**

Use for:

- Eligibility
- Requirement triggering
- Thresholds
- Conditions
- Exceptions
- Workflow guards
- Deterministic pre-validation

Architecture:

```text
Regulation
    ↓
Structured Rule
    ↓
Human Validation
    ↓
OPA Policy
    ↓
Deterministic Evaluation
```

The LLM can propose/extract rules.

OPA evaluates rules.

Human officials retain statutory authority.

---

# 10. Project Digital Twin

Represent every project as a live object composed of:

```text
Company
Project
Site
Regulatory Profile
Approvals
Documents
Dependencies
Inspections
Queries
Events
SLAs
Compliance
Incentives
Certificates
```

## Technologies

- PostgreSQL
- PostGIS
- Neo4j
- H3
- Event store

## Advanced capability

### Regulatory What-If Simulation

Input changes:

```text
Location
Investment
Capacity
Sector
Project stage
Land
Production category
```

System recalculates:

```text
Applicable rules
Approval graph
Document requirements
Inspection requirements
Critical path
Potential incentives
```

---

# 11. Document Verification Intelligence

Use:

- Docling
- Pydantic
- LLM structured extraction
- PostgreSQL
- pgvector
- Entity resolution

Detect:

```text
Missing document
Expired document
Duplicate document
Name mismatch
Address mismatch
Project-size mismatch
Capacity mismatch
Conflicting dates
Conflicting identifiers
```

Output:

```text
✓ Valid
⚠ Potential inconsistency
✕ Missing
```

Every finding should have an evidence trail.

---

# 12. Process Intelligence

## Primary

**PM4Py**

Canonical event model:

```text
APPLICATION_CREATED
PROFILE_COMPLETED
DOCUMENT_UPLOADED
PRECHECK_STARTED
SUBMITTED
ASSIGNED
SCRUTINY_STARTED
QUERY_RAISED
QUERY_RESPONDED
INSPECTION_REQUIRED
INSPECTION_SCHEDULED
INSPECTION_COMPLETED
DECISION_MADE
APPROVED
REJECTED
CERTIFICATE_ISSUED
RENEWAL_DUE
```

Different departmental terminology is mapped into these canonical events.

Example:

```text
"Pending With Officer"
"Under Examination"
"Scrutiny"

        ↓

SCRUTINY_STARTED
```

---

# 13. Process X-Ray

PM4Py derives:

- Actual process paths
- Rework loops
- Queue time
- Processing time
- Handoffs
- Bottlenecks
- Conformance
- Cycle time
- Process variants

Output:

```text
EXPECTED PROCESS
Submit → Scrutiny → Inspection → Decision

OBSERVED PROCESS
Submit → Scrutiny → Query → Response → Scrutiny
        → Query → Response → Inspection → Decision
```

This directly addresses:

- Repetitive scrutiny
- Manual coordination
- Limited bottleneck visibility
- Delays

---

# 14. SLA Intelligence

Use PostgreSQL event timestamps initially.

Calculate:

```text
Time in state
Queue time
Processing time
SLA remaining
SLA breach
SLA risk
Dependency delay
```

Advanced future layer:

- Survival analysis
- Time-series forecasting
- Gradient boosting
- Bayesian models

Do not claim predictive accuracy until trained and validated against real historical data.

---

# 15. Bottleneck / Dependency Intelligence

Neo4j + event analytics.

Example:

```text
Approval B delayed
      ↓
Approval C blocked
      ↓
Inspection delayed
      ↓
Final approval delayed
```

Calculate:

```text
Direct impact
Downstream impact
Applications affected
Departments affected
Inspections affected
```

This becomes:

### Dependency Blast Radius

---

# 16. Inspection Optimization

## Primary

**Google OR-Tools**

Input:

```text
Inspection
Site
Inspector
Skill
Priority
Time window
Duration
Deadline
District
```

Optimize:

```text
Assignment
Routing
Time windows
Workload
SLA deadlines
Priority
Skills
```

Output:

```text
Inspector 07

09:10 Factory A
10:25 Factory C
12:05 Factory D
14:30 Factory H
```

---

# 17. Workflow Orchestration

## Primary

**Temporal**

Use for:

- Long-running applications
- Waiting for applicant response
- Department handoffs
- Inspection scheduling
- SLA timers
- Escalations
- Renewal workflows
- Human approvals

Example:

```text
Application Submitted
       ↓
Department Review
       ↓
WAIT
       ↓
Query Raised
       ↓
WAIT FOR APPLICANT
       ↓
Review Resumes
       ↓
Inspection
       ↓
Decision
```

Temporal is preferred over implementing long-running workflow state manually.

---

# 18. Realtime Architecture

## Prototype

Use:

**Supabase Realtime / PostgreSQL changes**

For:

- Status updates
- Application timeline
- Officer dashboards
- Live map updates
- Inspector updates

## Scale-up

```text
PostgreSQL
    ↓
Outbox Pattern
    ↓
NATS JetStream
    ↓
Event Consumers
```

Use Kafka only when scale or integration requirements justify it.

---

# 19. Event Architecture

Every important action produces an event.

Example:

```json
{
  "event_id": "evt_123",
  "application_id": "app_456",
  "event_type": "QUERY_RAISED",
  "timestamp": "2026-09-28T10:20:00Z",
  "actor_type": "DEPARTMENT_OFFICER",
  "department_id": "dept_01",
  "previous_state": "UNDER_SCRUTINY",
  "new_state": "QUERY_RAISED",
  "reason_code": "MISSING_DOCUMENT",
  "source_system": "DEPARTMENT_X",
  "correlation_id": "corr_789"
}
```

This single event model powers:

```text
Realtime
Analytics
Process Mining
SLA
Audit
Notifications
AI Copilot
```

---

# 20. Regulatory Change Intelligence

Pipeline:

```text
New Notification
      ↓
Docling
      ↓
Structured Extraction
      ↓
Regulation Version
      ↓
Graph Diff
      ↓
OPA Rule Diff
      ↓
Impact Analysis
```

Output:

```text
REGULATORY CHANGE DETECTED

7 rules changed
4 approvals affected
3 departments affected
2 forms affected
31 active applications potentially affected
```

This is the platform's:

### Regulatory Git Diff

---

# 21. Entity Resolution

Use:

- Normalization
- Exact identifiers
- Fuzzy matching
- Semantic similarity
- Graph context
- Human confirmation

Resolve:

```text
ABC Manufacturing Pvt Ltd
ABC Manufacturing Private Limited
ABC Mfg Pvt. Ltd.
```

into:

```text
ABC Manufacturing
```

Only merge entities automatically when confidence and authoritative identifiers support it.

---

# 22. Organization 360

Entity resolution + graph:

```text
Organization
    ├── Projects
    ├── Sites
    ├── Applications
    ├── Approvals
    ├── Licences
    ├── Inspections
    ├── Queries
    ├── Compliance
    └── Incentives
```

Government sees an organization-level regulatory relationship instead of fragmented records.

---

# 23. Incentive Intelligence

Represent schemes as structured entities:

```text
Scheme
Eligibility
Sector
Location
Investment threshold
Employment requirement
Application window
Required documents
Department
Benefits
```

Match:

```text
Project Profile
      ↓
Eligibility Rules
      ↓
Potential Schemes
      ↓
Required Evidence
```

The user sees:

```text
Potential schemes to investigate

Scheme A
Why it may apply:
Sector + location + investment

Missing evidence:
Employment projection
```

Do not promise eligibility unless the authoritative rules establish it.

---

# 24. Multilingual / Voice Interface

## Primary options

- Browser Web Speech APIs for quick prototype
- BHASHINI integration for Indian-language capabilities
- LLM multilingual reasoning

Flow:

```text
Hindi Speech
    ↓
Speech-to-Text
    ↓
Project extraction
    ↓
Regulatory engine
    ↓
Hindi response
```

Example:

> "Mujhe Rajasthan mein food processing unit lagani hai."

→ structured project profile → regulatory analysis.

---

# 25. Frontend Experience Stack

## Applicant

```text
Next.js
React
TypeScript
Tailwind
shadcn/ui
Vercel AI SDK
MapLibre
deck.gl
```

Core screens:

```text
1. Project Start
2. Project Digital Twin
3. Regulatory Map
4. Approval Graph
5. Document Workspace
6. Application Journey
7. Query/Response Workspace
8. Compliance/Renewal
9. Incentives
10. AI Copilot
```

---

# 26. Government UX

Do not build a generic admin dashboard.

Build:

### Regulatory Operations Center

Components:

```text
Live application volume
SLA risk
Bottlenecks
Process X-Ray
Dependency graph
Geospatial map
Inspection workload
Department workload
Regulatory changes
Impact analysis
AI Copilot
```

Primary actions:

```text
Investigate
Explain
Simulate
Optimize
Assign
Escalate
Review
```

---

# 27. Inspector UX

Use a responsive PWA.

Features:

```text
Today's inspections
Optimized route
Case details
Document checklist
Inspection checklist
Photo evidence
Location verification
Observations
Digital completion
```

Every action becomes an event.

---

# 28. Security Stack

## Authentication

Prototype:

- Supabase Auth / Auth.js

Production:

- Government SSO / enterprise identity provider
- OIDC
- SAML where required

## Authorization

Use:

- RBAC for basic roles
- ABAC for context-sensitive access
- OPA for policy decisions
- Row-Level Security where appropriate

Roles:

```text
Applicant
Consultant
Department Officer
Inspector
Department Admin
State Admin
Policy Admin
System Admin
```

---

# 29. Privacy / Consent

Use:

```text
Consent record
Purpose
Data requested
Data source
Requester
Timestamp
Expiry
Revocation
```

For external identity/document integrations:

```text
User
 ↓
Consent
 ↓
Authorized API
 ↓
Verified Data
```

Minimize sensitive data storage.

---

# 30. Auditability

Every critical decision should have:

```text
Who
What
When
Why
Source
Rule version
Data version
Model/version
Previous state
New state
```

Evidence chain:

```text
Source Document
      ↓
Extracted Fact
      ↓
Regulatory Rule
      ↓
Graph Relationship
      ↓
Decision
      ↓
Workflow Action
      ↓
Audit Event
```

---

# 31. Observability

Prototype:

- Structured application logs
- Error tracking
- Basic metrics

Production:

**OpenTelemetry**

Track:

```text
Request
 ↓
AI tool call
 ↓
Database query
 ↓
Graph query
 ↓
Policy evaluation
 ↓
Workflow
```

This allows end-to-end tracing.

---

# 32. Data Lineage

Every regulatory fact should contain:

```text
source_id
source_url
source_type
retrieved_at
document_hash
page
section
clause
effective_from
effective_to
extraction_method
review_status
```

This prevents the system from turning AI-generated statements into undocumented "truth".

---

# 33. Storage Architecture

```text
                DATA SOURCES
                     ↓
                RAW STORAGE
                     ↓
             NORMALIZED DATA
                     ↓
       ┌─────────────┼──────────────┐
       ↓             ↓              ↓
 PostgreSQL       Neo4j          Object Store
       │
 ├── PostGIS
 ├── pgvector
 └── Events
       ↓
    DuckDB
       ↓
 Analytics / Process Mining
```

---

# 34. Analytics

## Prototype

Use:

- PostgreSQL
- DuckDB
- Parquet
- PM4Py

## Later

Potential additions:

- ClickHouse
- OpenSearch
- Data lakehouse
- Apache Spark

Do not introduce distributed analytics infrastructure before required.

---

# 35. Advanced future technologies

These are intentionally **not P0**.

| Technology | Future use |
|---|---|
| NATS JetStream | Event backbone |
| Apache Kafka | National-scale event streaming |
| OpenSearch | Large-scale search/anomaly analytics |
| ClickHouse | High-volume operational analytics |
| OpenMetadata | Metadata + lineage |
| Apache Iceberg | Lakehouse data layer |
| Spark | Distributed processing |
| Ray | Distributed AI/ML |
| Feast | Feature store |
| MLflow | Model lifecycle |
| Kubernetes | Production orchestration |
| Keycloak | Enterprise IAM |
| OpenTelemetry | Observability |
| OpenFGA | Relationship-based authorization |
| Graph Data Science | Advanced graph analytics |
| S2 | Alternative global spatial indexing |
| Valhalla | Advanced routing/isochrones |
| OpenStreetMap | Open geospatial foundation |

---

# 36. Technology-to-Problem Mapping

| Problem Statement Pain | Technology | Capability |
|---|---|---|
| Can't identify approvals | Regulatory Graph + OPA | Applicable approval discovery |
| Requirements vary by location | H3 + PostGIS | Spatial regulatory fingerprint |
| Requirements vary by sector | Knowledge Graph + Rules | Sector-specific rules |
| Requirements vary by project size | OPA | Threshold rules |
| Requirements vary by project stage | Digital Twin + Rules | Stage-aware requirements |
| Documentation complexity | Docling + LLM | Document intelligence |
| Incomplete applications | Validation engine | Pre-submission validation |
| Repetitive document submission | Document Vault + verified data | Reuse |
| Repetitive scrutiny | Process Mining | Detect rework |
| Manual coordination | Temporal + Workflow | Orchestration |
| Parallel departments | Dependency Graph | Parallelization |
| Timeline uncertainty | Event/SLA engine | SLA visibility |
| Bottlenecks | PM4Py + graph | Process X-Ray |
| Inspection coordination | OR-Tools | Scheduling |
| Inspection routing | OR-Tools + PostGIS | Route optimization |
| Queries | AI Copilot + Workflow | Guided resolution |
| Renewals | Temporal | Automated lifecycle |
| Incentives difficult to find | Scheme Graph + Rules | Incentive matching |
| Compliance monitoring | Digital Twin + Events | Continuous compliance |
| Regulatory changes | Docling + Graph Diff | Change intelligence |
| Fragmented organization data | Entity Resolution + Graph | Organization 360 |
| Lack of transparency | Provenance + Evidence Graph | Explainability |
| Language barrier | BHASHINI/voice | Multilingual access |

---

# 37. Priority Matrix

## P0 — Build

```text
Next.js
TypeScript
Vercel AI SDK
FastAPI
PostgreSQL
PostGIS
H3
pgvector
Neo4j
Docling
MapLibre
deck.gl
```

Capabilities:

```text
Project onboarding
Regulatory fingerprint
Approval discovery
Document intelligence
Approval graph
WHY/evidence
AI Copilot
What-if foundation
```

---

## P1 — Build after core loop

```text
OPA
PM4Py
OR-Tools
Temporal
```

Capabilities:

```text
Executable rules
Process X-Ray
Bottleneck detection
Inspection optimization
Durable workflows
```

---

## P2 — Advanced wow

```text
Regulatory diff
Impact analysis
Entity resolution
Organization 360
Multilingual voice
Incentive intelligence
Dependency blast radius
```

---

## P3 — Production scale

```text
NATS/Kafka
OpenSearch
ClickHouse
OpenTelemetry
OpenMetadata
Keycloak
OpenFGA
Kubernetes
Iceberg
Spark/Ray
MLflow
```

---

# 38. The "Magic" Capability Stack

The platform should make these interactions possible:

```text
1. DROP A PIN
   ↓
   Regulatory Fingerprint

2. DESCRIBE PROJECT
   ↓
   Project Digital Twin

3. GENERATE JOURNEY
   ↓
   Approval Dependency Graph

4. CLICK WHY
   ↓
   Rule → Clause → Source

5. UPLOAD DOCUMENTS
   ↓
   Automatic consistency/pre-validation

6. MOVE SITE
   ↓
   Regulatory What-If Simulation

7. ASK GOVERNMENT COPILOT
   ↓
   Live database/graph/process analysis

8. CLICK BOTTLENECK
   ↓
   Dependency Blast Radius

9. CLICK OPTIMIZE
   ↓
   Inspection/resource optimization

10. UPLOAD NEW REGULATION
    ↓
    Regulation Diff + Impact Analysis

11. SPEAK IN INDIAN LANGUAGE
    ↓
    Voice → Project → Regulatory Journey
```

---

# 39. Fastest Practical Implementation

## Phase 1 — Foundation

```text
Next.js
FastAPI
PostgreSQL
PostGIS
H3
MapLibre
```

Deliver:

```text
Project onboarding
Site selection
Regulatory map
Project profile
```

## Phase 2 — Intelligence

```text
Docling
pgvector
LLM
Neo4j
```

Deliver:

```text
Regulatory knowledge
Approval graph
WHY
Document intelligence
```

## Phase 3 — Decision

```text
OPA
```

Deliver:

```text
Rule evaluation
Pre-validation
Requirement generation
```

## Phase 4 — Operations

```text
PM4Py
OR-Tools
```

Deliver:

```text
Process X-Ray
Bottlenecks
Inspection optimization
```

## Phase 5 — Orchestration

```text
Temporal
Realtime
```

Deliver:

```text
End-to-end workflow
SLA alerts
Department coordination
```

## Phase 6 — Magic Layer

```text
What-if
Regulatory Diff
Impact Graph
Entity Resolution
Voice
Organization 360
```

---

# 40. Final Technology Philosophy

The system should not be:

```text
AI
+
Chatbot
+
Dashboard
```

It should be:

```text
                REGULATORY OS

       UNDERSTAND
            ↓
       KNOWLEDGE GRAPH
            ↓
       REASON / VALIDATE
            ↓
       DIGITAL TWIN
            ↓
       OBSERVE PROCESS
            ↓
       FIND BOTTLENECK
            ↓
       SIMULATE
            ↓
       OPTIMIZE
            ↓
       ORCHESTRATE
            ↓
       HUMAN DECISION
            ↓
       AUDIT / LEARN
```

The technologies that create the distinctive experience are therefore:

**H3 + PostGIS** → spatial intelligence  
**Docling** → document intelligence  
**Neo4j** → regulatory ontology  
**pgvector + hybrid retrieval** → evidence retrieval  
**OPA** → executable regulation  
**PM4Py** → process X-ray  
**OR-Tools** → operational optimization  
**Temporal** → durable government workflows  
**MapLibre + deck.gl** → operational geospatial UX  
**LLM + tool calling** → natural-language control plane  
**Event architecture** → live system state  
**Graph impact analysis** → regulatory change intelligence

The objective is to make the technology **disappear behind the experience**: the entrepreneur experiences a system that understands their project; the officer experiences a system that understands the government process; the inspector experiences a system that tells them what to do next; and the administration experiences a system that can explain how a regulatory change propagates through the ecosystem.
