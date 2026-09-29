# Technology-to-Applicant Experience Wiring

## Purpose

This document connects every important technology in the project to an applicant-visible feature and a judge-visible demonstration.

The architecture should never be technology for technology's sake. Every component needs a user outcome.

---

## 1. Vercel AI SDK + Gemini

### Applicant feature
Contextual AI copilot.

### User can ask
- what approvals apply
- why an approval appears
- what documents are missing
- what stage the application is at
- what needs attention
- open the relevant page/tool

### Tool examples

```text
get_project_context
resolve_location
get_applicable_approvals
get_approval_details
get_application_status
get_missing_documents
validate_application
search_official_knowledge
get_dependencies
get_inspection_status
get_notifications
open_application_section
```

### Judge moment
Ask:

`What am I missing for my current application?`

The assistant should query actual backend state, answer concisely and deep-link to the issue.

---

## 2. PostgreSQL

### Applicant features
- persistent project
- application state
- documents metadata
- events
- notifications
- deadlines
- approval records
- audit/history

### UI implication
Every important screen should have real persisted state rather than fake local-only records.

---

## 3. pgvector + RAG

### Applicant feature
Official-source grounded assistance.

### UI
`Why?` / `Source` / `Official requirement`

When the assistant answers regulatory questions, provide a source panel.

### Judge moment
Ask:

`Why is this approval required here?`

Assistant should explain using retrieved source-backed knowledge.

---

## 4. Docling

### Applicant features
- document parsing
- structured field extraction
- document preview metadata
- smarter completeness checks
- reusable document understanding

### UI
After upload:

```text
Document processed

Detected:
Business name: ...
Address: ...
Date: ...
Document type: ...

[Review extracted information]
```

### Critical trust rule
Extracted values are suggestions until validated by the applicant or an authoritative verification process.

---

## 5. Airweave

### Applicant feature
Knowledge connectivity and source discovery.

It should help the RAG layer find current/specific connected content.

### UI
Expose source labels and document titles, not connector internals.

---

## 6. Neo4j Knowledge Graph

### Applicant features
- approval dependency map
- related approvals
- prerequisite explanation
- impact analysis
- connected authorities/business conditions

### Judge moment
Change one project attribute and show the approval plan adapting through relationships.

---

## 7. H3 + GIS/PostGIS

### Applicant features
- jurisdiction resolution
- location context
- authority mapping
- spatial eligibility checks
- location-aware approval discovery

### UI
Show:

`Your project falls within: [jurisdiction]`

Optional map layer can visualize the boundary/relationship.

### Do not show
H3 index IDs or technical GIS terminology.

---

## 8. OPA

### Applicant feature
Transparent pre-validation/eligibility rules.

Examples:

- missing required condition
- inconsistent value
- policy requirement not satisfied

### UI
Use an X-Ray / readiness panel.

Each rule result needs:

- state
- explanation
- correction path

OPA is a policy decision component; it should not be presented as the government's final decision unless it actually is the authoritative decision source.

---

## 9. Temporal

### Applicant features
- durable workflow
- reliable stage transitions
- reminders
- time-based events
- resilient long-running application processes

### UI
Timeline / current stage / next event.

### Judge moment
Show the same application after a new workflow event and demonstrate that the UI state remains consistent.

---

## 10. PM4Py

### Applicant feature
Optional process transparency.

Applicant should see:

`Current stage`
`Elapsed time`
`Waiting at`
`Process path`

For advanced transparency:

`Your application is currently waiting for department review.`

### Judge feature
Admin analytics can use process mining to identify bottlenecks. Applicant side should only surface the useful status explanation.

---

## 11. Inspector assignment: skills + availability + jurisdiction

### Applicant feature
Reliable inspection progression.

Possible UI:

`Inspection required`
`Scheduling in progress`
`Scheduled for ...`

### Important privacy rule
Do not expose internal scoring/optimization or private staff information unnecessarily.

---

## 12. Availability

### Applicant feature
If appointments are user-selectable and the authority supports it:

`Choose an available inspection slot`

Otherwise only show confirmed schedule.

---

## 13. AI + tools + database

The crucial loop is:

```text
Applicant question/action
        -> AI understands intent
        -> AI selects specific tool
        -> Backend reads authoritative data
        -> Tool returns structured result
        -> AI explains result
        -> UI performs navigation/action
```

Example:

`Where am I blocked?`

```text
get_current_application
-> validate_application
-> get_missing_documents
-> return blockers
-> assistant explains
-> UI opens blocker
```

---

# End-to-end architecture from applicant perspective

```text
                 APPLICANT
                     |
              Web / Mobile UI
                     |
             Vercel AI SDK
                     |
                 Gemini
                     |
              Tool selection
                     |
      +--------------+---------------+
      |              |               |
   PostgreSQL     RAG/KB          Workflow
      |          pgvector         Temporal
      |          Docling             |
      |          Airweave            |
      |              |               |
      +------+-------+-------+-------+
             |               |
          Neo4j          OPA / Rules
             |               |
          H3/GIS        Process Mining
             |               |
             +-------+-------+
                     |
               Applicant UI
```

The UI is the final compression layer that turns this complex system into understandable actions.
