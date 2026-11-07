# Next Work

## Highest Priority
**PLAN 001 · M0 — Stabilize**, then **M1 — Trace Engine v1 (synchronous JavaScript)**.
Full plan: `.agent/PLANS/001-javascript-story-runtime.md`.

## Why
Every later milestone depends on two things:
- **honest evidence:** no auto-passing tests;
- **real traces:** a Web Worker engine instead of hand-authored steps.

Story Mode (M3) is only allowed to show state that a real trace produced (ADR-006).

## M0 — Stabilize (do first, small and safe)
1. `git init`, add `.gitignore` (`node_modules/`, `dist/`), first commit. Ask the user before committing.
2. `features/assessment/evaluators/TypeScriptChallengeEvaluator.ts`: a test case without `testFunctionCode` must return `"not_verified"`, never `"passed"`. Add the status to the types and UI, plus a test proving no auto-pass path exists.
3. Confirm the 12 orphaned module files have no imports, then delete them. List them in the change summary.
4. ~~Route-level `React.lazy` + `Suspense` in `src/app/router/routes.tsx`. Target initial JS < 350 KB gzip.~~ Done 2026-10-29: initial JS 92.2 KB gzip.

## M1 — Trace Engine v1 (after M0)
1. New slice `src/features/execution/`: `worker/`, `instrument/`, `protocol/`, `reducer/`, `client/`, `supportedSubset.ts` (PLAN 001 §6.1).
2. Add dependencies: `acorn`, `acorn-walk`, `astring` (engine chunk only, lazy-loaded).
3. Safety tests:
   - an infinite loop is terminated within 2 s;
   - deep recursion gives a friendly error;
   - `fetch` is unavailable inside the worker.
4. Differential corpus `src/features/execution/__corpus__/` with ≥ 20 sync programs. Console order must match plain Node.
5. A `runtimeStateToScene` adapter so the existing `VisualizationEngine` can render a generated trace.
6. Route challenge evaluation through the worker client; delete the `new Function` path.

## Dependencies
- ADR-003 (trace protocol), ADR-005 (local-first, worker execution), ADR-006 (two skins).
- Skills: `code-execution`, `visualization`, `security`, `testing`.

## Validation
- `npm run typecheck`, `npm test`, `npm run build` all pass.
- New tests cover the safety limits and the differential corpus.
- `.agent/STATE/CURRENT.md` updated with what actually changed.

## Harness Engineering Playbook course (ADR-008, runs beside PLAN 001)
Chapter 02 is the template. For each next chapter, follow `courses/harness-playbook/README.md` ("Adding a chapter"):
1. Read the chapter in the book (page ranges are in `course.ts`).
2. Write the Python and its tests, then record the trace.
3. Write notes for every traced line. `src/test/codeTrace/explain.test.ts` fails if a step has no note or no "why".
4. Author the four sections (theory, visual, practical, Q&A) in bn and en, and set `lesson` in `course.ts`.

Suggested order: Part I (`00`, `01`, `02`) and Part II (`03`, `04`, `05`, `20`) are complete. Next is Part III · Optimization (`06` "What Are We Really Optimizing?" pp. 154–175, `07` "Learning from What the System Did" pp. 176–195, `08` "Knowing Where an Improvement Still Holds" pp. 196–214).

Open items:
- Render the ManimGL scenes to video once `manimgl` and FFmpeg are installed.
- Track lesson status for this course is static ("in progress"); wire it to `progressRepository`.
- No live AI tutor; the Q&A is practice questions plus a FAQ.
- The LessonPage chunk (298.65 KB gzip with 7 chapters) holds every lesson, trace and chart, and grows about 27–30 KB gzip per chapter. Before authoring Part III (`ch06`–`ch08`), make lesson lookup async: per-lesson dynamic `import()`, with registries keyed by id and loaded on demand.
