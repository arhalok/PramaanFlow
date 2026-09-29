# Applicant Information Architecture & Screen Specification

## Goal

Define exactly which screens should exist, what each screen communicates, and what the applicant should be able to do.

---

# 1. Entry / Landing

## Purpose

Explain the service in one sentence and allow the user to enter quickly.

### Visible

- product purpose;
- concise trust statement;
- Start / Sign in;
- resume existing journey;
- supported service scope;
- official/source information where useful.

### Do not show

- architecture diagrams;
- backend technology;
- excessive marketing cards;
- technical jargon.

---

# 2. Onboarding / business context

## Screen sequence

### Step 1 — Business / project

Capture high-value context.

### Step 2 — Location

Search/select/map.

### Step 3 — Activity

Sector/activity/project type.

### Step 4 — Relevant details

Only ask questions that materially change the approval set.

### Step 5 — Results

Generate the applicant's approval workspace.

---

# 3. Home

```text
------------------------------------------------
Header: Business + Location
------------------------------------------------
Your approval journey
Progress / current phase

Action requiring attention

Active applications

Approvals to review

Upcoming deadlines / renewals

Recent activity

Ask the assistant
------------------------------------------------
```

Home is a **decision surface**, not a KPI wall.

---

# 4. Discover

Tabs / filters:

- All relevant
- Required / important
- Conditional
- Local / jurisdiction
- Sector-specific
- Renewals
- Schemes / incentives

Each card opens Approval Details.

---

# 5. Approval details

Sections:

1. Overview
2. Why it appears
3. Eligibility / applicability
4. Documents
5. Information required
6. Prerequisites
7. Parallel approvals
8. Process
9. SLA / timeline rule if available
10. Authority
11. Official source
12. Start / continue action

---

# 6. Dependency explorer

Default:

```text
Current project
     ↓
Prerequisites
     ↓
Current approval
     ↓
Dependent approvals
```

Advanced mode:

Interactive relationship graph.

User can select any node to inspect why it is connected.

---

# 7. Application workspace

Persistent left or top section navigation:

- Details
- Location
- Documents
- Validation
- Review
- Submit

Persistent context:

`Application ID`
`Current status`
`Last saved`
`Progress`

---

# 8. Validation center

Use three levels:

### Blocking

Cannot submit.

### Warning

May need attention but does not block.

### Passed

Requirement/check passed.

Each item links directly to the correction.

---

# 9. Check answers / review

Show a human-readable summary before submission.

Every section has a Change action.

Important consequences are visible before final submission.

---

# 10. Documents

Primary tabs:

- All documents
- Required now
- Expiring soon
- Used by applications

Actions:

- Preview
- Upload
- Replace
- Reuse
- Download

Optional smart panel:

`Information extracted from this document`

---

# 11. Applications

Views:

- All
- Drafts
- Under review
- Action required
- Approved
- Rejected
- Renewal due

Use cards for small result sets and a compact table/list when the user has many applications.

---

# 12. Application detail

Header:

`Approval name`
`Application ID`
`Status`
`Jurisdiction`

Main:

- progress;
- timeline;
- current owner category / authority status;
- latest update;
- applicant actions;
- documents;
- communications;
- SLA/time information;
- official decision document when available.

---

# 13. Query / clarification

The screen must prioritise:

- what is being asked;
- who asked;
- when;
- what must be supplied;
- response status.

Then:

- response;
- attachment;
- review;
- submit.

---

# 14. Inspection

Show a focused appointment/work item page:

- reason / requirement for inspection;
- date/time window;
- location;
- preparation checklist;
- contact/authority info if available;
- reschedule;
- status;
- outcome.

---

# 15. Compliance / renewals

For every live approval, surface:

- validity;
- expiry;
- renewal start window;
- pending compliance actions;
- associated documents;
- links to source/rule.

---

# 16. Incentives / schemes

Display opportunity cards only when the user context is relevant.

Each card:

- scheme name;
- benefit type;
- eligibility factors;
- evidence required;
- official source;
- application action.

---

# 17. Notifications

Keep one priority stream.

Priority order:

1. Applicant action required
2. Deadline/expiry risk
3. Status change
4. Information/update

Avoid notification overload.

---

# 18. Search

Search results should be grouped by entity:

`Approvals`
`Applications`
`Documents`
`Authorities`
`Schemes`

Provide direct actions and deep links.

---

# 19. Assistant

The assistant should remain available from every major context.

Context passed automatically:

- current business/project;
- location/jurisdiction;
- current application/approval;
- current page.

Suggested prompts should change according to context.

---

# 20. Profile / business context

Sections:

- Applicant
- Business
- Projects
- Locations
- Organisation/member access if implemented
- Preferences
- Security

Do not mix business configuration with government application workflow unnecessarily.
