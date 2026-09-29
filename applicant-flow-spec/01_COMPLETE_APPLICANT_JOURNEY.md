# Complete Applicant Journey

## The master journey

The applicant should experience one continuous story:

`Enter -> Establish context -> Discover -> Understand -> Prepare -> Validate -> Apply -> Track -> Respond -> Decide -> Maintain`

The interface should preserve context across every stage.

---

# FLOW 0 — ENTRY / FIRST IMPRESSION

## Goal

Let a new user understand the product in under 10 seconds.

## Screen

### Header

- product identity
- language
- help
- sign in/profile

### Hero

Use human language:

`Set up your business approvals in one place.`

Supporting copy should explain the value, not the technology.

Primary actions:

- `Start your journey`
- `Sign in`

Secondary exploration:

- Browse approvals
- Learn how it works

## UX behavior

Do not immediately expose a giant questionnaire.

Start with intent and context.

---

# FLOW 1 — CREATE OR SELECT BUSINESS PROJECT

## Goal

Create a persistent project context so the applicant can return later.

## Screen

`New project`

Ask:

- business/project name
- activity/industry
- project stage

Keep the initial capture lightweight.

Create a project workspace immediately.

## Result

`Project ID` exists in backend state.

All later data must be linked to the project.

---

# FLOW 2 — LOCATION + JURISDICTION

## Goal

Resolve the project location and relevant jurisdiction early enough to influence approval discovery.

## UI

```text
Where is your project located?

[ Use current location ]
[ Search address ]
[ Enter address manually ]
```

Once selected:

```text
Project location
Jaipur, Rajasthan

Administrative context
State: Rajasthan
District: Jaipur
Local body: ...
Relevant jurisdiction: ...
```

## Backend connection

`Location -> GIS/PostGIS -> H3 cell -> jurisdiction resolver -> authority context`

## Applicant benefit

The user does not need to know which local authority applies.

## Important edge cases

- permission denied for current location
- ambiguous place name
- location outside supported region
- incomplete address
- jurisdiction boundary ambiguity

For ambiguity, let the user confirm instead of silently choosing.

---

# FLOW 3 — BUSINESS / PROJECT CONTEXT

## Goal

Collect enough information to identify applicable approvals without asking every possible question.

## Progressive questions

Example dimensions:

- activity
- scale/capacity
- business type
- land/premises status
- ownership/lease status where relevant
- construction/building characteristics where relevant
- utilities where relevant
- workforce where relevant
- environmental characteristics where relevant

## Interaction model

Use a conversational questionnaire with structured controls, not an unbounded chat.

For each answer:

`Answer -> update context -> recompute applicable conditions -> reveal next relevant question`

## UI pattern

Question on left/main area; context and progress on side.

Show:

`Step 3 of 7`

Do not show irrelevant questions.

---

# FLOW 4 — ANALYSIS / DISCOVERY

## Goal

Transform applicant context into a personalized approval universe.

## Transition state

Display a short processing state:

`Reviewing your business context...`

Then show results.

## Approval categories

1. Likely required
2. Conditional / depends on setup
3. Recommended to review
4. Later-stage / post-establishment
5. Renewal / recurring compliance

Avoid presenting uncertain items as mandatory.

## Result summary

```text
We found 9 approvals to review

5 likely applicable
3 conditional
1 later-stage
```

---

# FLOW 5 — APPROVAL EXPLORATION

## Goal

Let the applicant understand each approval before deciding to start it.

## Card

```text
Approval name
Authority
Status
Why it may apply
Documents count
Dependencies
Estimated stage

[View details]
```

## Detail page sections

1. What this is
2. Why it may apply
3. Who handles it
4. Requirements
5. Documents
6. Fees (when known)
7. Dependencies
8. Process
9. Official source
10. Application action

## Explainability

Include:

`Why am I seeing this?`

Then display the contributing context.

---

