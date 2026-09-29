# Developer & AI Continuation Guide
## How Human Engineers and AI Agents Can Continue, Extend, and Deploy PramaanFlow

> **Document Version:** 2.0.0  
> **Target Audience:** Future AI Agents, Onboarding Engineers, and Core Maintainers  
> **Status:** Operational Runbook  

---

## 1. Quickstart & Local Environment Setup

### 1.1 Prerequisites
* **Node.js:** v18.17.0+ or v20+ (v24 LTS supported)
* **Package Manager:** `npm` (version 9+ or 10+)
* **Operating System:** Windows (PowerShell), macOS, or Linux
* **Optional Microservice Dependencies:** Docker & Docker Compose (for PostgreSQL/PostGIS, Neo4j, OPA, Temporal)

### 1.2 Running the Application Locally

```bash
# 1. Clone repository and navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example or create .env.local
cp .env.example .env.local

# 4. Start Next.js development server
npm run dev

# 5. Access the application in your browser
# URL: http://localhost:3000
```

### 1.3 Key Environment Variables (`frontend/.env.local`)

```env
# Gemini API Key for Contextual AI Copilot & Natural Language Autofill
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Service URLs (When running standalone microservices)
DATABASE_URL=postgresql://pramaan:pramaan_secret@localhost:5432/pramaanflow
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=pramaan_secret
OPA_URL=http://localhost:8181
TEMPORAL_HOST=localhost:7233
DOCLING_SERVICE_URL=http://localhost:8001
OPTIMIZER_SERVICE_URL=http://localhost:8002
PROCESS_MINING_URL=http://localhost:8003
```

> **Note:** PramaanFlow features a high-fidelity **in-process deterministic engine fallback**. The frontend will compile and run with 100% functionality even if external microservice containers are not running!

---

## 2. Five Invariant Rules for AI Agents & Developers

When an AI agent or engineer continues working on this repository, they **MUST** observe these five invariant rules:

### Rule 1: Zero Hallucinated Laws or Approvals
* You must **NEVER** invent fictitious approval names, legal citations, or statutory timelines to make an interface look functional.
* Ground all regulatory requirements in actual Indian statutory law:
  * Water (Prevention & Control of Pollution) Act 1974.
  * Air (Prevention & Control of Pollution) Act 1981.
  * Factories Act 1948 & Maharashtra Factories Rules 1963.
  * Maharashtra Industrial Development Act 1961 (MIDC Act).
  * Maharashtra Right to Public Services Act 2015 (RTS Act).

### Rule 2: Strict Jargon Isolation on Applicant Surfaces
* Technical systems terms (*Dependency DAG*, *Project Twin*, *Pre-Flight X-Ray*, *OPA Rego*, *H3 Hexagon*, *Statutory Activity Stream*) **MUST NEVER** appear on the applicant surface.
* Always translate to human-centric language:
  * *Dependency DAG* → **Approval Sequence / Route**
  * *Project Twin* → **Project Profile**
  * *Pre-Flight X-Ray* → **Check Before Submission**
  * *Statutory Activity Stream* → **Recent Updates**

### Rule 3: Zero TypeScript Compiler Errors (`npx tsc --noEmit`)
* Before finishing any task or committing changes, run:
  ```bash
  cd frontend && npx tsc --noEmit
  ```
* The command **must exit with code 0**. No implicit `any` types, missing interface properties, or unhandled null checks.

### Rule 4: Uniform Tool Envelope (`ToolResult<T>`)
* Any new tool added to `src/lib/applicant-tools/` must return the standardized `ToolResult<T>` envelope containing `ok`, `data`, `error`, and `metadata` (`toolName`, `source`, `riskLevel`, `latencyMs`, `statutoryActs`).

### Rule 5: Preserve the Multi-Persona Architecture
* Do not merge or destroy the **Government Command** (`GovernmentCommand.tsx`), **Inspector Workspace** (`InspectorWorkspace.tsx`), or **Judge Demo Stepper** (`JudgeDemoStepper.tsx`).
* The platform must allow switching between Applicant, Government Officer, Inspector, and GIS Map at any time.

---

## 3. Step-by-Step Extension Recipes

### Recipe A: Adding a New Regulatory Clearance

To add a new statutory clearance (e.g., *Central Ground Water Authority (CGWA) Borewell NOC*):

