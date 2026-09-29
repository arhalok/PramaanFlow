# PS 26130 Requirement -> Applicant UI Traceability

## Purpose

Every major feature shown to the applicant must trace to a stated problem/expected outcome in the problem statement or to a necessary usability layer around it.

The PS 26130 description identifies challenges around identifying applicable approvals, documentation requirements, monitoring timelines, responding to queries, and accessing incentives/support. It also calls for a unified solution with customized approval checklists, documentation guidance, pre-validation, reuse of verified data, parallel workflows, inspection scheduling, SLA tracking, alerts, dashboards, a regulatory knowledge engine, risk-based scrutiny, inspection planning, grievance escalation and delay analytics.

## Traceability matrix

| PS need | Applicant UI | Backend/technology | Judge-visible proof |
|---|---|---|---|
| identify applicable approvals | Personalized approval discovery | AI + RAG + OPA + graph + DB | Context -> approval list |
| customized checklist | Dynamic requirements checklist | rules + approval metadata | Different project gets different checklist |
| documentation guidance | Document requirement cards | PostgreSQL + RAG + Docling | Shows exact missing docs |
| pre-validation | Application X-Ray | OPA + document extraction + consistency rules | Finds configured issue before submit |
| reuse verified data | Document vault + existing data reuse | PostgreSQL + Docling | Reuse existing document/data |
| parallel workflows | Approval journey/dependency view | Neo4j + Temporal | Related paths visible |
| inspection scheduling | Inspection state/calendar | availability + skills + jurisdiction + workflow | Required -> scheduled |
| SLA tracking | Timeline + elapsed/authority-defined timeline | Temporal + PostgreSQL | Current stage/time visibility |
| alerts | Action-required center | events + notifications | Notification deep-link |
| single dashboard | Applicant Home | aggregate backend state | One screen summarizes journey |
| regulatory knowledge | Source-backed guidance | pgvector + RAG + Docling/Airweave | Why/source panel |
| risk-based scrutiny | Readiness/check indicators | OPA/rules | Explainable warning/blocker |
| inspection planning | Inspection progress | jurisdiction + skills + availability | Appointment/status |
| grievance escalation | Grievance workspace | workflow + DB | Case tracking |
| delay analytics | Waiting-state explanation | PM4Py + workflow history | Shows where process is waiting |
| support schemes | Contextual scheme discovery | RAG + rules | Relevant scheme cards |

## Design interpretation

The applicant experience should not attempt to expose every expected solution component equally.

The highest-value applicant-visible loop is:

`Personalize -> explain -> prepare -> validate -> apply -> track -> respond`

The administrative analytics can remain mostly in the department/admin portal.

## Key UX conclusion

A traditional single-window portal generally asks the applicant to locate information and manage applications.

This project should add an intelligence layer that continuously interprets the applicant's project context and surfaces the most relevant next decision/action.

The UI should therefore be **guidance-first, not navigation-first**.
