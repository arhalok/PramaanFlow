# Regulatory OS — Intelligent Approval, Compliance & Inspection Orchestration

> **Smart India Hackathon (SIH)** • National Single Window System (NSWS) & Raj Nivesh Layer

Regulatory OS transforms statutory permissions from static form filing into a **live computational digital twin** with Vercel AI SDK, Google Gemini Copilot, and VROOM vehicle route optimization.

---

## ⚡ Architecture Highlights

1. **Applicant Digital Twin Workspace**:
   - Dynamic Approval Dependency DAG (pre-establishment vs pre-operation NOCs, critical path blocking)
   - Geospatial Regulatory Fingerprint (H3 spatial indexing, industrial park zoning, eco-sensitive sanctuary 10km buffer verification)
   - Pre-Submission Document Completeness Validator (instant Docling rule engine check)
   - What-If Impact Simulator (modifying power/water/solvents to calculate timeline delay & blast radius)

2. **Government Command Center**:
   - Real-time SLA Countdown Heatmap across departments (78.5% within SLA, 6.5% breached)
   - Process Mining & Bottleneck Detection (root cause analysis for Factory Inspectorate, SEIAA, CGWA)
   - Inter-departmental critical path escalation

3. **Field Inspector Workspace & VROOM Engine**:
   - Integrated VROOM (Vehicle Routing Open-source Optimization Machine - `ghcr.io/vroom-project/vroom-docker`)
   - 34% reduction in inspection travel distance (~30.3 km / 1h 40m saved per tour)
   - On-site digital inspection checklist with GPS geo-fencing and tamper-proof evidence upload

4. **AI Copilot (Vercel AI SDK + Google Gemini)**:
   - Tool calling integration (`getSiteRegulatoryFingerprint`, `findApplicableApprovals`, `optimizeInspections`, `detectProcessBottlenecks`)
   - Instant legal basis explanations under Indian Acts (Water/Air Acts, Factories Act 1948, Fire Safety Act 2021)

---

## 🚀 Quick Start Guide

### 1. Web Application (Next.js)

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Configure Google Gemini API Key

Create or edit `frontend/.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
VROOM_URL=http://localhost:3001
```
*Note: The platform includes a high-speed intelligent regulatory fallback stream if no key is entered!*

### 3. Docker Services (Optional / Production-grade)

Run the backend infrastructure stack:
```bash
docker compose up -d
```

This launches:
- **VROOM** on `http://localhost:3001` (`ghcr.io/vroom-project/vroom-docker`)
- **PostGIS 16** on `localhost:5432` with pre-seeded Rajasthan industrial zones (Sitapura, Neemrana)
- **Neo4j Graph Database** on `http://localhost:7474`
- **Redis Cache** on `localhost:6379`
