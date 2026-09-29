# VROOM Removal and Optimization Migration

## 1. Requirement

VROOM is not part of the target solution.

Use Google OR-Tools for inspection assignment and scheduling.

## 2. Repository cleanup

Search for:

```text
vroom
VROOM
vroom-engine
vroom-client
/vroom
```

Remove or replace:

- package dependencies;
- Python modules;
- Docker services;
- environment variables;
- API routes;
- UI labels;
- architecture diagrams;
- README references;
- deployment scripts.

## 3. Migration mapping

Old concept:

```text
optimization request → VROOM → route result
```

New concept:

```text
inspection request
   ↓
candidate eligibility
   ↓
OR-Tools assignment/scheduling
   ↓
assignment + schedule + reasons
```

## 4. Important distinction

This project is primarily optimizing **inspection assignment/scheduling**, not general delivery logistics.

Do not import assumptions from the previous agriculture/logistics project.

For inspections, the primary constraints are:

- legal authority;
- inspector skills;
- jurisdiction;
- availability;
- inspection duration;
- time window;
- SLA;
- workload.

Travel distance is an optimization objective/constraint only where operationally meaningful.

## 5. Acceptance test

After migration:

```bash
# repository search must return no executable dependency/reference
rg -ni "vroom" .
```

Any remaining occurrence must be in a historical migration note only, or be removed before delivery.
