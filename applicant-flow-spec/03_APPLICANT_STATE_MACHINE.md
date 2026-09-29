# Applicant State Machine and Transition Specification

## Principle

The product is a state machine disguised as an intuitive interface.

Never derive user-visible status from page navigation alone. Read status from persistent backend state.

## Project states

```text
NEW
  -> CONTEXT_INCOMPLETE
  -> CONTEXT_READY
  -> DISCOVERY_READY
  -> ACTIVE
  -> COMPLETED
```

## Application states

```text
DRAFT
  -> READY_FOR_SUBMISSION
  -> SUBMISSION_IN_PROGRESS
  -> SUBMITTED
  -> VALIDATION
  -> UNDER_REVIEW
  -> INSPECTION_REQUIRED
  -> INSPECTION_SCHEDULED
  -> CLARIFICATION_REQUIRED
  -> UNDER_REVIEW
  -> DECISION_PENDING
  -> APPROVED
  -> REJECTED
  -> WITHDRAWN
```

## Document states

```text
UPLOADED
  -> EXTRACTING
  -> EXTRACTED
  -> NEEDS_REVIEW
  -> VERIFIED
  -> EXPIRED
  -> REPLACED
```

Only use `VERIFIED` if the backend actually establishes verification.

## User-action priority engine

Every dashboard load should compute an ordered list of applicant-facing actions.

Priority example:

1. blocking submission issue
2. authority clarification
3. authoritative deadline
4. inspection scheduling/action
5. missing document
6. continue draft
7. review recommended item
8. informational update

The highest-priority action should shape the hero area.

## Status transition UX

### DRAFT -> READY

Show readiness progress and remaining blockers.

### READY -> SUBMITTED

Require review/declaration.

### SUBMITTED -> VALIDATION

Show status and keep user informed; do not ask them to act unless necessary.

### VALIDATION -> CLARIFICATION_REQUIRED

Surface action required immediately.

### CLARIFICATION_REQUIRED -> UNDER_REVIEW

After response submission, show confirmation and return to timeline.

### UNDER_REVIEW -> INSPECTION_REQUIRED

Explain that an inspection stage has been entered.

### INSPECTION_REQUIRED -> SCHEDULED

Show appointment when authoritative.

### -> APPROVED

Show artifact and future obligations.

### -> REJECTED

Do not merely show red status. Show official reason/document when available and provide next valid action such as review, correction, appeal/escalation where actually supported.

## Optimistic UI rules

Never optimistically display irreversible government state transitions such as `Approved` or `Submitted` before backend confirmation.

Use optimistic UI only for low-risk local interactions, e.g. sorting, draft field changes and UI preferences.

## Real-time events

Where backend supports real-time updates, applicant UI should react to events such as:

- status changed
- clarification received
- document verification changed
- inspection scheduled
- approval issued
- renewal approaching
- grievance updated

## Event-to-UI mapping

| Event | UI response |
|---|---|
| APPLICATION_SUBMITTED | confirmation + timeline update |
| STATUS_CHANGED | toast + timeline update |
| CLARIFICATION_REQUESTED | action-required banner + notification |
| DOCUMENT_VERIFIED | document badge/status update |
| DOCUMENT_REJECTED | document issue + exact reason |
| INSPECTION_SCHEDULED | appointment card |
| DECISION_ISSUED | decision panel |
| RENEWAL_DUE | renewal card |
| GRIEVANCE_UPDATED | notification + grievance timeline |

## Failure state transitions

If the backend is unavailable:

- preserve locally entered draft where feasible
- show clear status
- avoid duplicate submission
- provide retry
- never fabricate a success response