# FLOW 6 — DEPENDENCY / JOURNEY VIEW

## Goal

Explain relationships between approvals without requiring legal/process expertise.

## UI

Use an interactive but restrained graph/timeline.

Example:

```text
Project setup
   |
   +---- Site / premises
   |        |
   |        +---- Building approval
   |
   +---- Environmental
   |
   +---- Factory / operational approval
```

Allow:

- click node
- show why it is connected
- show dependency status
- open approval detail

Do not make graph the only representation. Always offer a list/step representation.

---

# FLOW 7 — PREPARATION / READINESS

## Goal

Before the applicant starts a serious application, show whether they are ready.

## Readiness screen

```text
Application readiness

Business details          ✓
Location                  ✓
Required documents        ⚠ 2 missing
Policy checks             ✓
Prerequisites             ✓

Readiness: Almost ready
```

## Actions

- fix issue
- add document
- review source
- continue later

The system should prefer correction before submission.

---

# FLOW 8 — DOCUMENT VAULT

## Goal

Capture documents once and reuse them.

## Vault capabilities

- upload
- preview
- extracted metadata
- verification state
- expiry date
- used by applications
- replace
- archive
- reuse

## Smart reuse

When an application needs a document already present:

`Existing document found`

Show:

- document type
- upload date
- verification state
- expiry

Primary action:

`Use existing document`

## Document intelligence

Docling-backed extraction can produce structured fields for applicant review. Never silently modify applicant information.

---

# FLOW 9 — APPLICATION WORKSPACE

## Goal

Make a complex application feel like a guided checklist rather than a long form.

## Structure

```text
Application

1 Business
2 Project/location
3 Activity
4 Requirements
5 Documents
6 Review
7 Declaration
8 Submit
```

## Persistent context

Top bar should show:

- approval name
- project name
- save status
- completion indicator

Example:

`Saved automatically · Last saved 1 min ago`

## Form behavior

- autosave
- inline validation
- clear labels
- contextual help
- save/exit
- continue later
- back
- review before submit

---

# FLOW 10 — PRE-SUBMISSION X-RAY

## Goal

Catch avoidable failures before submission.

## Screen

`Application X-Ray`

Sections:

```text
Identity & project data          ✓
Required fields                  ✓
Document completeness            ⚠
Policy/eligibility checks        ✓
Internal consistency             ⚠
```

For each issue:

- severity
- explanation
- exact location
- suggested correction

Primary action:

`Fix issues`

Never claim that this guarantees government approval. It only checks known rules/data quality.

---

# FLOW 11 — REVIEW

## Goal

Let applicant verify what will be submitted.

Use a read-only summary with edit links.

Example:

```text
Business information       [Edit]
Location                   [Edit]
Documents                  [View]
Declarations               [View]
```

At bottom:

- declaration
- consent where applicable
- submit

Submission should be an explicit commitment.

---

# FLOW 12 — SUBMISSION

## Goal

Give confidence that submission happened.

## Success screen

```text
Application submitted

Application ID
XXXX

Submitted on
29 Sep 2026

Next stage
Department review
```

Actions:

`Track application`
`Back to project`

Also create backend event:

`APPLICATION_SUBMITTED`

---

# FLOW 13 — TRACKING

## Goal

Replace uncertainty with an understandable status model.

## Application page

Show:

- current status
- timeline
- last updated
- authority
- next expected stage
- applicant action requirement
- documents
- communication history

## Status semantics

Recommended statuses:

`Draft`
`Submitted`
`Validation`
`Under review`
`Inspection pending`
`Inspection scheduled`
`Clarification required`
`Decision pending`
`Approved`
`Rejected`
`Withdrawn`
`Expired`

Do not invent internal statuses that applicants cannot understand.

---

# FLOW 14 — SLA / DEADLINE AWARENESS

## Goal

Show time information without making unsupported promises.

Example:

