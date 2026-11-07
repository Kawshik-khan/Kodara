---
name: release
version: 1.0.0
description: Execute comprehensive pre-release validation gates, build verification, and deployment readiness checks.
requires:
  - project-context
  - testing
  - security
  - content-validation
---

# Purpose
The `release` skill governs the final verification checklist before any code or curriculum is merged to `main` or deployed to staging/production. It ensures zero unverified claims and zero broken builds.

# When to use
- Prior to merging feature branches into `main`.
- When preparing a production release tag.
- When validating that a completed milestone satisfies its full Definition of Done.

# What not to use it for
- Everyday intermediate coding edits or scratch testing.

# Required context
- [.agent/DEVELOPMENT.md](file:///f:/OLama/Kodara/.agent/DEVELOPMENT.md)
- [.agent/CONTRIBUTING.md](file:///f:/OLama/Kodara/.agent/CONTRIBUTING.md)
- [.agent/STATE/ROADMAP.md](file:///f:/OLama/Kodara/.agent/STATE/ROADMAP.md)

# Inputs
- Release candidate commit, pull request branch, or milestone tag.

# Procedure
1. **Linting & Code Hygiene**:
   ```bash
   pnpm lint
   ```
   Must exit with code 0 and zero warnings.
2. **Typecheck Verification**:
   ```bash
   pnpm typecheck
   ```
   TypeScript compiler must report zero errors across all workspaces.
3. **Automated Test Suites**:
   ```bash
   pnpm test
   pnpm test:e2e
   ```
   100% of unit, integration, trace integrity, and E2E tests must pass.
4. **Educational Content Validation**:
   ```bash
   pnpm content:validate
   ```
   All curriculum schemas, code snippets, and DAG relationships must be validated.
5. **Production Bundle Compilation**:
   ```bash
   pnpm build
   ```
   Vite/Rollup must produce static bundles without unresolved imports or asset warnings.
6. **Security & Dependency Audit**:
   - Check `pnpm audit` for critical CVEs.
   - Verify sandbox container isolation flags (`--net=none`, non-root, cgroups limits).
7. **State & Documentation Update**:
   - Update `.agent/STATE/CURRENT.md` to reflect new release milestone.
   - Update `.agent/STATE/ROADMAP.md` if milestone is completed.

# Rules
- Never deploy or merge based on assumptions; every verification command must actually execute.
- Never bypass a failing test or disable a typecheck rule to force a release.

# Validation
- All six pre-flight commands exit cleanly with return code 0.

# Outputs
- Release verification summary report confirming all release gates have passed.

# Failure handling
- If any gate fails, abort the release immediately, identify the offending commit, and apply a targeted fix.
