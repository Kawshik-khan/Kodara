# Kodara

> **Understand how software works.**

**Kodara** is a bilingual-native (`bn` / `en`), local-first interactive software-engineering learning platform. Instead of passive video watching or syntax memorization, Kodara teaches deep engineering mental models through step-by-step execution traces, interactive state-machine visualizations, parametric mathematical charts, failure-diagnosis labs, and source-grounded practice.

---

## Key Capabilities

- **Bilingual-Native Architecture (`bn` + `en`)**: Bangla (`bn`) is the default first-class instructional language alongside English (`en`), keeping programming keywords, identifiers, and industry-standard terminology in English paired with natural Bangla technical explanations.
- **Recorded CPython Execution Traces (`features/code-trace/`)**: Deterministic line-by-line traces recorded via `sys.settrace` (`courses/harness-playbook/tools/record_trace.py`), paired with bilingual step explanations (`what`, `why`, `without it`, and source references) and live object/frame inspection.
- **Interactive State-Machine & Memory Visualizations (`features/visualization/`)**: Step-driven visual state machines (`VisualizationDefinition`) with scene diffs, keyboard-scoped playback controls, and explicit `Modeled` / `মডেল করা` honesty labels whenever a flow is hand-authored rather than trace-generated.
- **Parametric Engineering Charts & ManimGL Scenes (`features/charts/`)**: Interactive mathematical models (`ChartDefinition` + `ParametricChart`) with live parameter toggles, comparative bar breakdowns, and embedded ManimGL (`manimlib`) scene scripts.
- **Multi-Signal Assessment & Mastery (`features/assessment/`, `features/progress/`)**: Multiple-choice and code-reasoning practice questions, challenge evaluators, spaced-repetition review scheduling, and monotonic UUIDv7 event tracking persisted in browser `localStorage`.

---

## Repository Structure

```text
Kodara/
├── src/
│   ├── app/                      # Router (route-level React.lazy splitting), shell, layout
│   ├── components/               # Design-system primitives (White + Orange + Technical Grid)
│   ├── content/
│   │   ├── courses/
│   │   │   └── harness-playbook/ # The Harness Engineering Playbook course (Ch 00–05, 20 authored)
│   │   ├── curriculum/           # Track & module registries
│   │   └── lessons/              # TypeScript track lessons (variables, narrowing)
│   ├── features/
│   │   ├── assessment/           # Practice renderers, challenge runner, validators
│   │   ├── charts/               # ParametricChart component & AI Engineering chart models
│   │   ├── code-trace/           # Recorded CPython trace player & template resolver
│   │   ├── dashboard/            # Bento-grid learner dashboard
│   │   ├── lessons/              # LessonPage & 12+ structured lesson block renderers
│   │   ├── progress/             # Mastery computation, spaced repetition, recommendations
│   │   ├── tracks/               # TrackOverviewPage & curriculum progression
│   │   └── visualization/        # Scene graph, diff engine, playback controller, visualizers
│   ├── i18n/                     # Bilingual localization (bn default, en)
│   ├── lib/                      # Monotonic UUIDv7 generator & core utilities
│   └── test/                     # Vitest + React Testing Library test suites
├── courses/
│   └── harness-playbook/         # Runnable Python 3.11+ stdlib implementations, tests & ManimGL scenes
│       ├── harness/              # Chapter modules (ch00–ch05, ch20) + trace_scenarios.py
│       ├── scenes/               # ManimGL scene scripts + manimlib.pyi type stubs
│       ├── tests/                # Python unittest suites (including expectedFailure exercises)
│       └── tools/                # Deterministic CPython trace recorder (record_trace.py)
└── .agent/                       # Architecture specs, ADRs, skills, and repository state tracking
```

---

## Authored Curriculum Highlights

### 1. The Harness Engineering Playbook (`ai-engineering` track)
A deep-dive interactive course built from *The Harness Engineering Playbook* (Cohorte Field Guide v1.0, 640 pp.). Every authored chapter includes a four-part bilingual lesson (**1. Theory**, **2. Visual**, **3. Practical**, **4. Q&A + FAQ**), a modeled flow visualization, a parametric mathematical chart, a ManimGL scene, runnable stdlib-only Python code, unit tests, and a verified CPython execution trace:

