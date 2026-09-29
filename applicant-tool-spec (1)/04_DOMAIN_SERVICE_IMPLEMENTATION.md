# Domain Service Implementation

Tools are adapters. They should call stable domain services.

Recommended layers:

```text
AI Tool
 ↓
Tool Executor
 ↓
Domain Service
 ↓
Repository / External Adapter
 ↓
Data / Infrastructure
```

Do NOT put SQL, Neo4j Cypher, OPA policies, Docling execution, or Temporal logic directly inside the tool definition.

## Services

```text
ApplicantService
ProjectService
LocationService
JurisdictionService
ApprovalService
KnowledgeService
DependencyService
DocumentService
ApplicationService
ValidationService
WorkflowService
InspectionService
NotificationService
GrievanceService
ComplianceService
SearchService
```

## Repositories / adapters

```text
PostgresApplicantRepository
PostgresProjectRepository
PostgresApplicationRepository
PostgresDocumentRepository

PgVectorKnowledgeRepository
AirweaveKnowledgeAdapter
Neo4jDependencyRepository
H3JurisdictionAdapter
PostgisSpatialRepository
OPAValidationAdapter
DoclingDocumentAdapter
TemporalWorkflowAdapter
AvailabilityAdapter
```

## Example

```ts
class ApprovalService {
  async discover(projectId: string, ctx: Context) {
    const project = await this.projects.get(projectId);
    const location = await this.locations.get(project.locationId);
    const jurisdiction = await this.jurisdiction.resolve(location);

    const candidates =
      await this.graph.findApprovalCandidates(project, jurisdiction);

    const policyResults =
      await this.opa.evaluateApprovals(project, jurisdiction, candidates);

    return this.rankAndGroup(policyResults);
  }
}
```

## Important

The exact stack can differ from this sample.

What matters is separation of:

- AI orchestration
- tool contracts
- business logic
- data access
- infrastructure

## Rule of thumb

Gemini decides:

> "Which operation should happen?"

Domain services decide:

> "How is it correctly performed?"

Repositories decide:

> "Where does the authoritative data come from?"

UI decides:

> "How should the result be presented?"
