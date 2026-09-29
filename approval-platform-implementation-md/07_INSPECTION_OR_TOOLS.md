# Inspector Assignment & Inspection Scheduling — Google OR-Tools

## 1. Explicit removal of VROOM

**Do not use VROOM anywhere.**

Remove any:

- VROOM dependency;
- VROOM API calls;
- VROOM Docker image;
- VROOM route/optimization service;
- VROOM references from docs/UI/comments;
- fallback to VROOM.

Inspection assignment is handled by **Google OR-Tools**.

## 2. Problem definition

The system receives:

- pending inspections;
- eligible inspectors;
- inspector skills;
- jurisdiction permissions;
- availability windows;
- inspection duration;
- location;
- time windows;
- statutory/SLA deadlines;
- priority/risk;
- daily workload limits.

The optimizer produces:

- inspector assignment;
- inspection start/end time;
- workload distribution;
- optional travel sequence.

## 3. Inspector skills

Represent required and possessed skills as normalized identifiers.

Example:

```json
{
  "inspectorId": "I-12",
  "skills": ["FIRE", "ELECTRICAL"],
  "jurisdictions": ["J-12", "J-13"],
  "maxDailyInspections": 5
}
```

Inspection:

```json
{
  "inspectionId": "INS-22",
  "requiredSkills": ["FIRE"],
  "jurisdictionId": "J-12",
  "durationMinutes": 90,
  "timeWindow": {
    "start": "2026-09-30T10:00:00+05:30",
    "end": "2026-09-30T15:00:00+05:30"
  },
  "slaDueAt": "2026-10-01T17:00:00+05:30"
}
```

## 4. Constraints

The optimizer must enforce, not merely score:

### Hard constraints

- inspector must be active;
- inspector must possess all required skills;
- inspector must be authorized for jurisdiction;
- inspector must be available;
- inspection must fit within time window;
- no overlapping inspections for an inspector;
- daily inspection cap must not be exceeded;
- mandatory inspection deadline must be respected where feasible.

### Soft objectives

Minimize a weighted objective such as:

```text
travel_cost
+ SLA_lateness_penalty
+ workload_imbalance
+ unnecessary cross-jurisdiction movement
+ preference_penalty
```

Keep objective weights configurable.

## 5. Time model

Normalize all scheduling internally to a timezone-aware representation.

Do not mix local naive timestamps and UTC timestamps.

For optimization, convert timestamps into integer time slots from a fixed planning horizon, then convert the result back to ISO-8601 timestamps.

## 6. Jurisdiction

Eligibility check:

```text
inspection.jurisdictionId ∈ inspector.jurisdictionIds
```

For spatial projects, calculate the project's authoritative jurisdiction using PostGIS first. H3 may accelerate candidate discovery, but the final jurisdiction must come from authoritative geometry/policy.

## 7. Availability

Availability should be modeled as:

```text
Inspector
  ├── working calendar
  ├── approved leave
  ├── blocked slots
  └── ad-hoc availability
```

Build an `inspector_availability` table rather than encoding weekly availability directly into frontend code.

## 8. Google OR-Tools model

Start with CP-SAT for inspector-to-inspection assignment and time-slot scheduling. If route sequencing is required, use the OR-Tools routing capabilities with the same eligibility/time-window constraints.

Do not optimize before filtering invalid candidates.

Pipeline:

```text
Pending inspections
      ↓
Candidate filtering
      ↓
Skill check
      ↓
Jurisdiction check
      ↓
Availability check
      ↓
Time-window feasibility
      ↓
OR-Tools model
      ↓
Assignment
      ↓
Persist schedule
      ↓
Emit InspectionScheduled
```

## 9. Common inspection planning

When multiple inspection types are legally and operationally combinable, group them by:

- same project/facility;
- compatible inspection types;
- compatible authorities;
- common time window;
- qualified multi-skilled inspector availability.

Never merge inspections merely because they are geographically close. The legal/departmental compatibility rule must permit it.

## 10. Explainable optimization

Return:

```ts
interface OptimizationResult {
  assignments: Assignment[];
  objectiveValue: number;
  constraintsApplied: string[];
  infeasibleReasons?: string[];
  generatedAt: string;
}
```

For a judge-facing UI, show:

> “Inspector A assigned because they have FIRE skill, are authorized for this jurisdiction, are available 11:00–14:00, and this slot avoids SLA breach.”

That explanation should come from structured metadata.

## 11. Infeasibility handling

If no feasible solution exists:

1. return `INFEASIBLE`;
2. identify blocking constraint(s);
3. show alternatives such as next available date or eligible inspector shortage;
4. create a human-review task when required.

Do not silently relax statutory constraints.

## 12. Test cases

Create deterministic fixtures covering:

- one inspection / one inspector;
- skill mismatch;
- jurisdiction mismatch;
- unavailable inspector;
- overlapping slots;
- multiple inspectors with different skills;
- urgent SLA inspection;
- common inspection candidate;
- infeasible schedule.
