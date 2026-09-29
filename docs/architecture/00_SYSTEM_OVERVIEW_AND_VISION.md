# System Overview & Product Vision
## PramaanFlow — Intelligent Single Window Approval & Compliance Platform

> **Document Version:** 2.0.0  
> **Target Audience:** Systems Architects, Technical Leads, Evaluation Panels, and Autonomous AI Agents  
> **Status:** Authoritative Specification  

---

## 1. Problem Statement Alignment (SIH PS 130 / PS 132)

### 1.1 The Real-World Failure of Traditional Single Window Systems
Governments in India (both central via NSWS and states via portals like MAITRI in Maharashtra and Raj Nivesh in Rajasthan) have invested heavily in digital Single Window Systems. However, real-world entrepreneurs face severe structural roadblocks:

1. **System-Centric Portals:** Existing portals function as glorified PDF upload forms and directory listings. They assume the applicant is already a regulatory lawyer who knows which statutory clearances apply (e.g., distinguishing between CTE vs. CTO under the Water Act 1974, Gram Panchayat NOC vs. MIDC Plan Sanction, or DISH Factory Registration).
2. **The "Cold Start" Problem:** A food processing entrepreneur in Jaipur or a bulk pharmaceutical founder in Pune is faced with hundreds of uncurated regulatory forms and technical jargon (*"Consent under Sec 25/26"*, *"Form 1 EIA Notification 2006"*, *"Explosives License Rule 113"*).
3. **Repeated Data Entry & Verification Fatigue:** Every department operates in an information silo. Applicants must re-upload identical land deeds, incorporation certificates, and factory blueprints 6 to 12 separate times.
4. **Opaque Departmental Query Loops:** Minor typographical inconsistencies (e.g., Form 1 mentioning 100 TPD while the executive summary covers a 150 TPD utility envelope) trigger bureaucratic "Clarification Notices", resetting statutory SLA clocks and stalling capital investments for months.
5. **Uncoordinated Inspections:** Multiple departments (Pollution Board, Factory Inspectorate, Fire Service, Labour Office) conduct uncoordinated, repeated site visits, leading to rent-seeking and operational disruption.

---

## 2. The Core Metaphor: Google Maps for Government Approvals

Instead of treating the regulatory system as a static database of government forms, **PramaanFlow treats regulatory compliance as a navigation graph**.

```text
TRADITIONAL PORTAL                           PRAMAANFLOW (GOOGLE MAPS METAPHOR)
───────────────────────────────────          ───────────────────────────────────────────────────
"Here are 250 forms. Select                 "Tell us what you are building and where.
the ones applicable to you, read             We will calculate your route, identify your stops,
the statutory manuals, and submit."          check your baggage before departure, and navigate you."
```

### The End-to-End Navigation Journey

```text
SIGN UP & PROFILE
       │
       ▼
TELL US ABOUT YOUR PROJECT (Natural Language or 4 Quick Cards)
       │
       ▼
LOCATION (Google Maps-Style Address Match or Map Pin)
       │
       ▼
INVISIBLE SYSTEM RESOLUTION (PostGIS Polygons + Neo4j Graph + OPA Rules)
       │
       ▼
APPROVAL ROADMAP GENERATED ("We found 8 approvals. Here is your step-by-step route.")
       │
       ▼
ACTION-FIRST DASHBOARD ("Your Next Step: Complete Pollution Control Application • 80% Done")
       │
       ▼
FILL / VERIFY (Zero-Retyping from Profile + Document Vault Cross-Reuse)
       │
       ▼
CHECK BEFORE SUBMISSION (OPA Rule Engine ensures zero-defect filing)
       │
       ▼
SUBMIT TO SINGLE WINDOW (Aaple Sarkar / NSWS / MAITRI API Gateways)
       │
       ▼
GOVERNMENT SCRUTINY & SLA CLOCK (Under statutory Right to Services rules)
       │
  ┌────┴──────────────────────────┐
  ▼                               ▼
DEPARTMENT QUERY             JOINT INSPECTION
Plain language discrepancy   OR-Tools optimizes route for
comparison & 1-click answer  multi-department inspector team
  │                               │
  └────┬──────────────────────────┘
       │
       ▼
FINAL OPERATING LICENSE & POST-APPROVAL COMPLIANCE (Continuous Calendar & Renewals)
```

---

## 3. Four Core Personas

PramaanFlow unifies four primary personas around a single source of regulatory truth:

