# ADR 006: Story Mode, One Trace with Two Skins

## Context
Kodara's audience includes absolute beginners and learners who think best in Bangla. A design prototype showed that a single consistent story world makes the event loop understandable to anyone:
- মন্টু মামার চায়ের দোকান: one cook = the single thread;
- জরুরি খাতা = microtasks;
- সাধারণ লাইন = macrotasks;
- ম্যানেজার = the event loop.

But a hand-written story risks contradicting the real runtime. That would violate AGENT.md §6 ("never create fake execution traces").

## Decision
1. Every JavaScript lesson opens with a **Story** door, followed by **Engine** and **Play** doors (PLAN 001 §3).
2. The Story skin and the Engine skin render the **same `RuntimeState`**, produced from one real trace (ADR-003 events from the Web Worker engine, ADR-005). Learners can toggle between skins at any step without losing their place.
3. Each story page binds to a trace step (`atStep`) and may declare **story assertions** (`expect`). The content test suite runs the lesson code, rebuilds the state, and fails if an assertion disagrees.
4. All JavaScript lessons share one **story world** (cast, places, colors) defined once in `src/content/story-world/javascript.ts`. New metaphors are added there, never ad hoc inside a lesson.
5. Authoring rules live in the `story-mode` skill (`.agent/SKILLS/story-mode/SKILL.md`).

## Alternatives Considered
- **Static illustrated stories without trace binding:** rejected. They can't be validated and will drift from the truth.
- **A different metaphor per lesson:** rejected. Learners would have to relearn the pictures every time, and the cast stops working as a memory aid.
- **Engine view only:** rejected. Beginners drop off before the technical view makes sense.

## Consequences
### Positive
- Lessons are accessible to anyone, and accurate by construction.
- One renderer investment serves every lesson.
- The Story ⇄ Engine toggle teaches the vocabulary mapping directly.

### Negative / Tradeoffs
- Every story page needs a trace binding and assertions, so authoring is a little slower.
- Story-world components are a new UI surface that must meet the accessibility rules (text equivalents, reduced motion).

## Status
Accepted

## Date
2026-10-25
