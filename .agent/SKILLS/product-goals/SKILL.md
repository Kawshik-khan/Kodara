---
name: product-goals
version: 1.0.0
description: Protect Kodara from product drift and evaluate proposed features against the core educational learning loop.
requires:
  - project-context
---

# Purpose
The `product-goals` skill ensures that every feature, enhancement, and technical proposal directly advances Kodara's core mission: empowering learners to **understand how software works**. It acts as an architectural and product guardrail against generic feature bloat.

# When to use
- When evaluating new feature requests, UX proposals, or scope changes.
- When designing new modules, interactive tools, or dashboard widgets.
- When an agent or contributor proposes introducing new third-party integrations.

# What not to use it for
- Low-level debugging of pure algorithm bugs or CSS syntax errors.
- Internal refactorings that have zero impact on user experience or product scope.

# Required context
- [.agent/PRODUCT.md](file:///f:/OLama/Kodara/.agent/PRODUCT.md)
- [.agent/GOALS.md](file:///f:/OLama/Kodara/.agent/GOALS.md)
- [.agent/PROJECT.md](file:///f:/OLama/Kodara/.agent/PROJECT.md)

# Inputs
- Proposed feature description or user story.

# Procedure
1. **The 7-Pillar Test**: Evaluate whether the proposal directly enhances:
   - *Learning*: Does it clarify a complex engineering concept?
   - *Understanding*: Does it build an accurate mental model?
   - *Visualization*: Does it make invisible runtime state visible?
   - *Execution*: Does it involve running real or modeled code?
   - *Debugging*: Does it teach failure diagnosis or root-cause analysis?
   - *Mastery*: Does it provide verifiable evidence of competence?
   - *Building*: Does it help the learner build production software?
2. **The Anti-Drift Check**: Verify the proposal does NOT transform Kodara into:
   - A passive video lecture library.
   - A generic SaaS dashboard filled with decorative, vanity metrics.
   - A superficial multiple-choice quiz bank.
   - A black-box coding sandbox that only outputs text.
   - An unconstrained AI chatbot wrapper.
3. **Decision & Refinement**: If the feature fails these tests, reject it or reshape it into an interactive, visual, or debuggable experience.

# Rules
- Reject any feature that prioritizes visual decoration over educational comprehension.
- Never approve cosmetic metrics (e.g., "streak counters" or "XP confetti") that do not measure actual understanding.

# Validation
- The proposed feature must map to at least two stages of the 12-stage learning loop in `.agent/PRODUCT.md`.

# Outputs
- Evaluation verdict (Approved, Needs Reshaping, or Rejected) with rationale.

# Failure handling
- If a requested feature causes significant ambiguity or deviation, document the tension in `.agent/DECISIONS/` for stakeholder review.
