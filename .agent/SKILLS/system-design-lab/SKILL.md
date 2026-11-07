---
name: system-design-lab
version: 1.0.0
description: Build, simulate, and calibrate the interactive React Flow distributed architecture simulator.
requires:
  - project-context
  - frontend
  - visualization
---

# Purpose
The `system-design-lab` skill governs the interactive distributed systems canvas where learners build, connect, simulate, and break multi-tier system architectures (Load Balancers, Microservices, Caches, Databases, Queues, Workers).

# When to use
- When creating or modifying React Flow custom node components (CDN, Gateway, Service, Redis, Postgres, Kafka).
- When implementing simulation mechanics (traffic generation, request routing, latency modeling).
- When designing failure injection controls (kill database, trigger cache stampede, introduce network split-brain).

# What not to use it for
- Building low-level language AST parsers for TypeScript or Python.
- General user authentication.

# Required context
- [.agent/PRODUCT.md](file:///f:/OLama/Kodara/.agent/PRODUCT.md)
- [.agent/DESIGN-SYSTEM.md](file:///f:/OLama/Kodara/.agent/DESIGN-SYSTEM.md)

# Inputs
- Architectural node specs, simulation parameters (req/sec, latency, cache hit %), or failure scenario definitions.

# Procedure
1. **Custom React Flow Nodes**:
   - Implement standardized node cards styled according to `.agent/DESIGN-SYSTEM.md` (white cards, 1px crisp borders, technical icons).
   - Display live operational metrics on each node (RPS, CPU %, Memory %, p99 Latency).
2. **Dynamic Edge Visualizations**:
   - Render animated SVG packet streams along edges to indicate active request throughput and backlog.
3. **Discrete Simulation Tick Loop**:
   - Run an in-browser simulation tick (100ms interval) calculating queue depths, cache hit rates, and database connection pool saturation.
4. **Failure Trigger Engine**:
   - Expose actionable disruption buttons: "Kill Cache", "Sever Network Link", "Double Traffic Load".
   - Model cascading failures (e.g., Cache death → Database thread starvation → 504 Gateway Timeouts).
5. **Educational Transparency**:
   - Explicitly label simulation metrics as educational models, not physical hardware benchmarks.

# Rules
- Do not present simulated numbers as empirical production benchmarks.
- React Flow dependencies must be lazy-loaded to prevent initial bundle bloat.

# Validation
- Connecting a client to a load balancer to two service replicas distributes traffic evenly across the edges.
- Killing a primary database without a configured read-replica or failover triggers observable 500 error cascades.

# Outputs
- Reusable React Flow custom nodes, edges, simulation engines, and lab scenarios.

# Failure handling
- If graph calculations cause UI frame drops, decouple the simulation math to a dedicated Web Worker.
