# PramaanFlow — Intelligent Regulatory Approval & Compliance Orchestration Platform
## Master Architecture & System Design Documentation Suite

Welcome to the engineering architecture documentation for **PramaanFlow** (Smart India Hackathon — PS 130 / PS 132).

This documentation suite is designed for **System Architects**, **Staff Engineers**, **Technical Judges**, and **Autonomous AI Agents** who need to understand the platform's complete design, current implementation state, data models, API contracts, and roadmap for future development.

---

## Documentation Structure

```text
docs/architecture/
├── README.md                                  ← You are here (Navigation Index & Quick Summary)
├── 00_SYSTEM_OVERVIEW_AND_VISION.md            ← Problem Statement, Core Metaphor, Personas & System Topology
├── 01_SUBSYSTEM_AND_COMPONENT_ARCHITECTURE.md  ← Deep-Dive into All 9 Core Engines & Frontend Subsystems
├── 02_DATA_MODELS_AND_DATABASE_SCHEMAS.md      ← PostgreSQL, PostGIS, Neo4j Graph, and pgvector Schemas
├── 03_API_CONTRACTS_AND_TOOL_SPECIFICATIONS.md ← REST Endpoints, 25+ Applicant AI Tools, Event Payloads
├── 04_FEATURE_GAP_ANALYSIS_AND_ROADMAP.md      ← Working Features vs. In-Progress vs. Missing Capabilities
└── 05_DEVELOPER_AND_AI_CONTINUATION_GUIDE.md   ← Step-by-Step Guide for Humans & AI Agents to Extend the Codebase
```

---

## Executive Summary & Problem Context

* **Problem Statement:** Entrepreneurs in India face severe friction navigating government approvals across fragmented municipal, state, and central departments. Portals such as Single Window Systems (NSWS, MAITRI, Raj Nivesh) often function as "form aggregators" rather than intelligent navigators, forcing applicants to independently figure out jurisdictions, department jurisdictions, dependency sequences, and technical documentation.
* **Core Product Metaphor:** **Google Maps Navigation for Government Approvals.**
  * *Applicant Input:* Destination & Project Parameters (*"I want to build a food processing plant in Jaipur"*).
  * *PramaanFlow Core:* Automatically calculates the optimal regulatory route, resolves municipal/industrial jurisdictions, sequences clearances, checks documents for zero-defect filing, tracks government review, and coordinates multi-department joint inspections.
* **Non-Negotiable Architecture Principle:** **Deterministic Authority + Probabilistic Assistance.**
  * Statutory rules, legal citations (Water Act 1974, Air Act 1981, Factories Act 1948, MIDC Act 1961), jurisdictional polygons, and Right to Services (RTS) SLAs are computed **deterministically**.
  * Large Language Models (Gemini + Vercel AI SDK) are used solely for natural-language extraction, document explanation, form autofill suggestions, and conversational assistance. **AI never hallucinates laws or invents approvals.**

---

## Quick Navigation Guide

| Document | Audience & Purpose | Key Highlights |
| :--- | :--- | :--- |
| [00_SYSTEM_OVERVIEW_AND_VISION.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/00_SYSTEM_OVERVIEW_AND_VISION.md) | Architects, Product Managers, Judges | Core vision, personas, end-to-end user journey, macro-topology diagram. |
| [01_SUBSYSTEM_AND_COMPONENT_ARCHITECTURE.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/01_SUBSYSTEM_AND_COMPONENT_ARCHITECTURE.md) | Full-Stack & Systems Engineers | Breakdown of all 9 core subsystems (GIS, Neo4j, OPA, Temporal, OR-Tools, PM4Py, Docling, Next.js UI). |
| [02_DATA_MODELS_AND_DATABASE_SCHEMAS.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/02_DATA_MODELS_AND_DATABASE_SCHEMAS.md) | Database Admins, Data Engineers | Full relational SQL schemas, PostGIS geometry types, Neo4j node/edge labels, Cypher queries. |
| [03_API_CONTRACTS_AND_TOOL_SPECIFICATIONS.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/03_API_CONTRACTS_AND_TOOL_SPECIFICATIONS.md) | API Engineers, AI Agent Developers | 25+ tool schemas (`ToolResult<T>`), REST route definitions, Zod validation contracts. |
| [04_FEATURE_GAP_ANALYSIS_AND_ROADMAP.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/04_FEATURE_GAP_ANALYSIS_AND_ROADMAP.md) | Engineering Leads, Contributors | Exact inventory of what is complete, partially mocked, and missing according to SIH problem statements. |
| [05_DEVELOPER_AND_AI_CONTINUATION_GUIDE.md](file:///c:/Users/Vipin%20kumar/Downloads/ps132/docs/architecture/05_DEVELOPER_AND_AI_CONTINUATION_GUIDE.md) | AI Agents, Developers onboarding | How to run, test, extend, and deploy without breaking existing architectural invariants. |

---

## Current Architecture Topology

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                                     │
│  Next.js 14 App Router (React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet GIS) │
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
