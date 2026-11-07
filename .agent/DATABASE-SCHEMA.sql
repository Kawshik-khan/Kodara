-- =============================================================================
-- KODARA — TARGET DATABASE SCHEMA (PostgreSQL 18)
-- Status: Proposed (ADR-007, revised 2026-10-29). Not deployed. Do not build
-- before the PLAN 001 M6 gate.
-- Rationale for every table and index: .agent/DATABASE-DESIGN.md
-- API contract that reads and writes these tables: .agent/API-SPEC.md
--
-- Conventions
--   * One schema per backend module: identity, catalog, learning, tutor, org,
--     billing, notify, ops.
--   * Learner-owned tables lead with user_id in the PK (partition/shard key).
--     identity.users, sessions and the catalog are not sharded (small,
--     reference-like); learning, tutor and notify rows are.
--   * Catalog rows use small integer surrogate ids; the API maps stable text keys
--     ("concept.closure") to ids from an in-memory catalog.
--   * Ids for learner rows are UUIDv7 (time-ordered). Client-created where the
--     client is the origin (events, attempts) so retries are idempotent.
--   * timestamptz everywhere. Canonical English enum values (ADR-004).
--   * Sync revisions come from learning.sync_state (one counter per learner),
--     not a global sequence: see DATABASE-DESIGN §2.8.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS learning;
CREATE SCHEMA IF NOT EXISTS tutor;
CREATE SCHEMA IF NOT EXISTS org;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS notify;
CREATE SCHEMA IF NOT EXISTS ops;

-- -----------------------------------------------------------------------------
-- Shared enum types
-- -----------------------------------------------------------------------------
CREATE TYPE identity.locale        AS ENUM ('bn', 'en');
CREATE TYPE identity.user_role     AS ENUM ('learner', 'author', 'admin');
CREATE TYPE identity.user_kind     AS ENUM ('anonymous', 'registered');
CREATE TYPE identity.consent_purpose AS ENUM ('product_analytics', 'email_reminders', 'cohort_sharing');
CREATE TYPE catalog.difficulty     AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE catalog.importance     AS ENUM ('critical', 'high', 'standard');
CREATE TYPE catalog.prereq_kind    AS ENUM ('hard', 'soft');
CREATE TYPE catalog.lesson_concept_role AS ENUM ('introduces', 'reinforces', 'assesses');
CREATE TYPE catalog.challenge_kind AS ENUM (
  'code-implementation', 'debugging-challenge', 'refactoring-challenge',
  'type-design-challenge', 'code-reasoning-challenge', 'architecture-challenge');
CREATE TYPE catalog.code_language  AS ENUM ('javascript', 'typescript', 'python', 'react');

-- Learning facts only. UI interaction (page views, skin toggles, playground
-- runs) is telemetry and never reaches Postgres (API-SPEC §8).
CREATE TYPE learning.event_type AS ENUM (
  'lesson.section_completed', 'lesson.completed', 'lesson.bookmark_set',
  'prediction.made',
  'practice.answered', 'practice.session_completed',
  'challenge.started', 'challenge.submitted', 'hint.revealed',
  'break_it.resolved', 'review.completed');
CREATE TYPE learning.evidence_signal AS ENUM (
  'practice_correct', 'practice_incorrect', 'challenge_passed', 'challenge_failed',
  'challenge_partial', 'concept_demonstrated', 'lesson_section_completed',
  'hint_used', 'prediction_correct', 'prediction_incorrect', 'break_it_resolved');
CREATE TYPE learning.evidence_source AS ENUM ('practice', 'challenge', 'lesson', 'review', 'prediction', 'break_it');
CREATE TYPE learning.mastery_level   AS ENUM (
  'not_started', 'introduced', 'developing', 'proficient', 'mastered', 'expert');
CREATE TYPE learning.lesson_status   AS ENUM ('in_progress', 'completed');
CREATE TYPE learning.attempt_status  AS ENUM (
  'passed', 'failed', 'partial', 'timeout', 'compile-error', 'runtime-error', 'not_verified');
CREATE TYPE learning.verification    AS ENUM ('self_reported', 'server_verified');
CREATE TYPE learning.review_reason   AS ENUM (
  'mastery_decay', 'below_threshold', 'consecutive_errors', 'long_absence',
  'spaced_interval', 'prerequisite_weakness');
CREATE TYPE learning.review_priority AS ENUM ('critical', 'high', 'normal', 'low');
CREATE TYPE learning.review_status   AS ENUM ('pending', 'completed', 'dismissed');
CREATE TYPE tutor.message_role       AS ENUM ('learner', 'tutor', 'system_note');
CREATE TYPE org.org_role             AS ENUM ('owner', 'admin', 'instructor');
CREATE TYPE billing.entitlement_source AS ENUM ('free', 'subscription', 'org_seat', 'grant');
CREATE TYPE billing.subscription_status AS ENUM ('pending', 'active', 'past_due', 'canceled', 'expired');
CREATE TYPE notify.channel           AS ENUM ('email', 'push');
CREATE TYPE notify.reminder_mode     AS ENUM ('off', 'daily', 'smart');

