---
name: code-execution
version: 1.0.0
description: Implement, maintain, and secure the code execution pipeline, sandbox containers, and AST trace generators.
requires:
  - project-context
  - architecture
  - security
---

# Purpose
The `code-execution` skill governs the execution of learner code, from browser submission to asynchronous queueing, non-root sandbox execution, timeout supervision, and normalized `TraceEvent` generation.

# When to use
- When implementing or configuring language execution sandboxes (Docker, gVisor).
- When writing language trace adapters (Babel instrumenter for TS, `sys.settrace` for Python).
- When adjusting execution limits, rate limiters, or queue concurrency.

# What not to use it for
- Building frontend styling or UI layouts.
- Authoring text-only lesson theory.

# Required context
- [.agent/EXECUTION-SPEC.md](file:///f:/OLama/Kodara/.agent/EXECUTION-SPEC.md)
- [.agent/SECURITY.md](file:///f:/OLama/Kodara/.agent/SECURITY.md)
- [.agent/DECISIONS/003-language-neutral-trace-protocol.md](file:///f:/OLama/Kodara/.agent/DECISIONS/003-language-neutral-trace-protocol.md)

# Inputs
- Language runtime specification, sandbox configuration, or execution adapter requirement.

# Procedure
1. **Enforce Sandbox Boundaries**:
   - Verify non-root execution (`uid=10001`).
   - Confirm network is completely disabled (`--net=none`).
   - Pin resources: CPU = 1.0 core max, RAM = 256MB max, Timeout = 5 seconds max.
   - Enforce read-only root filesystem with ephemeral tmpfs.
2. **Adapter Instrumentation**:
   - Map runtime hook events into canonical `TraceEvent` objects (`variable.create`, `function.call`, `scope.enter`).
   - Capture variable names, values, memory addresses, and line numbers accurately.
3. **Queue & Stream Wiring**:
   - Manage job submission via BullMQ.
   - Stream execution output and trace events over WebSocket/SSE to client.
4. **Client-Side Simulation Fallback**:
   - For simple, safe TypeScript exercises, provide client-side AST instrumentation to execute instantaneously in a Web Worker without queue latency.

# Rules
- Never execute untrusted code in the primary API host process.
- Never trust client-specified resource limits; limits are enforced exclusively by the worker supervisor.
- Never present an educational simulation as actual hardware/V8 runtime execution without clear labeling.

# Validation
- Malicious test payloads (infinite loops, memory exhaustion, network requests) terminate cleanly within 5.5 seconds without crashing the worker host.

# Outputs
- Hardened sandbox container images, language trace adapters, and worker daemon services.

# Failure handling
- If worker containers fail to clean up on SIGKILL, ensure the supervisor garbage collects orphaned container instances every 60 seconds.
