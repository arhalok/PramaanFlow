# Tool Security, Guardrails and Audit

## Never trust the model

Gemini is an untrusted caller from the backend's security perspective.

Every tool execution must independently enforce:

- authentication
- authorization
- ownership
- input validation
- data scope
- business rules
- write confirmation
- rate limits
- audit

## Tool permission matrix

| Category | Risk | Confirmation |
|---|---|---|
| Read profile | READ | No |
| Search knowledge | READ | No |
| Discover approvals | READ | No |
| Read application | READ | No |
| Read documents | READ | No |
| Reuse document | WRITE_LOW_RISK | Usually no |
| Update draft | WRITE_LOW_RISK | Usually no |
| Upload document | WRITE_LOW_RISK | No |
| Create application draft | WRITE_LOW_RISK | No |
| Submit application | WRITE_CONFIRM | Yes |
| Respond to clarification | WRITE_CONFIRM | Yes |
| Schedule inspection | WRITE_CONFIRM | Yes |
| Raise grievance | WRITE_CONFIRM | Yes |

## PII

Tools should return the minimum data necessary.

Do not send:
- unnecessary identity data
- sensitive document contents
- internal notes
- officer personal information
- private system metadata

to Gemini.

## Prompt injection in documents

Treat uploaded documents and retrieved regulatory text as untrusted content.

A PDF may contain instructions such as:

"Ignore previous instructions..."

Never allow retrieved content to modify tool permissions or system behavior.

Retrieved content is DATA, not INSTRUCTIONS.

## Source trust

For regulatory answers:
- prefer official sources
- preserve provenance
- include source IDs
- include retrieval timestamp
- distinguish official text from model explanation

## Audit record

Store:

```json
{
  "requestId":"...",
  "userId":"...",
  "tool":"application_submit",
  "inputHash":"...",
  "result":"SUCCESS",
  "createdAt":"...",
  "applicationId":"...",
  "confirmationUsed":true
}
```

Do not store raw sensitive payloads unless required.

## Tool errors

Never hide an error by generating an answer.

Example:

Bad:
"The application has been submitted."
when submission tool failed.

Good:
"I couldn't submit the application because the service is temporarily unavailable. Your draft is still saved."

## Rate limiting

Protect:
- knowledge search
- document processing
- AI tool calls
- global search
- expensive graph queries

Use per-user/session limits and server-side enforcement.
