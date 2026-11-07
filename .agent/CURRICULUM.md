# KODARA CURRICULUM ARCHITECTURE

## 1. Educational Hierarchy

Kodara organizes knowledge into a structured, graph-backed educational taxonomy:

```text
Track (e.g., TypeScript)
  └── Module (e.g., JavaScript Runtime Foundations)
        └── Lesson (e.g., Variables & Memory Model)
              └── Concepts (e.g., stack-allocation, heap-reference, TDZ)
                    └── Prerequisite Relationships (DAG)
                          └── Practical Experiences (Build, Visualize, Break)
                                └── Challenges & Assessments
                                      └── Multi-Signal Mastery
```

## 2. The Concept Prerequisite Graph

Prerequisites are modeled as first-class domain relationships, not hardcoded UI sequences. This enables dynamic unlocking, personalized review queues, and non-linear learning paths.

```ts
interface Concept {
  id: string;
  slug: string;
  title: string;
  trackId: string;
  moduleId: string;
  summary: string;
  complexity: 1 | 2 | 3 | 4 | 5;
}

interface ConceptRelationship {
  sourceId: string; // Target concept depends on source concept
  targetId: string;
  relation:
    | "prerequisite"   // Must be understood before target
    | "builds-on"      // Direct conceptual extension
    | "related"        // Lateral conceptual connection
    | "part-of"        // Compositional relationship
    | "used-in";       // Applied inside an architectural pattern
}
```

## 3. Seed Curriculum: TypeScript Track

The initial implementation slice focuses on the TypeScript track, structured into three foundational modules:

### Module 1: JavaScript Runtime Foundations
Before understanding TypeScript's type system, learners must understand how JavaScript executes in memory:

1. **Variables & Memory Model**:
   - Primitive values vs. reference types.
   - Stack memory (execution frames) vs. Heap memory (objects, arrays).
   - `let`, `const`, and the Temporal Dead Zone (TDZ).
2. **Objects & Reference Semantics**:
   - Pointer reference vs. value equality.
   - Shallow copying vs. deep cloning.
   - Garbage collection basics and unreachable memory.
3. **Functions & Execution Context**:
   - Global execution context vs. function execution context.
   - Call stack mechanics and stack overflow.
   - Parameter passing by value vs. reference.
4. **Scope Chains & Closures**:
   - Lexical environment and outer environment references.
   - Closure mechanics: how functions retain references to outer scopes.
   - Memory retention and accidental closure leaks.
5. **The Event Loop & Asynchronous Execution**:
   - Call stack, Web APIs / Node C++ APIs.
   - Macrotask queue vs. Microtask queue (Promises).
   - Event loop phase transitions.

### Module 2: TypeScript Fundamentals
1. **Type Annotations & Primitive Types**:
   - Explicit types vs. implicit inference.
   - `string`, `number`, `boolean`, `symbol`, `bigint`.
2. **Object Shapes & Structural Typing**:
   - Duck typing: "If it walks like a duck...".
   - Excess property checks in object literals vs. variable assignment.
3. **Arrays & Tuples**:
   - Homogeneous arrays vs. heterogeneous fixed-length tuples.
   - Readonly arrays and tuple label ergonomics.
4. **Interfaces vs. Type Aliases**:
   - Declaration merging with interfaces.
   - Union types and primitive aliasing with `type`.
   - Extends vs. intersection.
5. **Union Types & Discriminated Unions**:
   - Set-theory model of types (unions as logical OR).
   - Common discriminant tags (`type`, `kind`, `status`).

### Module 3: Advanced Type System
1. **Type Narrowing & Control Flow Analysis**:
   - `typeof`, `instanceof`, `in` operator.
   - Custom user-defined type guards (`is` keyword).
   - Assertion functions (`asserts condition`).
2. **Intersection Types & Literal Types**:
   - Intersections as set-theoretic logical AND.
   - String, numeric, and boolean literal sets.
3. **Generics & Type Parameter Constraints**:
   - Generic functions, interfaces, and classes.
   - Bounding type parameters (`<T extends Record<string, unknown>>`).
   - The `keyof` operator and indexed access (`T[K]`).
4. **Conditional Types & `infer`**:
   - Ternary type syntax (`T extends U ? X : Y`).
   - Distributive conditional types over naked type parameters.
   - Type unpacking with `infer`.
5. **Mapped Types & Template Literal Types**:
   - Iterating keys (`[P in keyof T]`).
   - Key remapping with `as` (`[P in keyof T as NewKey<P>]`).
   - String manipulation types (`Uppercase`, `Lowercase`, `Capitalize`).

## 4. Future Tracks Roadmap

- **Track 2: Python** (Execution engine, PyObject, Scope & LEGB, Generators, Asyncio).
- **Track 3: React** (Virtual DOM, Fiber node architecture, Render vs. Commit, Hook closures, Concurrent Mode).
- **Track 4: System Design** (Load balancing, Caching strategies, Database partitioning, Message brokers, Failure modes).
- **Track 5: AI Engineering** (Tokenization, Embedding geometry, Vector similarity search, RAG pipelines, Autonomous tool loops).
