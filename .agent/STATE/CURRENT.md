# KODARA CURRENT REPOSITORY STATE

Last verified: 2026-10-25 (code read + `tsc --noEmit` + `vitest run` + `npm run build`)

## 1. Current Milestone
**PLAN 001 · M0 — Stabilize** (see `.agent/PLANS/001-javascript-story-runtime.md`).
Product direction: JavaScript-first, local-first MVP (ADR-005) with Story Mode, one trace with two skins (ADR-006).

## 2. What exists

### Platform
- **Frontend-only SPA:** Vite 6 + React 18 + TypeScript 5.8 + React Router 6 + TanStack Query. Package manager **npm**.
- **No backend, API, database, auth, Redis or server sandbox.** None of these exist in the repo.
- **Persistence:** browser `localStorage` via repository interfaces:
  - `features/lessons/services/progressRepository.ts` (lesson progress, bookmarks)
  - `features/progress/repositories/ProgressRepository.ts` (evidence, mastery, review queue)
  - `features/assessment/repositories/LocalAttemptRepository.ts` (practice/challenge attempts, drafts)
- **i18n:** `src/i18n/` with `bn` default and `en`; locales `common`, `dashboard`, `navigation`.
- **Not a git repository.**

### Features
- **App shell:** sidebar, topbar, mobile nav, global search, Fluid Flow Grid background.
- **Dashboard:** built, but renders the **mock fixture** `MOCK_DASHBOARD_DATA` (`features/dashboard/api/dashboard.ts`).
- **Track overview:** TypeScript curriculum graph, 14 modules; unlock logic partly hard-coded.
- **Lesson system:** `features/lessons/` with 9+ block types. **2 authored lessons:** `variables`, `narrowing` (`src/content/lessons/typescript/`).
- **Visualization engine:** `features/visualization/` (scene graph, scene diff, playback, keyboard, inspector, synchronized code panel). **5 hand-authored visualizations:**
  - `typescript.variables.basic`
  - `javascript.call-stack.basic`
  - `typescript.scope.lookup`
  - `typescript.references.object`
  - type narrowing

  There is **no trace generator yet**; all steps are hand-written ("modeled").
- **Assessment:** 12 practice-question renderers, challenge runner, hints, validators.
- **Progress engines:** mastery, spaced review, recommendations. Built but **not surfaced** (the Progress route is a placeholder).
- **Placeholders (dead-end routes):** Playground, Challenges, Projects, Concepts, Skill Map, Architecture Lab, Progress, Settings.

## 3. Known defects (must fix, see PLAN 001 M0/M1)
1. **Challenge auto-pass:** `TypeScriptChallengeEvaluator.runSingleTestCase` returns `"passed"` for test cases without `testFunctionCode`.
2. **Unsafe execution:** challenge code runs with `new Function` on the main thread, with regex type-stripping. An infinite loop freezes the tab, and the regex breaks object literals and ternaries.
3. **12 orphaned v1 module files** in `src/content/curriculum/typescript/modules/` that `typescriptCurriculum.ts` does not import.
4. ~~**Bundle:** a single JS chunk; no route-level code splitting.~~ **Fixed 2026-10-29:** every page in `routes.tsx` is `React.lazy` behind `Suspense` (`RouteFallback`). Initial JS is 92.2 KB gzip (entry chunk only), plus 11.2 KB for the Dashboard. On-demand chunks: TrackOverviewPage 7.2 KB, shared curriculum `course` chunk 111.9 KB, LessonPage 186.4 KB (all lessons, traces, charts, flows).
5. **Doc drift:** many docs and skills reference pnpm, ESLint, Zustand, Monaco, `content:validate`, api/worker/Postgres/Redis. These are target architecture only (ADR-005, AGENT.md §10).

## 4. Test & build status (2026-10-25)
- `npm run typecheck`: 0 errors (6 errors in `features/progress/` fixed this day; the `RecommendationEngine` `Map` lookup was a real bug).
- `npm test`: 21 files, **68/68 passing**.
- `npm run build`: passes. Chunk-size warning (> 500 kB).

## 5. Design prototypes (outside the repo)
Claude Design canvas "Kodara — Hardest Lesson Demo" with two artboards:
- the detailed Event Loop lesson (predict, 15-step trace, break-it, tutor hints, mastery);
- **Story Mode: মন্টু মামার চায়ের দোকান** (9 pages, 3-line Promise/setTimeout story).

