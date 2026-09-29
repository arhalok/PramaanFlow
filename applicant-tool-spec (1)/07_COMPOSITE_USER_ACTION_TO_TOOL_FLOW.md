# User Intent → Tool Flow Matrix

This file connects the applicant's natural-language intent to the exact tool sequence.

## "I want to open a factory in Jaipur."

```text
project_create_draft
↓
location_search / location_resolve
↓
project_confirm_context
↓
approval_discover
↓
dependency_get_for_project
```

UI:
Project summary + jurisdiction + relevant approvals.

---

## "What approvals do I need?"

```text
project_get
↓
jurisdiction_get_for_project
↓
approval_discover
```

UI:
Personalized approval list.

---

## "Why do I need this approval?"

```text
approval_get
+
approval_get_applicability
+
knowledge_answer_with_sources
```

UI:
Why it applies + requirements + official sources.

---

## "What documents do I need?"

```text
approval_get_requirements
↓
document_find_reusable
```

UI:
Required documents + already available documents.

---

## "Find my GST certificate."

```text
document_search
↓
ui_open_document
```

---

## "Use my existing GST certificate."

```text
document_search
↓
document_match_to_requirement
↓
document_reuse
```

UI:
Existing file attached to requirement.

---

## "Upload these documents."

```text
frontend upload
↓
document_upload
↓
document_process
↓
document_classify
↓
document_get_extraction
```

UI:
Processing → extracted information → confirmation.

---

## "Can I submit?"

```text
application_validate
↓
application_xray
```

UI:
Ready / blocked + exact issues.

---

## "What am I missing?"

```text
application_get_action_required
```

UI:
Only genuine outstanding applicant actions.

---

## "Take me to the missing site plan."

```text
application_get_action_required
↓
ui_focus_field
```

---

## "Continue my application."

```text
application_get_workspace_context
↓
ui_open_route
```

---

## "Why is my application waiting?"

```text
application_get_tracking_context
↓
if needed: knowledge_answer_with_sources
```

UI:
Current stage + actual reason/state + next event.

---

## "When is my inspection?"

```text
inspection_get_status
```

---

## "Book my inspection."

```text
inspection_get_available_slots
↓
show choices
↓
user confirms
↓
inspection_schedule
↓
application_get_tracking_context
```

---

## "The application is delayed. I want to complain."

```text
grievance_get_eligibility
↓
grievance_create_draft
↓
show summary
↓
user confirms
↓
grievance_submit
```

---

## "What is still pending?"

```text
application_get_action_required
+
application_get_tracking_context
```

---

## "Search for an environmental approval."

```text
global_search
```

---

## "What is the official requirement for X?"

```text
knowledge_answer_with_sources
```

---

## "What should I do next?"

Context decides:

If active application:
```text
application_get_next_step
```

If new project:
```text
approval_discover
```

If clarification:
```text
application_get_action_required
```

If inspection:
```text
inspection_get_available_slots
```

---

# Important routing rule

Do not call tools merely because keywords match.

Use:

- current page context
- authenticated user
- active project
- active application
- intent
- entity references
- required data availability

Example:

User says:
"Show my documents."

Use:
```text
document_list
```

User says:
"What document do I need for this approval?"

Use:
```text
approval_get_requirements
```

Those are different intents.
