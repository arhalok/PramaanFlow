# OPA Policy Engine + Applicability + Risk

## 1. Purpose

Use Open Policy Agent as the policy decision point for explicit policy evaluation. OPA is designed to evaluate requests from policy enforcement points and supports policy/data bundles and decision logging. citeturn925300search3turn925300search4

## 2. What OPA should decide

Suitable decisions include:

- applicant/department authorization;
- whether a workflow transition is permitted;
- whether a rule condition matches;
- whether additional scrutiny is required;
- whether a grievance should escalate;
- eligibility gates for incentives;
- access restrictions based on jurisdiction/department.

## 3. What OPA should not own

Do not put the following as opaque policy data in Rego alone:

- giant legal documents;
- binary files;
- full transaction state;
- workflow history;
- vector embeddings;
- large graph traversals.

Use IDs and normalized facts as OPA inputs.

## 4. Policy request shape

```json
{
  "subject": {
    "userId": "u1",
    "role": "department_officer",
    "departmentId": "d1",
    "jurisdictionIds": ["j1"]
  },
  "project": {
    "sector": "food_processing",
    "investmentAmount": 80000000,
    "workers": 120,
    "h3Cell": "..."
  },
  "application": {
    "approvalCode": "...",
    "status": "UNDER_SCRUTINY"
  },
  "facts": {}
}
```

## 5. Decision contract

```ts
interface PolicyDecision {
  allow: boolean;
  decisionCode: string;
  reasons: string[];
  policyVersion: string;
  evaluatedAt: string;
}
```

## 6. Rego organization

```text
policy/opa/
├── authz/
├── workflow/
├── applicability/
├── risk/
├── incentive/
└── grievance/
```

Keep policy modules small and composable.

## 7. Versioning

Every decision must record:

- OPA bundle version;
- policy package/version;
- normalized input snapshot or input hash;
- evaluation timestamp.

When a regulation changes, a new rule version should be created instead of mutating historical decisions.

## 8. Explainability

A decision should be explainable in business terms:

```text
Result: ADDITIONAL_SCRUTINY
Reasons:
- sector is marked high-risk by rule R-102
- project capacity exceeds threshold T-17
- location falls in protected jurisdiction class J-3
```

The UI explanation is derived from structured decision reasons, not a hallucinated LLM justification.

## 9. Risk model

Start with a deterministic risk rubric. Keep it configurable.

Possible factors:

```text
sector_risk
location_sensitivity
project_scale
environmental_load
workforce_size
compliance_history
document_anomaly_flags
```

Store factor contributions individually. Avoid an unexplained single number.
