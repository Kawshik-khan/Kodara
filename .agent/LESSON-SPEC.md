# KODARA LESSON SPECIFICATION

## 1. Lesson Design Philosophy

A Kodara lesson is not a blog post or static documentation page. It is an **orchestrated interactive learning journey**.

Every lesson must answer:
1. **What is it?** (Concrete definition and mental model)
2. **Why does it exist?** (The historical or engineering problem it solves)
3. **How does it work internally?** (Memory allocation, AST parsing, or runtime execution)
4. **How do I use it?** (Manual construction and practical application)
5. **How does it fail?** (Common anti-patterns, edge cases, and runtime bugs)
6. **How do I debug it?** (Diagnostic tracing and root-cause analysis)
7. **Where is it used in production?** (Real-world system architectural context)

## 2. The 16-Step Canonical Lesson Structure

While not every lesson displays all 16 sections simultaneously, the underlying schema supports the full 16-step progression:

```text
 1. Context             → Real-world scenario setting the stage
 2. Why                 → The problem that necessitates this concept
 3. Mental Model        → Conceptual diagram or visual metaphor
 4. Theory              → Rigorous technical explanation
 5. Example             → Minimal canonical code demonstration
 6. Visualize           → Step-by-step interactive simulation of state
 7. Build               → Constructing the concept or abstraction by hand
 8. Execute             → Running the code in the interactive runtime
 9. Inspect             → Querying call stack, scope, variables, and heap
10. Break It            → Injected failure scenario
11. Debug               → Diagnosing the defect using traces and fixing it
12. Practice            → Guided variation tasks reinforcing nuance
13. Challenge           → Independent assessment of understanding
14. Verify              → Test suite execution confirming edge cases
15. Recap               → Key takeaways and common pitfalls summary
16. Project Connection  → Direct link to where this applies in a capstone project
```

## 3. TypeScript Lesson Contract

All lessons conform to this strongly-typed interface:

```ts
export interface Lesson {
  id: string;
  slug: string;
  language: "bn" | "en";
  title: string;
  description: string;

  trackId: string;
  moduleId: string;
  order: number;

  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;

  objectives: LearningObjective[];
  prerequisites: string[]; // Concept IDs
  conceptsTaught: string[]; // Concept IDs

  sections: LessonSection[];

  visualization?: VisualizationDefinition;
  playground?: PlaygroundDefinition;
  breakScenario?: BreakScenario;
  challenges: ChallengeDefinition[];
  assessment?: AssessmentDefinition;
  projectReference?: ProjectReference;
}

export interface LearningObjective {
  id: string;
  statement: string; // e.g., "Differentiate between stack value allocation and heap object references"
}

export interface LessonSection {
  id: string;
  type:
    | "context"
    | "why"
    | "mental-model"
    | "theory"
    | "example"
    | "visualize"
    | "build"
    | "execute"
    | "inspect"
    | "break-it"
    | "debug"
    | "practice"
    | "challenge"
    | "verify"
    | "recap"
    | "project-connection";
  title: string;
  contentMarkdown: string;
  interactiveComponentId?: string;
}
```

## 4. Build-It / Use-It / Compare Pattern

For lessons introducing higher-level language features or architectural patterns:

```text
Step 1: Build It   → Implement the abstraction manually (e.g., custom Promise polyfill or generic filter)
Step 2: Use It     → Run realistic data through the manual abstraction
Step 3: Compare    → Substitute the native language or production implementation
                     Compare performance, type inference, and edge-case handling
```

Never import an off-the-shelf library before learners understand the underlying manual mechanics.

## 5. "Break-It" Mode Specification

"Break It" turns passive learners into active diagnosticians.

```ts
export interface BreakScenario {
  id: string;
  title: string;
  conceptId: string;
  description: string;

  workingCode: string;
  brokenCode: string;

  expectedBehavior: string;
  observedBehavior: string;

  errorOutput?: string;
  traceHighlightStepIndex?: number;

  hints: BreakHint[];
  solutionExplanation: string;
  testSuite: string;
}

export interface BreakHint {
  level: 1 | 2 | 3;
  text: string;
}
```

### Example Break Scenarios Across Tracks
- **TypeScript**: Broken generic constraint resulting in unexpected `unknown` narrowing or unsafe type assertions.
- **Python**: Mutating a default mutable argument (`def append_to(item, list=[])`) causing cross-call state pollution.
- **React**: Missing hook dependency resulting in a stale closure capturing an outdated counter value.
- **System Design**: Injected network latency between app server and database causing worker connection exhaustion.
- **AI Engineering**: Unbounded user prompt concatenating directly into an LLM instructions block, demonstrating prompt injection.

## 6. Bilingual Lesson Guidelines

Every lesson adheres to the [LANGUAGE-SPEC.md](file:///f:/OLama/Kodara/.agent/LANGUAGE-SPEC.md) standards:

1. **Natural Bangla Explanation**: Concepts are introduced in conversational, beginner-friendly Bangla. Never use word-for-word machine translation.
2. **English Technical Vocabulary**: Terms like `Variable`, `Function`, `Scope`, `Closure`, `State`, `Props`, and `Promise` remain in English, introduced once with a natural Bangla explanation and thereafter used naturally.
3. **Identical Code Examples**: The code examples, variable names, and test suites are 100% identical between `bn` and `en` versions. Code syntax is never translated.
4. **Progressive Bangla Hints**: Break-It hints provide progressive nudges in natural Bangla:
   - Level 1: Conceptual nudge pointing to the invariant.
   - Level 2: Diagnostic question directing focus to a specific line or value.
   - Level 3: Concrete fix guidance explaining the `=` assignment or syntax.

## 7. Story Mode (JavaScript track, ADR-006)

JavaScript lessons group the 16 steps into three doors, all driven by one real execution trace:

| Door | Canonical steps | Content |
| :--- | :--- | :--- |
| **গল্প / Story** | 1 Context · 2 Why · 3 Mental Model | 6–10 story pages in the shared story world, ≤ 60 words each, one idea per page, with a prediction before the reveal |
| **ইঞ্জিন / Engine** | 4 Theory · 5 Example · 6 Visualize · 8 Execute · 9 Inspect | The same trace with technical names (stack, heap, queues, console); Story ⇄ Engine toggle at any step |
| **খেলা / Play** | 7 Build · 10 Break It · 11 Debug · 12–14 Practice/Challenge/Verify · 15 Recap · 16 Project | Predict, Fork the Timeline, Fix-it (verified by a real run), Bug Detective, recap card |

Story pages are a `story` block (`StoryBlock` / `StoryPage`, see PLAN 001 §6.4). Every page binds to a trace step (`atStep`) and may declare `expect` assertions. The content test suite fails if an assertion disagrees with the real trace. Authoring procedure: `.agent/SKILLS/story-mode/SKILL.md`.
