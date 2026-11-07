# Current Goal

## Objective
Ship **"JavaScript রানটাইম, গল্পে গল্পে"**: a local-first MVP where every JavaScript lesson is told as a story, shown in a real engine trace, and practiced by predicting, breaking and fixing code. Then validate it with 30–50 real learners before building any backend.

Plan: `.agent/PLANS/001-javascript-story-runtime.md` · Decisions: ADR-005, ADR-006.

## Why
The foundation (app shell, design system, lesson blocks, visualization engine) exists, but learners can't yet watch their own code run, and only 2 lessons exist. Narrowing to one language and one complete loop is the fastest way to learn whether the Kodara thesis works.

## Success Criteria
- A Web Worker trace engine produces ADR-003 events for the supported JavaScript subset. Its console order matches Node on the differential corpus, and learner code can never freeze the tab.
- Story ⇄ Engine skins render the same `RuntimeState`; story assertions pass for every lesson.
- 10 JavaScript lessons plus a capstone, in natural Bangla and English.
- All assessment evidence comes from real interactions (no auto-pass, no mock data in the learner path).
- Pilot: ≥ 35% of learners complete a full loop and return within 7 days.

## Constraints
- No backend, database or auth until the PLAN 001 M6 gate (ADR-005).
- Other tracks are frozen (Python, React, System Design, AI Engineering).
- Toolchain: npm, `npm run typecheck`, `npm test`, `npm run build`. No Zustand, ESLint, Monaco or pnpm unless a new ADR adds them.
- White + Orange design system (ADR-002); no new colors except the story token code (slate / blue / amber), which reuses existing semantic tokens.
- Never hardcode user-facing strings in components; content lives in `src/content/`, UI chrome in `src/i18n/`.
- Code and keywords stay in English.

## Current Phase
PLAN 001 · M0 — Stabilize

## Related Skills
- story-mode
- code-execution
- visualization
- lesson-design
- security
- testing
