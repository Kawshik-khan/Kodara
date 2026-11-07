# KODARA API SPECIFICATION v1 (TARGET)

Status: **Proposed**. See [ADR-007](DECISIONS/007-backend-target-architecture.md) (revision 2026-10-29). Created: 2026-10-29.
Companions: [BACKEND-ARCHITECTURE.md](BACKEND-ARCHITECTURE.md) (system), [DATABASE-DESIGN.md](DATABASE-DESIGN.md) (tables and indexes), [DATABASE-SCHEMA.sql](DATABASE-SCHEMA.sql) (DDL).

> **বাংলায় এক লাইনে:** ব্রাউজার শুধু জানায় শিক্ষার্থী *কী করেছে* (ইভেন্ট)। কোন concept, কত কঠিন, mastery কত, সেটা সার্ভার নিজের catalog আর engine দিয়ে হিসাব করে। একই ইভেন্ট দশবার পাঠালেও ডেটা একবারই জমা হয়।

> **Gate:** ADR-005 still applies. Nothing here is built before the PLAN 001 M6 pilot passes. The **Stage** column says when each endpoint appears (BACKEND-ARCHITECTURE §8).

---

## 1. Design principles

| # | Principle | What it means in practice |
|---|---|---|
| P1 | **The client reports facts. The server derives meaning.** | An event says "answered question `q.closure.3` correctly in 41 s". The server looks up concepts, difficulty and weight in the release manifest. Concept ids, weights and mastery numbers from the client are never trusted. |
| P2 | **Every write is idempotent.** | Events and attempts carry a client UUIDv7. Other POSTs take an `Idempotency-Key`. A retry on a flaky mobile network is always safe. |
| P3 | **The API is never on the lesson's critical path.** | The SPA teaches from the CDN and IndexedDB. The API makes data durable and multi-device. Every endpoint can fail without blocking a lesson. |
| P4 | **Language-neutral payloads (ADR-004).** | The API returns codes (`QUOTA_EXCEEDED`, `mastery_decay`), never sentences. The SPA renders `bn`/`en` text. The only exceptions are tutor output and emails, which use the learner's `locale`. |
| P5 | **Public keys, private ids.** | The API exposes content **keys** (`concept.closure`) and learner UUIDs. Integer catalog ids stay inside the database. |
| P6 | **Additive within a version.** | Inside `/v1`, fields and endpoints are only added. Event payloads carry `schemaVersion`, and the server keeps upcasters so stale offline clients still sync. |

---

## 2. Conventions

### 2.1 Transport
- Base URL: `https://api.kodara.<tld>/v1`. HTTPS only, with HSTS. HTTP/2 or HTTP/3 through the edge.
- Bodies are `application/json; charset=utf-8` with **camelCase** fields.
- Request compression: `Content-Encoding: gzip` (or `br`) is accepted on `POST /events:batch` and `POST /telemetry:batch`. Responses are compressed when the client accepts it.
- Timestamps are RFC 3339 UTC with milliseconds (`2027-01-15T08:30:12.345Z`). Calendar days (`2027-01-15`) are in the learner's `timeZone`.
- Ids: learner-side ids are UUIDv7 strings. Content keys match `^[a-z0-9]+([.-][a-z0-9]+)*$`, at most 96 characters.

### 2.2 Authentication
| Client | Mechanism |
|---|---|
| SPA | Opaque session token in cookie `kodara_sid`: `HttpOnly; Secure; SameSite=Lax; Path=/`, host-only on `api.kodara.<tld>`. Idle timeout 30 days, absolute timeout 90 days, rolled on use. |
| Future native app | The same opaque token in `Authorization: Bearer <token>`. There are no JWTs: revocation must be instant, and the session lookup is cached for 60 s anyway. |
| CI / content pipeline | Service token in `Authorization: Bearer`, scoped to `/admin/content-releases*`, rotated every 90 days. |

The server stores only `sha256(token)` (`identity.sessions.token_hash`).

**CSRF:** every state-changing request (`POST/PUT/PATCH/DELETE`) must pass both checks:
1. `Origin` is in the allowlist (`https://kodara.<tld>`, preview hosts in staging).
2. The custom header `X-Kodara-Client: web/<appVersion>` is present. A cross-site form can't set it, and CORS preflight blocks other origins.

Failing either returns `403 CSRF_REJECTED`. CORS allows credentials for the allowlisted origins only.

