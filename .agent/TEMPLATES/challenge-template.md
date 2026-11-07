# Challenge: [Challenge Title]

## Concept
The concept ID evaluated by this challenge (e.g., `temporal-dead-zone`, `generic-constraints`, `stale-closures`).

## Objective
The concrete competency or understanding being verified.

## Archetype
`predict-output` | `trace-reasoning` | `fix-code` | `write-code` | `debug-failure` | `architecture-decision`

## Prompt
The learner-facing instruction presented in the challenge interface.

## Input / Starter State
The initial code or architecture graph provided to the learner:

```typescript
// Initial starter code or broken scenario
```

## Expected Outcome
The target behavior, return value, or output upon passing.

## Hints
Progressive multi-tiered hints:
- **Hint 1 (Conceptual Nudge)**: A gentle pointer toward the governing rule or mental model.
- **Hint 2 (Diagnostic Question)**: A specific line or variable to inspect.
- **Hint 3 (Detailed Explanation)**: A technical walkthrough of the discrepancy.

## Tests
Test suite executed to evaluate the learner's submission:
- **Visible Test Cases**: 2-3 standard test cases visible to the learner.
- **Hidden Test Cases**: 2-3 boundary and edge-case tests validating robustness.

## Explanation
Comprehensive post-submission explanation detailing why the solution works, what mental model applies, and what common traps exist.

## Mastery Signal
How this challenge impacts the learner's mastery score:
- First-attempt success: Full mastery increment (+15% to target concept).
- Multiple attempts / hints used: Scaled mastery increment (+5% to +10%).
- Failure: Triggers recommendation for targeted review.