1. **Update Catalog in [regulatory-data.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/regulatory-data.ts):**
   ```typescript
   export const CGWA_NOC: ApprovalNode = {
     id: "cgwa-noc",
     name: "Groundwater Extraction NOC",
     shortCode: "CGWA-NOC",
     department: "Central Ground Water Authority (Ministry of Jal Shakti)",
     status: "NOT_STARTED",
     slaDays: 45,
     act: "Environment (Protection) Act 1986 / CGWA Guidelines 2020",
     dependencies: ["midc-poss"], // Prerequisite: Needs land possession first
     downstream: ["cte-mpcb"],
     requiredDocuments: [
       "Hydrogeological Assessment Report",
       "Water Balance Diagram",
       "Rainwater Harvesting Plan"
     ],
     whyRequired: {
       rule: "Borewell Extraction Exceeding 10 KLD",
       clause: "Mandatory NOC under CGWA Guidelines for notified over-exploited assessment units."
     }
   };
   ```
2. **Update Dependency Traversal:** Add `CGWA_NOC` to `INITIAL_APPROVALS` and link downstream dependencies.
3. **Update Roadmap Generator in [project-state.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/project-state.ts):** Add a conditional trigger if `project.waterRequiredKld > 10` and source is ground water.

---

### Recipe B: Adding a New Applicant AI Tool

1. **Define Schema in [schemas.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/applicant-tools/schemas.ts):**
   ```typescript
   export const WaterSourceAssessSchema = z.object({
     projectId: z.string().min(1),
     borewellExtractionKld: z.number().min(0)
   });
   export type WaterSourceAssessInput = z.infer<typeof WaterSourceAssessSchema>;
   ```
2. **Implement Domain Handler in [domain-services.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/applicant-tools/domain-services.ts):**
   ```typescript
   export async function assessWaterSourceRequirements(input: WaterSourceAssessInput) {
     const needsCgwa = input.borewellExtractionKld > 10;
     return {
       needsCgwaNoc: needsCgwa,
       applicableAct: "CGWA Guidelines 2020",
       estimatedFeeInr: needsCgwa ? 10000 : 0
     };
   }
   ```
3. **Register Tool in [registry.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/applicant-tools/registry.ts):**
   Add to `APPLICANT_TOOLS_CATALOG` and wire into `executeApplicantTool` switch statement.

---

### Recipe C: Adding a New Industrial Zone to the Geospatial Engine

In [maharashtra-geospatial.ts](file:///c:/Users/Vipin%20kumar/Downloads/ps132/frontend/src/lib/maharashtra-geospatial.ts):
1. Define the polygon bounding box / coordinates array:
   ```typescript
   export const SITAPURA_INDUSTRIAL_AREA_JAIPUR: IndustrialPolygon = {
     name: "Sitapura Industrial Area, Jaipur",
     state: "Rajasthan",
     district: "Jaipur",
     taluka: "Sanganer",
     planningAuthority: "RIICO (Rajasthan State Industrial Development & Investment Corp.)",
     environmentalOffice: "RSPCB Regional Office Jaipur South",
     statutoryAct: "Rajasthan Industrial Areas Allocation Rules 1959",
     polygon: [
       [26.7750, 75.8200],
       [26.7850, 75.8350],
       [26.7700, 75.8450],
       [26.7600, 75.8300]
     ],
     exemptions: [
       "Gram Panchayat NOC exempt under RIICO Notification",
       "Pre-cleared drainage outfall into RIICO Common Effluent Pipeline"
     ]
   };
   ```
2. Add to `ALL_KNOWN_INDUSTRIAL_ZONES` array. Point-in-polygon containment and H3 indexing will automatically resolve any factory placed inside this polygon.

---

## 4. Pre-Commit Verification Checklist

Before submitting code, executing git pushes, or presenting demonstrations:

* [ ] `cd frontend && npx tsc --noEmit` exits with **0 errors**.
* [ ] Next.js server compiles cleanly without missing imports or dynamic SSR failures.
* [ ] Verify `http://localhost:3000` returns HTTP 200 OK.
* [ ] Click through:
  * **+ Start New Project** → 5-step wizard finishes cleanly and updates active project.
  * **Action-First Dashboard** → "Your Next Step" banner and 3 task cards respond.
  * **See What They Asked →** → Query modal opens, selects 100 KLD, and submits.
  * **Judge Demo Stepper** → Scenes 1 through 10 advance without runtime crashes.
* [ ] Ensure all modified files have Github markdown links in documentation reports.
