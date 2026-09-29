# System Architecture

## 1. Architectural objective

Implement a modular, event-driven system where the applicant portal, department portal, regulatory intelligence, workflow orchestration, optimization, and analytics are separate concerns connected through explicit APIs/events.

## 2. Logical layers

### Experience layer

- Applicant portal
- Department/officer portal
- Government command dashboard
- Compliance center
- Regulatory assistant

### Application layer

- Project service
- Approval/application service
- Document service
- Inspection service
- Compliance service
- Incentive service
- Grievance service

### Decision layer

- Applicability engine
- OPA policy engine
- Regulatory graph queries
- Risk rules
- Eligibility rules
- SLA engine

### Orchestration layer

- Temporal workflows
- Signals/updates
- timers
- retries
- child workflows

### Intelligence layer

- RAG
- document extraction
- anomaly detection
- process mining
- optimization

### Data layer

- PostgreSQL/PostGIS/pgvector
- Neo4j
- object storage for documents
- event/audit store

## 3. Request flow

For a new project:

```text
POST /projects
   ↓
Resolve location → H3 cell → jurisdiction
   ↓
Build normalized ProjectContext
   ↓
Call applicability engine
   ↓
OPA evaluates policy constraints
   ↓
Neo4j resolves prerequisites/dependencies
   ↓
Persist ApprovalPlan
   ↓
Return plan + citations + explanations
```

## 4. Event bus abstraction

Do not make the product tightly coupled to a single broker. Create an internal event interface.

Example:

```ts
export type DomainEvent<T> = {
  id: string;
  type: string;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  actorId?: string;
  correlationId: string;
  causationId?: string;
  schemaVersion: number;
  payload: T;
};
```

Use an outbox pattern in PostgreSQL so business data and emitted event intent are committed atomically.

## 5. Service boundaries

Do not create a microservice for every database table. Keep the number of deployable services small.

Recommended initial deployment:

```text
web
api
workflow-worker
optimizer
process-mining
neo4j
postgres
opa
object-storage
observability
```

The RAG and document functionality can start inside dedicated modules/services and be split only when operationally justified.

## 6. Idempotency

Every write endpoint that may be retried must accept an idempotency key.

Examples:

- submit application
- upload document registration
- create inspection
- schedule inspection
- issue decision
- raise grievance

Temporal activities must also be safe to retry.

## 7. Auditability

Every important state transition creates an `audit_event` with:

- actor
- action
- entity
- before state
- after state
- timestamp
- source
- workflow ID/run ID
- policy version
- rule version
- document version
- correlation ID

## 8. Failure behavior

Every integration needs one of:

- success
- retryable failure
- terminal failure
- manual review required

Never convert external failure into success with fake values.

## 9. Security boundary

The server, never the browser, must enforce:

- tenant/organization scope
- department scope
- jurisdiction scope
- applicant ownership
- role permissions
- policy decisions
- document access

OPA should be used as a policy decision point for authorization and business-policy checks where useful. It should not replace ordinary database integrity constraints.

## 10. Acceptance criteria

- Services can be started locally with one documented command.
- Health endpoints exist for each deployable service.
- Correlation IDs flow through API → Temporal → optimizer → DB.
- Audit records exist for state transitions.
- No service calls the database with undocumented ad-hoc SQL from the frontend.
