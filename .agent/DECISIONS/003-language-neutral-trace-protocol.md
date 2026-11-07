# ADR 003: Language-Neutral Event-Driven Execution Trace Protocol

## Context
Kodara teaches multiple languages and runtimes: TypeScript, JavaScript, Python, React Fiber, and distributed systems. If the frontend visualization engine were tightly coupled to specific language compilers (e.g., Babel AST for JS, Python AST for Python), every new language would require rewriting the visualizers, memory inspectors, and timeline controls.

## Decision
We define a **Language-Neutral, Event-Driven Execution Trace Protocol**:
1. **Normalized Event Stream**: All language adapters (whether client-side AST instrumenters or server-side sandbox hooks) must emit standardized, sequential `TraceEvent` records (e.g., `variable.create`, `object.create`, `reference.assign`, `scope.enter`, `function.call`).
2. **Deterministic State Machine**: The frontend visualization engine consumes this event sequence to compute memory models, stack frames, and pointer graphs at each discrete step index.
3. **Decoupled Visual Rendering**: The visual components render pure representations of the calculated state, completely independent of the underlying language AST or source syntax.

## Alternatives Considered
- **Direct AST Rendering in Frontend**: Rejected because AST structures vary drastically across languages and do not capture dynamic runtime mutations (e.g., heap memory addresses, async task queue scheduling).
- **Video / Canvas Frame Streaming**: Rejected because static pixel streams cannot be queried, inspected, or navigated interactively with keyboard shortcuts and screen readers.

## Consequences
### Positive
- A single unified visualization engine serves TypeScript, Python, React, and future languages.
- Instantaneous timeline scrubbing (forward, backward, jump to step) without re-executing code.
- Enables rich automated testing of trace correctness against language edge cases.
### Negative / Tradeoffs
- Language adapter authors must write and maintain instrumentation hooks that map runtime events into the normalized schema.

## Status
Accepted

## Date
2026-09-09
