# Antigravity Master Implementation Specification

## 1. Mission

Build the existing project into an **Intelligent Regulatory Approval & Compliance Orchestration Platform** for entrepreneurs and government departments.

The system must cover the full lifecycle:

`Project intake → applicability discovery → approval dependency planning → document collection/validation → application preparation → submission tracking → departmental workflow → queries → inspections → decisions → renewals → incentives → grievances → analytics`

This is **not** an AI chatbot over PDFs. AI is an assistive layer. Deterministic rules, policy evaluation, workflow state, auditability, and optimization must control consequential system behavior.

## 2. Non-negotiable technology decisions

Use these as the target architecture:

- Primary transactional database: **PostgreSQL**.
- Geospatial extensions: **PostGIS**.
- Vector retrieval: **pgvector in PostgreSQL**.
- Regulatory document parsing: **Docling**.
- Data ingestion/synchronization/RAG source connectors: **Airweave** where appropriate.
- Regulatory knowledge graph: **Neo4j**.
- Policy-as-code: **Open Policy Agent (OPA) + Rego**.
- Long-running application orchestration: **Temporal**.
- Process mining: **PM4Py**.
- Inspector assignment and scheduling: **Google OR-Tools**.
- Geospatial indexing/clustering: **H3**.
- Observability: prefer **OpenTelemetry + Prometheus + Grafana + Jaeger** when an open-source-only constraint applies. Do not add AWS X-Ray unless the project explicitly changes to AWS-managed observability.
- **VROOM is removed. Do not install, import, deploy, reference, or implement VROOM.**

## 3. Core design principle

Separate three classes of logic:

### AI / probabilistic

Use for:

- natural-language understanding
- document extraction assistance
- regulatory explanation
- RAG answers
- classification
- summarization
- drafting applicant responses
- detecting potential anomalies for human review

### Deterministic

Use for:

- approval applicability
- mandatory prerequisites
- statutory deadlines
- workflow state transitions
- access control
- policy decisions
- eligibility rules
- SLA calculation
- audit events
- financial calculations

### Optimization

Use for:

- inspector assignment
- inspection time-slot allocation
- jurisdiction constraints
- skill matching
- travel/geospatial cost
- workload balancing
- SLA urgency

Never use an LLM as the sole source of truth for a statutory decision.

## 4. Target repository structure

Adapt this structure to the existing project instead of deleting working code:

```text
project-root/
├── apps/
│   ├── web/                         # Next.js applicant + department portals
│   └── admin/                       # optional separate admin application
├── services/
│   ├── api/                         # Node/TypeScript API/BFF
│   ├── regulatory-engine/           # applicability/dependency service
│   ├── rag-service/                 # retrieval + citation service
│   ├── document-service/            # Docling pipeline
│   ├── optimizer/                   # Python + OR-Tools
│   ├── process-mining/              # Python + PM4Py
│   └── ai-service/                  # agent/LLM orchestration
├── workflows/
│   └── temporal/                    # Temporal workflow definitions + workers
├── policy/
│   ├── opa/                         # Rego policies
│   └── tests/
├── knowledge/
│   ├── regulatory-schema/
│   ├── seed/
│   └── ingestion/
├── database/
│   ├── migrations/
│   └── seeds/
├── graph/
│   ├── cypher/
│   └── constraints/
├── docs/
└── infra/
    ├── docker/
    └── observability/
```

If the existing stack differs, preserve the existing framework and add services only where a separate runtime is actually required.

## 5. System flow to implement

```text
Applicant
   ↓
Project Profile
   ↓
H3 + Jurisdiction Resolution
   ↓
Regulatory Applicability Engine
   ├── PostgreSQL structured rules
   ├── OPA policy evaluation
   └── Neo4j dependency graph
   ↓
Custom Approval Plan
   ↓
Document Checklist
   ↓
Docling Extraction + Validation
   ↓
Verified Data Vault
   ↓
Application Drafts
   ↓
Temporal Approval Workflow
   ├── parallel department workflows
   ├── SLA timers
   ├── query handling
   ├── inspection scheduling
   └── escalation
   ↓
OR-Tools Inspection Assignment
   ↓
Decision / Approval
   ↓
Compliance + Renewal Engine
   ↓
Incentive Eligibility Engine
   ↓
Grievance / Escalation
   ↓
PM4Py Process Analytics
   ↓
Government + Applicant Dashboards
```

## 6. Definition of done

The final implementation is complete only when the demo can execute an end-to-end scenario without hard-coded UI-only transitions:

1. Create a project with sector, project size, location, capacity, workforce and stage.
2. Resolve H3 cell and jurisdiction.
3. Produce applicable approvals from structured regulatory rules.
4. Build a dependency graph and distinguish parallel/sequential approvals.
5. Generate document requirements.
6. Upload at least one document and run extraction/validation.
7. Persist verified entities for reuse by another application.
8. Create application records.
9. Start a Temporal workflow.
10. Show SLA clocks and current state.
11. Raise a department query and resolve it.
12. Create an inspection requirement.
13. Assign an inspector using OR-Tools with skills, availability, jurisdiction, time windows and SLA urgency.
14. Complete the inspection and progress the workflow.
15. Issue a simulated approval record with complete audit evidence.
16. Create renewal/compliance tasks.
17. Show process analytics from event logs.
18. Show an explainable trace for every AI-derived recommendation.

## 7. Data realism rule

Do not fabricate statutory facts, government approval requirements, official timelines, fees or legal clauses.

Synthetic data is permitted only for demo fixtures and must be clearly labeled as `DEMO/SYNTHETIC` in the database and UI. The architecture must remain usable with real government source data later.

## 8. Implementation discipline

Antigravity must:

- inspect the existing repository first;
- preserve working features;
- create migrations before relying on new tables;
- define shared TypeScript contracts for cross-service payloads;
- keep policy decisions versioned;
- keep regulatory sources and effective dates attached to rules;
- make workflow operations idempotent;
- make all important state changes auditable;
- add tests for every rule and workflow transition;
- keep external integrations behind interfaces/adapters;
- never silently fall back to fake statutory data;
- never hide failed integrations behind successful-looking UI.

Read the other markdown files in this folder before changing architecture.
