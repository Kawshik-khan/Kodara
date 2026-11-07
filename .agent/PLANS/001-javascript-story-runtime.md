# PLAN 001 — JavaScript Story Runtime (MVP)

Status: **Active** · Created: 2026-10-25 · Owner: principal agent + product owner
Decision records: [ADR-005](../DECISIONS/005-javascript-first-local-first-mvp.md), [ADR-006](../DECISIONS/006-story-mode-two-skins.md)

> **বাংলায় এক লাইনে:** প্রথমে শুধু JavaScript। প্রতিটা পাঠ শুরু হবে একটা গল্প দিয়ে (মন্টু মামার চায়ের দোকান), তারপর একই কোড আসল ইঞ্জিনে চলবে আর ধাপে ধাপে দেখা যাবে, শেষে শিক্ষার্থী নিজে অনুমান করবে, ভাঙবে আর ঠিক করবে। ব্যাকএন্ড এখন না — আগে ৩০–৫০ জন আসল শিক্ষার্থী দিয়ে যাচাই।

---

## 1. Why this plan exists

The 2026-10-16 principal review found that Kodara has a strong thesis but too much breadth: 5 tracks and 15 phases are planned, yet 2 lessons exist. All visualizations are hand-authored, so learners cannot watch *their own* code run. And some features look real but are simulated (for example, challenge tests that pass without running).

This plan narrows the product to **one language (JavaScript), one learner promise, and one complete loop**. It ships that to real learners before building a backend, auth, an AI tutor or other tracks.

**Learner promise (bn):** “গল্পে বোঝো, ইঞ্জিনে দেখো, নিজে ভেঙে শেখো।”
**Learner promise (en):** “Understand it as a story, see it in the engine, learn it by breaking it.”

**Why JavaScript first:**
- It runs natively in the browser, so real execution needs no server.
- It's the foundation for the TypeScript and React tracks.
- Its runtime concepts (stack, heap, closures, event loop) are the ones learners find hardest and least visible.
- It's the most used language among Bangladeshi web developers.

---

## 2. Current reality (verified 2026-10-25)

| Area | State |
|---|---|
| Backend / API | **None.** No server code, no API routes, no env files. |
| Database | **None.** No Postgres, Supabase, Prisma, SQL or Redis. |
| Persistence | Browser `localStorage` only, via three repositories: `features/lessons/services/progressRepository.ts`, `features/progress/repositories/ProgressRepository.ts`, `features/assessment/repositories/LocalAttemptRepository.ts`. They are interface-based, so a remote implementation can be swapped in later. |
| Dashboard data | Mock fixture (`features/dashboard/api/dashboard.ts`). |
| Code execution | `new Function` on the main thread, with regex type-stripping. **Unsafe and inaccurate** (review P0-2). |
| Challenge evaluator | Test cases without `testFunctionCode` auto-pass (review P0-1). |
| Visualizations | 5, all hand-authored `VisualizationDefinition`s. There is no trace generator. |
| Build | Typecheck and build pass; 68/68 tests (fixed 2026-10-25). Main bundle is 1.24 MB (not code-split). |
| Version control | **None** (not a git repository). |
| Docs | `ARCHITECTURE.md`, `ROADMAP.md` and several skills describe api/worker/Postgres/Redis/Zustand/Monaco/pnpm/ESLint, none of which exist. ADR-005 marks these as *target* architecture, not current. |

A design prototype of the target experience exists as a Claude Design canvas ("Kodara — Hardest Lesson Demo"). It has two artboards: a detailed Event Loop lesson and a simple Story Mode version (মন্টু মামার চায়ের দোকান).

---

## 3. The product idea: one trace, two skins

Every lesson has **three doors**, and all three are driven by **one real execution trace**:

```
            ┌──────────── same code ────────────┐
            ▼                                   │
   Trace Engine (Web Worker, real JS) ──► TraceEvent[] (ADR-003)
            │
            ▼
   Runtime reducer (pure) ──► RuntimeState per step
            │
     ┌──────┴───────────────┐
     ▼                      ▼
 Story skin             Engine skin
 (মন্টু মামার দোকান)     (Call Stack · Heap · Queues · Console)
     │                      │
     └──────► Play door: Predict → Break → Fix → Recap
```

