# Applicant UI/UX Design System

## 1. Experience goal

Build a product that feels like:

**NSWS/MAITRI-grade government trust + Palantir-style system clarity + modern SaaS usability**

Do not copy another portal's visuals. Borrow the underlying service design principles: unified access, guided discovery, persistent application context, document reuse, real-time status, query handling and clear service information.

---

# 2. Layout system

Use a predictable desktop grid.

Recommended visual hierarchy:

`Page title → Context → Primary state → Primary action → Supporting information → Advanced detail`

Limit line length for long explanatory text.

Use full-width layouts only when the content genuinely benefits from them.

---

# 3. Page headers

Every major page header should answer:

- What is this page?
- Which business/project is active?
- What is the current status?

Example:

```text
Factory Licence
Mumbai Food Processing Unit
Under review
```

---

# 4. Cards

Cards should represent a meaningful object/state.

Good card objects:

- an approval;
- application;
- document;
- query;
- inspection;
- scheme.

Do not make every tiny piece of information a separate card.

---

# 5. Status design

Use text + icon + subtle visual treatment.

Possible status labels:

- Draft
- Ready
- Submitted
- Under review
- Action required
- Scheduled
- Approved
- Rejected
- Expiring soon

Never communicate important meaning using color alone.

---

# 6. Task vs status

Do not confuse a state with a task.

Example:

`Under department review` = status

`Upload missing site plan` = task

This distinction is crucial.

---

# 7. Primary actions

Each screen should have one dominant action.

Examples:

Home:

`Continue application`

Approval:

`Start application`

Application:

`Continue`

Query:

`Respond`

Renewal:

`Start renewal`

Secondary actions must be visually quieter.

---

# 8. Progressive disclosure

Show simple information first.

Example approval card:

```text
Factory Licence
Why it appears
Status
[View details]
```

Expanded view:

```text
Requirements
Documents
Dependencies
Authority
Official source
```

Advanced detail:

```text
Evidence path
Policy basis
Related graph relationships
```

---

# 9. Maps

Maps must answer a question.

Good map questions:

- Where is my business?
- Which jurisdiction contains this location?
- Where is the relevant authority?
- What service area applies?

Do not add maps for decoration.

---

# 10. Forms

Use short sections and meaningful grouping.

For long services:

- allow save/resume;
- show progress;
- retain answers;
- minimise redundant entry;
- validate inline;
- show correction guidance;
- review before submission.

Use contextual help near complex questions, rather than dumping a help guide at the bottom of the page.

---

# 11. Error UX

Every error must tell the user:

1. What is wrong?
2. Where is it wrong?
3. How can it be corrected?

Bad:

`Invalid input`

Good:

`Enter the 10-digit registration number.`

If multiple errors exist, provide an accessible summary and direct links to each error.

---

# 12. Loading UX

Use skeletons for data-heavy surfaces.

Never make a dashboard appear empty while data loads.

For AI actions:

Show meaningful activity states such as:

`Checking your application...`

`Finding relevant requirements...`

`Looking up official sources...`

But do not expose technical chain-of-thought or internal reasoning.

---

# 13. AI response design

Prefer:

`Answer → Evidence → Action`

Example:

```text
You are missing two documents.

• Site plan
• Factory layout

Source: Approval requirements

[Open documents]
```

Avoid huge AI paragraphs.

---

# 14. Source/evidence drawer

For regulatory answers, use a consistent evidence UI.

```text
Why this result?

System determination

Based on:
Business activity
Selected location
Applicable requirement

Official source
[Open source]

Last updated
[date]
```

The source UI should never imply that a language model itself is the authority.

---

# 15. Confirmation UX

For consequential actions:

- submit application;
- withdraw application;
- upload replacement;
- respond to department;
- change major project context;

show a confirmation/review point.

The user should know what will happen before committing.

---

# 16. Navigation behavior

Support:

- breadcrumbs;
- browser back;
- deep links;
- return-to-context;
- persistent application context.

When the user leaves a section and returns, their previous progress should remain obvious.

---

# 17. Mobile UX

Primary action should remain easy to reach.

Use:

- stacked cards;
- mobile stepper;
- bottom-sheet assistant;
- focused map view;
- compact timelines;
- large tap targets.

Avoid horizontally scrolling giant tables when cards or key-value rows are more appropriate.

---

# 18. Accessibility baseline

Target WCAG 2.2 AA-quality implementation.

Checklist:

- keyboard accessible;
- visible focus;
- semantic HTML;
- explicit labels;
- text error identification;
- error suggestions where known;
- non-color-only status cues;
- accessible progress/timeline semantics;
- meaningful names for controls;
- status announcements.

W3C guidance specifically emphasises keyboard operability, clear error identification/correction and confirmation/correction before consequential submissions. citeturn419145search0turn419145search2turn419145search3

---

# 19. Design language

### Typography

Strong hierarchy; readable body text; avoid tiny metadata.

### Density

Medium density on desktop; low density in first-time applicant flows.

### Color

Use a restrained palette:

- neutral surfaces;
- one primary brand color;
- semantic states for success/warning/error/info.

### Shape

Moderate radius. Avoid excessive "bubble" cards.

### Motion

Use motion for:

- opening detail panels;
- progress changes;
- state transitions;
- successful actions.

Do not use motion to impress the judge when it does not help the user.

---

# 20. Copy principles

Prefer:

`Application under review`

over:

`Your application is currently being processed by the concerned department.`

Prefer:

`2 documents missing`

over:

`Requisite documentation is incomplete.`

Prefer:

`Nothing needed from you right now`

over:

`No pending action is required from the applicant at this point in time.`

---

# 21. Design reference principles from government service UX

The GOV.UK Design System recommends simple, user-focused navigation, task lists only where long processes genuinely benefit from user-controlled task completion, and a dedicated check-answers step before submission. citeturn856523search1turn856523search0turn856523search2

For your product, adapt these patterns to the much richer industrial approval domain rather than copying their visual style.

---

# 22. NSWS / MAITRI reference principles

Current NSWS describes:

- approval discovery via KYA;
- all approvals in one place;
- real-time status tracking;
- a secure document repository;
- easy renewals;
- query management.

MAITRI describes a single-window investor environment with application tracking, common forms, AI assistance, incentive support, centralized documents, compliance and grievance handling.

Your product should meet these baseline expectations and differentiate through:

- jurisdiction intelligence;
- explicit approval reasoning;
- dependency/parallel-path visualization;
- stronger pre-submission validation;
- workflow/inspection transparency;
- document intelligence;
- process intelligence;
- tool-using contextual AI.

References:

- NSWS: https://www.nsws.gov.in/
- NSWS About: https://www.nsws.gov.in/about-us
- MAITRI: https://maitri.mahaonline.gov.in/
- Maharashtra Industries Department MAITRI: https://industry.maharashtra.gov.in/en/allied-offices/maharashtra-industry-trade-and-investment-facilitation-cell-maitri
