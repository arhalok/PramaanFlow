-- Regulatory OS PostGIS initialization
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 1. Industrial Zones & Parks (e.g. RIICO, Special Economic Zones)
CREATE TABLE IF NOT EXISTS industrial_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'Rajasthan',
    district VARCHAR(100) NOT NULL,
    zone_type VARCHAR(100) NOT NULL, -- 'RED', 'ORANGE', 'GREEN', 'WHITE' category permissible
    expedited_clearance BOOLEAN DEFAULT TRUE,
    geom GEOMETRY(Polygon, 4326)
);

-- 2. Environmental Sensitive Areas & Eco-buffers (Tiger Reserves, Wetlands, Rivers)
CREATE TABLE IF NOT EXISTS environmental_buffers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    buffer_type VARCHAR(100) NOT NULL, -- 'ECO_SENSITIVE_ZONE', 'FOREST_BUFFER', 'WATER_BODY_RESTRICTION'
    buffer_radius_meters INT NOT NULL,
    clearance_authority VARCHAR(255) DEFAULT 'SEIAA / MoEFCC',
    geom GEOMETRY(Polygon, 4326)
);

-- 3. Projects Spatial Table
CREATE TABLE IF NOT EXISTS project_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    proposed_investment_inr NUMERIC,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

-- Sample Data: RIICO Industrial Area Sitapura & Neemrana
INSERT INTO industrial_zones (name, district, zone_type, expedited_clearance, geom)
VALUES 
('Sitapura Industrial Area Phase I-IV', 'Jaipur', 'GREEN_ORANGE_RED', true, 
 ST_GeomFromText('POLYGON((75.82 26.77, 75.86 26.77, 75.86 26.81, 75.82 26.81, 75.82 26.77))', 4326)),
('Neemrana Japanese Industrial Zone', 'Kotputli-Behror', 'ORANGE_RED', true, 
 ST_GeomFromText('POLYGON((76.38 27.96, 76.43 27.96, 76.43 28.01, 76.38 28.01, 76.38 27.96))', 4326))
ON CONFLICT DO NOTHING;
