/**
 * Kodara Assessment Subsystem - TypeScript Challenges Registry
 * Initial 10 production TypeScript challenges progressing from Fix -> Implement -> Design -> Architect.
 */

import { Challenge } from "@/features/assessment/types/challenge.types";

export const TYPESCRIPT_CHALLENGES: Challenge[] = [
  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 1: Fix the Unsafe API Response                                   */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.01.fix-unsafe-api",
    slug: "fix-unsafe-api-response",
    type: "debugging-challenge",
    titleEn: "Fix the Unsafe API Response",
    titleBn: "আনসেফ এপিআই রেসপন্স ফিক্স করুন",
    descriptionEn: "Untrusted JSON payload parsing currently returns `any`, causing unexpected runtime crashes. Refactor `parseApiResponse` to use `unknown` and runtime type guards.",
    descriptionBn: "এপিআই থেকে আসা ডেটা Currently `any` রিটার্ন করায় রানটাইম ক্র্যাশ ঘটছে। `unknown` এবং টাইপ গার্ড ব্যবহার করে এটিকে টাইপ-সেফ করুন।",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.type-narrowing", "concept.structural-typing"],
    difficulty: "intermediate",
    cognitiveDifficulty: 3,
    estimatedMinutes: 10,
    language: "typescript",
    objectivesEn: ["Safely process unknown external API data", "Write a user-defined type guard"],
    objectivesBn: ["অজানা বাইরের ডেটা নিরাপদে প্রসেস করা", "টাইপ গার্ড ফাংশন তৈরি করা"],
    requirementsEn: [
      "parseApiResponse must return user object or null",
      "Must validate that data is an object and contains string name",
      "Do NOT use any assertions"
    ],
    requirementsBn: [
      "parseApiResponse কে ইউজার অবজেক্ট বা null রিটার্ন করতে হবে",
      "ডেটা যে অবজেক্ট এবং তাতে স্ট্রিং name প্রপার্টি আছে তা ভ্যালিডেট করতে হবে",
      "any টাইপ ব্যবহার করা যাবে না"
    ],
    brokenCode: `interface User {
  id: number;
  name: string;
}

export function parseApiResponse(rawJson: string): User | null {
  const data: any = JSON.parse(rawJson);
  return data;
}`,
    starterCode: `export interface User {
  id: number;
  name: string;
}

export function isUser(data: unknown): data is User {
  // TODO: Implement user-defined type guard
  return false;
}

export function parseApiResponse(rawJson: string): User | null {
  try {
    const data: unknown = JSON.parse(rawJson);
    if (isUser(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}`,
    solutionCode: `export interface User {
  id: number;
  name: string;
}

export function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as any).id === "number" &&
    "name" in data &&
    typeof (data as any).name === "string"
  );
}

export function parseApiResponse(rawJson: string): User | null {
  try {
    const data: unknown = JSON.parse(rawJson);
    return isUser(data) ? data : null;
  } catch {
    return null;
  }
}`,
    solutionExplanationEn: "Using `unknown` forces runtime validation before accessing properties. The `data is User` type predicate instructs TypeScript to narrow the scope within `if (isUser(data))`.",
    solutionExplanationBn: "`unknown` টাইপ ব্যবহারের ফলে অবজেক্টের প্রপার্টি ব্যবহারের আগে ভ্যালিডেশন বাধ্যতামূলক হয়। `data is User` প্রেডিকেট টাইপ ন্যারো করে দেয়।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "returns valid User object for valid JSON",
        descriptionBn: "সঠিক JSON এর জন্য User অবজেক্ট রিটার্ন করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const res = parseApiResponse('{"id": 1, "name": "Alice"}');
          return res !== null && res.name === "Alice" && res.id === 1;
        `
      },
      {
        id: "tc-2",
        descriptionEn: "returns null when JSON is missing required fields",
        descriptionBn: "প্রয়োজনীয় ফিল্ড না থাকলে null রিটার্ন করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const res = parseApiResponse('{"id": 1}');
          return res === null;
        `
      },
      {
        id: "tc-3",
        descriptionEn: "returns null for invalid JSON string",
        descriptionBn: "অবৈধ JSON স্ট্রিং এর জন্য null রিটার্ন করে",
        hidden: true,
        weight: 1,
        testFunctionCode: `
          const res = parseApiResponse('invalid-json');
          return res === null;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use typeof data === 'object' to check if raw data is an object.", nudgeBn: "ডেটা অবজেক্ট কিনা তা typeof data === 'object' দিয়ে চেক করুন।" },
      { id: "h2", level: 2, nudgeEn: "Remember to check data !== null since typeof null is 'object'.", nudgeBn: "মনে রাখবেন null এর typeof ও 'object', তাই data !== null নিশ্চিত করুন।" },
      { id: "h3", level: 3, nudgeEn: "Use the 'in' operator or property checks to verify id is number and name is string.", nudgeBn: "'in' অপারেটর বা প্রপার্টি দিয়ে id (number) এবং name (string) ভ্যালিডেট করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 2: Build a Generic Identity Utility                             */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.02.generic-identity",
    slug: "generic-identity-utility",
    type: "code-implementation",
    titleEn: "Build a Generic Identity Utility",
    titleBn: "জেনেরিক আইডেন্টিটি ইউটিলিটি তৈরি করুন",
    descriptionEn: "Implement a generic `identity` function and generic `wrapInBox` container that preserves input type safety.",
    descriptionBn: "একটি জেনেরিক `identity` ফাংশন এবং `wrapInBox` কনটেইনার তৈরি করুন যা ইনপুটের সঠিক টাইপ বজায় রাখে।",
    lessonId: "ts.variables",
    conceptIds: ["concept.generics", "concept.type-inference"],
    difficulty: "beginner",
    cognitiveDifficulty: 2,
    estimatedMinutes: 8,
    language: "typescript",
    objectivesEn: ["Declare type parameter T", "Return wrapped type Box<T>"],
    objectivesBn: ["টাইপ প্যারামিটার T ঘোষণা করা", "Box<T> টাইপে মান রিটার্ন করা"],
    requirementsEn: [
      "identity<T>(value: T): T must return input without widening",
      "wrapInBox<T>(value: T): { value: T } must wrap value"
    ],
    requirementsBn: [
      "identity<T>(value: T): T ফাংশনটি ইনপুট ওয়াইড না করে ফেরত দেবে",
      "wrapInBox<T>(value: T): { value: T } অবজেক্ট এ মোড়ানো আউটপুট দেবে"
    ],
    starterCode: `export interface Box<T> {
  value: T;
}

export function identity<T>(value: T): T {
  // TODO: return value
  return value;
}

export function wrapInBox<T>(value: T): Box<T> {
  // TODO: return object with value property
  return { value };
}`,
    solutionCode: `export interface Box<T> {
  value: T;
}

export function identity<T>(value: T): T {
  return value;
}

export function wrapInBox<T>(value: T): Box<T> {
  return { value };
}`,
    solutionExplanationEn: "Generic type parameters `<T>` capture the call-site argument type dynamically.",
    solutionExplanationBn: "জেনেরিক টাইপ প্যারামিটার `<T>` কল-সাইটের আর্গুমেন্ট টাইপ ডায়নামিকভাবে ক্যাচ করে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "identity preserves exact string literal or number values",
        descriptionBn: "identity ফাংশন স্ট্রিং ও নাম্বার মান অপরিবর্তিত রাখে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          return identity(42) === 42 && identity("hello") === "hello";
        `
      },
      {
        id: "tc-2",
        descriptionEn: "wrapInBox encapsulates input inside value property",
        descriptionBn: "wrapInBox ইনপুটকে value প্রপার্টিতে এনক্যাপসুলেট করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const box = wrapInBox({ active: true });
          return box.value.active === true;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use function identity<T>(value: T): T.", nudgeBn: "ফাংশন সিগনেচারে <T>(value: T): T ব্যবহার করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 3: Build a Type-Safe getProperty                               */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.03.type-safe-get-property",
    slug: "type-safe-get-property",
    type: "type-design-challenge",
    titleEn: "Build a Type-Safe getProperty",
    titleBn: "টাইপ-সেফ getProperty তৈরি করুন",
    descriptionEn: "Implement `getProperty` using `keyof` and indexed access types so invalid object keys produce a compile-time type error.",
    descriptionBn: "`keyof` এবং ইনডেক্সড অ্যাক্সেস টাইপ দিয়ে `getProperty` ফাংশন তৈরি করুন যাতে ভুল কি (key) দিলে কম্পাইল এরর হয়।",
    lessonId: "ts.variables",
    conceptIds: ["concept.generics", "concept.keyof-indexed-access"],
    difficulty: "intermediate",
    cognitiveDifficulty: 3,
    estimatedMinutes: 12,
    language: "typescript",
    objectivesEn: ["Constrain key K to keyof T", "Return indexed property type T[K]"],
    objectivesBn: ["কি K কে keyof T দিয়ে কনস্ট্রেইন করা", "T[K] টাইপ রিটার্ন করা"],
    requirementsEn: [
      "getProperty(obj, key) must accept valid keys of obj",
      "Return type must be T[K]"
    ],
    requirementsBn: [
      "getProperty(obj, key) কেবল বৈধ কি গ্রহণ করবে",
      "রিটার্ন টাইপ হবে T[K]"
    ],
    starterCode: `export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // TODO: Return property value cleanly
  return obj[key];
}`,
    solutionCode: `export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    solutionExplanationEn: "`K extends keyof T` ensures `key` is guaranteed to exist on `T`, and `T[K]` extracts the exact type of that property.",
    solutionExplanationBn: "`K extends keyof T` নিশ্চিত করে যে key টি T অবজেক্টে আছে, এবং `T[K]` সেই প্রপার্টির টাইপ প্রদান করে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "extracts property values safely",
        descriptionBn: "নিরাপদে প্রপার্টি মান এক্সট্রাক্ট করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const user = { id: 101, username: "kodara_dev" };
          return getProperty(user, "username") === "kodara_dev" && getProperty(user, "id") === 101;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use K extends keyof T for the generic constraint.", nudgeBn: "জেনেরিক কনস্ট্রেইন্টের জন্য K extends keyof T ব্যবহার করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 4: Model API States                                              */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.04.model-api-states",
    slug: "model-api-states",
    type: "type-design-challenge",
    titleEn: "Model API States",
    titleBn: "এপিআই স্টেট মডেলিং করুন (Discriminated Union)",
    descriptionEn: "Model network request states (Idle, Loading, Success, Error) as a discriminated union so impossible states (e.g. data present while error is set) cannot be represented.",
    descriptionBn: "নেটওয়ার্ক রিকোয়েস্ট স্টেটকে ডিসক্রিমিনেটেড ইউনিয়ন দিয়ে মডেলিং করুন যেন অসম্ভব স্টেট রিপ্রেজেন্ট না হতে পারে।",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.discriminated-unions", "concept.exhaustive-checking"],
    difficulty: "intermediate",
    cognitiveDifficulty: 4,
    estimatedMinutes: 15,
    language: "typescript",
    objectivesEn: ["Model state using discriminant status field", "Write exhaustive state handler"],
    objectivesBn: ["status ফিল্ড দিয়ে ডিক্রিমিনেটেড ইউনিয়ন মডেল করা", "এক্সহস্টিভ স্টেট হ্যান্ডলার লেখা"],
    requirementsEn: [
      "Define ApiState union with status: 'idle' | 'loading' | 'success' | 'error'",
      "renderState must handle all 4 states exhaustively"
    ],
    requirementsBn: [
      "status ফিল্ড বিশিষ্ট ApiState ইউনিয়ন ডিফাইন করা",
      "renderState কে ৪টি স্টেটই এক্সহস্টিভলি হ্যান্ডেল করতে হবে"
    ],
    starterCode: `export type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export function renderState<T>(state: ApiState<T>): string {
  switch (state.status) {
    case "idle":
      return "Idle";
    case "loading":
      return "Loading...";
    case "success":
      return "Data: " + String(state.data);
    case "error":
      return "Error: " + state.error;
  }
}`,
    solutionCode: `export type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export function renderState<T>(state: ApiState<T>): string {
  switch (state.status) {
    case "idle":
      return "Idle";
    case "loading":
      return "Loading...";
    case "success":
      return "Data: " + String(state.data);
    case "error":
      return "Error: " + state.error;
  }
}`,
    solutionExplanationEn: "Discriminated unions rely on a common literal discriminant property (`status`) to enable strict exhaustiveness checking.",
    solutionExplanationBn: "ডিসক্রিমিনেটেড ইউনিয়ন ডিসক্রিমিন্যান্ট প্রপার্টি (`status`) এর মাধ্যমে এক্সহস্টিভ টাইপ চেকিং নিশ্চিত করে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "renders all 4 states correctly",
        descriptionBn: "৪টি স্টেটই সঠিকভাবে রেন্ডার করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const idle = renderState({ status: "idle" });
          const succ = renderState({ status: "success", data: "Payload" });
          const err = renderState({ status: "error", error: "404 Not Found" });
          return idle === "Idle" && succ.includes("Payload") && err.includes("404");
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use status discriminant string literals.", nudgeBn: "status ফিল্ডে স্ট্রিং লিটারেল ব্যবহার করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 5: Build a Typed Event Emitter                                  */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.05.typed-event-emitter",
    slug: "typed-event-emitter",
    type: "architecture-challenge",
    titleEn: "Build a Typed Event Emitter",
    titleBn: "টাইপ-সেফ ইভেন্ট এমিটার তৈরি করুন",
    descriptionEn: "Create a generic `TypedEventEmitter<Events>` class where event names and their payload types are strictly mapped.",
    descriptionBn: "একটি জেনেরিক `TypedEventEmitter<Events>` ক্লাস বানান যেখানে ইভেন্ট নাম এবং পে-লোড টাইপ ম্যাপ করা থাকে।",
    lessonId: "ts.variables",
    conceptIds: ["concept.generics", "concept.mapped-types", "concept.keyof-indexed-access"],
    difficulty: "advanced",
    cognitiveDifficulty: 4,
    estimatedMinutes: 20,
    language: "typescript",
    objectivesEn: ["Enforce event name type safety", "Enforce event payload type safety"],
    objectivesBn: ["ইভেন্ট নামের টাইপ সেফটি নিশ্চিত করা", "পে-লোডের টাইপ সেফটি নিশ্চিত করা"],
    requirementsEn: [
      "on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void)",
      "emit<K extends keyof Events>(event: K, payload: Events[K])"
    ],
    requirementsBn: [
      "on মেথডে ইভেন্ট নাম K এবং লিসেনার પે-লোড Events[K] নেওয়া",
      "emit মেথডে সঠিক પે-লোড নেওয়া"
    ],
    starterCode: `export class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {};

  public on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  public emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
  }
}`,
    solutionCode: `export class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {};

  public on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  public emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
  }
}`,
    solutionExplanationEn: "Mapped types combined with indexed access allow event listener callbacks to receive the exact payload mapped to that specific event name.",
    solutionExplanationBn: "ম্যাপড টাইপ এবং ইনডেক্সড অ্যাক্সেসের সাহায্যে নির্দিষ্ট ইভেন্টের সাথে মিল রেখে লিসেনারে সঠিক পে-লোড পাস করা হয়।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "registers and emits typed event payloads correctly",
        descriptionBn: "টাইপ করা ইভেন্ট পে-লোড সঠিকভাবে রেজিস্টার ও এমিট করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          interface AppEvents {
            userLoggedIn: { userId: string };
            countChanged: number;
          }
          const ee = new TypedEventEmitter<AppEvents>();
          let received = "";
          ee.on("userLoggedIn", (p) => { received = p.userId; });
          ee.emit("userLoggedIn", { userId: "usr_99" });
          return received === "usr_99";
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Constrain Events to Record<string, any> and use keyof Events for methods.", nudgeBn: "Events কে Record<string, any> দিয়ে কনস্ট্রেইন করে keyof Events ব্যবহার করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGE 6: Transform a Type (Mapped Types & Key Remapping)               */
  /* -------------------------------------------------------------------------- */
  {
    id: "ts.challenge.06.transform-type",
    slug: "transform-a-type",
    type: "type-design-challenge",
    titleEn: "Transform a Type",
    titleBn: "টাইপ ট্রান্সফর্ম করুন (Mapped Types & Key Remapping)",
    descriptionEn: "Implement a utility type `Getters<T>` that transforms an interface `{ name: string }` into `{ getName: () => string }` using key remapping (`as`).",
    descriptionBn: "একটি ইউটিলিটি টাইপ `Getters<T>` তৈরি করুন যা কি-রিম্যাপিং ব্যবহার করে `{ name: string }` কে `{ getName: () => string }` এ রূপান্তর করে।",
    lessonId: "ts.variables",
    conceptIds: ["concept.mapped-types", "concept.key-remapping"],
    difficulty: "advanced",
    cognitiveDifficulty: 4,
    estimatedMinutes: 18,
    language: "typescript",
    objectivesEn: ["Map object keys", "Remap keys using template literal types"],
    objectivesBn: ["অবজেক্ট কি ম্যাপ করা", "টেমপ্লেট লিটারেল টাইপ দিয়ে কি রিম্যাপ করা"],
    requirementsEn: [
      "Getters<T> maps each key K in T to `get${Capitalize<K & string>}`",
      "Method return type is () => T[K]"
    ],
    requirementsBn: [
      "Getters<T> প্রতিটি key K কে `get${Capitalize<K & string>}` এ রিম্যাপ করবে",
      "মেথডের রিটার্ন টাইপ হবে () => T[K]"
    ],
    starterCode: `export type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
    solutionCode: `export type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
    solutionExplanationEn: "Key remapping with `as` and template literal types `get${Capitalize<...>}` transforms property names at compile time.",
    solutionExplanationBn: "`as` এবং টেমপ্লেট লিটারেল টাইপ দিয়ে কম্পাইল টাইমে প্রপার্টির নাম ডায়নামিকালি পরিবর্তন করা হয়।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "validates getter object structure",
        descriptionBn: "গেটার অবজেক্ট স্ট্রাকচার ভ্যালিডেট করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          interface Person { name: string; age: number; }
          const getters: Getters<Person> = {
            getName: () => "Bob",
            getAge: () => 25
          };
          return getters.getName() === "Bob" && getters.getAge() === 25;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use template literal type `get${Capitalize<string & K>}` in the as clause.", nudgeBn: "as ক্লজে টেমপ্লেট লিটারেল টাইপ `get${Capitalize<string & K>}` ব্যবহার করুন।" }
    ]
  },

  /* -------------------------------------------------------------------------- */
  /* CHALLENGES 7-10: Additional Core Challenges                                */
  /* -------------------------------------------------------------------------- */

  {
    id: "ts.challenge.07.fix-generic-repo",
    slug: "fix-generic-repository",
    type: "debugging-challenge",
    titleEn: "Fix the Generic Repository",
    titleBn: "জেনেরিক রিপোজিটরি ফিক্স করুন",
    descriptionEn: "The repository constraint is missing, allowing non-identifiable entities. Constrain T to objects with an `id` field.",
    descriptionBn: "রিপোজিটরিতে এ এন্টিটি কনস্ট্রেইন্ট না থাকায় `id` বিহীন অবজেক্ট চলে আসছে। `T extends { id: string | number }` কনস্ট্রেইন করুন।",
    lessonId: "ts.variables",
    conceptIds: ["concept.generics", "concept.generic-constraints"],
    difficulty: "intermediate",
    cognitiveDifficulty: 3,
    estimatedMinutes: 12,
    language: "typescript",
    objectivesEn: ["Enforce generic constraint on entity ID"],
    objectivesBn: ["এন্টিটি ID এর ওপর জেনেরিক কনস্ট্রেইন্ট আরোপ করা"],
    requirementsEn: ["Repository<T extends { id: string | number }>"],
    requirementsBn: ["Repository<T extends { id: string | number }> নির্ধারণ করা"],
    brokenCode: `export class Repository<T> {
  private items: T[] = [];
  public add(item: T) { this.items.push(item); }
  public findById(id: any): T | undefined {
    return (this.items as any).find((i: any) => i.id === id);
  }
}`,
    starterCode: `export interface HasId {
  id: string | number;
}

