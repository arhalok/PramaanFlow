# Feature Gap Analysis & Implementation Roadmap
## Current Status, In-Progress Capabilities, and Missing Features (SIH PS 130 / PS 132)

> **Document Version:** 2.0.0  
> **Target Audience:** Engineering Leads, Product Managers, Hackathon Judges, and AI Implementers  
> **Status:** Active Engineering Audit  

---

## 1. Feature Status Matrix

This matrix provides an objective, transparent assessment of what is **fully implemented**, what operates as a **high-fidelity in-process TypeScript engine**, and what constitutes a **functional gap** according to the original problem statement.

| Feature Area | Current Implementation Status | Fidelity / Engine Type | Production Gap / Next Step |
| :--- | :--- | :--- | :--- |
| **Applicant Guided Onboarding** | ✅ **COMPLETE** | Live React / Next.js Component | None. 5-screen Google Maps-style guided wizard active. |
| **Action-First Dashboard** | ✅ **COMPLETE** | Live React / Next.js Component | None. "Your Next Step", 3 To-Dos, 7-stop Journey active. |
| **Applicant AI Tool Layer** | ✅ **COMPLETE** | Next.js API + Zod Schemas | 25+ tools implemented with `ToolResult<T>` envelopes. |
| **Geospatial Resolution** | ✅ **COMPLETE** | In-Process PostGIS Polygon Math | Chakan MIDC, Khed Taluka, PCMC boundaries verified. |
| **Regulatory Dependency DAG** | ✅ **COMPLETE** | In-Process Deterministic Engine | Real statutory acts (Water, Air, Factories, MIDC, RTS). |
| **Pre-Submission Validation** | ✅ **COMPLETE** | In-Process Deterministic Rules | 4 rule gates preventing query loops active. |
| **Government Query Desk** | ✅ **COMPLETE** | Live Modal & Interactive Workflow | Side-by-side 100 vs 150 KLD discrepancy & 1-click answer. |
| **Joint Inspection Optimizer** | ✅ **COMPLETE** | TypeScript TSP/VRP Solver | Clusters DISH/MPCB audits with time windows. |
| **Statutory RTS Appeal Desk** | ✅ **COMPLETE** | Live Grievance Modal & Logic | Maharashtra Right to Public Services Act 2015 rules. |
| **What-If Sensitivity Simulator**| ✅ **COMPLETE** | Live Modal & State Recalculator | Real-time parameter tweaking and subsidy recalculation. |
| **Docling Document Intelligence**| 🟡 **HYBRID / MOCKED** | High-Fidelity JSON Schemas | Live standalone Docling Docker service needs integration. |
| **Neo4j Graph Database** | 🟡 **HYBRID / MOCKED** | In-Process TypeScript Graph | Live Neo4j Bolt driver container needs connection. |
| **Temporal.io Workflows** | 🟡 **HYBRID / MOCKED** | In-Process State Machine | Live Temporal Server & Worker cluster needs connection. |
| **Open Policy Agent (OPA)** | 🟡 **HYBRID / MOCKED** | In-Process Rego Evaluation | Standalone OPA HTTP daemon container needs connection. |
| **PM4Py Process Mining** | 🟡 **HYBRID / MOCKED** | Python Script + Next.js Metrics | Dedicated Python FastAPI process-miner microservice. |
| **DigiLocker Integration** | 🔴 **MISSING FEATURE** | Not Yet Connected | Direct OAuth2 pull for Aadhaar, PAN, and Udyam. |
| **SMS / WhatsApp Alerts** | 🔴 **MISSING FEATURE** | Not Yet Connected | Gupshup / Twilio / MSG91 webhook integration. |
| **IoT Effluent Telemetry** | 🔴 **MISSING FEATURE** | Not Yet Connected | Continuous IoT sensor streaming for CPCB OCEMS. |
| **Voice / Speech-to-Text** | 🔴 **MISSING FEATURE** | Not Yet Connected | Bhashini / Whisper speech input in Hindi/Marathi. |
| **Statutory Payment Gateway** | 🔴 **MISSING FEATURE** | Mocked Confirmation | Integration with BharatKosh / RajKosh / MahaE-Seva. |

---

## 2. Deep Dive into Gaps & Implementation Blueprints

### Gap 1: Live DigiLocker OAuth2 Gateway
* **Problem:** Entrepreneurs currently upload PDFs into the Document Vault manually. While Docling verifies them, official government Single Window systems should allow 1-click instant credential import.
* **Requirements:**
  1. Add `/api/auth/digilocker/authorize` and callback endpoints.
  2. Implement OAuth2 PKCE flow using India DigiLocker Developer APIs (`api.digitallocker.gov.in`).
  3. Automatically pull and verify:
     * Enterprise PAN Verification Record (Income Tax Dept).
     * Certificate of Incorporation (Ministry of Corporate Affairs - MCA21).
     * Udyam Registration Certificate (Ministry of MSME).
