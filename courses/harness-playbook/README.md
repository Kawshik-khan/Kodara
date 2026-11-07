# The Harness Engineering Playbook — Course Code & Trace Pipeline

Runnable Python implementations, deterministic trace recorder, unit tests, and ManimGL animation scenes for **The Harness Engineering Playbook** course inside Kodara's AI Engineering track (`ADR-008`).

Everything in `harness/`, `tests/`, and `tools/` runs with **Python 3.11+ and the standard library only**.

---

## Directory Layout

| Path | Purpose |
| :--- | :--- |
| `harness/chNN/` | Runnable stdlib Python implementation (`<topic>.py`) + `trace_scenarios.py` defining deterministic scenarios for the trace recorder |
| `tests/test_chNN.py` | `unittest` suite verifying every chapter invariant plus 1 `@unittest.expectedFailure` learner exercise (`ExerciseTest`) per chapter |
| `tools/record_trace.py` | Executes a chapter's `trace_scenarios.py` under `sys.settrace` and writes the compact JSON trace consumed by the Kodara UI |
| `scenes/chNN_*.py` | ManimGL (`manimgl`) scenes for each chapter's architecture flow and parametric chart formula |
| `scenes/kodara_palette.py` | Kodara design tokens (`#FAF8F5` canvas, `#FF5E1E` accent, `#1A1A1A` ink, semantic status colors) for ManimGL |
| `scenes/manimlib.pyi` | Local PEP 484 type stub for `manimlib` so IDEs and language servers (Pyright / Pylance) resolve `from manimlib import *` without requiring `manimgl` installed globally |

---

## Authored Chapters

| Chapter | Book Pages | Module | Recorded Trace Scenarios | Exercise (`@expectedFailure`) |
| :---: | :---: | :--- | :--- | :--- |
| **00** | pp. 16–29 | `harness/ch00/control_loop.py` | `verified`, `premature`, `payment` | `test_tool_crash_ends_as_failed_recoverably` |
| **01** | pp. 30–54 | `harness/ch01/event_log.py` | `crash`, `transcript`, `log`, `edited` | `test_escalated_effect_gets_its_own_phase_and_owner` |
| **02** | pp. 55–74 | `harness/ch02/aci_refund.py` | `ack`, `limit`, `naive` | `test_stale_case_version_raises_version_conflict_before_dispatch` |
| **03** | pp. 76–94 | `harness/ch03/context_compiler.py` | `blocked`, `ready`, `stale`, `naive` | `test_exceeding_token_budget_after_reserves_blocks_the_build` |
| **04** | pp. 95–111 | `harness/ch04/budgeted_controller.py` | `governed`, `unresolved`, `cycle`, `reserve` | `test_delegation_deducts_from_parent_and_protects_reserve` |
| **05** | pp. 112–134 | `harness/ch05/qualification_gate.py` | `vetoed`, `missing`, `trajectory`, `approved` | `test_case_qualification_requires_ref_pass_bad_fail_and_vulnerable_veto` |
| **20** | pp. 135–152 | `harness/ch20/skill_linker.py` | `admitted`, `excluded`, `revoked`, `untested` | `test_self_authored_or_overactivating_candidate_cannot_publish` |

---

## Commands

### 1. Run All Python Unit Tests

From `courses/harness-playbook/`:

```bash
python -m unittest -v
```

Expected output: `Ran 45 tests ... OK (expected failures=7)`.

### 2. Record or Update a Chapter Trace

Whenever you modify `harness/chNN/<topic>.py` or `harness/chNN/trace_scenarios.py`, re-record its trace JSON so the embedded source and line numbers stay in sync:

