---
name: testing
version: 1.0.0
description: Design, write, and run unit, integration, visual regression, and end-to-end test suites.
requires:
  - project-context
  - architecture
---

# Purpose
The `testing` skill governs the verification of all Kodara software components, ensuring that AST trace generators, execution sandboxes, curriculum schemas, and UI components operate with absolute correctness.

# When to use
- When writing unit tests for new services, utilities, or state stores.
- When writing component tests for UI elements or timeline controls.
- When validating trace generation against complex language edge cases.
- Before preparing a release or submitting a major pull request.

# What not to use it for
- Manual ad-hoc debugging without codifying the fix into a reproducible test.

# Required context
- [.agent/TESTING.md](file:///f:/OLama/Kodara/.agent/TESTING.md)
- [.agent/LANGUAGE-SPEC.md](file:///f:/OLama/Kodara/.agent/LANGUAGE-SPEC.md)
- [.agent/DEVELOPMENT.md](file:///f:/OLama/Kodara/.agent/DEVELOPMENT.md)

# Inputs
- Target code unit, feature implementation, bug reproduction script, or user journey.

# Procedure
1. **Unit & Component Testing (Vitest + RTL)**:
   - Test pure functions, mastery math, and AST transformers with comprehensive boundary conditions.
   - Render React components using React Testing Library; assert user interactions via `@testing-library/user-event`.
   - Mock backend network requests using Mock Service Worker (MSW).
2. **Bilingual UI Testing**:
   - Render components under both `bn` and `en` locale providers.
   - Verify that no translation keys fail or render as raw key strings (`common.undefined_key`).
   - Verify layout container widths accommodate Bangla text expansion without visual clipping.
   - Test that toggling language does not reset user form input or editor code.
3. **Trace Verification Testing**:
   - Execute sample code through the trace adapter.
   - Assert exact sequence of `TraceEvent` objects for closures, hoisting, promises, and object mutations.
4. **Sandbox Security Testing**:
   - Execute test payloads (infinite loops, memory bombs, socket connections) against worker runners and verify clean, bounded failure.
5. **End-to-End Testing (Playwright)**:
   - Run browser automation testing the complete reference user journey in both Bangla and English.
6. **Execution of Test Suites**:
   - Run `pnpm test` for unit/integration suites.
   - Run `pnpm test:e2e` for Playwright browser suites.

# Rules
- Never write tests that test implementation details; test observable behavior and state contracts.
- Every discovered bug must be accompanied by a failing test that passes after the fix.
- Flaky tests must be quarantined and fixed immediately, never ignored.

# Validation
- 100% of test suites execute and pass with zero failures.
- No untranslated keys or layout clipping in either `bn` or `en`.

# Outputs
- Automated test files colocated with features (`*.test.ts`, `*.test.tsx`) or in `e2e/`.

# Failure handling
- If a test fails in CI, diagnose the failure locally using `pnpm test -- --reporter=verbose`, isolate root cause, and verify fix before committing.
