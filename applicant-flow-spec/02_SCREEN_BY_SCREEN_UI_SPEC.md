# Screen-by-Screen Applicant UI Specification

## 01 Landing

### Purpose
Explain the product promise and create confidence.

### Layout
- institutional header
- concise hero
- one primary CTA
- secondary browsing route
- trust/source strip
- simple "how it works" sequence

### Avoid
- giant feature grid
- technology showcase
- excessive animation

---

## 02 Login / Registration

### Purpose
Low-friction secure entry.

### UX
- sign in/register
- persistent project context after authentication
- meaningful validation
- accessible error summaries

---

## 03 Project Selector

Show existing projects as workspaces.

```text
My projects

Food Processing Unit
Jaipur
3 active applications

Retail Expansion
...
```

Primary CTA: `New project`

---

## 04 Applicant Home

### Above fold
1. project context
2. current journey state
3. action-needed area
4. continue action

### Below fold
- applications snapshot
- approvals overview
- documents needing attention
- renewals
- activity

Do not show empty KPI cards.

---

## 05 Discover

Main question:

`What are you planning to do?`

### Layout
- left: questions
- right: lightweight contextual summary
- progress
- back/continue

---

## 06 Location

### Layout
- search/current/manual input
- map
- resolved jurisdiction panel
- confirm location

### UX detail
Do not treat map as the authoritative source visually; the resolved address/jurisdiction is the important output.

---

## 07 Approval Results

### Header
`Approvals relevant to your project`

Context chips:

`Activity · Location · Scale`

### Tabs / filters
- all
- likely required
- conditional
- later stage
- completed

### Card hierarchy
Name > applicability > status > requirements > CTA

---

## 08 Approval Detail

### Sticky summary
Approval name + status + primary action.

### Content
- overview
- why it applies
- requirements
- documents
- dependencies
- process
- official source

### Mobile
Primary CTA should remain accessible without scrolling to the end.

---

## 09 Dependency View

Use a relationship canvas plus a list fallback.

Interactions:

- zoom
- pan
- select node
- view relationship reason
- open approval

Never allow the graph to become visually chaotic.

---

## 10 Readiness / X-Ray

Use a vertical diagnostic stack.

Each issue must be clickable.

Example:

`Document mismatch -> Open document`

`Missing field -> Open field`

`Policy condition not met -> Explain requirement`

---

## 11 Application Workspace

### Shell
- application title
- status
- progress
- save state

### Content
Single-column form is preferred for comprehension.

Use sections/accordions only when necessary.

---

## 12 Documents

### Library view
Search + filters + document cards/table.

### Document detail
Preview + metadata + extraction + usage.

### Selection modal
When attaching a document to an application, default to an existing verified document when appropriate.

---

## 13 Review

Use grouped summary cards.

Every field group gets an `Edit` link.

Submission action should be clearly separated from ordinary navigation.

---

## 14 Confirmation

Large confirmation state:

`Application submitted`

Show application reference and next stage.

---

## 15 Application Tracking

### Top
Status + last updated + authority.

### Main
Timeline.

### Right/secondary
Required applicant action if any.

### Lower
Documents + correspondence + history.

---

## 16 Action Required

This screen must be high-clarity, not alarming.

Use:

`What was requested`
`Why`
`What to provide`
`By when, if authoritative`
`Respond`

---

## 17 Inspection

Use timeline + schedule card.

Display only information relevant to the applicant.

---

## 18 Notifications

Notifications are actionable deep links, not an activity dump.

Priority ordering:

1. action required
2. deadline/renewal
3. application update
4. informational

---

## 19 Assistant

Use a side panel on desktop and bottom sheet on mobile.

Persist conversation only according to actual product requirements.

Display context pills such as:

`Current project`
`Current application`

---

## 20 Help / Sources

Searchable help and official references.

The applicant should be able to distinguish product help from legal/official source material.

---

## 21 Grievance

A case-like workspace:

- issue details
- reference
- history
- attachments
- status
- response

---

## 22 Profile

Keep personal, business and project context separate.

---

# Navigation model

Use a simple persistent navigation:

`Home | Discover | Applications | Documents`

Secondary:

`Notifications | Help | Profile`

Project/application-specific navigation should appear only when that context is active.

# Breadcrumbs

Use breadcrumbs on deep detail pages:

`Home / Project / Applications / Factory Licence`

Do not use breadcrumbs as the primary navigation.

# Mobile navigation

- compact top bar
- bottom navigation for primary routes or a menu drawer
- sticky primary actions
- sheets instead of oversized modals
- no multi-column desktop table compression
