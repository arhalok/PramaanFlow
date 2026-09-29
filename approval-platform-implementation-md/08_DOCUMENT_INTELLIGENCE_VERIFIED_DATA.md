# Document Intelligence + Verification + Data Reuse

## 1. Objective

Implement the PS requirement:

> guide applicants through documentation, pre-validate submissions, reuse verified data.

## 2. Document lifecycle

```text
Upload
 ↓
Virus/file validation
 ↓
Hash + version
 ↓
Docling parse/extract
 ↓
Schema mapping
 ↓
Validation rules
 ↓
Human review if required
 ↓
VERIFIED / REJECTED / NEEDS_REVIEW
 ↓
Reusable verified facts
```

## 3. Document types

Create a configurable document registry:

```text
DocumentType
├── code
├── name
├── accepted_mime_types
├── max_size
├── extraction_schema
├── validation_rules
├── issuing_authority
├── expiry_rules
└── confidentiality_class
```

## 4. Extraction schema

Example:

```json
{
  "documentType": "GST_CERTIFICATE",
  "fields": {
    "gstin": {"type": "string", "required": true},
    "legalName": {"type": "string", "required": true},
    "registeredAddress": {"type": "string", "required": true},
    "issueDate": {"type": "date", "required": true}
  }
}
```

Use Docling structured extraction when the target is specific typed fields rather than just full-document conversion. citeturn143985search5

## 5. Validation layers

### File validation

- MIME/type
- size
- checksum
- corruption

### Structural validation

- required fields
- formats
- dates
- page completeness

### Cross-field validation

- issue date ≤ expiry date;
- identifier format;
- name/address consistency.

### Cross-document validation

- legal name matches business entity;
- address matches project profile where required;
- registration identifier matches previously verified record.

### Regulatory validation

- document is acceptable for the particular approval;
- document date falls within required validity window;
- issuing authority is acceptable.

## 6. Verified data vault

A `verified_fact` is a reusable, evidence-backed claim.

Example:

```text
fact_key = legal_name
value = "Example Foods Pvt Ltd"
source = GST certificate v3
verification = OCR + schema validation + authority check
verified_at = ...
expires_at = ...
```

A later application requests `legal_name`. The system should reuse the verified fact and display its source.

## 7. Re-verification

Verified facts must have lifecycle states:

```text
VALID
EXPIRING
EXPIRED
REVOKED
SUPERSEDED
```

If a source document changes, old facts should not be silently overwritten; create a new fact version.

## 8. Applicant experience

For each approval show:

```text
DOCUMENT
✓ Already verified — reuse

DOCUMENT
⚠ Upload required

DOCUMENT
✕ Uploaded but invalid
Reason: expiry date outside allowed window
Action: upload a current certificate
```

## 9. Query generation

When a validation fails, produce a structured deficiency:

```ts
interface DocumentIssue {
  code: string;
  severity: "ERROR" | "WARNING";
  field?: string;
  message: string;
  expected?: string;
  actual?: string;
  remediation: string;
}
```

The LLM may convert this into friendly language, but the underlying issue must be deterministic.
