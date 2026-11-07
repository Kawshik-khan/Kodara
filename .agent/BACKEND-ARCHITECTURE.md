# KODARA BACKEND ARCHITECTURE (TARGET)

Status: **Proposed** — see [ADR-007](DECISIONS/007-backend-target-architecture.md) · Created: 2026-10-25
Companion: [API-SPEC.md](API-SPEC.md) (API contract + event catalog), [DATABASE-DESIGN.md](DATABASE-DESIGN.md) (schema + indexes), [DATABASE-SCHEMA.sql](DATABASE-SCHEMA.sql) (runnable DDL) · Revised 2026-10-29 ([review](REVIEWS/2026-10-29-backend-design-review.md))

> **বাংলায় এক লাইনে:** শেখা হবে শিক্ষার্থীর ব্রাউজারে (অফলাইনেও চলবে), সার্ভার শুধু "কী ঘটেছে" সেই ইভেন্টগুলো জমা রাখবে আর সেখান থেকে mastery হিসাব করবে। কোড চলবে ব্রাউজারের Worker-এ, তাই সার্ভারের খরচ কম আর স্কেল করা সহজ।

> **Gate:** ADR-005 and AGENT.md §10 still apply. **Nothing here is built before the PLAN 001 M6 pilot passes.** Stage 0 below lists the only work allowed now: small, client-side changes that make the later backend a drop-in.

---

## 1. Design drivers

These come from Kodara's product, not from a generic template.

| # | Driver | Consequence for the backend |
|---|---|---|
| D1 | Learners are mostly in Bangladesh, often on mobile data that drops out. | **Offline-first.** The browser is the primary runtime; the server must never be on the critical path of a lesson step. |
| D2 | JavaScript runs in the browser Web Worker (ADR-005). | No server compute per "Run" click for JS. The most expensive workload of a coding platform disappears. |
| D3 | Content (lessons, stories, challenges) is authored in git and validated by tests (ADR-006). | Content is **static, versioned, immutable** → serve from a CDN, not the database. |
| D4 | Mastery is a deterministic function of evidence (`features/progress/engines`). | Store **events as the source of truth**; mastery, review queue and dashboard are **rebuildable projections**. |
| D5 | The AI tutor (later) is the most expensive per-request feature. | Isolate it behind a gateway with quotas, cost metering and streaming. |
| D6 | Bilingual (ADR-004). | DB and API are language-neutral; only content bundles carry `bn`/`en` text. |
| D7 | Small team, high iteration speed. | **Modular monolith** (ADR-001), one language (TypeScript) on both sides, shared contracts. |

### Capacity targets (sizing the design, not a forecast)

| Stage | Learners (MAU) | DAU | Learning events/day | Peak ingest | Tutor msgs/day |
|---|---|---|---|---|---|
| 1 · Post-pilot | 1k–10k | 1k | 200k | ~30 events/s | — |
| 2 · Growth | 50k–200k | 30k | 6M | ~700 events/s | 150k |
| 3 · Scale | 1M+ | 150k | 30M | ~3.5k events/s | 750k |

Assumptions: ~200 events per active learner per day, peak = 10× average, ~0.5 KB per event. Stage 3 ≈ 15 GB/day of raw events → the event table **must** be time-partitioned and archived.

**Revision 2026-10-29:** only about 60 of those 200 per day are *learning facts*: section completions, predictions, answers, attempts, hints, reviews. The other ~140 are UI telemetry, such as page views, skin toggles, trace scrubbing and playground runs. They go to a separate pipeline (Redis Stream → R2 Parquet) and never reach Postgres (API-SPEC §8). That cuts the hottest OLTP table to ~9M rows/day at Stage 3, about 30 % of the original estimate.

**SLOs (Stage 2+):** event ingest p99 < 300 ms; sync pull p99 < 400 ms; tutor first token p95 < 1.5 s; API availability 99.9 %. Because learning is offline-first, an API outage degrades sync, not learning.

---

## 2. High-level architecture