-- =============================================================================
-- IDENTITY  (not sharded: one small row per account)
-- =============================================================================
CREATE TABLE identity.users (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  kind            identity.user_kind NOT NULL DEFAULT 'registered',
  email           citext,                          -- null for anonymous and phone-only accounts
  email_verified_at timestamptz,
  display_name    text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  locale          identity.locale NOT NULL DEFAULT 'bn',
  time_zone       text NOT NULL DEFAULT 'Asia/Dhaka' CHECK (char_length(time_zone) <= 64),
  daily_goal_minutes smallint NOT NULL DEFAULT 10 CHECK (daily_goal_minutes BETWEEN 0 AND 240),
  roles           identity.user_role[] NOT NULL DEFAULT '{learner}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  last_active_at  timestamptz NOT NULL DEFAULT now(),  -- bumped at most hourly (anonymous purge)
  deleted_at      timestamptz,                     -- soft delete; purge job after 30 days
  CHECK (kind = 'registered' OR email IS NULL)     -- anonymous users have no email
);
-- Login lookup; a deleted account frees its email.
CREATE UNIQUE INDEX users_email_active_uq ON identity.users (email)
  WHERE deleted_at IS NULL AND email IS NOT NULL;
-- Purge job: find accounts whose grace period ended.
CREATE INDEX users_deleted_at_idx ON identity.users (deleted_at) WHERE deleted_at IS NOT NULL;
-- Purge job: anonymous learners idle for 90 days.
CREATE INDEX users_anonymous_idle_idx ON identity.users (last_active_at)
  WHERE kind = 'anonymous' AND deleted_at IS NULL;

CREATE TABLE identity.auth_identities (
  user_id          uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  provider         text NOT NULL CHECK (provider IN ('google', 'email_otp', 'phone_otp')),
  provider_subject text NOT NULL,                  -- Google "sub", normalized email or E.164 phone
  created_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider, provider_subject)         -- OAuth callback lookup
);
CREATE INDEX auth_identities_user_idx ON identity.auth_identities (user_id);

CREATE TABLE identity.sessions (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  user_id      uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  token_hash   bytea NOT NULL,                     -- sha256(cookie token); the raw token is never stored
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  ip           inet,
  user_agent   text CHECK (char_length(user_agent) <= 512)
);
CREATE UNIQUE INDEX sessions_token_hash_uq ON identity.sessions (token_hash);   -- every request
CREATE INDEX sessions_user_idx    ON identity.sessions (user_id);                -- "log out everywhere"
CREATE INDEX sessions_expires_idx ON identity.sessions (expires_at);            -- hard-delete sweeper

CREATE TABLE identity.devices (
  user_id      uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  id           uuid NOT NULL,                      -- generated by the client, stored in IndexedDB
  platform     text CHECK (char_length(platform) <= 64),
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_sync_at timestamptz,
  PRIMARY KEY (user_id, id)
);

-- Consent history: append-only, the latest row per purpose is in force.
CREATE TABLE identity.consents (
  user_id        uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  purpose        identity.consent_purpose NOT NULL,
  recorded_at    timestamptz NOT NULL DEFAULT now(),
  granted        boolean NOT NULL,
  policy_version text NOT NULL CHECK (char_length(policy_version) <= 32),
  PRIMARY KEY (user_id, purpose, recorded_at)      -- "current consent" = last row, backward scan
);

-- =============================================================================
-- CATALOG  (index of content that lives in git + CDN; tiny, read-mostly)
-- =============================================================================
CREATE TABLE catalog.content_releases (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  version      text NOT NULL UNIQUE,              -- e.g. "2027.01.15-1"
  manifest_sha256 bytea NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_active    boolean NOT NULL DEFAULT false
);
-- Exactly one active release.
CREATE UNIQUE INDEX content_releases_one_active_uq ON catalog.content_releases (is_active) WHERE is_active;

CREATE TABLE catalog.tracks (
  id    smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key   text NOT NULL UNIQUE,                     -- "javascript"
  is_frozen boolean NOT NULL DEFAULT false        -- ADR-005 freezes all but JavaScript
);

