---
name: accessibility
version: 1.0.0
description: Enforce WCAG AA standards, semantic HTML, keyboard navigation, and textual alternatives for interactive simulations.
requires:
  - project-context
  - design-system
---

# Purpose
The `accessibility` skill ensures that Kodara is fully usable by engineers of all abilities. Because Kodara relies heavily on visual simulations, this skill guarantees that every visual state transition has a first-class, structured textual alternative, screen reader support, and full keyboard control.

# When to use
- When designing or reviewing interactive visualization components.
- When building forms, navigation bars, modals, or custom controls.
- When testing color contrast or reduced motion behavior.

# What not to use it for
- Backend database schema design or worker container isolation.

# Required context
- [.agent/DESIGN-SYSTEM.md](file:///f:/OLama/Kodara/.agent/DESIGN-SYSTEM.md)
- [.agent/LANGUAGE-SPEC.md](file:///f:/OLama/Kodara/.agent/LANGUAGE-SPEC.md)
- [.agent/VISUALIZATION-SPEC.md](file:///f:/OLama/Kodara/.agent/VISUALIZATION-SPEC.md)

# Inputs
- Component markup, page template, or interactive canvas specification.

# Procedure
1. **Semantic HTML Hierarchy**:
   - Use standard elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`).
   - Ensure exactly one `<h1>` per page, followed by properly nested `<h2>`, `<h3>` tags.
2. **Keyboard Navigation & Focus Management**:
   - Ensure all interactive elements (`button`, `a`, `input`, custom controls) are reachable via `Tab`.
   - Provide visible, high-contrast focus rings (`var(--accent-primary)` with 2px offset).
   - Ensure visual scrubbers support standard arrow keys (`ArrowLeft`, `ArrowRight`, `Space`, `r`).
3. **Bangla Typography & Glyph Accessibility**:
   - Verify `Noto Sans Bengali` loads properly without missing glyph boxes or broken conjuncts.
   - Maintain minimum `1.6` line-height on body text to provide vertical clearance for Bengali matras and conjuncts.
   - Do NOT apply artificial letter-spacing to Bangla text (avoids severing connected ligature glyphs).
4. **Screen Reader Alternatives for Visualizations**:
   - Provide hidden or toggleable live region (`aria-live="polite"`) narrating active state changes in the active language:
     *(e.g., Bangla: "ধাপ ৩: 'count' variable-এ প্রাথমিক মান 0 নির্ধারণ করা হয়েছে")*.
   - Add descriptive `aria-label` or `alt` attributes to all SVG diagrams and icons.
5. **Color Contrast Verification**:
   - Confirm body text contrast against white/off-white surfaces meets or exceeds 4.5:1.
   - Confirm UI borders and large headings meet or exceed 3:1 contrast.
6. **Reduced Motion**:
   - Respect `prefers-reduced-motion: reduce` by zeroing out transitions and disabling continuous animations.

# Rules
- Never create a purely visual simulation that lacks a corresponding textual explanation.
- Never remove CSS outline/focus indicators without providing an accessible high-contrast alternative.
- Never use non-interactive `<div>` or `<span>` elements as buttons without full ARIA role and keyboard handling.
- Never artificially increase letter-spacing on Bangla text.

# Validation
- Automated accessibility audits (e.g., axe-core / Playwright accessibility scan) produce zero critical or serious violations.
- Bangla text renders legibly with zero overlapping conjunct glyphs.

# Outputs
- Accessible, semantic React components and ARIA-annotated visualizers.

# Failure handling
- If a custom interactive canvas fails keyboard accessibility, wrap it with standard HTML control buttons and an ARIA live status region.