```text
                        ┌──────────────────────────── Browser (primary runtime) ────────────────────────────┐
                        │  React SPA  ─ Lesson / Story / Engine / Play                                      │
                        │     │                                                                             │
                        │     ├─ Trace Engine (Web Worker, real JS)   ← no server                           │
                        │     ├─ Mastery engine (@kodara/engine)      ← same code runs on server            │
                        │     └─ Local store (IndexedDB) + OUTBOX of LearningEvents (UUIDv7 ids)            │
                        └──────────────┬───────────────────────────────────────┬────────────────────────────┘
                                       │ static, immutable                     │ HTTPS (JSON) / SSE
                                       ▼                                       ▼
                        ┌─────────────────────────────┐        ┌──────────────────────────────────┐
                        │ CDN (Cloudflare)            │        │ Edge: CDN + WAF + rate limit      │
                        │  /app/*  SPA bundle         │        └────────────────┬─────────────────┘
                        │  /content/{release}/*.json  │                         ▼
                        │  (lessons, stories, graph)  │        ┌──────────────────────────────────────────────┐
                        └─────────────────────────────┘        │ kodara-api  (modular monolith, Fastify/Node) │
                                                               │  identity · catalog · learning · mastery     │
                                                               │  assessment · sync · tutor · execution-gw    │
                                                               └───────┬───────────┬──────────────┬───────────┘
                                                                       │           │              │
                                         ┌─────────────────────────────┘           │              └──────────────┐
                                         ▼                                         ▼                             ▼
                              ┌─────────────────────┐                ┌───────────────────────┐       ┌──────────────────────┐
                              │ PostgreSQL 18       │                │ Redis / Valkey        │       │ LLM providers        │
                              │ primary + replica   │                │ rate limits, quotas,  │       │ (via tutor gateway)  │
                              │ via pooler          │                │ hot cache, BullMQ     │       └──────────────────────┘
                              └─────────┬───────────┘                └───────────┬───────────┘
                                        │ outbox / CDC                           │ jobs
                                        ▼                                        ▼
                              ┌─────────────────────┐                ┌───────────────────────────────┐
                              │ kodara-worker       │                │ sandbox-runner (Stage 3 only) │
                              │ projections, outbox,│                │ Python etc., gVisor/Firecracker│
                              │ archival, emails    │                │ isolated network & account     │
                              └─────────┬───────────┘                └───────────────────────────────┘
                                        ▼
                              ┌─────────────────────┐
                              │ Object storage (R2) │  event archive (Parquet), traces, exports
                              └─────────┬───────────┘
                                        ▼
                              Analytics (DuckDB → ClickHouse at Stage 3), never on the OLTP primary
```

**One codebase, three process roles:** `api` (HTTP), `worker` (async jobs), `sandbox-runner` (separate image and infrastructure, Stage 3). All share `packages/contracts` and `packages/engine`.

---

## 3. Core architectural decisions

### 3.1 Local-first, event-sourced learning data

The browser already owns the learning loop and the mastery engine. The backend makes that data **durable, multi-device and trustworthy**. It does not replace it.

```text
learner action
   → local engine updates UI instantly (optimistic)
   → LearningEvent appended to IndexedDB outbox   { eventId: UUIDv7, type, occurredAt, payload, engineVersion }
   → sync loop: POST /v1/events:batch   (≤ 100 events, gzip, retry with backoff)
   → server: validate → INSERT … ON CONFLICT DO NOTHING (idempotent)
            → project: evidence rows + concept_mastery + review_items (same txn, per-user lock)
   → response: authoritative projections for the touched concepts
   → client replaces optimistic state
```

- **Events are immutable facts** (`practice.answered`, `prediction.made`, `challenge.submitted`, `section.completed`, `hint.revealed`, `review.completed`). Mastery is derived.
- **Idempotency by construction:** the client creates `eventId` as UUIDv7 at the moment of the action. Retries, duplicate tabs and offline replays are harmless.
- **Rebuildable:** if the mastery formula changes (`MASTERY_CONFIG.version`), a worker replays evidence and rewrites `concept_mastery`. No migration of derived numbers is needed.
- **Shared engine:** move `features/progress/engines/*` into `packages/engine` (pure TS, no DOM). The browser and server run the **same** code, so optimistic and authoritative results match.

