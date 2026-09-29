# ANTIGRAVITY MASTER IMPLEMENTATION PROMPT — APPLICANT EXPERIENCE

## Mission

Transform the existing applicant frontend into a production-quality, premium, government-grade approval workspace based on the companion applicant-flow Markdown specifications.

This is not a redesign for decoration.

The objective is to make the applicant journey so intuitive that the user can understand and complete their work naturally while the complex backend intelligence remains hidden.

# Read these specifications first

Implement against these files as one coherent product specification:

- 00_README_AND_PRODUCT_PRINCIPLES.md
- 01_COMPLETE_APPLICANT_JOURNEY.md
- 02_SCREEN_BY_SCREEN_UI_SPEC.md
- 03_APPLICANT_STATE_MACHINE.md
- 04_TECHNOLOGY_TO_APPLICANT_EXPERIENCE.md
- 05_AI_ASSISTANT_AND_TOOL_CALLING.md
- 06_DOCUMENTS_VALIDATION_AND_XRAY.md
- 07_TRACKING_INSPECTION_SLA_GRIEVANCE.md
- 08_UI_UX_EXCELLENCE_AND_DESIGN_SYSTEM.md
- 09_WOW_FEATURES_AND_JUDGE_DEMO_FLOW.md

# Step 1 — Audit existing project

Before changing code:

1. inspect frontend routes
2. inspect applicant pages
3. inspect authentication
4. inspect existing backend/API contracts
5. inspect database models/types
6. inspect AI assistant integration
7. inspect document flows
8. inspect map/GIS integration
9. inspect existing design system/components
10. identify working functionality that must not be broken

Do not throw away existing logic without a reason.

# Step 2 — Establish applicant shell

Create a coherent applicant shell:

- header
- primary navigation
- project context
- notification center
- profile
- help
- assistant launcher

Primary navigation:

`Home | Discover | Applications | Documents`

Keep project/application-specific navigation contextual.

# Step 3 — Build the core journey

Implement these routes/experiences in order:

1. Home
2. New/Select Project
3. Location
4. Business Context
5. Approval Discovery
6. Approval Detail
7. Dependency View
8. Readiness/X-Ray
9. Application Workspace
10. Documents
11. Review
12. Submit Confirmation
13. Application Tracking
14. Clarification
15. Inspection
16. Notifications
17. Renewals/Compliance where supported
18. Grievance
19. Assistant
20. Profile/Help

# Step 4 — Make the homepage state-aware

The home page should change based on real application/project state.

New user:

`Start your journey`

Active draft:

`Continue application`

Action required:

`Action required`

Waiting:

`No action required right now`

Approved:

`Approval completed`

Do not render all of these simultaneously.

# Step 5 — Implement contextual discovery

Business + location inputs must flow to the approval discovery layer.

Frontend must consume real API results whenever available.

Never fabricate approval data.

# Step 6 — Implement approval explanation

Every approval card/detail page must support a clear explanation of:

- why it is shown
- what data contributed
- prerequisites
- documents
- process
- authority
- official sources

# Step 7 — Implement dependency visualization

Use the graph backend if available.

If the graph API is not ready, create the frontend integration boundary with typed models; do not fabricate production relationships.

Provide both:

- visual graph
- accessible/list representation

# Step 8 — Implement document intelligence

Integrate document parsing/extraction results into the UI.

After upload:

- processing state
- extraction result
- review state
- validation state
- reusable status

Allow existing documents to be reused.

# Step 9 — Implement application X-Ray

Create a pre-submission diagnostic experience.

Results must be categorized:

- blocker
- warning
- info

Every issue must deep-link to its correction.

# Step 10 — Integrate AI assistant correctly

The assistant must use real application/project context and backend tools.

Do not implement a fake chatbot with hard-coded answers.

The assistant should be capable of requests such as:

`What is blocking my application?`

`Why is this approval required?`

`Open my missing documents.`

`What stage is my application in?`

Use structured tool results and UI actions.

# Step 11 — Implement tracking timeline

Map backend status/events to applicant-readable milestones.

Do not expose raw workflow event names.

Display:

- current state
- last updated
- authority
- timeline
- action needed
- next stage if supported

# Step 12 — Implement inspection state

Applicant should see:

- whether inspection is required
- scheduling state
- confirmed schedule
- relevant authority information

Only show appointment selection when availability is actually supported.

# Step 13 — Implement notifications

Every notification should deep-link to the related application/document/action.

Action-required items get highest visual priority.

# Step 14 — Implement accessibility

Follow WCAG-oriented practices:

- keyboard navigation
- visible focus
- semantic HTML
- field labels
- programmatic names
- accessible status messages
- explicit errors
- correction suggestions
- sufficient contrast

# Step 15 — Responsive behavior

Test at:

- desktop
- 1280px
- 1024px
- tablet
- mobile widths

Do not merely compress desktop.

# Step 16 — Premium UX pass

After functionality works, perform a separate UX refinement pass.

Review:

- visual hierarchy
- spacing
- density
- typography
- consistency
- empty states
- loading states
- error states
- transitions
- mobile behavior
- button hierarchy
- deep linking
- browser back behavior

# Step 17 — Remove anti-patterns

Remove or redesign:

- unnecessary KPI cards
- giant forms
- duplicate navigation
- unexplained technical terms
- fake metrics
- fake government decisions
- fake confidence scores
- dead-end pages
- meaningless animations
- excessive modals
- redundant buttons

# Step 18 — Data integrity rules

Never fabricate:

- government approval status
- fees
- deadlines
- inspection assignments
- approval eligibility
- official requirements
- documents
- decision outcomes

Development/test states must be clearly isolated.

# Step 19 — Judge-quality flows

Verify these specific flows manually:

### New user

`Start -> location -> business -> approvals`

### Approval understanding

`approval -> why -> requirements -> dependencies`

### Application

`start -> documents -> X-Ray -> review -> submit`

### AI

`ask -> tool -> real result -> deep link`

### Tracking

`submitted -> timeline -> action required / waiting / inspection`

### Advanced impact

`change context -> approval impact`

# Step 20 — Completion checklist

The implementation is not complete until:

- applicant understands project context
- applicant understands current state
- approval results are personalized
- approval reason is explainable
- dependencies are understandable
- documents can be reused
- application validation is actionable
- AI assistant is contextual
- tracking is reliable
- inspection status is understandable
- action-required states are prominent
- empty/error/loading states are polished
- responsive layout works
- accessibility basics are covered
- no fabricated official data is presented
- all major flows have a clear continuation

# Final design philosophy

Build the complexity underneath.

Expose the confidence and simplicity above.

The final applicant experience should compress:

`AI + RAG + documents + graph + GIS + rules + workflows + process intelligence + application state`

into a human journey:

`Tell us about your project -> See what applies -> Understand why -> Prepare -> Check -> Apply -> Track -> Respond -> Finish`

That is the applicant product.
