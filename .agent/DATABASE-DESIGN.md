# KODARA DATABASE DESIGN & INDEXING (TARGET)

Status: **Proposed** — [ADR-007](DECISIONS/007-backend-target-architecture.md) · Created: 2026-10-25
DDL: [DATABASE-SCHEMA.sql](DATABASE-SCHEMA.sql) · Architecture: [BACKEND-ARCHITECTURE.md](BACKEND-ARCHITECTURE.md)

> **বাংলায় এক লাইনে:** শিক্ষার্থী যা করে সেটা ইভেন্ট হিসেবে একবারই লেখা হয় (কখনো বদলায় না); mastery, review আর progress সেই ইভেন্ট থেকে হিসাব করা টেবিল। প্রতিটা টেবিলের প্রথম কলাম `user_id`, তাই একজন শিক্ষার্থীর সব ডেটা এক জায়গায় থাকে আর পরে shard করা সহজ।

**Validated 2026-10-25:** the DDL applies cleanly on PostgreSQL 17 (PGlite, with shims for the two PG 18 UUIDv7 functions). The tested behaviours:
- an idempotent retry inserts 0 rows;
- an event lands in its month partition;
- a forged `occurred_at` is rejected by CHECK;
- a duplicate open review is rejected;
- each query in §4 uses the intended index (`EXPLAIN`, tiny dataset, `enable_seqscan=off`).

**Revised and re-validated 2026-10-29** (see [REVIEWS/2026-10-29-backend-design-review.md](REVIEWS/2026-10-29-backend-design-review.md)). The revision adds shard-safe keys, the per-user sync counter (§2.8), and the `org`, `billing` and `notify` schemas. It also moves telemetry out of `learning_events`. 34 checks pass on PGlite (PostgreSQL 17, same shims). Beyond the behaviours above, they cover:
- the per-user `rev` counter;
- anonymous accounts, and linking one keeps the same user id;
- one-owner subscriptions, idempotent payment webhooks and capped invites;
- the account-deletion cascade (this check caught one FK that blocked deletion);
- the planner choosing each index in §4 on a seeded dataset of 400 learners and about 20k reviews.

Production must be **PostgreSQL 18** for native `uuidv7()` and v7 support in `uuid_extract_timestamp()`.

---

## 1. Data model at a glance

```text
 identity                  catalog (index of git content)              learning (per learner)
 ────────                  ──────────────────────────────              ──────────────────────
 users ─┬─ auth_identities  content_releases                           learning_events  ◄── SOURCE OF TRUTH
        ├─ sessions         tracks ─ modules ─ lessons ─ lesson_aliases   (append-only, monthly range partitions)
        └─ devices                    │          │                          │ projected by @kodara/engine
                                      │          ├─ lesson_concepts         ▼
                            concepts ◄┴──────────┘                       evidence (16 hash partitions by user)
                              │  ▲                                          │
                              └──┴─ concept_prerequisites (DAG)             ▼
                            challenges ─ challenge_concepts              concept_mastery   review_items
                                                                         lesson_progress   bookmarks
 users ─ consents                                                       challenge_attempts (monthly partitions)
                                                                         challenge_progress code_drafts
 tutor (Stage 2)            ops                                          daily_activity
 ───────────────            ───                                          sync_state  ◄── per-learner rev counter + write lock
 threads ─ messages         outbox_events  idempotency_keys
 usage_daily                feature_flags  audit_log (monthly)
                            execution_jobs (Stage 3)

 org (Stage 2)              billing (Stage 2+)                           notify (Stage 1–2)
 ─────────────              ──────────────────                           ──────────────────
 organizations ─ members    plans ─ subscriptions                        preferences
   └─ cohorts ─ invites     entitlements (projection)                    push_subscriptions
        └─ cohort_members   payment_events (raw webhooks)                deliveries (monthly)
           (+ summary)
```

**Sharding scope.** The `learning`, `tutor` and `notify` tables are learner-owned and lead with `user_id`. They are what gets distributed at Stage 3. `identity`, `catalog`, `org`, `billing` and `ops` stay on one node (or become Citus reference tables). They are small, or keyed by something other than the learner.

Three kinds of data with three different lifecycles:

