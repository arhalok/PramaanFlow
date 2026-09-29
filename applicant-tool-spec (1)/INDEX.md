# Applicant AI Tool Layer — Index

Read in this order:

1. `00_TOOL_LAYER_README.md`
2. `01_COMPLETE_TOOL_CATALOG.md`
3. `02_TOOL_SCHEMAS_AND_RESULT_CONTRACT.md`
4. `03_GEMINI_AND_VERCEL_AI_SDK_TOOL_ROUTING.md`
5. `04_DOMAIN_SERVICE_IMPLEMENTATION.md`
6. `05_TOOL_BUILDING_WITH_YOUR_TECHNOLOGIES.md`
7. `06_TOOL_SECURITY_GUARDRAILS_AUDIT.md`
8. `07_COMPOSITE_USER_ACTION_TO_TOOL_FLOW.md`
9. `08_FRONTEND_TOOL_UI_CONTRACT.md`
10. `09_ANTIGRAVITY_BUILD_PROMPT.md`
11. `10_TOOL_TEST_MATRIX.md`

## One-line architecture

```text
Applicant
 ↓
Frontend / Context
 ↓
Vercel AI SDK
 ↓
Gemini
 ↓
Typed Tool Registry
 ↓
Domain Services
 ↓
PostgreSQL / pgvector / RAG / Airweave / Neo4j / H3 / PostGIS / OPA / Docling / Temporal / PM4Py / Availability
 ↓
Typed ToolResult + provenance
 ↓
Gemini
 ↓
Answer + UI action
```
