---
name: lesson-design
version: 1.0.0
description: Author, structure, and refine interactive 16-step lessons adhering to Kodara's deep understanding philosophy.
requires:
  - project-context
  - product-goals
  - curriculum
---

# Purpose
The `lesson-design` skill ensures that every lesson authored for Kodara is a world-class, interactive educational journey answering "What is it?", "Why does it exist?", "How does it work internally?", "How does it fail?", and "How do I debug it?".

# When to use
- When designing, authoring, or expanding a lesson module.
- When creating "Break-It" debugging scenarios or mental model diagrams.
- When reviewing existing curriculum content for pedagogical quality.

# What not to use it for
- Low-level database migrations or API route setup.
- General UI styling without regard to curriculum structure.

# Required context
- [.agent/LESSON-SPEC.md](file:///f:/OLama/Kodara/.agent/LESSON-SPEC.md)
- [.agent/LANGUAGE-SPEC.md](file:///f:/OLama/Kodara/.agent/LANGUAGE-SPEC.md)
- [.agent/CURRICULUM.md](file:///f:/OLama/Kodara/.agent/CURRICULUM.md)
- [.agent/CONTENT-AUTHORING.md](file:///f:/OLama/Kodara/.agent/CONTENT-AUTHORING.md)

# Inputs
- Target topic, track, learning objectives, and concept IDs.

# Procedure
1. **Identify Mental Model & Prerequisites**: Pinpoint the core physical/conceptual metaphor (e.g., execution stack as cafeteria trays, heap as an open warehouse).
2. **Structure the 16 Canonical Sections**:
   - *Context & Why*: Provide the motivating real-world problem.
   - *Mental Model & Theory*: Explain internal mechanics rigorously.
   - *Example & Visualize*: Pair minimal canonical code with a step-by-step visual simulation.
   - *Build & Execute*: Guide manual implementation and execution in playground.
   - *Inspect & Break It*: Provide an authentic broken scenario for diagnosis.
   - *Debug & Practice*: Guide the learner to identify the flaw and formulate a verified fix.
   - *Challenge & Verify*: Test edge-case comprehension.
   - *Recap & Project Connection*: Connect the concept to production architectures.
3. **Bilingual Authoring & Technical Terminology**:
   - Write `theory.bn.md` in natural, conversational, educational Bangla. Never use machine translation.
   - Write `theory.en.md` with identical conceptual rigor.
   - Apply the Bilingual Term Pattern: introduce technical terms in English paired with natural Bangla explanation (*"Variable হলো এমন একটি নামযুক্ত জায়গা..."*), then use the English term naturally.
4. **Build-It / Use-It / Compare**: Ensure higher-level abstractions are built manually before importing native equivalents.
5. **Author Paired Break-It Scenarios**: Craft a realistic bug with expected vs. observed behavior and a 3-tier hint escalation in both `break-it.bn.json` and `break-it.en.json`.
6. **Separate Files**: Store text in `theory.{bn,en}.md`, metadata in `lesson.json`, visual steps in `visualization.json`, and exercises in `playground.ts`.

# Rules
- Never write a lesson that only defines syntax without explaining internal runtime or type mechanics.
- Never use literal machine-translated Bangla; tone must sound like an authentic Bangladeshi technical educator.
- Never translate programming keywords or syntax into Bangla.
- Never hardcode lesson content directly inside React components.
- Every code sample must be valid, executable, and tested.

# Validation
- Lesson conforms strictly to the `Lesson` contract in `.agent/LESSON-SPEC.md`.
- Both `bn` and `en` content files exist and pass `pnpm content:validate`.

# Outputs
- Structured lesson assets in `content/<track>/modules/.../`.

# Failure handling
- If a lesson feels too long or overwhelming, split it into two progressive concept lessons linked via prerequisite dependencies.
