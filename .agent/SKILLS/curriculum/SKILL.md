---
name: curriculum
version: 1.0.0
description: Manage the educational taxonomy, track sequencing, module progression, and concept prerequisite DAG.
requires:
  - project-context
  - product-goals
---

# Purpose
The `curriculum` skill maintains the integrity of Kodara's global knowledge graph, track structures, module taxonomies, and directed acyclic graph (DAG) of concept dependencies.

# When to use
- When introducing a new learning track or module.
- When mapping new concept relationships (`prerequisite`, `builds-on`, `related`).
- When diagnosing unlock order issues or broken learning paths.

# What not to use it for
- Authoring individual lesson text or challenge code (use `lesson-design` or `challenges`).
- Developing frontend UI components.

# Required context
- [.agent/CURRICULUM.md](file:///f:/OLama/Kodara/.agent/CURRICULUM.md)
- [.agent/CONTENT-AUTHORING.md](file:///f:/OLama/Kodara/.agent/CONTENT-AUTHORING.md)

# Inputs
- Curriculum proposal, new concept definition, or track re-sequencing request.

# Procedure
1. **Model Concepts as Entities**: Ensure each concept has a unique slug, track ID, module ID, and complexity score (1–5).
2. **Define Directed Relationships**: Specify the source and target concept IDs and relationship type:
   - `prerequisite`: Must be mastered before unlocking the target.
   - `builds-on`: Direct natural progression.
   - `related`: Lateral cross-track connection (e.g., Python closures related to JS closures).
3. **Cycle Detection**: Run graph validation to prove there are zero circular dependency cycles (`A → B → C → A`).
4. **Track Sequencing**: Ensure modules follow progressive cognitive difficulty (e.g., Runtime Foundations → Fundamentals → Advanced Types).
5. **Seed Integrity**: Maintain alignment with the initial seed curriculum defined in `.agent/CURRICULUM.md`.

# Rules
- Never hardcode prerequisite sequences solely inside frontend UI components; prerequisites must exist in domain data.
- Every concept must connect to at least one lesson and have explicit mastery evaluation criteria.

# Validation
- `pnpm content:validate` verifies graph acyclicity and completeness.

# Outputs
- Updated `content/<track>/track.json`, module registries, and concept relationship files.

# Failure handling
- If a circular prerequisite is detected, break the cycle by decomposing one of the concepts into smaller atomic primitives.
