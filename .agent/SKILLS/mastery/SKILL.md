---
name: mastery
version: 1.0.0
description: Model, compute, and track multi-signal learner mastery and generate personalized spaced-repetition review queues.
requires:
  - project-context
  - curriculum
---

# Purpose
The `mastery` skill manages the mathematical and pedagogical models that compute learner concept mastery. It repudiates simple "completed/not-completed" checkboxes in favor of multi-signal evidence, tracking retention, decay, and automated review queues.

# When to use
- When implementing or tuning the mastery scoring algorithm.
- When generating personalized review queues for learner dashboards.
- When logging learning evidence events from challenges, debugging labs, or quiz attempts.

# What not to use it for
- Managing general user authentication or account settings.
- Rendering visual UI components.

# Required context
- [.agent/CURRICULUM.md](file:///f:/OLama/Kodara/.agent/CURRICULUM.md)
- [.agent/PRODUCT.md](file:///f:/OLama/Kodara/.agent/PRODUCT.md)

# Inputs
- Learner evidence event stream (attempt number, hints used, execution status, time to solve).

# Procedure
1. **Evidence Collection**: Ingest granular interaction signals:
   - Challenge outcome (pass/fail).
   - Number of attempts required before success.
   - Hint tiers unlocked (0 hints = full signal; 3 hints = reduced signal).
   - Break-It debugging diagnosis speed.
   - Project application verification.
2. **Mastery State Evaluation**: Map computed score into discrete mastery tiers:
   - `Introduced` (0% - 25%): Learner has seen theory and stepped through visualization.
   - `Practicing` (26% - 60%): Learner is solving basic guided exercises.
   - `Proficient` (61% - 84%): Learner solves challenges independently with minimal hints.
   - `Mastered` (85% - 100%): Learner diagnoses failure scenarios and passes blind edge-case tests.
   - `Needs Review`: Decay function triggered or prerequisite failure detected.
3. **Spaced Review Queue Generation**:
   - Flag concepts for review at intervals: 3 days, 7 days, 21 days, and 60 days.
   - Automatically inject review recommendations when downstream concepts fail due to prerequisite weakness.

# Rules
- Never mark a concept as "Mastered" merely because a learner opened or scrolled through a lesson page.
- Using higher-tier AI hints must reduce the mastery score increment for that attempt.

# Validation
- Simulation tests verify that repeated failures cleanly demote mastery tier and generate review queue tasks.
- Perfect first-try challenge completions increment mastery predictably.

# Outputs
- Mastery calculation engine, evidence logging services, and review recommendation APIs.

# Failure handling
- If mastery calculation anomalies or negative scores occur, clamp scores strictly between `0` and `100` and log anomalous evidence payloads for investigation.
