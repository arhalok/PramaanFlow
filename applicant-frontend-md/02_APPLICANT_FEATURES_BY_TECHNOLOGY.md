# Applicant Features Mapped to the Existing Technology Stack

## Purpose

This document answers the key product question:

> "I have these technologies in the backend. What useful features can I actually show to the applicant?"

Rule:

**Do not show the technology. Show the decision, state, evidence, guidance, or action that the technology makes possible.**

---

# 1. Vercel AI SDK + Gemini

## Backend capability

The AI SDK supports tool calling, structured tool inputs, multi-step tool execution, and tool results that can be surfaced to UI. citeturn287874search0turn287874search4

## Applicant-facing features

### A. Contextual Approval Assistant

User asks:

> "What approvals do I need?"

The assistant uses applicant business + location + current state and calls the appropriate backend tools.

### B. Natural-language navigation

User says:

> "Show the documents missing from my factory application."

The assistant should retrieve the application and open the relevant UI surface.

### C. Explain a result

> "Why is this approval required?"

The assistant retrieves structured evidence and explains it.

### D. Status queries

> "Has my application moved?"

The assistant queries actual application state.

### E. Safe action confirmation

For sensitive actions such as submitting, responding to a query or changing important data, use an explicit confirmation UX. AI SDK tool calling supports tool approval flows for sensitive operations. citeturn287874search0

### F. Generative UI results

Do not return only prose. When a tool result is naturally structured, render a card/table/list such as:

- approval cards;
- missing-document checklist;
- status timeline;
- jurisdiction panel;
- source panel.

## What judges should see

A judge can type:

> "Why is Fire NOC appearing for this project?"

The AI calls tools and returns a grounded explanation with a direct UI action.

That demonstrates **AI that operates the product**, not merely a chatbot.

---

# 2. PostgreSQL

## Applicant-facing purpose

PostgreSQL is the system of record for the applicant's durable state.

Show:

- business/project profile;
- application records;
- application state;
- timelines/events;
- documents metadata;
- tasks/action states;
- notifications;
- schemes;
- renewals.

## UI consequence

The applicant must feel that the system remembers their work.

Examples:

- return later and resume;
- reuse project data;
- preserve application history;
- see previous submissions;
- see audit-like activity history.

---

# 3. pgvector

## Backend capability

pgvector adds vector similarity search inside PostgreSQL and supports exact and approximate nearest-neighbour search, including HNSW/IVFFlat indexing. citeturn887826search0

## Applicant-facing features

### A. Semantic regulation search

User asks:

> "What approval covers industrial wastewater?"

Return relevant regulatory/approval content even when the exact phrase differs.

### B. Contextual document search

User asks:

> "Find the part of the policy that mentions factory layout."

Return relevant source snippets.

### C. Related guidance

On an approval page:

`Related guidance`

Use semantic retrieval to surface relevant policy/help documents.

### D. Explain with evidence

RAG results can be shown as a compact evidence drawer:

- source title;
- issuing authority;
- section/page;
- last-known update date;
- retrieved passage.

Do not show a raw similarity score to ordinary applicants. Similarity is an internal retrieval metric, not a user-facing confidence guarantee.

---

# 4. Docling

## Backend capability

Docling converts diverse documents into a structured document representation. Its current documentation describes document hierarchy, text, tables, pictures, layout information and provenance, plus OCR and table-structure handling. citeturn746171search1turn746171search2turn746171search3

## Applicant-facing features

### A. Intelligent document preview

Instead of only offering "Download PDF":

- searchable document text;
- page-aware preview;
- section navigation;
- table preview;
- extracted metadata where appropriate.

### B. Document-to-field assistance

When a document contains structured information, show:

`Detected information`

and allow the user to review/populate fields rather than manually retype them.

### C. Document requirement matching

Show:

`This document appears to satisfy: Site Plan requirement`

only when the actual matching logic supports that conclusion.

### D. Missing-information warnings

Where extraction/validation detects a discrepancy, surface it as:

