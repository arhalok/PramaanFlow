# Applicant Wow Features + Judge Demonstration Strategy

## Principle

A "wow" feature is not a flashy animation. It is when the applicant changes something and the platform intelligently reacts across multiple layers.

The judge should be able to see cause → system reasoning → user-visible result.

---

# 1. Wow #1 — Location changes the approval universe

### Demo

1. Start with Business A in Location A.
2. Show jurisdiction.
3. Show relevant approvals.
4. Change location.
5. System re-resolves jurisdiction.
6. Approval relevance/dependencies update.
7. UI highlights affected approvals.

### Applicant sees

`Location updated`

`Your jurisdiction has changed.`

`4 approval requirements may be different. Review affected items.`

### Technology underneath

H3 + PostgreSQL + policy/rule engine + knowledge graph.

---

# 2. Wow #2 — "Why is this approval required?"

### Demo

Open an approval and select:

`Why this approval?`

Show an evidence chain:

```text
Business activity
      ↓
Project characteristic
      ↓
Location
      ↓
Jurisdiction
      ↓
Applicable rule
      ↓
Approval
```

### Applicant benefit

The platform does not merely give a list. It explains the relationship.

### Technology underneath

Neo4j + RAG/pgvector + OPA + AI SDK.

---

# 3. Wow #3 — Document reuse with intelligence

### Demo

1. Upload a document once.
2. Docling processes it.
3. Application asks for the same document.
4. Existing document is detected.
5. Applicant chooses `Use existing`.
6. Extracted fields are available for review.

### Applicant sees

`Existing document available`

`Use this document?`

### Technology underneath

Docling + PostgreSQL + document metadata + RAG.

---

# 4. Wow #4 — AI actually uses tools

### Demo prompt

> "What am I missing for this application?"

AI should:

1. inspect current application;
2. retrieve required checklist;
3. compare actual state;
4. return missing items;
5. open the relevant UI.

Do not create a generic answer from model memory.

### Second prompt

> "Show me why I need this approval and the official source."

AI retrieves the relevant evidence and renders a source-aware explanation.

### Technology underneath

Gemini + Vercel AI SDK tools + backend retrieval + policy/graph services.

---

# 5. Wow #5 — Pre-submission X-ray

Create an applicant-facing `Application check` screen.

```text
Application readiness

Business information      ✓
Location                  ✓
Required documents         ✓
Policy checks              ✓
Missing information        2
Warnings                   1

[Fix 2 issues]
```

The user sees not just form completion, but a multi-layer readiness result.

### Technology underneath

OPA + PostgreSQL + Docling + knowledge/RAG checks.

---

# 6. Wow #6 — Parallel approvals become visible

Instead of:

`Approval 1 → Approval 2 → Approval 3 → ...`

show:

```text
                    ┌─ Environmental ─┐
Project setup ──────┼─ Fire ----------─┼─→ Factory approval
                    └─ Building -------┘
```

Applicant understands what can proceed independently.

### Technology underneath

Neo4j + Temporal/workflow model.

---

# 7. Wow #7 — Inspection is not a black box

Applicant sees:

```text
Inspection required

Jurisdiction identified ✓
Assignment              ✓
Scheduling              ●
Appointment             Pending
```

Once assigned:

```text
Inspection scheduled
Tuesday, 10:30–12:00

Prepare:
✓ Site plan
✓ Identity/authorisation
✓ Required records

[View details]
```

### Technology underneath

Jurisdiction engine + staff availability + skills matching + workflow orchestration + optimisation.

---

# 8. Wow #8 — Process intelligence without exposing PM4Py

Applicant UI:

`Current stage: Department review`

`Waiting for: Department action`

`Next process step: Inspection scheduling`

A judge can open the operations console and see:

- process map;
- bottleneck category;
- conformance/deviation information.

### Technology underneath

PM4Py + Temporal event history.

---

# 9. Wow #9 — Impact preview before changing project information

When the applicant changes a major context attribute:

`Changing project scale may affect: 3 approvals, 2 documents and 1 workflow.`

Show a review drawer.

This makes the graph/rules engine feel intelligent and safe.

---

# 10. Wow #10 — "Nothing needed from you"

This sounds simple but is excellent UX.

If workflow is waiting on government:

```text
No action required

Your application is currently under departmental review.

Last updated: 29 Sep
```

The platform removes uncertainty instead of creating more tasks.

---

# 11. What NOT to show as applicant features

Do not put these in the applicant's primary interface:

- Neo4j
- H3 cell IDs
- pgvector similarity scores
- embeddings
- Rego rules
- Temporal workflow IDs
- PM4Py Petri net technical notation
- agent traces
- LLM token usage
- model confidence percentages unless genuinely meaningful and carefully justified
- internal inspector rankings
- algorithm weights
- internal service endpoints

These belong in judge/admin/dev surfaces, not the normal applicant experience.

---

# 12. Judge demo sequence

Use one coherent story, not 15 disconnected features.

### Scene 1 — Start

Applicant enters business + location.

### Scene 2 — Intelligence

System identifies jurisdiction and generates relevant approval landscape.

### Scene 3 — Explainability

Open one approval and show why it appears.

### Scene 4 — Dependency

Show prerequisite/parallel relationships.

### Scene 5 — Documents

Use a document already in the vault.

### Scene 6 — Pre-validation

Run application X-ray/readiness check.

### Scene 7 — Submit

AI can assist, but final submission requires user confirmation.

### Scene 8 — Workflow

Show timeline as the case moves through workflow/inspection.

### Scene 9 — Query

Simulate a department clarification.

### Scene 10 — Applicant response

Respond and show timeline update.

### Scene 11 — Process intelligence

Show the judge the operations side with process/bottleneck analysis.

### Scene 12 — Return to applicant

Applicant sees a clear status: waiting, action required, approved, or next stage.

This makes the entire architecture feel like one system.

---

# 13. Best applicant feature shortlist for the live demo

If implementation time is limited, prioritise these visible experiences:

1. Business + location setup
2. Jurisdiction-aware approval discovery
3. "Why this approval?"
4. Approval dependency/parallel view
5. Reusable document vault
6. Pre-submission X-ray
7. Application timeline + SLA state
8. Inspection status/scheduling
9. Clarification response flow
10. Contextual AI tool-calling assistant
11. Renewals/compliance view
12. Scheme/incentive discovery

These map directly to the PS outcome areas rather than being decorative features.