### 2.3 Standard headers
| Header | Direction | Use |
|---|---|---|
| `X-Request-Id` | both | Client may send a UUID. The server echoes it or generates one. It is logged and propagated to the worker. |
| `X-Kodara-Client` | request | `web/<semver>`. Also used to answer `426 CLIENT_TOO_OLD`. |
| `X-Kodara-Device` | request | Device UUID from IndexedDB, registered with `POST /me/devices`. |
| `Idempotency-Key` | request | Required on non-event POSTs marked **I** below. UUID, kept 24 h per user. |
| `ETag` / `If-None-Match` | both | On `GET /me/*` read models. `304` saves bandwidth on mobile. |
| `RateLimit-Policy`, `RateLimit`, `Retry-After` | response | IETF RateLimit header fields. `Retry-After` is sent on `429` and `503`. |

### 2.4 Idempotency (non-event writes)
- The key is stored in `ops.idempotency_keys (user_id, key)` with `sha256(method + path + body)` and the response.
- Same key and same body: the stored response is replayed with `Idempotent-Replayed: true`.
- Same key and a different body: `422 IDEMPOTENCY_KEY_REUSED`.
- A key still in flight: `409 REQUEST_IN_PROGRESS`, client retries after 1 s.
- Events (`/events:batch`) don't need the header. Each event's `eventId` is its idempotency key.

### 2.5 Pagination
Cursor-based only. There is no `offset`.
- Request: `?limit=50&cursor=<opaque>`. The default `limit` is 50, the maximum 200 (500 for `/sync`).
- Response: `{ "items": [...], "nextCursor": "…" | null }`.
- A cursor is base64url JSON `{ k: <last sort key>, v: 1 }`, signed with HMAC so clients can't forge one. It is valid for 24 h, except `/sync` cursors (§5), which don't expire.