### 3.2 Content is code, served by the CDN

Lessons, stories, challenges and the concept graph live in git and are validated by the content test suite. A release build emits:

```text
/content/{releaseId}/manifest.json            ids, versions, hashes, concept DAG
/content/{releaseId}/lessons/{lessonKey}.json bilingual lesson body
/content/{releaseId}/challenges/{key}.json    public part only (no hidden tests, no solutions in Stage 3)
```

Files are immutable (`Cache-Control: public, max-age=31536000, immutable`). The DB holds only a **catalog index** (keys, integer surrogate ids, versions, the prerequisite DAG) for foreign keys and analytics. Content reads cost the database nothing.

### 3.3 Trust model for evidence (important)

In Stage 1–2, challenge results are computed in the learner's own browser, so a determined user can forge them. That is acceptable for *personal learning progress*, and **not** acceptable for credentials.

| Verification level | Where it runs | Used for |
|---|---|---|
| `self_reported` | browser worker | progress, mastery, review queue |
| `server_verified` | server re-runs the submitted code against **hidden** tests (sandbox-runner) | certificates, leaderboards, institutional reports |

Every attempt row stores `verification`. Credentials (roadmap long-term) only count `server_verified` evidence. Hidden tests and reference solutions are never shipped to the CDN once credentials exist.

### 3.4 Modular monolith boundaries

```text
apps/api/src/modules/
  identity/     users, auth identities, sessions, devices, account deletion/export
  catalog/      content releases, tracks/modules/lessons/concepts index, prerequisite DAG
  learning/     event ingestion, lesson progress, bookmarks, predictions
  mastery/      evidence projection, concept mastery, review queue (uses @kodara/engine)
  assessment/   practice + challenge attempts, drafts, verification
  sync/         pull API, cursors, conflict rules
  tutor/        threads, messages, context builder, LLM gateway, quotas (Stage 2)
  execution/    job submission + status for server languages (Stage 3)
  notify/       review/streak reminders: email (Stage 1), web push (Stage 2); quiet hours, frequency caps
  org/          organizations, cohorts, invites, cohort summary projection (Stage 2)
  billing/      plans, subscriptions, entitlements, payment webhooks: bKash, SSLCommerz, Stripe (Stage 2+)
  analytics/    outbox → object storage export; telemetry stream → Parquet
  platform/     feature flags, audit log, idempotency keys, rate limits (shared plumbing, not a domain)
```

Rules:
- Each module exposes a typed service interface; other modules call that, never its tables.
- Layers per module: `route (zod) → service (rules, txn) → repository (SQL)`, as in the `backend` skill.
- Cross-module side effects go through the **transactional outbox** (`outbox_events` table), not direct calls, so a later extraction to a separate service is a deployment change, not a rewrite.
- Shard-readiness: every learner-owned table is keyed by `user_id` first (see DATABASE-DESIGN §2).

### 3.5 The client reports facts; the server derives meaning
An event says *what the learner did*: "answered `q.closure.3` correctly in 41 s with 1 hint". It never says which concepts that touched, how hard it was, or what the new mastery is. The server reads concepts, difficulty and weight from the **release manifest** the event was tagged with, and computes mastery with `@kodara/engine`. This has three effects:
- A modified client can lie about *outcomes* (Stage 1–2 accepts that risk, §3.3). It can't inflate *weights*, or attach evidence to concepts the question doesn't test.
- Fixing a wrong concept mapping is a content release plus a projection rebuild. No client update is needed.
- The API keeps the manifests of the last 6 releases in memory and loads older ones from R2 on demand, because offline clients replay events from old releases.

