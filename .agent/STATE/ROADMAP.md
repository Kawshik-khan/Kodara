# KODARA PRODUCT ROADMAP

This roadmap governs the multi-phase engineering trajectory of Kodara.
Statuses: `Not Started` | `Planned` | `In Progress` | `Blocked` | `Complete`

---

## ▶ Active sequence (2026-10-25, supersedes the phase order below)

Per ADR-005, execution follows [PLAN 001 — JavaScript Story Runtime](../PLANS/001-javascript-story-runtime.md):

| Step | Milestone | Status | Roughly replaces |
| :--- | :--- | :--- | :--- |
| M0 | Stabilize (git, honest evaluator, dead code, code splitting) | In Progress | Phase 0 close-out |
| M1 | Trace Engine v1, synchronous JS in a Web Worker | Planned | Phases 5 + 7 (client-side) |
| M2 | Async in the engine (Promise, timers, `await`, event loop) | Planned | Phase 7 |
| M3 | Story Player + two skins + story assertions | Planned | Phase 3 (new format) |
| M4 | Play door: predict, Fork the Timeline, fix-it, Bug Detective | Planned | Phases 8 + 9 (local) |
| M5 | 10 JavaScript lessons + capstone | Planned | Phase 4 (JS-first) |
| M6 | Pilot with 30–50 learners → **decision gate** | Planned | — |

Phases 1, 2 and 6 (backend, auth, server sandbox) and Phases 10–14 (AI tutor, other tracks) are **deferred until the M6 gate**. Phase 0 is functionally complete except for the M0 items. Its ESLint/pnpm deliverables are dropped unless a new ADR revives them.

---

## Phase 0 — Foundation
- **Objective**: Establish the core engineering repository, tooling, White + Orange design system tokens, and UI layout primitives.
- **Dependencies**: None.
- **Deliverables**:
  - Vite + React + TypeScript workspace setup.
  - Vitest testing harness and ESLint configuration.
  - CSS custom properties, technical grid background, bento grid layout.
  - Reusable primitive components (Button, Card, Input, Modal, Badge).
- **Status**: In Progress
- **Definition of Done**: Project builds cleanly (`pnpm build`), tests pass (`pnpm test`), and the design system renders verified in browser.

---

## Phase 1 — Infrastructure
- **Objective**: Establish the backend API server baseline, database migrations, and Redis caching.
- **Dependencies**: Phase 0.
- **Deliverables**:
  - Modular monolith API service (Fastify / Express with TypeScript).
  - PostgreSQL schema migrations for curriculum, users, and progress.
  - Redis connection pool for caching and job coordination.
- **Status**: Planned
- **Definition of Done**: Automated integration tests verify database connections, schema migrations, and health check endpoints.

---

## Phase 2 — Authentication & User Sessions
- **Objective**: Provide secure learner authentication, session persistence, and role-based access.
- **Dependencies**: Phase 1.
- **Deliverables**:
  - Secure session cookies / JWT authentication.
  - Registration, login, and password reset flows.
  - Guest/Anonymous learner session migration upon registration.
- **Status**: Planned
- **Definition of Done**: E2E test verifying registration, login, protected route guard, and logout.

---

## Phase 3 — Learning Engine
- **Objective**: Build the interactive lesson runner and curriculum navigation system.
- **Dependencies**: Phase 0, Phase 1.
- **Deliverables**:
  - 16-step progressive disclosure lesson orchestrator.
  - Track browser, module list, and concept prerequisite navigation.
  - Markdown/MDX theory renderer with syntax-highlighted code blocks.
- **Status**: Planned
- **Definition of Done**: Learner can navigate tracks, open modules, and advance through theory and examples smoothly.

---

## Phase 4 — TypeScript Curriculum (Vertical Slice)
- **Objective**: Author the foundational JavaScript Runtime & TypeScript Fundamentals content modules.
- **Dependencies**: Phase 3.
- **Deliverables**:
  - Module 1: Variables & Memory Model, Objects & References, Functions & Execution Context, Scope & Closures.
  - Module 2: Type Annotations, Structural Typing, Interfaces, Unions & Tuples.
  - Automated content validation suite (`pnpm content:validate`).
- **Status**: Planned
- **Definition of Done**: All seed lessons pass schema validation with 100% test coverage for code examples.

---

## Phase 5 — Interactive Playground
- **Objective**: Embed Monaco Editor with client-side TypeScript compilation and real-time execution console.
- **Dependencies**: Phase 0, Phase 3.
- **Deliverables**:
  - Lazy-loaded Monaco Editor component with custom White + Orange theme.
  - Client-side TypeScript transpilation and web-worker execution.
  - Formatted terminal output capturing stdout, stderr, and execution duration.
- **Status**: Planned
- **Definition of Done**: Learner can write TypeScript in browser, execute it, and see console output within 100ms.

---

## Phase 6 — Secure Execution Worker & Sandboxing
- **Objective**: Deploy isolated asynchronous worker daemon executing untrusted code safely.
- **Dependencies**: Phase 1, Phase 5.
- **Deliverables**:
  - Ephemeral non-root Docker/gVisor container runner.
  - Redis-backed BullMQ execution job queue.
  - Strict cgroups limits: CPU 1 core, 256MB RAM, 5s timeout, network disabled.
