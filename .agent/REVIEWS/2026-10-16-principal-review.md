# Kodara — Principal Review (Architecture · Engineering · Product · UX)

Date: 2026-10-16 · Scope: entire repo (`src/`, `.agent/`, configs) · Method: code read + `tsc --noEmit` + `vitest run`

---

## 1. Executive summary

Kodara has a **strong, differentiated thesis** (Bangla-native engineering education + runtime visualization + evidence-based mastery) and an **unusually good engineering foundation** for its age: feature-sliced React app, a deterministic visualization engine, typed content, ADRs, and 68 passing tests.

The main risk is not technical — it is **scope and truthfulness**:

1. The plan covers 5 tracks, 15 phases, AI tutor, system-design simulator and enterprise features, while only **2 real lessons** exist.
2. Some parts **look finished but are simulated** (challenge tests auto-pass, "sandbox" runs on the main thread, dashboard is a fixture). This silently corrupts the mastery data the product is built on.
3. Docs and code have **drifted apart**, which is dangerous in an agent-driven workflow because agents trust the docs.

**Recommendation:** freeze breadth, stabilize for one week, then ship a local-first, no-backend MVP: *"JavaScript Runtime Foundations, in Bangla"* (8–10 lessons) to 30–50 real learners and measure completion and return before building backend, auth, AI tutor or other tracks.

---

## 2. What exists today

| Area | State | Notes |
|---|---|---|
| App shell, sidebar, topbar, i18n (`bn` default) | Built | Good base |
| Dashboard | Built on **mock fixture** | `features/dashboard/api/dashboard.ts` returns `MOCK_DASHBOARD_DATA` |
| Track overview (TS curriculum graph, 14 modules) | Built | Unlock logic partly hard-coded (`trackData.ts`) |
| Lesson page + 9 block types | Built | 2 authored lessons: variables, narrowing (~650 lines each) |
| Visualization engine | Built, strong | Scene graph, diffing, playback, keyboard, inspector, 5 visualizations |
| Assessment (12 question renderers, challenges) | Built | Evaluator is simulated (see P0) |
| Progress engines (mastery, spaced review, recommendations) | Built, **not surfaced** | Progress route is a placeholder; tsc errors here |
| Playground, Challenges, Projects, Concepts, Skill map, Architecture lab, Progress, Settings | **Placeholders** | 8 of 11 nav destinations are dead ends |
| Backend, auth, DB, execution worker, AI tutor | None | Frontend-only SPA |

Size: 279 files in `src/`, ~34.6k lines TS/TSX, of which ~13.8k are content. 21 test files / 68 tests pass. **Not a git repository.**

---

## 3. Findings (ranked)

### P0 — fix before anything else

**P0-1. Challenge tests pass without running.**
`TypeScriptChallengeEvaluator.runSingleTestCase` returns `status: "passed"` for any test case without `testFunctionCode` (`evaluators/TypeScriptChallengeEvaluator.ts:178-186`). In `challengeRegistry.ts`, 23 test cases exist and only 13 have `testFunctionCode` → **~10 tests always pass.** Learners get false "correct" feedback and the mastery engine ingests fake evidence. This violates AGENT.md §6 ("Never fabricate functionality").

**P0-2. The "sandbox" is `new Function` on the main thread with regex type-stripping.**
- An infinite loop freezes the tab; code has full access to DOM, `localStorage`, cookies.
- The regex `/:\s*[A-Za-z0-9_<>\[\]|&\s]+/g` also strips **object-literal values and ternary branches** (`{ a: 1 }`, `x ? y : z`), so valid solutions can fail and invalid ones can pass.
- Brace counting is presented as a "compile check".

**P0-3. The build is broken and the state docs say it is clean.**
`tsc --noEmit` reports 6 errors (unused imports and `Map` indexed with `[]` in `RecommendationEngine.ts:57-58`). Because `npm run build` = `tsc && vite build`, **production build fails**. `STATE/CURRENT.md` claims "0 errors".

**P0-4. No version control.** No git means no history, no review, no CI, no rollback — and an agent can destroy work with no recovery.

### P1 — structural

**P1-1. Docs/state drift.** `ROADMAP.md` says Phase 0 is in progress and the visualization engine is Phase 7 (planned); `CURRENT.md` says Phase 1 is complete including the visualization engine; `NEXT.md` asks for a 16-step lesson player; `GOAL.md` is still Phase 0. Docs require pnpm, ESLint, Zustand, lazy routes and `content:validate` — none exist (`lint` is just `tsc`). In an agent-run project, wrong docs are the source of wrong code.