```text
Application timeline

Submitted: 26 Sep
Authority target/defined timeline: 15 working days
Elapsed: 3 working days
```

Use wording such as:

- authority-defined timeline
- expected stage
- elapsed time
- deadline if one exists

Do not promise approval by a date unless the source data explicitly establishes that.

---

# FLOW 15 — INSPECTION

## Goal

Let applicants understand inspection requirements and status.

Possible states:

`Inspection required`
`Being scheduled`
`Scheduled`
`Completed`
`Report pending`

If scheduling is supported, show:

```text
Inspection

Jurisdiction: ...
Date: ...
Time window: ...
Status: Scheduled
```

Do not expose inspector optimization internals.

If rescheduling is allowed, use controlled action with clear policy boundaries.

---

# FLOW 16 — CLARIFICATION / ACTION REQUIRED

## Goal

When the authority asks for something, the applicant should immediately understand the issue.

Notification:

`Action required · Factory approval`

Detail:

- who requested it
- what is requested
- why it is requested if available
- date
- due date if authoritative
- files/messages

Primary action:

`Respond`

Response workflow:

`read -> attach/update -> review -> submit response`

---

# FLOW 17 — AI ASSISTANCE

## Goal

Make the assistant contextual and operational.

The assistant must know the current project/application context.

Examples:

`What am I missing?`

`Why is this approval relevant?`

`Show me the documents required for this application.`

`What stage is my application in?`

`Open the issue preventing submission.`

Responses should contain actions/deep links when possible.

The AI should use the backend tools instead of fabricating state.

---

# FLOW 18 — RAG / SOURCE EXPLANATION

When an answer comes from regulatory knowledge, show:

- concise answer
- source title
- source authority
- source date/version when known
- relevant excerpt or summary
- confidence/limitations where useful

Avoid presenting vector retrieval itself as evidence.

Evidence comes from the source document, not from the embedding.

---

# FLOW 19 — RENEWAL / COMPLIANCE

Applicant home can surface:

`2 approvals approaching renewal`

Each item should show:

- approval
- expiry
- renewal eligibility/status
- required documents
- action

Only show when backed by real application/approval data.

---

# FLOW 20 — SCHEMES / INCENTIVES

Provide a contextual discovery section only where data is available.

Example:

`Potentially relevant schemes`

For each:

- scheme name
- eligibility summary
- why surfaced
- official source
- required documents

Do not label a scheme "eligible" unless the underlying rules actually support that conclusion. Use "may be relevant" or "review eligibility" when appropriate.

---

# FLOW 21 — GRIEVANCE / ESCALATION

The applicant should never be trapped when a process stalls.

Provide:

- issue type
- application/project reference
- description
- evidence/attachments
- previous history
- escalation state
- acknowledgement/reference ID

Example:

`Report an issue`

Then show:

`Submitted -> Acknowledged -> Under review -> Resolved/Closed`

---

# FLOW 22 — PROJECT CHANGE IMPACT

A high-value advanced feature.

Applicant edits a major project attribute, for example:

- location
- business activity
- capacity
- premises type

Before applying the change, show:

```text
This change may affect your approval plan

+2 approvals may become relevant
1 existing approval may need review
3 application requirements may change
```

Then allow:

`Review impact`

This can be backed by graph/rules/jurisdiction recalculation.

---

# FLOW 23 — COMPLETION

Approval screen should not look like a dead end.

Show:

`Approved`

Then:

- approval artifact/document
- issuing authority
- issue date
- validity/expiry when known
- next compliance/renewal event
- related approvals

Primary action:

`Back to project`

The project dashboard then updates.

---

# CROSS-FLOW RULE

At all times the applicant should be able to answer:

1. What project am I working on?
2. Which approval/application am I viewing?
3. What state is it in?
4. What has happened?
5. What requires me?
6. What can I do now?
7. What evidence/source supports the guidance?

If a screen does not answer those naturally, redesign it.
