# KODARA CONTENT AUTHORING GUIDE

## 1. Separation of Content and Code

Never hardcode lesson text, challenge prompts, or educational theory directly inside React components.

Educational content is managed as structured assets in the `content/` root directory. The application UI acts as an engine that reads, validates, renders, and executes this content.

```text
content/
├── tracks.json                 # High-level track registry
├── typescript/                 # TypeScript Track Content
│   ├── track.json              # Module ordering and track metadata
│   ├── modules/
│   │   ├── 01-runtime-foundations/
│   │   │   ├── module.json
│   │   │   └── lessons/
│   │   │       ├── 01-variables/
│   │   │   ├── lesson.json           # Canonical lesson contract
│   │   │   ├── theory.bn.md          # Natural Bangla theory & mental model
│   │   │   ├── theory.en.md          # English theory
│   │   │   ├── visualization.json    # Language-neutral state machine & steps
│   │   │   ├── playground.ts         # Shared code exercise & test cases
│   │   │   ├── break-it.bn.json      # Bangla break scenario & hints
│   │   │   ├── break-it.en.json      # English break scenario & hints
│   │   │   └── challenges/
│   │   │       ├── 01-predict-tdz.bn.json
│   │   │       └── 01-predict-tdz.en.json
│   │       └── 02-objects/
│   │   └── 02-fundamentals/
│   └── concepts/               # Concept definitions & DAG relationships
│       ├── stack-memory.json
│       ├── heap-memory.json
│       └── tdz.json
├── python/
├── react/
├── system-design/
└── ai-engineering/
```

## 2. Lesson Authoring Workflow

When authoring or updating a lesson:

1. **Define Concepts First**: Create or link existing concept IDs in `content/<track>/concepts/`. Ensure prerequisite relationships (`sourceId`, `targetId`, `relation`) are specified.
2. **Author the Bilingual Theory**:
   - `theory.bn.md`: Write natural, conversational Bangla prose. Keep technical terms in English (`Variable`, `Function`, `Scope`). Never use literal machine translation.
   - `theory.en.md`: Write concise, rigorous technical English prose with identical conceptual coverage.
3. **Design the Interactive Visualization**: Create `visualization.json` with initial state and deterministic steps highlighting stack, heap, or scope transitions. The visualization logic is language-neutral.
4. **Author the Code Playground**: Provide realistic starter code (`playground.ts`) that runs cleanly. Code is 100% identical between both language views.
5. **Create Paired "Break It" Scenarios**:
   - `break-it.bn.json`: Injected defect with natural Bangla problem statement, expected vs. observed behavior, and 3-tier Bangla hints.
   - `break-it.en.json`: Matching scenario with English hints.
6. **Construct Paired Challenges**: Add prediction, fix-the-code, or architecture challenges with localized prompts testing comprehension.
7. **Run Validation**: Execute `pnpm content:validate` to ensure zero broken links, schema violations, or missing language pairs.

## 3. Automated Content Validation

Every content addition is checked against strict structural schemas:

```bash
pnpm content:validate
```

The validation suite verifies:
- **Schema Compliance**: Every `lesson.json`, `module.json`, and `concept.json` matches its Zod schema.
- **Language Pair Completeness**: Both `bn` and `en` versions exist for all theory files, break scenarios, and challenge prompts.
- **Prerequisite Graph Integrity**: All referenced prerequisite IDs exist; no circular dependency loops exist in the DAG.
- **Code Syntax**: All TypeScript, JavaScript, and Python code snippets parse without syntax errors.
- **Visual Step Sync**: Every `step.sourceLine` points to a valid line number within the associated code sample.
- **No Orphan Concepts**: Every concept is mapped to at least one lesson or project.
