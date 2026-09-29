# Applicant Experience Specification

## Purpose

This specification defines the complete applicant-side experience for the SIH project. It is intended to be added to the Antigravity workspace and used as the source of truth for frontend implementation.

The applicant side must hide technical complexity and expose useful outcomes.

The target feeling is:

> "The system understands my business, knows which approvals matter, explains why, catches mistakes before submission, tells me what happens next, and keeps me informed."

## Product position

Build the applicant portal as a **guided approval workspace**, not as a generic dashboard and not as a chatbot wrapper.

The portal should combine:

- approval discovery
- jurisdiction-aware guidance
- approval dependency visualization
- document intelligence and reuse
- pre-submission validation
- AI-assisted navigation and action
- application tracking
- clarification handling
- inspection scheduling visibility
- SLA/deadline visibility
- renewals/compliance reminders
- grievance/escalation support
- explainability and official-source grounding

## Design principles

### 1. Outcome before technology

Never expose implementation terminology such as H3, Neo4j, pgvector, OPA, Temporal, PM4Py, Docling, Airweave, embeddings, agents, workflow orchestration or routing algorithms to normal applicants.

Translate technology into user language:

| Internal capability | Applicant-facing concept |
|---|---|
| H3 / GIS | Jurisdiction and location context |
| Neo4j | Approval dependencies and relationships |
| PostgreSQL | Applicant/application/document record state |
| pgvector + RAG | Source-grounded guidance |
| Docling | Document extraction and understanding |
| Airweave | Knowledge/source connectivity |
| OPA | Eligibility and policy checks |
| Temporal | Durable application workflow/timeline |
| PM4Py | Process/status insights |
| Skills/availability/jurisdiction | Appropriate review/inspection assignment |
| AI tool calling | Actionable assistant |

### 2. Never make the user understand the system architecture

The applicant should not have to know which department, technology or workflow engine does what. The UI should surface only the decision-relevant facts.

### 3. Progressive disclosure

Show the minimum information needed at first. Reveal details when the applicant asks or enters a stage where those details matter.

### 4. One primary action per screen

Every high-intent screen must have one visually dominant next action.

### 5. Never create dead ends

Every major state needs a useful continuation, return path, or explanation.

### 6. State matters more than page count

The same screen must adapt to states such as:

- first visit
- incomplete profile
- discovery complete
- draft
- ready to submit
- submitted
- under validation
- under review
- action required
- inspection required
- approved
- rejected
- expired
- renewal due
- service unavailable

### 7. Trust is part of the interface

Clearly distinguish:

- official source information
- system-derived guidance
- AI explanation
- applicant-entered information
- department status

Do not make an AI-generated recommendation look like a government decision.

## Success criterion

A first-time applicant should be able to complete the core journey without opening a separate manual:

`Location -> Business context -> Relevant approvals -> Why it applies -> Requirements -> Readiness check -> Application -> Documents -> Review -> Submit -> Track -> Respond -> Decision`

## Research basis

The current National Single Window System publicly describes a guided Know Your Approvals experience, approval discovery, real-time status tracking, a reusable document repository, renewal and query management. NSWS currently describes KYA information across 32 Central Departments and 35 States and application hosting across 32 Central Departments and 34 State Governments.

Official references:

- https://www.nsws.gov.in/
- https://www.nsws.gov.in/about-us
- https://www.nsws.gov.in/portal/user-guide
- https://www.nsws.gov.in/faqs

Accessibility baseline:

- https://www.w3.org/TR/wcag/
- https://www.w3.org/WAI/tutorials/forms/notifications/

Government-service navigation/form patterns:

- https://design-system.service.gov.uk/patterns/navigate-a-service/
- https://design-system.service.gov.uk/patterns/step-by-step-navigation/
