# Tool Schemas and Result Contracts

## TypeScript / Zod standard

Every tool must expose a runtime schema.

Recommended shared types:

```ts
export type ToolErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "DEPENDENCY_BLOCKED"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "UPSTREAM_ERROR"
  | "STALE_DATA"
  | "CONFIRMATION_REQUIRED";

export interface ToolSource {
  type: "official" | "internal" | "derived";
  title?: string;
  url?: string;
  documentId?: string;
  section?: string;
  retrievedAt?: string;
}

export interface ToolResult<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: ToolErrorCode;
    message: string;
    recoverable: boolean;
    retryAfterSeconds?: number;
    fieldErrors?: Record<string, string>;
  };
  meta: {
    tool: string;
    executedAt: string;
    requestId: string;
    freshness?: string;
    sources?: ToolSource[];
  };
}
```

## Tool definition

```ts
interface AppTool<TInput, TOutput> {
  name: string;
  description: string;
  risk: "READ" | "WRITE_LOW_RISK" | "WRITE_CONFIRM" | "UI_ACTION";
  inputSchema: ZodSchema<TInput>;
  execute: (
    input: TInput,
    ctx: ToolExecutionContext
  ) => Promise<ToolResult<TOutput>>;
}
```

## Execution context

```ts
interface ToolExecutionContext {
  requestId: string;
  userId: string;
  sessionId: string;
  role: "applicant";
  locale: string;
  timezone: string;
  activeProjectId?: string;
  activeApplicationId?: string;
  confirmationToken?: string;
}
```

## Authorization

Every tool must know:

- which role can call it
- which user-owned records it may access
- which businesses/projects/applications are in scope

Never rely on Gemini to enforce authorization.

Server-side authorization is mandatory.

## Freshness

For mutable state, return timestamps/version numbers.

Example:

```json
{
  "applicationVersion": 17,
  "statusUpdatedAt": "2026-09-29T10:20:00Z"
}
```

UI can avoid overwriting newer state.

## Pagination

All list tools must support:

```json
{
  "limit": 20,
  "cursor": "..."
}
```

## Search

Search tools must support:
- query normalization
- filters
- pagination
- result type
- relevance
- source/provenance

## Tool output discipline

Return facts, not long prose.

Good:
```json
{
  "missingDocuments": [
    {
      "requirementId": "REQ-12",
      "name": "Site Plan"
    }
  ]
}
```

Gemini turns that into natural language.

Bad:
```json
{
  "answer": "You seem to be missing a site plan and..."
}
```

Tool results can have a small `displaySummary` for deterministic UI, but the structured facts are authoritative.

## Write idempotency

All mutation tools require:

```text
idempotencyKey
```

Do not perform duplicate writes if the same key has already succeeded.

## Concurrency

All updates should support optimistic concurrency where relevant:

```json
{
  "expectedVersion": 17
}
```

If stale, return `CONFLICT`.

## Confirmation

The server must enforce confirmation.

A model-generated "yes" is not enough.

Use a confirmation flow:

1. Gemini calls a planning/read tool.
2. UI shows exact proposed action.
3. User presses confirm.
4. Frontend receives a short-lived confirmation token.
5. Write tool requires that token.
6. Tool executes.
7. Result is persisted/audited.
