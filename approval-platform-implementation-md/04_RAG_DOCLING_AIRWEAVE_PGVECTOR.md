# Regulatory RAG — Docling + Airweave + PostgreSQL/pgvector

## 1. Objective

Build a traceable regulatory knowledge retrieval system that can answer:

- what a rule says;
- where it came from;
- when it became effective;
- which jurisdiction it belongs to;
- which approval/document it supports;
- what source page/section supports the answer.

## 2. Component responsibilities

### Airweave

Use Airweave as a source synchronization/connectivity layer where its connectors and deployment model fit the project. Do not make Airweave the legal system of record.

### Docling

Use Docling for document understanding and transformation. It can convert diverse formats and supports advanced PDF understanding and structured extraction. citeturn143985search8turn143985search5

### PostgreSQL + pgvector

Use PostgreSQL for chunk storage, metadata filtering and vector search. pgvector supports exact and approximate search and HNSW/IVFFlat indexes. citeturn925300search0

## 3. Ingestion pipeline

```text
Official source / connector
        ↓
Airweave sync or custom source adapter
        ↓
Raw file + source metadata
        ↓
Docling conversion
        ↓
Structured document representation
        ↓
Section/page aware chunks
        ↓
Metadata extraction
        ↓
Embedding generation
        ↓
PostgreSQL knowledge_chunks
        ↓
Optional graph entity extraction
        ↓
Neo4j projection
```

## 4. Regulatory metadata

Every chunk should include:

```json
{
  "authority": "...",
  "jurisdiction": "...",
  "document_type": "act|rule|notification|guideline|form|faq",
  "publication_date": "...",
  "effective_from": "...",
  "effective_to": "...",
  "approval_codes": [],
  "industry_codes": [],
  "source_document_id": "...",
  "page_number": 12,
  "section_path": ["..."],
  "source_locator": "page=12;section=4.2",
  "checksum": "..."
}
```

## 5. Chunking

Do not blindly split every document into fixed-length chunks.

Prefer structure-aware chunks using:

- title/heading hierarchy;
- section boundaries;
- table boundaries;
- form field groups;
- paragraph continuity;
- page references.

Keep the original source locator with every chunk.

## 6. Hybrid retrieval

Implement retrieval in stages:

```text
User question
   ↓
Query normalization
   ↓
Metadata/jurisdiction filters
   ↓
Lexical retrieval
       +
Vector retrieval
   ↓
Candidate union
   ↓
Reranking
   ↓
Source deduplication
   ↓
Citation-aware context
   ↓
LLM answer
```

The answer service must return structured citations:

```ts
interface SourceCitation {
  knowledgeDocumentId: string;
  page?: number;
  section?: string;
  locator?: string;
  excerpt?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}
```

## 7. Temporal validity

A major regulatory failure mode is applying an old rule to a current application.

Every retrieval should accept a target date:

```ts
retrieveRegulatoryEvidence({
  jurisdiction,
  authority,
  targetDate,
  query,
})
```

Filter out expired sources unless the user explicitly asks for historical rules.

## 8. RAG safety rules

The RAG assistant must:

- cite every regulatory claim;
- state when no authoritative source was found;
- distinguish law/regulation from explanatory guidance;
- avoid inventing fees, timelines, approvals or forms;
- ask the deterministic applicability engine for actual applicability instead of guessing from retrieved text.

## 9. RAG API

```http
POST /api/rag/search
POST /api/rag/answer
GET  /api/knowledge/documents/:id
GET  /api/knowledge/documents/:id/chunks
```

`/answer` must include retrieved evidence and citation IDs in the internal response object, even if the UI only shows compact citations.

## 10. Evaluation set

Create a versioned test set containing:

- factual regulatory questions;
- applicability questions;
- dependency questions;
- temporal questions;
- jurisdiction questions;
- adversarial questions where the correct answer is “not enough evidence.”

Measure retrieval hit rate and citation correctness separately from LLM fluency.
