# Data Models & Database Schemas
## Relational (PostgreSQL/PostGIS), Graph (Neo4j), and Vector (pgvector) Data Layer

> **Document Version:** 2.0.0  
> **Target Audience:** Database Administrators, Backend Engineers, and Data Architects  
> **Status:** Authoritative Specification  

---

## 1. Relational Schema (PostgreSQL 15+)

All primary transactions, enterprise profiles, application states, document records, and statutory event logs reside in PostgreSQL.

### 1.1 Complete Entity Relationship DDL

```sql
-- Enable PostGIS and UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Enterprises (Legal entity owning the projects)
CREATE TABLE enterprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cin_or_llpin VARCHAR(21) UNIQUE NOT NULL, -- Corporate Identification Number
    legal_name VARCHAR(255) NOT NULL,
    pan VARCHAR(10) NOT NULL,
    authorized_signatory_name VARCHAR(255) NOT NULL,
    authorized_signatory_email VARCHAR(255) NOT NULL,
    authorized_signatory_phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects (The Computational Digital Twin of the Industrial Unit)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL, -- e.g., 'Pharmaceuticals', 'Food Processing'
    sub_sector VARCHAR(255),
    pollution_category VARCHAR(10) CHECK (pollution_category IN ('WHITE', 'GREEN', 'ORANGE', 'RED')),
    investment_crores NUMERIC(10, 2) NOT NULL,
    capacity_value NUMERIC(12, 2) NOT NULL,
    capacity_unit VARCHAR(50) NOT NULL, -- 'TPD', 'KL/Day', 'MW'
    employment_target INTEGER NOT NULL,
    water_required_kld NUMERIC(10, 2),
    power_required_kw NUMERIC(10, 2),
    address TEXT NOT NULL,
    cadastral_survey_no VARCHAR(100),
    h3_index VARCHAR(15), -- Uber H3 Resolution 9 index string
    location_point GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'PLANNING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_enterprise ON projects(enterprise_id);
CREATE INDEX idx_projects_geom ON projects USING GIST(location_point);
CREATE INDEX idx_projects_h3 ON projects(h3_index);

-- 3. Approvals Catalog (Statutory universe of clearances)
CREATE TABLE approvals_catalog (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'MPCB-CTE', 'FIRE-NOC'
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(50) NOT NULL,
    department VARCHAR(255) NOT NULL,
    statutory_act TEXT NOT NULL,
    section_reference VARCHAR(100) NOT NULL,
    sla_days INTEGER NOT NULL, -- Statutory SLA under Right to Services Act
    category VARCHAR(50) NOT NULL -- 'PRE_ESTABLISHMENT', 'PRE_OPERATION', 'INCENTIVE'
);

-- 4. Applications (Submitted clearances undergoing government review)
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'APP-MPCB-CTE-2026-0812'
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    approval_id VARCHAR(50) NOT NULL REFERENCES approvals_catalog(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    sla_days_remaining INTEGER,
    assigned_officer_name VARCHAR(255),
    assigned_officer_designation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_status ON applications(status);

-- 5. Clarification Queries (Department-to-Applicant query desk)
CREATE TABLE clarification_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    officer_name VARCHAR(255) NOT NULL,
    legal_basis TEXT NOT NULL,
    query_text TEXT NOT NULL,
    raised_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    days_to_respond INTEGER DEFAULT 7,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESPONDED', 'CLOSED')),
    applicant_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_queries_application ON clarification_queries(application_id);

-- 6. Document Vault (Cross-clearance zero-retyping document store)
CREATE TABLE vault_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'MIDC_LEASE_DEED', 'EIA_REPORT', 'FIRE_SAFETY_PLAN'
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_uri TEXT NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    docling_extracted_json JSONB, -- Structured tables and key-value pairs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vault_enterprise ON vault_documents(enterprise_id);
CREATE INDEX idx_vault_hash ON vault_documents(sha256_hash);

-- 7. Audit Event Stream (Log feed for PM4Py Process Mining)
CREATE TABLE process_audit_events (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL, -- maps to application_id
    activity VARCHAR(100) NOT NULL, -- 'Submitted', 'Scrutiny Started', 'Clarification Raised', etc.
    actor_type VARCHAR(50) NOT NULL, -- 'APPLICANT', 'DEPARTMENT_OFFICER', 'INSPECTOR', 'SYSTEM'
    actor_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attributes JSONB
);

CREATE INDEX idx_audit_case ON process_audit_events(case_id);
CREATE INDEX idx_audit_timestamp ON process_audit_events(timestamp);
```

