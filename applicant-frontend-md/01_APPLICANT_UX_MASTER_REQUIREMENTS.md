# Applicant Frontend — Master UX Requirements

## Product

Unified Intelligent Industrial Approvals & Compliance Platform — SIH 2026 PS 26130

## Purpose

This document defines what an entrepreneur / industrial applicant should see and be able to do in the product. It is deliberately written from the **applicant's point of view**, not from the implementation/technology point of view.

The platform must turn a complex multi-department approval journey into a calm, understandable, state-aware digital service.

## 1. Problem-to-UX mapping

The SIH 2026 PS 26130 problem explicitly identifies applicant difficulty around:

- identifying applicable registrations, permissions, licences, NOCs, inspections and renewals;
- understanding documentation requirements;
- monitoring timelines;
- responding to queries;
- accessing incentives/support schemes;
- dealing with approvals whose requirements vary by sector, location, project size and operating stage.

The expected solution explicitly calls for:

- customised approval checklist;
- documentation guidance;
- pre-validation;
- reuse of verified data;
- parallel departmental workflows;
- inspection scheduling;
- SLA tracking;
- alerts;
- one dashboard for applications, approvals, renewals and incentives;
- regulatory knowledge engine;
- risk-based scrutiny;
- common inspection planning;
- grievance escalation;
- analytics for delays.

Therefore the applicant UI must visibly communicate these outcomes. The technologies are implementation details unless they directly help a user understand a decision.

## 2. Applicant mental model

The applicant should experience the product as:

`My Business → My Location → What I need → Why I need it → What I need to provide → What I submitted → What government is doing → What I must do next → What has been approved`

Never expose the user to the system's internal service architecture as the primary navigation model.

## 3. Primary applicant navigation

Keep the global navigation intentionally small:

- Home
- Discover
- Applications
- Documents
- Compliance / Renewals
- Assistant
- Profile / Business

Location and active project/business context should remain visible but compact.

The global navigation is **not a sitemap**. It should contain only the top-level destinations most useful for the applicant.

## 4. Home / applicant workspace

### Required content

1. Active business/project context
2. Current location and jurisdiction
3. Progress of approval journey
4. Immediate action requiring applicant attention
5. Current application states
6. Recently changed items
7. Upcoming deadlines / renewals where known
8. Discovery entry point
9. Document health / missing documents summary
10. Contextual AI assistant entry point

### Adaptive states

#### New applicant

Show a calm setup entry point:

- Business/activity context
- Location
- Approval discovery

Do not display meaningless empty KPIs.

#### Returning applicant

Prioritise "continue where you left off" and the most important unresolved state.

#### Waiting on government

The applicant should see that no action is currently required from them.

Example:

> Under departmental review
> Nothing is required from you right now.

#### Applicant action required

The home page must surface the blocking action clearly and deep-link to it.

## 5. Business/project setup

Use progressive disclosure rather than a large form.

Capture only information required to improve approval identification:

- activity / sector
- project type
- scale / relevant threshold information
- business structure
- premises / land context
- utilities if relevant
- special characteristics that change regulatory applicability
- operating stage

The interface should dynamically adapt its questions according to prior answers.

Do not ask for the same information twice unless legally/security necessary.

## 6. Location and jurisdiction

Location is a first-class product concept because applicability varies by jurisdiction.

Applicant-visible information should include:

- selected business location;
- state;
- district;
- municipality / local authority where applicable;
- relevant jurisdiction(s);
- map representation when useful;
- authority responsible for the selected approval.

Do not display H3, geospatial database, PostGIS or spatial-index terminology to the applicant.

## 7. Approval discovery

The discovery page must answer four questions immediately:

1. What approvals appear relevant?
2. Why do they appear relevant?
3. What do I need to provide?
4. What stage/dependency is associated with them?

### Suggested result grouping

- Likely applicable / important to start
- Location-specific / local
- Sector-specific
- Conditional / depends on configuration
- Pre-operation / operational
- Renewal / periodic compliance
- Government schemes / incentives

### Approval result card

Show:

- approval name;
- issuing authority;
- jurisdiction;
- applicability explanation;
- current applicant status;
- key prerequisites;
- document count/status;
- process stage;
- official source link;
- action.

Do not present a generated approval list as an unquestionable legal determination. Clearly label it as guidance when the underlying rules are advisory.

## 8. Approval details

Every approval detail view should have a structured information architecture:

### Overview

