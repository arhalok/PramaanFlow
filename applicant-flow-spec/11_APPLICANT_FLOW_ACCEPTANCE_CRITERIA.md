# Applicant Flow Acceptance Criteria

## Global

- [ ] Every major applicant page has a clear purpose.
- [ ] Every major page has one primary action.
- [ ] Applicant can always identify current project/context.
- [ ] Applicant can always determine current application state.
- [ ] There are no dead-end states.
- [ ] Technical system names are hidden from normal users.

## Discovery

- [ ] Location can be selected and confirmed.
- [ ] Jurisdiction is displayed in human-readable form.
- [ ] Business context changes the discovery results where supported.
- [ ] Approval results are grouped by applicability/stage.
- [ ] Approval explanation is available.

## Graph/dependencies

- [ ] Related approvals can be explored.
- [ ] Dependencies have human-readable explanations.
- [ ] List fallback exists for graph accessibility.

## Documents

- [ ] Upload has progress.
- [ ] Parsing/extraction state is visible.
- [ ] Extracted values can be reviewed.
- [ ] Existing documents can be reused where appropriate.
- [ ] Expiry is visible when known.

## Application

- [ ] Application is sectioned.
- [ ] Draft is preserved.
- [ ] Save state is visible.
- [ ] Validation is local and actionable.
- [ ] Review page allows edits.
- [ ] Submit requires explicit confirmation.

## X-Ray

- [ ] Blockers are distinguishable from warnings.
- [ ] Every issue deep-links to correction.
- [ ] X-Ray never claims guaranteed approval.

## AI

- [ ] Assistant knows current context.
- [ ] Assistant can retrieve actual state.
- [ ] Assistant can retrieve official knowledge.
- [ ] Assistant can produce structured UI actions where supported.
- [ ] Assistant never fabricates official facts.

## Tracking

- [ ] Timeline maps backend state to understandable stages.
- [ ] Waiting state says whether user action is required.
- [ ] Action-required state is prominent.
- [ ] Inspection state is visible when applicable.
- [ ] Latest update is clear.

## Accessibility

- [ ] Keyboard traversal works.
- [ ] Focus states are visible.
- [ ] Inputs are labelled.
- [ ] Errors are identified and explained.
- [ ] Status changes are accessible.

## Responsive

- [ ] Desktop works.
- [ ] Tablet works.
- [ ] Mobile works.
- [ ] Forms become single-column where necessary.
- [ ] Sticky actions do not obscure content.

## Judge/demo

- [ ] New user can reach personalized approvals quickly.
- [ ] Why-this-approval explanation is easy to demonstrate.
- [ ] Dependency graph is understandable.
- [ ] Document reuse is visible.
- [ ] X-Ray finds at least one real configured test issue.
- [ ] AI action opens actual relevant UI state.
- [ ] Tracking timeline updates from real backend state.
