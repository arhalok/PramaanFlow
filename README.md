# Regulatory OS — Maharashtra Geospatial Jurisdiction Intelligence Platform

> **Smart India Hackathon (SIH)** • National Single Window System (NSWS) & Maharashtra Aaple Sarkar Layer

Regulatory OS transforms statutory permissions from static form filing into a **live computational digital twin** with **authoritative Maharashtra jurisdiction intelligence (PostGIS + H3)**, Vercel AI SDK, Google Gemini Copilot, and VROOM vehicle route optimization.

---

## ⚡ 1-Command Instant Launch

### 🌟 Option 1: GitHub Codespaces (Zero Setup, 1-Click)
Open this repository in **GitHub Codespaces**. The devcontainer is pre-configured with Node 20, ports 3000, 5432, and 3001 forwarded. Dependencies install automatically on creation and the app launches immediately on port 3000:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new)

---

### 🚀 Option 2: Single Command in Terminal (Linux, macOS, Windows)
You do **NOT** need to `cd` into subfolders or configure anything manually. From the root of this repository, just run:

```bash
npm start
```
*(or `npm run dev`)*

Alternatively, use the native executable scripts:
* **Linux / macOS / Codespaces**:
  ```bash
  ./start.sh
  ```
* **Windows**:
  ```cmd
  start.bat
  ```

**What happens automatically with this 1 command:**
1. ✅ Checks for `.env.local` and creates it from `.env.example` if not present.
2. ✅ Automatically installs dependencies if `node_modules` is not yet installed.
3. ✅ Starts the platform on `http://localhost:3000` with hot-reload.
4. ✅ Production build is already verified and passes with zero errors (`npm run build`).

---

### 🐳 Option 3: Full Stack Docker Compose (1 Command)
Run the entire containerized stack (Next.js Web App + PostgreSQL 16 PostGIS + VROOM Engine + Redis + Neo4j):

```bash
docker compose up -d
```

* **Web Application & Maharashtra GIS UI**: `http://localhost:3000`
* **PostGIS 16 Database**: `localhost:5432` (Auto-initialized with `docker/init-db/02-maharashtra-jurisdictions.sql`)
* **VROOM Route Optimizer**: `http://localhost:3001`
* **Redis Cache**: `localhost:6379`
* **Neo4j Graph Database**: `http://localhost:7474`

---

## 🏛️ Maharashtra Jurisdiction Intelligence Stack

### Core Workflow:
`USER SELECTS / DROPS A PROJECT LOCATION`
↓
`SYSTEM ANALYZES LOCATION (PostGIS Ray-Casting & Containment)`
↓
`IDENTIFIES GEOGRAPHIC JURISDICTIONS (District, Taluka, Local Body)`
↓
`IDENTIFIES APPLICABLE GOVERNMENT AUTHORITIES (MIDC SPA, MPCB SRO, PMRDA, DISH)`
↓
`CONNECTS THEM TO RELEVANT GOVERNMENT SERVICES (Aaple Sarkar / RTS Act 2015)`
↓
`DISPLAYS EVERYTHING ON OPERATIONAL GIS MAP + LOCATION INTELLIGENCE PANEL`

### 100% Real Government Data Standard (Zero Hallucination):
* **MIDC (Maharashtra Industrial Development Corporation)**: Notified industrial estate boundaries (Chakan Phases I-IV, Kurkumbh, TTC Turbhe, Butibori 5-Star MIDC, Ranjangaon) with Special Planning Authority (SPA) recognition under Section 40(1) MRTP Act 1966.
* **MPCB (Maharashtra Pollution Control Board)**: Regional & Sub-Regional Office (SRO) assignments derived from Gazette Notification BO/P&L/B-328.
* **Revenue & Forest Department**: District & Taluka administrative polygons (Pune, Thane, Nagpur, Raigad, Khed, Daund, Haveli, Shirur).
* **Maharashtra Aaple Sarkar (RTS Act 2015)**: 8+ statutory notified services with time limits (15–60 days), designated officers, and official portal URLs.
* **OpenStreetMap (OSM)**: Real physical infrastructure features (NH-48, NH-60, NH-65, NH-44, Central Railway line, River catchments).
* **H3 Spatial Index**: Pure TypeScript Resolution 8 hexagon index calculation without external native binary dependencies.

---

## 🧭 Live Demo Scenarios

Switch instantly using the demo scenario preset pills in the map header:
1. **Chakan MIDC Phase II (Pune)**: Auto Hub • Special Planning Authority • SRO Pimpri-Chinchwad • Sec 42A MLRC NA Exempted.
2. **Kurkumbh Chemical Zone (Daund, Pune)**: Red Category Bulk Drug / Chemical Hub • SRO Pune-I • CETP Available.
3. **TTC Industrial Area (Turbhe, Navi Mumbai)**: Thane District • SRO Navi Mumbai-I • High Density Industrial Corridor.
4. **Butibori 5-Star MIDC (Nagpur)**: Vidarbha Industrial Hub • Nagpur District • SRO Nagpur-II.
5. **Shirur Rural Project (Pune Rural)**: Non-MIDC Agricultural Land • Regular Section 44 MLRC Collector NA Required • PMRDA Planning.

---

## 🛠️ Project Structure

```
SIH/
├── .devcontainer/
│   └── devcontainer.json         # 1-Click GitHub Codespaces configuration
├── docker/
│   └── init-db/
│       └── 02-maharashtra-jurisdictions.sql  # PostGIS schema & seed data
├── docs/
│   └── maharashtra-geospatial-intelligence.md # Full architecture & API spec
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/geospatial/analyze/route.ts # Location Analysis API
│   │   │   ├── api/chat/route.ts              # Gemini Copilot + Grounding
│   │   │   └── page.tsx                       # Main Regulatory OS Dashboard
│   │   ├── components/
│   │   │   ├── MaharashtraJurisdictionMap.tsx # Interactive GIS Dashboard
│   │   │   └── ApplicantWorkspace.tsx         # Digital Twin & Clearances DAG
│   │   └── lib/
│   │       └── maharashtra-geospatial.ts      # Spatial & Statutory Engine
│   └── Dockerfile                             # Container image for web app
├── scripts/
│   └── run.js                    # Cross-platform 1-command startup runner
├── package.json                  # Root npm scripts (dev, start, build, setup)
├── start.sh                      # 1-Command launcher (Linux / Mac / Codespaces)
├── start.bat                     # 1-Command launcher (Windows)
├── docker-compose.yml            # Multi-container stack (Web + PostGIS + VROOM)
└── README.md
```

---

## 📄 License
MIT License. Built for the Smart India Hackathon (SIH).
