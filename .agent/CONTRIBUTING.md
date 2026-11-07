# KODARA CONTRIBUTING GUIDE

## 1. Collaborative Engineering Standards

Kodara welcomes human engineers and AI agents working in unison. To maintain platform integrity and architectural discipline, all contributions must adhere to these standards.

## 2. Git & Branching Strategy

- **`main`**: Production branch. Always green, releasable, and verified by CI.
- **Feature Branches**: Branch from `main` using descriptive prefixes:
  - `feat/feature-name` (new product capabilities)
  - `curriculum/track-lesson` (new educational content or modules)
  - `fix/issue-description` (bug fixes or test repairs)
  - `refactor/scope` (architectural refactoring accompanied by ADR)

### Commit Message Conventions
Follow Conventional Commits:
```text
feat(lessons): implement 16-step progressive disclosure runner
fix(execution): handle null prototype heap object serialization
docs(design): document bento grid proportions and tokens
content(typescript): add variables and memory model lesson
test(sandbox): add memory-bomb isolation integration test
```

## 3. Pull Request & Agent Contribution Checklist

Before submitting or approving a Pull Request or completing an agent task, verify:

- [ ] **Context Verified**: Reviewed `.agent/PROJECT.md` and active goal in `.agent/STATE/GOAL.md`.
- [ ] **Smallest Coherent Change**: PR is scoped to one logical change; unrelated files are untouched.
- [ ] **Design Tokens Maintained**: Adheres to White + Orange + Technical Grid; no arbitrary hex colors or unapproved libraries.
- [ ] **Tests Passing**: All unit and integration tests pass cleanly (`pnpm test`).
- [ ] **Typecheck & Lint Clean**: `pnpm typecheck` and `pnpm lint` pass with zero warnings or errors.
- [ ] **Content Validated**: Any curriculum changes pass `pnpm content:validate`.
- [ ] **Security Boundaries Preserved**: Sandbox constraints intact; no client-side secret exposure.
- [ ] **State & Docs Updated**: Updated `.agent/STATE/CURRENT.md` and `.agent/STATE/NEXT.md`.
