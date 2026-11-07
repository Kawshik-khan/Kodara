# Visualization: [Visualization Title]

## Concept
The specific concept ID and title this visualizer models (e.g., `stack-vs-heap`, `scope-chain-resolution`, `event-loop-queue`).

## Learner Goal
What concrete mental model transition or runtime behavior should the learner understand after interacting with this visualization?

## Initial State
The baseline state of memory, stack frames, heap objects, or system nodes prior to the first execution step.

```json
{
  "stack": [],
  "heap": {},
  "scopes": [{ "id": "global", "bindings": {} }]
}
```

## Step Sequence
Discrete chronological steps mapping execution events to visual state changes:
1. **Step 1**: Description, source line reference, active mutations, and highlighted elements.
2. **Step 2**: Description, source line reference, active mutations, and highlighted elements.
3. **Step 3**: Description, source line reference, active mutations, and highlighted elements.

## Mutable State
Explicit list of elements that mutate across the timeline:
- Variables allocated or updated.
- Heap objects instantiated or garbage-collected.
- References/pointers reassigned.
- Call stack frames pushed or popped.

## Events
Normalized `TraceEvent` objects emitted by the execution adapter for this visualization.

## Renderer
Rendering strategy and visual primitive components used (e.g., SVG canvas with `StackFrame`, `HeapObject`, and `PointerArrow` components).

## Interaction
- Playback timeline scrubber and playback speed control.
- Keyboard bindings (`ArrowLeft`, `ArrowRight`, `Space`, `r`).
- Interactive node inspection on click/hover.

## Accessibility
- Textual narrative describing each step for screen readers (`aria-live="polite"`).
- Zero-duration transitions when `prefers-reduced-motion: reduce` is active.
- Keyboard focusable controls with high-contrast outlines.

## Failure Cases
Edge-case behaviors to handle gracefully (e.g., empty code, stack overflow, out-of-memory, infinite timeline steps).

## Verification
Automated tests asserting state machine calculations and visual snapshot fidelity across steps.
