# Implementation Phases and Antigravity Checklist

## Phase 0 — Repository audit

Antigravity must first:

- inspect the current folder structure;
- detect framework/runtime;
- detect existing DB/schema;
- detect existing maps/H3 code;
- detect existing AI/RAG code;
- detect existing approval/application components;
- identify existing authentication;
- identify current deployment method;
- search globally for VROOM and remove it from the target architecture.

Deliver an internal audit note before destructive changes.

## Phase 1 — Foundation

Implement:

- environment configuration;
- PostgreSQL migrations;
- PostGIS + pgvector readiness;
- common IDs and timestamps;
- audit/event tables;
- API error model;
- correlation IDs;
- object storage abstraction;
- RBAC baseline.

## Phase 2 — Regulatory data foundation

Implement:

- approval catalog;
- authority/jurisdiction tables;
- approval rules;
- dependencies;
- source/provenance tables;
- Neo4j projection;
- versioned regulatory records.

Seed only clearly synthetic rules unless actual authoritative source data is available.

## Phase 3 — RAG

Implement:

- Airweave/custom source adapter;
- Docling ingestion;
- structure-aware chunking;
- pgvector embeddings;
- metadata filtering;
- hybrid retrieval;
- citation objects;
- RAG evaluation tests.

## Phase 4 — Applicability + OPA

Implement:

- normalized ProjectContext;
- rule evaluation;
- OPA policies;
- policy versioning;
- explainable decisions;
- applicability endpoint;
- dependency plan generation.

## Phase 5 — Documents

Implement:

- upload/versioning;
- Docling extraction;
- deterministic validation;
- verified fact store;
- reuse flow;
- query generation.

## Phase 6 — Temporal

Implement:

- parent project workflow;
- approval child workflows;
- signals/updates;
- SLA timers;
- retries;
- query waiting;
- inspection waiting;
- approval completion;
- renewal scheduling.

## Phase 7 — Inspector optimization

Implement Python optimizer service:

```text
Filter candidates
 → Skills
 → Jurisdiction
 → Availability
 → Time windows
 → SLA
 → OR-Tools
 → Persist assignments
```

Add infeasibility reporting.

## Phase 8 — Compliance and grievance

Implement:

- compliance obligations;
- renewal calendars;
- notifications;
- grievance intake;
- SLA escalation;
- escalation audit trail.

## Phase 9 — PM4Py analytics

Implement:

- normalized event log;
- process discovery;
- bottleneck metrics;
- conformance checks;
- dashboard APIs.

## Phase 10 — Observability/security

Implement:

- OpenTelemetry;
- Jaeger;
- Prometheus;
- Grafana;
- structured application logs;
- trace correlation;
- permission audits;
- document-access audits.

## Phase 11 — Frontend integration

Integrate real backend states into:

- project onboarding;
- approval DAG;
- documents;
- application timeline;
- queries;
- inspection board;
- map;
- compliance center;
- government analytics.

## Phase 12 — End-to-end demo

Use one coherent synthetic project. No disconnected mock screens.

## Engineering checklist

- [ ] No VROOM dependency or reference
- [ ] PostgreSQL is system of record
- [ ] pgvector retrieval works
- [ ] Docling pipeline works on sample documents
- [ ] Airweave integration is behind an adapter
- [ ] Neo4j graph projection works
- [ ] OPA returns versioned decisions
- [ ] Temporal workflow runs end-to-end
- [ ] OR-Tools optimizer works
- [ ] Skills are enforced as hard constraints
- [ ] Jurisdiction is enforced as a hard constraint
- [ ] Availability is enforced as a hard constraint
- [ ] Time windows are enforced as hard constraints
- [ ] SLA urgency affects objective/feasibility
- [ ] PM4Py receives event log
- [ ] Observability captures cross-service traces
- [ ] Audit evidence is queryable
- [ ] Applicant/department RBAC works
- [ ] Synthetic demo data is explicitly labeled
