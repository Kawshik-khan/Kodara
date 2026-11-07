# KODARA DEVELOPMENT WORKFLOW

## 1. The Engineering Lifecycle

Every development task in Kodara follows a disciplined, reproducible engineering lifecycle:

```text
1. Load Project Context   → Read .agent/PROJECT.md, CURRENT.md, GOAL.md
2. Identify Active Goal   → Check exact scope and success criteria
3. Inspect Implementation → Check existing code, tests, and configurations
4. Load Relevant Skills   → Activate specialized .agent/SKILLS/*
5. Formulate Plan         → Outline smallest coherent change
6. Implement Changes      → Clean, type-safe, accessible code
7. Run Tests              → Vitest unit and integration suites
8. Run Typecheck & Lint   → Verify zero TypeScript or ESLint errors
9. Security & Access Check→ Sandbox constraints, sanitization, auth boundaries
10. Verify UX & Visuals   → White + Orange design system consistency
11. Update Persistent State→ Update .agent/STATE/CURRENT.md, NEXT.md
12. Finish & Report       → Clear summary of changes, tests, and next actions
```

## 2. Principle of the "Smallest Coherent Change"

Never attempt sprawling, multi-feature refactors when implementing a single focused task.

A change must have:
1. **Clear Objective**: Solves one clearly articulated problem or introduces one discrete feature.
2. **Limited Scope**: Does not touch unrelated files or rewrite working patterns without an approved ADR.
3. **Verifiable Result**: Accompanied by automated tests or reproducible verification steps.
4. **Clean Rollback**: Can be reverted atomically without destabilizing the rest of the application.

## 3. Code Standards & Conventions

### TypeScript & React
- Strict TypeScript enabled (`noImplicitAny: true`, `strictNullChecks: true`).
- Use functional components with explicit prop interfaces (`interface Props {}`).
- Colocate feature-specific components, hooks, and tests within their respective `features/<name>/` directory.
- Use explicit named exports for shared components and hooks.
- Server state must be accessed via TanStack Query custom hooks (`useLessonQuery`, `useExecutionMutation`).
- Client UI state must be minimal and stored in Zustand stores (`useLayoutStore`, `useTracePlaybackStore`).

### Styling & CSS
- Adhere strictly to the design tokens in `.agent/DESIGN-SYSTEM.md`.
- Never use inline hardcoded color hex values (`#ff0000`, `#0000ff`). Always use semantic CSS variables (`var(--accent-primary)`, `var(--text-secondary)`).
- Never introduce non-standard color palettes without a formal ADR.

## 4. Verification & Quality Commands

Always discover and execute actual project verification commands:

```bash
# Code Quality
pnpm lint               # ESLint checking
pnpm typecheck          # TypeScript compiler check (tsc --noEmit)

# Testing
pnpm test               # Run Vitest test suites
pnpm test:e2e           # Run Playwright end-to-end tests

# Content & Curriculum
pnpm content:validate   # Validate educational JSON/Markdown schemas

# Production Build
pnpm build              # Build production bundle and verify asset hashing
```

## 5. Agent Reporting Standard

Upon completing an engineering task, always summarize work with this structured report:
- **What Changed**: Brief bullet points of exact additions or modifications.
- **Why**: The architectural or educational rationale behind the decision.
- **Files Affected**: Clickable links to every created or modified file.
- **Verification Performed**: Output summary of tests, typecheck, or lint commands run.
- **Security & UX Considerations**: Notes on sandbox isolation or design tokens verified.
- **Next Recommended Step**: Single high-priority next task aligned with `.agent/STATE/NEXT.md`.
