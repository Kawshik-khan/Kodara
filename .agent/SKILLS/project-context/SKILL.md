---
name: project-context
version: 1.0.0
description: Establish authoritative context on Kodara before beginning any non-trivial engineering task.
requires: []
---

# Purpose
The `project-context` skill ensures that Antigravity or any collaborating engineer grounds their work in Kodara's mission, current architectural reality, and active milestone, eliminating memory loss and preventing accidental rework.

# When to use
- At the start of every new development session or user request.
- When planning multi-step implementations or architectural modifications.
- Whenever a task touches system boundaries, routing, or state models.

# What not to use it for
- Trivial syntax corrections or single-character typo fixes.
- Standalone execution of isolated test scripts where context is already fixed.

# Required context
- [.agent/PROJECT.md](file:///f:/OLama/Kodara/.agent/PROJECT.md)
- [.agent/STATE/CURRENT.md](file:///f:/OLama/Kodara/.agent/STATE/CURRENT.md)
- [.agent/STATE/GOAL.md](file:///f:/OLama/Kodara/.agent/STATE/GOAL.md)
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)

# Inputs
- User task description or engineering ticket.
- Current repository git status and directory structure.

# Procedure
1. **Read Core Memory**: Load `.agent/PROJECT.md` to refresh the product category, core learning loop, and target learners.
2. **Inspect Current State**: Read `.agent/STATE/CURRENT.md` to identify implemented vs. pending capabilities and active blockers.
3. **Verify Active Goal**: Inspect `.agent/STATE/GOAL.md` to ensure the incoming task aligns with the primary active milestone.
4. **Identify Relevant Domain Skills**: Determine which specialized skills (e.g., `frontend`, `lesson-design`, `visualization`) are needed.
5. **Formulate Context Summary**: Briefly state the understood goal, constraints, and dependencies before writing code.

# Rules
- Never assume repository state based solely on prior conversation history; always verify against `.agent/STATE/CURRENT.md`.
- If the incoming task conflicts with `.agent/STATE/GOAL.md`, seek clarification before proceeding.

# Validation
- Confirm that the proposed change directly advances the active milestone or resolves an identified blocker.

# Outputs
- A concise context alignment summary preceding the implementation plan.

# Failure handling
- If state files are missing or corrupted, regenerate them using canonical repository specifications before writing application code.