```bash
python -m tools.record_trace harness.ch00.trace_scenarios ../../src/content/courses/harness-playbook/ch00/controlLoop.trace.json
python -m tools.record_trace harness.ch01.trace_scenarios ../../src/content/courses/harness-playbook/ch01/eventLog.trace.json
python -m tools.record_trace harness.ch02.trace_scenarios ../../src/content/courses/harness-playbook/ch02/aciRefund.trace.json
python -m tools.record_trace harness.ch03.trace_scenarios ../../src/content/courses/harness-playbook/ch03/contextCompiler.trace.json
python -m tools.record_trace harness.ch04.trace_scenarios ../../src/content/courses/harness-playbook/ch04/budgetedController.trace.json
python -m tools.record_trace harness.ch05.trace_scenarios ../../src/content/courses/harness-playbook/ch05/qualificationGate.trace.json
python -m tools.record_trace harness.ch20.trace_scenarios ../../src/content/courses/harness-playbook/ch20/skillLinker.trace.json
```

> **Important**: `npm test` (`src/test/codeTrace/explain.test.ts`) fails if a `.trace.json` file's embedded source diverges from `harness/chNN/<topic>.py`, or if any traced line/return/exception key lacks a bilingual `what` and `why` note in `src/content/courses/harness-playbook/chNN/<topic>.trace.ts`.

### 3. Render a ManimGL Scene (Optional)

The web app displays the `.py` files in `scenes/` as source code tabs (`?raw`) and provides interactive SVG counterparts in the browser, so **installing `manimgl` is not required to build or test Kodara**. Meanwhile, `scenes/manimlib.pyi` provides static type definitions so your editor does not report `Cannot find module manimlib`.

If you want to render the `.mp4` animations locally:

1. Create a Python 3.11 or 3.12 virtual environment (recommended on Windows, as prebuilt wheels for `moderngl` / `mapbox-earcut` often lag on Python 3.14) and ensure `ffmpeg` is on your `PATH`:
   ```bash
   uv venv --python 3.12 .venv
   .venv\Scripts\activate
   pip install manimgl
   ```
2. Render any scene from `courses/harness-playbook/scenes/`:
   ```bash
   cd scenes
   SCENARIO=ack_lost manimgl ch02_aci_refund.py AciRefund -w
   manimgl ch04_budgeted_controller.py BudgetedControllerScene -w
   manimgl ch05_evaluation_control_plane.py EvaluationControlPlaneScene -w
   Q=0.30 F=0.08 manimgl ch20_skill_activation_precision.py SkillActivationPrecisionScene -w
   ```

---

## Adding a New Chapter

1. **Read the chapter & its appendix** in *The Harness Engineering Playbook* (page ranges are listed in `src/content/courses/harness-playbook/course.ts`).
2. **Write the Python implementation & tests**:
   - Create `harness/chNN/<topic>.py` (keep it compact, ~65–85 lines, stdlib only, with 1 exercise function for the learner).
   - Create `harness/chNN/trace_scenarios.py` exporting `SOURCE` and `SCENARIOS`.
   - Create `tests/test_chNN.py` with unit tests + 1 `@unittest.expectedFailure` `ExerciseTest`.
3. **Record the CPython trace**:
   - Run `python -m tools.record_trace harness.chNN.trace_scenarios ../../src/content/courses/harness-playbook/chNN/<topic>.trace.json`.
4. **Author the bilingual trace notes**:
   - Create `src/content/courses/harness-playbook/chNN/<topic>.trace.ts` with `what`, `why`, `without`, and `ref` notes for every traced line (`"NN"`), return (`"NN^"`), and exception (`"NN!"`).
5. **Author the ManimGL scenes, chart, and visualization**:
   - Add two scenes in `scenes/chNN_*.py`.
   - Add a `ChartDefinition` in `src/features/charts/charts/aiEngineering/` and a test in `src/test/charts/`.
   - Add a modeled `VisualizationDefinition` (`subtitleEn` starting with `"Modeled"`, `subtitleBn` starting with `"মডেল করা"`) in `src/features/visualization/visualizations/aiEngineering/`.
6. **Author the 4-section bilingual lesson & wire registries**:
   - Create `src/content/courses/harness-playbook/chNN/chNN.lesson.ts` (`1. Theory`, `2. Visual`, `3. Practical`, `4. Q&A` with practice + `faq`).
   - Register the trace, chart, visualization, and lesson in `src/features/*/core/registry.ts`, `course.ts`, and `lessons.ts`.
   - Run `python -m unittest -v`, `npm run typecheck`, `npm test`, and `npm run build`.