1. **গল্প (Story):** 6–10 short pages in a single consistent story world. Simple words, big text, one event per page. Anyone can follow it.
2. **ইঞ্জিন (Engine):** the same steps with real technical names, such as stack frames, heap objects, microtask queue and console.
3. **খেলা (Play):** predict before reveal, break one line, fix the bug, and verify with a real run.

A learner can **toggle Story ⇄ Engine at any step**, and the step stays the same. That one interaction teaches the mapping "মামার চুলা = Call Stack" better than any glossary.

**Correctness rule (from AGENT.md §6):** the story skin never invents state. Each story page binds to trace steps and declares **story assertions**, e.g. `expect: { micro: ["C"], macro: ["B"] }`. Content validation fails if the real trace disagrees. The story stays a *view* of the truth, not a separate fiction.

---

## 4. The story world (single source of truth)

All JavaScript lessons share **one cast and one place**, so learners build on familiar pictures. Store it in `src/content/story-world/javascript.ts` (bilingual). Lessons reference characters by id and never redefine them.

| Story element (bn) | JS concept | Used from lesson |
|---|---|---|
| মন্টু মামা — একবারে একটা কাজ | JS engine, single thread | 1 |
| বয়াম আর লেবেল | variable binding → value | 1 |
| গুদামঘর, নম্বর দেওয়া তাক | heap, memory address | 2 |
| চিরকুটে তাকের নম্বর | reference | 2 |
| চুলায় একটার ওপর একটা হাঁড়ি | call stack frames | 3 |
| ঘরের ভেতর-বাইরে, পাশের ঘরে খোঁজা | lexical scope, scope chain | 4 |
| সকালের হাজিরা খাতা | hoisting, TDZ | 5 |
| ডেলিভারি বয় রাজুর পোঁটলা | closure | 6 |
| “কে ডাকছে?” | `this` binding | 7 |
| পাশের দোকানের ছেলে (টাইমার) | Web APIs, `setTimeout` | 8 |
| জরুরি খাতা | microtask queue (Promise) | 9 |
| সাধারণ লাইন | macrotask queue | 8–9 |
| ম্যানেজারের নিয়ম | event loop | 9 |
| আধা-বানানো অর্ডার | `async`/`await` suspension | 10 |
| সিটি কর্পোরেশনের ময়লার গাড়ি | garbage collection | 2 (bonus) |

**Visual rules:**
- Customers are colored tokens that keep the same color in both skins: slate = sync, blue = microtask, amber = macrotask.
- Characters are simple inline SVG components (`features/story/characters/`), never stock art or emoji.
- Motion happens only when state changes, and every animation respects `prefers-reduced-motion`.

---

## 5. Curriculum: "JavaScript রানটাইম, গল্পে গল্পে" (10 lessons + capstone)

| # | Lesson (bn) | Concepts | Break-It scenario |
|---|---|---|---|
| 1 | বয়াম আর লেবেল | `let`/`const`, values, reassignment | `const` reassignment error |
| 2 | গুদামঘর আর চিরকুট | primitives vs references, heap, copying | Shared-object mutation bug |
| 3 | হাঁড়ির ওপর হাঁড়ি | functions, call stack, return | Infinite recursion → stack overflow (worker-contained) |
| 4 | ঘরের ভেতর, ঘরের বাইরে | lexical scope, lookup, shadowing | Shadowed variable reads the wrong value |
| 5 | সকালের হাজিরা খাতা | hoisting, TDZ, `var` vs `let` | TDZ ReferenceError |
| 6 | রাজুর পোঁটলা | closures | `var` in a loop: every callback logs 3 |
| 7 | কে ডাকছে? | `this`, call-site rules, arrow functions | Lost `this` in a callback |
| 8 | পাশের দোকানের ছেলে | callbacks, Web APIs, `setTimeout`, macrotasks | "setTimeout 0 runs now" misconception |
| 9 | মামার কথা দেওয়া | Promise, `.then`, microtasks, event loop rule | Promise vs timeout ordering |
| 10 | আধা-বানানো অর্ডার | `async`/`await`, the full event loop (the hardest lesson) | Missing `await` → unhandled order |
| ★ | Capstone: নিজের ইভেন্ট লুপ বানাও | Build a 60-line event loop simulator in JS and watch your own loop in the engine skin | — |

