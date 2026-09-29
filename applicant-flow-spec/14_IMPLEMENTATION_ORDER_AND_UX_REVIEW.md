# Applicant Frontend Implementation Order and UX Review

## Phase 1 — Foundation

Build/reconcile:

1. route structure
2. applicant shell
3. design tokens
4. reusable components
5. API client/state layer
6. error/loading patterns

## Phase 2 — Core discovery journey

Implement:

`Project -> Location -> Business context -> Approval discovery -> Approval detail`

This is the first end-to-end vertical slice.

## Phase 3 — Application preparation

Implement:

`Dependencies -> Documents -> Requirements -> X-Ray`

## Phase 4 — Application transaction

Implement:

`Application workspace -> Review -> Submit -> Confirmation`

## Phase 5 — Post-submission

Implement:

`Tracking -> Timeline -> Clarification -> Inspection -> Notifications`

## Phase 6 — Intelligence

Integrate:

- contextual AI
- tool calling
- source panels
- project-change impact
- workflow intelligence

## Phase 7 — Advanced applicant value

Add where backend supports them:

- renewals
- compliance
- scheme/incentive discovery
- grievance

## Phase 8 — Visual refinement

Do a full design review after functionality is stable.

Review each flow as a real applicant, not as a developer.

## UX review questions

### First minute

Can I understand what this service does?

Can I start without knowing government terminology?

### Discovery

Do I understand why the system asks for each important answer?

Do the results feel personalized rather than generic?

### Approval

Can I understand why an approval applies?

Can I find prerequisites and documents without hunting?

### Application

Can I save and return?

Can I identify exactly what remains?

### Validation

Can I fix every blocker from the error itself?

### Tracking

Can I tell whether I need to do anything?

### Waiting

Does the system explain what it is waiting for?

### AI

Does the assistant have context?

Does it actually retrieve or act on real data?

### Mobile

Can I complete important tasks one-handed?

### Trust

Can I tell official information from AI guidance?

## Red-team UX scenarios

Test deliberately:

1. user denies location permissions
2. user enters ambiguous address
3. user abandons application halfway
4. document upload fails
5. document parser cannot extract fields
6. user has an expired document
7. two fields contradict each other
8. backend validation fails
9. user double-clicks submit
10. clarification arrives while user is on dashboard
11. status changes while application is open
12. inspection availability is temporarily unavailable
13. user changes project location
14. approval becomes no longer relevant
15. source document is unavailable

## Final quality test

The strongest sign of a good applicant frontend is not the number of screens.

It is that the applicant rarely needs to ask:

`What do I do now?`

The interface should answer that implicitly through state, hierarchy, context and one clear next action.