`Check this information`

not as an absolute rejection unless the rules support rejection.

---

# 5. Airweave

## Backend capability

Airweave is an open-source context retrieval layer for AI agents. It connects sources, continuously syncs/indexes data and exposes unified retrieval to AI systems. citeturn746171search8

## Applicant-facing features

### A. Unified knowledge search

Search across connected sources and show one coherent result set.

### B. Fresh context indicator

Where synchronization metadata is available:

`Source updated recently`

### C. Source-aware answers

An AI answer can show:

`Based on: Department guidance / policy document / connected source`

### D. Cross-source synthesis

A user can ask:

> "Which documents do these two requirements have in common?"

and the system can combine multiple retrieved sources.

Do not expose connector names or ingestion architecture unless the user is in an administrative/debug screen.

---

# 6. Neo4j Knowledge Graph

## Backend capability

Neo4j models data as nodes, relationships and properties and is designed for relationship-heavy traversals and finding connections between entities. citeturn887826search1turn887826search5

## Applicant-facing features

### A. Approval dependency map

Show:

`Premises → Building approval → Fire approval → Operational approval`

### B. Why-this-result explanation path

Example:

`Food Manufacturing`

→ `Maharashtra`

→ `Local authority`

→ `Applicable condition`

→ `Factory Licence`

### C. Parallel-path view

Identify approvals that are independent and can proceed in parallel.

### D. Related obligations

On an approval page:

`Related approvals`

`Prerequisites`

`Downstream approvals`

### E. Change impact

If a project attribute changes, show which approval set may be affected.

Example:

`Location changed`

`3 approval relationships may need review.`

That is a high-value user feature because the graph is actually being used to manage dependencies rather than displayed as decorative technology.

---

# 7. H3 Geospatial Indexing

## Backend capability

H3 partitions the world into hierarchical hexagonal cells and provides operations for containment, boundaries and neighbouring cells. It is designed as a geospatial indexing system. citeturn287874search3turn287874search7

## Applicant-facing features

### A. Jurisdiction detection

Show the resulting authority/jurisdiction for a chosen location.

### B. Boundary visualization

Optional map layer showing the relevant service/jurisdiction area.

### C. Nearby authority / service discovery

Examples:

- nearest relevant office;
- inspection area;
- local authority;
- support point.

### D. Location-change impact

When an applicant changes location:

`Your jurisdiction changed from X to Y.`

`Review affected approvals.`

### E. Geospatial context in approval discovery

The map should answer:

`Why is this approval applicable at this location?`

Do not show the H3 cell ID to normal applicants.

---

# 8. OPA — Policy as Code

## Backend capability

OPA is an open-source policy engine that evaluates structured input against policies and produces policy decisions. Rego is its declarative policy language. citeturn887826search4turn887826search6

## Applicant-facing features

### A. Pre-submission rule check

`Ready / Not ready`

with precise reasons.

### B. Eligibility / applicability checks

Show:

`This service appears applicable because...`

### C. Blocking conditions

Example:

`Cannot proceed yet`

`Prerequisite: Site approval is not complete.`

### D. Policy explanation

Expose human-readable rule outcomes:

`Rule checked`

`Result`

`What you can do next`

Never expose Rego code.

### E. Action guardrails

Before an irreversible tool action, use policy checks and/or confirmation.

---

# 9. Temporal

## Backend capability

Temporal provides durable workflow execution that preserves workflow state and progress despite failures/crashes. citeturn287874search9

## Applicant-facing features

### A. Durable application journey

Applicant can leave and return without losing process state.

### B. Workflow timeline

Show real process stages driven by workflow state.

### C. Long-running steps

Inspection pending, department review, query waiting and approvals can remain in a durable workflow state.

### D. Event-driven updates

When a workflow state changes, update the applicant's timeline/notifications.

### E. Escalation / timers

Where statutory or configured timers exist, show a deadline or escalation status.

Do not claim the system will finish in a particular duration unless an authoritative SLA or validated estimate exists.

---