export class Repository<T extends HasId> {
  private items: T[] = [];
  public add(item: T): void {
    this.items.push(item);
  }
  public findById(id: T["id"]): T | undefined {
    return this.items.find((i) => i.id === id);
  }
}`,
    solutionCode: `export interface HasId {
  id: string | number;
}

export class Repository<T extends HasId> {
  private items: T[] = [];
  public add(item: T): void {
    this.items.push(item);
  }
  public findById(id: T["id"]): T | undefined {
    return this.items.find((i) => i.id === id);
  }
}`,
    solutionExplanationEn: "Constraining `T extends HasId` ensures `i.id` exists safely without needing type assertions.",
    solutionExplanationBn: "`T extends HasId` কনস্ট্রেইন করায় টাইপ কাস্টিং ছাড়াই `i.id` নিরাপদ থাকে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "stores and retrieves items by id safely",
        descriptionBn: "id দিয়ে আইটেম নিরাপদে স্টোর ও রিট্রিভ করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const repo = new Repository<{ id: number; title: string }>();
          repo.add({ id: 1, title: "Kodara Book" });
          const found = repo.findById(1);
          return found !== undefined && found.title === "Kodara Book";
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use extends HasId on the generic class declaration.", nudgeBn: "ক্লাস ঘোষণায় extends HasId জুড়ে দিন।" }
    ]
  },

  {
    id: "ts.challenge.08.type-safe-state-machine",
    slug: "type-safe-state-machine",
    type: "architecture-challenge",
    titleEn: "Build a Type-Safe State Machine",
    titleBn: "টাইপ-সেফ স্টেট মেশিন তৈরি করুন",
    descriptionEn: "Build a state machine transition function that accepts current state and valid allowed transition actions.",
    descriptionBn: "বর্তমান স্টেট এবং কেবল অনুমোদিত ট্রানজিশন দিয়ে চলা স্টেট মেশিন তৈরি করুন।",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.discriminated-unions", "concept.state-modeling"],
    difficulty: "advanced",
    cognitiveDifficulty: 4,
    estimatedMinutes: 20,
    language: "typescript",
    objectivesEn: ["Model state transitions type-safely"],
    objectivesBn: ["টাইপ-সেফ উপায়ে স্টেট ট্রানজিশন মডেল করা"],
    requirementsEn: ["Transition function handles draft -> published -> archived"],
    requirementsBn: ["ড্রাফট -> পাবলিশড -> আর্কাইভড ট্রানজিশন মডেল করা"],
    starterCode: `export type DocumentState =
  | { status: "draft"; content: string }
  | { status: "published"; content: string; publishedAt: string }
  | { status: "archived"; content: string };

