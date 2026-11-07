# KODARA CODE EXECUTION SPECIFICATION

## 1. Pipeline Architecture

The execution subsystem provides deterministic, secure code evaluation and runtime trace generation.

```text
Browser Client (Monaco Editor)
       │
       │ HTTP POST /api/execution/run
       ▼
Execution Gateway (API)
  - Authenticates user
  - Validates request payload & language
  - Enforces per-user rate limiting (Redis sliding window)
       │
       │ Enqueue Job
       ▼
Redis Queue (BullMQ / Redis Stream)
       │
       │ Dequeue Job
       ▼
Execution Worker Daemon
  - Spawns ephemeral non-root container / gVisor sandbox
  - Enforces cgroups (CPU, RAM, PID limits, read-only FS)
       │
       ▼
Language Sandbox Container
  - TypeScript: ts-node / Node instrumenter
  - Python: sys.settrace / custom AST tracer
       │
       │ Serializes Events to stdout
       ▼
Trace Collector & Normalizer
       │
       │ WebSocket / SSE Stream
       ▼
Browser Client (Visualizer & Terminal)
```

## 2. Language-Neutral Trace Protocol

All execution workers normalize language-specific runtime hooks into a standardized JSON event stream.

```ts
export interface ExecutionTrace {
  version: "1.0.0";
  language: "typescript" | "javascript" | "python";
  sourceCode: string;
  totalSteps: number;
  events: TraceEvent[];
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  exitCode: number;
}

export type TraceEvent = {
  step: number;
  line: number;
  column?: number;
  timestampMs: number;
} & (
  | {
      type: "variable.create";
      name: string;
      value: string;
      kind: "let" | "const" | "var";
      scopeId: string;
    }
  | {
      type: "variable.update";
      name: string;
      oldValue: string;
      newValue: string;
      scopeId: string;
    }
  | {
      type: "object.create";
      address: string; // e.g., "0x004a"
      shape: "object" | "array" | "function";
      properties: Record<string, unknown>;
    }
  | {
      type: "reference.assign";
      sourceVariable: string;
      targetAddress: string;
    }
  | {
      type: "function.call";
      functionName: string;
      arguments: unknown[];
      callerLine: number;
      frameId: string;
    }
  | {
      type: "function.return";
      functionName: string;
      returnValue: unknown;
      frameId: string;
    }
  | {
      type: "scope.enter";
      scopeId: string;
      scopeType: "global" | "function" | "block" | "closure";
      parentScopeId?: string;
    }
  | {
      type: "scope.exit";
      scopeId: string;
    }
  | {
      type: "async.microtask.enqueue";
      taskId: string;
      source: "Promise.then" | "queueMicrotask";
    }
  | {
      type: "async.eventloop.tick";
      phase: "callstack" | "microtask" | "macrotask";
    }
  | {
      type: "exception.throw";
      exceptionType: string;
      message: string;
      stackTrace: string;
    }
);
```

## 3. Language Adapter Architecture

Each supported runtime implements an adapter conforming to the `LanguageAdapter` interface:

```text
               Common Trace Protocol
                         ▲
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
TypeScript Adapter  Python Adapter    React Model Adapter
  (Node AST/Babel)   (sys.settrace)    (Fiber Simulator)
```

### 3.1. TypeScript & JavaScript Adapter
- **Client-Side Simulation**: Uses Babel/TypeScript AST instrumentation to inject step listeners before variable assignments and function declarations for fast, zero-latency feedback on standard code snippets.
- **Server-Side Sandbox**: Uses Node.js `AsyncLocalStorage` and custom inspector protocol session to capture native heap allocations and V8 microtask scheduling.

### 3.2. Python Adapter
- Uses a lightweight trace hook (`sys.settrace`) in conjunction with Python's `ast` module.
- Records frame events (`call`, `line`, `return`, `exception`) and samples the `locals()` dictionary to detect mutations and object identity (`id(obj)`).

### 3.3. React Adapter
- Distinguishes between direct execution tracing and **modeled educational simulation**.
- In educational React mode, the adapter models the React Fiber tree traversal (beginWork, completeWork) and render/commit phases step-by-step so learners understand reconciliation without getting lost in internal engine clutter.
