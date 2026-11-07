---
name: content-validation
version: 1.0.0
description: Validate educational curriculum integrity, JSON schemas, code syntax, and concept graph acyclicity.
requires:
  - project-context
  - curriculum
---

# Purpose
The `content-validation` skill ensures that educational content in `content/` is 100% syntactically correct, structurally compliant with Zod schemas, free of broken links, and adheres to a valid DAG without circular prerequisite loops.

# When to use
- After creating or editing any file in `content/` (`lesson.json`, `theory.md`, `visualization.json`, `track.json`).
- As part of the pre-commit hook or CI release pipeline.
- When diagnosing missing lesson assets or broken concept references.

# What not to use it for
- Building backend database tables or API route handlers.
- Styling frontend UI components.

# Required context
- [.agent/CONTENT-AUTHORING.md](file:///f:/OLama/Kodara/.agent/CONTENT-AUTHORING.md)
- [.agent/LESSON-SPEC.md](file:///f:/OLama/Kodara/.agent/LESSON-SPEC.md)
- [.agent/CURRICULUM.md](file:///f:/OLama/Kodara/.agent/CURRICULUM.md)

# Inputs
- Target curriculum directory, modified lesson files, or global content root.

# Procedure
1. **Execute Content Validator**:
   ```bash
   pnpm content:validate
   ```
2. **Schema Compliance Verification**:
   - Parse all `*.json` files against their corresponding Zod schemas.
   - Verify required properties (`id`, `title`, `trackId`, `moduleId`, `objectives`, `sections`).
3. **Graph Integrity Check**:
   - Verify every `prerequisite` ID matches an existing concept record.
   - Run depth-first search cycle detection to confirm zero circular dependencies.
4. **Code Syntax Verification**:
   - Parse every embedded TypeScript, JavaScript, and Python code sample to ensure zero syntax errors.
5. **Link & Asset Verification**:
   - Check all relative markdown links (`[text](../path)`) and image asset references.
   - Confirm no duplicate IDs exist across lessons, concepts, or challenges.

# Rules
- CI must fail if `pnpm content:validate` fails.
- Never commit content with placeholder `TODO` text or empty challenge test suites.

# Validation
- Validator reports zero schema violations, zero circular dependencies, and zero broken links.

# Outputs
- Detailed validation report listing checked files, concept count, and any syntax or reference warnings.

# Failure handling
- If validation fails, read the specific file and line error output, locate the duplicate ID or broken reference, and correct it before continuing.