| Part | Chapter | Topic | Python Implementation & Recorded Trace | Interactive Visuals & Charts |
| :--- | :---: | :--- | :--- | :--- |
| **Part I · Foundations** | **00** | *Why Harness Engineering Matters* (pp. 16–29) | `harness/ch00/control_loop.py` | Control-loop gates + Verification Budget Chart |
| **Part I · Foundations** | **01** | *Where Operational Truth Lives* (pp. 30–54) | `harness/ch01/event_log.py` | Hash-chained event log resume + Silent Failure Chart |
| **Part I · Foundations** | **02** | *From Tool Calls to Safe Actions* (pp. 55–74) | `harness/ch02/aci_refund.py` | 6-layer ACI boundary + Duplicate Refunds Chart |
| **Part II · Runtime** | **03** | *Building the Right Briefing* (pp. 76–94) | `harness/ch03/context_compiler.py` | 5-stage Context Compiler + Post-Filter Recall Chart |
| **Part II · Runtime** | **04** | *Knowing When to Continue, Wait, or Stop* (pp. 95–111) | `harness/ch04/budgeted_controller.py` | 8-mode Budgeted Controller + Retry Amplification Chart |
| **Part II · Runtime** | **05** | *Testing That Earns Trust* (pp. 112–134) | `harness/ch05/qualification_gate.py` | 6-stage Evaluation Control Plane + $\text{pass}@k$ vs $\text{pass}^k$ Chart |
| **Part II · Runtime** | **20** | *Turning Procedures into Reliable Agent Skills* (pp. 135–152) | `harness/ch20/skill_linker.py` | 6-stage Skill Governance Lifecycle + Skill Activation Precision Chart |

### 2. TypeScript Fundamentals (`typescript` track)
- **Variables & Memory Model** (`typescript.variables.basic`)
- **Type Narrowing & Control-Flow Analysis** (`typescript.type-narrowing`)

---

## Getting Started

### Prerequisites
- **Node.js** 20+ and **npm**
- **Python** 3.11+ (stdlib only; used for running `courses/harness-playbook` tests and recording execution traces)

### Installation & Development Server

```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

### Verification & Testing

Every change is verified across TypeScript type checking, Vitest unit/integration suites, Python `unittest` suites, and the production Vite bundle:

```bash
# 1. TypeScript static typecheck (0 errors required)
npm run typecheck

# 2. Frontend unit & integration tests (Vitest + React Testing Library)
npm test

# 3. Production bundle verification (with route-level code splitting)
npm run build

# 4. Python course implementation & exercise tests (from courses/harness-playbook/)
cd courses/harness-playbook
python -m unittest -v
```

> **Trace Integrity Check**: `src/test/codeTrace/explain.test.ts` automatically verifies that:
> 1. Every registered trace embeds the exact, unmodified Python source file from `courses/harness-playbook/harness/chNN/`.
> 2. Every recorded step (`line`, `return`, `exception`) across every scenario has a bilingual explanation (`what` + `why`) with zero unresolved `{local.*}` or `{object.*}` placeholders.

---

## ManimGL Scenes & Type Stubs

The `courses/harness-playbook/scenes/` directory contains ManimGL (`manimgl`) scripts corresponding to each chapter's architecture flow and parametric chart formula.
- In the web application, Vite imports these `.py` scripts as raw text (`?raw`) so learners can inspect and copy the exact scene code.
- A local PEP 484 type-stub file (`courses/harness-playbook/scenes/manimlib.pyi`) provides full IDE autocompletion and static type checking for `from manimlib import *` without requiring `manimgl` or OpenGL/FFmpeg to be installed in your global Python interpreter.
- To render scenes to `.mp4` video locally, install `manimgl` and FFmpeg in a Python 3.11/3.12 virtual environment and run:
  ```bash
  cd courses/harness-playbook/scenes
  manimgl ch04_budgeted_controller.py BudgetedControllerScene -w
  ```

---

## Architectural & Engineering Principles

1. **Honesty in Simulation**: Recorded traces are produced by executing real Python code under `sys.settrace`. Hand-authored state-machine flows and parametric charts are explicitly badged as `Modeled` / `মডেল করা`.
2. **Local-First & Zero-Secret Client**: The application runs entirely in the browser with `localStorage` repositories (`progressRepository`, `ProgressRepository`, `LocalAttemptRepository`) and route-level `React.lazy` code splitting.
3. **Design System**: Canonical **White + Orange + Technical Grid** visual language (`#FAF8F5` canvas, `#FF5E1E` primary accent, `#1A1A1A` ink) shared across React components, SVG visualizations, and ManimGL palettes (`kodara_palette.py`).
