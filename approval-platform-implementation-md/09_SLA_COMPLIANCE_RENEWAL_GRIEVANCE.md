# SLA + Compliance + Renewals + Queries + Grievance

## 1. SLA engine

The system must distinguish:

- statutory SLA;
- internal target;
- elapsed business time where law specifies it;
- paused time when legally allowed;
- applicant-caused waiting time where policy defines it;
- actual breach.

Never subtract time informally in frontend JavaScript.

## 2. SLA record

```ts
interface SlaState {
  startedAt: string;
  dueAt: string;
  warningAt?: string;
  pausedAt?: string;
  accumulatedPauseMs: number;
  status: "ON_TRACK" | "AT_RISK" | "BREACHED" | "PAUSED" | "COMPLETED";
  ruleVersion: string;
}
```

## 3. SLA computation

The SLA service should receive a versioned rule:

```text
clock_type
calendar
start_event
stop_event
pause_events
warning_threshold
escalation_policy
```

This makes the engine adaptable to different approval regimes.

## 4. Applicant queries

Query lifecycle:

```text
RAISED
 ↓
ACKNOWLEDGED
 ↓
IN_PROGRESS
 ↓
RESPONSE_SUBMITTED
 ↓
UNDER_REVIEW
 ↓
RESOLVED
```

Temporal should pause/resume the relevant workflow only according to explicit policy.

## 5. Renewal engine

When approval is issued:

```text
Approval issued
 ↓
Create compliance obligation
 ↓
Compute renewal due date
 ↓
Schedule reminder windows
 ↓
Create renewal application task
```

Example windows:

```text
T-90
T-60
T-30
T-7
T+0
```

Do not hard-code these windows globally; make them rule/config driven.

## 6. Compliance center

Show:

- active approvals;
- expiry dates;
- obligations;
- overdue items;
- evidence/documents;
- next action;
- responsible party.

## 7. Grievance workflow

A grievance must link to the underlying application/project where possible.

```text
Applicant grievance
 ↓
Classification
 ↓
Policy-based routing
 ↓
SLA clock
 ↓
Department response
 ↓
Resolution
 ↓
Escalation if permitted
```

## 8. Escalation

Escalation should be deterministic:

```text
IF SLA breached
AND escalation_policy_allows
AND no valid pause
THEN escalate
```

Record the policy version and trigger event.

## 9. Government bottleneck analytics

Compute metrics by:

- department;
- approval type;
- jurisdiction;
- process stage;
- query category;
- inspection stage.

Do not label a department as “bad” based on a small sample. Show counts, medians, percentiles and data coverage.
