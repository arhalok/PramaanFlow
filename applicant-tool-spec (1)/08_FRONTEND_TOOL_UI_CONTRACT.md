# Frontend ↔ Tool Contract

The AI is not only a text assistant.

Tool results should allow the UI to react.

## Standard assistant event

```ts
type AssistantEvent =
  | {
      type: "message";
      text: string;
    }
  | {
      type: "tool_status";
      tool: string;
      state: "running" | "complete" | "failed";
    }
  | {
      type: "navigate";
      routeId:
        | "HOME"
        | "DISCOVER"
        | "APPLICATION"
        | "DOCUMENTS"
        | "APPROVAL"
        | "TRACKING"
        | "DEPENDENCIES";
      params: Record<string, string>;
    }
  | {
      type: "focus_field";
      applicationId: string;
      fieldId: string;
    }
  | {
      type: "open_document";
      documentId: string;
    }
  | {
      type: "open_approval";
      approvalId: string;
    }
  | {
      type: "confirm_action";
      actionId: string;
      label: string;
      summary: string;
    };
```

## Example

User:
"What am I missing?"

Backend:
```text
application_get_action_required
```

Result:
```json
{
  "items":[
    {
      "type":"DOCUMENT",
      "id":"REQ-22",
      "name":"Site Plan",
      "status":"MISSING"
    }
  ]
}
```

Gemini:
```text
You're missing the site plan.
```

UI action:
```json
{
  "type":"focus_field",
  "applicationId":"APP-123",
  "fieldId":"sitePlan"
}
```

The applicant can click:

**[Fix this now]**

and the UI goes directly to the relevant location.

## Tool status UI

For slow operations:

```text
Reading document...
Checking requirements...
Finding relevant approvals...
```

Do not show internal tool names.

Bad:
```text
Neo4j tool executing
```

Good:
```text
Checking approval dependencies...
```

## Source UI

For regulatory knowledge:

```text
Official source
↓
Source title
↓
Relevant section
↓
[View source]
```

## Confirmation UI

For writes:

```text
Ready to submit

Application
Factory Licence

Documents
✓ Complete

Validation
✓ Passed

[Submit application]
```

Gemini cannot bypass this UI confirmation.

## Deep links

Use internal route builders:

```ts
routes.application(applicationId)
routes.applicationXray(applicationId)
routes.applicationDocuments(applicationId)
routes.document(documentId)
routes.approval(approvalId)
```

Do not allow arbitrary model URLs.
