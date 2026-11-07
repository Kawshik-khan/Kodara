# ADR 001: Modular Monolith Architecture with Isolated Execution Workers

## Context
Kodara requires rich, interconnected domain capabilities: curriculum management, learner authentication, concept mastery tracking, Socratic AI tutoring, and untrusted code execution. A naive microservices architecture would introduce severe operational overhead, network latency, distributed transaction complexity, and deployment friction. Conversely, running untrusted learner code inside a standard monolithic web process poses critical security and denial-of-service risks.

## Decision
We adopt a **Modular Monolith** pattern for the primary backend API, paired with **Asynchronous Isolated Worker Daemons** for code execution:
1. **Core Web API**: A single cohesive codebase organized into strict domain modules (`auth`, `curriculum`, `mastery`, `ai-tutor`, `execution-gateway`). Internal communication uses in-process typed service interfaces.
2. **Execution Workers**: Standalone worker daemons isolated from the API process. Workers consume jobs from a Redis queue (BullMQ), spawn ephemeral non-root sandbox containers (Docker/gVisor), enforce strict cgroups boundaries, and stream execution traces back via Redis pub/sub to WebSockets.

## Alternatives Considered
- **Full Microservices Topology**: Rejected due to premature complexity, service discovery overhead, and slowed development velocity.
- **In-Process Worker Execution (VM2 / isolated-vm)**: Rejected because in-process Node/Python sandboxes have a long history of sandbox escapes and memory leaks that can crash the primary API host.

## Consequences
### Positive
- Rapid iteration, single deployment pipeline, simplified local development.
- Strong domain boundary enforcement via TypeScript modules.
- Hard security isolation: untrusted code can never access host API memory, database credentials, or internal networks.
### Negative / Tradeoffs
- Requires Redis as an operational dependency for job queuing and pub/sub.
- Worker scaling is decoupled from API scaling, requiring separate worker container orchestrations.

## Status
Accepted

## Date
2026-09-09