- What this approval is
- Who it is for
- Why it may apply to this applicant

### Requirements

- documents
- information
- declarations
- prerequisites

### Process

- high-level stages
- current stage
- next expected stage

### Dependencies

- prerequisites
- approvals that can happen in parallel
- approvals blocked by this approval

### Authority

- department
- issuing authority
- jurisdiction
- official source
- official contact information when available

### Applicant action

One dominant contextual action such as:

- Start application
- Continue draft
- Upload missing document
- Respond to query
- Renew

## 9. Why this approval?

This should be a first-class explanatory surface.

Show a human-readable evidence trail such as:

`Your activity → selected location → jurisdiction → applicable rule/condition → approval`

The UI must distinguish:

- official source / rule;
- system-derived applicability;
- AI explanation.

Avoid fake numerical certainty. Do not show fabricated confidence percentages.

## 10. Dependency view

Provide an optional visual dependency view for complex projects.

The user should understand:

- prerequisites;
- parallel approvals;
- blocking approvals;
- downstream approvals.

The default representation should be simple and stage-oriented, with an optional graph expansion for users who want detail.

## 11. Application workspace

A started application should become a persistent workspace.

Recommended sections:

- Business information
- Location
- Activity / project details
- Documents
- Validation
- Review
- Declaration
- Submit

Features:

- autosave;
- draft state;
- resume later;
- persistent progress;
- inline validation;
- contextual help;
- clear errors;
- section completion state;
- review before submission.

## 12. Pre-submission validation

The applicant must get a pre-flight check before submission.

Example:

`Ready to submit`

- Required information complete
- Required documents present
- Format checks passed
- Known rule checks passed
- Outstanding warnings shown separately from blockers

Each problem must have:

- field/section reference;
- plain-language explanation;
- correction path.

Do not simply say "Validation failed".

## 13. Document vault

The applicant should have one reusable repository for business/project documents.

Each document can show:

- name;
- document type;
- upload date;
- verification state;
- expiry date if applicable;
- applications using it;
- source / origin where known;
- version / replacement history where useful.

When a required document already exists, offer reuse rather than a new upload.

## 14. Document intelligence

Where supported by the backend, the UI may surface:

- extracted document metadata;
- missing fields;
- document type detected;
- readable text preview;
- page/section references for a source;
- document expiry / stale-data warning;
- consistency conflicts between entered data and document content.

Do not claim a document is "verified" unless the system actually performed the verification represented by that status.

## 15. Application tracking

Each application must have a clear human-readable state machine.

Recommended statuses:

- Draft
- Ready to submit
- Submitted
- Validation
- Under department review
- Inspection pending
- Inspection scheduled
- Clarification requested
- Applicant response pending
- Decision pending
- Approved
- Rejected
- Withdrawn
- Renewal due

Status must be visible in both list and detail contexts.

## 16. Application timeline

Show a chronological timeline with:

- event date/time;
- event type;
- actor/authority category where appropriate;
- applicant action versus departmental action;
- current step;
- latest message/document;
- next relevant action.

The user must be able to tell whether a delay is currently waiting on them, a department, an inspection, a dependency, or another system event.

## 17. SLA / timeline transparency

The PS specifically calls for service-level timeline tracking.

Applicant UI should therefore show, when backed by authoritative data:

- submitted date;
- applicable service timeframe;
- current elapsed time;
- whether applicant action time is excluded where rules say so;
- milestone deadlines;
- overdue state;
- escalation path if applicable.

Never invent SLA values. Store source/version information for the rule that supplies the time limit.

## 18. Inspection experience

For approvals requiring inspection, show:

- inspection required / not required;
- status;
- scheduled date/time window;
- assigned authority status where appropriate;
- preparation checklist;
- location details;
- documents/records to keep ready;
- reschedule mechanism where allowed;
- inspection outcome;
- next process step.

Do not expose the optimisation algorithm, ranking score, or internal staff data unless there is a product/legal reason to do so.

## 19. Query / clarification handling

A department query should be a high-priority case object.

Show:

- requesting authority;
- request date;
- exact requested information;
- response requirement;
- attachments;
- applicant response editor;
- response history;
- status after response.

Make the query a direct action from Home, Notifications and Application Timeline.

## 20. Compliance and renewals

The product should continue after first approval.

Applicant-visible compliance surfaces should include:

- active approvals;
- expiry dates;
- renewal windows;
- recurring obligations;
- pending filings/actions;
- evidence documents;
- status.

