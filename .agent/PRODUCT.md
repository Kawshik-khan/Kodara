# KODARA PRODUCT SPECIFICATION

## 1. Product Philosophy

> **Understand how software works.**

Modern software engineering education is plagued by two extremes:
1. **Passive consumption**: Watching someone else code in high-level videos, creating an illusion of competence that shatters when building independently.
2. **Black-box puzzle solving**: Writing code to satisfy hidden unit tests on a remote server without visualizing what memory was allocated, how closures retained scope, or why a distributed database failed under load.

Kodara fundamentally alters this dynamic by transforming abstract runtime mechanics and invisible architectural flows into **tangible, visual, and debuggable simulations**.

## 2. The Central Learning Loop

Every educational unit in Kodara is structured around the 12-stage cognitive mastery loop:

```text
1.  Learn       → Acquire foundational context and motivation ("Why does this exist?")
2.  Understand  → Build the conceptual mental model through clear technical explanation
3.  Visualize   → Manipulate an interactive visual simulation of state and memory
4.  Build       → Construct the concept or abstraction from scratch (manual implementation)
5.  Execute     → Run the implementation in a transparent execution runtime
6.  Trace       → Step through execution line-by-line observing call stacks and heap mutations
7.  Inspect     → Query local scopes, variables, references, and pending asynchronous tasks
8.  Break       → Enter "Break It" mode where a deliberate failure is introduced
9.  Debug       → Identify the anomaly using traces, inspect state, and formulate a fix
10. Verify      → Execute comprehensive test suites to confirm correctness and edge cases
11. Master      → Synthesize the concept into the learner's persistent knowledge graph
12. Build       → Apply the mastered concept inside a multi-file, production-grade project
```

## 3. Learner Personas & Journeys

### Persona A: Alex — The Visual Learner / Mid-Level Frontend Engineer
- **Goal**: Master TypeScript type-level programming and React fiber internals.
- **Pain Point**: Struggles with conditional types, generics, and understanding stale closures in React hooks.
- **Kodara Experience**: Interacts with the type-narrowing visualizer; watches how union types branch into discriminate sets; debugs an artificially injected stale closure scenario in the React Trace simulator.

### Persona B: Priya — The Self-Taught Developer Preparing for System Design
- **Goal**: Transition from writing monoliths to designing resilient distributed architectures.
- **Pain Point**: Memorized buzzwords ("sharding", "consistent hashing", "cache invalidation") without having seen failure modes under load.
- **Kodara Experience**: Opens the System Design Lab; builds a multi-tier service with Redis caching and PostgreSQL replica; triggers a cache outage and witnesses the simulated thundering herd problem overwhelm the database in real-time.

### Persona C: Marcus — The Software Engineer Pivoting to AI Engineering
- **Goal**: Understand LLM agent tool-calling loops, RAG pipelines, and vector databases.
- **Pain Point**: Used off-the-shelf Python libraries without understanding embedding dimensions, cosine similarity, or context window degradation.
- **Kodara Experience**: Steps through an interactive vector space visualization; explores how chunking strategies affect semantic search retrieval; inspects an autonomous agent execution loop step-by-step.

## 4. Core Product Mechanics

### 4.1. Progressive Disclosure UI
Learners are never overwhelmed with all tools at once. When beginning a topic:
- Screen starts in **Theory + Visualization** focus.
- Clicking "Build It" expands the **Monaco Code Editor**.
- Executing code activates the **Execution Trace & Memory Inspector**.
- Initiating debugging transitions into **Break-It Mode**.
- Completing tasks reveals the **Challenge & Mastery Feedback**.

### 4.2. Build-It / Use-It / Compare
Before adopting high-level library abstractions, learners build them manually:
1. **Build It**: Implement a simplified generic cache, promise polyfill, or router.
2. **Use It**: Run realistic workloads through their manual implementation.
3. **Compare**: Swap in the production standard implementation and compare runtime performance, type ergonomics, and memory tradeoffs.

### 4.3. Multi-Signal Mastery Tracking
Mastery is never a boolean or simple quiz percentage. It is computed dynamically from:
- First-try execution success rate.
- Time to diagnose and fix Break-It scenarios.
- Frequency and tier of AI hints requested.
- Performance on visual prediction challenges.
- Spaced review retention over 7, 14, and 30 days.

### 4.4. Guardrails Against Product Drift
To maintain Kodara's unique identity, reject features that compromise its core value proposition:
- **No static video lectures**: Explanations must be textual, technical, and interactive.
- **No generic chat assistants**: AI interactions must be context-bounded Socratic tutors.
- **No toy quizzes**: Multiple-choice questions must test visual prediction and failure diagnosis, not term definitions.
- **No disconnected sandboxes**: Code execution must always connect to visual state or trace inspectors.
