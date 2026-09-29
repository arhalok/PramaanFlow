# PM4Py Process Mining

## 1. Purpose

PM4Py is an open-source Python library for process mining and supports process discovery and analysis from event logs. citeturn143985search0turn143985search2

Use it to answer:

- where applications actually wait;
- which activities create bottlenecks;
- where rework occurs;
- which paths deviate from the intended process;
- which departments receive unusually high query volumes;
- where SLA breaches cluster.

## 2. Canonical event model

Each process event needs:

```text
case_id
activity
timestamp
resource
organization
jurisdiction
application_type
status_before
status_after
```

For approval lifecycle mining, `case_id = application_id` is the default.

## 3. Required events

At minimum:

```text
PROJECT_CREATED
APPROVAL_PLAN_GENERATED
APPLICATION_CREATED
DOCUMENT_UPLOADED
DOCUMENT_VALIDATED
APPLICATION_SUBMITTED
SCRUTINY_STARTED
QUERY_RAISED
QUERY_RESPONSE_SUBMITTED
INSPECTION_REQUESTED
INSPECTION_SCHEDULED
INSPECTION_COMPLETED
DECISION_STARTED
APPROVAL_ISSUED
APPLICATION_REJECTED
APPLICATION_WITHDRAWN
SLA_WARNING
SLA_BREACHED
```

## 4. Event log generation

Build an export/analysis view from PostgreSQL:

```sql
select
  application_id as case_id,
  event_type as activity,
  occurred_at as timestamp,
  actor_id as resource,
  authority_id,
  jurisdiction_id
from domain_events
order by application_id, occurred_at;
```

Adapt field names to the final schema.

## 5. Process discovery

Generate a discovered process representation and compare it with intended flow.

Questions to surface:

```text
How many applications follow the happy path?
How often is the same document requested twice?
How often does a query reopen after response?
Which stage has highest median waiting time?
Which approval types create the most rework?
```

## 6. Conformance

Where an intended process model exists, identify deviations such as:

- inspection before prerequisite approval;
- duplicated scrutiny step;
- query raised after an otherwise complete submission;
- unexpected rework loops.

Do not automatically declare deviations as errors. Some may be legitimate exceptions.

## 7. Bottleneck dashboard

Show:

- median processing time;
- p90 processing time;
- waiting time vs active work time;
- query rate;
- rework rate;
- SLA breach rate;
- volume.

Always display sample size.

## 8. Feedback loop

Process mining findings should feed operational improvement:

```text
Event logs
 ↓
PM4Py analysis
 ↓
Bottleneck candidate
 ↓
Human validation
 ↓
Rule/process improvement
 ↓
Versioned process update
```

Do not automatically rewrite government processes based solely on analytics.