Renewals should preserve reusable business/project information and existing documents.

## 21. Schemes / incentives

Because the PS explicitly mentions access to incentives/support schemes, expose a simple discovery area:

- potentially relevant scheme;
- eligibility factors;
- benefit type;
- required evidence;
- application status;
- official source;
- application route.

Do not calculate a monetary benefit unless the underlying rules/data are authoritative enough for the displayed calculation.

## 22. Grievance / escalation

The applicant should have a path for unresolved issues.

Show:

- issue category;
- related application;
- issue description;
- evidence/attachments;
- ticket/status;
- escalation level;
- acknowledgement;
- response history.

A grievance should be traceable to the underlying application/workflow.

## 23. AI assistant

The AI assistant is a **contextual copilot**, not the product itself.

It should answer questions using the current application/business/location context and invoke tools for factual retrieval or action.

Examples:

- "Which approvals are relevant to this project?"
- "Why is this approval on my list?"
- "What documents are still missing?"
- "What is the current status?"
- "What happens next?"
- "Show the source for this requirement."
- "Open the missing document section."

Where a tool action changes important state, present a confirmation step to the user.

## 24. Search

Global search should cover:

- approvals;
- authorities;
- applications;
- documents;
- schemes;
- business/project information.

Support filters such as:

- location;
- department;
- status;
- stage;
- approval type.

## 25. Notifications

Use notifications only for meaningful events:

- clarification requested;
- application status changed;
- inspection scheduled/rescheduled;
- deadline approaching;
- approval granted/rejected;
- document approaching expiry;
- major system/process update.

Every notification should deep-link to the relevant object.

## 26. Trust rules

The product must explicitly separate:

### Official

Information directly sourced from an authoritative government/regulatory source.

### System determination

A result computed by the platform from rules/data.

### AI explanation

A natural-language interpretation generated from retrieved evidence.

This is essential in a regulatory setting.

## 27. Accessibility

Target WCAG 2.2 AA-quality interaction patterns.

Required UX behaviors include:

- keyboard operation;
- visible labels;
- text-based error messages;
- error correction guidance;
- accessible progress/status announcements;
- non-color-only status communication;
- sufficient target sizes;
- predictable focus order;
- screen-reader-friendly semantics;
- confirmation/review before consequential submissions.

## 28. Visual design

Target:

**Government-grade trust + modern enterprise SaaS clarity.**

Use:

- restrained color palette;
- strong typography hierarchy;
- generous spacing;
- clear status treatments;
- subtle motion;
- consistent iconography;
- high readability;
- stable layouts.

Avoid:

- excessive gradients;
- neon effects;
- giant KPI dashboards;
- excessive glassmorphism;
- animation for decoration;
- dense government-form aesthetics.

## 29. Responsive behavior

Desktop, tablet and mobile should be first-class.

On mobile:

- stacked sections;
- sticky primary action where useful;
- document upload easy to reach;
- timeline remains readable;
- maps open as focused panels;
- AI assistant becomes a bottom sheet.

Do not merely scale the desktop interface down.

## 30. Core acceptance test

A first-time applicant should be able to answer, from the UI itself:

- What am I doing?
- Where am I operating?
- Which approvals matter?
- Why do they matter?
- What do I need?
- What have I already provided?
- What can happen in parallel?
- What is blocking me?
- Who is currently responsible for the next step?
- When should something happen?
- What action is required from me?
- Where can I see the official source?

If the answer is not obvious, improve the interface rather than adding more help text.

## Sources

- SIH 2026 PS 26130 — corroborated problem statement text: https://sih2026.vuce.in/ps/SIH26130
- National Single Window System: https://www.nsws.gov.in/
- NSWS About / capabilities: https://www.nsws.gov.in/about-us
- NSWS FAQ: https://www.nsws.gov.in/faqs
- MAITRI Maharashtra: https://maitri.mahaonline.gov.in/
- Maharashtra Industries Department — MAITRI: https://industry.maharashtra.gov.in/en/allied-offices/maharashtra-industry-trade-and-investment-facilitation-cell-maitri
- GOV.UK Design System task list: https://design-system.service.gov.uk/components/task-list/
- GOV.UK Check answers: https://design-system.service.gov.uk/patterns/check-answers/
- GOV.UK service navigation: https://design-system.service.gov.uk/patterns/navigate-a-service/
- W3C WCAG 2.2: https://www.w3.org/TR/wcag/