**P1-2. Dead duplicate content.** 12 module files are not imported by `typescriptCurriculum.ts` (`module00JsFoundations`, `module01TsFoundations`, `module02TypeFundamentals`, `module03ControlFlow`, `module04FunctionsObjects`, `module05Generics`, `module06AdvancedTypes`, `module07TypeLevelProg`, `module09CompilerToolchain`, `module12AdvancedEng`, `module13TsReact`, `module14ExpertTs`) — about 3.7k lines of v1 leftovers that agents will read and edit by mistake.

**P1-3. Three persistence stores, no shared model.** Lesson progress (`lessons/services/progressRepository.ts`), attempts (`assessment/repositories/LocalAttemptRepository.ts`) and mastery (`progress/repositories/ProgressRepository.ts`) each write `localStorage` independently, without schema versions. The dashboard reads none of them; the track page hard-codes "1 lesson completed" and unlocked IDs.

**P1-4. Design-token drift.** 561 hard-coded hex colours in CSS outside `tokens.css` (top: `PracticeQuestionRenderer.css` 47, `ChallengeRunner.css` 33, `DomLayer.css` 32), plus inline SVG hex in `ContinueLearningCard.tsx`. ADR-002 specifies `#FF5722`; tokens use `#FF5E1E`.

**P1-5. Accessibility contrast fails WCAG AA.** `--accent-primary` / `--text-brand` `#FF5E1E` on white ≈ **3.1:1**; `--text-muted` `#8C8C8C` ≈ **3.4:1**. Normal text needs 4.5:1. The "technical button" language (orange text on white) therefore fails for most button labels.

**P1-6. i18n rule violations.** Inline `locale === "bn" ? … : …` (e.g. `DashboardHeader.tsx:20`) and hard-coded English (e.g. `TestRunnerPanel.tsx:37`). Content uses `titleEn`/`titleBn` pairs on every field — fine for 2 locales but noisy; a `Localized<string> = { bn; en }` type is cleaner and validator-friendly.

**P1-7. Performance.** No route-level `lazy()`; one 491 KB JS chunk that includes all curriculum content. `FluidFlowGrid` runs a continuous `requestAnimationFrame` loop behind every page (CPU/battery on the low-end laptops and phones common in the target market).

### Strengths to keep

- **Visualization engine** design (declarative scenes + pure diff + playback state machine + inspector) is the best part of the codebase and directly expresses the product's differentiator.
- **Trace protocol ADR-003** (language-neutral events) is the right abstraction.
- **Bangla-first ADR-004** with English technical terms is a real, defensible market position.
- Typed content, curriculum graph with prerequisites, validators, and tests from day one.

---

## 4. Architecture & system design recommendations

### 4.1 Reorder the architecture: local-first first, backend later

The current roadmap puts backend, Postgres, Redis, auth and Docker/gVisor workers (Phases 1, 2, 6) **before** learning value is validated. For JS/TS, none of that is needed: the learner runs their own code in their own browser, so the threat model is "don't freeze or break the page", not "protect the server".

```text
MVP (no server)                         Post-MVP (add only when needed)
───────────────                         ───────────────────────────────
Static SPA (Vercel/Netlify)             + Auth + Postgres (e.g. Supabase)
  ├─ Content: build-time JSON/MDX         ├─ POST /events  (batch sync of learner log)
  ├─ Runner: Web Worker                   ├─ AI tutor proxy (holds API keys, rate limits)
  │    TS transpile + timeout/terminate   └─ Server sandbox ONLY for Python-at-scale or
  │    + JS tracer → TraceEvent[]              graded/certified submissions
  ├─ Viz engine (existing)
  └─ Learner event log in IndexedDB
       → projections: progress, mastery,
         review queue, dashboard
```

Keep ADR-001 (modular monolith + isolated workers) as the **target**; add a new ADR "Local-first MVP; server execution deferred" so agents stop building toward Phase 6 early.

### 4.2 Execution runtime (replaces P0-2)