CREATE TABLE catalog.modules (
  id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key      text NOT NULL UNIQUE,
  track_id smallint NOT NULL REFERENCES catalog.tracks (id) ON DELETE RESTRICT,
  position smallint NOT NULL,
  UNIQUE (track_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE catalog.lessons (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         text NOT NULL UNIQUE,                -- canonical lesson id
  module_id   integer NOT NULL REFERENCES catalog.modules (id) ON DELETE RESTRICT,
  position    smallint NOT NULL,
  difficulty  catalog.difficulty NOT NULL,
  section_count smallint NOT NULL CHECK (section_count > 0),
  introduced_release_id integer NOT NULL REFERENCES catalog.content_releases (id),
  retired_release_id    integer REFERENCES catalog.content_releases (id),
  UNIQUE (module_id, position) DEFERRABLE INITIALLY DEFERRED
);

-- Old ids (LEGACY_CURRICULUM_ALIASES, slugs) resolve to one canonical lesson.
CREATE TABLE catalog.lesson_aliases (
  alias     text PRIMARY KEY,
  lesson_id integer NOT NULL REFERENCES catalog.lessons (id) ON DELETE CASCADE
);

CREATE TABLE catalog.concepts (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         text NOT NULL UNIQUE,                -- "concept.closure"
  track_id    smallint NOT NULL REFERENCES catalog.tracks (id) ON DELETE RESTRICT,
  domain      text NOT NULL,
  difficulty  smallint NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  importance  catalog.importance NOT NULL DEFAULT 'standard',
  introduced_release_id integer NOT NULL REFERENCES catalog.content_releases (id),
  retired_release_id    integer REFERENCES catalog.content_releases (id)
);
CREATE INDEX concepts_track_idx ON catalog.concepts (track_id);

-- Prerequisite DAG. Cycle-freedom is enforced by the content validator in CI.
CREATE TABLE catalog.concept_prerequisites (
  concept_id      integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE CASCADE,
  prerequisite_id integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE CASCADE,
  kind            catalog.prereq_kind NOT NULL,
  PRIMARY KEY (concept_id, prerequisite_id),       -- "what does X need?"
  CHECK (concept_id <> prerequisite_id)
);
-- Reverse edge: "which concepts depend on X?" (prerequisite_weakness reviews).
CREATE INDEX concept_prereq_reverse_idx ON catalog.concept_prerequisites (prerequisite_id, concept_id);

CREATE TABLE catalog.lesson_concepts (
  lesson_id  integer NOT NULL REFERENCES catalog.lessons (id) ON DELETE CASCADE,
  concept_id integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE CASCADE,
  role       catalog.lesson_concept_role NOT NULL,
  PRIMARY KEY (lesson_id, concept_id)
);
CREATE INDEX lesson_concepts_concept_idx ON catalog.lesson_concepts (concept_id, lesson_id);

CREATE TABLE catalog.challenges (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key        text NOT NULL UNIQUE,
  lesson_id  integer REFERENCES catalog.lessons (id) ON DELETE SET NULL,
  kind       catalog.challenge_kind NOT NULL,
  language   catalog.code_language NOT NULL,
  difficulty catalog.difficulty NOT NULL,
  test_suite_sha256 bytea NOT NULL,                -- hidden tests live in a private bucket, not here
  introduced_release_id integer NOT NULL REFERENCES catalog.content_releases (id),
  retired_release_id    integer REFERENCES catalog.content_releases (id)
);
CREATE INDEX challenges_lesson_idx ON catalog.challenges (lesson_id);

CREATE TABLE catalog.challenge_concepts (
  challenge_id integer NOT NULL REFERENCES catalog.challenges (id) ON DELETE CASCADE,
  concept_id   integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE CASCADE,
  PRIMARY KEY (challenge_id, concept_id)
);
CREATE INDEX challenge_concepts_concept_idx ON catalog.challenge_concepts (concept_id, challenge_id);

-- =============================================================================
-- LEARNING — per-learner sync counter (and write lock)
-- =============================================================================
-- One row per learner, created with the user. Every transaction that writes a
-- projection first runs
--   UPDATE learning.sync_state SET rev = rev + $n WHERE user_id = $1 RETURNING rev
-- which (a) hands out $n revisions that are monotonic for this learner, and
-- (b) row-locks the learner, serializing ingest from several devices. Unlike a
-- global sequence, this stays monotonic when a learner's shard moves.
CREATE TABLE learning.sync_state (
  user_id    uuid PRIMARY KEY REFERENCES identity.users (id) ON DELETE CASCADE,
  rev        bigint NOT NULL DEFAULT 0,
  epoch      integer NOT NULL DEFAULT 1,           -- bumped by a projection rebuild → clients reset
  updated_at timestamptz NOT NULL DEFAULT now()
) WITH (fillfactor = 70);                          -- updated on every ingest: keep HOT

-- =============================================================================
-- LEARNING — source of truth: append-only events
-- =============================================================================
-- Range-partitioned by month on occurred_at. occurred_at is the timestamp
-- embedded in the client-generated UUIDv7 event_id (enforced by CHECK), so a
-- retried event always lands in the same partition and ON CONFLICT dedupes it.
CREATE TABLE learning.learning_events (
  user_id        uuid NOT NULL,                    -- no FK: partitioned, high volume; purge job deletes
  occurred_at    timestamptz NOT NULL,
  event_id       uuid NOT NULL,
  type           learning.event_type NOT NULL,
  schema_version smallint NOT NULL DEFAULT 1,
  device_id      uuid,
  release_id     integer NOT NULL,                 -- content release the client was on
  lesson_id      integer,
  challenge_id   integer,
  engine_version text NOT NULL,                    -- MASTERY_CONFIG.version on the client
  payload        jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(payload) <= 16384),
  received_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (occurred_at = uuid_extract_timestamp(event_id)),
  -- One index serves: idempotent insert (ON CONFLICT), per-user history, per-user replay.
  PRIMARY KEY (user_id, occurred_at, event_id)
) PARTITION BY RANGE (occurred_at);

-- Partitions: created 3 months ahead by pg_partman (or a cron job). Storage
-- parameters must be set per leaf partition (not allowed on the parent).
-- Insert-only tables: trigger vacuum (visibility map → index-only scans) early.
CREATE TABLE learning.learning_events_2027_01 PARTITION OF learning.learning_events
  FOR VALUES FROM ('2027-01-01') TO ('2027-02-01')
  WITH (autovacuum_vacuum_insert_scale_factor = 0.05);
CREATE TABLE learning.learning_events_2027_02 PARTITION OF learning.learning_events
  FOR VALUES FROM ('2027-02-01') TO ('2027-03-01')
  WITH (autovacuum_vacuum_insert_scale_factor = 0.05);
-- Safety net for offline clients replaying very old events; monitored, should stay ~empty.
CREATE TABLE learning.learning_events_default PARTITION OF learning.learning_events DEFAULT;

-- Analytics-free OLTP: no index on payload. Product questions go to the
-- Parquet/ClickHouse export, not this table.

-- =============================================================================
-- LEARNING — projections (rebuildable from learning_events)
-- =============================================================================
-- Evidence: one event → N rows (one per concept). Hash-partitioned by user so
-- "explain my mastery for concept X" touches exactly one partition.
CREATE TABLE learning.evidence (
  user_id        uuid NOT NULL,
  concept_id     integer NOT NULL,
  occurred_at    timestamptz NOT NULL,
  event_id       uuid NOT NULL,
  signal         learning.evidence_signal NOT NULL,
  source         learning.evidence_source NOT NULL,
  difficulty     smallint NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  weight         real NOT NULL CHECK (weight BETWEEN 0 AND 1),
  hints_used     smallint NOT NULL DEFAULT 0,
  time_spent_s   integer NOT NULL DEFAULT 0 CHECK (time_spent_s >= 0),
  is_correct     boolean NOT NULL,
  verification   learning.verification NOT NULL DEFAULT 'self_reported',
  -- Unique because (event_id, concept_id) is unique and occurred_at is a
  -- function of event_id. Ordered for "evidence of user U for concept C by time".
  PRIMARY KEY (user_id, concept_id, occurred_at, event_id)
) PARTITION BY HASH (user_id);

CREATE TABLE learning.evidence_p00 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 0);
CREATE TABLE learning.evidence_p01 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 1);
CREATE TABLE learning.evidence_p02 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 2);
CREATE TABLE learning.evidence_p03 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 3);
CREATE TABLE learning.evidence_p04 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 4);
CREATE TABLE learning.evidence_p05 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 5);
CREATE TABLE learning.evidence_p06 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 6);
CREATE TABLE learning.evidence_p07 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 7);
CREATE TABLE learning.evidence_p08 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 8);
CREATE TABLE learning.evidence_p09 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 9);
CREATE TABLE learning.evidence_p10 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 10);
CREATE TABLE learning.evidence_p11 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 11);
CREATE TABLE learning.evidence_p12 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 12);
CREATE TABLE learning.evidence_p13 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 13);
CREATE TABLE learning.evidence_p14 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 14);
CREATE TABLE learning.evidence_p15 PARTITION OF learning.evidence FOR VALUES WITH (MODULUS 16, REMAINDER 15);

