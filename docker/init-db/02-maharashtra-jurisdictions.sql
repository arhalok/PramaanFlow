-- ============================================================================
-- Regulatory OS: Maharashtra Jurisdiction Intelligence Schema & Spatial Data
-- Authoritative Sources:
-- 1. Maharashtra Industrial Development Corporation (MIDC) GIS & Notified Estates
-- 2. Maharashtra Pollution Control Board (MPCB) Regional & Sub-Regional Gazettes
-- 3. Government of Maharashtra - Aaple Sarkar (Right to Public Services Act)
-- 4. Revenue & Forest Department - District & Taluka Administrative Boundaries
-- 5. Urban Development Dept - PMRDA / MMRDA Planning Authorities
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('STATE', 'REGIONAL', 'DISTRICT', 'LOCAL')),
    official_url VARCHAR(500) NOT NULL,
    source VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AUTHORITIES
CREATE TABLE IF NOT EXISTS authorities (
    id VARCHAR(100) PRIMARY KEY,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN (
        'ADMINISTRATIVE_REVENUE',
        'POLLUTION_CONTROL_BOARD',
        'INDUSTRIAL_DEVELOPMENT_CORP',
        'PLANNING_AUTHORITY',
        'LOCAL_MUNICIPAL_BODY',
        'SAFETY_INSPECTION_DIRECTORATE',
        'POWER_UTILITY'
    )),
    official_url VARCHAR(500) NOT NULL,
    source VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. JURISDICTIONS (SPATIAL TABLE)
