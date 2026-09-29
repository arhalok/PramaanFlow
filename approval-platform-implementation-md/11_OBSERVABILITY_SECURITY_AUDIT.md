# Observability, Security and Audit

## 1. Open-source observability

If the project must remain open-source-only, do not use AWS X-Ray as a required platform dependency. Use:

- OpenTelemetry for traces/metrics/log correlation;
- Jaeger for distributed trace visualization;
- Prometheus for metrics;
- Grafana for dashboards.

AWS X-Ray itself provides request tracing, exception collection and profiling, but it is an AWS managed technology rather than an open-source-only dependency. citeturn143985search1

## 2. Trace flow

Propagate a correlation/trace context through:

```text
Browser
 ↓
API
 ↓
Temporal workflow
 ↓
Activity
 ↓
OPA
 ↓
PostgreSQL / Neo4j
 ↓
Optimizer / RAG
```

Record:

- trace ID;
- span ID;
- workflow ID;
- application ID;
- project ID;
- actor ID where permitted.

## 3. Metrics

### Platform

- API latency;
- error rate;
- workflow failures;
- queue/worker latency;
- DB latency;
- graph query latency;
- vector retrieval latency;
- optimizer latency.

### Business

- applications created;
- approval cycle time;
- incomplete submission rate;
- query rate;
- SLA breach rate;
- inspection lead time;
- renewal completion rate;
- grievance resolution time.

## 4. Security model

Roles should include at least:

```text
APPLICANT
BUSINESS_ADMIN
DEPARTMENT_OFFICER
INSPECTOR
DEPARTMENT_ADMIN
SYSTEM_ADMIN
AUDITOR
```

Every protected API checks:

1. authentication;
2. organization/tenant boundary;
3. role permission;
4. jurisdiction permission;
5. resource ownership/relationship;
6. OPA policy where required.

## 5. Document security

Documents are sensitive assets.

Implement:

- private object storage;
- signed short-lived download URLs;
- MIME/type validation;
- checksum;
- access audit;
- version retention;
- deletion/retention policy.

## 6. Audit requirements

Audit these events at minimum:

- rule decision;
- policy decision;
- document validation result;
- application status change;
- query creation/resolution;
- inspection assignment;
- schedule change;
- approval decision;
- renewal creation;
- grievance escalation.

## 7. Immutable evidence mindset

For every consequential action answer:

```text
WHO?
WHAT?
WHEN?
ON WHICH RECORD?
BASED ON WHICH RULE?
BASED ON WHICH DOCUMENT/SOURCE?
UNDER WHICH POLICY VERSION?
```

This should be visible to auditors/developers through an “Explain / Evidence” panel.
