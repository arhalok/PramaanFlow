# Applicant UI/UX Excellence and Design System

## Design objective

The visual language should communicate:

**trust + clarity + intelligence + calm + progress**

It must feel suitable for a serious national/public digital platform while still feeling modern and pleasant.

## 1. Layout system

Use a consistent max-width for reading-heavy pages.

Recommended structure:

```text
Full-width application shell
  -> centered content container
      -> page header
      -> primary content
      -> contextual secondary content
```

Avoid full-width text stretching across very large screens.

## 2. Information density

High-density surfaces:

- applications list
- document vault
- approvals list

Low-density surfaces:

- first-time onboarding
- submission confirmation
- action-required state
- rejection/decision explanation

Density should follow user intent.

## 3. Typography

Use 3-4 primary levels:

- page title
- section title
- card title
- body/metadata

Avoid 8+ competing font sizes.

Use tabular numbers for dates, counts and progress values where helpful.

## 4. Color semantics

Colors must have semantic meaning.

Suggested semantic categories:

- neutral = normal context
- information = informational
- positive = complete/approved
- warning = needs attention/review
- critical = blocker/error

Do not encode status using color alone.

## 5. Cards

Cards should group meaningful units.

Good card:

`Factory Licence -> status -> applicability -> next action`

Bad card:

`random KPI -> icon -> decorative graph -> unrelated CTA`

## 6. Primary action

Every screen gets one primary CTA.

Secondary actions use lower visual weight.

Destructive actions require confirmation and should not look like the primary CTA.

## 7. Spacing

Use a consistent spacing scale. Avoid arbitrary one-off margins.

The interface should have generous whitespace around major tasks but compact metadata within cards.

## 8. Navigation

Use persistent navigation for recurring destinations.

Use task/step navigation for end-to-end transaction flows.

Do not make global navigation compete with a form's stepper.

## 9. Forms

Each field must have:

- visible label
- helpful description when needed
- error state
- correction guidance

Do not use placeholder text as the only label.

## 10. Error handling

Errors should be:

- specific
- local
- actionable
- persistent until corrected

Example:

`Site plan is required. Upload a PDF/JPG or choose an existing document.`

Not:

`Invalid input.`

## 11. Loading states

Use skeletons for substantial content.

Use progress indicators for actual long-running actions such as upload/parsing.

Never display a fake progress animation.

## 12. Toasts

Use for lightweight confirmations.

Example:

`Document added to application.`

Do not use toast for critical blocking errors that the user may miss.

## 13. Motion

Use restrained motion:

- page transitions
- accordion open
- status changes
- progress changes

Avoid perpetual motion or decorative animation.

## 14. Accessibility

Target WCAG 2.2 AA-level practices wherever applicable.

Requirements:

- keyboard access
- visible focus state
- semantic controls
- labels
- accessible names
- error identification
- error suggestions where possible
- status messages announced accessibly
- adequate contrast
- reduced-motion consideration

Reference:
https://www.w3.org/TR/wcag/

## 15. Responsive design

### Desktop
Three conceptual zones:

- navigation
- work area
- contextual panel

### Tablet
Two zones; context becomes collapsible.

### Mobile
One main column plus bottom sheets/drawers.

Do not merely reduce widths from desktop.

## 16. Empty states

Every empty state should explain:

1. what this area is
2. why it is empty
3. what becomes available later

Example:

`No applications yet. Applications you start or submit will appear here.`

## 17. Privacy

Only expose personal/project data the applicant needs.

Sensitive internal government workflow metadata should not leak into applicant screens.

## 18. Progressive disclosure pattern

Prefer:

```text
Summary -> Details -> Source -> Action
```

rather than:

```text
everything -> giant text wall -> hidden action
```

## 19. Trust labels

Recommended UI labels:

`Official source`
`System check`
`AI explanation`
`Your information`
`Department update`

Use consistent badges.

## 20. Judge-facing polish

A judge should be able to understand a screen at a glance.

Avoid tiny text, dense nested modals and unexplained acronyms.

## 21. Signature visual feature

Create one polished visual language for:

`Approval Journey`

It can appear as a horizontal or vertical journey with:

- completed stage
- current stage
- blocked stage
- next stage

This becomes the product's visual identity.