### 2.6 Errors
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "events[3].payload.timeSpentS must be >= 0",
    "requestId": "0192b0c1-…",
    "details": [{ "path": "events[3].payload.timeSpentS", "issue": "too_small" }]
  }
}
```
`message` is English, for developers and logs only. The SPA maps `code` to bilingual text.

| HTTP | `code` | When | Client action |
|---|---|---|---|
| 400 | `VALIDATION_FAILED` | Schema violation | Don't retry. Report to Sentry. |
| 401 | `UNAUTHENTICATED` | No or expired session | Re-authenticate, or keep working offline. |
| 403 | `FORBIDDEN` | Authenticated, not allowed (role, cohort, entitlement) | Don't retry. |
| 403 | `CSRF_REJECTED` | Origin or `X-Kodara-Client` check failed | Bug: report. |
| 404 | `NOT_FOUND` | Unknown resource, or one owned by another user (never reveal which) | Don't retry. |
| 409 | `CONFLICT` | State conflict, e.g. the email already belongs to another account | Show a choice to the learner. |
| 409 | `REQUEST_IN_PROGRESS` | Same `Idempotency-Key` is still running | Retry after 1 s. |
| 409 | `RELEASE_UNKNOWN` | `releaseVersion` was never published | Refresh the manifest. |
| 413 | `PAYLOAD_TOO_LARGE` | Over the limits in §3 | Split the batch. |
| 422 | `IDEMPOTENCY_KEY_REUSED` | Same key, different body | Bug: report. |
| 426 | `CLIENT_TOO_OLD` | `schemaVersion` or app version below the supported floor | Prompt for reload. **Keep the outbox.** |
| 429 | `RATE_LIMITED` | Rate limit hit | Back off using `Retry-After`. |
| 429 | `QUOTA_EXCEEDED` | Tutor quota or token budget used up | Show the authored hints instead. |
| 500 | `INTERNAL` | Bug | Retry with backoff. |
| 503 | `UNAVAILABLE` | Maintenance, degraded dependency, spend circuit breaker open | Retry after `Retry-After`. |

### 2.7 Rate limits
Redis sliding windows, keyed by user (or by IP for unauthenticated calls). These are defaults. Entitlements (§4.10) can raise them.

| Scope | Limit |
|---|---|
| `POST /auth/otp/start` | 5 per 15 min per email/phone; 20 per hour per IP |
| `POST /auth/otp/verify` | 5 wrong codes, then the code is burned |
| `POST /auth/anonymous` | 10 per hour per IP, plus a Cloudflare Turnstile token |
| `POST /events:batch` | 600 events per minute per user (≈ 10× normal peak) |
| `POST /telemetry:batch` | 1,200 records per minute per user; excess is dropped silently with `202` |
| `GET /sync` | 60 per minute per user |
| `PUT /me/drafts/*` | 60 per minute per user (the client debounces at 3 s) |
| Tutor messages | free 20 per hour; active 120 per hour (AI-TUTOR-SPEC §4); plus a daily token budget |
| Everything else | 300 per minute per user, 600 per minute per IP |

---

## 3. Payload limits

| Item | Limit |
|---|---|
| Request body (compressed) | 256 KB (1 MB decompressed). Gzip bombs are rejected by a decompressed-size cap. |
| Events per batch | 100 |
| One event `payload` | 16 KB, except `challenge.submitted`: `code` ≤ 64 KB, stored in `challenge_attempts`, not in the event |
| `occurredAt` (from the UUIDv7) | not more than 5 min in the future; up to 400 days in the past |
| Tutor message | 4,000 characters; attached code ≤ 16 KB; trace summary ≤ 8 KB |
| Draft | 64 KB |

---

## 4. Endpoints

**Legend.** Auth: `—` none · `A` any session, anonymous included · `R` registered account · `S` service token · `Admin` role `admin`. **I** = `Idempotency-Key` required.

### 4.1 Identity and account (`identity` module)

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /auth/anonymous` | — | 1 | Create an anonymous learner for this device (§6.1). Body `{ deviceId, turnstileToken, locale, timeZone }` → `201 { user }` and sets the cookie. |
| `POST /auth/otp/start` | — | 1 | Body `{ channel: "email" \| "sms", address }` → `202` (always, so it can't be used to discover accounts). |
| `POST /auth/otp/verify` | — or A | 1 | Body `{ channel, address, code }` → `200 { user, linked: boolean }`. With an anonymous session, links the identity to that user (§6.1). |
| `GET /auth/oauth/google/start` | — or A | 1 | `302` to Google with PKCE + `state` (and the anonymous user to link, if any). |
| `GET /auth/oauth/google/callback` | — | 1 | `302` back to the SPA. Sets the cookie. |
| `POST /auth/logout` | A | 1 | Revokes the current session. `204`. |
| `POST /auth/logout-all` | R | 1 | Revokes every session of the user. `204`. |
| `GET /me` | A | 1 | Profile, flags and active content release (below). |
| `PATCH /me` | A | 1 | `{ displayName?, locale?, timeZone?, dailyGoalMinutes? }` → `200 Me`. |
| `GET /me/sessions` | R | 1 | Active sessions (device, platform, last seen). |
| `DELETE /me/sessions/{sessionId}` | R | 1 | Revoke one session. |
| `POST /me/devices` | A | 1 | Upsert `{ deviceId, platform }`. Idempotent by `deviceId`. |
| `PUT /me/consents/{purpose}` | A | 1 | `{ granted, policyVersion }`. Purposes: `product_analytics`, `email_reminders`, `cohort_sharing`. Append-only history. |
| `POST /me/export` | R, **I** | 1 | Starts a data export job → `202 { jobId }`. |
| `GET /me/export/{jobId}` | R | 1 | `{ status, downloadUrl?, expiresAt? }`. The URL is a signed R2 link, valid 24 h. |
| `DELETE /me` | R, **I** | 1 | Soft delete. All sessions revoked. Purge after 30 days (DATABASE-DESIGN §7). `202`. |

```ts
interface Me {
  id: string;                       // UUIDv7
  kind: "anonymous" | "registered";
  displayName: string;
  email: string | null;             // null for anonymous and phone-only accounts
  locale: "bn" | "en";
  timeZone: string;                 // IANA, default "Asia/Dhaka"
  dailyGoalMinutes: number;         // 0 = no goal
  roles: ("learner" | "author" | "admin")[];
  entitlements: Entitlement[];      // §4.10
  activeRelease: { version: string; manifestUrl: string };
  minClientVersion: string;         // below this, the SPA asks for a reload
  flags: Record<string, boolean | string>;   // evaluated feature flags (§4.12)
}
```

### 4.2 Catalog (`catalog` module)

Content is served by the CDN, not the API (BACKEND-ARCHITECTURE §3.2). The API only says which release is active.

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /catalog/releases/active` | — | 1 | `{ version, manifestUrl, publishedAt }`. CDN-cached for 60 s. |
| `POST /admin/content-releases` | S | 1 | CI uploads `{ version, manifestSha256 }` after it has pushed the files to R2. The server fetches the manifest, verifies the hash, and upserts `catalog.*` by key. Ids are never renumbered. |
| `POST /admin/content-releases/{version}:activate` | Admin, **I** | 1 | Switches the active release. API instances reload the in-memory catalog through an outbox event. |

The **manifest** (`/content/{release}/manifest.json`) is what lets the server apply P1. It maps every lesson, section, question, prediction, challenge and break-it scenario key to `{ conceptKeys[], cognitiveDifficulty, weight }`. The API keeps the manifests of the last 6 releases in memory, because offline clients can still send events tagged with an older release.

### 4.3 Learning ingest (`learning` + `mastery` modules)

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /events:batch` | A | 1 | **Main write path.** Up to 100 learning events (§7). |
| `POST /telemetry:batch` | — or A | 1 | UI telemetry (§8). Fire-and-forget, never touches Postgres. |

```ts
// POST /v1/events:batch
interface EventBatchRequest {
  events: LearningEvent[];          // 1..100, any order; the server sorts by eventId (time)
}

interface EventBatchResponse {
  results: {
    eventId: string;
    status: "accepted" | "duplicate" | "rejected";
    error?: { code: string; message: string };   // only when rejected
  }[];
  // Authoritative projections touched by this batch. The client replaces its
  // optimistic state with these, then advances its sync cursor to `cursor`.
  changes: SyncChanges;             // §5
  cursor: string;
}
```

Semantics:
- `200` when every event was processed, even if some are `duplicate` or `rejected`. A rejected event is permanent: the client moves it to a dead-letter store and reports it. It is **never** retried in a loop.
- `202 { results, cursor: null }` at Stage 3, when projection runs asynchronously (BACKEND-ARCHITECTURE §6.1). The client keeps its optimistic state until the next `/sync`.
- A whole batch fails only on auth, size, rate limit or `CLIENT_TOO_OLD`. Then nothing was written, and the client retries the same batch.

### 4.4 Sync (`sync` module)

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /sync?cursor={c}&limit=500` | A | 1 | Pull every projection row changed since `c` (§5). |

### 4.5 Read models (`mastery`, `learning` modules)

These exist for screens that need more than the synced projections, or for clients that don't keep a full local store.

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /me/dashboard` | A | 1 | Dashboard aggregate. Redis-cached 60 s per user, invalidated by ingest. `ETag`. |
| `GET /me/mastery?track=javascript` | A | 1 | All concept mastery rows for the user. |
| `GET /me/mastery/{conceptKey}/explain?limit=50&cursor=` | A | 1 | Evidence behind one mastery score, newest first. Powers "why is my score 0.62?". |
| `GET /me/reviews?status=pending&limit=50` | A | 1 | Review queue by `dueAt`. |
| `GET /me/activity?from=2027-01-01&to=2027-01-31` | A | 1 | Daily activity (streak calendar, goal progress). Max 366 days per call. |
| `GET /me/challenges/{challengeKey}/attempts?limit=20&cursor=` | A | 1 | Attempt history, newest first. `code` is included only with `?include=code`. |
| `PUT /me/drafts/{challengeKey}` | A | 1 | `{ code, clientUpdatedAt }` → `200 { rev }`, or `409 CONFLICT { serverDraft }` if the server holds a newer `clientUpdatedAt`. The client keeps the losing draft as "recovered". |

```ts
interface Dashboard {
  continueLearning: { lessonKey: string; sectionKey: string | null; progressPct: number } | null;
  streak: { current: number; longest: number; todayGoalMet: boolean };
  todayMinutes: number;
  reviewsDue: number;
  weakConcepts: { conceptKey: string; score: number; level: MasteryLevel }[];        // ≤ 5
  recommended: { kind: "lesson" | "review" | "challenge"; key: string; reason: string }[];  // reason is a code
  trackSummary: { trackKey: string; lessonsCompleted: number; lessonsTotal: number; avgMastery: number }[];
}

type MasteryLevel = "not_started" | "introduced" | "developing" | "proficient" | "mastered" | "expert";

interface ConceptMasteryDto {
  conceptKey: string;
  score: number;                  // 0..1, self_reported + server_verified evidence
  verifiedScore: number | null;   // server_verified evidence only (credentials)
  level: MasteryLevel;
  dimensions: { practiceAccuracy: number; challengeCompletion: number; hintsEfficiency: number;
                speedEfficiency: number; consistencyBonus: number };
  evidenceCount: number;
  lastActivityAt: string;
  engineVersion: string;
  rev: number;
}
```

### 4.6 Assessment verification (`assessment` module)

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /challenges/{challengeKey}/verifications` | R, **I** | 3 | `{ attemptId }`. Re-runs that attempt's code against the **hidden** tests in the sandbox → `202 { verificationId }`. |
| `GET /verifications/{verificationId}` | R | 3 | `{ status: "queued" \| "running" \| "passed" \| "failed" \| "error", testsPassed, testsTotal }`. On `passed`, the attempt becomes `server_verified` and `verifiedScore` updates. |

### 4.7 AI tutor (`tutor` module, Stage 2)

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /tutor/threads` | A, **I** | 2 | `{ lessonKey?, challengeKey?, locale }` → `201 Thread`. Reuses the open thread for the same challenge. |
| `GET /tutor/threads?limit=20&cursor=` | A | 2 | Recent threads. |
| `GET /tutor/threads/{threadId}/messages?limit=50&cursor=` | A | 2 | Messages, oldest first. |
| `POST /tutor/threads/{threadId}/messages` | A, **I** | 2 | Send a message. The response is a `text/event-stream` (below). |
| `GET /tutor/threads/{threadId}/messages/{messageId}/stream` | A | 2 | Resume a stream that dropped. Honors `Last-Event-ID`. |
| `POST /tutor/messages/{messageId}/feedback` | A | 2 | `{ helpful: boolean, reason? }`. Feeds tutor quality evaluation. |
| `GET /me/tutor/quota` | A | 2 | `{ remainingThisHour, resetsAt, dailyTokensRemaining }`. |

```ts
// POST /v1/tutor/threads/{id}/messages
interface TutorMessageRequest {
  action: "chat" | "explain_concept" | "explain_error" | "explain_trace_step"
        | "give_hint" | "break_it_further" | "review_code";      // AI-TUTOR-SPEC §3
  text?: string;                    // ≤ 4,000 chars; required for "chat"
  editor?: { code: string; cursorLine?: number; selection?: string };   // ≤ 16 KB
  runtime?: { lastStatus: "success" | "error" | "timeout" | "untested";
              errors?: string[]; failedTestKeys?: string[];
              traceSummary?: { totalSteps: number; errorStep?: number;
                               activeVariables?: Record<string, string> } };  // ≤ 8 KB
}
```

Stream events, in order:
```text
event: meta     data: {"messageId":"…","hintTier":2,"model":"small"}
event: delta    data: {"text":"লক্ষ্য করো, Step 4-এ "}         (repeated; id: <seq> on every event)
event: done     data: {"inputTokens":812,"outputTokens":164,"finishReason":"stop"}
event: error    data: {"code":"QUOTA_EXCEEDED"}                 (instead of done)
```

Rules:
- The client uses `fetch` with a streaming body. `EventSource` can't send a POST.
- The quota is checked **before** the provider call and debited with the real token count after it.
- The server builds the prompt itself (`TutorContextBuilder`): lesson objectives from the manifest, mastery from the database, and the learner's code and trace summary only inside untrusted delimiters. The client never sends a prompt.
- If the stream drops, the server finishes generating and persists the message anyway, so `/stream` can replay it.
- `explain_concept` answers are cached per `(conceptKey, locale, releaseVersion)` and served without a provider call. They don't count against the hourly quota.

### 4.8 Server execution (`execution` module, Stage 3, non-browser languages)

JavaScript **never** reaches these endpoints. It runs in the browser worker (ADR-005).

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /executions` | R, **I** | 3 | `{ language: "python", code, stdin?, challengeKey? }` → `202 { executionId }`. Limits come from server policy only (SECURITY §2.2). |
| `GET /executions/{executionId}` | R | 3 | `{ status, exitCode?, durationMs?, traceUrl? }`. `traceUrl` is a signed R2 link to the ADR-003 trace. |
| `GET /executions/{executionId}/events` | R | 3 | SSE: `status`, `stdout`, `trace_chunk`, `done`. |

Identical `(runtimeVersion, code, stdin)` runs are served from the content-addressed R2 cache without executing again.

### 4.9 Notifications (`notify` module, Stage 1–2)

Spaced review only works if learners come back. Reminders are the retention lever, so they ship with Stage 1 (email) and Stage 2 (web push).

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /me/notification-preferences` | A | 1 | Preferences. |
| `PUT /me/notification-preferences` | A | 1 | `{ reviewReminders: "off" \| "daily" \| "smart", streakReminders: boolean, quietHours: { start: "22:00", end: "08:00" }, channels: { email: boolean, push: boolean } }`. |
| `POST /me/push-subscriptions` | A | 2 | Web Push subscription `{ endpoint, keys: { p256dh, auth } }`. Idempotent by endpoint. |
| `DELETE /me/push-subscriptions/{subscriptionId}` | A | 2 | Unsubscribe. |
| `GET /notifications/unsubscribe?token=` | — | 1 | One-click email unsubscribe (RFC 8058), signed token. |

### 4.10 Plans and entitlements (`billing` module, Stage 2+)

Product rule: **learning content stays free.** Paid plans raise the expensive limits (tutor quota, server execution, verified certificates) and add cohort features for institutions.

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /plans` | — | 2 | Public plan list (keys, prices per currency, included limits). CDN-cached. |
| `GET /me/entitlements` | A | 2 | Effective entitlements (also embedded in `GET /me`). |
| `POST /checkout/sessions` | R, **I** | 2 | `{ planKey, provider: "bkash" \| "sslcommerz" \| "stripe", currency: "BDT" \| "USD" }` → `{ redirectUrl }`. |
| `POST /webhooks/payments/{provider}` | provider signature | 2 | Payment events. Signature verified, idempotent by `(provider, providerEventId)`, processed by the worker through the outbox. |

```ts
interface Entitlement {
  feature: "tutor_messages_per_hour" | "tutor_daily_tokens" | "server_executions_per_day"
         | "verified_certificates" | "cohort_seats";
  limit: number;                    // -1 = unlimited
  source: "free" | "subscription" | "org_seat" | "grant";
  expiresAt: string | null;
}
```

### 4.11 Organizations and cohorts (`org` module, Stage 2)

Serves universities, bootcamps and the pilot cohort itself: a teacher sees aggregate progress for learners who **consented** (`cohort_sharing`).

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /orgs` | R, **I** | 2 | `{ name, slug }` → `201 Org`. Creator becomes `owner`. |
| `GET /orgs/{orgId}` | member | 2 | Org details. |
| `POST /orgs/{orgId}/members` | org admin, **I** | 2 | Add a staff member `{ email, role: "admin" \| "instructor" }`. |
| `POST /orgs/{orgId}/cohorts` | org admin, **I** | 2 | `{ name, trackKey, startsOn, endsOn? }` → `201 Cohort`. |
| `POST /cohorts/{cohortId}/invites` | instructor, **I** | 2 | `{ maxUses, expiresAt }` → `{ code, joinUrl }`. |
| `POST /invites/{code}:accept` | R | 2 | Joins the cohort. Asks for `cohort_sharing` consent first if missing → `409 CONFLICT { needs: "consent" }`. |
| `DELETE /cohorts/{cohortId}/members/me` | R | 2 | Leave a cohort. Sharing stops immediately. |
| `GET /cohorts/{cohortId}/members?limit=100&cursor=` | instructor | 2 | Member list with per-learner summary (`cohort_member_summary`). |
| `GET /cohorts/{cohortId}/report` | instructor | 2 | Aggregates: completion funnel, weakest concepts, loop completion rate. Served from the summary projection, never from a live scan of learner tables. |

### 4.12 Feature flags and experiments

Flags are evaluated server-side and returned in `GET /me` (`flags`). Rules live in `ops.feature_flags`. Experiment assignment is deterministic, `hash(flagKey + userId) mod 100`, so it needs no assignment table and stays stable across devices.

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `GET /admin/flags` / `PUT /admin/flags/{key}` | Admin | 1 | Manage rules. Changes are written to `ops.audit_log`. |

### 4.13 Admin and operations

| Method & path | Auth | Stage | Purpose |
|---|---|---|---|
| `POST /admin/projections:rebuild` | Admin, **I** | 1 | `{ scope: "all" \| "user", userId?, reason }`. Replays evidence with the current engine and bumps the user's sync `epoch` (§5). |
| `GET /admin/users/{userId}` | Admin | 1 | Support view. Every read is audit-logged. |
| `GET /healthz` | — | 1 | Liveness: process up. |
| `GET /readyz` | — | 1 | Readiness: DB pool, Redis and catalog loaded. Used by the load balancer. |

---

## 5. Sync protocol

**Goal:** a learner with two devices sees the same progress, mastery and reviews, without conflicts or missed rows, on a network that drops out.

```ts
// GET /v1/sync?cursor=<opaque>&limit=500
interface SyncResponse {
  cursor: string;                  // pass back next time
  hasMore: boolean;                // true → call again immediately
  reset: boolean;                  // true → drop local projections, then apply `changes` from scratch
  changes: SyncChanges;
}

interface SyncChanges {
  conceptMastery: ConceptMasteryDto[];
  lessonProgress: { lessonKey: string; status: "in_progress" | "completed"; completedSections: string[];
                    currentSection: string | null; progressPct: number; lastVisitedAt: string; rev: number }[];
  challengeProgress: { challengeKey: string; bestStatus: string; bestScorePct: number;
                       attemptsCount: number; firstPassedAt: string | null; rev: number }[];
  reviewItems: { id: string; conceptKey: string; reason: string; priority: string;
                 status: "pending" | "completed" | "dismissed"; dueAt: string; rev: number }[];
  bookmarks: { lessonKey: string; removed: boolean; rev: number }[];     // tombstones included
  codeDrafts: { challengeKey: string; code: string; clientUpdatedAt: string; rev: number }[];
  dailyActivity: { day: string; activeSeconds: number; sectionsCompleted: number;
                   reviewsCompleted: number; goalMet: boolean; rev: number }[];
}
```

How it works:
1. Every projection row has a `rev`. It comes from a **per-user counter** (`learning.sync_state`), not a global sequence. That keeps it monotonic for one learner even after the learner's data moves to another shard (DATABASE-DESIGN §2.8).
2. The cursor encodes `{ rev, epoch }`. The server returns rows with `rev > cursor.rev` across all projection tables, merged by `rev`, up to `limit`.
3. `epoch` changes when the user's projections are rebuilt (new engine version, admin rebuild). If the cursor's epoch is old, the server answers `reset: true` and streams from `rev 0`.
4. An empty or missing cursor means a full pull.
5. Pull triggers: app start, coming back online, after every successful `/events:batch` (its response already carries the changes), and every 5 minutes while visible.

Conflict rules are unchanged from BACKEND-ARCHITECTURE §6.2. Events are a set union. Mastery and reviews are server-derived, so the server wins. Drafts use last-write-wins by `clientUpdatedAt` and keep the loser.

---

## 6. Key flows

### 6.1 Anonymous-first identity

Kodara is local-first. Requiring sign-in before the first lesson costs learners, and the pilot measures return within 7 days. So:

```text
first visit          → learn locally, nothing sent (no user row, no cost)
first meaningful act → (completes a section) SPA calls POST /auth/anonymous with a Turnstile token
                       → user { kind: "anonymous" } + session cookie; outbox starts syncing
later, "save across devices" → OTP or Google with the anonymous session attached
                       → identity linked to the SAME user_id; kind becomes "registered"; no data copy
```

- If the email or Google account already belongs to another registered user, `otp/verify` returns `409 CONFLICT { existingAccount: true }`. The learner chooses: **switch** (log in to the existing account, then the client replays its local outbox there, safe because events are idempotent) or **cancel**. The server never merges two accounts' projections in place. A replay does the merge.
- Anonymous users idle for 90 days are purged by the same job that purges deleted accounts. The SPA warns in-app at day 60.
- Anonymous users can't use the tutor, cohorts, exports or payments (auth `R`). That limits the abuse surface and cost.

### 6.2 Offline replay after a long gap
1. The device comes online with 800 events in the outbox.
2. It sends 8 batches of 100 in **time order**, one in flight at a time per device.
3. Old events (up to 400 days) land in their month partition, or in `default` if that month was archived.
4. If an event references a release the server no longer holds in memory, the server loads that manifest from R2 (they are immutable and kept forever).
5. A schema version below the floor gets `426`. The SPA reloads, and the new bundle's upcasters rewrite the outbox before resending.

### 6.3 Challenge submission
1. The browser worker runs the visible tests and produces `ChallengeEvaluation`.
2. The SPA emits `challenge.submitted` with `eventId` = `attemptId`.
3. The server writes the raw event (without `code`), the `challenge_attempts` row (with `code`), evidence (`challenge_passed/failed/partial`, `self_reported`), and updates `challenge_progress` and mastery, all in one transaction.
4. Stage 3: a passing attempt can be sent to `POST /challenges/{key}/verifications`. It becomes `server_verified` only after the hidden tests pass in the sandbox.

---

## 7. Learning event catalog

### 7.1 Envelope
```ts
interface LearningEvent<T extends LearningEventType = LearningEventType> {
  eventId: string;           // UUIDv7, created on the device at the moment of the action.
                             // occurredAt is NOT sent: the server reads it from the UUIDv7,
                             // so the two can never disagree (DATABASE-DESIGN §2.3).
  type: T;
  schemaVersion: number;     // per type, starts at 1
  deviceId: string;
  releaseVersion: string;    // content release the learner was on
  engineVersion: string;     // MASTERY_CONFIG.version that computed the optimistic state
  lessonKey?: string;
  challengeKey?: string;
  payload: PayloadOf<T>;
}
```

### 7.2 Types
Facts that matter to mastery, progress or reviews. UI interaction events are telemetry (§8) and do **not** go here.

| `type` | Payload (v1) | Projected to |
|---|---|---|
| `lesson.section_completed` | `{ sectionKey, door: "story" \| "engine" \| "play", timeSpentS }` | `lesson_progress`, `daily_activity`; evidence `lesson_section_completed` |
| `lesson.completed` | `{ timeSpentS }` | `lesson_progress.status` |
| `lesson.bookmark_set` | `{ bookmarked: boolean }` | `bookmarks` (latest `occurredAt` wins) |
| `prediction.made` | `{ predictionKey, kind: "order" \| "placement" \| "value", isCorrect, misconceptionKey?, attemptNo, timeSpentS }` | evidence `prediction_correct/incorrect` |
| `practice.answered` | `{ questionKey, sessionId, isCorrect, attemptNo, hintsUsed, timeSpentS, answer? }` (`answer` ≤ 2 KB, for misconception analysis) | evidence `practice_correct/incorrect` |
| `practice.session_completed` | `{ sessionId, mode, targetKey, questions, correct }` | `daily_activity` |
| `challenge.started` | `{}` | nothing (funnel analytics only) |
| `challenge.submitted` | `{ code, startedAt, hintsUsed, timeSpentS, evaluation: { status, scorePct, testsPassed, testsTotal, tests: [{ testKey, status }] } }` | `challenge_attempts`, `challenge_progress`; evidence `challenge_passed/failed/partial` |
| `hint.revealed` | `{ hintKey, tier: 1-4, context: "practice" \| "challenge" \| "tutor" }` | evidence `hint_used` |
| `break_it.resolved` | `{ scenarioKey, timeToDiagnoseS, attempts, hintsUsed }` | evidence `break_it_resolved` (PRODUCT §4.3 "time to diagnose") |
| `review.completed` | `{ reviewId, outcome: "recalled" \| "forgot", timeSpentS }` | `review_items`, `daily_activity` |

### 7.3 Server validation (in order)
1. Envelope schema (zod, from `packages/contracts`).
2. `eventId` is a valid UUIDv7 and its timestamp is within [now − 400 d, now + 5 min].
3. `releaseVersion` exists. Every key in the payload exists **in that release's manifest**.
4. Per-type rules: `timeSpentS` is between 0 and 86,400; `attemptNo` ≥ 1; `testsPassed` ≤ `testsTotal`.
5. Duplicate check, through the insert's `ON CONFLICT`.

An event that fails 1–4 is `rejected`, logged with the reason, and counted in the `ingest_rejected_total{reason}` metric. A spike in rejections after a release is the signal of a client/server contract bug.

### 7.4 Evolving an event
- **Add an optional field:** same `schemaVersion`. Old clients just don't send it.
- **Rename, retype or remove:** bump `schemaVersion`, and add an upcaster `vN → vN+1` in `packages/contracts`. The server upcasts on ingest and stores the latest version.
- **Retire a version:** raise the floor only when telemetry shows fewer than 0.5 % of active devices still send it. Clients below the floor get `426` and keep their outbox.

---

## 8. Telemetry (not learning data)

Page views, Story ⇄ Engine skin toggles, trace step scrubbing, runs in the playground and timing marks are high-volume and drive no projection. Putting them in `learning_events` would roughly triple the hottest table for no learning value.

```ts
// POST /v1/telemetry:batch   → always 202, even when sampled out or rate limited
interface TelemetryBatch {
  records: { name: string; at: string; props?: Record<string, string | number | boolean> }[];  // ≤ 200, props ≤ 1 KB
}
```

Path: API → Redis Stream → worker → hourly Parquet files on R2 → DuckDB (Stage 2) or ClickHouse (Stage 3). It never touches Postgres.

- Unauthenticated telemetry is allowed, keyed by a random per-install id, so the pilot's north-star funnel works before sign-in.
- Without `product_analytics` consent, only strictly necessary operational metrics are recorded, with no user or install id.
- The pilot north star ("finishes Story → Engine → Predict → Break → Fix **and** returns within 7 days") is computed from learning events plus telemetry in the warehouse, never on the OLTP primary.

---

## 9. Performance budgets (Stage 2)

| Endpoint | p50 | p99 | Notes |
|---|---|---|---|
| `POST /events:batch` (100 events) | 60 ms | 300 ms | One transaction, one row lock per user |
| `GET /sync` | 40 ms | 400 ms | Index range scans on `(user_id, rev)` |
| `GET /me/dashboard` | 10 ms (cache hit) | 150 ms | Single-flight on cache miss |
| `GET /me` | 10 ms | 80 ms | Session cached in Redis 60 s |
| Tutor first token | 700 ms | 1.5 s (p95) | Provider-bound |
| `PUT /me/drafts/*` | 20 ms | 120 ms | |

These budgets assume the API, Postgres and Redis share a region (Singapore or Mumbai). Learners in Bangladesh add about 50–80 ms of network round trip on top.
