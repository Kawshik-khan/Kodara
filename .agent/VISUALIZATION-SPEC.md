# KODARA VISUALIZATION SUBSYSTEM SPECIFICATION

## 1. Architectural Principles

Visualization is a **first-class system component** in Kodara, not an ad-hoc animated graphic.

```text
Runtime Execution / Simulation
              ↓
  Normalized Event Stream (TraceEvents)
              ↓
  State Machine Step Generator
              ↓
  Immutable Visualization State
              ↓
  Renderer (SVG / Canvas / HTML DOM)
```

### Core Invariants
1. **Decoupled from Source Code**: The visual renderer never inspects raw code strings directly. It interprets structured visualization states or trace events.
2. **Deterministic Step Sequencing**: Given the same sequence of events, the visualizer always produces the exact same layout and highlights.
3. **Inspectable at Every Step**: Learners can jump to any step in the execution timeline without running preceding steps in real time.
4. **Accessible Alternative Available**: Every visual simulation must have an accompanying structured textual description for screen readers and accessibility.

## 2. Visualization Definition Schema

```ts
export interface VisualizationDefinition {
  id: string;
  type:
    | "memory-model"      // Stack, Heap, Pointer References
    | "scope-chain"       // Lexical environments, closures
    | "call-stack"        // Execution frames, return values
    | "event-loop"        // Call stack, Microtasks, Macrotasks, Web APIs
    | "type-system"       // Union sets, narrowing trees, generic resolution
    | "react-fiber"       // Fiber tree, render phase, commit phase
    | "architecture-node" // Distributed nodes, queues, databases, latency flows
    | "ai-pipeline";      // Tokenization, embeddings, vector space, tool loop

  title: string;
  description: string;
  initialState: VisualizationState;
  steps: VisualizationStep[];
  controls?: VisualizationControl[];
}

export interface VisualizationStep {
  id: string;
  stepIndex: number;
  sourceLine?: number;
  title: string;
  explanation: string;

  state: VisualizationState;
  mutations?: StateMutation[];
  highlights?: ElementHighlight[];
  annotations?: VisualAnnotation[];
}

export interface VisualizationState {
  memory?: {
    stackFrames: StackFrame[];
    heapObjects: HeapObject[];
  };
  scope?: {
    currentScopeId: string;
    scopes: ScopeEnvironment[];
  };
  eventLoop?: {
    callStack: string[];
    microtaskQueue: string[];
    macrotaskQueue: string[];
  };
  graph?: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}
```

## 3. Interactive Playback & Keyboard Controls

Every step-based visualizer must expose standardized playback controls:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [⏮ Reset]  [◀ Prev]  [▶ Play / ⏸ Pause]  [Next ▶]  [Speed: 1x ▾]      │
│  ───────●─────────────────────────────────────────────── Step 3 of 8   │
└────────────────────────────────────────────────────────────────────────┘
```

### Standard Keyboard Shortcuts
- `ArrowLeft` / `k`: Previous step
- `ArrowRight` / `j`: Next step
- `Space`: Toggle Play / Pause
- `r`: Reset to initial step
- `1`, `2`, `5`: Change playback speed (1x, 2x, 0.5x)

### Reduced Motion Support
When `prefers-reduced-motion: reduce` is detected:
- Transition animations (movement, scaling, fading) drop to `0ms`.
- State transitions snap immediately between steps without easing delays.

## 4. Reusable Visual Primitives

Kodara visual components are composed of standard, reusable visual primitives:

1. **Stack Frame Component**: Renders execution contexts, function identifiers, parameters, and local variable slots.
2. **Heap Object Component**: Renders allocated objects, arrays, and functions with memory address labels (e.g., `#0x10A`) and key-value properties.
3. **Memory Pointer Edge**: SVG spline curve connecting variable slots on the stack to target heap objects, with highlighted active dereferencing.
4. **Scope Nesting Box**: Visual hierarchy showing global scope enclosing outer function scopes enclosing local blocks.
5. **Event Loop Orbit**: Circular or multi-lane queue diagram showing execution stack emptying into microtasks and macrotasks.
6. **Architecture Node & Edge**: High-contrast node elements representing services, databases, or caches, with animated packet flows indicating throughput and latency.