### 3.6 Anonymous-first identity
Requiring sign-in before the first lesson works against a local-first product. It also distorts the pilot's north star (return within 7 days). So:
- **First visit:** nothing is sent. No user row, no cost.
- **First meaningful action** (a completed section): the SPA creates an anonymous user (`POST /auth/anonymous`, behind Turnstile) and starts syncing.
- **"Save across devices":** OTP or Google **links** the identity to the same `user_id`. There's no data copy and no merge job.
- **The identity already belongs to another account:** the learner switches to that account, and the client replays its local outbox there. Idempotent events make that merge safe.

Anonymous users can't use the tutor, cohorts, export or payments, which caps abuse and cost. They are purged after 90 days idle. Details: API-SPEC §6.1.

---

## 4. Technology choices

| Concern | Choice | Why | Rejected |
|---|---|---|---|
| Language | TypeScript (Node 22 LTS) | Shares `contracts`, `engine` and trace protocol with the SPA; one hiring profile. | Python/FastAPI: would duplicate the mastery engine. Go: faster, but no code sharing. |
| HTTP framework | Fastify 5 + `zod` type provider | Fast, schema-first, good plugin model. | Express (slower, weaker typing), NestJS (heavy for this team size). |
| SQL access | Kysely (typed query builder) + plain SQL migrations | Full control over SQL, partitions and indexes; no ORM surprises. | Prisma: weak with partitioning, raw SQL needed anyway. |
| Database | PostgreSQL 18 (managed: Neon or Supabase, region Singapore `ap-southeast-1` or Mumbai `ap-south-1`) | Native `uuidv7()`, mature partitioning, JSONB, PITR. Closest regions to Dhaka (~50–80 ms). | MongoDB (relational DAG + FKs matter), DynamoDB (vendor lock, harder analytics). |
| Pooling | Provider pooler / PgBouncer (transaction mode) | Many short API connections. | Direct connections. |
| Cache, limits, queues | Redis-compatible (Valkey / Upstash) + BullMQ | Rate limits, tutor quotas, hot dashboard cache, job queue. | Kafka (premature until Stage 3). |
| Object storage | Cloudflare R2 | Zero egress fees, same edge as the CDN. | S3 (egress cost for exports/traces). |
| Auth | Self-hosted sessions in Postgres (Better Auth or equivalent): email OTP + Google OAuth; phone OTP later | Learner data stays in one DB; no per-MAU auth bill. | Provider auth (Supabase/Neon Auth) is acceptable if speed matters more; decide in the auth ADR. |
| Hosting | Container platform (Render / Fly.io / Cloud Run) in the same region as the DB | Simple autoscaling, no Kubernetes until needed. | Kubernetes at Stage 1–2. |
| Observability | OpenTelemetry → Grafana Cloud / Honeycomb; Sentry for the SPA | Traces with correlation ids across api → worker. | — |

---

## 5. API design

**The full contract is [API-SPEC.md](API-SPEC.md).** It covers conventions, auth and CSRF, idempotency, pagination, error codes, rate limits, every endpoint with its types, the sync protocol and the learning event catalog. Summary:

- Base `https://api.kodara.<tld>/v1`, JSON (camelCase). Opaque session cookie (`HttpOnly; Secure; SameSite=Lax`) plus an `Origin` allowlist and `X-Kodara-Client` header against CSRF. All bodies are validated with zod schemas from `packages/contracts`.
- **Write paths:** `POST /events:batch` (learning facts, idempotent by `eventId`), `POST /telemetry:batch` (fire-and-forget, never Postgres), and `PUT /me/drafts/{key}`. Other POSTs require `Idempotency-Key`.
- **Read paths:** `GET /sync` (per-learner `rev` cursor with an `epoch` for resets), `GET /me`, `/me/dashboard`, `/me/mastery[/{key}/explain]`, `/me/reviews`, `/me/activity`.
- **Later modules:** tutor (Stage 2, streamed with `fetch`, resumable), org/cohorts (Stage 2), billing (Stage 2+), notify (Stage 1 email, Stage 2 push), server execution and verification (Stage 3).
- **Versioning:** URL major version (`/v1`), additive changes only within a version. Event payloads carry `schemaVersion`; the server keeps upcasters for old versions so offline clients with stale bundles still sync.