| Kind | Tables | Write pattern | Truth? |
|---|---|---|---|
| **Facts** | `learning_events`, `challenge_attempts`, `tutor.messages` | Insert-only, high volume | Yes, never updated |
| **Projections** | `evidence`, `concept_mastery`, `lesson_progress`, `challenge_progress`, `review_items`, `bookmarks` | Upsert in place | No, rebuildable from facts |
| **Reference** | `catalog.*` | Bulk upsert at content release | Git is the truth |

Mapping to today's browser repositories:

| Browser (`localStorage`) | Server table |
|---|---|
| `kodara_evidence_v1` (`EvidenceRecord`) | `learning.evidence` (+ originating `learning_events`) |
| `kodara_mastery_v1` (`ConceptMastery`) | `learning.concept_mastery` |
| `kodara_review_v1` (`ReviewItem`) | `learning.review_items` (bilingual reason text is rendered by i18n, not stored) |
| `kodara_processed_events_v1` | not needed: PK on `learning_events` gives idempotency |
| `kodara_progress_*` (`LessonProgress`) | `learning.lesson_progress` |
| `kodara_bookmarked_lessons` | `learning.bookmarks` |
| `kodara_challenge_attempts_v1` | `learning.challenge_attempts` + `challenge_progress` |
| `kodara_challenge_drafts_v1` | `learning.code_drafts` |
| `kodara_practice_attempts_v1` | `learning_events` of type `practice.answered` (no separate table) |
| PLAN 001's proposed `predictions` table | `learning_events` of type `prediction.made` → evidence `prediction_correct/incorrect` |

---

## 2. Key design decisions

### 2.1 `user_id` leads every learner key
Every learner-owned PK starts with `user_id`. That gives:
- one B-tree descent per learner query and good cache locality for one learner's rows;
- the per-user write lock and sync counter (`sync_state`, §2.8) line up with the data layout;
- **sharding without schema changes** at Stage 3 (Citus distribution column, or app-level routing by `hash(user_id)`). There are no cross-user joins on the hot path.

### 2.2 Integer surrogate keys for the catalog
Content keys such as `concept.type-narrowing` are ~25 bytes. An `integer` is 4. `evidence` and `concept_mastery` will hold hundreds of millions of rows, so integer FKs make tables and indexes **~30–40 % smaller**. Text keys stay unique in `catalog.*`. The API maps keys ↔ ids with an in-memory map built per content release. Ids are stable: catalog seeding upserts by `key` and never renumbers.

### 2.3 UUIDv7 everywhere for learner rows
- Time-ordered, so B-tree inserts append to the right edge. Random v4 would cause page splits and write amplification.
- **Client-generated for facts** (`event_id`, `attempt_id`): the browser creates the id when the action happens, so retries, offline replay and two open tabs can't create duplicates.
- The timestamp inside the id is the partition key (`CHECK (occurred_at = uuid_extract_timestamp(event_id))`). A retry always targets the same partition, so `ON CONFLICT` works across partitions.
- The API rejects ids more than 5 minutes in the future. Old ids (offline replay) are allowed and land in their month, or in the `default` partition if that month was already archived. That partition is monitored and should stay near empty.

### 2.4 Partitioning per table, chosen by access pattern

| Table | Strategy | Why |
|---|---|---|
| `learning_events` | RANGE by month on `occurred_at` | Retention and archival are by time: detach the partition, export to Parquet, drop it. Per-user queries are time-bounded. |
| `challenge_attempts` | RANGE by month on `submitted_at` | Large rows (code + evaluation). Same retention model (12 months). |
| `tutor.messages` | RANGE by month on `created_at` | Retention 12 months; privacy deletion. |
| `evidence` | HASH by `user_id`, 16 partitions | Read pattern is "all evidence of one learner for one concept", across all time. Hash keeps that to **one** partition. Rows are small (~60 B), so it's kept for the long term. |
| Projections | none | One row per (user, entity). Bounded by learners × concepts. |

16 hash partitions keeps each partition's vacuum and index rebuilds small. Raising the count later means a rewrite, so pick 32 instead if Stage 3 looks likely within a year.

### 2.5 Enums for closed vocabularies
Postgres `ENUM` costs 4 bytes, keeps SQL readable, and rejects typos. Adding a value is a cheap `ALTER TYPE … ADD VALUE`, which is fine because a new event type is a contract change anyway. Values are canonical English (ADR-004). Bangla and English labels live in `src/i18n`, never in the DB.