export type Action =
  | { type: "PUBLISH"; publishedAt: string }
  | { type: "ARCHIVE" };

export function transition(state: DocumentState, action: Action): DocumentState {
  if (state.status === "draft" && action.type === "PUBLISH") {
    return { status: "published", content: state.content, publishedAt: action.publishedAt };
  }
  if (state.status === "published" && action.type === "ARCHIVE") {
    return { status: "archived", content: state.content };
  }
  return state;
}`,
    solutionCode: `export type DocumentState =
  | { status: "draft"; content: string }
  | { status: "published"; content: string; publishedAt: string }
  | { status: "archived"; content: string };

export type Action =
  | { type: "PUBLISH"; publishedAt: string }
  | { type: "ARCHIVE" };

export function transition(state: DocumentState, action: Action): DocumentState {
  if (state.status === "draft" && action.type === "PUBLISH") {
    return { status: "published", content: state.content, publishedAt: action.publishedAt };
  }
  if (state.status === "published" && action.type === "ARCHIVE") {
    return { status: "archived", content: state.content };
  }
  return state;
}`,
    solutionExplanationEn: "Discriminated unions ensure valid state transitions and protect document attributes across phases.",
    solutionExplanationBn: "ডিসক্রিমিনেটেড ইউনিয়ন বৈধ ট্রানজিশন নিশ্চিত করে এবং ডকুমেন্টের মান ঠিক রাখে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "publishes draft correctly",
        descriptionBn: "ড্রাফটকে সঠিকভাবে পাবলিশ করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const d: DocumentState = { status: "draft", content: "Hello" };
          const res = transition(d, { type: "PUBLISH", publishedAt: "2026-09-13" });
          return res.status === "published" && (res as any).publishedAt === "2026-09-13";
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Narrow status and action.type together inside if checks.", nudgeBn: "if ব্লকে status এবং action.type একত্রে ন্যারো করুন।" }
    ]
  },

  {
    id: "ts.challenge.09.analyze-ast",
    slug: "analyze-typescript-ast",
    type: "code-reasoning-challenge",
    titleEn: "Analyze a TypeScript AST",
    titleBn: "টাইপস্ক্রিপ্ট AST অ্যানালাইসিস করুন",
    descriptionEn: "Traverse a mock AST node tree and count identifier nodes.",
    descriptionBn: "একটি মক AST নোড ট্রি ট্রাভার্স করে আইডেন্টিফায়ার নোড সংখ্যা গণনা করুন।",
    lessonId: "ts.variables",
    conceptIds: ["concept.compiler-pipeline", "concept.ast-traversal"],
    difficulty: "advanced",
    cognitiveDifficulty: 4,
    estimatedMinutes: 20,
    language: "typescript",
    objectivesEn: ["Traverse recursive tree structures", "Count matching AST node kinds"],
    objectivesBn: ["রিকালসিভ ট্রি ট্রাভার্স করা", "নির্দিষ্ট AST নোড কাউন্ট করা"],
    requirementsEn: ["countIdentifiers(node: ASTNode): number"],
    requirementsBn: ["countIdentifiers(node: ASTNode): number ফাংশন তৈরি করা"],
    starterCode: `export interface ASTNode {
  kind: "Identifier" | "BinaryExpression" | "VariableDeclaration";
  name?: string;
  children?: ASTNode[];
}