---

## 6. Critical flows

### 6.1 Event ingest (hot path)

```text
POST /v1/events:batch
 1. auth → user_id; rate limit (Redis sliding window: 600 events/min/user)
 2. zod-validate each event; reject unknown types / future timestamps (> 5 min skew);
    resolve every content key against the event's release manifest (§3.5)
 3. BEGIN
 4.   UPDATE sync_state SET rev = rev + n … RETURNING rev  -- row-locks this learner across devices,
                                                          -- allocates n revs (DATABASE-DESIGN §2.8)
 5.   INSERT INTO learning_events … ON CONFLICT (user_id, occurred_at, event_id) DO NOTHING RETURNING event_id
 6.   for newly inserted events only:
 7.     evidence rows  = engine.normalize(event, manifest) -- same code as browser; concepts from the manifest
 8.     INSERT INTO evidence …
 9.     concept_mastery = engine.apply(prev, evidence)    -- incremental, O(new evidence)
10.     UPSERT concept_mastery, lesson_progress, review_items, daily_activity (rev from step 4)
11.   INSERT INTO outbox_events (analytics, notifications)
12. COMMIT → DEL dashboard cache key → return projections
```

Per-user locking keeps concurrent devices correct without global contention. Batches touch one user, so throughput scales with the number of learners.

**Stage 3 variant:** steps 6–10 move to `kodara-worker` consumers partitioned by `user_id` (BullMQ groups or Redis Streams; Kafka only if needed). The API commits only the raw insert and returns `202`. The client keeps its optimistic state until the next `/sync`.

### 6.2 Multi-device sync and conflicts

| Data | Conflict rule |
|---|---|
| Learning events | No conflicts. Append-only set union by `event_id`. |
| Mastery, review queue | Server-derived; server wins. |
| Lesson progress | Derived from `section.completed` events (monotonic: union of sections). `last_visited_at` = max. |
| Bookmarks | Event-sourced toggle with `occurred_at`; latest wins. |
| Code drafts | Last-write-wins on client `updatedAt`; the losing draft is kept locally as "recovered draft". |

### 6.3 AI tutor (Stage 2)

```text
message → auth → quota (Redis: free 20/h, active 120/h, per SECURITY/AI-TUTOR-SPEC) → TutorContextBuilder
        → prompt (delimited, untrusted blocks) → LLM gateway (provider fallback, timeout, max tokens)
        → event stream to client (fetch + ReadableStream; EventSource can't POST)
        → on finish, even if the client disconnected: persist message + token usage + cost in one txn,
          so GET …/stream can replay it (API-SPEC §4.7)
```

- Context is built server-side from the DB and catalog (lesson objectives, mastery, last attempt, trace summary sent by the client and size-capped). The client never sends the system prompt.
- Cache "Explain Concept" answers per `(conceptKey, locale, releaseId)` in Redis/R2. They are learner-independent and very repetitive.
- Cost guardrails: per-user daily token budget, global daily spend circuit breaker, model tiering (small model for hints 1–2, larger for tier 3–4 and code review).

### 6.4 Server execution (Stage 3, non-browser languages only)

As in EXECUTION-SPEC/SECURITY: API enqueues → sandbox-runner in a **separate cloud account/VPC with no route to the DB** → gVisor/Firecracker, `--net=none`, 1 vCPU, 256 MB, 5 s → trace JSON uploaded to R2 at a content-addressed key `sha256(runtimeVersion + code + stdin)`. Identical runs (lesson examples) are served from R2 without executing again.

---

## 7. Caching strategy

