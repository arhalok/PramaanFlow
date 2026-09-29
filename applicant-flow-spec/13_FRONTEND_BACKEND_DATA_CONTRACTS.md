# Applicant Frontend ↔ Backend Contract Map

## Purpose

The frontend must connect to the real system without hard-coded demo logic.

This document describes the conceptual contracts. Adapt names to the actual project's API conventions.

## 1. Project context

### Read

```text
GET /api/projects/:projectId
```

Returns:

- project identity
- business context
- location
- jurisdiction
- project stage
- active application summary

## 2. Location resolution

```text
POST /api/location/resolve
```

Input:

- latitude/longitude OR address

Output:

- normalized location
- administrative hierarchy
- jurisdiction
- supporting spatial metadata

Frontend should display only human-readable geography.

## 3. Approval discovery

```text
POST /api/approvals/discover
```

Input:

- project context
- location
- relevant business attributes

Output:

```text
approvalId
name
applicability
reason
status
requirements
jurisdiction
authority
dependencies
sources
```

## 4. Approval details

```text
GET /api/approvals/:approvalId
```

Include:

- overview
- requirements
- documents
- prerequisites
- dependency references
- official sources
- known process stages

## 5. Dependency graph

```text
GET /api/projects/:projectId/approval-graph
```

Frontend representation:

```text
nodes[]
edges[]
status
relationshipReason
```

The UI should gracefully fall back to an ordered list.

## 6. Application

```text
POST /api/applications
GET /api/applications/:id
PATCH /api/applications/:id
```

Application state must be persistent.

## 7. Requirements

```text
GET /api/applications/:id/requirements
```

Each requirement should ideally include:

```text
requirementId
type
label
status
blocking
reason
source
correctionTarget
```

## 8. X-Ray / validation

```text
POST /api/applications/:id/validate
```

Return structured findings:

```text
severity
code
message
field/document target
suggestedFix
source
```

## 9. Documents

```text
GET /api/documents
POST /api/documents
GET /api/documents/:id
```

Document object should include:

- id
- type
- status
- createdAt
- expiryAt if known
- verification state
- extracted metadata
- usage references

## 10. Application document attachment

```text
POST /api/applications/:id/documents
```

Support reuse by document ID.

## 11. Submission

```text
POST /api/applications/:id/submit
```

Use idempotency protection so repeated clicks do not cause duplicate submission.

UI must wait for authoritative response before showing final submission state.

## 12. Timeline

```text
GET /api/applications/:id/timeline
```

Return applicant-safe milestones rather than raw internal events where possible.

## 13. Clarification

```text
GET /api/applications/:id/clarifications
POST /api/applications/:id/clarifications/:clarificationId/respond
```

## 14. Inspection

```text
GET /api/applications/:id/inspection
GET /api/inspection/availability
```

Only expose availability if the backend actually supports selection.

## 15. Notifications

```text
GET /api/notifications
PATCH /api/notifications/:id/read
```

Notifications should contain deep-link targets.

## 16. Renewals

```text
GET /api/projects/:projectId/renewals
```

## 17. Grievance

```text
POST /api/grievances
GET /api/grievances/:id
```

## 18. Knowledge search

```text
POST /api/knowledge/search
```

Return source metadata.

## 19. AI assistant

The assistant should invoke tools instead of directly assembling arbitrary UI state.

Conceptual chain:

```text
UI context
 -> assistant endpoint
 -> intent/tool selection
 -> backend tool
 -> authoritative data
 -> structured response
 -> assistant explanation
 -> UI action
```

## 20. Frontend caching strategy

Cache relatively stable data such as:

- static approval metadata
- source descriptions
- document metadata where appropriate

Revalidate frequently changing data:

- application status
- notifications
- inspection schedule
- clarification state

Do not serve stale application state as current without indicating it.

## 21. Error contract

Prefer structured backend errors:

```text
code
message
field
recoverable
retryable
referenceId
```

Frontend converts them into clear applicant language.

## 22. Loading contract

Every asynchronous surface should explicitly represent:

`idle -> loading -> success -> empty/error`

Do not rely on undefined/null alone to represent loading.

## 23. Auditability

For important actions capture:

- user
- project
- application
- action
- timestamp
- result/reference

The applicant need not see the audit log, but the architecture should preserve it for trust and debugging.
