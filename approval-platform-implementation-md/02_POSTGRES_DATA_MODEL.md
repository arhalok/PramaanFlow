# PostgreSQL / PostGIS / pgvector Data Model

## 1. PostgreSQL is the system of record

PostgreSQL stores transactional state. Neo4j is the specialized regulatory knowledge graph, not a replacement for transactional state. Vector embeddings are stored in PostgreSQL using pgvector.

pgvector supports exact and approximate nearest-neighbor search, including HNSW and IVFFlat indexes. Prefer HNSW for the initial semantic retrieval implementation when query speed/recall justify it. citeturn925300search0

## 2. Core tables

### organizations

```text
id
name
type
created_at
```

### users

```text
id
organization_id
role
name
email
status
created_at
```

### business_entities

Canonical identity for an enterprise/unit.

```text
id
organization_id
legal_name
entity_type
pan_hash
registration_identifiers_json
verification_status
verified_at
created_at
updated_at
```

Do not store sensitive identifiers as plaintext unless there is a justified need. Prefer encrypted/hashed representations according to use.

### projects

```text
id
business_entity_id
name
sector
sub_sector
stage
investment_amount
employment_count
production_capacity
location_geom
h3_cell
jurisdiction_id
risk_profile_json
status
created_at
updated_at
```

### jurisdictions

```text
id
parent_id
code
name
type
geometry
level
source_reference
valid_from
valid_to
```

### authorities

```text
id
jurisdiction_id
name
agency_type
contact_metadata
```

### approvals

Catalog of approval types.

```text
id
code
name
sector_scope
stage_scope
authority_id
renewal_period_days
statutory_sla_days
inspection_required
status
source_document_id
rule_version
valid_from
valid_to
```

### approval_rules

Structured applicability conditions.

```text
id
approval_id
rule_code
priority
conditions_json
outcome
legal_basis
source_document_id
source_locator
rule_version
valid_from
valid_to
```

### approval_dependencies

```text
id
approval_id
depends_on_approval_id
dependency_type
condition_json
source_document_id
source_locator
```

### project_approval_plan_items

Instance-specific applicability result.

```text
id
project_id
approval_id
applicability_status
reason_code
reason_explanation
source_rule_id
risk_level
sequence_group
blocking
created_at
```

### applications

```text
id
project_id
approval_id
status
submission_reference
authority_id
started_at
submitted_at
completed_at
current_owner_type
current_owner_id
sla_due_at
workflow_id
workflow_run_id
```

### application_documents

```text
id
application_id
document_type
required
status
verification_status
current_document_version_id
```

### document_versions

```text
id
document_id
object_uri
sha256
mime_type
size_bytes
version_number
uploaded_by
uploaded_at
extracted_data_json
validation_result_json
parser_version
```

### verified_facts

Reusable claims extracted and verified from authoritative documents.

```text
id
business_entity_id
fact_type
fact_key
value_json
source_document_version_id
verification_method
verified_at
expires_at
status
```

### queries

```text
id
application_id
raised_by
query_type
question
required_action
due_at
status
resolved_at
```

### inspections

```text
id
application_id
project_id
inspection_type
location_geom
h3_cell
jurisdiction_id
required_skills_json
priority
sla_due_at
duration_minutes
time_window_start
time_window_end
status
assigned_inspector_id
scheduled_start
scheduled_end
```

### inspectors

```text
id
authority_id
home_location_geom
home_h3_cell
jurisdiction_ids_json
skills_json
working_hours_json
availability_status
max_daily_inspections
```

### inspector_availability

```text
id
inspector_id
date
available_from
available_to
status
reason
```

### compliance_obligations

```text
id
project_id
approval_id
due_at
renewal_required
renewal_window_days
status
source_application_id
```

### incentives

```text
id
code
name
jurisdiction_id
sector_scope
valid_from
valid_to
source_document_id
```

### incentive_rules

```text
id
incentive_id
rule_code
conditions_json
outcome
source_document_id
source_locator
rule_version
```

### grievances

```text
id
application_id
category
description
priority
status
assigned_authority_id
sla_due_at
escalated_at
resolved_at
```

### domain_events

```text
id
aggregate_type
aggregate_id
event_type
schema_version
occurred_at
correlation_id
causation_id
actor_id
payload_json
```

### audit_events

Immutable append-oriented audit log.

```text
id
actor_id
action
entity_type
entity_id
before_json
after_json
policy_version
rule_version
workflow_id
workflow_run_id
correlation_id
created_at
```

## 3. RAG tables

### knowledge_sources

```text
id
source_name
source_type
canonical_uri
authority
jurisdiction
valid_from
valid_to
retrieved_at
checksum
status
```

### knowledge_documents

```text
id
knowledge_source_id
external_id
title
document_type
publication_date
effective_from
effective_to
language
parser_version
```

### knowledge_chunks

```text
id
knowledge_document_id
chunk_index
content
content_tsv
embedding vector(<MODEL_DIM>)
page_number
section_path
source_locator
metadata_json
```

Add HNSW on `embedding` and conventional indexes on jurisdiction, authority, effective date, document type and other filter dimensions.

## 4. GIS rules

Use PostGIS geometry for authoritative geometry. Use H3 as a derived spatial index/aggregation key.

Store both:

```text
location_geom geometry(Point, 4326)
h3_cell text
```

Never treat an H3 cell as the official legal boundary. Use it for fast spatial indexing, clustering, and analytics; perform final jurisdiction intersection/containment against authoritative geometries.

## 5. Migration requirements

Every schema change must have:

- migration
- rollback or documented irreversible migration note
- seed fixture if needed
- test fixture
- data backfill strategy if existing records are affected
