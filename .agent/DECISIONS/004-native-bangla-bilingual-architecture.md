# ADR 004: Native Bangla Bilingual Language Architecture

## Context
Software engineering education in Bangladesh and the global Bengali-speaking diaspora faces a stark divide: English-only platforms create high cognitive friction for conceptual intuition, while fully translated platforms translate programming terms into obscure, unusable Bengali neologisms (e.g., translating "variable" or "thread") that isolate learners from industry standards. Kodara requires an architecture that provides native, conversational Bangla conceptual instruction while maintaining standard English programming syntax and industry terminology.

## Decision
We adopt **Native Bangla Bilingual Architecture** as a first-class, foundational system capability:
1. **Bangla as Default (`bn`)**: The default product language is Bangla across UI, lessons, instructions, diagnostics, and AI tutoring.
2. **Natural Bangla, Not Translation**: Content is authored natively from the perspective of an experienced technical educator, avoiding literal or machine-translated prose.
3. **English Technical Terminology**: Programming syntax, code tokens, APIs, and industry technical terms (`Variable`, `Function`, `State`, `Props`, `Promise`, `API`, etc.) remain in English, introduced with natural Bangla explanations.
4. **Centralized UI Localization**: All UI strings are extracted into semantic translation dictionaries (`src/i18n/locales/{bn,en}/*.ts`). Hardcoded user-facing strings are strictly forbidden.
5. **Decoupled Canonical Data Models**: Databases, API schemas, and business logic remain strictly language-neutral, storing canonical identifiers (`status: "in_progress"`). Localization is purely a presentation concern.
6. **Bilingual AI Tutoring**: The Socratic AI Tutor dynamically mirrors the learner's active language, explaining concepts in natural Bangla while keeping code and technical keywords in English.

## Alternatives Considered
- **English-Only Baseline with Machine Translation Plugin**: Rejected because automated translation produces unnatural, disjointed, and inaccurate technical explanations.
- **Full Bengali Translation (including code syntax & keywords)**: Rejected because localized code keywords create a non-transferable toy skill that does not prepare learners for real-world software engineering.
- **Hardcoding Bilingual Strings in Components**: Rejected because it creates unmaintainable JSX bloat and breaks consistency.

## Consequences
### Positive
- Deep cognitive understanding of software mechanics for Bengali-speaking learners.
- Seamless acquisition of industry-standard English technical vocabulary.
- Clean separation between presentation (`i18n`) and business/data models.
- Responsive layout resilience due to accounting for Bangla text expansion from day one.
### Negative / Tradeoffs
- Every new lesson and UI feature requires paired authoring (`bn` and `en`).
- UI layouts must be tested in both languages to prevent horizontal overflow.

## Status
Accepted

## Date
2026-09-09
