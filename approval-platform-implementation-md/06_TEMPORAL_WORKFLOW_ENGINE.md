# Temporal Workflow Engine

## 1. Purpose

Temporal owns long-running, stateful orchestration: waiting for departments, timers, applicant responses, inspection completion, approvals and escalations.

Temporal workflows advance through workflow tasks; activities execute external work; timers and signals cause new workflow tasks. Child workflows can decompose larger workflows. citeturn925300search1turn925300search6

## 2. Parent workflow

Implement:

```text
ProjectApprovalLifecycleWorkflow(projectId)
```

It should:

1. load project context;
2. calculate applicable approvals;
3. create approval-plan items;
4. determine execution groups;
5. start child workflows for independent approval paths;
6. wait for blockers/signals;
7. coordinate inspections;
8. handle department queries;
9. evaluate completion;
10. create compliance obligations;
11. schedule renewal reminders.

## 3. Child workflow per approval

```text
ApprovalApplicationWorkflow(applicationId)
```

States:

```text
DRAFT
→ DOCUMENT_COLLECTION
→ DOCUMENT_VALIDATION
→ READY_FOR_SUBMISSION
→ SUBMITTED
→ UNDER_SCRUTINY
→ QUERY_RAISED
→ WAITING_FOR_APPLICANT
→ INSPECTION_PENDING
→ INSPECTION_SCHEDULED
→ INSPECTION_COMPLETED
→ DECISION_PENDING
→ APPROVED / REJECTED / WITHDRAWN
```

Represent state transitions explicitly. Do not encode state merely as UI flags.

## 4. Signals/updates

Useful workflow inputs:

- `documentUploaded`
- `queryResponseSubmitted`
- `inspectionCompleted`
- `departmentDecisionRecorded`
- `applicantWithdrawn`
- `approvalDataCorrected`

Each signal/update must validate actor permissions and payload schema before changing state.

## 5. SLA timers

For every application:

```text
submitted_at
statutory_sla_days
sla_due_at
warning_at
breach_at
```

Temporal timers must trigger:

- applicant warning;
- department reminder;
- escalation where policy allows;
- analytics event.

SLA configuration must be sourced from versioned regulatory data, not hard-coded in frontend code.

## 6. Parallel workflows

For independent approvals:

```text
Parent
 ├── Approval A child
 ├── Approval B child
 ├── Approval C child
 └── Approval D child
```

Do not force all approvals into one sequential chain when the dependency graph says they can run in parallel.

## 7. Retry policy

Activities calling external systems should use bounded retries and idempotency.

Do not retry permanent validation failures.

Classify errors:

```text
TRANSIENT
RATE_LIMITED
AUTHENTICATION
VALIDATION
NOT_FOUND
POLICY_DENIED
SYSTEM_FAILURE
MANUAL_REVIEW
```

## 8. Compensation

If an action cannot be rolled back, record a compensating state transition instead of pretending the previous action never occurred.

## 9. Workflow history → analytics

Do not use Temporal event history directly as the only analytics format. Emit normalized domain events to PostgreSQL/event storage for PM4Py.

## 10. Acceptance tests

Test at minimum:

- parallel approvals remain parallel;
- one failed approval does not incorrectly fail unrelated approvals;
- prerequisite completion unlocks the dependent approval;
- query response resumes the workflow;
- SLA warning and breach timers fire;
- duplicate signals are idempotent;
- retries do not create duplicate submissions;
- historical workflow state remains reproducible from event/audit data.
