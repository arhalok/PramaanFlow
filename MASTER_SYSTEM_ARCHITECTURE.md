# PramaanFlow: Master System Architecture & Engineering Blueprint
## Single-File Authoritative Reference for AI Coding Agents & System Architects

> **Project:** PramaanFlow (Smart India Hackathon — PS 130 / PS 132)  
> **Repository:** `arhalok/PramaanFlow`  
> **Target Audience:** Autonomous AI Coding Agents (Gemini, Claude, GPT, DeepSeek, Cursor) & Staff Software Engineers  
> **Document Purpose:** Self-contained, zero-dependency master blueprint containing the complete product vision, subsystem designs, data schemas, API contracts, gap analysis, and extension runbooks.

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Core Product Metaphor & UX Philosophy](#2-core-product-metaphor--ux-philosophy)
3. [System Architecture & Macro Topology](#3-system-architecture--macro-topology)
4. [Deep Dive into the 9 Subsystems](#4-deep-dive-into-the-9-subsystems)
5. [Complete Database & Knowledge Schemas](#5-complete-database--knowledge-schemas)
6. [API Contracts & 25+ Applicant AI Tools](#6-api-contracts--25-applicant-ai-tools)
7. [Feature Audit & Gap Analysis](#7-feature-audit--gap-analysis)
8. [AI Agent Continuation Runbook & Invariants](#8-ai-agent-continuation-runbook--invariants)

---

# 1. Executive Summary & Problem Statement

### 1.1 The Real-World Breakdown of Government Single Window Systems
Governments across India (NSWS at the central level, MAITRI in Maharashtra, Raj Nivesh in Rajasthan) have created online portals to facilitate ease of doing business. In practice, however, entrepreneurs face severe structural roadblocks:
1. **Form Aggregator Mindset:** Existing portals are directory listings of statutory forms. They assume the applicant already understands the legal jurisdiction, statutory laws, and departmental mandates.
2. **The "Cold Start" Friction:** An entrepreneur wanting to start a food processing facility in Jaipur or an active pharmaceutical unit in Pune is confronted with 200+ regulatory forms and legal codes (*"Consent under Sec 25/26"*, *"Form 1 EIA Notification 2006"*, *"DISH Schedule VII"*).
3. **Repeated Data Entry:** Every department functions in a silo. Applicants must re-upload the same land deeds, incorporation certificates, and factory blueprints 6 to 12 separate times.
4. **Opaque Departmental Query Loops:** Minor typographical inconsistencies (e.g., Form 1 mentioning 100 TPD while the executive summary mentions 150 TPD peak utility envelope) trigger formal "Clarification Notices", resetting statutory SLA clocks and delaying projects for months.
5. **Uncoordinated Inspections:** Multiple departments (Pollution Board, Factory Inspectorate, Fire Service, Labour Office) conduct independent, unannounced site audits.

### 1.2 PramaanFlow Solution
PramaanFlow is an **Intelligent Regulatory Approval & Compliance Orchestration Platform**. It transforms government single window systems from passive form repositories into an **active navigation engine** that calculates the exact regulatory route, pre-checks dockets for zero-defect filing, resolves jurisdictions automatically, tracks applications, and optimizes joint inspections.

---

# 2. Core Product Metaphor & UX Philosophy

### 2.1 The Mental Model: "Google Maps for Government Approvals"
```text
TRADITIONAL PORTAL                           PRAMAANFLOW (GOOGLE MAPS METAPHOR)
───────────────────────────────────          ───────────────────────────────────────────────────
"Here are 250 forms. Select                 "Tell us what you are building and where.
the ones applicable to you, read             We will calculate your route, identify your stops,
the statutory manuals, and submit."          check your baggage before departure, and navigate you."
```

### 2.2 The End-to-End User Flow
```text
SIGN UP
   ↓
TELL US ABOUT YOUR BUSINESS (Natural Language or 4 simple choices)
   ↓
LOCATION (Google Maps-Style Search or Pin Drop)
   ↓
SYSTEM UNDERSTANDS PROJECT (PostGIS Polygons + Neo4j Graph + OPA Rules)
   ↓
APPROVAL ROADMAP GENERATED ("We found 8 approvals. We'll guide you step by step.")
   ↓
ACTION-FIRST DASHBOARD ("Your Next Step: Complete Pollution Control Application • 80% Done")
   ↓
FILL APPLICATION (Zero-Retyping from Profile + Document Vault Auto-Linking)
   ↓
CHECK BEFORE SUBMISSION (OPA Rule Engine prevents queries before submission)
   ↓
SUBMIT TO SINGLE WINDOW (Aaple Sarkar / NSWS / MAITRI API Gateways)
   ↓
GOVERNMENT REVIEW (Statutory Right to Services SLA Clock)
   ↓
┌──────────────────────┴──────────────────────┐
▼                                             ▼
DEPARTMENT QUERY                              JOINT INSPECTION
Plain language discrepancy comparison &       Google OR-Tools CP-SAT clusters
1-click response desk                         multi-department audits into 1 visit
└──────────────────────┬──────────────────────┘
                       ↓
FINAL OPERATING LICENSE ISSUED (Continuous Compliance Calendar & Renewals)
```

### 2.3 The Four Personas
1. **Applicant / Entrepreneur:** Low-friction, human-first. Zero internal jargon. Primary focus: *"What do I do now?"*, *"Why is this needed?"*, and *"How do I complete it?"*.
2. **Department Scrutiny Officer:** Scrutiny workspace with automated pre-validation reports, highlighted risk scores, and integrated clarification dispatchers.
3. **Field Inspector:** Multi-department inspection scheduler, Google OR-Tools route optimizer, and digital verification checklists.
4. **System Administrator / Technical Judge:** Observability, process mining (PM4Py Petri nets), Neo4j dependency DAG visualization, PostGIS polygon layers, and audit logs.

### 2.4 Jargon Elimination Dictionary
| Internal System Architecture Term | Applicant-Facing Plain Language |
| :--- | :--- |
| **Statutory Discovery Engine** | **Find Required Approvals** |
| **Dependency DAG** | **Approval Sequence / Route** |
| **Pre-Flight X-Ray Validation** | **Check Before Submission** |
| **Project Twin #proj-01** | **Project Profile (Active)** |
| **Zero Retyping Active: Enterprise fields pre-filled from registered Project Twin** | **"We already filled in information from your project profile. Please review it."** |
| **Statutory Activity Stream** | **Recent Updates** |
| **Natural Language Extraction Engine** | **Describe your project in plain English** |
| **Jurisdiction Intelligence** | **Find the right government office** |

---

# 3. System Architecture & Macro Topology

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                                     │
│  Next.js 14 App Router (React 18, TypeScript Strict, Tailwind CSS, Leaflet GIS)       │
│                                                                                        │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────────────────────┐  │
│  │  Applicant Experience │ │  Government Command   │ │     Inspector Workspace      │  │
│  │  - Guided Onboarding  │ │  - Backlog Triage     │ │  - Multi-Dept Inspection Cl. │  │
│  │  - Action-First Home  │ │  - Statutory SLA Watch│ │  - OR-Tools Route Optimizer  │  │
│  │  - Route Journey & Form│ │  - Query Dispatcher   │ │  - Digital Audit Checklist   │  │
│  └───────────────────────┘ └───────────────────────┘ └──────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ REST / JSON / Server Actions / AI Stream
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                              APPLICATION & AI TOOL LAYER                               │
│  Next.js Edge / Node API Route Dispatchers (src/app/api/* & src/lib/applicant-tools/*) │
│                                                                                        │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────────────────────┐  │
│  │ 25+ Applicant Tools   │ │ Gemini Pro / Flash    │ │ Zod Runtime Validation       │  │
│  │ ToolResult<T> Contract│ │ Vercel AI SDK Tools   │ │ Idempotency & Audit Context  │  │
│  └───────────────────────┘ └───────────────────────┘ └──────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                               INTELLIGENCE & ENGINE CORE                               │
│                                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ Geospatial Engine       │  │ Regulatory Graph        │  │ Policy & Rules Engine   │ │
│  │ PostGIS / H3 Hexagons   │  │ Neo4j Knowledge Graph   │  │ Open Policy Agent (OPA) │ │
│  │ Boundary & Zoning Match │  │ Clearance Dependency DAG│  │ Deterministic Pre-Check │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘ │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ Document Intelligence   │  │ Workflow Orchestration  │  │ Optimization & Mining   │ │
│  │ Docling Parser + RAG    │  │ Temporal.io Workflows   │  │ Google OR-Tools CP-SAT  │ │
│  │ pgvector Embedding Vault│  │ State Machine & Retries │  │ PM4Py Process Mining    │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Deep Dive into the 9 Subsystems

### Subsystem 1: Unified Presentation Layer (`frontend/src/`)
* **Framework:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS.
* **Component Structure:**
  * `GuidedProjectOnboarding.tsx`: 5-screen Google Maps-style guided wizard for first-time project creation.
  * `ApplicantHome.tsx`: Action-First dashboard featuring *"Your Next Step"*, *"You Have 3 Things To Do"*, 7-stop visual *"Project Journey"*, and divided approvals.
  * `GovernmentQueryModal.tsx`: Plain-language discrepancy comparison desk (100 KLD vs 150 KLD).
  * `ApplicationWorkspace.tsx`: 5-step form builder with zero-retyping profile auto-fill and pre-submission checks.
  * `ApprovalDiscovery.tsx`: Clearance universe with category filtering, subsidy calculation, and approval sequence graph.
  * `MyApplicationsView.tsx`: Live application tracker, statutory SLA countdowns, and inspection prep checklists.
  * `DocumentVaultView.tsx`: Cryptographically hashed document store with Docling layout analysis.
  * `ComplianceRenewalsView.tsx`: Post-approval compliance calendar and annual returns manager.
  * `GovernmentCommand.tsx`: Department officer backlog triage and query dispatcher.
  * `InspectorWorkspace.tsx`: Joint multi-department audit scheduler with Google OR-Tools route optimizer.
  * `JudgeDemoStepper.tsx`: 10-scene automated judge demo walk-through.
  * `MaharashtraJurisdictionMap.tsx`: Interactive Leaflet map with PostGIS polygon overlays.

### Subsystem 2: Applicant AI Tool Layer (`frontend/src/lib/applicant-tools/`)
* **Standard Envelope:** Standardized `ToolResult<T>` structure guaranteeing type safety and auditability.
* **Architecture:** Vercel AI SDK Core + Gemini 1.5 Pro/Flash dispatches tools through Zod runtime validation to execute backend domain services.

### Subsystem 3: Geospatial & Jurisdiction Engine (`frontend/src/lib/maharashtra-geospatial.ts`)
* **Spatial Polygon Math:** Evaluates industrial zone polygons (e.g., Chakan MIDC Phase II, Sitapura RIICO) against municipal boundaries.
* **Statutory Effect:** Automatically applies statutory exemptions (e.g., Section 43 of MIDC Act 1961 waiving Gram Panchayat building permission).
* **Uber H3 Indexing:** Points indexed to H3 Resolution 9 (~100m) for fast proximity searches of utility infrastructure.

### Subsystem 4: Regulatory Knowledge Graph (`frontend/src/lib/regulatory-data.ts`)
* **Graph Structure:** Modeled as a Directed Acyclic Graph (DAG) with nodes (`Enterprise`, `Project`, `Approval`, `Department`, `StatutoryAct`, `DocumentTemplate`) and typed edges (`REQUIRES`, `DEPENDS_ON`, `ISSUED_BY`, `MANDATES_DOCUMENT`).
* **Deterministic Computations:** Calculates critical path lead times, prerequisite locks, parallel application tracks, and impact simulations.

### Subsystem 5: Policy & Eligibility Engine (OPA Rego)
* **Rule Gates:** Evaluates applications prior to submission across 4 gates: Signatory Authorization, Geospatial Zoning Exemption, Mass Balance Consistency, and Document Dossier Completeness.

### Subsystem 6: Document Intelligence & Vault
* **Docling Layout Analysis:** Extracts tables and key-value pairs from complex multi-page PDFs, CAD site plans, and invoices.
* **Zero-Retyping:** Extracted metadata is indexed in `vault_documents` and reused across subsequent clearances.

### Subsystem 7: Workflow & State Orchestration (Temporal.io)
* **Durable Sagas:** Manages the full application lifecycle: pre-flight checks, gateway dispatch, statutory SLA timers, query pauses, and certificate issuance with automatic exponential retries.

### Subsystem 8: Inspection Scheduling & Route Optimization (Google OR-Tools)
* **CP-SAT Solver:** Solves the Constrained Vehicle Routing Problem (VRP) for district inspectors, clustering nearby audits into joint multi-department site visits.

### Subsystem 9: Process Mining & Bottleneck Analytics (PM4Py)
* **Process Discovery:** Ingests audit event streams (`timestamp`, `case_id`, `activity`, `resource`) to construct Petri nets and directly-follows graphs (DFG), predicting statutory SLA breaches before they occur.

---

# 5. Complete Database & Knowledge Schemas

### 5.1 PostgreSQL Relational DDL
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enterprises Table
CREATE TABLE enterprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cin_or_llpin VARCHAR(21) UNIQUE NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    pan VARCHAR(10) NOT NULL,
    authorized_signatory_name VARCHAR(255) NOT NULL,
    authorized_signatory_email VARCHAR(255) NOT NULL,
    authorized_signatory_phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table (Project Digital Twin)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    sub_sector VARCHAR(255),
    pollution_category VARCHAR(10) CHECK (pollution_category IN ('WHITE', 'GREEN', 'ORANGE', 'RED')),
    investment_crores NUMERIC(10, 2) NOT NULL,
    capacity_value NUMERIC(12, 2) NOT NULL,
    capacity_unit VARCHAR(50) NOT NULL,
    employment_target INTEGER NOT NULL,
    water_required_kld NUMERIC(10, 2),
    power_required_kw NUMERIC(10, 2),
    address TEXT NOT NULL,
    cadastral_survey_no VARCHAR(100),
    h3_index VARCHAR(15),
    location_point GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'PLANNING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Approvals Catalog Table
CREATE TABLE approvals_catalog (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(50) NOT NULL,
    department VARCHAR(255) NOT NULL,
    statutory_act TEXT NOT NULL,
    section_reference VARCHAR(100) NOT NULL,
    sla_days INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Applications Table
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    approval_id VARCHAR(50) NOT NULL REFERENCES approvals_catalog(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    sla_days_remaining INTEGER,
    assigned_officer_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clarification Queries Table
CREATE TABLE clarification_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    officer_name VARCHAR(255) NOT NULL,
    legal_basis TEXT NOT NULL,
    query_text TEXT NOT NULL,
    raised_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    days_to_respond INTEGER DEFAULT 7,
    status VARCHAR(50) DEFAULT 'PENDING',
    applicant_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Document Vault Table
CREATE TABLE vault_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_uri TEXT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    docling_extracted_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Process Audit Events Table (PM4Py Event Stream)
CREATE TABLE process_audit_events (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    activity VARCHAR(100) NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attributes JSONB
);
```

### 5.2 PostGIS Containment Function
```sql
CREATE TABLE jurisdiction_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    authority_name VARCHAR(255) NOT NULL,
    authority_type VARCHAR(50) NOT NULL,
    statutory_act VARCHAR(255) NOT NULL,
    polygon_boundary GEOMETRY(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX idx_zones_polygon ON jurisdiction_zones USING GIST(polygon_boundary);

CREATE OR REPLACE FUNCTION resolve_jurisdiction(p_lat NUMERIC, p_lng NUMERIC)
RETURNS TABLE (zone_name VARCHAR, authority_name VARCHAR, authority_type VARCHAR, statutory_act VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT j.zone_name, j.authority_name, j.authority_type, j.statutory_act
    FROM jurisdiction_zones j
    WHERE ST_Contains(j.polygon_boundary, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

### 5.3 Neo4j Graph Cypher Traversal
```cypher
// Discover unblocked next steps for a project
MATCH (p:Project {id: $projectId})-[:REQUIRES]->(target:Approval)
WHERE NOT target.status = "APPROVED"
  AND ALL(prereq IN [(target)-[:DEPENDS_ON]->(p_appr) | p_appr] WHERE prereq.status = "APPROVED")
RETURN target.id AS approvalId, target.name AS approvalName, target.slaDays AS slaDays;
```

---

# 6. API Contracts & 25+ Applicant AI Tools

### 6.1 `ToolResult<T>` Standard Envelope
```typescript
export interface ToolResult<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    suggestedUserAction?: string;
  };
  metadata: {
    toolName: string;
    source: string;
    riskLevel: "READ_ONLY" | "LOW_RISK_DRAFT" | "USER_CONFIRMATION_REQUIRED";
    latencyMs: number;
    statutoryActs?: string[];
  };
}
```

### 6.2 Key Tool Catalog Summary
1. `applicant_get_profile` — Fetches enterprise identity & credentials.
2. `project_create_draft` — Parses natural language pitch into structured project parameters.
3. `location_search` — Searches address databases across municipal & industrial zones.
4. `location_resolve` — PostGIS point-in-polygon containment to determine governing authorities.
5. `approval_discover` — Evaluates applicable statutory registrations, clearances, and subsidies.
6. `approval_get_requirements` — Returns document templates, legal basis, and fee schedules.
7. `document_vault_list` — Lists cryptographically verified documents in the enterprise vault.
8. `document_verify_and_extract` — Runs Docling layout parsing on an uploaded document.
9. `form_autofill_suggest` — Generates zero-retyping field mappings with source provenance.
10. `application_xray` — Runs deterministic OPA Rego rules to detect inconsistencies before submission.
11. `application_get_action_required` — Returns the single highest-priority blocking action or query.
12. `application_respond_query` — Submits factual clarification and revised attachments to the officer.
13. `inspection_get_slots` — Retrieves upcoming joint inspection windows.
14. `grievance_check_rts_eligibility` — Checks eligibility for statutory appeal under RTS Act 2015.
15. `grievance_submit_rts_appeal` — Lodges a formal First Appeal to the Appellate Authority.
16. `simulation_run_what_if` — Recalculates clearances and incentives when project parameters change.

---

# 7. Feature Audit & Gap Analysis

| Feature Area | Current Status | Fidelity / Engine | Production Gap / Next Step |
| :--- | :--- | :--- | :--- |
| **Applicant Guided Onboarding** | ✅ **COMPLETE** | Live Next.js Component | None. 5-screen Google Maps wizard active. |
| **Action-First Dashboard** | ✅ **COMPLETE** | Live Next.js Component | None. "Your Next Step", 3 To-Dos, 7-stop Journey active. |
| **Applicant AI Tool Layer** | ✅ **COMPLETE** | Next.js API + Zod | 25+ tools operational with `ToolResult<T>`. |
| **Geospatial Resolution** | ✅ **COMPLETE** | In-Process PostGIS Math | Chakan MIDC, Khed Taluka, PCMC boundaries verified. |
| **Regulatory Dependency DAG** | ✅ **COMPLETE** | In-Process Deterministic | Grounded in Water, Air, Factories, MIDC, RTS Acts. |
| **Government Query Desk** | ✅ **COMPLETE** | Live Modal & Workflow | Side-by-side discrepancy & 1-click response. |
| **Joint Inspection Optimizer** | ✅ **COMPLETE** | TypeScript TSP/VRP Solver | Clusters DISH/MPCB audits with time windows. |
| **Statutory RTS Appeal Desk** | ✅ **COMPLETE** | Live Modal & Engine | Maharashtra Right to Public Services Act 2015. |
| **What-If Sensitivity Simulator**| ✅ **COMPLETE** | Live Modal & Engine | Parameter tweaking & subsidy recalculation. |
| **Docling Document Intelligence**| 🟡 **HYBRID / MOCKED** | JSON Schema Vault | Connect live standalone Docling Docker service. |
| **Neo4j Graph Database** | 🟡 **HYBRID / MOCKED** | In-Process TS Graph | Connect live Bolt Neo4j container. |
| **Temporal.io Workflows** | 🟡 **HYBRID / MOCKED** | In-Process State Machine | Connect live Temporal Server & Worker cluster. |
| **Open Policy Agent (OPA)** | 🟡 **HYBRID / MOCKED** | In-Process Rego Eval | Connect standalone OPA HTTP daemon. |
| **PM4Py Process Mining** | 🟡 **HYBRID / MOCKED** | Script + TS Metrics | Connect dedicated Python FastAPI microservice. |
| **DigiLocker Integration** | 🔴 **MISSING FEATURE** | Not Connected | OAuth2 gateway for PAN, MCA21, and Udyam. |
| **SMS / WhatsApp Alerts** | 🔴 **MISSING FEATURE** | Not Connected | Gupshup / Twilio webhook integration. |
| **IoT Effluent Telemetry** | 🔴 **MISSING FEATURE** | Not Connected | CPCB OCEMS online sensor ingestion stream. |
| **Voice / Speech-to-Text** | 🔴 **MISSING FEATURE** | Not Connected | Bhashini / Whisper speech input in Hindi/Marathi. |
| **Statutory Payment Gateway** | 🔴 **MISSING FEATURE** | Simulation Only | Payment gateway with state Treasury Head codes. |

---

# 8. AI Agent Continuation Runbook & Invariants

### 8.1 The Five Non-Negotiable Invariants
1. **Zero Hallucinated Laws:** Never invent approval names or legal citations. Ground all rules in real statutory acts (Water Act 1974, Air Act 1981, Factories Act 1948, MIDC Act 1961, RTS Act 2015).
2. **Strict Jargon Isolation:** Never expose internal engineering terms (*DAG*, *Project Twin*, *Pre-Flight X-Ray*, *OPA Rego*) on the applicant surface.
3. **Zero TypeScript Errors:** `cd frontend && npx tsc --noEmit` must always exit with code 0.
4. **Uniform Tool Envelope:** All new tools must return the standardized `ToolResult<T>` envelope.
5. **Preserve Multi-Persona Architecture:** Keep Applicant, Government Command, Inspector Workspace, and Judge Demo Stepper fully accessible.

### 8.2 Local Run Commands
```bash
# Start Next.js Development Server
cd frontend
npm install
npm run dev

# Verify TypeScript Health
npx tsc --noEmit

# Test Tool Execution via CLI
node -e "fetch('http://localhost:3000/api/applicant/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: 'approval_discover', input: { projectId: 'proj-01' } }) }).then(r => r.json()).then(console.log)"
```
