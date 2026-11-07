# ADR 002: Canonical White + Orange + Technical Grid Visual Language

## Context
Educational platforms often suffer from visual identity crises: either adopting dark, fluorescent-heavy "hacker terminal" aesthetics that cause cognitive fatigue during extended reading, or adopting generic, playful pastel styles that diminish engineering seriousness. Kodara requires a distinct, authoritative aesthetic that communicates technical precision, high readability, and architectural structure.

## Decision
We establish **White + Orange + Technical Grid** as the permanent, canonical visual language for Kodara:
1. **Surfaces**: Crisp white (`#FFFFFF`) and warm off-white (`#FAFAFA`) surfaces providing optimal contrast and legibility.
2. **Primary Accent**: High-visibility engineering Orange (`#FF5722` / `#F4511E`) used for structural outlines, active timeline indicators, and focused interactions.
3. **Subtle Technical Grid**: A Cartesian coordinate grid rendered in ultra-low opacity orange tint (`rgba(255, 87, 34, 0.06)`) on background surfaces, evoking engineering graph paper without impairing text legibility.
4. **Bento Card Structure**: White solid cards enclosed with crisp 1px borders, organized into disciplined visual hierarchies.
5. **Technical Button Language**: Action buttons favor white surfaces with crisp orange borders and orange typography, reserving filled orange backgrounds strictly for high-emphasis primary triggers.

## Alternatives Considered
- **Dark Mode Terminal Aesthetic**: Rejected due to poor text legibility for lengthy technical prose and common fatigue.
- **Generic SaaS Blue/Purple Palette**: Rejected because it dilutes brand distinctiveness and feels like generic enterprise software rather than an interactive engineering instrument.
- **Tailwind Utility Sprawl**: Deferred; Vanilla CSS custom property tokens provide maximum precision, zero build overhead, and prevent accidental token drift.

## Consequences
### Positive
- Instantly recognizable brand identity.
- Exceptional text readability for in-depth engineering theory and code analysis.
- Structured, bento-first layout guarantees information density without visual chaos.
### Negative / Tradeoffs
- Engineers must adhere to strict token usage (`var(--accent-primary)`, `var(--border-default)`) and resist introducing ad-hoc hex values or unapproved neon colors.

## Status
Accepted

## Date
2026-09-09
