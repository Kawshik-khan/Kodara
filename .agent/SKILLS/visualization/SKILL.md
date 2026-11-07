---
name: visualization
version: 1.0.0
description: Design, build, and optimize interactive, step-driven visual state machines and memory diagrams.
requires:
  - project-context
  - design-system
---

# Purpose
The `visualization` skill guides the construction and refinement of interactive runtime visualizers (memory models, stack frames, heap pointers, event loop queues, type-narrowing trees, and system nodes). It ensures visuals represent real state rather than superficial animation.

# When to use
- When creating a new visualizer for a concept or runtime mechanic.
- When mapping execution trace events into visual state transitions.
- When implementing timeline scrubbers, speed controls, or keyboard shortcuts.

# What not to use it for
- Pure text editing of lessons.
- General backend API route construction.

# Required context
- [.agent/VISUALIZATION-SPEC.md](file:///f:/OLama/Kodara/.agent/VISUALIZATION-SPEC.md)
- [.agent/DESIGN-SYSTEM.md](file:///f:/OLama/Kodara/.agent/DESIGN-SYSTEM.md)
- [.agent/DECISIONS/003-language-neutral-trace-protocol.md](file:///f:/OLama/Kodara/.agent/DECISIONS/003-language-neutral-trace-protocol.md)

# Inputs
- Visualization definition requirements, trace events, or state machine steps.

# Procedure
1. **Define Mutable State**: Determine what discrete entities change across steps (stack frames, heap addresses, pointer edges, active scope).
2. **Implement Reusable Visual Primitives**: Use standardized primitives (Stack Frame, Heap Object, Scope Box, Pointer Arrow).
3. **Step-Driven Determinism**: Ensure each step is an immutable snapshot of state. Scrubbing backwards must be identical to stepping forwards.
4. **Playback & Control Wiring**:
   - Provide standard controls: Reset, Step Backward, Play/Pause, Step Forward, Speed selector.
   - Implement keyboard listeners (`j`, `k`, `Space`, `r`).
5. **Accessibility & Reduced Motion**:
   - Support `prefers-reduced-motion: reduce` by setting transition times to `0ms`.
   - Provide an accompanying textual status description for each step.

# Rules
- Never animate purely for decoration; every movement must represent a real state mutation, pointer reallocation, or scope transition.
- Never tightly couple the visual renderer to source code strings; consume normalized `VisualizationStep` state.

# Validation
- Stepping through all timeline steps renders accurately without overlapping labels or broken SVG pointer paths.
- Screen readers can access the text summary of each visual step.

# Outputs
- Reusable React/SVG visualizer components and compliant `visualization.json` definitions.

# Failure handling
- If complex layout elements collide or jitter during transitions, switch from dynamic force-directed layouts to deterministic grid-aligned coordinates.
