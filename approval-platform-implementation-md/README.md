# Approval Platform — Antigravity Build Pack

This folder contains the implementation specification for turning the current project into an end-to-end regulatory approval and compliance orchestration platform.

## Read order

1. `00_ANTIGRAVITY_MASTER.md`
2. `01_SYSTEM_ARCHITECTURE.md`
3. `02_POSTGRES_DATA_MODEL.md`
4. `03_REGULATORY_KNOWLEDGE_GRAPH_NEO4J.md`
5. `04_RAG_DOCLING_AIRWEAVE_PGVECTOR.md`
6. `05_OPA_APPLICABILITY_RISK.md`
7. `06_TEMPORAL_WORKFLOW_ENGINE.md`
8. `07_INSPECTION_OR_TOOLS.md`
9. `08_DOCUMENT_INTELLIGENCE_VERIFIED_DATA.md`
10. `09_SLA_COMPLIANCE_RENEWAL_GRIEVANCE.md`
11. `10_PM4PY_PROCESS_MINING.md`
12. `11_OBSERVABILITY_SECURITY_AUDIT.md`
13. `12_API_CONTRACTS.md`
14. `13_FRONTEND_JUDGE_DEMO.md`
15. `14_IMPLEMENTATION_PHASES_CHECKLIST.md`
16. `15_VROOM_REMOVAL_AND_MIGRATION.md`

## Technology map

| Concern | Technology |
|---|---|
| Transactional DB | PostgreSQL |
| Geospatial | PostGIS + H3 |
| Vector DB/search | pgvector on PostgreSQL |
| Document parsing | Docling |
| Source sync/connectors | Airweave/adapters |
| Knowledge graph | Neo4j |
| Policy/rules | OPA + Rego |
| Long-running workflows | Temporal |
| Process mining | PM4Py |
| Inspection optimization | Google OR-Tools |
| Observability | OpenTelemetry + Jaeger + Prometheus + Grafana |
| Previous route optimizer | **Removed — VROOM** |

## Core implementation principle

Do not implement the system as a collection of mock pages. Build one executable lifecycle where UI state is backed by database state, workflow state, policy decisions, graph relationships, document evidence, optimization output and event logs.
