# Subsystem & Component Architecture
## Deep Dive into the 9 Core Subsystems of PramaanFlow

> **Document Version:** 2.0.0  
> **Target Audience:** Systems Engineers, Backend Developers, and AI Subagent Implementers  
> **Status:** Technical Reference  

---

## Subsystem 1: Unified Presentation Layer

The frontend is architected as a **single high-performance Next.js 14 App Router application** leveraging React 18 client and server components, TypeScript strict typing, Tailwind CSS, Lucide Icons, and Leaflet GIS mapping.

### 1.1 Structural Decomposition

```text
frontend/src/
├── app/
│   ├── layout.tsx                     ← Root layout with Inter font and metadata
│   ├── page.tsx                       ← Top-level persona controller & Judge Stepper router
│   └── api/                           ← Edge & Node.js API endpoints
├── components/
│   ├── Navbar.tsx                     ← Global persona switcher (Applicant, Government, Inspector, Map)
│   ├── ApplicantWorkspace.tsx         ← Central container for all applicant flows
│   ├── applicant/                     ← Human-centric applicant UI modules
│   │   ├── GuidedProjectOnboarding.tsx← 5-step Google Maps-style first-time setup wizard
│   │   ├── ApplicantHome.tsx          ← Action-first dashboard ("Your Next Step" + 3 To-Dos + 7-stop Journey)
│   │   ├── ApprovalDiscovery.tsx      ← Find approvals, filter by category/incentives, route sequence
│   │   ├── ApplicationWorkspace.tsx   ← 5-step form builder with zero-retyping & pre-check
│   │   ├── MyApplicationsView.tsx     ← Application tracking, statutory clocks, query desk
│   │   ├── GovernmentQueryModal.tsx   ← Plain-language discrepancy comparison & 1-click response
│   │   ├── DocumentVaultView.tsx      ← Vault records, Docling analysis, cross-clearance reuse
│   │   ├── ComplianceRenewalsView.tsx ← Post-approval compliance calendar & annual filings
│   │   ├── ContextualCopilotDrawer.tsx← Context-aware assistant grounded in active screen
│   │   └── SearchCommandModal.tsx     ← Global ⌘K regulatory search
│   ├── GovernmentCommand.tsx          ← Department scrutiny, backlog triage, SLA countdowns
│   ├── InspectorWorkspace.tsx         ← Joint multi-department inspection scheduling & route optimizer
│   ├── JudgeDemoStepper.tsx           ← 10-scene automated judge demo walk-through
│   └── MaharashtraJurisdictionMap.tsx ← Interactive Leaflet map with GIS polygons
└── lib/
    ├── applicant-tools/               ← 25+ tool catalog, Zod schemas, domain services
    ├── maharashtra-geospatial.ts      ← PostGIS boundary resolver & H3 spatial algorithms
    ├── regulatory-data.ts             ← Dependency DAG, legal citations, statutory SLAs
    └── project-state.ts               ← Deterministic roadmap generator & parameter simulator
```

### 1.2 Persona Separation
* **Applicant Surface:** Insulated from internal system jargon. Visual hierarchy focuses on **"What do I do now?"**, **"Why is this needed?"**, and **"How do I complete it?"**.
* **Government & Inspector Surfaces:** Expose deep regulatory metrics (backlog queues, statutory RTS countdowns, bottleneck indicators, joint clustering).
* **Judge Demo Stepper:** Provides 1-click deterministic state synchronization across all personas to demonstrate end-to-end workflows during evaluations.

---

## Subsystem 2: Applicant AI Tool Layer

Implemented in compliance with `applicant-tool-spec (1)` to give the AI assistant structured, type-safe execution capabilities over the platform's backend.

### 2.1 Uniform Contract: `ToolResult<T>`
Every applicant tool returns a standardized envelope:

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
    source: ToolSource; // "DETERMINISTIC_REGULATORY_GRAPH" | "POSTGIS_GEOSPATIAL" | "DOCLING_VAULT" | etc.
    riskLevel: ToolRiskLevel; // "READ_ONLY" | "LOW_RISK_DRAFT" | "USER_CONFIRMATION_REQUIRED"
    latencyMs: number;
    statutoryActs?: string[];
  };
}
```

### 2.2 Tool Execution Architecture

```text
User Natural Language Input / Context Trigger
                    │
                    ▼
Vercel AI SDK Core / Gemini Pro (Model selects tool)
                    │
                    ▼
Zod Input Schema Runtime Validation (src/lib/applicant-tools/schemas.ts)
                    │
                    ▼
Domain Service Execution (src/lib/applicant-tools/domain-services.ts)
  ├── Geospatial: PostGIS Polygon Containment Query
  ├── Graph: Deterministic Regulatory Roadmap Generator
  ├── Vault: Docling Extracted Records & Metadata
  └── RTS Desk: Statutory Grievance & Appeal Logger
                    │
                    ▼
