# How Every Existing Technology Becomes a Gemini Tool

## 1. Gemini

Gemini does:
- understand natural language
- select tools
- explain tool results
- extract applicant-provided structured information
- ask for confirmation when needed

Gemini does NOT:
- decide authoritative eligibility on its own
- invent government facts
- directly access databases

---

## 2. Vercel AI SDK

Responsible for:
- model connection
- tool definitions
- streaming
- tool call lifecycle
- structured model interaction
- confirmation UI flow

---

## 3. PostgreSQL

Backs:
- applicant profile
- project
- locations
- approvals
- applications
- documents metadata
- notifications
- grievance
- compliance
- audit records
- tool execution records

Typical tools:
```text
applicant_get_profile
project_get
application_get
application_list
document_list
notification_list
compliance_list
renewal_list
```

---

## 4. pgvector

Backs semantic search over indexed knowledge.

Tool:
```text
knowledge_search
```

Use metadata filters first where possible:
- jurisdiction
- authority
- document type
- approval
- effective date

Then vector retrieval/reranking.

---

## 5. RAG

Tool:
```text
knowledge_answer_with_sources
```

Pipeline:

```text
Question
 ↓
query normalization
 ↓
metadata filters
 ↓
semantic retrieval
 ↓
reranking
 ↓
source bundle
 ↓
Gemini answer
```

---

## 6. Airweave

Use as an indexed knowledge/connectors layer where configured.

Tools may query Airweave through:
```text
knowledge_search
```

Do not expose connector details to applicants.

---

## 7. Docling

Document tools:

```text
document_process
document_get_extraction
document_classify
document_match_to_requirement
```

Pipeline:

```text
Upload
 ↓
Store
 ↓
Docling process
 ↓
Extract structure
 ↓
Classify
 ↓
Match against requirement
 ↓
Applicant confirmation
 ↓
Reuse structured values
```

---

## 8. Neo4j

Tools:

```text
dependency_get_for_project
dependency_get_for_approval
dependency_check_ready
approval_get_related_approvals
```

Use graph relationships to answer:
- What depends on what?
- What blocks this approval?
- What can proceed in parallel?
- What approvals become relevant after this step?

---

## 9. H3 + PostGIS/GIS

Tools:

```text
location_resolve
jurisdiction_get_for_project
```

Pipeline:

```text
coordinates
 ↓
H3 spatial index / cell
 ↓
GIS boundary check
 ↓
jurisdiction hierarchy
 ↓
authority mapping
```

---

## 10. OPA

Tool:

```text
application_validate
application_xray
dependency_check_ready
approval_get_applicability
```

OPA should provide deterministic policy results.

Never ask Gemini to reproduce OPA logic in prose.

---

## 11. Temporal

Tools:

```text
application_get_timeline
application_get_current_stage
application_get_next_step
application_get_action_required
inspection_get_status
```

Temporal manages long-running process state.

The UI receives translated states such as:
- Under review
- Waiting
- Action required
- Inspection required
- Completed

---

## 12. PM4Py

Primarily analytics/admin-facing.

Applicant-facing derived tools can expose only useful outcomes:

```text
application_get_tracking_context
```

For example:
- current process stage
- whether the case is waiting
- process milestone history

Do not expose process-mining terminology to applicants unless it adds real value.

---

## 13. Skills + Availability

Tools:

```text
inspection_get_available_slots
inspection_schedule
```

Backend filters candidates based on:
- jurisdiction
- required skill
- availability
- workflow constraints

Applicant sees available slots.

---

# Full technology-to-tool map

```text
Gemini
   ↓ selects
Vercel AI SDK Tools
   ↓
Tool Registry
   ├── PostgreSQL
   ├── pgvector
   ├── RAG
   ├── Airweave
   ├── Neo4j
   ├── H3/PostGIS
   ├── OPA
   ├── Docling
   ├── Temporal
   ├── PM4Py-derived state
   └── Skills/Availability
```
