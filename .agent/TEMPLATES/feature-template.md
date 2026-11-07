# Feature: [Feature Name]

## Goal
A concise, single-sentence summary of what this feature accomplishes and why it matters.

## User Problem
What difficulty, friction, or gap does this feature address for the learner or engineer?

## Scope
### In Scope
- Capability 1
- Capability 2
### Out of Scope
- Explicitly deferred capabilities or future enhancements

## Architecture
- Subsystem placement (Frontend feature module, API service, or worker daemon).
- Component boundaries and data flow.
- Interaction with existing systems.

## UI
- Layout structure (Bento grid composition, card sizing).
- Design system token compliance (White + Orange + Technical Grid).
- Responsive behavior (Desktop multi-panel, Tablet collapsible, Mobile vertical stack).
- Empty, loading, and error states.

## API
- Endpoints introduced or modified.
- Request payload schemas and validation rules (Zod).
- Response models and status codes.

## State
- Server state queries and mutations (TanStack Query).
- Local ephemeral UI state (Zustand).
- Invariants and caching policies.

## Security
- Input sanitization and authorization checks.
- Sandbox constraints if executing code.
- Prompt injection protection if involving AI.

## Tests
- Unit tests: Target functions, hooks, and utilities.
- Component tests: Interactive user events and focus management.
- Integration / E2E tests: Critical user journey verification.

## Definition of Done
- [ ] Implementation complete and typecheck clean (`pnpm typecheck`).
- [ ] Tests passing (`pnpm test`).
- [ ] Accessibility verified (keyboard navigation, ARIA labels, contrast).
- [ ] Design system tokens strictly maintained.
- [ ] Documentation and `.agent/STATE/` files updated.