| Layer | What | TTL / invalidation |
|---|---|---|
| CDN | SPA bundle, content releases, story assets | Immutable, hashed paths |
| Browser | Content in Cache Storage (PWA), learning state in IndexedDB | Release id change |
| API process | Catalog/DAG for the active release (in-memory) | Immutable per release; reload on release switch |
| Redis | Dashboard per user, tutor concept explanations, rate-limit counters, OTP codes | 60 s / 30 d / window / 10 min |
| Postgres | Projections *are* the read model; no extra materialized views on the hot path | — |

Cache-stampede protection on dashboard: single-flight per key (Redis `SET NX` lock) + stale-while-revalidate.

---

## 8. Scaling roadmap

| Stage | Trigger | Changes |
|---|---|---|
| **0 · Now (pre-M6)** | ADR-005 in force | **No server.** Allowed prep only: (a) generate UUIDv7 ids for assessment events and evidence; (b) add `engineVersion` to persisted mastery; (c) keep the three repository interfaces as the only persistence seam; (d) JSON export/import. Cost ≈ $0. |
| **1 · Post-pilot** | M6 gate passed | 1 region; `api` ×2 instances + `worker` ×1; managed Postgres (1 primary, PITR); small Redis; R2. `RemoteProgressRepository` + IndexedDB outbox behind the existing interfaces. Anonymous-first identity, email review reminders, telemetry pipeline, feature flags. ≈ $50–150/month. |
| **2 · Growth** | > 20k MAU or primary CPU > 60 % | Read replica for dashboard/explain/export reads; tutor module live; cohorts, plans and web push; partition maintenance automated (`pg_partman`); analytics export to Parquet on R2 + DuckDB. Autoscale `api` on p95 latency. |
| **3 · Scale** | > 500k MAU or event ingest > 2k/s sustained | Async projection workers; ClickHouse for analytics; sandbox-runner for Python; shard learner data by `user_id` (Citus, or app-level routing by `user_id` hash) — possible without schema changes because all hot tables lead with `user_id`. Optional read-only regional API near learners for `/sync`. |

What we deliberately **do not** do early: microservices, Kafka, Kubernetes, GraphQL, multi-region writes.

---

## 9. Reliability, security and operations

- **Backups:** PITR (7 days Stage 1, 30 days Stage 2+); weekly restore drill into a branch database.
- **Migrations:** expand → migrate → contract; never lock hot tables (`CREATE INDEX CONCURRENTLY`, add nullable columns, backfill in batches). Every migration has `up` and `down` (database skill).
- **Partition ops:** monthly partitions created 3 months ahead; events older than 13 months exported to Parquet on R2, then partitions detached and dropped.
- **Security:** session tokens stored as SHA-256 hashes; least-privilege DB roles (`kodara_api`, `kodara_worker`, `kodara_readonly`); secrets in the platform's secret store; WAF + per-IP limits on auth; CSP as in SECURITY.md; learner code never executed in `api`/`worker`.
- **Privacy:** minimal PII (email, display name, locale). Learner code and tutor messages are personal data: export and deletion supported; tutor messages retained 12 months by default. Analytics exports use pseudonymous ids.
- **Observability:** RED metrics per route; ingest lag, projection lag, outbox backlog, tutor cost/hour, partition headroom as alerting signals. `requestId` propagates browser → api → worker.
- **Degradation:** if the API is down, the SPA keeps teaching from the CDN + IndexedDB and the outbox retries later. If the LLM provider is down, the tutor shows the static, authored hints from the lesson content.

---

## 10. Monorepo layout (when Stage 1 starts)

```text
kodara/
  apps/web/            current Vite SPA (moved)
  apps/api/            Fastify modular monolith
  apps/worker/         BullMQ consumers: projections, outbox, archival, export
  packages/contracts/  zod schemas: LearningEvent, API DTOs, TraceEvent (ADR-003)
  packages/engine/     mastery, evidence normalizer, spaced review (moved from src/features/progress/engines)
  packages/content/    content build: git → /content/{release}/*.json + catalog seed SQL
  db/migrations/       SQL migrations (start from DATABASE-SCHEMA.sql)
```
