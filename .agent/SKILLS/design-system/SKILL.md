---
name: design-system
version: 1.0.0
description: Implement, maintain, and enforce the canonical White + Orange + Technical Grid visual language across all Kodara UI surfaces.
requires:
  - project-context
---

# Purpose
The `design-system` skill guarantees that all user interface components, layouts, and interactive screens faithfully reflect Kodara's distinctive visual identity: high precision, crisp white surfaces, technical orange outlines, bento grid structures, and subtle Cartesian coordinate backgrounds.

# When to use
- When creating or modifying UI components (Buttons, Cards, Inputs, Modals, Navbars).
- When styling pages, lesson runners, dashboards, or playground layouts.
- When defining CSS variables, animation timings, or typography tokens.

# What not to use it for
- Defining server APIs or backend business logic.
- Authoring lesson curriculum or code challenges.

# Required context
- [.agent/DESIGN-SYSTEM.md](file:///f:/OLama/Kodara/.agent/DESIGN-SYSTEM.md)
- [.agent/DECISIONS/002-white-orange-design-system.md](file:///f:/OLama/Kodara/.agent/DECISIONS/002-white-orange-design-system.md)

# Inputs
- Component or page layout design requirements.
- Wireframes, interaction specs, or UI mockups.

# Procedure
1. **Token Alignment**: Reference canonical tokens (`--bg-app`, `--bg-surface`, `--accent-primary`, `--border-default`, `--grid-line-color`) from `.agent/DESIGN-SYSTEM.md`.
2. **Apply Technical Grid**: Ensure background surfaces feature the signature subtle orange Cartesian grid (`--grid-line-color: rgba(255, 87, 34, 0.06)`).
3. **Construct Bento Hierarchy**: Group related information into cohesive bento card arrangements with distinct sizing hierarchy (large hero card, medium stats, small tools).
4. **Style Technical Buttons**: Default to white surface with crisp 1px orange border and orange text; use filled orange backgrounds only for primary call-to-actions.
5. **Enforce Clean Typography**: Use `Inter` for interface headings/body and `JetBrains Mono` for code, variables, and step indicators.
6. **Responsive Check**: Test layout across desktop (multi-panel), tablet (collapsible panels), and mobile (stacked vertical flow).

# Rules
- Never use arbitrary inline hex color codes; always utilize semantic CSS variables.
- Never use dark neon purple/blue palettes. Orange is the sole primary accent color.
- Never use oversized pill buttons or excessive blurry drop-shadows.

# Validation
- Confirm contrast ratios exceed WCAG AA standards (4.5:1 for body text, 3:1 for large text and UI borders).
- Verify responsive layout renders cleanly down to 360px viewport width.

# Outputs
- Standardized, accessible CSS and React component implementations.

# Failure handling
- If UI renders with low contrast or inconsistent visual styles, refactor to canonical tokens immediately.