-- Mastery read model: one row per (learner, concept). Updated in place on every
-- ingest → fillfactor leaves room for HOT updates (no index churn).
-- rev columns below have no default: the writer takes them from learning.sync_state.
CREATE TABLE learning.concept_mastery (
  user_id          uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  concept_id       integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE RESTRICT,
  score            real NOT NULL CHECK (score BETWEEN 0 AND 1),
  level            learning.mastery_level NOT NULL,
  practice_accuracy    real NOT NULL DEFAULT 0,
  challenge_completion real NOT NULL DEFAULT 0,
  hints_efficiency     real NOT NULL DEFAULT 1,
  speed_efficiency     real NOT NULL DEFAULT 1,
  consistency_bonus    real NOT NULL DEFAULT 0,
  evidence_count   integer NOT NULL DEFAULT 0,
  correct_count    integer NOT NULL DEFAULT 0,
  incorrect_count  integer NOT NULL DEFAULT 0,
  hints_total      integer NOT NULL DEFAULT 0,
  current_streak   smallint NOT NULL DEFAULT 0,
  verified_score   real CHECK (verified_score BETWEEN 0 AND 1),   -- server_verified evidence only
  first_seen_at    timestamptz NOT NULL,
  last_activity_at timestamptz NOT NULL,
  engine_version   text NOT NULL,                  -- rebuild job targets rows with an old version
  rev              bigint NOT NULL,
  updated_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, concept_id)                -- dashboard, skill map, tutor context
) WITH (fillfactor = 80, autovacuum_vacuum_scale_factor = 0.02);
CREATE INDEX concept_mastery_sync_idx ON learning.concept_mastery (user_id, rev);
-- Rebuild job after a MASTERY_CONFIG change.
CREATE INDEX concept_mastery_engine_idx ON learning.concept_mastery (engine_version);
-- Decay sweeper: learners idle for a while who still hold a non-trivial score.
CREATE INDEX concept_mastery_decay_idx ON learning.concept_mastery (last_activity_at)
  WHERE level IN ('proficient', 'mastered', 'expert');

