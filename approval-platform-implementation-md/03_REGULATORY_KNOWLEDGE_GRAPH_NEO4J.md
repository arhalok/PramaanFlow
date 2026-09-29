# Regulatory Knowledge Graph — Neo4j

## 1. Purpose

Neo4j should represent regulatory relationships that are awkward to resolve with flat tables alone:

- approval dependencies
- prerequisites
- authority relationships
- jurisdiction hierarchy
- applicability relationships
- document requirements
- inspection requirements
- renewal relationships
- legal-source provenance

Cypher is Neo4j's declarative query language and Neo4j supports indexes including full-text and vector indexes. Use the graph primarily for relationships and traversals; keep transactional records in PostgreSQL. citeturn925300search7turn925300search12

## 2. Node model

Recommended nodes:

```text
(:Approval)
(:Requirement)
(:DocumentType)
(:Authority)
(:Jurisdiction)
(:Industry)
(:ProjectStage)
(:RiskFactor)
(:InspectionType)
(:Scheme)
(:LegalSource)
(:RuleVersion)
```

## 3. Relationship model

```text
(:Approval)-[:REQUIRES]->(:DocumentType)
(:Approval)-[:DEPENDS_ON]->(:Approval)
(:Approval)-[:ISSUED_BY]->(:Authority)
(:Approval)-[:APPLIES_TO]->(:Industry)
(:Approval)-[:VALID_IN]->(:Jurisdiction)
(:Approval)-[:APPLIES_AT_STAGE]->(:ProjectStage)
(:Approval)-[:REQUIRES_INSPECTION]->(:InspectionType)
(:Approval)-[:SUPPORTED_BY]->(:LegalSource)
(:Approval)-[:HAS_RULE_VERSION]->(:RuleVersion)
(:Scheme)-[:APPLIES_TO]->(:Industry)
(:Scheme)-[:VALID_IN]->(:Jurisdiction)
```

## 4. Provenance is mandatory

Every regulatory node/relationship that can affect a decision must contain or point to:

- source document ID
- source locator/page/section
- source URL or URI
- effective-from date
- effective-to date where known
- ingestion timestamp
- version

A graph result without provenance must not be treated as authoritative for a decision.

## 5. Applicability query pattern

Given a normalized project profile, query candidate approvals by sector/stage/jurisdiction and then let the rules engine/OPA evaluate conditions.

Do not encode arbitrary LLM reasoning directly into Neo4j.

Conceptually:

```text
Project
 ↓
Industry + Stage + Jurisdiction
 ↓
Candidate Approvals
 ↓
Applicable approval IDs
 ↓
Dependency traversal
 ↓
Topological ordering / execution groups
```

## 6. Dependency groups

The service must return:

```ts
interface ApprovalDependencyPlan {
  approvals: ApprovalPlanItem[];
  executionGroups: Array<{
    group: number;
    approvalIds: string[];
    parallelizable: boolean;
  }>;
  blockers: Array<{
    approvalId: string;
    blockedBy: string[];
  }>;
}
```

Use a directed acyclic graph for normal dependency chains. Detect cycles and send them to data-quality review instead of silently breaking them.

## 7. Graph synchronization

PostgreSQL remains source of truth for approval records. Build a versioned graph projection from PostgreSQL/regulatory ingestion.

Use an ingestion job:

```text
PostgreSQL regulatory records
       ↓
Projection mapper
       ↓
Neo4j upsert
       ↓
Graph consistency checks
       ↓
Projection version recorded
```

Do not allow manual graph edits to silently diverge from the canonical regulatory store.

## 8. Graph + RAG hybrid retrieval

For a question such as:

> “Why do I need approval X before approval Y?”

Do:

1. graph traversal to identify relationship;
2. retrieve the cited legal source chunk from pgvector;
3. provide the relationship plus supporting source excerpt/citation;
4. let the LLM explain in plain language.

This is a **graph-constrained RAG** pattern.