# 10. PM4Py Process Mining

## Backend capability

PM4Py supports process discovery and conformance checking, including directly-follows graphs, process models and diagnostics. citeturn738071search0turn738071search1

## Applicant-facing features

PM4Py should normally power insight, not become a technical analytics screen.

### A. Process stage transparency

Show the actual process path for the applicant's case.

### B. Bottleneck explanation

Where supported by real historical/process-event data:

`Current delay reason`

`Waiting for inspection`

`Waiting for department action`

`Waiting for applicant response`

### C. Process deviation warning

Where conformance analysis is implemented:

`This application has taken a different path from the configured process.`

Only show this when the result is meaningful and explain what the difference means.

### D. Process insight for judges

A separate demo/analytics layer can show discovered process flows and bottleneck analysis. Keep the public applicant UI simpler.

---

# 11. Inspector assignment + skills + availability + jurisdiction

## Applicant-facing features

Do not show staff ranking algorithms.

Show:

- inspection required;
- assignment status;
- inspection scheduling state;
- appointment date/time window;
- authority/jurisdiction responsible;
- preparation checklist;
- rescheduling options when allowed;
- inspection outcome;
- next step.

### Judge-visible wow behavior

Change the project location or inspection constraints and demonstrate that the backend resolves the appropriate jurisdiction/assignment and the applicant-facing appointment/status updates.

---

# 12. OR / Optimisation capability

If an optimisation engine is used for inspection allocation/scheduling or other operational coordination, do not expose mathematical terminology.

Applicant sees:

`Inspection slot assigned`

`Alternative slots`

`Reschedule`

`Next step`

Judge can see the technical explanation in the admin/operations console.

---

# 13. Combined "intelligent approval result"

The best applicant result page combines the technologies without naming them.

Example:

```text
Factory Licence

Why it appears
Food manufacturing + selected location + applicable conditions

Jurisdiction
Jaipur District / Local Authority

Prerequisites
✓ Business details
✓ Premises details
○ Site approval

Documents
✓ 4 available from your document vault
○ 2 still required

Process
1. Submit
2. Validation
3. Department review
4. Inspection (if required)
5. Decision

Official source
[View source]

[Start application]
```

Behind this one screen may be:

`Gemini + AI SDK + PostgreSQL + pgvector + RAG + Docling + Airweave + Neo4j + H3 + OPA + Temporal + PM4Py`

That is exactly the desired abstraction.

---

# 14. Highest-value technology-to-screen mapping

| Technology | Visible applicant feature | Judge wow value |
|---|---|---|
| AI SDK + Gemini | Contextual assistant + tool actions | AI actually operates the product |
| PostgreSQL | Persistent applicant/application state | End-to-end system reliability |
| pgvector | Semantic regulatory/document search | Grounded intelligence |
| Docling | Smart document extraction/preview | Less repetitive data entry |
| Airweave | Unified context retrieval | Current cross-source knowledge |
| Neo4j | Dependency graph + why-this-result | Relationship-aware approvals |
| H3 | Jurisdiction/map intelligence | Geospatial regulatory applicability |
| OPA | Pre-validation + rule checks | Safe deterministic guardrails |
| Temporal | Durable workflow/timeline | Long-running government process handling |
| PM4Py | Process/bottleneck transparency | Process intelligence |
| Inspector intelligence | Inspection scheduling/status | Operational coordination |
| Optimisation | Slot/resource coordination | Algorithmic backend with practical result |

## Sources

- AI SDK tool calling: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
- AI SDK chatbot tool usage: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage
- pgvector: https://github.com/pgvector/pgvector
- Neo4j graph database: https://neo4j.com/docs/getting-started/graph-database/
- H3: https://h3geo.org/docs/
- OPA: https://www.openpolicyagent.org/docs
- Temporal: https://docs.temporal.io/temporal
- PM4Py: https://github.com/process-intelligence-solutions/pm4py
- Docling: https://github.com/docling-project/docling
- Airweave: https://github.com/airweave-ai/airweave
