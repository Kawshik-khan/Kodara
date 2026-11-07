# ADR 005: JavaScript-First, Local-First MVP (Backend Deferred)

## Context
The 2026-10-16 principal review found heavy drift between documentation and code:
- `ARCHITECTURE.md`, `ROADMAP.md`, `DEVELOPMENT.md` and several skills describe a backend API, PostgreSQL, Redis, a Docker/gVisor sandbox, Zustand, Monaco, pnpm, ESLint and `content:validate`.
- None of these exist. The repository is a frontend-only Vite + React SPA that persists to `localStorage`, uses npm, and has no linter beyond `tsc`.
- Meanwhile 5 tracks are planned and 2 lessons exist. AGENT.md §4 requires conflicts between docs and code to be recorded rather than silently resolved.

Kodara also has not yet been validated with real learners.

## Decision
1. **One language first: JavaScript.** All new lesson, engine and content work targets the "JavaScript রানটাইম, গল্পে গল্পে" curriculum in [PLAN 001](../PLANS/001-javascript-story-runtime.md). Python, React, System Design and AI Engineering tracks are frozen until the PLAN 001 M6 decision gate.
2. **Local-first, no backend until validated.** No API server, database, auth or Redis is built before the M6 pilot passes its north-star target. Persistence stays behind the existing repository interfaces (`localStorage`), with JSON export/import.
3. **Client-side execution for JavaScript.** Learner JavaScript runs in a dedicated, disposable **Web Worker**:
   - network globals are removed before the code runs;
   - the main thread enforces a wall-clock timeout (`terminate()`);
   - there is an event budget;
   - there is no DOM or storage access.

   This satisfies the AGENT.md security principle for this phase. The code is the learner's own, it runs in their own browser, and it never touches a Kodara server. A server-side sandbox (ADR-001 worker) becomes required only for languages that can't run in the browser, or for any server-side evaluation.
4. **Documentation status.** Where docs describe api/worker/Postgres/Redis/Zustand/Monaco/pnpm/ESLint, that is **target architecture**, not current. The current toolchain is: npm, `npm run typecheck`, `npm test`, `npm run build`; React local state and context (Zustand only via a future ADR); CodeMirror 6 for the editor (lighter than Monaco on mobile). `AGENT.md` §10 carries this override so agents see it first.

## Alternatives Considered
- **Build the backend first (roadmap Phase 1–2):** rejected. It adds operational cost before there is evidence that learners return, and nothing in the current loop needs a server.
- **Keep all 5 tracks in parallel:** rejected. Content is the bottleneck, and parallel tracks make every lesson thinner.
- **Server sandbox for JavaScript:** rejected for the MVP. It adds latency, cost and infrastructure for code the browser can isolate itself.
- **Keep `new Function` on the main thread:** rejected. Infinite loops freeze the tab, and the code gets full DOM and storage access (review P0-2).

## Consequences
### Positive
- Shippable to real learners in weeks, with zero hosting beyond static files.
- Execution is truthful (the real engine) and safe for the page.
- Docs and code agree on what exists today.

### Negative / Tradeoffs
- Progress is per-device until the backend exists; mitigated by export/import.
- Analytics are limited; the pilot needs a privacy-respecting measurement choice (separate ADR).
- ADR-001's worker/sandbox design is deferred, not discarded.

## Status
Accepted

## Date
2026-10-25