export function countIdentifiers(node: ASTNode): number {
  let count = node.kind === "Identifier" ? 1 : 0;
  if (node.children) {
    for (const child of node.children) {
      count += countIdentifiers(child);
    }
  }
  return count;
}`,
    solutionCode: `export interface ASTNode {
  kind: "Identifier" | "BinaryExpression" | "VariableDeclaration";
  name?: string;
  children?: ASTNode[];
}

export function countIdentifiers(node: ASTNode): number {
  let count = node.kind === "Identifier" ? 1 : 0;
  if (node.children) {
    for (const child of node.children) {
      count += countIdentifiers(child);
    }
  }
  return count;
}`,
    solutionExplanationEn: "Recursive AST traversal evaluates compiler node syntax shapes.",
    solutionExplanationBn: "রিকার্সিভ AST ট্রাভার্সাল কম্পাইলারের নোড স্ট্রাকচার অ্যানালাইসিস করে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "counts identifier nodes in AST tree",
        descriptionBn: "AST ট্রিতে আইডেন্টিফায়ারের সংখ্যা গণনা করে",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const tree: ASTNode = {
            kind: "VariableDeclaration",
            children: [
              { kind: "Identifier", name: "a" },
              { kind: "BinaryExpression", children: [{ kind: "Identifier", name: "b" }] }
            ]
          };
          return countIdentifiers(tree) === 2;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Use recursion over node.children array.", nudgeBn: "node.children অ্যারেতে রিকার্শন ব্যবহার করুন।" }
    ]
  },

  {
    id: "ts.challenge.10.runtime-validation-boundary",
    slug: "runtime-validation-boundary",
    type: "code-implementation",
    titleEn: "Build a Runtime Validation Boundary",
    titleBn: "রানটাইম ভ্যালিডেশন বাউন্ডারি তৈরি করুন",
    descriptionEn: "Build a schema validator function that converts untrusted inputs into typed domain entities.",
    descriptionBn: "একটি স্কিমা ভ্যালিডেটর বানান যা অনাস্থা ইনপুটকে নিরাপদ টাইপড ডোমেন এন্টিটিতে রূপান্তর করে।",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.type-narrowing", "concept.domain-models"],
    difficulty: "expert",
    cognitiveDifficulty: 5,
    estimatedMinutes: 25,
    language: "typescript",
    objectivesEn: ["Construct strict boundary parsing layer"],
    objectivesBn: ["স্ট্রিক্ট বাউন্ডারি পার্সিং লেয়ার নির্মাণ করা"],
    requirementsEn: ["validateConfig(input: unknown): { host: string; port: number }"],
    requirementsBn: ["validateConfig(input: unknown): { host: string; port: number } ফাংশন তৈরি করা"],
    starterCode: `export interface AppConfig {
  host: string;
  port: number;
}

