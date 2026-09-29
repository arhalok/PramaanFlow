# AI Agent Architecture

## 1. Principle

AI agents assist the workflow but do not own statutory truth.

The authoritative chain is:

```text
Source documents
      ↓
Structured regulatory data
      ↓
Rules / OPA
      ↓
Workflow / Temporal
      ↓
Human or system action
```

Agents may interpret, retrieve, explain and prepare. They must call deterministic services for decisions.

## 2. Recommended agents

### Regulatory Research Agent

Responsibilities:

- search regulatory corpus;
- retrieve cited sources;
- summarize applicable provisions;
- suggest candidate approvals for review.

Must not finalize applicability independently.

Tools:

```text
searchRegulations
getRegulatoryDocument
getRegulatoryChunk
queryNeo4j
getJurisdiction
```

### Applicability Orchestrator Agent

Input:

```text
ProjectContext
```

Flow:

```text
ProjectContext
 ↓
resolve jurisdiction
 ↓
retrieve candidate rules
 ↓
call OPA
 ↓
query dependency graph
 ↓
assemble ApprovalPlan
```

The final output must be the structured result of deterministic services.

### Document Assistant Agent

Responsibilities:

- explain missing documents;
- summarize extraction results;
- explain validation failures;
- draft remediation instructions.

Tool restrictions:

The agent cannot mark a document `VERIFIED` directly. It requests the document-validation service.

### Applicant Guidance Agent

Responsibilities:

- answer questions using cited RAG evidence;
- explain next actions;
- summarize application status;
- draft query responses.

For “What approvals do I need?” call applicability APIs instead of free-form RAG.

### Department Copilot

Responsibilities:

- summarize case history;
- summarize submitted documents;
- explain workflow blockers;
- surface SLA risk;
- summarize inspection findings.

The agent must not silently make a final administrative decision.

### Query Resolution Agent

Responsibilities:

- classify query;
- identify likely missing evidence;
- draft applicant-facing explanation;
- check response completeness before submission.

Use deterministic validation for actual acceptance.

## 3. Agent tool contracts

Define tools as APIs, not direct DB access.

Example:

```ts
const tools = {
  getProjectContext,
  evaluateApplicability,
  retrieveRegulatoryEvidence,
  getApprovalDependencyGraph,
  validateDocument,
  getVerifiedFacts,
  getApplicationState,
  calculateSla,
  createInspectionRequest,
  optimizeInspectionSchedule,
  getComplianceObligations,
};
```

Do not give an LLM arbitrary SQL, Cypher, shell or filesystem access in production.

## 4. Agent state

Keep durable business state in PostgreSQL/Temporal. Do not treat chat history as the source of application state.

## 5. RAG tool response

Every regulatory retrieval tool must return:

```ts
interface EvidenceResult {
  content: string;
  sourceDocumentId: string;
  page?: number;
  section?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  authority?: string;
  jurisdiction?: string;
}
```

## 6. Agent guardrails

Reject or escalate when:

- no authoritative source exists;
- sources conflict;
- effective dates conflict;
- jurisdiction is ambiguous;
- applicability depends on an unavailable fact;
- a requested action requires a human decision.

## 7. Agent observability

Record:

- agent name/version;
- model name/version;
- tool calls;
- tool results IDs;
- retrieved source IDs;
- latency;
- token usage where available;
- final structured outcome;
- human override if any.

Never store sensitive prompt content unnecessarily.

## 8. Human-in-the-loop points

Require or allow human review for:

- ambiguous regulatory applicability;
- conflicting documents;
- high-impact policy decisions;
- infeasible inspection schedules;
- disputed grievances;
- final government determinations where required by procedure.

## 9. Anti-hallucination contract

The UI must distinguish:

`DETERMINISTIC RESULT`
`AI EXPLANATION`
`SOURCE EVIDENCE`
`HUMAN DECISION`

Do not collapse them into one generic “AI answer.”