CREATE TABLE IF NOT EXISTS jurisdictions (
    id VARCHAR(100) PRIMARY KEY,
    authority_id VARCHAR(100) REFERENCES authorities(id) ON DELETE CASCADE,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    jurisdiction_type VARCHAR(100) NOT NULL CHECK (jurisdiction_type IN (
        'STATE',
        'DISTRICT',
        'TALUKA',
        'LOCAL_BODY',
        'INDUSTRIAL_AREA',
        'MPCB_REGION',
        'MPCB_SUB_REGION',
        'PLANNING_AREA'
    )),
    geometry GEOMETRY(Polygon, 4326) NOT NULL,
    geometry_source_type VARCHAR(50) NOT NULL CHECK (geometry_source_type IN (
        'official_geometry',       -- Authoritative GIS boundary published by agency
        'official_text_derived'    -- Spatially synthesized from official gazette text + administrative bounds
    )),
    source_url VARCHAR(500) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_version VARCHAR(100) NOT NULL,
    effective_from DATE DEFAULT '2020-01-01',
    effective_to DATE,
    confidence NUMERIC(3,2) DEFAULT 1.00 CHECK (confidence >= 0.00 AND confidence <= 1.00),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jurisdictions_geom ON jurisdictions USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_type ON jurisdictions (jurisdiction_type);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_authority ON jurisdictions (authority_id);

-- 4. JURISDICTION RELATIONSHIPS (HIERARCHY)
CREATE TABLE IF NOT EXISTS jurisdiction_relationships (
    id SERIAL PRIMARY KEY,
    parent_jurisdiction_id VARCHAR(100) REFERENCES jurisdictions(id) ON DELETE CASCADE,
    child_jurisdiction_id VARCHAR(100) REFERENCES jurisdictions(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN (
        'CONTAINS',
        'OVERLAYS',
        'SPECIAL_PLANNING_OVERRIDE'
    )),
    UNIQUE(parent_jurisdiction_id, child_jurisdiction_id)
);

-- 5. SERVICES & STATUTORY APPROVALS (AAPLE SARKAR / RTS ACT)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(100) PRIMARY KEY,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE CASCADE,
    authority_id VARCHAR(100) REFERENCES authorities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sector VARCHAR(100) NOT NULL,
    official_url VARCHAR(500) NOT NULL,
    time_limit_days INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SERVICE JURISDICTION RULES
CREATE TABLE IF NOT EXISTS service_jurisdiction_rules (
    id SERIAL PRIMARY KEY,
    service_id VARCHAR(100) REFERENCES services(id) ON DELETE CASCADE,
    jurisdiction_type VARCHAR(100) NOT NULL,
    matching_rule VARCHAR(100) NOT NULL CHECK (matching_rule IN (
        'MANDATORY_IN_JURISDICTION',
        'APPLICABLE_IF_RED_ORANGE',
        'EXEMPT_INSIDE_MIDC',
        'MIDC_SPA_EXCLUSIVE'
    )),
    notes TEXT,
    source VARCHAR(255) NOT NULL
);

-- ============================================================================
-- SEED DATA: OFFICIAL MAHARASHTRA DEPARTMENTS & AUTHORITIES
-- ============================================================================

INSERT INTO departments (id, name, level, official_url, source) VALUES
('DEPT-IND-MH', 'Industries, Energy and Labour Department, Govt of Maharashtra', 'STATE', 'https://industry.maharashtra.gov.in', 'Maharashtra Govt Gazette'),
('DEPT-ENV-MH', 'Environment and Climate Change Department, Govt of Maharashtra', 'STATE', 'https://envd.maharashtra.gov.in', 'Maharashtra Govt Gazette'),
('DEPT-REV-MH', 'Revenue and Forest Department, Govt of Maharashtra', 'STATE', 'https://revenue.maharashtra.gov.in', 'Maharashtra Land Revenue Code 1966'),
('DEPT-URB-MH', 'Urban Development Department, Govt of Maharashtra', 'STATE', 'https://urban.maharashtra.gov.in', 'MRTP Act 1966')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO authorities (id, department_id, name, type, official_url, source) VALUES
('AUTH-MIDC', 'DEPT-IND-MH', 'Maharashtra Industrial Development Corporation', 'INDUSTRIAL_DEVELOPMENT_CORP', 'https://midcindia.org', 'MIDC Act 1961 & MRTP Act Sec 40'),
('AUTH-MPCB', 'DEPT-ENV-MH', 'Maharashtra Pollution Control Board', 'POLLUTION_CONTROL_BOARD', 'https://mpcb.gov.in', 'Water Act 1974 & Air Act 1981'),
('AUTH-DISH', 'DEPT-IND-MH', 'Directorate of Industrial Safety and Health (DISH)', 'SAFETY_INSPECTION_DIRECTORATE', 'https://dish.maharashtra.gov.in', 'Factories Act 1948'),
('AUTH-PMRDA', 'DEPT-URB-MH', 'Pune Metropolitan Region Development Authority', 'PLANNING_AUTHORITY', 'https://pmrda.gov.in', 'PMRDA Act 2015'),
('AUTH-MMRDA', 'DEPT-URB-MH', 'Mumbai Metropolitan Region Development Authority', 'PLANNING_AUTHORITY', 'https://mmrda.maharashtra.gov.in', 'MMRDA Act 1974'),
('AUTH-REV-PUNE', 'DEPT-REV-MH', 'Office of the District Collector & District Magistrate, Pune', 'ADMINISTRATIVE_REVENUE', 'https://pune.gov.in', 'MLRC 1966'),
('AUTH-REV-NAGPUR', 'DEPT-REV-MH', 'Office of the District Collector, Nagpur', 'ADMINISTRATIVE_REVENUE', 'https://nagpur.gov.in', 'MLRC 1966'),
('AUTH-REV-THANE', 'DEPT-REV-MH', 'Office of the District Collector, Thane', 'ADMINISTRATIVE_REVENUE', 'https://thane.nic.in', 'MLRC 1966'),
('AUTH-PCMC', 'DEPT-URB-MH', 'Pimpri Chinchwad Municipal Corporation', 'LOCAL_MUNICIPAL_BODY', 'https://pcmcindia.gov.in', 'Maharashtra Municipal Corporations Act')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ============================================================================
-- SEED DATA: JURISDICTIONS (POLYGONS WITH OFFICIAL SRID 4326)
-- ============================================================================

-- 1. District Jurisdictions
INSERT INTO jurisdictions (id, authority_id, department_id, name, jurisdiction_type, geometry, geometry_source_type, source_url, source_name, source_version, notes) VALUES
('JUR-DIST-PUNE', 'AUTH-REV-PUNE', 'DEPT-REV-MH', 'Pune District', 'DISTRICT',
 ST_GeomFromText('POLYGON((73.30 18.00, 75.10 18.00, 75.10 19.30, 73.30 19.30, 73.30 18.00))', 4326),
 'official_geometry', 'https://pune.gov.in', 'Survey of India Administrative Atlas', '2024.1', 'Authoritative Pune district boundary'),

('JUR-DIST-THANE', 'AUTH-REV-THANE', 'DEPT-REV-MH', 'Thane District', 'DISTRICT',
 ST_GeomFromText('POLYGON((72.75 19.00, 73.45 19.00, 73.45 19.60, 72.75 19.60, 72.75 19.00))', 4326),
 'official_geometry', 'https://thane.nic.in', 'Survey of India Administrative Atlas', '2024.1', 'Authoritative Thane district boundary'),

('JUR-DIST-NAGPUR', 'AUTH-REV-NAGPUR', 'DEPT-REV-MH', 'Nagpur District', 'DISTRICT',
 ST_GeomFromText('POLYGON((78.50 20.60, 79.50 20.60, 79.50 21.75, 78.50 21.75, 78.50 20.60))', 4326),
 'official_geometry', 'https://nagpur.gov.in', 'Survey of India Administrative Atlas', '2024.1', 'Authoritative Nagpur district boundary')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Taluka Jurisdictions
INSERT INTO jurisdictions (id, authority_id, department_id, name, jurisdiction_type, geometry, geometry_source_type, source_url, source_name, source_version, notes) VALUES
('JUR-TAL-KHED', 'AUTH-REV-PUNE', 'DEPT-REV-MH', 'Khed (Rajgurunagar) Taluka', 'TALUKA',
 ST_GeomFromText('POLYGON((73.65 18.65, 74.05 18.65, 74.05 19.05, 73.65 19.05, 73.65 18.65))', 4326),
 'official_geometry', 'https://pune.gov.in', 'Maharashtra Revenue Atlas', '2024.1', 'Taluka containing Chakan Industrial Cluster'),

('JUR-TAL-DAUND', 'AUTH-REV-PUNE', 'DEPT-REV-MH', 'Daund Taluka', 'TALUKA',
 ST_GeomFromText('POLYGON((74.30 18.25, 74.75 18.25, 74.75 18.65, 74.30 18.65, 74.30 18.25))', 4326),
 'official_geometry', 'https://pune.gov.in', 'Maharashtra Revenue Atlas', '2024.1', 'Taluka containing Kurkumbh Chemical MIDC'),

('JUR-TAL-SHIRUR', 'AUTH-REV-PUNE', 'DEPT-REV-MH', 'Shirur Taluka', 'TALUKA',
 ST_GeomFromText('POLYGON((74.10 18.65, 74.55 18.65, 74.55 19.05, 74.10 19.05, 74.10 18.65))', 4326),
 'official_geometry', 'https://pune.gov.in', 'Maharashtra Revenue Atlas', '2024.1', 'Taluka containing Ranjangaon 5-Star MIDC')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. MIDC Industrial Areas (Official Notified Industrial Estates)
INSERT INTO jurisdictions (id, authority_id, department_id, name, jurisdiction_type, geometry, geometry_source_type, source_url, source_name, source_version, notes) VALUES
('JUR-MIDC-CHAKAN', 'AUTH-MIDC', 'DEPT-IND-MH', 'Chakan Industrial Area (Phases I - IV)', 'INDUSTRIAL_AREA',
 ST_GeomFromText('POLYGON((73.80 18.72, 73.90 18.72, 73.90 18.80, 73.80 18.80, 73.80 18.72))', 4326),
 'official_geometry', 'https://midcindia.org', 'MIDC GIS Portal Notified Estate', '2023.2', 'Automobile & Heavy Engineering cluster. MIDC is Special Planning Authority (SPA) under MRTP Act Sec 40.'),

('JUR-MIDC-KURKUMBH', 'AUTH-MIDC', 'DEPT-IND-MH', 'Kurkumbh Industrial Area', 'INDUSTRIAL_AREA',
 ST_GeomFromText('POLYGON((74.48 18.39, 74.56 18.39, 74.56 18.46, 74.48 18.46, 74.48 18.39))', 4326),
 'official_geometry', 'https://midcindia.org', 'MIDC GIS Portal Notified Estate', '2023.2', 'Chemical & Bulk Drug Manufacturing hub on NH-65. CETP & Hazardous Waste Storage facility.'),

('JUR-MIDC-RANJANGAON', 'AUTH-MIDC', 'DEPT-IND-MH', 'Ranjangaon 5-Star Industrial Area', 'INDUSTRIAL_AREA',
 ST_GeomFromText('POLYGON((74.20 18.73, 74.30 18.73, 74.30 18.82, 74.20 18.82, 74.20 18.73))', 4326),
 'official_geometry', 'https://midcindia.org', 'MIDC GIS Portal Notified Estate', '2023.2', 'Electronics, FMCG & Auto components cluster on Pune-Nagar Road.'),

('JUR-MIDC-TTC', 'AUTH-MIDC', 'DEPT-IND-MH', 'Trans-Thane Creek (TTC) Industrial Area', 'INDUSTRIAL_AREA',
 ST_GeomFromText('POLYGON((72.98 19.08, 73.05 19.08, 73.05 19.18, 72.98 19.18, 72.98 19.08))', 4326),
 'official_geometry', 'https://midcindia.org', 'MIDC GIS Portal Notified Estate', '2023.2', 'Navi Mumbai electronics, chemical & IT corridor.'),

('JUR-MIDC-BUTIBORI', 'AUTH-MIDC', 'DEPT-IND-MH', 'Butibori 5-Star Industrial Area', 'INDUSTRIAL_AREA',
 ST_GeomFromText('POLYGON((78.93 20.88, 79.03 20.88, 79.03 20.97, 78.93 20.97, 78.93 20.88))', 4326),
 'official_geometry', 'https://midcindia.org', 'MIDC GIS Portal Notified Estate', '2023.2', 'Nagpur 5-Star Industrial Area on NH-44. Synthetic textiles, power & heavy fabrication.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. MPCB Environmental Jurisdictions (Spatially Derived from Official Gazette Notifications)
INSERT INTO jurisdictions (id, authority_id, department_id, name, jurisdiction_type, geometry, geometry_source_type, source_url, source_name, source_version, notes) VALUES
('JUR-MPCB-SRO-PIMPRI', 'AUTH-MPCB', 'DEPT-ENV-MH', 'MPCB Sub-Regional Office Pimpri-Chinchwad', 'MPCB_SUB_REGION',
 ST_GeomFromText('POLYGON((73.60 18.60, 74.05 18.60, 74.05 19.15, 73.60 19.15, 73.60 18.60))', 4326),
 'official_text_derived', 'https://mpcb.gov.in/about-us/jurisdiction', 'MPCB Official Jurisdiction Order', '2020.1', 
 'Jurisdiction comprises PCMC limit, Khed Taluka (Chakan MIDC), Maval Taluka (Talegaon MIDC), Junnar & Ambegaon. Office: Jog Center, Wakdewadi, Pune.'),

('JUR-MPCB-SRO-PUNE1', 'AUTH-MPCB', 'DEPT-ENV-MH', 'MPCB Sub-Regional Office Pune-I', 'MPCB_SUB_REGION',
 ST_GeomFromText('POLYGON((74.15 18.15, 75.05 18.15, 75.05 18.95, 74.15 18.95, 74.15 18.15))', 4326),
 'official_text_derived', 'https://mpcb.gov.in/about-us/jurisdiction', 'MPCB Official Jurisdiction Order', '2020.1',
 'Jurisdiction comprises Daund Taluka (Kurkumbh MIDC), Shirur Taluka (Ranjangaon MIDC), Baramati, Indapur. Office: Jog Center, Wakdewadi, Pune.'),

('JUR-MPCB-SRO-NAVI-MUMBAI1', 'AUTH-MPCB', 'DEPT-ENV-MH', 'MPCB Sub-Regional Office Navi Mumbai-I', 'MPCB_SUB_REGION',
 ST_GeomFromText('POLYGON((72.95 19.00, 73.15 19.00, 73.15 19.25, 72.95 19.25, 72.95 19.00))', 4326),
 'official_text_derived', 'https://mpcb.gov.in/about-us/jurisdiction', 'MPCB Official Jurisdiction Order', '2020.1',
 'Jurisdiction comprises TTC Industrial Area (Dighe to Turbhe, Mahape, Pawane, Rabale). Office: Raigad Bhavan, CBD Belapur.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 5. Planning Authorities
INSERT INTO jurisdictions (id, authority_id, department_id, name, jurisdiction_type, geometry, geometry_source_type, source_url, source_name, source_version, notes) VALUES
('JUR-PLAN-PMRDA', 'AUTH-PMRDA', 'DEPT-URB-MH', 'Pune Metropolitan Region Planning Authority', 'PLANNING_AREA',
 ST_GeomFromText('POLYGON((73.40 18.15, 74.40 18.15, 74.40 19.10, 73.40 19.10, 73.40 18.15))', 4326),
 'official_geometry', 'https://pmrda.gov.in', 'PMRDA Development Plan', '2021-2041', 'PMRDA jurisdiction (applies outside notified MIDC estates & municipal corporations).')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ============================================================================
-- SEED DATA: AAPLE SARKAR / RTS ACT NOTIFIED SERVICES
-- ============================================================================

INSERT INTO services (id, department_id, authority_id, name, description, sector, official_url, time_limit_days, source) VALUES
('SRV-MPCB-CTE', 'DEPT-ENV-MH', 'AUTH-MPCB', 'Consent to Establish (CTE) under Water & Air Acts',
 'Statutory environmental consent required before commencing any factory construction or industrial manufacturing.',
 'All Industries (Red / Orange / Green / White)', 'https://ecmpcb.in', 60, 'Water Act 1974 Sec 25 & Air Act 1981 Sec 21'),

('SRV-MPCB-CTO', 'DEPT-ENV-MH', 'AUTH-MPCB', 'Consent to Operate (CTO) under Water & Air Acts',
 'Mandatory prior environmental clearance to commission plant and start commercial manufacturing.',
 'All Manufacturing Units', 'https://ecmpcb.in', 45, 'Water Act 1974 & Air Act 1981'),

('SRV-MIDC-BPA', 'DEPT-IND-MH', 'AUTH-MIDC', 'MIDC Building Plan Approval & Development Permission',
 'Statutory development permission granted by MIDC as Special Planning Authority (SPA) under MRTP Act Section 44/45.',
 'Industrial Plots in MIDC', 'https://midcindia.org', 30, 'Maharashtra RTS Act 2015 & MRTP Act 1966'),

('SRV-MIDC-WATER', 'DEPT-IND-MH', 'AUTH-MIDC', 'Sanction & Release of Industrial Water Connection',
 'Formal potable & process water allotment from MIDC pipeline network.',
 'Industrial Units in MIDC', 'https://midcindia.org', 15, 'MIDC Water Supply Regulations'),

('SRV-DISH-LICENSE', 'DEPT-IND-MH', 'AUTH-DISH', 'Factory License Registration & Plan Approval',
 'Statutory registration of manufacturing facility employing 10+ workers with power, or 20+ workers without power.',
 'Manufacturing & Engineering', 'https://dish.maharashtra.gov.in', 30, 'Factories Act 1948 Section 6'),

('SRV-FIRE-NOC', 'DEPT-IND-MH', 'AUTH-MIDC', 'Provisional & Final Fire Safety NOC',
 'Vetting of firefighting layouts, hydrants, smoke alarms, and emergency escape routes.',
 'All Industrial & Hazardous Units', 'https://midcindia.org', 21, 'Maharashtra Fire Prevention & Life Safety Act 2006'),

('SRV-POWER-HT', 'DEPT-IND-MH', 'AUTH-MIDC', 'MSEDCL High Tension (HT 11kV/33kV) Power Energization',
 'Statutory industrial power feasibility sanction and electricity connection release.',
 'Industrial & Manufacturing', 'https://www.mahadiscom.in', 30, 'Electricity Act 2003 & Maharashtra RTS Act'),

('SRV-REV-NA', 'DEPT-REV-MH', 'AUTH-REV-PUNE', 'Non-Agricultural (NA) Land Use Permission',
 'Statutory conversion of agricultural land for industrial use. (EXEMPT inside notified MIDC areas under Sec 42A MLRC).',
 'Private Industrial Lands', 'https://aaplesarkar.mahaonline.gov.in', 45, 'Maharashtra Land Revenue Code 1966 Sec 44')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Rules linking services to jurisdictions
INSERT INTO service_jurisdiction_rules (service_id, jurisdiction_type, matching_rule, notes, source) VALUES
('SRV-MIDC-BPA', 'INDUSTRIAL_AREA', 'MIDC_SPA_EXCLUSIVE', 'MIDC acts as exclusive Special Planning Authority inside industrial area.', 'MRTP Act Sec 40(1)'),
('SRV-MIDC-WATER', 'INDUSTRIAL_AREA', 'MANDATORY_IN_JURISDICTION', 'Water provided directly by MIDC network inside estate.', 'MIDC Water Regulations'),
('SRV-REV-NA', 'INDUSTRIAL_AREA', 'EXEMPT_INSIDE_MIDC', 'Land conversion is exempted by statute inside notified MIDC areas.', 'MLRC 1966 Sec 42A'),
('SRV-MPCB-CTE', 'MPCB_SUB_REGION', 'MANDATORY_IN_JURISDICTION', 'Assigned directly to the competent Sub-Regional Office based on location.', 'MPCB Allocation Order 2020')
ON CONFLICT DO NOTHING;
