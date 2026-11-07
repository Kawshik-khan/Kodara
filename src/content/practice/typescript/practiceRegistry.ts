/**
 * Kodara Assessment Subsystem - TypeScript Practice Questions Registry
 * High-quality practice questions covering 12 question types across core TypeScript concepts.
 */

import { PracticeQuestion } from "@/features/assessment/types/practice.types";

export const TYPESCRIPT_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  /* -------------------------------------------------------------------------- */
  /* CONCEPT: Type Inference & Variables                                      */
  /* -------------------------------------------------------------------------- */

  {
    id: "ts.q.inference.01",
    lessonId: "ts.variables",
    conceptIds: ["concept.type-inference"],
    type: "predict-type",
    difficulty: 2,
    estimatedSeconds: 45,
    promptEn: "Given the string constant initialization, what type does TypeScript infer?",
    promptBn: "স্ট্রিং কনস্ট্যান্ট ডিক্লেয়ারেশনের ক্ষেত্রে টাইপস্ক্রিপ্ট কোন টাইপটি অনুমিত (infer) করবে?",
    codeSnippet: 'const value = "hello";',
    options: [
      {
        id: "opt-1",
        typeString: '"hello"',
        isCorrect: true,
        explanationEn: 'For const declarations with literal values, TypeScript infers the literal type "hello" (literal narrowing).',
        explanationBn: 'const ডিক্লেয়ারেশনের ক্ষেত্রে টাইপস্ক্রিপ্ট নির্দিষ্ট লিটারেল টাইপ "hello" অনুমিত করে।',
      },
      {
        id: "opt-2",
        typeString: "string",
        isCorrect: false,
        explanationEn: 'TypeScript would infer `string` for a `let` variable, but for `const` it infers the literal type.',
        explanationBn: '`let` ভ্যারিয়েবলের জন্য `string` অনুমিত হয়, কিন্তু `const` এর জন্য লিটারেল টাইপ অনুমিত হয়।',
      },
      {
        id: "opt-3",
        typeString: "unknown",
        isCorrect: false,
        explanationEn: "unknown is not inferred automatically for explicit primitive string initializations.",
        explanationBn: "স্ট্রিং ইনিশিয়ালাইজেশনের জন্য unknown টাইপ আসে না।",
      },
      {
        id: "opt-4",
        typeString: "any",
        isCorrect: false,
        explanationEn: "any is only inferred in noImplicitAny fallback situations.",
        explanationBn: "any টাইপ শুধুমাত্র রিগ্রেসিভ ফলব্যাক ক্ষেত্রে আসে।",
      },
    ],
    explanationEn: "TypeScript infers literal types for `const` variables because their value cannot be reassigned.",
    explanationBn: "const ভ্যারিয়েবল রি-অ্যাসাইন করা সম্ভব নয় বলে টাইপস্ক্রিপ্ট এর সুনির্দিষ্ট লিটারেল টাইপ অনুমান করে।",
  },

  {
    id: "ts.q.inference.02",
    lessonId: "ts.variables",
    conceptIds: ["concept.type-inference"],
    type: "predict-type",
    difficulty: 2,
    estimatedSeconds: 45,
    promptEn: "What type does TypeScript infer for this array initialization?",
    promptBn: "এই অ্যারে ইনিশিয়ালাইজেশনের জন্য টাইপস্ক্রিপ্ট কোন টাইপ অনুমিত করবে?",
    codeSnippet: 'const users = ["A", "B"];',
    options: [
      { id: "opt-1", typeString: "string[]", isCorrect: true },
      { id: "opt-2", typeString: "Array<" + '"A" | "B"' + ">", isCorrect: false },
      { id: "opt-3", typeString: "unknown[]", isCorrect: false },
      { id: "opt-4", typeString: "any[]", isCorrect: false },
    ],
    explanationEn: "Array elements are mutable, so TypeScript widens string elements to `string[]`.",
    explanationBn: "অ্যারের এলিমেন্ট পরিবর্তনযোগ্য হওয়ায় টাইপস্ক্রিপ্ট এদের `string[]` এ ওয়াইডেন করে।",
  },

  {
    id: "ts.q.inference.03",
    lessonId: "ts.variables",
    conceptIds: ["concept.type-inference"],
    type: "multiple-choice",
    difficulty: 2,
    estimatedSeconds: 60,
    promptEn: "What does TypeScript's type inference process do when a variable is declared with `let`?",
    promptBn: "`let` দিয়ে ভ্যারিয়েবল ডিক্লেয়ার করলে টাইপস্ক্রিপ্টের ইনফারেন্স প্রসেস কী করে?",
    options: [
      {
        id: "opt-1",
        textEn: "It widens the literal value to its base primitive type (e.g., 'hello' -> string).",
        textBn: "এটি লিটারেল মানকে তার মাদার প্রিমিটিভ টাইপে (যেমন 'hello' -> string) ওয়াইডেন করে।",
        isCorrect: true,
      },
      {
        id: "opt-2",
        textEn: "It turns the variable into any to allow any future reassignment.",
        textBn: "ভবিষ্যতে যেকোনো মান রাখার জন্য এটি any করে দেয়।",
        isCorrect: false,
      },
      {
        id: "opt-3",
        textEn: "It enforces a runtime check that blocks reassignment.",
        textBn: "এটি রানটাইমে চেক বসায় যেন মান পরিবর্তন না হয়।",
        isCorrect: false,
      },
      {
        id: "opt-4",
        textEn: "It freezes the object at runtime.",
        textBn: "এটি রানটাইমে অবজেক্ট ফ্রিজ করে দেয়।",
        isCorrect: false,
      },
    ],
    explanationEn: "Variables declared with `let` can be reassigned later, so TypeScript widens literal initializers to primitive types like `string` or `number`.",
    explanationBn: "let দিয়ে ঘোষিত ভ্যারিয়েবল পরবর্তীতে রি-অ্যাসাইন হতে পারে, তাই টাইপস্ক্রিপ্ট লিটারেল মানকে ওয়াইডেন করে স্ট্রিং বা নাম্বার টাইপে রূপান্তর করে।",
  },

  {
    id: "ts.q.inference.04",
    lessonId: "ts.variables",
    conceptIds: ["concept.type-inference"],
    type: "visualization-prediction",
    visualizationId: "typescript.variables.basic",
    difficulty: 3,
    estimatedSeconds: 90,
    stepToEvaluate: 2,
    promptEn: "In the visualization of `let count = 10; count = 20;`, what happens at step 2?",
    promptBn: "`let count = 10; count = 20;` ভিজ্যুয়ালাইজেশনের ধাপ ২-এ কী ঘটে?",
    codeSnippet: "let count = 10;\ncount = 20;",
    options: [
      {
        id: "opt-1",
        textEn: "The value in the memory binding slot for `count` is updated from 10 to 20 while retaining the type `number`.",
        textBn: "`count` এর মেমোরি স্লটের মান 10 থেকে 20 এ আপডেট হয় এবং টাইপ `number` অপরিবর্তিত থাকে।",
        isCorrect: true,
      },
      {
        id: "opt-2",
        textEn: "A new identifier named count is created in a child scope.",
        textBn: "চাইল্ড স্কোপে count নামের নতুন আইডেন্টিফায়ার ডিক্লেয়ার হয়।",
        isCorrect: false,
      },
      {
        id: "opt-3",
        textEn: "TypeScript raises a compile error because count was assigned twice.",
        textBn: "দুইবার অ্যাসাইন করার জন্য টাইপস্ক্রিপ্ট কম্পাইল এরর দেয়।",
        isCorrect: false,
      },
    ],
    explanationEn: "Reassigning a `let` variable updates the value binding in the scope environment without changing the inferred `number` type.",
    explanationBn: "let ভ্যারিয়েবল রি-অ্যাসাইন করলে স্কোপ এনভায়রনমেন্টের মেমোরি বাইন্ডিং আপডেট হয় কিন্তু ইনফার করা number টাইপ ঠিক থাকে।",
  },

  /* -------------------------------------------------------------------------- */
  /* CONCEPT: Type Narrowing & Control Flow                                    */
  /* -------------------------------------------------------------------------- */

  {
    id: "ts.q.narrowing.01",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.type-narrowing"],
    type: "predict-type",
    difficulty: 3,
    estimatedSeconds: 60,
    promptEn: "Inside the `if` block, what type does TypeScript narrow `value` to?",
    promptBn: "`if` ব্লকের ভেতরে টাইপস্ক্রিপ্ট `value` ভ্যারিয়েবলকে কোন টাইপে ন্যারো (narrow) করে?",
    codeSnippet: `function process(value: string | number) {
  if (typeof value === "string") {
    // What type is value here?
  }
}`,
    options: [
      { id: "opt-1", typeString: "string", isCorrect: true },
      { id: "opt-2", typeString: "string | number", isCorrect: false },
      { id: "opt-3", typeString: "unknown", isCorrect: false },
      { id: "opt-4", typeString: "any", isCorrect: false },
    ],
    explanationEn: "The `typeof value === 'string'` type guard allows TypeScript control flow analysis to narrow the union to `string` within the branch.",
    explanationBn: "`typeof` টাইপ গার্ডের মাধ্যমে টাইপস্ক্রিপ্ট কন্ট্রোল ফ্লো অ্যানালাইসিস উইনিয়ন টাইপ থেকে নির্দিষ্ট `string` ন্যারো করে নেয়।",
  },

  {
    id: "ts.q.narrowing.02",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.type-narrowing"],
    type: "debugging",
    difficulty: 3,
    estimatedSeconds: 90,
    promptEn: "The code below produces a TypeScript error because `user.profile` might be undefined. Which fix correctly narrows the type?",
    promptBn: "নিচের কোডে `user.profile` undefined হতে পারায় ত্রুটি দিচ্ছে। কোন সমাধানটি টাইপ ন্যারো করে কোডটি সেফ করে?",
    brokenCode: `interface User {
  profile?: { name: string };
}
function getName(user: User) {
  return user.profile.name;
}`,
    compilerErrorText: "Object is possibly 'undefined'.",
    options: [
      {
        id: "opt-1",
        fixedCode: `function getName(user: User) {
  return user.profile?.name ?? "Anonymous";
}`,
        isCorrect: true,
        explanationEn: "Optional chaining `?.` safely handles undefined at runtime and satisfies the type checker.",
        explanationBn: "অফশনাল চেইনিং `?.` নিরাপদে undefined হ্যান্ডেল করে এবং টাইপ চেকারকে সন্তুষ্ট করে।",
      },
      {
        id: "opt-2",
        fixedCode: `function getName(user: User) {
  return (user.profile as any).name;
}`,
        isCorrect: false,
        explanationEn: "Using `as any` bypasses type checking without resolving runtime crash risks.",
        explanationBn: "as any ব্যবহার টাইপ চেকিং বাইপাস করে কিন্তু রানটাইম ক্র্যাশ ঝুঁকি দূর করে না।",
      },
      {
        id: "opt-3",
        fixedCode: `function getName(user: User) {
  return user.profile!.name;
}`,
        isCorrect: false,
        explanationEn: "Non-null assertion `!` tells TS to ignore the error but will throw runtime TypeError if profile is missing.",
        explanationBn: "নন-নাল অ্যাসার্শন `!` টাইপ এরর লুকায় কিন্তু প্রোফাইল না থাকলে রানটাইমে ক্র্যাশ করবে।",
      },
    ],
    explanationEn: "Control flow narrowing or optional chaining handles possible optional values safely both at compile time and runtime.",
    explanationBn: "কন্ট্রোল ফ্লো ন্যারোইং বা অপশনাল চেইনিং কম্পাইল টাইম ও রানটাইম উভয়েই অপশনাল মান নিরাপদে সামলায়।",
  },

  {
    id: "ts.q.narrowing.03",
    lessonId: "ts.narrowing",
    conceptIds: ["concept.type-narrowing"],
    type: "error-explanation",
    difficulty: 4,
    estimatedSeconds: 90,
    promptEn: "Why does TypeScript reject this property access attempt?",
    promptBn: "টাইপস্ক্রিপ্ট কেন এই প্রপার্টি অ্যাক্সেস চেষ্টাকে রিজেক্ট করেছে?",
    codeSnippet: `function printId(id: string | number) {
  console.log(id.toUpperCase());
}`,
    compilerError: "Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.",
    options: [
      {
        id: "opt-1",
        textEn: "TypeScript only permits operations that are valid on ALL members of a union until narrowed.",
        textBn: "ন্যারো করার আগে পর্যন্ত টাইপস্ক্রিপ্ট কেবল সেই অপারেশনগুলো অনুমতি দেয় যা ইউনিয়নের সকল টাইপে সমর্থিত (যেমন number এ toUpperCase নেই)।",
        isCorrect: true,
      },
      {
        id: "opt-2",
        textEn: "toUpperCase is a deprecated JavaScript method.",
        textBn: "toUpperCase মেথডটি জাভাস্ক্রিপ্ট থেকে বাদ দেওয়া হয়েছে।",
        isCorrect: false,
      },
      {
        id: "opt-3",
        textEn: "Union types can never hold strings.",
        textBn: "ইউনিয়ন টাইপ কখনো স্ট্রিং ধারণ করতে পারে না।",
        isCorrect: false,
      },
    ],
    explanationEn: "When operating on a union `string | number`, only methods common to both types (like `toString()`) can be called without prior narrowing.",
    explanationBn: "`string | number` ইউনিয়নে অপারেশন চালাতে হলে উভয় টাইপে বিদ্যমান মেথড অথবা আগে ন্যারোইং সম্পন্ন করতে হয়।",
  },

  /* -------------------------------------------------------------------------- */
  /* CONCEPT: Compiler Pipeline & AST                                           */
  /* -------------------------------------------------------------------------- */

  {
    id: "ts.q.compiler.01",
    lessonId: "ts.variables",
    conceptIds: ["concept.compiler-pipeline"],
    type: "order-steps",
    difficulty: 3,
    estimatedSeconds: 75,
    promptEn: "Arrange the TypeScript compiler compilation pipeline steps in their exact sequence:",
    promptBn: "টাইপস্ক্রিপ্ট কম্পাইলারের এক্সিকিউশন পাইপলাইনের ধাপগুলো সঠিক ক্রমানুসারে সাজান:",
    items: [
      { id: "step-1", labelEn: "Scanner / Source Tokenizer", labelBn: "স্ক্যানার / সোর্স টোকেনাইজার", correctOrder: 1 },
      { id: "step-2", labelEn: "Parser (Generates AST)", labelBn: "পার্সার (AST তৈরি করে)", correctOrder: 2 },
      { id: "step-3", labelEn: "Binder (Symbol Table)", labelBn: "বাইন্ডার (সিম্বল টেবিল গঠন)", correctOrder: 3 },
      { id: "step-4", labelEn: "Type Checker", labelBn: "টাইপ চেকার", correctOrder: 4 },
      { id: "step-5", labelEn: "Emitter (JavaScript Output)", labelBn: "ইমিটার (জাভাস্ক্রিপ্ট কোড তৈরি)", correctOrder: 5 },
    ],
    explanationEn: "TypeScript parses source tokens into an AST, builds symbols in the binder, validates type rules in the checker, and finally emits JavaScript.",
    explanationBn: "টাইপস্ক্রিপ্ট সোর্স টোকেন পার্স করে AST বানায়, সিম্বল টেবিল তৈরি করে, টাইপস চেক করে এবং শেষে জাভাস্ক্রিপ্ট কোড এমিট করে।",
  },

  {
    id: "ts.q.matching.01",
    lessonId: "ts.variables",
    conceptIds: ["concept.structural-typing"],
    type: "matching",
    difficulty: 3,
    estimatedSeconds: 90,
    promptEn: "Match each TypeScript type concept with its foundational behavior:",
    promptBn: "প্রতিটি টাইপস্ক্রিপ্ট কনসেপ্টের সাথে তার মূল আচরণের মিল করুন:",
    pairs: [
      {
        id: "pair-1",
        leftEn: "unknown",
        leftBn: "unknown",
        rightEn: "Safe top type requiring type narrowing before performing operations.",
        rightBn: "নিরাপদ টপ টাইপ যা ব্যবহার করার আগে অবশ্যই ন্যারোইং প্রয়োজন।",
      },
      {
        id: "pair-2",
        leftEn: "any",
        leftBn: "any",
        rightEn: "Disables static type checking entirely for the expression.",
        rightBn: "সম্পূর্ণভাবে স্ট্যাটিক টাইপ চেকিং নিষ্ক্রিয় করে।",
      },
      {
        id: "pair-3",
        leftEn: "never",
        leftBn: "never",
        rightEn: "Bottom type representing an impossible state or code that never returns.",
        rightBn: "বটম টাইপ যা অসম্ভব স্টেট বা এমন কোড নির্দেশ করে যা ফিরে আসে না।",
      },
    ],
    explanationEn: "understanding top and bottom types (`unknown`, `any`, `never`) is critical for robust type modeling.",
    explanationBn: "টপ এবং বটম টাইপের তাত্ত্বিক পার্থক্য জানলে উন্নত টাইপ ডিজাইন সহজ হয়।",
  },

  {
    id: "ts.q.truefalse.01",
    lessonId: "ts.variables",
    conceptIds: ["concept.structural-typing"],
    type: "true-false",
    difficulty: 2,
    estimatedSeconds: 45,
    promptEn: "TypeScript uses nominal typing, meaning two types with identical structures but different names are incompatible.",
    promptBn: "টাইপস্ক্রিপ্ট নমিনাল টাইপিং ব্যবহার করে, যার অর্থ একই স্ট্রাকচার কিন্তু ভিন্ন নাম হলে টাইপ দুটো অসঙ্গতিপূর্ণ বলে বিবেচিত হয়।",
    correctAnswer: false,
    trueExplanationEn: "Incorrect. TypeScript uses structural typing (duck typing), comparing shapes rather than names.",
    trueExplanationBn: "ভুল। টাইপস্ক্রিপ্ট স্ট্রাকচারাল টাইপিং ব্যবহার করে যা নামের বদলে অবজেক্টের শেপ বা স্ট্রাকচার তুলনা করে।",
    falseExplanationEn: "Correct! TypeScript uses structural typing where compatibility is based on the shape of data, not explicit type names.",
    falseExplanationBn: "সঠিক! টাইপস্ক্রিপ্ট স্ট্রাকচারাল টাইপিং মেনে চলে যেখানে ডেটার শেপ বা স্ট্রাকচারের ওপর ভিত্তি করে কম্প্যাটিবিলিটি নির্ধারিত হয়।",
    explanationEn: "Structural typing ensures types are compatible if their properties match, regardless of declared names.",
    explanationBn: "স্ট্রাকচারাল টাইপিং নিশ্চিত করে যে প্রপার্টি মিললে ঘোষিত নাম ভিন্ন হলেও টাইপ কম্প্যাটিবল হবে।",
  },
];