Each lesson follows the LESSON-SPEC 16 steps, grouped into the three doors:
- **Story:** Context, Why, Mental Model.
- **Engine:** Theory, Example, Visualize, Execute, Inspect.
- **Play:** Break It, Debug, Practice, Challenge, Verify, Recap, Project Connection.

Bug Detective cases (#01–#10) reuse the same engine as standalone mysteries.

---

## 6. Technical design

### 6.1 Trace Engine (JavaScript, client-side)

Location: `src/features/execution/` (new slice).

```
execution/
  worker/traceWorker.ts         — runs inside a dedicated Web Worker
  instrument/instrument.ts      — acorn parse → AST rewrite → astring codegen
  instrument/runtimeHooks.ts    — __k.* hook implementations (in worker)
  protocol/traceEvents.ts       — ADR-003 TraceEvent types (shared)
  reducer/runtimeReducer.ts     — TraceEvent[] → RuntimeState[] (pure)
  client/executionClient.ts     — main-thread API: run(code) → Promise<TraceResult>
  supportedSubset.ts            — feature detection + friendly refusal
```

**Approach: instrument, then run natively.** We don't write an interpreter. The real engine decides the execution order, so the order is always truthful. We record what happens:

| Construct | Instrumentation | TraceEvent |
|---|---|---|
| Declarations / assignments | `__k.bind(scopeId, "count", value)` | `variable.create`, `variable.assign` |
| Object / array literals, `new` | `__k.obj(siteId, {...})`, with ids kept in a WeakMap | `object.create`, `reference.assign` |
| Function entry / exit | prologue `__k.enter(fnId, args)` plus `try/finally __k.exit(fnId, ret)` | `function.call`, `function.return`, `scope.enter/exit` |
| Statements | `__k.line(n)` before each statement | `line.execute` |
| `setTimeout`, `queueMicrotask`, `Promise.prototype.then` | shimmed globals that emit an event, then call the real API | `task.schedule`, `microtask.enqueue`, `task.run` |
| `await x` | `await __k.awaitStart(id, x)` … `__k.awaitResume(id)` | `async.suspend`, `async.resume` |
| `console.log` | captured | `console.output` |
| Throw | caught at the top level | `exception.thrown` |

**Safety (replaces the current `new Function` runner):**
- The code runs only in a dedicated Web Worker. There's no DOM, `localStorage` or cookie access, and `fetch`, `XMLHttpRequest`, `importScripts` and `WebSocket` are deleted before user code runs.
- The main thread enforces a hard wall-clock limit (2 s) with `worker.terminate()`.
- An event budget (5,000 events) and recursion depth guard stop runaway code with a friendly message: "মামা হাঁপিয়ে গেছেন — কোডটা থামছে না!"
- A fresh worker is used per run, with no shared state.
- The `supportedSubset` check refuses constructs we can't trace yet (e.g. generators, `with`, `eval`, classes in v1) and offers "run only" mode.

**Dependencies (lazy-loaded with the engine chunk):** `acorn`, `acorn-walk`, `astring`. `sucrase` (for TS later) is deferred until the TypeScript track. The editor is CodeMirror 6, lazy-loaded, not Monaco, to stay light on mobile.

### 6.2 Correctness strategy: differential testing

Golden corpus: `src/features/execution/__corpus__/*.js`, 40+ programs covering every lesson plus known edge cases.

For each program, Vitest:
1. runs it in **plain Node** and captures `console.log` order (the reference truth);
2. runs it through **instrument → run → trace** and extracts `console.output` order;
3. asserts they're identical, and snapshot-tests the RuntimeState at key steps.

If the instrumentation ever changes semantics, the test fails. This is how we keep AGENT.md's "never fabricate traces" rule while still producing them automatically.

### 6.3 RuntimeState and the two skins

```ts
interface RuntimeState {
  step: number; line: number | null;
  stack: Frame[];                         // bottom → top
  scopes: Record<ScopeId, Binding[]>;
  heap: Record<ObjectId, HeapObject>;
  webApis: PendingTimer[];
  microtasks: QueuedTask[]; macrotasks: QueuedTask[];
  console: ConsoleLine[];
  phase: "sync" | "microtasks" | "macrotask" | "done";
}
```

- **Engine skin:** an adapter `runtimeStateToScene()` produces the existing `Scene` model, so the current renderer, playback, keyboard controls and inspector are reused unchanged.
- **Story skin:** `features/story/StoryStage.tsx` renders the same `RuntimeState` with story-world components (stall, stove, order books, warehouse, chits).
- The existing hand-authored visualizations stay as is, labeled "modeled". New lessons use generated traces only.

### 6.4 Story lesson content model

New block type: `story` (added to the `LessonBlock` union).

```ts
interface StoryPage {
  id: string;
  titleBn: string; titleEn: string;
  textBn: string;  textEn: string;          // ≤ 60 words, one idea
  speaker?: CharacterId; sayBn?: string; sayEn?: string;
  atStep: number | { event: TraceEventMatcher };   // binds to the trace
  highlight?: StoryZone;                    // stove | urgent | regular | warehouse | ...
  expect?: StoryAssertion;                  // validated against RuntimeState
  codeNoteBn: string; codeNoteEn: string;   // the "কোডের ভাষায়" line
}
interface StoryBlock { type: "story"; id: string; world: "javascript"; code: string; pages: StoryPage[]; predict?: PredictSpec }
```

Content lives in `src/content/lessons/javascript/<slug>/` as `lesson.ts`, `story.ts` and `challenges.ts`.

### 6.5 Interactions (the "Play" door)

| Interaction | How it works | Evidence emitted |
|---|---|---|
| **Predict the order** | Tap tokens in order; revealed after the trace | `prediction.order` (correct?, misconception id) |
| **Where does it go?** | Drag the customer token to stove / urgent book / regular line | `prediction.placement` |
| **Predict the value** | "What does `count` hold at step 7?" | `prediction.value` |
| **Fork the timeline** (Break It) | Edit one line → re-run → two timelines side by side, with the first diverging step highlighted | `break.explored` |
| **Fix it** | Edit the code; a real worker run plus assertions verify the fix | `challenge.attempt` (real pass/fail only) |
| **Bug Detective** | Mystery framing, clues from the trace, choose the culprit line | `debug.diagnosis` |
| **চা-বিরতি review** | 3 cards per day from the existing spaced-review engine | `review.attempt` |
| **Share card** | Client-side PNG ("আমি ঠিক অনুমান করেছি!" + trace thumbnail) for Facebook groups | `share.created` (local count only) |

Misconception ids (e.g. `js.timeout-zero-is-immediate`, `js.await-blocks-program`) are a shared enum. The mastery engine consumes them, and the tutor uses them later.

### 6.6 Persistence and the backend decision

- MVP: keep the existing `localStorage` repositories. Add **export/import progress as JSON** so a learner never loses work when switching devices.
- **Backend gate:** build a backend only after the pilot (M6) shows retention. When it's justified:
  - Managed Postgres + auth (Supabase or Neon are both viable; decide in a new ADR).
  - Tables: `profiles`, `lesson_progress`, `evidence_events`, `predictions`, `review_items`.
  - A `RemoteProgressRepository` behind the existing interfaces, with local-first sync.
  - Learner code still runs in the browser worker for JS; a server sandbox is needed only for Python or other non-browser languages.

---

## 7. Milestones

Every milestone ends with typecheck, tests and build all passing, both locales verified, and `.agent/STATE/` updated.

### M0 — Stabilize (2–3 days)
- [ ] `git init`, first commit, `.gitignore` (node_modules, dist).
- [ ] Evaluator: test cases without real test code return `status: "not_verified"` (shown honestly in the UI), never `"passed"`.
- [ ] Remove the 12 orphaned v1 module files after confirming no imports (review P1-2).
- [ ] Route-level `React.lazy` code splitting. Target: initial JS < 350 KB gzip.
- [ ] Truthful `.agent/STATE/*` (done 2026-10-25).
- **Accept:** clean build, 68+ tests pass, no auto-pass path remains (a test proves it).

### M1 — Trace Engine v1: synchronous JS (≈ 2 weeks)
- [ ] `execution/` slice: worker, instrumentation for variables, functions, objects, scope, console and exceptions.
- [ ] Runtime reducer and `runtimeStateToScene` adapter; the existing renderer shows a generated trace.
- [ ] Safety: timeout, event budget, deleted network globals, fresh worker per run. Tests for an infinite loop, deep recursion and `fetch` attempts.
- [ ] Differential test corpus: ≥ 20 sync programs.
- [ ] Replace `TypeScriptChallengeEvaluator`'s `new Function` path with the worker client.
- **Accept:** the learner types any supported snippet → sees a real step-through. An infinite loop never freezes the tab.

### M2 — Async in the engine (≈ 1 week)
- [ ] Shims for `setTimeout`, `setInterval` (bounded), `queueMicrotask`, Promise `then/catch/finally`; `await` instrumentation.
- [ ] Event-loop phases in `RuntimeState`; queue visualization in the engine skin.
- [ ] Corpus: ≥ 20 async programs, including `A D G C E F B`, with output order identical to Node.
- **Accept:** the Event Loop demo lesson runs from a generated trace, not hand-authored steps.

### M3 — Story Player and the two skins (≈ 1.5 weeks)
- [ ] `features/story/`: StoryPlayer (pages, progress, prev/next, keyboard), StoryStage, character SVG components, `story-world/javascript.ts`.
- [ ] `story` lesson block, page ↔ step binding, and the Story ⇄ Engine toggle that keeps the step.
- [ ] **Story assertion validator** in the Vitest content suite: fails if any `expect` disagrees with the real trace.
- [ ] i18n keys for all UI chrome (bn + en), screen-reader text for every stage change (`aria-live`).
- **Accept:** Lesson 9 (মামার কথা দেওয়া) is playable end-to-end in both skins and both languages, with assertions green.

### M4 — Play door (≈ 1 week)
- [ ] Predict order / placement / value components with misconception mapping.
- [ ] Fork the Timeline (two runs, divergence detection on the event streams).
- [ ] Fix-it challenges verified by real runs; Bug Detective case template.
- [ ] Evidence events wired into the existing `features/progress` engines, and the Progress page made real (it's a placeholder today).
- **Accept:** every evidence event comes from a real interaction; nothing is simulated.

### M5 — Content: 10 lessons (≈ 3–4 weeks, can overlap M4)
- [ ] One lesson per 2–3 days using the `story-mode` skill. Each lesson: story (6–10 pages), engine walkthrough, 2+ predictions, 1 Break-It, 1 Fix-it, recap.
- [ ] Native Bangla review pass for every lesson (no machine-translated tone).
- [ ] Capstone and 5 Bug Detective cases.
- **Accept:** all lessons pass content validation, including story assertions and the differential corpus.

### M6 — Pilot with 30–50 learners (≈ 2 weeks)
- [ ] PWA (offline after first load); low-data mode (no animation autoplay).
- [ ] Share cards; progress export/import.
- [ ] Privacy-respecting analytics (cookieless, no PII) or a structured feedback form; decide in an ADR.
- [ ] Recruit through Bangladeshi developer communities and university clubs.
- **Decision gate:** proceed to backend/auth (roadmap Phase 1–2) **only if** the north-star metric meets the target below.

---

## 8. Metrics

- **North star:** % of learners who complete one full *Story → Engine → Predict → Break → Fix* loop **and** return within 7 days. Pilot target: ≥ 35%.
- **Learning signal:** prediction accuracy on first attempt vs on review attempts. Target: +30 percentage points after the lesson.
- **Quality signal:** % of story pages rated "বুঝেছি" (one-tap feedback per lesson). Target: ≥ 85%.
- **Health:** zero tab freezes from learner code; LCP < 2.5 s on a mid-range Android over 4G.

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Instrumentation changes program semantics | Differential tests against Node on every commit; the supported-subset gate; "run only" fallback |
| The story drifts away from the truth | Story assertions validated against real traces; a page cannot ship without `atStep` |
| Bundle bloat on low-end phones | Lazy engine, editor and story chunks; CodeMirror over Monaco; a budget check in CI once git exists |
| Bangla tone feels translated | Native reviewer sign-off per lesson; story-mode skill tone rules |
| Scope creep into other tracks | ADR-005 freezes Python, React, System Design and AI tracks until after the M6 gate |
| Metaphor overload | One world, one cast; a new metaphor is allowed only if no existing character fits (recorded in the story world file) |

---

## 10. Out of scope until the M6 gate

Backend API, database, auth, Redis, server sandbox, AI tutor (the static hint ladder stays), Python / React / System Design / AI Engineering tracks, the TypeScript type-checker visualizer, and payments.