* **Architecture Impact:** Populates `vault_documents` with cryptographic verification flags directly from the issuing authority with zero OCR latency.

---

### Gap 2: Multi-Channel Push Notifications (WhatsApp & SMS)
* **Problem:** Currently, queries from the Pollution Control Board or DISH appear only inside the web portal. Factory managers who are on-site or in transit may miss 5-day query deadlines.
* **Requirements:**
  1. Integrate a WhatsApp Business API provider (e.g., Gupshup, Twilio, or Wati).
  2. Create an event listener on `clarification_queries` insertions.
  3. Send an actionable WhatsApp message:
     ```text
     "PramaanFlow Alert: MPCB has requested clarification regarding water usage for your Chakan plant. 5 days remaining. Reply '1' for 100 KLD or click here to review: https://pramaanflow.in/q/APP-123"
     ```
  4. Inbound webhook parses applicant reply and resolves the query via `application_respond_query`.

---

### Gap 3: Live Continuous Online Effluent Monitoring System (OCEMS) Telemetry
* **Problem:** For post-approval compliance (Consent to Operate under the Water & Air Acts), Central Pollution Control Board (CPCB) mandates 24x7 online sensor telemetry for Red Category pharmaceutical and chemical plants.
* **Requirements:**
  1. Add an MQTT / TimescaleDB ingestion pipeline at `/api/telemetry/ocems`.
  2. Ingest sensor streams for:
     * Effluent flow rate (m³/hr).
     * Chemical Oxygen Demand (COD in mg/L, legal limit: 250 mg/L).
     * Biochemical Oxygen Demand (BOD in mg/L, legal limit: 30 mg/L).
     * pH level (statutory range: 6.5 to 8.5).
  3. Automatically flag compliance breaches and trigger preventative alerts before MPCB issues a Section 33A closure notice.

---

### Gap 4: Multilingual Voice / Speech-to-Text Support (Hindi / Marathi)
* **Problem:** Many small enterprise founders (MSME category) in tier-2/3 industrial clusters like Sitapura (Jaipur), Waluj (Aurangabad), or Butibori (Nagpur) prefer speaking in Hindi or Marathi rather than typing in English.
* **Requirements:**
  1. Add a microphone component to `GuidedProjectOnboarding.tsx` and `ContextualCopilotDrawer.tsx`.
  2. Integrate with **Bhashini API** (Government of India's National Language Translation Mission) or OpenAI Whisper.
  3. Audio stream is transcribed into localized text, passed to Gemini with localized prompt context, and returns synthesized Hindi/Marathi responses.

---

### Gap 5: Statutory Fee Payment Gateway Integration
* **Problem:** Applications calculate statutory fee schedules (e.g., ₹1,25,000 for MPCB CTE based on capital investment), but payment is currently marked as "Simulation Complete".
* **Requirements:**
  1. Integrate Razorpay / CCAvenue or state treasury gateway (MahaE-Seva / RajKosh / BharatKosh).
  2. Generate a statutory e-Challan with Treasury Head codes (e.g., *Head 0070-60-800* for Environmental Consent Fees).
  3. Store payment transaction reference in `applications.payment_transaction_id` and attach the generated receipt to the submission docket.

---

### Gap 6: Containerized Microservice Unification
* **Problem:** The system's backend engines (PostGIS, Neo4j, OPA, Temporal, Docling, PM4Py) currently run with high fidelity directly inside the TypeScript Next.js architecture or standalone scripts.
* **Requirements:**
  1. Finalize the `docker-compose.yml` multi-container stack:
     * `db`: PostgreSQL 15 + PostGIS + pgvector.
     * `graph`: Neo4j 5 Enterprise / Community with APOC plugins.
     * `policy`: Open Policy Agent (OPA) server loading `policy/opa/*.rego`.
     * `workflows`: Temporal Server + Python/TypeScript Worker.
     * `docling`: Docling layout parsing microservice.
     * `optimizer`: Python Google OR-Tools CP-SAT FastAPI container.
     * `process-mining`: Python PM4Py FastAPI service.
  2. Configure environment flags (`USE_LOCAL_SERVICES=true`) to seamlessly toggle between the lightweight, lightning-fast in-process TypeScript engine and the distributed Docker microservice cluster.

---

## 3. Recommended Sprint Milestones

```text
SPRINT 1: Production Microservice Wiring (Docker Compose + Live Neo4j/PostGIS drivers)
SPRINT 2: DigiLocker OAuth2 Gateway & Statutory Payment Gateway Integration
SPRINT 3: WhatsApp Actionable Alerts & SMS Query Notification Service
SPRINT 4: Bhashini Voice Assistant (Hindi & Marathi speech-to-text input)
SPRINT 5: CPCB Continuous Online Effluent Monitoring (OCEMS) Telemetry Pipeline
```
