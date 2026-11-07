# KODARA ACTIVE BLOCKERS

This document tracks active blockers affecting the Kodara engineering workflow.
Every entry must document:
- **Issue**: Precise description of the blocker
- **Impact**: Systems, features, or timelines affected
- **Cause**: Root cause analysis
- **Owner**: Person or agent role responsible
- **Workaround**: Temporary mitigation if available
- **Resolution**: Long-term fix and closing criteria

---

## Active Blockers

### B-001 · No version control
- **Issue**: The repository is not a git repository.
- **Impact**: No history, review, rollback or CI. A bad agent edit can't be undone. Blocks safe execution of PLAN 001 M1+.
- **Cause**: The project was bootstrapped without `git init`.
- **Owner**: Product owner (approval) + principal agent.
- **Workaround**: Make small changes and verify them with typecheck, tests and build after each one.
- **Resolution**: `git init` + `.gitignore` + initial commit (PLAN 001 M0 step 1). Close when the first commit exists.

### B-002 · Assessment evidence can be fake
- **Issue**: Challenge test cases without `testFunctionCode` auto-pass; code runs via `new Function` on the main thread.
- **Impact**: Learners get false "correct" feedback, mastery data is corrupted, and an infinite loop freezes the tab.
- **Cause**: The simulated evaluator was left in the production path.
- **Owner**: Principal agent.
- **Workaround**: None in the product; treat all current challenge results as unverified.
- **Resolution**: PLAN 001 M0 step 2 (`not_verified` status) and M1 step 6 (worker execution). Close when no auto-pass path exists and a test proves it.

---

## Resolved Blockers Log

*(Entries moved here upon resolution)*
