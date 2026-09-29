# Antigravity Implementation Prompt — Applicant Frontend

## Mission

Use the accompanying applicant frontend Markdown specifications as the product contract.

Do not simply add more cards to the existing UI.

Refactor the applicant-facing experience into a coherent, state-aware, enterprise-grade journey for SIH 2026 PS 26130.

## Step 1 — Inspect before implementing

Inspect:

- existing routes;
- applicant pages;
- reusable components;
- design tokens;
- database/API contracts;
- AI SDK integration;
- current Gemini tool calling;
- approval data;
- application state model;
- document storage;
- map/GIS integration;
- jurisdiction service;
- knowledge graph endpoints;
- RAG endpoints;
- OPA/policy endpoints;
- Temporal workflow endpoints;
- process mining endpoints;
- inspection endpoints.

Preserve working backend contracts.

## Step 2 — Implement information architecture

Ensure applicant-side routes/components exist for:

- Home
- Discover
- Approval Details
- Dependency Explorer
- Application Workspace
- Application Review / X-ray
- Documents
- Applications
- Application Details / Timeline
- Clarification
- Inspection
- Compliance / Renewals
- Schemes / Incentives
- Notifications
- Assistant
- Profile / Business Context
- Location / Jurisdiction

Use the actual project routing conventions.

## Step 3 — Implement the primary journey first

Make this journey excellent before polishing secondary pages:

`Business + Location → Approval Discovery → Why Approval → Dependencies → Documents → Application → X-ray → Submit → Track → Query → Respond`

## Step 4 — Bind real system data

Prefer real API/database state.

Do not fabricate government decisions, approval results, SLA values, inspection assignments, document verification or AI confidence scores.

For unavailable backend capabilities:

- create clean typed integration interfaces;
- show explicit development/limited-data states;
- never pretend placeholder output is official.

## Step 5 — Make technology visible only through outcomes

### H3
Show jurisdiction and location intelligence.

### Neo4j
Show approval dependencies and reason paths.

### pgvector / RAG / Airweave
Show grounded regulatory answers and evidence.

### Docling
Show intelligent document extraction/preview/reuse.

### OPA
Show deterministic readiness/eligibility/rule outcomes.

### Temporal
Show durable application workflow state/timeline.

### PM4Py
Show process/bottleneck insight where supported by actual event data.

### AI SDK + Gemini
Show contextual assistant + tool actions.

### Inspection intelligence
Show scheduling/assignment status, not internal ranking.

## Step 6 — Build the applicant home as an adaptive surface

Do not create 10 KPI cards.

The home screen should always prioritise:

1. current project/location context;
2. most important application state;
3. action required, if any;
4. progress;
5. approvals to review;
6. upcoming compliance/renewal state;
7. recent meaningful changes;
8. assistant.

## Step 7 — Build an exceptional approval discovery UI

The result should include:

- filters;
- grouping;
- status;
- jurisdiction;
- why relevant;
- documents;
- prerequisites;
- dependency hints;
- official source;
- one clear action.

## Step 8 — Build the explainability experience

Implement a reusable `Why this result?` panel.

It should support:

- applicant facts;
- jurisdiction;
- applicable conditions/rules;
- source reference;
- related approval/dependency;
- AI explanation.

## Step 9 — Build the application X-ray

Create an applicant-facing readiness panel.

Categories:

- Passed
- Blocking
- Warning

Each issue must deep-link to the correction.

## Step 10 — Build document intelligence UX

Where backend supports it:

- detect existing document;
- reuse it;
- preview extracted structure;
- show expiry;
- show metadata;
- compare document-derived values to entered data;
- identify unresolved mismatch.

## Step 11 — Build timeline/state UX

Timeline must differentiate:

- applicant action;
- authority action;
- system/workflow state;
- inspection;
- query;
- decision.

Make it obvious what currently blocks progress.

## Step 12 — Build contextual AI

The assistant must know the current context.

Implement example actions:

- find relevant approvals;
- explain approval;
- find missing documents;
- show application status;
- explain next step;
- search official source;
- open relevant UI section.

Where actions are sensitive, require confirmation.

## Step 13 — Improve visual quality

Use the design system document.

Remove:

- redundant dashboard cards;
- technical labels;
- dead-end pages;
- inconsistent buttons;
- visually noisy surfaces.

Improve:

- spacing;
- typography;
- information hierarchy;
- status visibility;
- responsive behavior;
- keyboard/accessibility;
- loading and error states.

## Step 14 — Test as a real applicant

Perform a full clean-user walkthrough.

A new user must be able to understand the service without a separate tutorial.

Perform at least:

### Scenario A
New project → location → approval discovery.

### Scenario B
Approval → why it applies → dependencies.

### Scenario C
Start application → document reuse → X-ray → review.

### Scenario D
Submitted application → timeline → query → response.

### Scenario E
Inspection required → scheduling → appointment state.

### Scenario F
Renewal/compliance.

## Step 15 — Visual acceptance criteria

The applicant should always understand:

`Where am I?`
`What is the current state?`
`What has been completed?`
`What requires my action?`
`What is the government/department doing?`
`What is next?`
`Why is this required?`
`Where is the source?`

## Final standard

Do not optimise for the maximum number of visible technologies.

Optimise for:

**maximum user clarity produced by the maximum useful intelligence underneath.**
