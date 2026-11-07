# KODARA TESTING STRATEGY

## 1. Testing Philosophy

Kodara is an educational platform where **correctness of mental models and execution tracing is paramount**. If an execution trace inaccurately depicts variable scope or a challenge falsely passes incorrect code, the learner acquires faulty intuitions.

Therefore, testing spans five distinct layers:
1. **Unit Tests**: Pure functions, trace adapters, AST transformers, mastery scoring calculations.
2. **Component & Interaction Tests**: React components, UI state machines, playback timeline controls, bento cards.
3. **Execution & Trace Integrity Tests**: Verifying that runtime adapters generate accurate `TraceEvent` streams for complex code patterns.
4. **Sandbox Isolation Tests**: Validating that security boundaries (CPU, RAM, timeout, network disablement) cannot be breached.
5. **End-to-End (E2E) Tests**: Complete learner journeys across routes, playgrounds, and challenge submissions.

## 2. Test Tooling Stack

- **Unit & Component Testing**: Vitest + React Testing Library + `@testing-library/user-event`.
- **E2E Browser Testing**: Playwright.
- **Mocking & API Isolation**: Mock Service Worker (MSW) for API mocking in frontend integration tests.
- **Visual & Snapshot Testing**: Vitest DOM snapshots for normalized AST trace representations.

## 3. Specialized Testing Protocols

### 3.1. Trace Engine Verification Tests
Trace generators must be tested against language edge cases:

- **Variable Lifecycles**: Hoisting (`var`), temporal dead zone (`let`/`const`), block scope versus function scope.
- **Reference Semantics**: Object mutation, alias references pointing to identical heap addresses, deep cloning versus shallow copies.
- **Asynchronous Execution**: Microtask queue (Promises) executing before macrotask queue (`setTimeout`), event loop turns.
- **Closures & Scope Chains**: Nested functions capturing outer lexical environments.

```ts
// Example: Trace Verification Test
test("generates accurate ScopeEnter and HeapAllocation events for closures", () => {
  const code = `
    function outer() {
      let count = 0;
      return function inner() { count++; return count; };
    }
    const fn = outer();
    fn();
  `;
  const trace = generateTrace(code, "typescript");
  expect(trace.events).toContainEqual(
    expect.objectContaining({ type: "scope.enter", scopeType: "closure" })
  );
});
```

### 3.2. Sandbox Security Tests
Automated backend integration tests verify sandbox resilience against common attack vectors:

- **Infinite Loop Test**: Executes `while(true) {}` and confirms worker aborts with timeout within 5.5s.
- **Memory Bomb Test**: Allocates arrays past 256MB and confirms container is killed by OOM-killer without affecting worker host.
- **Network Access Test**: Attempts outbound `curl https://example.com` or socket connection and confirms immediate failure (`Network unreachable`).
- **Filesystem Escalation Test**: Attempts writing to `/etc` or reading `/proc/1/environ` and confirms read-only denial.

### 3.3. Content & Curriculum Validation Tests
All educational Markdown and JSON lesson files are validated automatically via CI:

- Uniqueness of all `lesson.id`, `concept.id`, and `challenge.id`.
- Valid prerequisite references (no orphan or circular prerequisite graphs).
- Syntax correctness of all embedded code examples.
- Schema compliance of all `VisualizationDefinition` structures.

## 4. Minimum End-to-End (E2E) Reference Flow

The primary smoke-test user journey tested on every release:

```text
1. Visit Landing Page
2. Navigate to Dashboard
3. Select "TypeScript Track"
4. Open "JavaScript Runtime Foundations: Variables"
5. Step through Interactive Memory Visualization
6. Click "Build It" to open Monaco Editor
7. Run code in Playground and observe Execution Trace events
8. Enter "Break It" mode, diagnose deliberate scope bug, submit fix
9. Verify challenge passes and Concept Mastery increases from 0% → 25%
```