### 2.6 Projections update in place, so leave room
`concept_mastery` (fillfactor 80), `lesson_progress` and `challenge_progress` (85), and `code_drafts` (70) leave free space in each page. Postgres can then do **HOT updates**: there's no new index entry when indexed columns don't change. `rev` *is* indexed and does change, so the sync index still gets an entry per update. That's the price of cheap sync, and it's one small index.

### 2.7 Trust columns
`evidence.verification`, `challenge_attempts.verification` and `concept_mastery.verified_score` separate browser-reported results from server re-verified ones (BACKEND-ARCHITECTURE §3.3). Credentials will read only `verified_score`.

### 2.8 Sync cursor (`rev`): one counter per learner
Each learner has one row in `learning.sync_state (user_id, rev, epoch)`. Every transaction that writes a projection starts with:

```sql
UPDATE learning.sync_state SET rev = rev + $n, updated_at = now()
WHERE user_id = $1 RETURNING rev;      -- hands out revs (rev-$n+1 .. rev) for this txn
```

That one statement does two jobs:
- **It serializes the learner.** The row lock means two devices ingesting at once commit one after the other. So for one learner, commit order equals rev order, and `WHERE user_id = $1 AND rev > $cursor` can never skip a row that commits late.
- **It hands out revisions that stay monotonic per learner** wherever that learner's rows live.

Why not the original global sequence plus `pg_advisory_xact_lock`? It works on one node and breaks at Stage 3. With Citus or app-level sharding, each node has its own sequence range. When the rebalancer moves a learner to another node, new revs can be **lower** than revs the client already saw, and the client silently misses rows. A per-learner counter moves with the learner's data. It costs one HOT update per ingest transaction (`fillfactor = 70`).

`epoch` is bumped by a projection rebuild. A cursor from an older epoch makes `/sync` answer `reset: true` (API-SPEC §5). Deletes are tombstones (`bookmarks.removed_at`, `review_items.status`), so other devices see them.

The `sync_state` row is created in the same transaction as the user row.

---

## 3. Table notes

| Table | PK | Notes |
|---|---|---|
| `identity.users` | `id` | `citext` email; unique only among non-deleted rows; soft delete + 30-day purge job. |
| `identity.sessions` | `id` | Stores `sha256(token)` only; lookup by `token_hash` on every request; expired rows hard-deleted. |
| `identity.devices` | `id` (client) | Per-device sync cursor and diagnostics. |
| `catalog.lessons` | `id` | `section_count` lets the server compute `progress_pct`; `lesson_aliases` replaces `LEGACY_CURRICULUM_ALIASES`. |
| `catalog.concept_prerequisites` | `(concept_id, prerequisite_id)` | DAG edges; cycles are rejected by the content validator in CI, not by the DB. |
| `catalog.challenges` | `id` | `test_suite_sha256` only; hidden tests live in a private bucket. |
| `learning.learning_events` | `(user_id, occurred_at, event_id)` | `payload` is capped at 16 KB and **not indexed**. `engine_version` and `release_id` make replays reproducible. |
| `learning.evidence` | `(user_id, concept_id, occurred_at, event_id)` | Mirrors `EvidenceRecord`. Unique because `(event_id, concept_id)` is unique. |
| `learning.concept_mastery` | `(user_id, concept_id)` | Mirrors `ConceptMastery` + `MasteryDimensions`; `engine_version` marks rows to recompute after a formula change. |
| `learning.review_items` | `(user_id, id)` | One open item per (user, concept) via a partial unique index; `interval_step` walks `spacedIntervalsDays`. |
| `learning.sync_state` | `user_id` | Per-learner rev counter and write lock (§2.8). |
| `learning.daily_activity` | `(user_id, day)` | Streaks, goal progress, activity calendar. `day` is in the learner's `time_zone` at event time. A later time-zone change doesn't rewrite history. |
| `identity.users` | `id` | `kind` is `anonymous` or `registered`; linking flips `kind` in place, so the user id never changes (API-SPEC §6.1). `email` is null for anonymous and phone-only accounts. `roles` is an array. |
| `identity.consents` | `(user_id, purpose, recorded_at)` | Append-only. The current state is the latest row. Sharing a learner's progress with a cohort requires `cohort_sharing`. |
| `learning.challenge_attempts` | `(user_id, submitted_at, attempt_id)` | Code ≤ 64 KB (TOAST-compressed); `evaluation` jsonb = `ChallengeEvaluation`. |
| `learning.challenge_progress` | `(user_id, challenge_id)` | Best status/score summary so challenge lists never scan attempts. |
| `tutor.threads` | `(user_id, id)` | Shard-safe key. |
| `tutor.messages` | `(user_id, thread_id, created_at, id)` | Token and cost per message; quotas live in Redis, `usage_daily` is the ledger. |
| `org.cohort_members` | `(cohort_id, user_id)` | Roster **and** per-learner summary (`loops_completed`, `avg_mastery`, weakest concepts). The worker updates it from the outbox. Instructors never query learner tables directly, so a cohort report is one index range, not a fan-out across shards. Rows are removed when the learner leaves or revokes `cohort_sharing`. |
| `org.cohort_invites` | `code` | `used_count <= max_uses` CHECK. Accepting is a single `UPDATE … SET used_count = used_count + 1`, so the last seat can't be taken twice. |
| `billing.subscriptions` | `id` | Owned by exactly one user **or** one org (CHECK). |
| `billing.entitlements` | `(user_id, feature, source)` | Projection of free tier, subscriptions, org seats and grants. The effective limit is the max over sources. Cached in Redis with the session. |
| `billing.payment_events` | `(provider, provider_event_id)` | Raw webhook stored first, processed later. A provider retry is `ON CONFLICT DO NOTHING`. |
| `notify.deliveries` | `(user_id, sent_at, id)` | Frequency caps ("at most 1 review reminder per day") read today's rows by PK prefix. Monthly partitions, 6-month retention. |
| `ops.outbox_events` | `id` | Written in the business txn; worker publishes and stamps `published_at`. |
| `ops.idempotency_keys` | `(user_id, key)` | Non-event POSTs (API-SPEC §2.4). TTL 24 h. |
| `ops.audit_log` | `(at, id)` | Privileged actions. Monthly partitions, 24-month retention. |

