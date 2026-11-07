# KODARA PRODUCT GOALS

## 1. Short-Term Goals (Phase 0 – Phase 5)

Establish the core learning platform foundations and deliver the first end-to-end TypeScript vertical slice.

- [ ] **Infrastructure & Architecture Baseline**: Initialize Vite + React + TypeScript web application with modular directory layout, Vitest testing harness, and strict type checking.
- [ ] **Design System Implementation**: Deliver the canonical White + Orange + Technical Grid design system, Bento container layout, semantic tokens, and technical button controls.
- [ ] **Interactive Lesson Engine**: Implement the structured 16-step lesson runner capable of progressive disclosure across Theory, Visualization, Code, and Challenge modes.
- [ ] **Execution & Trace Protocol**: Define the language-agnostic `ExecutionTrace` event model and implement the client-side JavaScript/TypeScript AST instrumentation and runtime trace interpreter.
- [ ] **First Vertical Slice**: Deliver the complete reference user journey:
  ```text
  Dashboard → Learning Path → TypeScript Track → JS Runtime Foundations → Variables Lesson → Interactive Memory Visualization → Playground Run → Trace Inspection → Break-It Debugging → Challenge → Mastery Update
  ```
- [ ] **Content Validation Engine**: Establish automated CLI validation (`pnpm content:validate`) ensuring educational schemas, lesson metadata, and concept relationships remain 100% consistent.

## 2. Mid-Term Goals (Phase 6 – Phase 11)

Expand the platform with production-grade execution sandboxes, multi-track curriculum, AI tutoring, and system architecture simulation.

- [ ] **Secure Isolated Execution Worker**: Implement isolated, non-root sandbox workers (Docker/gVisor/Firecracker microVMs) communicating via Redis queue to safely execute untrusted Python and TypeScript code.
- [ ] **Curriculum Expansion**:
  - Full TypeScript track (Fundamentals, Generics, Advanced Types).
  - Python track (Memory model, Scope & Closures, Generators, Asyncio).
  - React track (Fiber architecture, Render/Commit cycle simulation).
- [ ] **System Design Lab**: Build the React Flow-based interactive distributed architecture simulator featuring dynamic traffic generation, latency modeling, and node kill switches (DB failure, cache stampede).
- [ ] **Socratic AI Tutor**: Build the `TutorContextBuilder` and streaming AI guidance engine with multi-tiered hint escalation (Hint 1 → Hint 2 → Guided Explanation → Solution).
- [ ] **Mastery & Review Engine**: Implement the multi-signal evidence tracking engine and spaced-repetition review queue based on real debugging and challenge performance.

## 3. Long-Term Goals (Phase 12 – Phase 15)

Transform Kodara into the definitive, universal engineering learning environment from code-level execution to distributed systems and AI agents.

- [ ] **AI Engineering Track**: Interactive simulation of LLM token generation, vector embeddings, RAG chunking/retrieval, and autonomous agent tool-calling loops.
- [ ] **Collaborative Engineering Labs**: Real-time multi-user debugging sessions, architectural war-rooms, and peer code reviews.
- [ ] **Full Capstone Project System**: Multi-file repository projects in isolated web containers with automated test suites, architectural linting, and interactive system benchmarking.
- [ ] **Enterprise & Academic Integrations**: Institutional team progress analytics, custom curriculum authoring studio, and verifiable mastery credentials.
- [ ] **Global Community & Contribution Ecosystem**: Open-source curriculum contributions with automated CI testing and verification of community-authored lessons.
