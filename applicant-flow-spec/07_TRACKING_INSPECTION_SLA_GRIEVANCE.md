# Tracking, Inspection, SLA, Renewal and Grievance UX

## 1. Application tracking

The application detail page is the applicant's source of truth for status.

### Top summary

```text
Factory Licence

Status: Under review
Authority: ...
Submitted: 26 Sep 2026
Last updated: 28 Sep 2026
```

### Timeline

Use human-readable milestones, not backend event names.

```text
Created           ✓
Submitted         ✓
Validation        ✓
Department review ●
Inspection        ○
Decision          ○
```

## 2. Explain current waiting state

An excellent advanced state is:

`Waiting for department review`

Then:

`No action is required from you right now.`

This reduces anxiety and makes state visibility useful.

## 3. Applicant action state

When action is required, replace passive status with an actionable module:

```text
Action required

Updated site plan requested

[Respond]
```

## 4. SLA / timeline UI

Only show SLA information backed by the source authority/process definition.

Display:

- submitted date
- elapsed time
- authority-defined timeline if available
- current stage
- due date only when authoritative

Never create a countdown that falsely suggests guaranteed approval.

## 5. Inspection lifecycle

```text
Not required
 -> Required
 -> Scheduling
 -> Scheduled
 -> Completed
 -> Report/decision stage
```

### Applicant display

If required:

```text
Inspection required

We'll show the confirmed appointment here once scheduled.
```

If scheduled:

```text
Inspection scheduled

Date 02 Oct 2026
Time 11:00–13:00
Location ...
```

Only display slot selection if actually supported by backend availability.

## 6. Inspector information

Show only what the applicant needs:

- authority/office
- appointment
- official contact where appropriate

Do not expose internal matching scores or staff private details.

## 7. Renewals

Home should surface future obligations.

Example:

```text
Renewals

Fire approval
Expires in 45 days
[Review renewal]
```

Prioritize authoritative expiry information.

## 8. Compliance

Where supported, create a compliance tab showing:

- active approvals
- validity
- recurring obligations
- upcoming renewals
- completed tasks

Avoid turning this into a huge compliance dashboard for the applicant.

## 9. Grievance

Create a grievance as a persistent case.

### Create

- application/project context prefilled
- issue type
- description
- attachments
- optional communication preference

### Tracking

```text
Submitted
  ↓
Acknowledged
  ↓
Assigned
  ↓
Under review
  ↓
Resolved
```

### Applicant benefits

- clear reference ID
- history
- current state
- last update
- response channel

## 10. Escalation

If an escalation path exists, show it as a defined process, not a threatening countdown.

Example:

`Escalation available for this issue`

Then explain eligibility and required evidence.

## 11. Notifications

Priority:

1. action required
2. inspection appointment
3. authoritative deadline/renewal
4. status update
5. informational

Each notification must deep-link.