---

## 4. Index design — query by query

Rule: **every index answers a named query from the API or a worker**. If no query needs it, it isn't created.

| # | Query (who runs it) | Index used | Shape |
|---|---|---|---|
| Q1 | Ingest: insert event, skip duplicates (`POST /events:batch`) | `learning_events` PK `(user_id, occurred_at, event_id)` | Unique probe in one month partition |
| Q2 | Learner's events in a time range (support, replay) | same PK | Range scan, one partition per month |
| Q3 | "Explain mastery of concept C" (`/me/mastery/{c}/explain`, engine recompute) | `evidence` PK `(user_id, concept_id, occurred_at, event_id)` | One hash partition, backward scan |
| Q4 | Dashboard / skill map / tutor context: all mastery of a learner | `concept_mastery` PK `(user_id, concept_id)` | Range on `user_id` prefix |
| Q5 | Sync pull for each projection (`GET /sync`) | `*_sync_idx (user_id, rev)` on 6 tables | Range `rev > cursor`, ordered |
| Q6 | Today's reviews (`/me/reviews`) | `review_items_due_idx (user_id, due_at) WHERE status='pending'` | Partial, small |
| Q7 | Prevent a duplicate open review (projection upsert) | `review_items_open_uq (user_id, concept_id) WHERE status='pending'` | Partial unique, `ON CONFLICT` target |
| Q8 | "Continue learning" card | `lesson_progress_resume_idx (user_id, last_visited_at DESC) WHERE status='in_progress'` | Partial, top-1 |
| Q9 | Attempts on a challenge, newest first | `challenge_attempts_user_challenge_idx (user_id, challenge_id, submitted_at DESC)` | Merge-append across monthly partitions (≤ 13) |
| Q10 | Verification worker: unverified passes | `challenge_attempts_to_verify_idx (submitted_at) WHERE verification='self_reported' AND status='passed'` | Partial queue index |
| Q11 | Prerequisite weakness: concepts that depend on X | `concept_prereq_reverse_idx (prerequisite_id, concept_id)` | Index-only scan |
| Q12 | Concepts taught/assessed by a lesson or challenge, and the reverse | `lesson_concepts` / `challenge_concepts` PK + `*_concept_idx` | Both directions |
| Q13 | Decay sweeper: idle learners with high mastery | `concept_mastery_decay_idx (last_activity_at) WHERE level IN (proficient, mastered, expert)` | Partial range |
| Q14 | Recompute after `MASTERY_CONFIG.version` change | `concept_mastery_engine_idx (engine_version)` | Low-cardinality, batch job only |
| Q15 | Session check (every request) | `sessions_token_hash_uq` | Unique probe; cached in Redis 60 s |
| Q16 | Login / OAuth callback | `users_email_active_uq` (partial), `auth_identities` PK `(provider, provider_subject)` | Unique probe |
| Q17 | Sweepers: expired sessions, purge deleted users | `sessions_expires_idx`, `users_deleted_at_idx` (partial) | Range |
| Q18 | Tutor: recent threads; thread for current challenge; load thread | `threads_user_recent_idx`, `threads_user_challenge_idx` (partial), `messages` PK | Range / probe |
| Q19 | Outbox relay | `outbox_unpublished_idx (id) WHERE published_at IS NULL` | Tiny partial index, stays small |
| Q20 | Global AI spend per day (circuit breaker) | `usage_daily_day_idx (day)` | Range |
| Q21 | Lock the learner and allocate revs (every ingest and draft write) | `sync_state` PK | Unique probe + HOT update |
| Q22 | Reminder scheduler: learners with reviews due soon (per shard) | `review_items_due_global_idx (due_at) WHERE status='pending'` | Partial range |
| Q23 | Streak calendar, streak walk-back (`/me/activity`) | `daily_activity` PK `(user_id, day)` | Range |
| Q24 | Current consent for a purpose | `consents` PK, backward | Top-1 |
| Q25 | Cohort roster and report (`/cohorts/{id}/members`, `/report`) | `cohort_members` PK `(cohort_id, user_id)` | Range, paginated |
| Q26 | Ingest fan-out: which cohorts does this learner belong to? | `cohort_members_user_idx (user_id)` | Probe |
| Q27 | Idempotency replay | `idempotency_keys` PK | Unique probe |
| Q28 | Audit: who touched learner X / what did admin Y do | `audit_log_target_idx`, `audit_log_actor_idx` | Range per partition |
| Q29 | Purge anonymous learners idle for 90 days | `users_anonymous_idle_idx (last_active_at)` partial | Range |
| Q30 | Payment webhook processor backlog | `payment_events_unprocessed_idx` partial | Tiny queue index |