ToolResult<T> Envelope Generation & AI Stream Synthesis
```

---

## Subsystem 3: Geospatial & Jurisdiction Engine

Located in [maharashtra-geospatial.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/maharashtra-geospatial.ts) and `/api/geospatial`.

### 3.1 Spatial Polygon Architecture
Computes jurisdictional boundaries using PostGIS `ST_Contains` algorithms across multi-tiered spatial layers:

1. **Notified Industrial Areas (MIDC Polygons):**
   * *Example:* Chakan Industrial Area Phase II (Khed Taluka, Pune).
   * *Statutory Effect:* Automatically applies Section 43 of MIDC Act 1961, waiving Gram Panchayat building permission and non-agricultural (NA) conversion tax.
2. **Municipal Corporation Boundaries (PCMC / PMC):**
   * Delineates urban local body jurisdiction from industrial development authority land.
3. **Environmental Eco-Sensitive Zones (ESZ):**
   * Buffer zone polygons around rivers (Indrayani, Bhima) and Western Ghats sanctuaries.
   * *Statutory Effect:* Flags mandatory State Environmental Impact Assessment Authority (SEIAA) clearance if within 10 km.

### 3.2 Uber H3 Spatial Hexagonal Indexing
* Points and polygons are indexed to **H3 Resolution 9** (hexagons of ~100m edge length).
* Enables sub-millisecond proximity queries for shared effluent treatment pipelines, water tapping points, and electricity sub-stations.

---

## Subsystem 4: Regulatory Knowledge Graph

Located in [regulatory-data.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/regulatory-data.ts) and `graph/`.

### 4.1 Graph Topology & Ontology
Modelled as a Directed Acyclic Graph (DAG) with nodes and typed edges:

```text
(:Enterprise) ──[:PLANS_PROJECT]──> (:ProjectTwin)
(:ProjectTwin) ──[:LOCATED_AT]──> (:Jurisdiction)
(:ProjectTwin) ──[:REQUIRES]──> (:ApprovalNode)
(:ApprovalNode) ──[:ISSUED_BY]──> (:Department)
(:ApprovalNode) ──[:GOVERNED_BY]──> (:StatutoryAct)
(:ApprovalNode) ──[:DEPENDS_ON {type: "PREREQUISITE"}]──> (:ApprovalNode)
(:ApprovalNode) ──[:MANDATES_DOCUMENT]──> (:DocumentTemplate)
```

### 4.2 Deterministic Path Calculation
* Traverses the graph to compute:
  * **Critical Path:** The longest dependency chain determining the minimum lead time to commercial launch.
  * **Parallel Tracks:** Approvals that can be applied for simultaneously (e.g., MPCB CTE and MSEDCL Power Feasibility).
  * **Transitive Locks:** Downstream clearances blocked until prerequisite certificates are issued.

---

## Subsystem 5: Policy & Eligibility Engine (OPA Rego)

Located in `policy/opa/` and integrated within `ApplicationWorkspace.tsx`.

### 5.1 Pre-Flight Check Engine
Before an application is transmitted to the government single window, deterministic Open Policy Agent (OPA) rules evaluate the docket against 4 rule gates:

1. **Signatory Authorization Gate:** Verifies applicant designation against MCA21 director registries.
2. **Geospatial Exemption Gate:** Verifies plot coordinates inside notified industrial zones to apply statutory Gram Panchayat NOC exemptions.
3. **Mass Balance & Capacity Alignment Gate:** Cross-checks form production values against environmental impact executive summaries.
4. **Document Dossier Completeness Gate:** Verifies required document presence and cryptographic authenticity.

---

## Subsystem 6: Document Intelligence & Vault

Located in `services/document-intelligence/` and [DocumentVaultView.tsx](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/components/applicant/DocumentVaultView.tsx).

### 6.1 Layout Parsing with Docling & OCR
* Analyzes uploaded PDFs, images, and CAD site plans.
* Extracts tabular data (e.g., water balance tables, machinery horsepower schedules, cadastral survey numbers).

### 6.2 Zero-Retyping Vault
* Once a document (such as a 12.4-Acre MIDC Lease Deed) is uploaded and verified, its extracted metadata is stored in PostgreSQL and indexed in `pgvector`.
* When subsequent clearances (e.g., Fire Safety or Factory License) mandate land ownership proof, the platform reuses the existing verified document automatically.

---

## Subsystem 7: Workflow & State Orchestration (Temporal.io)

Located in `workflows/temporal/` and integrated in application timelines.

### 7.1 Resilient Sagas & State Machines
Application lifecycles are modeled as durable Temporal workflows:

```text
Workflow: ApplicationFilingWorkflow
├── Activity 1: PreFlightValidation (OPA Gate)
├── Activity 2: SingleWindowGatewayDispatch (MAITRI / Aaple Sarkar API)
├── Activity 3: StatutorySLATimer (Monitors Maharashtra RTS Act 2015 countdown)
├── Activity 4: ClarificationQueryHandler (Pauses SLA clock upon officer query; resumes upon applicant response)
├── Activity 5: InspectionSlotCoordination
└── Activity 6: FinalCertificateIssuance
```

* **Durability:** If external department servers fail or time out, Temporal automatically retries with exponential backoff without corrupting state.

---

## Subsystem 8: Inspection Scheduling & Route Optimization

Located in `services/optimizer/` and [InspectorWorkspace.tsx](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/components/InspectorWorkspace.tsx).

### 8.1 Google OR-Tools CP-SAT Solver
Solves a constrained Vehicle Routing Problem (VRP) for district inspectors:
* **Objective:** Minimize total travel kilometers and combine separate departmental audits (MPCB + DISH + Fire) into single joint visits.
* **Constraints:**
  * Inspector time windows (e.g., 10:00 AM – 05:00 PM).
  * Facility shift timings and machinery operational hours.
  * Geographical clustering of nearby factories in the same industrial zone.

---

## Subsystem 9: Process Mining & Bottleneck Analytics

Located in `services/process-mining/` and `GovernmentCommand.tsx`.

### 9.1 PM4Py Process Discovery & Conformance
* Ingests real-time audit event streams (`timestamp`, `case_id`, `activity`, `resource`).
* Automatically derives **Petri nets** and **Directly-Follows Graphs (DFG)**.
* **Bottleneck Detection:** Identifies abnormal delays (e.g., applications sitting in Sub-Regional Officer scrutiny for >14 days) and alerts senior departmental leadership prior to statutory SLA breach.
