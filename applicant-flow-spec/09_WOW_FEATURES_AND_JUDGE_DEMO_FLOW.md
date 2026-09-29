# Applicant Wow Features and Judge Demonstration

## Rule

Do not attempt to show every technology during the demo.

Show a small number of interactions where multiple technologies collaborate behind one simple user action.

# WOW 1 — Personalized Approval Universe

### Demo

Enter:

- business activity
- project location
- scale

Then show personalized approvals.

### Technologies involved

AI + rules + knowledge + jurisdiction + database.

### UI story

`Based on your project...`

Then show grouped approval results.

---

# WOW 2 — Why This Approval?

Open an approval and click:

`Why am I seeing this?`

Show contributing context:

```text
Business activity
Location
Scale
Applicable condition
Official source
```

### Technologies

Neo4j + OPA + RAG + PostgreSQL.

---

# WOW 3 — Interactive Approval Dependency Map

Open:

`View approval journey`

Show connected approvals and prerequisites.

Click a node to inspect the reason.

### Technologies

Neo4j + workflow relationships.

---

# WOW 4 — Upload Once, Understand, Reuse

Upload a real sample document.

Show:

`Document processed`

Then display extracted fields.

Start a second application that requests the same document.

Show:

`Existing document found -> Use existing`

### Technologies

Docling + PostgreSQL + application requirement model.

---

# WOW 5 — Application X-Ray

Before submission, click:

`Check application`

The system finds a deliberate test issue.

Example:

`Address mismatch between application and uploaded document.`

Click the issue.

UI navigates directly to the correction.

### Technologies

Docling + OPA + database consistency checks.

---

# WOW 6 — AI That Actually Does Something

Ask:

`What is blocking my application?`

AI retrieves actual application state.

Then:

`You are missing the site plan.`

Button:

`Open missing document`

The interface navigates to the correct document section.

### Technologies

Vercel AI SDK + Gemini + tool calling + backend.

---

# WOW 7 — Live Workflow Visibility

After an application status event occurs, show the tracking timeline update.

Example:

`Validation complete -> Under review`

### Technologies

Temporal/workflow state + PostgreSQL + realtime/event layer if implemented.

---

# WOW 8 — Inspection Progress

Change the application to an inspection-required state.

Show:

`Inspection required -> Scheduling -> Scheduled`

### Technologies

Jurisdiction + skills + availability + workflow.

---

# WOW 9 — Project Change Impact

Change location or business activity.

System responds:

```text
Your approval plan changed

+2 approvals to review
1 existing approval may be affected
```

### Technologies

H3/GIS + Neo4j + OPA/rules.

This is an excellent advanced judge interaction.

---

# WOW 10 — Process Transparency

Show:

`Current stage`
`Elapsed time`
`Waiting at`

Example:

`Your application is currently waiting for department review. No action is required from you.`

### Technologies

Temporal + PM4Py + application events.

---

# Recommended 5-7 minute judge demo

## Scene 1 — Start

`Start a new project`

Set business activity + location.

## Scene 2 — Discover

Show the personalized approval universe.

## Scene 3 — Explain

Open `Why is this required?`

## Scene 4 — Dependencies

Open approval journey graph.

## Scene 5 — Prepare

Open documents, reuse an existing one and run X-Ray.

## Scene 6 — AI

Ask `What is blocking me?`

AI reads real state and opens the issue.

## Scene 7 — Track

Submit demo application and show timeline/status transition.

## Scene 8 — Advanced

Trigger clarification or inspection update.

The judge should finish with the feeling:

`One applicant interface compresses a complicated approval ecosystem into a coherent guided process.`

# What not to demo

Do not spend time on:

- raw Neo4j screens
- database tables
- vector indexes
- H3 cell IDs
- internal workflow code
- long chatbot conversations
- generic dashboards

Use those technologies as invisible infrastructure behind meaningful applicant interactions.