### 3.1 The Entrepreneur / Applicant
* **Mental Model:** "I am building a business. Make compliance invisible, predictable, and fast."
* **Experience:** Low-friction, human-first. No technical jargon. Clear "Next Step", prioritized 3-item to-do list, plain-language query explanations, and automated document extraction.

### 3.2 The Department Scrutiny Officer
* **Mental Model:** "I need complete, verified applications with zero discrepancies so I can process them within statutory SLAs."
* **Experience:** Scrutiny dashboard with automated pre-validation reports, highlighted risk scores, side-by-side discrepancy markers, and integrated clarification dispatchers.

### 3.3 The Field Inspector
* **Mental Model:** "I have 12 factory audits across the district this week; optimize my travel route and let multiple departments conduct joint audits."
* **Experience:** Multi-department inspection scheduler, Google OR-Tools optimized route clustering, digital verification checklists, and geotagged photographic upload.

### 3.4 The Administrator / Evaluation Panel (Hackathon Judge)
* **Mental Model:** "Demonstrate the end-to-end distributed system, mathematical rigor, statutory provenance, process mining bottlenecks, and explainable AI."
* **Experience:** Interactive Judge Demo Stepper (10 automated operational scenes), live PM4Py Petri nets, Neo4j dependency DAG visualization, PostGIS polygon layers, and audit logs.

---

## 4. Fundamental Architectural Principles

### 4.1 Deterministic Authority + Probabilistic Assistance
* **Rule:** An LLM must **NEVER** invent laws, approvals, SLA timelines, or legal citations.
* **Architecture:**
  * **Deterministic Core (PostgreSQL, PostGIS, Neo4j, OPA Rego, Temporal):** Computes applicable laws, jurisdiction boundaries, SLA clocks, and prerequisite locks with 100% mathematical certainty.
  * **Probabilistic Assistant (Gemini 1.5 Pro / Flash + Vercel AI SDK):** Acts as a human-friendly translator, natural-language parser, form filler, and contextual query explainer grounded strictly in the verified deterministic output.

### 4.2 "Ask Once, Understand Once, Reuse Everywhere"
* Information submitted during enterprise setup or extracted via Docling from an official land deed is indexed in the **Document Vault**.
* When filing subsequent applications (e.g., Factory Registration or Water Connection), profile data and verified documents are automatically linked without re-uploading.

### 4.3 Total Jargon Isolation on the Applicant Surface
* Words like *Dependency DAG*, *Pre-Flight X-Ray*, *Statutory Discovery Engine*, *Project Twin*, *H3 Hexagon*, and *OPA Rego* are banned from applicant-facing UI components.
* They are replaced with natural phrases: *Approval Sequence*, *Check Before Submission*, *Find Required Approvals*, *Project Profile*, and *Location Found*.

---

## 5. High-Level Macro Topology

```text
                               ┌─────────────────────────────────────────┐
                               │           ENTERPRISE APPLICANT          │
                               │  (Mobile / Desktop Responsive Browser)  │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │       EDGE INGRESS & NEXT.JS 14         │
                               │  - React 18 Server & Client Components  │
                               │  - Vercel AI SDK Streaming Assistant    │
                               │  - Next.js API Routes (/api/*)          │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │                                  │                                  │
                 ▼                                  ▼                                  ▼
   ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
   │    GEOSPATIAL ENGINE      │      │    REGULATORY GRAPH       │      │   POLICY & DETERMINISM    │
   │  - PostGIS Polygons       │      │  - Neo4j Knowledge Graph  │      │  - Open Policy Agent      │
   │  - Uber H3 Spatial Index  │      │  - Transitive Prereqs     │      │  - Rego Compliance Rules  │
   │  - Jurisdiction Resolver  │      │  - Critical Path DAG      │      │  - Zero-Defect X-Ray      │
   └─────────────┬─────────────┘      └─────────────┬─────────────┘      └─────────────┬─────────────┘
                 │                                  │                                  │
                 └──────────────────────────────────┼──────────────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │                                  │                                  │
                 ▼                                  ▼                                  ▼
   ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
   │  DOCUMENT INTELLIGENCE    │      │  WORKFLOW & STATE ENGINE  │      │  OPTIMIZATION & PROCESS   │
   │  - Docling Layout Parser  │      │  - Temporal.io Orchestr.  │      │  - Google OR-Tools CP-SAT │
   │  - pgvector RAG Index     │      │  - Statutory SLA Timers   │      │  - PM4Py Process Mining   │
   │  - Document Vault Reuse   │      │  - Resilient Sagas        │      │  - Bottleneck Detection   │
   └───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```
