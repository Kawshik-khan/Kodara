---
name: architecture
version: 1.0.0
description: Design, evaluate, and enforce system boundaries, data contracts, and component decoupling across Kodara.
requires:
  - project-context
---

# Purpose
The `architecture` skill enforces the modular monolith pattern, execution sandbox boundaries, decoupled visual state machines, and clean separation between client-side state and server-side state.

# When to use
- When introducing new services, API routes, or data models.
- When designing execution queue mechanics, worker topologies, or websocket protocols.
- When modifying shared contracts between the frontend engine and backend execution runners.
- When any change could introduce tight coupling or violate layered architecture.

# What not to use it for
- Tweaking visual styles, padding, or button typography (use `design-system`).
- Writing educational lesson text or challenge questions (use `lesson-design`).

# Required context
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)
- [.agent/DECISIONS/](file:///f:/OLama/Kodara/.agent/DECISIONS/)
- [.agent/SECURITY.md](file:///f:/OLama/Kodara/.agent/SECURITY.md)

# Inputs
- Proposed architectural change or new subsystem requirement.

# Procedure
1. **Verify Architectural Pattern**: Ensure the change adheres to the Modular Monolith structure for web/API and isolated worker daemons for execution.
2. **Evaluate Coupling & Cohesion**: Verify that domain modules (e.g., `curriculum`, `mastery`, `ai-tutor`) communicate via explicit interfaces without circular imports.
3. **Inspect Sandbox Isolation**: Verify that untrusted code execution routes through the Redis queue and worker sandboxes, never executing within the API process.
4. **Enforce State Boundaries**: Confirm that server data is managed via TanStack Query and client state is strictly isolated in Zustand stores.
5. **ADR Trigger Check**: If the proposal introduces a new persistence layer, alters the trace protocol, or alters cross-service boundaries, author a new ADR in `.agent/DECISIONS/`.

# Rules
- Never place business logic inside route controllers; route handlers strictly delegate to domain services.
- Never couple visual renderers directly to source code strings or compiler ASTs.
- Always enforce the principle of least privilege between subsystems.

# Validation
- Architectural change must satisfy the invariants in `.agent/ARCHITECTURE.md`.
- No new circular dependencies introduced in module graphs.

# Outputs
- Architectural design review, implementation plan, and ADR documentation when applicable.

# Failure handling
- If architectural degradation is discovered during review, halt implementation and record a remediation plan in `.agent/STATE/BLOCKERS.md`.