These are the visual reference for PLAN 001 M3.

## 5b. Harness Engineering Playbook course (2026-11-07, ADR-008)
User-approved exception to the AI Engineering track freeze. Nothing in PLAN 001 changed priority.
- **Course outline:** `src/content/courses/harness-playbook/course.ts`, 24 units: intro, chapters 00–20, field case, appendices. **All of Part I (Chapters 00, 01, 02) and Part II (Chapters 03, 04, 05, 20) are authored** (7 lessons total):
  - `ch00`: control loop, typed stops, warranted autonomy, verification-budget chart;
  - `ch01`: hash-chained event log, crash-and-resume, silent-failure chart;
  - `ch02`: ACI refund boundary, idempotency, ack-lost reconciliation, duplicate-refunds chart;
  - `ch03`: context compiler (`courses/harness-playbook/harness/ch03/context_compiler.py`), scope-first admission vs post-filter top-$k$, trust tiers, freshness TTLs, active conflict preservation, post-filter recall chart;
  - `ch04`: budgeted controller (`courses/harness-playbook/harness/ch04/budgeted_controller.py`), 8-mode controller state machine, suspension vs burning loops, progress fingerprints, recovery reserve protection, multi-layer retry amplification chart;
  - `ch05`: qualification gate (`courses/harness-playbook/harness/ch05/qualification_gate.py`), 6-stage evaluation control plane, claim graph & trajectory invariants, missing-output attrition accounting, hard safety vetoes vs soft completion averages, $\text{pass}@k$ vs $\text{pass}^k$ chart;
  - `ch20`: skill linker (`courses/harness-playbook/harness/ch20/skill_linker.py`), progressive disclosure, nomination vs deterministic admission, exclusion gates (`active_chargeback`), authority intersection (`skill.tools ∩ run_grant`), Skill Bill of Materials (BOM), mid-run revocation on resume, skill activation precision & catalog overlap chart.
  The other 17 units show as "planned" on `/learn/ai-engineering`, which replaces the old placeholder "Embeddings & RAG" data.
- **New lesson blocks:**
  - `code-trace`: `features/code-trace/`, a recorded trace player with what / why / without / book notes.
  - `chart`: `features/charts/`, `ChartDefinition` plus `ParametricChart` with a Manim tab.
  - `faq`
- **Visualizations:** eight modeled `VisualizationDefinition`s for the Harness Playbook chapters (`visualizations/aiEngineering/`).
- **Playback hook:** `useVisualizationPlayback` takes an optional `scopeRef`, so shortcuts go to the last-touched visualizer. `VisualizationControls` shows a scrubber above 16 steps.
- **Python course code:** `courses/harness-playbook/` (stdlib only).
  - Tests: `python -m unittest -v`, 45 tests across `ch00`–`ch05` and `ch20` (38 pass plus 7 `expectedFailure` exercises).
  - `tools/record_trace.py` writes the trace JSON.
  - ManimGL scenes in `scenes/` (`ch00`–`ch05`, `ch20`), not rendered (ManimGL is not installed here).
- **Verification:** `npm run typecheck` clean; `npm test` 34 files, 149/149; `npm run build` passes; initial JS 92.23 KB gzip after route splitting (LessonPage chunk 298.65 KB gzip). The course outline (`course.ts`) carries only slugs; lesson content is in `lessons.ts` and loads with the lesson page.

## 5a. Backend Stage 0 prep (2026-10-29)
- `src/lib/ids.ts`: monotonic UUIDv7. Assessment events, practice/challenge attempts, practice sessions and review items now use it. Event `timestamp` always equals the time inside the id (`newEventIdentity`). This fixes a latent bug: two events in the same millisecond got the same `evt_${Date.now()}` id, and ingestion deduped the second away.
- Evidence ids are deterministic: `${sourceEventId}:${conceptId}`.
- New assessment events `prediction.made` and `breakIt.resolved`, with evidence signals `prediction_correct/incorrect` and `break_it_resolved`. `MASTERY_CONFIG.version` is now `1.1.0`. Nothing emits the new events yet; PLAN 001 M4 will.
- Old `localStorage` data with legacy ids still loads. Only new rows get UUIDv7.
- Tests: 23 files, **80/80 passing**; typecheck and build pass.

## 6. Next Recommended Task
PLAN 001 **M0**, then **M1** (Trace Engine v1). See `NEXT.md`.