### Deliberately **not** indexed
- `learning_events.payload` (no GIN). Product analytics run on the Parquet/ClickHouse copy, never on the OLTP primary.
- `learning_events.type` alone. "All events of type X" is an analytics question.
- `evidence.signal`, `concept_mastery.level` alone. Low selectivity; always filtered by `user_id` first.
- `tutor.messages.content` (no full-text). Use a search index later only if a feature needs it.
- No FKs from partitioned fact tables to `users`/`catalog`. That keeps inserts cheap. Integrity comes from the API (ids come from the catalog map and the session) and the purge job.

### Index hygiene
- Create indexes on live tables with `CREATE INDEX CONCURRENTLY` (on partitioned tables: per partition, then `ATTACH`).
- Monitor `pg_stat_user_indexes.idx_scan`. Drop an index with zero scans over 30 days, unless it's in the table above as a worker or constraint index.
- Check bloat on `*_sync_idx` and `concept_mastery` monthly; `REINDEX CONCURRENTLY` when bloat > 30 %.

---

## 5. Hot transactions

**Ingest a batch (Q21 + Q1 + projections), one transaction per request:**
```sql
UPDATE learning.sync_state SET rev = rev + $n, updated_at = now()   -- lock learner, allocate $n revs
WHERE user_id = $user_id RETURNING rev;                             -- $n = projection rows this batch writes

INSERT INTO learning.learning_events (user_id, occurred_at, event_id, type, ...)
SELECT ... FROM unnest($ids::uuid[], ...)            -- batch, max 100
ON CONFLICT (user_id, occurred_at, event_id) DO NOTHING
RETURNING event_id;                                  -- only new events are projected

INSERT INTO learning.evidence ... ;                  -- rows from engine.normalize(newEvents)

INSERT INTO learning.concept_mastery AS m (...) VALUES (...)
ON CONFLICT (user_id, concept_id) DO UPDATE
  SET score = EXCLUDED.score, level = EXCLUDED.level, ...,
      rev = EXCLUDED.rev, updated_at = now();         -- a rev from the range allocated above

INSERT INTO learning.review_items (...) VALUES (...)
ON CONFLICT (user_id, concept_id) WHERE status = 'pending' DO UPDATE SET due_at = EXCLUDED.due_at, ...;

INSERT INTO ops.outbox_events (topic, key, payload) VALUES ('learning.ingested', $user_id, ...);
```

