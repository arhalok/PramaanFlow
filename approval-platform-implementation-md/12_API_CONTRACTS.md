# API Contracts and Shared Types

## 1. API style

Use REST/HTTP for ordinary request/response interactions and Temporal/event mechanisms for long-running workflows.

All API responses should be versionable.

## 2. Project

```http
POST /api/projects
GET  /api/projects/:projectId
PATCH /api/projects/:projectId
```

Project create payload:

```ts
interface CreateProjectRequest {
  businessEntityId: string;
  name: string;
  sector: string;
  subSector?: string;
  stage: string;
  investmentAmount?: number;
  employmentCount?: number;
  productionCapacity?: number;
  location: {
    latitude: number;
    longitude: number;
  };
}
```

## 3. Applicability

```http
POST /api/projects/:projectId/approval-plan/generate
GET  /api/projects/:projectId/approval-plan
```

Response:

```ts
interface ApprovalPlanResponse {
  projectId: string;
  jurisdiction: JurisdictionSummary;
  approvals: ApprovalPlanItem[];
  executionGroups: ExecutionGroup[];
  blockers: Blocker[];
  generatedAt: string;
  ruleVersion: string;
  graphProjectionVersion?: string;
}
```

## 4. Applications

```http
POST /api/applications
GET  /api/applications/:id
POST /api/applications/:id/submit
POST /api/applications/:id/withdraw
POST /api/applications/:id/query-response
```

## 5. Documents

```http
POST /api/documents/upload
POST /api/documents/:id/validate
GET  /api/applications/:id/documents
GET  /api/documents/:id/evidence
```

## 6. Inspection

```http
POST /api/inspections
POST /api/inspections/optimize
GET  /api/inspections/:id
POST /api/inspections/:id/complete
```

Optimizer request:

```ts
interface InspectionOptimizationRequest {
  inspectionIds: string[];
  inspectorIds?: string[];
  planningWindow: {
    start: string;
    end: string;
  };
}
```

## 7. RAG

```http
POST /api/rag/search
POST /api/rag/answer
```

## 8. Compliance

```http
GET /api/projects/:projectId/compliance
GET /api/projects/:projectId/renewals
POST /api/compliance/:id/complete
```

## 9. Analytics

```http
GET /api/analytics/process/summary
GET /api/analytics/bottlenecks
GET /api/analytics/sla
```

## 10. Explain endpoint

Create one cross-cutting evidence endpoint:

```http
GET /api/explain/:entityType/:entityId
```

It should aggregate:

- rule decision;
- policy decision;
- graph relationship;
- source document citations;
- workflow state history;
- audit events;
- optimization reasoning metadata where relevant.

## 11. Error contract

```ts
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  correlationId: string;
}
```

Never expose stack traces to clients.
