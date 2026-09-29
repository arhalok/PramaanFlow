# Applicant AI Copilot and Tool-Calling Specification

## Product role

The AI assistant is a **contextual operator and explainer**, not a general-purpose chatbot.

It should answer, inspect state, retrieve official information, and navigate the user to useful actions.

## Interaction modes

### 1. Explain

`Why do I need this?`

### 2. Inspect

`What is missing?`

### 3. Navigate

`Open the missing documents.`

### 4. Retrieve

`What does this requirement mean?`

### 5. Prepare

`What should I keep ready before submitting?`

### 6. Compare

`Which approvals are connected to this one?`

### 7. Status

`What is happening with my application?`

### 8. Action

Only for supported operations, e.g. opening a section, selecting an existing document, creating a draft, scheduling when allowed.

Sensitive/irreversible actions should require explicit user confirmation.

## Context injected into assistant

The assistant should receive structured context, not the whole database:

```text
user
project
location
jurisdiction
current page
current approval
current application
current stage
pending applicant actions
```

## Tool contract principles

Every tool should:

- be narrowly scoped
- return structured typed data
- fail clearly
- avoid hallucinated state
- provide source metadata when relevant

## Recommended tools

```text
resolve_project_context
resolve_jurisdiction
get_project
get_applicable_approvals
get_approval
get_approval_dependencies
get_application
get_application_timeline
get_application_blockers
get_required_documents
get_user_documents
get_document
extract_document_fields
validate_application
search_knowledge
get_source
get_inspection
get_available_slots
get_notifications
get_renewals
create_draft_application
open_ui_target
```

## UI action protocol

When the assistant knows the user should inspect something, return a structured action.

Example:

```json
{
  "type": "open_ui",
  "target": "application.documents",
  "context": {
    "applicationId": "..."
  }
}
```

Do not return arbitrary JavaScript or unsafe navigation instructions.

## Source-grounding

Regulatory claims should be linked to the source system.

The assistant should say:

`According to [source], ...`

rather than:

`The government requires ...`

unless the exact authoritative status is known.

## Hallucination prevention

The assistant must never invent:

- approval names
- fees
- deadlines
- department decisions
- inspection dates
- eligibility
- official requirements

When data is missing:

`I couldn't verify that from the available official information.`

## Conversational UI

Suggested quick actions should be contextual.

Approval page:

`Why is this relevant?`
`What do I need?`
`Show dependencies`

Application page:

`What is missing?`
`Check my application`
`What happens next?`

Document page:

`What was extracted?`
`Where is this document used?`

## AI response design

Preferred shape:

1. direct answer
2. one or two supporting facts
3. source if relevant
4. action button/deep link

Avoid long essays in the application workflow.