- Run code in a **dedicated Web Worker**; kill it with `worker.terminate()` after a timeout (e.g. 2 s) — the only reliable infinite-loop guard.
- Transpile TS with a real compiler (`typescript.transpileModule` lazy-loaded in the worker, or sucrase/esbuild-wasm). For type-level challenges, run the TS type checker in the worker and assert on diagnostics.
- Tests = real assertions only. A test case without executable assertions must be a **validation error**, not a pass.
- Content CI checks: every challenge's **reference solution passes** and the **starter code fails**.
- Optional stronger isolation later: QuickJS-wasm (deterministic, step-limited, easy to instrument for tracing).

### 4.3 Real traces, honestly labelled

- Today's visualizations are hand-authored scenes. That is fine — label them "modeled" (AGENT.md already requires this).
- Next step: a JS-subset tracer (acorn/Babel AST instrumentation inside the worker) emitting `TraceEvent[]`, plus one adapter `traceToSteps(trace) → VisualizationStep[]`. The existing engine stays unchanged — this is exactly what ADR-003 promises.

### 4.4 One learner event log → derived projections

Replace the three stores with an **append-only `LearnerEvent` log** (`lesson.section.completed`, `prediction.answered`, `challenge.submitted`, `hint.requested`, …) in IndexedDB with a schema version. Lesson progress, mastery, review queue and dashboard become pure projections of that log (the engines already exist). Benefits: one migration point, deterministic tests, and backend sync later is a single `POST /events` endpoint — no data model rewrite.

### 4.5 Content pipeline

- Move lesson content from large TS objects to JSON/MDX validated by a schema (e.g. zod) and a real `npm run content:validate` in CI.
- Load each lesson with dynamic `import()` so content leaves the main bundle.
- This lets Bangla-speaking educators author content without touching React — **content throughput is the real bottleneck** (each lesson is ~650 lines today).

### 4.6 Front-end hygiene

- `React.lazy` per route; lazy-load the visualization engine and the editor.
- Pause `FluidFlowGrid` when the tab is hidden, under `prefers-reduced-motion`, and on low-power devices — or render it once as a static SVG.
- Don't add Zustand until a concrete need appears; remove it from docs until then.

---

## 5. UI/UX recommendations

**Information architecture.** Eleven sidebar items with eight placeholders tells learners the product is unfinished. For the MVP use four:

| Item | Purpose |
|---|---|
| Home | "Continue where you left off" + reviews due today |
| Learn | Track → module → lesson |
| Practice | Spaced-review queue + challenges from completed lessons |
| Me | Progress, language, settings |

Hide the labs behind a feature flag. Labs should first appear *inside* lessons, where they have context.

**Lesson structure.** The 12-stage loop and 16-step player are right as a philosophy but too heavy per lesson. Use a 5-beat MVP template and keep "Break it" as an optional sixth beat:

```text
Hook (why it matters) → Model (visualization) → Predict (before reveal)
→ Try (run code) → Check (real challenge) → [Break it]
```

Predict-before-reveal gives the strongest learning signal for the least content cost — make it mandatory.

**Dashboard.** Remove vanity cards backed by mock data (streak, weekly summary, skill-map preview, projects) until real data exists. One honest "Continue" card is worth more than ten fake metrics.

**Visual design and accessibility.**
- Add a text-safe orange token (e.g. `--text-brand: #C2410C`, ≈ 5.2:1 on white) for labels and links; keep `#FF5E1E` for borders, fills with white text at ≥18.66px bold, and decoration.
- Raise `--text-muted` to ~`#6B6B6B` (≈ 5.3:1).
- Codemod hex values into tokens and add a stylelint rule banning raw hex outside `tokens.css`.
- Choose one canonical orange (`#FF5E1E` vs ADR `#FF5722`) and update the ADR.

**Bangla typography.** Body 17–18px for Bangla (conjuncts lose legibility at 14–16px), line-height 1.7–1.8, never letter-spacing on Bangla text, test long Bangla strings on buttons and chips. Add a hover glossary for English technical terms ("closure — একটি function যা তার বাইরের scope মনে রাখে").

**Mobile.** Make mobile a *read → visualize → predict* experience; keep coding desktop-first and say so in the UI instead of shipping a cramped editor.

---

## 6. Product strategy

**Positioning:** "Understand how JavaScript really runs — explained in Bangla." Narrow, ownable, and testable. TypeScript type-level, React internals, system design and AI engineering are later expansions, not the launch.

**Riskiest assumptions to test first:**
1. Bangla-speaking learners prefer a Bangla-first technical explanation and will **finish** lessons.
2. Visualization + prediction measurably improves understanding (pre/post prediction accuracy).
3. The team can produce good lessons at a sustainable rate (hours per lesson).
4. Learners **come back** without accounts or reminders (if not, accounts and notifications move up).

