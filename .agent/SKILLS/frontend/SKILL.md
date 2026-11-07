---
name: frontend
version: 1.0.0
description: Build scalable, accessible, feature-sliced React 18+ and TypeScript frontend applications in Kodara.
requires:
  - project-context
  - design-system
---

# Purpose
The `frontend` skill guides the construction of modular, high-performance web features under `src/features/`. It enforces clean component architecture, TanStack Query server-state management, Zustand local state, and performance best practices.

# When to use
- When building or modifying frontend features (e.g., `features/lessons`, `features/playground`, `features/dashboard`).
- When implementing custom React hooks, routing, or page layouts.
- When optimizing bundle size, re-renders, or client-side caching.

# What not to use it for
- Authoring backend database migrations or API services (use `backend` or `database`).
- Writing raw curriculum markdown content (use `content-authoring`).

# Required context
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)
- [.agent/DESIGN-SYSTEM.md](file:///f:/OLama/Kodara/.agent/DESIGN-SYSTEM.md)
- [.agent/LANGUAGE-SPEC.md](file:///f:/OLama/Kodara/.agent/LANGUAGE-SPEC.md)
- [.agent/DEVELOPMENT.md](file:///f:/OLama/Kodara/.agent/DEVELOPMENT.md)

# Inputs
- Frontend feature requirement, wireframe, or user story.

# Procedure
1. **Module Placement**: Place the feature code in `src/features/<feature-name>/`.
2. **Sub-Folder Organization**: Structure feature directories cleanly:
   ```text
   features/<name>/
   ├── api/          # Custom hooks wrapping TanStack Query (e.g., useLessonQuery)
   ├── components/   # Feature-specific UI components
   ├── hooks/        # Feature-specific custom hooks
   ├── stores/       # Zustand store for feature UI state if needed
   ├── types/        # Feature TypeScript interfaces
   └── index.ts      # Public API exports
   ```
3. **State Separation**:
   - Query remote data using TanStack Query.
   - Store purely ephemeral UI state (e.g., active tab, drawer open) in Zustand.
   - Do NOT duplicate query cache into Zustand.
4. **Localization (i18n)**:
   - Extract all user-facing strings into `src/i18n/locales/{bn,en}/`.
   - Consume strings via `useTranslation()` (`t("feature.action")`).
   - Never hardcode raw text in JSX.
5. **Bilingual Responsive Layout**:
   - Design buttons and navigation items with flexible padding and `min-width` to accommodate Bangla text expansion (+20%–35% width).
   - Never use fixed-width text containers.
6. **Lazy Loading**: Lazy-load heavy dependencies (Monaco Editor, React Flow, large visualization engines) using `React.lazy` and `Suspense`.
7. **Form & Input Handling**: Use controlled inputs with accessible labels, error indicators, and focus management.

# Rules
- Do not create monolithic, 500+ line React components. Break down into focused subcomponents.
- Never hardcode user-facing strings directly in JSX.
- Use explicit TypeScript interfaces for props (`interface Props {}`).
- Always handle loading, error, and empty states explicitly.

# Validation
- `pnpm typecheck` passes with zero errors.
- Component renders cleanly in both `বাংলা` and `English` without text clipping or horizontal overflow.
- All interactive elements have descriptive IDs and ARIA labels.

# Outputs
- Clean, type-safe React components, hooks, and tests.

# Failure handling
- If component state becomes tangled, extract the logic into a standalone custom hook with isolated unit tests.
