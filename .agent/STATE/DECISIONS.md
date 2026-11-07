# KODARA ARCHITECTURAL DECISIONS INDEX

This file tracks all Architectural Decision Records (ADRs) established in `.agent/DECISIONS/`.

| ADR | Title | Status | Date | Core Impact |
| :--- | :--- | :--- | :--- | :--- |
| [001](file:///f:/OLama/Kodara/.agent/DECISIONS/001-modular-monolith-architecture.md) | Modular Monolith Core with Isolated Asynchronous Workers | Accepted | 2026-09-09 | Simplifies operational complexity while guaranteeing code execution security. |
| [002](file:///f:/OLama/Kodara/.agent/DECISIONS/002-white-orange-design-system.md) | Canonical White + Orange + Technical Grid Visual Language | Accepted | 2026-09-09 | Codifies high-precision engineering aesthetics; eliminates arbitrary color drift. |
| [003](file:///f:/OLama/Kodara/.agent/DECISIONS/003-language-neutral-trace-protocol.md) | Language-Neutral Event-Driven Execution Trace Protocol | Accepted | 2026-09-09 | Decouples interactive visualizers from underlying language runtime AST engines. |
| [004](file:///f:/OLama/Kodara/.agent/DECISIONS/004-native-bangla-bilingual-architecture.md) | Native Bangla Bilingual Language Architecture | Accepted | 2026-09-09 | Establishes native Bangla as default with industry English technical vocabulary. |
| [005](file:///f:/OLama/Kodara/.agent/DECISIONS/005-javascript-first-local-first-mvp.md) | JavaScript-First, Local-First MVP (Backend Deferred) | Accepted | 2026-10-25 | One language, no backend until the pilot gate, Web Worker execution for JS; marks api/db/Zustand/Monaco/pnpm docs as target-only. |
| [006](file:///f:/OLama/Kodara/.agent/DECISIONS/006-story-mode-two-skins.md) | Story Mode, One Trace with Two Skins | Accepted | 2026-10-25 | Story and Engine views render the same real trace; story assertions keep stories truthful. |
| [007](file:///f:/OLama/Kodara/.agent/DECISIONS/007-backend-target-architecture.md) | Local-First, Event-Sourced Backend Target Architecture | Proposed (rev. 2026-10-29) | 2026-10-25 | Post-M6 backend: idempotent UUIDv7 learning events as truth, shared mastery engine, content on CDN, Postgres 18 partitioning and per-query indexes. Revision: per-learner sync counter, shard-safe keys, telemetry split, anonymous-first identity, notify/org/billing modules, full API contract (`API-SPEC.md`). Nothing built before the M6 gate. |
| [008](../DECISIONS/008-harness-playbook-course.md) | Harness Engineering Playbook Course in the AI Engineering Track | Accepted (user-approved exception) | 2026-10-29 | One course ships in the frozen AI Engineering track: recorded Python traces (never hand-written), `code-trace` / `chart` / `faq` blocks, ManimGL scenes as source assets, keyboard scope for multiple visualizers. |