---

## 2. PostGIS Geospatial Layer

```sql
-- Industrial Zones & Municipal Authority Polygons
CREATE TABLE jurisdiction_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(255) NOT NULL, -- e.g. 'Chakan Industrial Area Phase II'
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100),
    authority_name VARCHAR(255) NOT NULL, -- 'Maharashtra Industrial Development Corporation (MIDC)'
    authority_type VARCHAR(50) NOT NULL, -- 'INDUSTRIAL_DEV_CORP', 'MUNICIPAL_CORP', 'GRAM_PANCHAYAT'
    statutory_act VARCHAR(255) NOT NULL, -- 'MIDC Act 1961'
    polygon_boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    h3_coverage_array TEXT[] -- List of H3 index strings contained within
);

CREATE INDEX idx_zones_polygon ON jurisdiction_zones USING GIST(polygon_boundary);

-- PostGIS Fast Containment Function
CREATE OR REPLACE FUNCTION resolve_jurisdiction(p_lat NUMERIC, p_lng NUMERIC)
RETURNS TABLE (
    zone_name VARCHAR,
    authority_name VARCHAR,
    authority_type VARCHAR,
    statutory_act VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.zone_name,
        j.authority_name,
        j.authority_type,
        j.statutory_act
    FROM jurisdiction_zones j
    WHERE ST_Contains(j.polygon_boundary, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Regulatory Knowledge Graph (Neo4j)

### 3.1 Node & Edge Schema

```text
Nodes:
(:Enterprise {id, name, pan})
(:Project {id, name, sector, investment, capacity})
(:Approval {id, code, name, slaDays, category})
(:Department {id, name, jurisdictionLevel})
(:StatutoryAct {id, title, year, section})
(:DocumentTemplate {id, title, format, maxSizeBytes})

Relationships:
(:Project)-[:REQUIRES]->(:Approval)
(:Approval)-[:DEPENDS_ON {type: "PREREQUISITE"}]->(:Approval)
(:Approval)-[:ISSUED_BY]->(:Department)
(:Approval)-[:GOVERNED_BY]->(:StatutoryAct)
(:Approval)-[:MANDATES_DOCUMENT]->(:DocumentTemplate)
```

### 3.2 Canonical Cypher Queries

#### Query 1: Unlocked Next Steps (Approvals with all prerequisites met)
```cypher
MATCH (p:Project {id: $projectId})-[:REQUIRES]->(target:Approval)
WHERE NOT target.status = "APPROVED"
  AND ALL(prereq IN [(target)-[:DEPENDS_ON]->(p_appr) | p_appr] WHERE prereq.status = "APPROVED")
RETURN target.id AS approvalId, target.name AS approvalName, target.slaDays AS slaDays;
```

#### Query 2: Downstream Impact of Parameter Change (e.g., Capacity increase from 40 to 120 TPD)
```cypher
MATCH (a:Approval {code: "MPCB-CTE"})-[rel:DEPENDS_ON*1..5]->(downstream:Approval)
RETURN DISTINCT downstream.code AS affectedCode, downstream.name AS affectedName;
```

---

## 4. Vector Embedding Schema (pgvector)

```sql
CREATE TABLE document_chunk_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_document_id UUID NOT NULL REFERENCES vault_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL, -- Compatible with text-embedding-004 / Gemini Embeddings
    metadata JSONB, -- page number, bounding box, table schema
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chunk_embeddings ON document_chunk_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
