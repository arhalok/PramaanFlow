# Documents, Validation and Application X-Ray

## Objective

Reduce application rejection/return caused by avoidable information and document issues.

The UX should catch problems while the applicant can still fix them.

# Document lifecycle

```text
Select file
 -> Upload
 -> Parse
 -> Extract
 -> Applicant review
 -> Optional/actual verification
 -> Reuse
 -> Expiry monitoring
```

## Upload UI

Show:

- accepted format
- size limit
- security note
- upload progress
- parse progress

Never block the entire page for one document.

## Extraction UI

After Docling processing:

```text
We found these details

Business name     ABC Foods
Address           ...
Document date     ...

Please review before using this information.
```

The user should be able to correct extracted values.

## Document confidence language

Avoid raw ML confidence scores unless they are meaningful and designed for user interpretation.

Prefer:

- `Extracted`
- `Needs review`
- `Verified`

## Reuse logic

When the same document requirement appears again:

```text
You already have this document

GST Certificate
Verified
Uploaded 24 Sep 2026

[Use existing]
```

## Application completeness

Compute completeness from actual requirements.

Example:

```text
Documents
4 of 6 ready

Fields
18 of 18 complete

Dependencies
All known prerequisites satisfied
```

## X-Ray categories

### Identity
Consistency between applicant identity/business records.

### Project
Required project information.

### Location
Address completeness and jurisdiction match.

### Documents
Presence, type, expiry and known validation rules.

### Cross-field consistency
Examples:

- date ordering
- name mismatch
- capacity mismatch
- duplicate or contradictory values

### Policy checks
OPA-backed rules where implemented.

## Severity levels

### BLOCKER
Cannot submit safely.

### WARNING
Could submit but should review.

### INFO
Helpful recommendation.

Do not prevent submission for `WARNING` or `INFO` unless product rules explicitly require it.

## X-Ray UI

```text
Application X-Ray

Readiness
82%

BLOCKER 1
Site plan missing
[Fix]

WARNING 2
Address differs from uploaded document
[Review]

INFO 1
Renewal document available for reuse
[View]
```

## Deep-link rule

Every issue must have a direct route to its correction.

Never force the user to search for the problem again.

## Review before submission

At least once before submit, provide:

- summary
- blockers
- warnings
- documents
- declarations
- source/requirement references where applicable

## Safety/trust boundary

The X-Ray is a software pre-check. It is not a guarantee of approval or a replacement for authority review.
