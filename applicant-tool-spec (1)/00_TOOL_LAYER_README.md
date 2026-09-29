# Applicant AI Tool Layer — README

## Purpose

Build the missing **AI tool layer** for the applicant experience.

The target architecture is:

Applicant UI
→ Vercel AI SDK
→ Gemini
→ typed tool selection
→ Tool Registry
→ Tool Executor
→ Domain Services
→ PostgreSQL / pgvector / Neo4j / GIS / OPA / Temporal / Docling / Airweave / availability services
→ structured ToolResult
→ Gemini
→ applicant-friendly response/UI action

Gemini must NOT directly query PostgreSQL, Neo4j, pgvector, filesystem, or external systems.

Gemini chooses from safe, typed tools. Each tool owns validation, authorization, database access, error handling, and audit logging.

## Core principle

> Ask the applicant once. Resolve facts in the backend. Reuse facts everywhere.

## Tool categories

1. Applicant/profile
2. Project/business context
3. Location/jurisdiction
4. Approval discovery
5. Approval details/requirements
6. Regulatory knowledge/RAG
7. Dependency/knowledge graph
8. Documents/Docling
9. Application drafts/forms
10. Readiness/X-Ray/OPA
11. Application tracking/Temporal
12. Inspection/skills/availability
13. Notifications
14. Grievance/escalation
15. Compliance/renewal
16. Search
17. Navigation/UI-intent
18. System/meta

## Tool classes

### READ
Safe retrieval. No mutation.

### WRITE_LOW_RISK
Creates or updates applicant-owned drafts or preferences. May run without an extra confirmation when the action is clearly reversible.

### WRITE_CONFIRM
Mutates an external/submission state, sends a response, books an inspection, raises a grievance, or performs another meaningful action. Must require explicit user confirmation immediately before execution.

### UI_ACTION
Does not change authoritative business state. Returns a navigation/deep-link or UI instruction.

## Non-negotiable rules

- Never fabricate official requirements, statuses, approvals, deadlines, inspection slots, or decisions.
- Never let the model infer authoritative state when a tool can retrieve it.
- Every tool has a Zod schema.
- Every tool returns a typed `ToolResult`.
- Every tool has an authorization scope.
- Every write has an idempotency key.
- Every external-facing write is auditable.
- Tool errors are structured and recoverable.
- Tool results contain source/provenance when the answer is regulatory.
- Tool output should contain machine-readable facts first and user-ready summaries only as secondary metadata.