**MVP success metrics (first 30–50 learners, 4 weeks):**

| Metric | Target |
|---|---|
| Lesson-1 → lesson-3 completion | ≥ 40% |
| D7 return rate | ≥ 20% |
| Prediction accuracy, first vs. second attempt on reviewed concepts | measurable gain |
| Qualitative: "explained better than what I used before" | majority in 10+ interviews |
| Authoring cost per lesson | known and trending down |

Use privacy-respecting analytics (Plausible/PostHog, no PII in URLs) plus an in-lesson feedback button.

---

## 7. MVP roadmap

Estimates assume 1–2 engineers plus AI agents and are rough. Each milestone ends with a learner-facing demo.

### M0 — Stabilize (≈1 week)
- `git init`, first commit, CI (typecheck + test + build) on every PR.
- Fix the 6 tsc errors; delete the 12 orphan modules.
- Evaluator: no-assertion tests → validation error, never pass.
- Collapse `STATE/` into one truthful status file + one roadmap (this document's §7); archive conflicting docs.
- Contrast tokens; hide placeholder routes; route-level `lazy()`.
- **Exit:** green CI, build passes, no fake passes, docs match code.

### M1 — Real execution (≈2–3 weeks)
- Web Worker runner: real TS transpile, console capture, timeout + terminate.
- Challenge runner on that worker; content CI "reference passes / starter fails".
- Minimal Playground on the same runner (single file, run, console output).
- **Exit:** every challenge result comes from real execution.

### M2 — Learning loop vertical slice (≈3–4 weeks)
- `LearnerEvent` log in IndexedDB; progress, mastery, review queue and dashboard as projections.
- 5-beat lesson template; JSON/MDX content + `content:validate`.
- Author **8–10 lessons** for *JS Runtime Foundations*: bindings & `let`/`const`/TDZ, primitives vs references, objects & the heap, call stack, scope chain, closures, hoisting, event loop, promises & microtasks (± narrowing as the TS bridge).
- Real Home and Practice (review queue) screens.
- **Exit:** a new learner can go Home → lesson 1 → … → lesson 3 → review, entirely with real data.

### M3 — Beta launch (≈2 weeks)
- Deploy as a static site; Bangla landing page; onboarding (language, experience level).
- Analytics, feedback widget, error monitoring.
- Recruit 30–50 learners (university clubs, Bangla dev communities); run 10 interviews.
- **Exit:** metrics in §6 measured; go/no-go decision for v1.

### v1 — Only if MVP metrics are hit
- Accounts + sync (`POST /events`), so progress follows the learner across devices.
- AI tutor v1: server proxy, grounded in lesson + code + trace, tiered hints, answers in the learner's language, rate-limited.
- Real JS tracer → visualization (replace modeled scenes where possible).
- TypeScript fundamentals module.

### v2+
Python in-browser via Pyodide (server sandbox only if needed), React internals, System Design Lab, then AI Engineering, institutions and credentials.

---

## 8. Working method (agent-driven development)

The `.agent/` operating system (AGENT.md, skills, ADRs, DoD) is a real asset. Tighten it:

1. **Git + small PRs per task.** One task → one branch → one PR → CI green → merge. Never let an agent work in an unversioned tree.
2. **Enforce the Definition of Done in CI, not prose.** typecheck, tests, build, `content:validate`, token lint (no raw hex), i18n lint (no JSX string literals), bundle-size budget. If CI can't check it, it's a suggestion.
3. **One source of truth for status.** A single `STATE/STATUS.md` updated in the same PR as the code; delete the overlapping GOAL/NEXT/CURRENT/ROADMAP split or generate them.
4. **"Docs vs code" check at the start of every agent task.** AGENT.md already says to log conflicts — make it a checklist item in the PR template.
5. **Shrink the always-loaded docs.** ~2.5k lines of `.agent` markdown describe a 15-phase future; agents build toward what they read. Move long-term vision into `VISION.md` and keep the agent context focused on the current milestone.
6. **Content ops as a workflow:** Bangla author draft → technical review (code/trace correctness) → language review (natural Bangla) → validator → publish. Track hours per lesson.
7. **Weekly learner demo + 2 user conversations per week** from M2 onward. Features that don't change a learner metric wait.
