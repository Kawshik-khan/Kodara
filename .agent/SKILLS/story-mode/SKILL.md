---
name: story-mode
version: 1.0.0
description: Author Story-door content for JavaScript lessons. A story-world narrative bound to real execution traces, simple enough for anyone, validated against the engine.
requires:
  - project-context
  - lesson-design
  - code-execution
  - visualization
---

# Purpose
Make every JavaScript concept understandable to *anyone*, even a learner who has never coded, through a short story in one consistent world. The story never lies about what the runtime does: each page is bound to a real trace step and checked by story assertions.

# When to use
- Writing or revising the Story door of any JavaScript lesson (PLAN 001 §5).
- Adding a character, place or prop to the JavaScript story world.
- Writing Bug Detective cases that use story framing.

# What not to use it for
- The Engine-door technical explanation (use `lesson-design`).
- Tracks other than JavaScript (frozen by ADR-005 until the M6 gate).

# Required context
- [PLAN 001](../../PLANS/001-javascript-story-runtime.md) §3–§6
- [ADR-006](../../DECISIONS/006-story-mode-two-skins.md)
- `src/content/story-world/javascript.ts` (the cast; created in PLAN 001 M3)
- [LANGUAGE-SPEC.md](../../LANGUAGE-SPEC.md)

# Inputs
- The lesson's code snippet (must be in the supported subset and in the differential corpus).
- The concept ids and the single misconception the lesson targets.

# Procedure
1. **Run the code first.** Generate the trace and list the steps where something visible changes (a push/pop, an enqueue, a console line, a heap allocation).
2. **Pick 6–10 moments.** One page per moment. Page 1 introduces the world, page 2 shows the code as "orders" and asks for a prediction, the middle pages walk the moments, and the last page reveals the result and shows the Story ↔ Code table.
3. **Cast from the world.** Use existing characters (মন্টু মামা, রাজু, ম্যানেজার, গুদামঘর…). Add a new one only if no existing element fits, and add it to `story-world/javascript.ts` with its concept mapping.
4. **Write each page:**
   - `text`: ≤ 60 words, one idea, everyday Bangla. No jargon in the story text itself.
   - `say`: optional, one short line from a character.
   - `codeNote`: one sentence that names the real concept in English terminology (“এই লাইনের আসল নাম Microtask Queue।”).
   - `atStep`: the trace step this page shows.
   - `expect`: assert the visible state (queues, stack top, console, binding values).
5. **Prediction before the reveal.** Every story asks for at least one prediction before the answer page, and records the misconception id for each wrong option.
6. **Write the English version** with the same structure. It's a peer version, not a literal translation.
7. **Validate.** Run `npm test`; the story assertion suite must pass. Read it aloud once: if a 12-year-old would stumble, simplify.

# Rules
- Never invent state. If the trace doesn't show it, the story can't say it.
- One world, one cast, one color code: slate = sync, blue = microtask, amber = macrotask (same in both skins).
- Code stays in English (`let`, `setTimeout`, `Promise`); never translate keywords.
- No emoji or stock illustrations; characters are the inline SVG components in `features/story/characters/`.
- Every visual change must have a text equivalent (`aria-live` page text) and respect `prefers-reduced-motion`.
- Bangla must sound like a friendly local teacher (তুমি form, conversational), never machine-translated.
- Keep the story short: if a lesson needs more than 10 pages, split the concept (lesson-design failure handling).

# Validation
- Story assertions pass against the real trace.
- Both `bn` and `en` pages exist with identical `atStep` and `expect`.
- The page text is ≤ 60 words, and there's at least one prediction with mapped misconceptions.

# Outputs
- `src/content/lessons/javascript/<slug>/story.ts` (a `StoryBlock`).
- Updates to `src/content/story-world/javascript.ts` when the cast grows.

# Failure handling
- Assertion fails → fix the story, not the assertion, unless the trace itself is wrong (then add a differential-corpus case and fix the engine).
- The code isn't in the supported subset → simplify the snippet; never hand-author steps for new lessons.