CREATE TABLE learning.lesson_progress (
  user_id            uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  lesson_id          integer NOT NULL REFERENCES catalog.lessons (id) ON DELETE RESTRICT,
  status             learning.lesson_status NOT NULL DEFAULT 'in_progress',
  completed_sections text[] NOT NULL DEFAULT '{}', -- section keys; small (≤ 16)
  current_section    text,
  progress_pct       smallint NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  started_at         timestamptz NOT NULL,
  completed_at       timestamptz,
  last_visited_at    timestamptz NOT NULL,
  rev                bigint NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
) WITH (fillfactor = 85);
CREATE INDEX lesson_progress_sync_idx ON learning.lesson_progress (user_id, rev);
-- "Continue learning" card: latest in-progress lesson.
CREATE INDEX lesson_progress_resume_idx ON learning.lesson_progress (user_id, last_visited_at DESC)
  WHERE status = 'in_progress';

CREATE TABLE learning.bookmarks (
  user_id    uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  lesson_id  integer NOT NULL REFERENCES catalog.lessons (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  removed_at timestamptz,                          -- tombstone so other devices sync the removal
  rev        bigint NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
);
CREATE INDEX bookmarks_sync_idx ON learning.bookmarks (user_id, rev);

-- Challenge attempts: large rows (code + evaluation) → monthly range partitions
-- for retention (code kept 12 months, then archived).
-- attempt_id = event_id of the challenge.submitted event (API-SPEC §6.3).
CREATE TABLE learning.challenge_attempts (
  user_id        uuid NOT NULL,
  submitted_at   timestamptz NOT NULL,
  attempt_id     uuid NOT NULL,                    -- client UUIDv7, idempotent
  challenge_id   integer NOT NULL,
  attempt_no     smallint NOT NULL CHECK (attempt_no > 0),  -- per-device ordinal, display only: two
                                                   -- offline devices can both send 3. Never a key.
  status         learning.attempt_status NOT NULL,
  verification   learning.verification NOT NULL DEFAULT 'self_reported',
  score_pct      smallint NOT NULL CHECK (score_pct BETWEEN 0 AND 100),
  tests_passed   smallint NOT NULL,
  tests_total    smallint NOT NULL,
  hints_used     smallint NOT NULL DEFAULT 0,
  time_spent_s   integer NOT NULL DEFAULT 0,
  code           text NOT NULL CHECK (octet_length(code) <= 65536),
  evaluation     jsonb NOT NULL,                   -- ChallengeEvaluation (per-test results)
  started_at     timestamptz NOT NULL,
  CHECK (submitted_at = uuid_extract_timestamp(attempt_id)),
  CHECK (tests_passed BETWEEN 0 AND tests_total),
  PRIMARY KEY (user_id, submitted_at, attempt_id)
) PARTITION BY RANGE (submitted_at);
-- "My attempts on this challenge, newest first".
CREATE INDEX challenge_attempts_user_challenge_idx
  ON learning.challenge_attempts (user_id, challenge_id, submitted_at DESC);
-- Verification worker queue (Stage 3): only unverified passes need re-running.
CREATE INDEX challenge_attempts_to_verify_idx ON learning.challenge_attempts (submitted_at)
  WHERE verification = 'self_reported' AND status = 'passed';

CREATE TABLE learning.challenge_attempts_2027_01 PARTITION OF learning.challenge_attempts
  FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
CREATE TABLE learning.challenge_attempts_default PARTITION OF learning.challenge_attempts DEFAULT;

-- Per-challenge summary so pages never scan attempts.
CREATE TABLE learning.challenge_progress (
  user_id         uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  challenge_id    integer NOT NULL REFERENCES catalog.challenges (id) ON DELETE RESTRICT,
  best_status     learning.attempt_status NOT NULL,
  best_score_pct  smallint NOT NULL,
  attempts_count  smallint NOT NULL,               -- authoritative count across devices
  first_passed_at timestamptz,
  last_attempt_at timestamptz NOT NULL,
  rev             bigint NOT NULL,
  PRIMARY KEY (user_id, challenge_id)
) WITH (fillfactor = 85);
CREATE INDEX challenge_progress_sync_idx ON learning.challenge_progress (user_id, rev);

CREATE TABLE learning.code_drafts (
  user_id      uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  challenge_id integer NOT NULL REFERENCES catalog.challenges (id) ON DELETE CASCADE,
  code         text NOT NULL CHECK (octet_length(code) <= 65536),
  client_updated_at timestamptz NOT NULL,          -- last-write-wins key
  rev          bigint NOT NULL,
  PRIMARY KEY (user_id, challenge_id)
) WITH (fillfactor = 70);
CREATE INDEX code_drafts_sync_idx ON learning.code_drafts (user_id, rev);

CREATE TABLE learning.review_items (
  user_id     uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  id          uuid NOT NULL DEFAULT uuidv7(),
  concept_id  integer NOT NULL REFERENCES catalog.concepts (id) ON DELETE CASCADE,
  reason      learning.review_reason NOT NULL,
  priority    learning.review_priority NOT NULL,
  status      learning.review_status NOT NULL DEFAULT 'pending',
  interval_step smallint NOT NULL DEFAULT 0,       -- index into spacedIntervalsDays
  due_at      timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  rev         bigint NOT NULL,
  PRIMARY KEY (user_id, id)                        -- shard-safe: leads with user_id
);
-- At most one open review per concept per learner.
CREATE UNIQUE INDEX review_items_open_uq ON learning.review_items (user_id, concept_id)
  WHERE status = 'pending';
-- "Today's review queue", ordered by due date.
CREATE INDEX review_items_due_idx ON learning.review_items (user_id, due_at)
  WHERE status = 'pending';
-- Reminder scheduler: "which learners have reviews coming due?" (across users, per shard).
CREATE INDEX review_items_due_global_idx ON learning.review_items (due_at)
  WHERE status = 'pending';
CREATE INDEX review_items_sync_idx ON learning.review_items (user_id, rev);

-- Daily activity: streaks, goal progress, activity calendar. Day is in the
-- learner's time zone (identity.users.time_zone) at the moment of the event.
CREATE TABLE learning.daily_activity (
  user_id            uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  day                date NOT NULL,
  active_seconds     integer NOT NULL DEFAULT 0 CHECK (active_seconds BETWEEN 0 AND 86400),
  events             integer NOT NULL DEFAULT 0,
  sections_completed smallint NOT NULL DEFAULT 0,
  reviews_completed  smallint NOT NULL DEFAULT 0,
  goal_met           boolean NOT NULL DEFAULT false,
  rev                bigint NOT NULL,
  PRIMARY KEY (user_id, day)                       -- calendar range, streak walk-back
) WITH (fillfactor = 85);
CREATE INDEX daily_activity_sync_idx ON learning.daily_activity (user_id, rev);

-- =============================================================================
-- TUTOR (Stage 2)
-- =============================================================================
CREATE TABLE tutor.threads (
  user_id      uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  id           uuid NOT NULL DEFAULT uuidv7(),
  lesson_id    integer REFERENCES catalog.lessons (id) ON DELETE SET NULL,
  challenge_id integer REFERENCES catalog.challenges (id) ON DELETE SET NULL,
  locale       identity.locale NOT NULL,
  hint_tier    smallint NOT NULL DEFAULT 0 CHECK (hint_tier BETWEEN 0 AND 4),
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
CREATE INDEX threads_user_recent_idx ON tutor.threads (user_id, last_message_at DESC);
-- Reopen the thread for the challenge the learner is on.
CREATE INDEX threads_user_challenge_idx ON tutor.threads (user_id, challenge_id)
  WHERE challenge_id IS NOT NULL;

CREATE TABLE tutor.messages (
  user_id       uuid NOT NULL,
  thread_id     uuid NOT NULL,
  created_at    timestamptz NOT NULL,
  id            uuid NOT NULL,
  role          tutor.message_role NOT NULL,
  hint_tier     smallint CHECK (hint_tier BETWEEN 1 AND 4),
  content       text NOT NULL CHECK (char_length(content) <= 16000),
  model         text,
  input_tokens  integer,
  output_tokens integer,
  cost_micros   bigint,                            -- USD × 1e6
  latency_ms    integer,
  helpful       boolean,                           -- learner feedback (API-SPEC §4.7)
  PRIMARY KEY (user_id, thread_id, created_at, id) -- load a thread in order; shard-safe
) PARTITION BY RANGE (created_at);
CREATE TABLE tutor.messages_2027_01 PARTITION OF tutor.messages
  FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
CREATE TABLE tutor.messages_default PARTITION OF tutor.messages DEFAULT;

-- Durable usage ledger (Redis holds the live counters; this is for billing/limits audit).
CREATE TABLE tutor.usage_daily (
  user_id       uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  day           date NOT NULL,
  requests      integer NOT NULL DEFAULT 0,
  input_tokens  bigint NOT NULL DEFAULT 0,
  output_tokens bigint NOT NULL DEFAULT 0,
  cost_micros   bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
-- Global spend dashboard / circuit breaker.
CREATE INDEX usage_daily_day_idx ON tutor.usage_daily (day);

-- =============================================================================
-- ORG — organizations and cohorts (Stage 2). Keyed by org/cohort, not sharded
-- with learners: instructors read the summary projection, never learner tables.
-- =============================================================================
CREATE TABLE org.organizations (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  slug       citext NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 3 AND 48),
  name       text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE org.members (
  org_id     uuid NOT NULL REFERENCES org.organizations (id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  role       org.org_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)                    -- staff list
);
CREATE INDEX org_members_user_idx ON org.members (user_id);   -- "my organizations"

CREATE TABLE org.cohorts (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  org_id     uuid NOT NULL REFERENCES org.organizations (id) ON DELETE CASCADE,
  name       text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  track_id   smallint NOT NULL REFERENCES catalog.tracks (id),
  starts_on  date NOT NULL,
  ends_on    date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on IS NULL OR ends_on >= starts_on)
);
CREATE INDEX cohorts_org_idx ON org.cohorts (org_id, starts_on DESC);

CREATE TABLE org.cohort_invites (
  code       text PRIMARY KEY CHECK (char_length(code) BETWEEN 8 AND 32),  -- random, URL-safe
  cohort_id  uuid NOT NULL REFERENCES org.cohorts (id) ON DELETE CASCADE,
  max_uses   integer NOT NULL CHECK (max_uses > 0),
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_by uuid REFERENCES identity.users (id) ON DELETE SET NULL,  -- must not block account deletion
  CHECK (used_count <= max_uses)                   -- accept = UPDATE … SET used_count = used_count + 1
);

-- Learners in a cohort + their summary read model, maintained by kodara-worker
-- from the outbox (learning.ingested). Exists only while cohort_sharing is granted.
CREATE TABLE org.cohort_members (
  cohort_id          uuid NOT NULL REFERENCES org.cohorts (id) ON DELETE CASCADE,
  user_id            uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  joined_at          timestamptz NOT NULL DEFAULT now(),
  lessons_completed  smallint NOT NULL DEFAULT 0,
  loops_completed    smallint NOT NULL DEFAULT 0,  -- full Story → Engine → Play loops
  avg_mastery        real NOT NULL DEFAULT 0 CHECK (avg_mastery BETWEEN 0 AND 1),
  weakest_concept_ids integer[] NOT NULL DEFAULT '{}',  -- ≤ 5
  last_active_at     timestamptz,
  summary_updated_at timestamptz,
  PRIMARY KEY (cohort_id, user_id)                 -- instructor roster, paginated
);
CREATE INDEX cohort_members_user_idx ON org.cohort_members (user_id);  -- fan-out on ingest, leave cohort

-- =============================================================================
-- BILLING (Stage 2+). Content stays free; plans raise expensive limits.
-- =============================================================================
CREATE TABLE billing.plans (
  id          smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         text NOT NULL UNIQUE,                -- "free", "plus-monthly", "campus-seat"
  limits      jsonb NOT NULL,                      -- { "tutor_messages_per_hour": 120, ... }
  prices      jsonb NOT NULL,                      -- { "BDT": 29900, "USD": 499 } minor units
  is_public   boolean NOT NULL DEFAULT true,
  retired_at  timestamptz
);

CREATE TABLE billing.subscriptions (
  id                 uuid PRIMARY KEY DEFAULT uuidv7(),
  user_id            uuid REFERENCES identity.users (id) ON DELETE CASCADE,
  org_id             uuid REFERENCES org.organizations (id) ON DELETE CASCADE,
  plan_id            smallint NOT NULL REFERENCES billing.plans (id),
  status             billing.subscription_status NOT NULL,
  provider           text NOT NULL CHECK (provider IN ('bkash', 'sslcommerz', 'stripe', 'manual')),
  provider_ref       text,                         -- provider's subscription/agreement id
  seats              integer NOT NULL DEFAULT 1 CHECK (seats > 0),
  current_period_end timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK ((user_id IS NULL) <> (org_id IS NULL))    -- owned by exactly one of user / org
);
CREATE INDEX subscriptions_user_idx ON billing.subscriptions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX subscriptions_org_idx  ON billing.subscriptions (org_id)  WHERE org_id IS NOT NULL;
-- Expiry sweeper.
CREATE INDEX subscriptions_period_end_idx ON billing.subscriptions (current_period_end)
  WHERE status IN ('active', 'past_due');

-- Effective entitlements per learner: a projection of plans, subscriptions,
-- org seats and grants. Read on every tutor/execution request (cached in Redis).
CREATE TABLE billing.entitlements (
  user_id     uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  feature     text NOT NULL,
  source      billing.entitlement_source NOT NULL,
  limit_value integer NOT NULL,                    -- -1 = unlimited
  source_id   uuid,                                -- subscription id, when applicable
  expires_at  timestamptz,
  PRIMARY KEY (user_id, feature, source)           -- effective limit = max over sources
);

-- Payment provider webhooks: stored raw before processing, so a provider retry
-- is a no-op and processing is replayable.
CREATE TABLE billing.payment_events (
  provider          text NOT NULL,
  provider_event_id text NOT NULL,
  received_at       timestamptz NOT NULL DEFAULT now(),
  type              text NOT NULL,
  payload           jsonb NOT NULL,
  processed_at      timestamptz,
  PRIMARY KEY (provider, provider_event_id)
);
CREATE INDEX payment_events_unprocessed_idx ON billing.payment_events (received_at)
  WHERE processed_at IS NULL;

-- =============================================================================
-- NOTIFY — review and streak reminders (Stage 1 email, Stage 2 web push)
-- =============================================================================
CREATE TABLE notify.preferences (
  user_id          uuid PRIMARY KEY REFERENCES identity.users (id) ON DELETE CASCADE,
  review_reminders notify.reminder_mode NOT NULL DEFAULT 'smart',
  streak_reminders boolean NOT NULL DEFAULT true,
  email_enabled    boolean NOT NULL DEFAULT false, -- opt-in (needs email_reminders consent)
  push_enabled     boolean NOT NULL DEFAULT false,
  quiet_start      time NOT NULL DEFAULT '22:00',  -- learner's local time
  quiet_end        time NOT NULL DEFAULT '08:00',
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notify.push_subscriptions (
  user_id       uuid NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
  id            uuid NOT NULL DEFAULT uuidv7(),
  endpoint      text NOT NULL CHECK (char_length(endpoint) <= 1024),
  endpoint_sha256 bytea NOT NULL,                  -- idempotent subscribe
  p256dh        text NOT NULL,
  auth_secret   text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_success_at timestamptz,
  failure_count smallint NOT NULL DEFAULT 0,       -- drop after repeated 404/410 from the push service
  PRIMARY KEY (user_id, id)
);
CREATE UNIQUE INDEX push_subscriptions_endpoint_uq ON notify.push_subscriptions (user_id, endpoint_sha256);

-- Sent log: frequency caps ("max 1 reminder per day") and delivery audit.
CREATE TABLE notify.deliveries (
  user_id    uuid NOT NULL,
  sent_at    timestamptz NOT NULL,
  id         uuid NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('review_due', 'streak_at_risk', 'cohort_invite', 'account')),
  channel    notify.channel NOT NULL,
  status     text NOT NULL CHECK (status IN ('sent', 'failed', 'suppressed')),
  PRIMARY KEY (user_id, sent_at, id)               -- "what did we send this learner today?"
) PARTITION BY RANGE (sent_at);
CREATE TABLE notify.deliveries_2027_01 PARTITION OF notify.deliveries
  FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
CREATE TABLE notify.deliveries_default PARTITION OF notify.deliveries DEFAULT;

-- =============================================================================
-- OPS
-- =============================================================================
-- Transactional outbox: written in the same txn as the business change,
-- published by kodara-worker (analytics export, emails, cache invalidation).
CREATE TABLE ops.outbox_events (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic        text NOT NULL,
  key          text NOT NULL,                      -- usually user_id; consumers keep per-key order
  payload      jsonb NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
-- Tiny hot index: only the unpublished backlog.
CREATE INDEX outbox_unpublished_idx ON ops.outbox_events (id) WHERE published_at IS NULL;

-- Idempotency for non-event POSTs (API-SPEC §2.4). Rows older than 24 h are deleted.
CREATE TABLE ops.idempotency_keys (
  user_id         uuid NOT NULL,
  key             uuid NOT NULL,
  request_sha256  bytea NOT NULL,
  status_code     smallint,                        -- null while the request is in flight
  response_body   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
CREATE INDEX idempotency_keys_created_idx ON ops.idempotency_keys (created_at);   -- TTL sweeper

-- Feature flags and experiments. Evaluated in-process (cached), assignment is
-- hash(flag key + user id) mod 100, so there is no assignment table.
CREATE TABLE ops.feature_flags (
  key         text PRIMARY KEY,
  description text NOT NULL,
  rules       jsonb NOT NULL,                      -- { "default": false, "rollout": 10, "roles": ["author"] }
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES identity.users (id) ON DELETE SET NULL
);

-- Audit log for privileged actions: admin reads of learner data, flag changes,
-- release activation, account deletion, role changes. Retained 24 months.
CREATE TABLE ops.audit_log (
  at          timestamptz NOT NULL DEFAULT now(),
  id          uuid NOT NULL DEFAULT uuidv7(),
  actor_id    uuid,                                -- null for system jobs
  action      text NOT NULL,                       -- "admin.user.read", "flag.update", ...
  target_type text NOT NULL,
  target_id   text NOT NULL,
  request_id  uuid,
  details     jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (at, id)
) PARTITION BY RANGE (at);
CREATE INDEX audit_log_target_idx ON ops.audit_log (target_type, target_id, at DESC);  -- "who touched user X?"
CREATE INDEX audit_log_actor_idx  ON ops.audit_log (actor_id, at DESC);                -- "what did admin Y do?"
CREATE TABLE ops.audit_log_2027_01 PARTITION OF ops.audit_log
  FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
CREATE TABLE ops.audit_log_default PARTITION OF ops.audit_log DEFAULT;

-- Server execution jobs (Stage 3; JS never comes here). Trace bodies live in R2.
CREATE TABLE ops.execution_jobs (
  user_id      uuid NOT NULL,
  created_at   timestamptz NOT NULL,
  id           uuid NOT NULL,
  language     catalog.code_language NOT NULL,
  source_sha256 bytea NOT NULL,
  status       text NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'timeout', 'killed')),
  exit_code    smallint,
  duration_ms  integer,
  trace_object_key text,                           -- content-addressed R2 key
  finished_at  timestamptz,
  PRIMARY KEY (user_id, created_at, id)            -- "my runs, newest first"; shard-safe
) PARTITION BY RANGE (created_at);
CREATE TABLE ops.execution_jobs_default PARTITION OF ops.execution_jobs DEFAULT;

-- =============================================================================
-- ROLES (least privilege; passwords set by the platform, not here)
-- =============================================================================
-- CREATE ROLE kodara_api;      -- DML on identity/learning/tutor/org/notify, SELECT on billing,
--                              -- INSERT on ops.outbox_events, ops.audit_log, ops.idempotency_keys
-- CREATE ROLE kodara_worker;   -- api rights + billing DML, ops.*, partition maintenance
-- CREATE ROLE kodara_readonly; -- SELECT for support tooling on a replica
