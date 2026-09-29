# Frontend + Judge Demo Specification

## 1. Objective

The UI should make the architecture understandable to a technically strong judge who is new to the system.

The frontend should visibly prove that the backend is doing real orchestration.

## 2. Applicant home

Show:

```text
My Projects
Active Applications
Required Approvals
Documents Needed
Upcoming Expiries
Queries Awaiting Response
```

## 3. Project onboarding

Form sections:

1. business/entity;
2. industry/sector;
3. investment/capacity;
4. location map;
5. employment;
6. project stage.

On submit, show a short deterministic pipeline animation:

```text
Profile
 → Jurisdiction
 → Rules
 → Graph
 → Approval Plan
```

Do not fake progress timers that pretend real backend work happened.

## 4. Approval command center

The main screen should show a DAG/timeline:

```text
                Project Start
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Pollution        Fire         Building
       │             │             │
       └───────┬─────┘             │
               ↓                   ↓
          Factory Approval ←───────┘
```

Use clear labels:

- Ready
- Waiting
- In progress
- Query raised
- Inspection
- Approved
- Blocked

## 5. Evidence panel

Every approval should have an “Explain” action.

Open panel:

```text
WHY IS THIS REQUIRED?

Rule: R-102
Source: notification XYZ
Section: 4.2
Effective: 2026-01-01

Dependency:
Requires Building Approval

Required document:
Factory Layout
```

The panel must use stored evidence, not freshly generated unsupported text.

## 6. Document center

Show a checklist with state:

```text
✓ Verified and reusable
✓ Valid but needs latest version
⚠ Validation issue
○ Not uploaded
```

When a document is uploaded, show extracted fields and validation results.

## 7. Department dashboard

A department officer should see:

```text
My Queue
Due Today
SLA At Risk
SLA Breached
Queries
Inspections
```

Clicking an application shows its complete lifecycle timeline.

## 8. Inspector board

Show:

```text
Pending inspections
Eligible inspectors
Scheduled inspections
Infeasible items
```

Display the optimizer explanation:

```text
Assigned to: Inspector 7

Skill match: FIRE ✓
Jurisdiction: J-12 ✓
Availability: 11:00–14:00 ✓
SLA deadline: 17:00 ✓
```

## 9. Map

Use the map to show:

- projects;
- jurisdiction boundaries;
- H3 cells;
- inspections;
- inspector locations if legally appropriate;
- clusters/hotspots.

Do not expose private inspector location data to applicant users.

## 10. Government command view

Show:

```text
Applications
SLA health
Bottlenecks
Inspection workload
Query volume
Approval cycle time
```

Use drill-down rather than dozens of charts.

## 11. Demo sequence

Recommended judge flow:

### Scene 1 — Project creation

Create a synthetic project and show location/jurisdiction resolution.

### Scene 2 — Approval plan

Show the generated approvals and dependency graph.

### Scene 3 — Explain

Open one approval and prove source/rule/dependency evidence.

### Scene 4 — Documents

Upload a sample certificate, extract fields, validate, and show verified fact reuse.

### Scene 5 — Workflow

Submit the application and show Temporal-driven state.

### Scene 6 — Query

Trigger a real query state, submit a response, and resume workflow.

### Scene 7 — Inspection optimization

Show inspector candidate filtering and OR-Tools assignment using skills, jurisdiction, availability, time window and SLA.

### Scene 8 — Outcome

Complete inspection, issue approval fixture, create renewal obligation.

### Scene 9 — Analytics

Show process mining bottleneck analytics from the event log.

## 12. UI trust rules

Never show:

- invented legal references;
- fake confidence percentages;
- fake government statuses;
- fake “real-time” API state.

Synthetic records must be labeled `DEMO/SYNTHETIC`.