- **Status**: Planned
- **Definition of Done**: Security tests confirm memory bombs, infinite loops, and network requests are safely contained.

---

## Phase 7 — Interactive Visualization Engine
- **Objective**: Build the step-driven visual state machine for memory models, call stacks, and scope chains.
- **Dependencies**: Phase 5, Phase 6.
- **Deliverables**:
  - Normalized `TraceEvent` consumer and step timeline generator.
  - Stack Frame, Heap Object, and Pointer SVG components.
  - Timeline scrubber, playback controls, and keyboard navigation (`j`, `k`, `Space`).
- **Status**: Planned
- **Definition of Done**: Stepping through code dynamically updates stack frames and heap object reference arrows accurately.

---

## Phase 8 — Challenges & "Break-It" Mode
- **Objective**: Implement interactive debugging challenges and failure diagnostic labs.
- **Dependencies**: Phase 4, Phase 7.
- **Deliverables**:
  - "Break It" injected failure scenario runner.
  - Output prediction and trace reasoning challenge types.
  - Test runner verifying learner bug fixes against expected outcomes.
- **Status**: Planned
- **Definition of Done**: Learners can load a broken scenario, diagnose the bug using the trace visualizer, and submit a verified fix.

---

## Phase 9 — Mastery Engine & Review Queue
- **Objective**: Compute dynamic concept mastery from multi-signal learner interactions and generate spaced reviews.
- **Dependencies**: Phase 8.
- **Deliverables**:
  - Evidence collector recording attempts, hints, execution outcomes, and latency.
  - Mastery calculation algorithm mapping concept proficiency (0% → 100%).
  - Spaced repetition review queue triggering refresher challenges.
- **Status**: Planned
- **Definition of Done**: Completing challenges updates learner concept mastery vector; dashboard displays accurate review recommendations.

---

## Phase 10 — Socratic AI Tutor
- **Objective**: Deploy the context-bounded AI mentor guiding learners with 4-tier progressive hints.
- **Dependencies**: Phase 7, Phase 8.
- **Deliverables**:
  - `TutorContextBuilder` aggregating editor code, compiler errors, and trace steps.
  - Streaming Socratic assistant with prompt injection defenses.
  - Action buttons: "Explain Error", "Give Hint", "Explain Current Step".
- **Status**: Planned
- **Definition of Done**: AI tutor guides learner to resolve an intentional bug without prematurely revealing the solution code.

---

## Phase 11 — System Design Lab
- **Objective**: Build the interactive distributed architecture designer and failure simulator.
- **Dependencies**: Phase 0, Phase 7.
- **Deliverables**:
  - React Flow canvas with custom nodes (Client, CDN, LB, Service, Cache, Database, Queue).
  - Traffic generator simulating requests/sec, latency, and throughput.
  - Failure injection triggers: Kill database, kill cache, network partition.
- **Status**: Planned
- **Definition of Done**: Learner can construct a multi-tier service, simulate traffic, kill a cache node, and observe the database overload cascade.

---

## Phase 12 — Python Track
- **Objective**: Launch the complete Python runtime and language curriculum.
- **Dependencies**: Phase 6, Phase 7.
- **Deliverables**:
  - Python runtime trace adapter (`sys.settrace` / AST).
  - Curriculum: Bytecode & PyObject, Scopes (LEGB), Generators, Asyncio event loop.
  - Break-It scenarios for mutable defaults, late binding in closures, and async deadlocks.
- **Status**: Planned
- **Definition of Done**: Python code executes in sandbox, generating accurate stack/heap visualization and challenge verification.

---

## Phase 13 — React Internals Track
- **Objective**: Deliver interactive visual simulation of React rendering, reconciliation, and fiber tree architecture.
- **Dependencies**: Phase 7.
- **Deliverables**:
  - Fiber tree visualizer showing render phase, diffing, and commit phase.
  - Hook closure simulator demonstrating stale closures and dependency array mechanics.
  - Performance diagnostic lab inspecting unnecessary re-renders.
- **Status**: Planned
- **Definition of Done**: Learner steps through a simulated component render, observing fiber node tagging and DOM mutation commitments.

---

## Phase 14 — AI Engineering Track
- **Objective**: Deliver interactive curriculum for LLM orchestration, vector space embeddings, and agent tool-calling loops.
- **Dependencies**: Phase 7, Phase 10.
- **Deliverables**:
  - Vector space visualizer demonstrating cosine similarity and clustering.
  - RAG chunking and retrieval comparison simulator.
  - Autonomous agent loop visualizer tracking scratchpads, tool selection, and execution results.
- **Status**: Planned
- **Definition of Done**: Learners can step through an interactive agent reasoning loop, observing tool dispatch and context window token consumption.

---

## Phase 15 — Production Hardening & Scale
- **Objective**: Enterprise reliability, comprehensive E2E automation, performance optimization, and SOC2 security audit.
- **Dependencies**: Phases 0–14.
- **Deliverables**:
  - High-availability cluster configuration with autoscaling execution workers.
  - Automated performance budgeting (LCP < 1.2s, INP < 100ms).
  - Full penetration testing and sandbox escape auditing.
- **Status**: Planned
- **Definition of Done**: Zero high-severity security findings, 99.9% uptime SLA under load, passing all CI release gates.
