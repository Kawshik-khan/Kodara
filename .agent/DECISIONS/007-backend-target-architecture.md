# ADR 007: Local-First, Event-Sourced Backend Target Architecture

## Context
ADR-005 defers the backend until the PLAN 001 M6 pilot passes. When that gate opens, the team needs a backend design that is ready and consistent with what the client already does. The client already:
- runs learner JavaScript in a Web Worker;
- computes mastery deterministically (`features/progress/engines`);
- persists through three repository interfaces.

The forces are:
- learners on unreliable mobile networks (Bangladesh);
- a small team;
- content that lives in git;
- mastery that must be explainable and recomputable;
- an AI tutor whose cost grows per request;
- a path to 1M+ learners without a rewrite.

ARCHITECTURE.md and ADR-001 describe a server-centric design: every run goes through an API, a queue and a sandbox, and PostgreSQL holds all content. That no longer matches ADR-005.

## Decision
When the M6 gate passes, build the backend described in [BACKEND-ARCHITECTURE.md](../BACKEND-ARCHITECTURE.md) and [DATABASE-DESIGN.md](../DATABASE-DESIGN.md):
1. **Local-first:** the browser stays the primary runtime. The server makes learning data durable, multi-device and verifiable. It is never on the critical path of a lesson step.
2. **Event-sourced learning data:** client-generated UUIDv7 `learning_events` are the source of truth, ingested idempotently. Evidence, mastery, review queue and progress are projections computed by a shared `@kodara/engine` package. The same code runs in the browser and on the server.
3. **Content as code on a CDN:** lessons, stories and challenges ship as immutable, versioned JSON releases. PostgreSQL holds only a catalog index with integer surrogate keys.
4. **Modular monolith (ADR-001 kept):** Fastify + TypeScript, modules `identity`, `catalog`, `learning`, `mastery`, `assessment`, `sync`, `tutor`, `execution`, `analytics`. Process roles are `api` and `worker`. `sandbox-runner` is added only for non-browser languages.
5. **PostgreSQL 18:** learner tables lead with `user_id`. Facts use monthly range partitions, evidence uses hash partitions by user, and every index maps to a named query. Redis is used for limits, quotas, cache and jobs. R2 holds archives and traces.
6. **Trust levels:** browser results are `self_reported`. Only `server_verified` evidence (hidden tests re-run server-side) counts toward credentials.
7. **Staged scaling:** single region (Singapore or Mumbai) with one primary at first; a replica and the tutor at growth; async projections, ClickHouse and `user_id` sharding at scale.

## Alternatives Considered
- **Server-centric design from ARCHITECTURE.md (API runs everything, content in DB):** rejected. It pays server cost per "Run" for JavaScript the browser already isolates, and it breaks offline learning.
- **CRUD sync of mastery rows (no event log):** rejected. Last-write-wins on derived numbers loses data across devices and blocks recomputing after a formula change.
- **Backend-as-a-service only (Supabase/Firebase with client writes + RLS):** rejected as the *core* write path. Mastery must be computed server-side to be trustworthy. A managed Postgres from Supabase or Neon is still fine as the database host.
- **Microservices / Kafka from day one:** rejected. That is premature operational cost. The outbox and `user_id`-leading keys keep later extraction open.
- **MongoDB / DynamoDB:** rejected. The prerequisite DAG, catalog FKs and analytics export favour relational modelling.

## Consequences
### Positive
- Learning keeps working during API outages. Hosting cost is near zero until learners exist.
- Idempotent, replayable data. Mastery formula changes become a rebuild job, not a data migration.
- One mastery implementation, so optimistic client state and server state match.
- A clear path to sharding with no schema change.

### Negative / Tradeoffs
- An event schema and upcasters must be maintained for old offline clients.
- Self-reported evidence can be forged until server verification exists. This is acceptable for personal progress, not for credentials.
- Moving engines into `packages/engine` requires a monorepo restructure at Stage 1.
- ARCHITECTURE.md §2.2–2.5 and ADR-001's "Redis queue for every execution" are superseded for JavaScript. They need a follow-up edit when this ADR is accepted.

## Revision 2026-10-29
A principal review ([REVIEWS/2026-10-29-backend-design-review.md](../REVIEWS/2026-10-29-backend-design-review.md)) kept decisions 1–7 and amended them:
1. **Sync revisions:** a per-learner counter (`learning.sync_state`) replaces the global sequence plus advisory lock. The global sequence breaks cursors when a learner's shard moves.
2. **Shard-safe keys:** every learner-owned PK leads with `user_id` (`review_items`, `tutor.threads`, `tutor.messages`, `devices`, `execution_jobs`).
3. **Facts vs telemetry:** UI interaction events leave `learning_events` for a separate telemetry pipeline (Redis Stream → R2 Parquet). This is about 70 % of event volume.
4. **Client facts, server meaning:** concepts, difficulty and weights come from the release manifest on the server, never from the client payload.
5. **Anonymous-first identity:** an anonymous user is created at the first meaningful action, and linking keeps the same `user_id`.
6. **New modules:** `notify` (Stage 1–2), `org` and cohorts (Stage 2), `billing` (Stage 2+), plus platform tables (idempotency keys, feature flags, audit log).
7. **API contract:** [API-SPEC.md](../API-SPEC.md).

## Status
Proposed (to be accepted at the PLAN 001 M6 gate together with the auth-provider ADR). Revised 2026-10-29.

## Date
2026-10-25