The server can't know `$n` exactly before projecting. Run the engine first (pure, in memory), count the rows it will upsert, then allocate. Over-allocating is harmless: gaps in `rev` are fine, only order matters.

**Sync pull (Q5):** one query per projection table, `WHERE user_id = $1 AND rev > $2 ORDER BY rev LIMIT 500`, merged by `rev` and cut at `limit`. The response cursor is `{ max rev returned, epoch }`.

---

## 6. Sizing (Stage 3: 1M MAU, 150k DAU)

| Table | Rows/day | Row size | Growth/year | Kept hot |
|---|---|---|---|---|
| `learning_events` | ~9M (60 learning facts per active learner; the other ~140 interactions are telemetry, API-SPEC §8) | ~250 B + index ~60 B | ~1 TB | 13 months, then Parquet on R2 (~10× smaller) |
| `evidence` | ~13M (1.5 per event) | ~60 B + index ~50 B | ~0.5 TB | long-term (compact); compaction job can roll up evidence older than 1 year |
| `concept_mastery` | upserts | ~120 B | bounded: learners × concepts touched (≈ 1M × 60 = 60M rows ≈ 10 GB) | all |
| `challenge_attempts` | 1.5M | ~2 KB (TOAST) | ~1 TB | 12 months |
| `tutor.messages` | 1.5M | ~1 KB | ~0.5 TB | 12 months |

At Stage 1–2 the whole database stays in tens of GB, so a single managed instance is plenty. The design only reaches for sharding when §8 of BACKEND-ARCHITECTURE triggers.

---

## 7. Operations

- **Partition maintenance:** `pg_partman` (or a worker cron) keeps 3 future monthly partitions. Monthly job: export the oldest partition to Parquet on R2, verify the row count, `DETACH PARTITION … CONCURRENTLY`, `DROP`.
- **Autovacuum:** projection tables `autovacuum_vacuum_scale_factor = 0.02`; insert-only leaf partitions set `autovacuum_vacuum_insert_scale_factor = 0.05` so the visibility map stays fresh for index-only scans. Storage parameters must be set on **leaf** partitions; Postgres rejects them on the parent (found during validation).
- **Rebuild a projection:** worker iterates users with `engine_version <> current`, reads evidence (Q3), recomputes with `@kodara/engine`, upserts. Idempotent and resumable.
- **Account deletion:** unpartitioned projections go by FK cascade from `users`. Partitioned tables without FKs (`learning_events`, `evidence`, `challenge_attempts`, `tutor.messages`) are deleted by `user_id` (a PK prefix, or the leading column of an index, in each partition). Remove from Parquet archives on the next compaction.
- **Migrations:** expand/contract, `up` + `down` (database skill). Never `ALTER TYPE … RENAME VALUE` on a live enum; add new values instead.
- **Anonymous learners:** purged after 90 days idle (Q29), by the same path as account deletion. `last_active_at` is bumped at most once an hour, so it adds no write load to the ingest path.
- **Retention summary:** `learning_events` 13 months hot, then Parquet. `challenge_attempts` and `tutor.messages` 12 months. `notify.deliveries` 6 months. `ops.audit_log` 24 months. `ops.idempotency_keys` 24 h.
- **Roles:** `kodara_api` (DML on identity/learning/tutor/org/notify, read on billing, insert on outbox, audit and idempotency), `kodara_worker` (adds billing DML, ops and partition DDL), `kodara_readonly` (support, replica only).

---

## 8. Migration from the browser (Stage 1 onboarding)

1. On first sign-in, the client reads its three `localStorage` repositories and converts them to `learning_events` (`practice.answered`, `challenge.submitted`, `lesson.section_completed`, `lesson.bookmark_set`). Each gets a UUIDv7 built from the **original timestamp**, so re-uploading is idempotent.
2. Upload through the normal `POST /events:batch` path, so there's no special import code on the server.
3. The server projects mastery with its engine. The client then replaces local mastery with the server's version.
4. Local data is kept until the server confirms the counts, then marked migrated.

Prep work allowed **now** under ADR-005 (Stage 0): generate UUIDv7 ids for new assessment events and evidence, and persist `engineVersion` with mastery. Both are small client-only changes that make step 1 lossless.
