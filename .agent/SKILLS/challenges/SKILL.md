---
name: challenges
version: 1.0.0
description: Design, author, and evaluate interactive coding challenges, output predictions, and failure diagnosis labs.
requires:
  - project-context
  - lesson-design
---

# Purpose
The `challenges` skill ensures that Kodara challenges rigorously assess deep conceptual understanding rather than surface-level memorization. It supports multiple challenge archetypes (predict output, trace execution, fix code, debug failure, architecture decision).

# When to use
- When creating challenges for a lesson, module, or assessment phase.
- When designing automated test cases or evaluation rubrics for exercises.
- When reviewing existing challenges for clarity, difficulty calibration, and edge-case coverage.

# What not to use it for
- Building backend execution infrastructure (use `code-execution`).
- Designing global curriculum topologies (use `curriculum`).

# Required context
- [.agent/LESSON-SPEC.md](file:///f:/OLama/Kodara/.agent/LESSON-SPEC.md)
- [.agent/TEMPLATES/challenge-template.md](file:///f:/OLama/Kodara/.agent/TEMPLATES/challenge-template.md)

# Inputs
- Target concept ID, difficulty tier, and desired challenge archetype.

# Procedure
1. **Select the Archetype**:
   - *Predict Output*: Learner traces execution mentally and predicts console log or return value.
   - *Trace Reasoning*: Learner identifies which line caused a specific heap mutation or scope capture.
   - *Fix Code*: Learner corrects a subtle compiler or runtime error.
   - *Debug Failure*: Learner diagnoses an injected "Break-It" scenario.
   - *Write Code*: Learner constructs a function or type from scratch meeting a strict test suite.
   - *Architecture Decision*: Learner selects the optimal caching or queue topology under stated traffic constraints.
2. **Author High-Signal Test Cases**:
   - Include visible canonical tests for immediate feedback.
   - Include hidden boundary/edge-case tests to prevent hardcoded output cheats.
3. **Calibrate 3-Tier Hints**:
   - Tier 1: Focus on the concept or rule.
   - Tier 2: Focus on the specific line or variable.
   - Tier 3: Detailed explanation of the failure mechanism.
4. **Draft Explanation**: Provide an in-depth post-submission breakdown of the optimal solution and common pitfalls.

# Rules
- A challenge must never test trivia, naming conventions, or obscure syntax quirks.
- Every challenge must declare the specific concept ID it evaluates for mastery tracking.

# Validation
- Reference solution passes all test cases within 1.0 second.
- Intentionally flawed submissions fail with informative test failure messages.

# Outputs
- Standardized `challenge.json` definition with companion test suite.

# Failure handling
- If learners consistently fail a challenge (>70% failure rate), decompose the prompt or add an intermediate scaffolding challenge.