export function validateConfig(input: unknown): AppConfig {
  if (
    typeof input === "object" &&
    input !== null &&
    "host" in input &&
    typeof (input as any).host === "string" &&
    "port" in input &&
    typeof (input as any).port === "number"
  ) {
    return {
      host: (input as any).host,
      port: (input as any).port,
    };
  }
  throw new Error("Invalid Configuration Payload");
}`,
    solutionCode: `export interface AppConfig {
  host: string;
  port: number;
}

export function validateConfig(input: unknown): AppConfig {
  if (
    typeof input === "object" &&
    input !== null &&
    "host" in input &&
    typeof (input as any).host === "string" &&
    "port" in input &&
    typeof (input as any).port === "number"
  ) {
    return {
      host: (input as any).host,
      port: (input as any).port,
    };
  }
  throw new Error("Invalid Configuration Payload");
}`,
    solutionExplanationEn: "Creating strict validation boundaries at system edges keeps internal core business logic cleanly typed and crash-free.",
    solutionExplanationBn: "সিস্টেমের সীমানায় ভ্যালিডেশন বাউন্ডারি বসালে ভেতরের বিজনেস লজিক নিরাপদ ও টাইপড থাকে।",
    testCases: [
      {
        id: "tc-1",
        descriptionEn: "validates correct config and throws error on invalid config",
        descriptionBn: "সঠিক কনফিগ অনুমোদন করে এবং ভুল ইনপুটে এরর দেয়",
        hidden: false,
        weight: 1,
        testFunctionCode: `
          const cfg = validateConfig({ host: "localhost", port: 8080 });
          let errorThrown = false;
          try { validateConfig({ host: "localhost" }); } catch { errorThrown = true; }
          return cfg.port === 8080 && errorThrown;
        `
      }
    ],
    hints: [
      { id: "h1", level: 1, nudgeEn: "Check both host string and port number before returning AppConfig.", nudgeBn: "AppConfig রিটার্ন করার আগে host (string) এবং port (number) উভয়ই ভ্যালিডেট করুন।" }
    ]
  }
];
