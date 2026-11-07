# ADR 008: Harness Engineering Playbook Course in the AI Engineering Track

## Context
ADR-005 and AGENT.md §10 freeze every track except JavaScript until the PLAN 001 M6 gate. On 2026-10-29 the product owner explicitly asked to build a course from *The Harness Engineering Playbook* (Cohorte field guide v1.0, 21 chapters, 22 appendices) inside Kodara's AI Engineering track, with:
- theory for every chapter, in Bangla and English;
- runnable code where the book has none;
- controllable visuals (step flows, line and bar charts), with ManimGL scenes from `github.com/Kawshik-khan/manim` for rendered video;
- a line-by-line trace of the practical code;
- a Q&A section.

The design was reviewed and approved as an artifact preview before implementation.

The book contains almost no code. Kodara has no Python runtime in the browser and no server sandbox (ADR-005), so learners cannot run Python in the app yet.

## Decision
1. **Scoped exception to the track freeze.** The AI Engineering track ships this one course. Nothing else in the frozen tracks changes, and PLAN 001 keeps its priority. The placeholder "Embeddings & RAG" module data in `trackData.ts` is replaced by the course outline.
2. **Course code lives outside the SPA** in `courses/harness-playbook/`: a stdlib-only Python package (`harness/`), `unittest` tests, a trace recorder and ManimGL scenes. The app never executes Python.
3. **Traces are recorded, never hand-written.** `tools/record_trace.py` runs the exact chapter file under CPython `sys.settrace` and writes JSON into `src/content/courses/harness-playbook/`. The JSON embeds the source, and a vitest test fails if the source in the JSON drifts from the `.py` file. The player labels traces "recorded", with the Python version.
4. **Explanations are content, not code.** Each traced line gets bilingual *what / why / without it / book reference* notes in a typed content file. Notes use placeholders (`{local.to}`, `{object.op.state}`, `{detail}`) filled from the recorded step, plus generic conditions (`localPresent`, `changesNext`), so no domain logic lives in the player.
5. **New schemas.**
   - `code-trace` lesson block, backed by the `src/features/code-trace/` slice.
   - `chart` lesson block, backed by a `ChartDefinition` (parameterized series that are pure functions) in `src/features/charts/`.
   - `faq` lesson block for the chapter Q&A.

   Step flows keep using `VisualizationDefinition` and are labeled "modeled". Charts are labeled "modeled" too, with their formula shown.
6. **Keyboard scope.** `useVisualizationPlayback` accepts an optional scope element. When several step visualizers share a page, shortcuts go only to the one the learner last interacted with. Without a scope, behavior is unchanged.
7. **Manim scenes are source assets.** They import colors from `scenes/kodara_palette.py`. Rendering to video happens offline (`manimgl ... -w`) and is not part of `npm run build`.

## Alternatives Considered
- **Pyodide in a Web Worker** to run Python live: rejected for now. It is a large download and needs an ADR of its own; recorded traces give the same learning value without it.
- **Hand-authored code walkthroughs** (`code-walkthrough` block): rejected for this course, because they violate the "real trace" honesty rule.
- **A separate course app**: rejected; it would duplicate the lesson system and design system.

## Consequences
- **Positive:**
  - A reusable pipeline: any Python lesson can ship a real line-by-line trace by adding a scenarios file and notes.
  - Charts and traces are decoupled from lessons through registries, like visualizations.
- **Negative:**
  - The course will hold 23 lessons; only Chapter 02 is authored in the first pass, and the other chapters are listed as planned.
  - Adds a Python toolchain to the repo (stdlib only; ManimGL is optional and needed only to render video).

## Status
Accepted (user-approved exception to ADR-005 scope)

## Date
2026-10-29
