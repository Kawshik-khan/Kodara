# Principal Review: Backend, Database and API Design

Date: 2026-10-29 · Scope: [ADR-007](../DECISIONS/007-backend-target-architecture.md), [BACKEND-ARCHITECTURE.md](../BACKEND-ARCHITECTURE.md), [DATABASE-DESIGN.md](../DATABASE-DESIGN.md), [DATABASE-SCHEMA.sql](../DATABASE-SCHEMA.sql) · Output: these docs revised, plus the new [API-SPEC.md](../API-SPEC.md)

> **বাংলায় এক লাইনে:** মূল নকশা ঠিক আছে (local-first, event-sourced, modular monolith)। যা বদলেছে: shard করলে যেগুলো ভাঙত সেগুলো ঠিক করা হয়েছে, UI-ক্লিকের ডেটা মূল ডাটাবেস থেকে আলাদা করা হয়েছে, লগইন ছাড়াই শেখা শুরু করা যায়, আর পুরো API চুক্তি লেখা হয়েছে।

## Verdict
The core architecture is right for Kodara, and it is **kept**:
- browser as the primary runtime;
- immutable, idempotent learning events as the source of truth;
- one mastery engine shared by browser and server;
- content as code on a CDN;
- a modular monolith on Postgres;
- staged scaling.

The issues below are about what breaks at Stage 3, what was missing for the product, and the missing API contract.

## Findings and resolutions

| # | Sev. | Finding | Resolution |
|---|---|---|---|
| F1 | P1 | **Sync cursors break after resharding.** `rev` came from one global sequence. Under Citus or app-level sharding, each node has its own range. A learner moved by the rebalancer can get new revs **lower** than ones the client already holds, and their devices then silently miss updates. | A per-learner counter, `learning.sync_state`. The same `UPDATE … RETURNING` also row-locks the learner, replacing `pg_advisory_xact_lock`. Adds `epoch` for clean resets after a rebuild. DATABASE-DESIGN §2.8. |
| F2 | P1 | **Some learner PKs don't lead with `user_id`**: `review_items (id)`, `tutor.threads (id)`, `tutor.messages (thread_id, …)`, `devices (id)`, `execution_jobs (created_at, id)`. Distributed tables need the distribution column in every PK and unique constraint. This contradicted the design's own rule (§2.1). | All re-keyed to `(user_id, …)`. Redundant indexes dropped. |
| F3 | P1 | **Account deletion could fail.** `org.cohort_invites.created_by` had no `ON DELETE` rule, so deleting an instructor's account raised an FK error. Found by the new validation suite. | `ON DELETE SET NULL`. The cascade is now covered by a test. |
| F4 | P1 | **Phone-only accounts were impossible.** `users.email` was `NOT NULL`, yet `auth_identities` allows `phone_otp`. | `email` nullable. `kind` (`anonymous` / `registered`) with a CHECK. |
| F5 | P1 | **Trust gap in event payloads.** Nothing said whether concept ids and weights come from the client. If they do, a modified client can inflate mastery on any concept. | Rule: the client reports facts, the server derives concepts, difficulty and weight from the release manifest. BACKEND-ARCHITECTURE §3.5, API-SPEC §7.3. |
| F6 | P2 | **Telemetry in the OLTP fact table.** `story.page_viewed` and `execution.run` drive no projection but make up most of the event volume. | Removed from `learning.event_type`. New `POST /telemetry:batch` → Redis Stream → Parquet on R2. Stage 3 `learning_events` drops from ~30M to ~9M rows/day. |
| F7 | P2 | **No CSRF defense.** Cookie sessions plus JSON POSTs had no CSRF protection, and SECURITY.md (`Strict`) contradicted BACKEND-ARCHITECTURE (`Lax`). | `SameSite=Lax` (needed for the OAuth return), `Origin` allowlist and a required `X-Kodara-Client` header. SECURITY.md updated. |
| F8 | P2 | **Sign-in wall vs. local-first.** Sync needed a registered account. That costs learners at the moment of first value, and it distorts the pilot's "return within 7 days" metric. | Anonymous-first identity, created lazily at the first completed section and linked in place later. API-SPEC §6.1. |
| F9 | P2 | **`challenge_attempts.attempt_no` was client-computed.** Two offline devices both send `3`. | Documented as display-only. The authoritative count is `challenge_progress.attempts_count`. `attempt_id` = `eventId`. |
| F10 | P2 | **Tutor streaming over `EventSource`.** It can't send a POST, and a dropped stream lost the answer. | `fetch` streaming. The server persists on completion even after a disconnect, and a resume endpoint replays it. |
| F11 | P2 | **Missing product domains for the roadmap**: review reminders (the retention lever for spaced repetition), streaks and goals, cohorts for the pilot and universities, plans and entitlements for tutor cost, consent, feature flags for the pilot, audit of admin access. | `notify`, `org`, `billing` schemas. `learning.daily_activity`, `identity.consents`, `ops.idempotency_keys`, `ops.feature_flags`, `ops.audit_log`. Each is stage-gated. |
| F12 | P3 | **No API contract.** There was a summary table only: no types, errors, pagination, idempotency, limits or event payload schemas. | [API-SPEC.md](../API-SPEC.md). |
| F13 | P3 | **Break-It wasn't evidence.** PRODUCT §4.3 counts "time to diagnose and fix Break-It", but no event or signal carried it. | `break_it.resolved` event, `break_it_resolved` evidence signal, `break_it` source. Needs a matching client change when the engine moves to `packages/engine`. |

## Validation
The DDL was re-run on PGlite (PostgreSQL 17, with shims for `uuidv7()` and v7 `uuid_extract_timestamp()`): **34 checks pass**. They cover:
- idempotent ingest, partition routing and the per-learner rev counter;
- the CHECK constraints for anonymous users, forged timestamps, invite caps and subscription ownership;
- idempotent payment webhooks;
- the account-deletion cascade;
- the planner choosing the intended index for Q5–Q30, on a seeded dataset of 400 learners, about 20k reviews and a year of activity.

The script isn't in the repo, because the repo has no backend tooling yet (ADR-005). When Stage 1 starts, port it to `db/tests/` and run it in CI against real PostgreSQL 18.

## Open items (owner: product owner + principal agent)
1. **Auth provider ADR.** Self-hosted sessions vs. a provider. The API contract works with either.
2. **Payments ADR (Stage 2).** Confirm bKash / SSLCommerz merchant requirements and pricing in BDT before `billing` is built.
3. **Pilot analytics ADR (M6).** Telemetry without consent records no user or install id. Confirm this satisfies the pilot's privacy goal.
4. ~~**Client follow-up (Stage 0):** add `prediction_*` and `break_it_*` signals and generate UUIDv7 ids.~~ **Done 2026-10-29** (STATE/CURRENT.md §5a). Still open in Stage 0: persist `engineVersion` with each mastery row.
