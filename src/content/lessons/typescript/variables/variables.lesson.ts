import { Lesson } from "@/features/lessons/types/lesson.types";

export const TYPESCRIPT_VARIABLES_LESSON: Lesson = {
  id: "ts-variables",
  slug: "variables",
  trackId: "typescript",
  moduleId: "mod-01",
  moduleTitleEn: "JavaScript Runtime Foundations",
  moduleTitleBn: "জাভাস্ক্রিপ্ট রানটাইম ফাউন্ডেশনস",

  titleEn: "Variables: Bindings, Memory & Scope",
  titleBn: "ভেরিয়েবল: বাইন্ডিং, মেমোরি এবং স্কোপ",
  subtitleEn: "How values are created, stored, referenced, and changed inside the runtime.",
  subtitleBn: "রানটাইমের ভেতরে মান কীভাবে তৈরি, সংরক্ষিত, রেফারেন্স এবং পরিবর্তিত হয়।",
  descriptionEn:
    "Master the core mechanics of variables: differentiate between identifiers, environment bindings, and values in memory. Understand the exact runtime differences between let, const, and var, block scoping, and the Temporal Dead Zone.",
  descriptionBn:
    "ভেরিয়েবলের মূল মেকানিক্স বুঝুন: আইডেন্টিফায়ার, এনভায়রনমেন্ট বাইন্ডিং এবং মেমোরি ভ্যালুর পার্থক্য জানুন। let, const এবং var-এর ব্লক স্কোপিং ও Temporal Dead Zone-এর নিখুঁত রূপরেখা আয়ত্ত করুন।",

  difficulty: "intermediate",
  estimatedMinutes: 14,

  prerequisites: [
    {
      id: "js-fundamentals",
      titleEn: "JavaScript Fundamentals",
      titleBn: "জাভাস্ক্রিপ্ট ফান্ডামেন্টালস",
      slug: "/learn/typescript",
      completed: true,
    },
    {
      id: "expressions-statements",
      titleEn: "Expressions & Statements",
      titleBn: "এক্সপ্রেশন এবং স্টেটমেন্টস",
      slug: "/learn/typescript",
      completed: true,
    },
    {
      id: "functions-basics",
      titleEn: "Function Invocations",
      titleBn: "ফাংশন ইনভোকেশন",
      slug: "/learn/typescript",
      completed: true,
    },
  ],

  learningObjectivesEn: [
    "Differentiate clearly between an identifier (name), a binding (environment slot), and a value (memory data).",
    "Understand the behavioral and runtime differences between let, const, and var.",
    "Explain what the Temporal Dead Zone (TDZ) is and why it exists.",
    "Understand why const does not make objects deeply immutable.",
    "Trace variable lookup through lexical environment records and scope chains.",
  ],
  learningObjectivesBn: [
    "আইডেন্টিফায়ার (নাম), বাইন্ডিং (এনভায়রনমেন্ট স্লট) এবং মেমোরি মানের মধ্যকার পার্থক্য সুস্পষ্টভাবে বোঝা।",
    "let, const এবং var এর আচরণ ও রানটাইম পার্থক্যের গভীরে যাওয়া।",
    "Temporal Dead Zone (TDZ) কী এবং কেন এটি বিদ্যমান তা ব্যাখ্যা করতে পারা।",
    "const কীভাবে কাজ করে এবং কেন এটি অবজেক্টকে ডিপলি ইমিউটেবল করে না তা বোঝা।",
    "লেক্সিক্যাল এনভায়রনমেন্ট রেকর্ড এবং স্কোপ চেইনে ভ্যারিয়েবল লুকআপ ট্রেস করা।",
  ],

  concepts: [
    {
      id: "variable-binding",
      nameEn: "Variable Binding",
      nameBn: "ভেরিয়েবল বাইন্ডিং",
      descriptionEn: "An association between an identifier and a storage slot in an Environment Record.",
      descriptionBn: "একটি এনভায়রনমেন্ট রেকর্ডে আইডেন্টিফায়ার এবং স্টোরেজ স্লটের সংযোগ।",
      trackId: "typescript",
      difficulty: "beginner",
    },
    {
      id: "lexical-scope",
      nameEn: "Lexical Scope",
      nameBn: "লেক্সিক্যাল স্কোপ",
      descriptionEn: "Determines where a binding can be accessed based on source code position.",
      descriptionBn: "সোর্স কোডের অবস্থানের ভিত্তিতে একটি বাইন্ডিং কোথায় ব্যবহারযোগ্য তা নির্ধারণ করে।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
    {
      id: "temporal-dead-zone",
      nameEn: "Temporal Dead Zone (TDZ)",
      nameBn: "টেম্পোরাল ডেড জোন (TDZ)",
      descriptionEn: "The state of a block-scoped binding from block entry until its declaration is evaluated.",
      descriptionBn: "ব্লকের শুরু থেকে ডিক্লারেশন এক্সিকিউট হওয়া পর্যন্ত let/const এর অপ্রবেশযোগ্য অবস্থা।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
    {
      id: "reference-mutation",
      nameEn: "Reference vs Primitive Mutation",
      nameBn: "রেফারেন্স বনাম প্রিমিটিভ মিউটেশন",
      descriptionEn: "Reassigning a binding vs mutating properties on a referenced heap object.",
      descriptionBn: "বাইন্ডিং রি-অ্যাসাইন করা বনাম হিপ অবজেক্টের অভ্যন্তরীণ প্রোপার্টি মিউট করা।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
  ],

  sections: [
    /* ====================================================================== */
    /* Section 1: What is a Variable?                                         */
    /* ====================================================================== */
    {
      id: "section-1",
      order: 1,
      titleEn: "1. What is a Variable?",
      titleBn: "১. ভেরিয়েবল কী?",
      blocks: [
        {
          id: "s1-exp-1",
          type: "explanation",
          titleEn: "Why Variables Exist",
          titleBn: "ভেরিয়েবল কেন প্রয়োজন?",
          contentEn:
            "Computers store raw binary data in memory locations labeled with hexadecimal memory addresses, like 0x7ffee4b2. Without symbolic identifiers, software engineers would have to manually keep track of numbers in physical memory. A variable provides a meaningful, human-readable symbolic name that binds an identifier in our code to a storage slot in the JavaScript runtime.",
          contentBn:
            "কম্পিউটার তার ফিজিক্যাল মেমোরিতে হেক্সাডেসিমাল মেমোরি অ্যাড্রেসে (যেমন 0x7ffee4b2) বাইনারি ডেটা সংরক্ষণ করে। মানুষের পক্ষে মেমোরির নির্দিষ্ট কোড মনে রাখা অসম্ভব। একটি Variable আমাদের কোডের একটি অর্থপূর্ণ আইডেন্টিফায়ারকে রানটাইমের স্টোরেজ স্লটের সাথে যুক্ত (Bind) করে।",
          keyIdeaEn: "A variable is not just a container; it is a symbolic binding between a name and a storage location.",
          keyIdeaBn: "ভ্যারিয়েবল কেবল একটি পাত্র নয়; এটি একটি নাম এবং মেমোরি স্লটের মধ্যকার আনুষ্ঠানিক সংযোগ।",
        },
        {
          id: "s1-code-1",
          type: "code",
          title: "Canonical Variable Declaration",
          language: "typescript",
          code: `// A variable declaration creates a binding in the current scope
let score: number = 100;

// Reassigning updates the value associated with the binding
score = 150;`,
          highlightedLines: [2, 5],
          lineExplanationsEn: {
            2: "Binds the identifier 'score' to a slot holding the number value 100.",
            5: "Mutates the slot associated with 'score' to hold 150.",
          },
          lineExplanationsBn: {
            2: "'score' নামের আইডেন্টিফায়ারকে ১০০ মান ধারণকারী একটি স্লটের সাথে বাইন্ড করে।",
            5: "'score' এর সাথে যুক্ত স্লটটিকে ১৫০ মান দ্বারা আপডেট করে।",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 2: Binding vs. Value                                           */
    /* ====================================================================== */
    {
      id: "section-2",
      order: 2,
      titleEn: "2. Binding vs. Value",
      titleBn: "২. বাইন্ডিং বনাম ভ্যালু",
      blocks: [
        {
          id: "s2-exp-1",
          type: "explanation",
          titleEn: "Understanding the Dual Nature of Variables",
          titleBn: "ভেরিয়েবলের দ্বৈত চরিত্র বোঝা",
          contentEn:
            "In JavaScript and TypeScript, every variable operation consists of two distinct entities: the Binding (the name and its existence in the Lexical Environment Record) and the Value (the actual data stored in memory). Reassigning a variable does not recreate the variable; it merely re-points the binding slot to a new value.",
          contentBn:
            "জাভাস্ক্রিপ্ট এবং টাইপস্ক্রিপ্টে ভেরিয়েবলের দুটি পৃথক স্তর রয়েছে: Binding (লেক্সিক্যাল এনভায়রনমেন্টে নামের স্লট) এবং Value (মেমোরিতে সংরক্ষিত প্রকৃত ডেটা)। একটি ভ্যারিয়েবল রি-অ্যাসাইন করলে নতুন ভ্যারিয়েবল তৈরি হয় না; কেবল বাইন্ডিং স্লটটিতে নতুন মান বসানো হয়।",
          keyIdeaEn: "Binding is the label in the environment record. Value is the data pointed to by that label.",
          keyIdeaBn: "বাইন্ডিং হলো এনভায়রনমেন্টের নামফলক। ভ্যালু হলো সেই নামফলক নির্দেশিত প্রকৃত ডেটা।",
        },
        {
          id: "s2-walk-1",
          type: "code-walkthrough",
          titleEn: "Execution Walkthrough: Binding vs Reassignment",
          titleBn: "এক্সিকিউশন স্টেপস: বাইন্ডিং বনাম রি-অ্যাসাইনমেন্ট",
          language: "typescript",
          initialCode: `let count = 10;
count = count + 1;
count = 25;`,
          steps: [
            {
              stepNumber: 1,
              activeLine: 1,
              codeSnippet: "let count = 10;",
              titleEn: "Step 1: Declaration & Initialization",
              titleBn: "ধাপ ১: ডিক্লারেশন ও ইনিশিয়ালাইজেশন",
              explanationEn:
                "The engine allocates a binding named 'count' in the local Environment Record and initializes it with the primitive number 10.",
              explanationBn:
                "ইঞ্জিন লোকাল এনভায়রনমেন্টে 'count' নামে একটি বাইন্ডিং স্লট বরাদ্দ করে এবং প্রাথমিক মান ১০ বসায়।",
              environmentState: {
                title: "LexicalEnvironment Record",
                bindings: [{ identifier: "count", value: "10", type: "number" }],
                noteEn: "Binding created and initialized to 10.",
                noteBn: "বাইন্ডিং তৈরি এবং মান ১০ এ সেট হয়েছে।",
              },
            },
            {
              stepNumber: 2,
              activeLine: 2,
              codeSnippet: "count = count + 1;",
              titleEn: "Step 2: Read & Reassign",
              titleBn: "ধাপ ২: রিড এবং রি-অ্যাসাইন",
              explanationEn:
                "The engine reads the current value of 'count' (10), computes (10 + 1 = 11), and overwrites the slot with 11. The binding identifier remains unchanged.",
              explanationBn:
                "ইঞ্জিন 'count'-এর বর্তমান মান (১০) পড়ে, (১০ + ১ = ১১) হিসাব করে এবং স্লটটিতে ১১ বসায়। বাইন্ডিং অপরিবর্তিত থাকে।",
              environmentState: {
                title: "LexicalEnvironment Record",
                bindings: [{ identifier: "count", value: "11", type: "number", isReassigned: true }],
                noteEn: "Slot value updated to 11.",
                noteBn: "স্লটের মান আপডেট হয়ে ১১ হয়েছে।",
              },
            },
            {
              stepNumber: 3,
              activeLine: 3,
              codeSnippet: "count = 25;",
              titleEn: "Step 3: Direct Assignment",
              titleBn: "ধাপ ৩: সরাসরি অ্যাসাইনমেন্ট",
              explanationEn:
                "A new literal value 25 is written into the existing 'count' slot. The identifier 'count' still refers to the exact same binding slot.",
              explanationBn:
                "নতুন লিটারেল মান ২৫ বিদ্যমান 'count' স্লটে সংরক্ষিত হয়।",
              environmentState: {
                title: "LexicalEnvironment Record",
                bindings: [{ identifier: "count", value: "25", type: "number", isReassigned: true }],
                noteEn: "Slot value overwritten to 25.",
                noteBn: "স্লটের মান ২৫ এ প্রতিস্থাপিত হয়েছে।",
              },
            },
          ],
        },
      ],
    },

    /* ====================================================================== */
    /* Section 3: let                                                         */
    /* ====================================================================== */
    {
      id: "section-3",
      order: 3,
      titleEn: "3. let: Block Scoping & TDZ",
      titleBn: "৩. let: ব্লক স্কোপিং ও TDZ",
      blocks: [
        {
          id: "s3-exp-1",
          type: "explanation",
          titleEn: "Modern Mutable Variables",
          titleBn: "আধুনিক পরিবর্তনযোগ্য ভ্যারিয়েবল",
          contentEn:
            "Introduced in ES2015, 'let' allows you to declare mutable variables scoped to the nearest enclosing block: { ... }. Unlike older 'var' declarations, 'let' does not leak outside of if statements, for loops, or arbitrary blocks.",
          contentBn:
            "ES2015 এ যুক্ত হওয়া 'let' ব্লক স্কোপড ({ ... }) পরিবর্তনযোগ্য ভ্যারিয়েবল তৈরি করতে দেয়। 'var' এর মতো এটি if স্টেটমেন্ট বা for লুপের বাইরে লিক করে না।",
        },
        {
          id: "s3-code-1",
          type: "code",
          title: "Block Scoping with let",
          language: "typescript",
          code: `function computeScore(isValid: boolean): number {
  let baseScore = 50;

  if (isValid) {
    // bonus only exists inside this if-block
    let bonus = 25;
    baseScore += bonus;
  }

  // console.log(bonus); // ReferenceError: bonus is not defined!
  return baseScore;
}`,
          highlightedLines: [6, 7, 10],
          lineExplanationsEn: {
            6: "'bonus' is bound strictly inside this curly-brace block.",
            10: "Accessing 'bonus' outside its declaring block throws a compile-time and runtime ReferenceError.",
          },
          lineExplanationsBn: {
            6: "'bonus' শুধুমাত্র এই কার্লি ব্রেসেস ব্লকের ভেতরেই সীমাবদ্ধ।",
            10: "ব্লকের বাইরে 'bonus' অ্যাক্সেস করলে ReferenceError ঘটবে।",
          },
        },
        {
          id: "s3-exp-2",
          type: "explanation",
          titleEn: "The Temporal Dead Zone (TDZ)",
          titleBn: "টেম্পোরাল ডেড জোন (TDZ) কী?",
          contentEn:
            "When a block is entered, all 'let' bindings within it are created in memory, but they remain UNINITIALIZED. The time between entering the block and evaluating the let declaration is called the Temporal Dead Zone. Attempting to read or write a let variable while in its TDZ throws an immediate ReferenceError.",
          contentBn:
            "যখন কোনো কোড ব্লকে প্রবেশ করে, তখন let ভ্যারিয়েবলগুলো মেমোরিতে স্পেস পেলেও তারা Uninitialized অবস্থায় থাকে। ব্লকের শুরু থেকে ভ্যারিয়েবল ডিক্লেয়ার হওয়া পর্যন্ত এই সময়কে Temporal Dead Zone (TDZ) বলা হয়। এই সময়ের মধ্যে অ্যাক্সেস করতে চাইলে সাথে সাথে ReferenceError পাওয়া যায়।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 4: const                                                       */
    /* ====================================================================== */
    {
      id: "section-4",
      order: 4,
      titleEn: "4. const: Immutable Bindings",
      titleBn: "৪. const: অপরিবর্তনযোগ্য বাইন্ডিং",
      blocks: [
        {
          id: "s4-exp-1",
          type: "explanation",
          titleEn: "Immutable Bindings, NOT Immutable Values",
          titleBn: "বাইন্ডিং অপরিবর্তনযোগ্য, ভেতরের ভ্যালু নয়",
          contentEn:
            "A 'const' declaration creates an immutable binding. Once initialized, the identifier can never be reassigned to a different slot or value. However, if the value is an object or array, the properties within that object CAN still be mutated unless explicitly frozen with Object.freeze().",
          contentBn:
            "'const' একটি ইমিউটেবল বাইন্ডিং তৈরি করে। একবার অ্যাসাইন করার পর আইডেন্টিফায়ারটিতে নতুন মান রি-অ্যাসাইন করা যায় না। কিন্তু ভ্যালুটি যদি অবজেক্ট বা অ্যারে হয়, তবে সেই অবজেক্টের অভ্যন্তরীণ প্রোপার্টি পরিবর্তন করা যায়।",
        },
        {
          id: "s4-mistake-1",
          type: "mistake",
          wrongMentalModelEn: "Thinking: 'const myObj = { x: 1 }; means myObj cannot be modified in any way.'",
          wrongMentalModelBn: "ভুল ধারণা: 'const myObj = { x: 1 }; মানে হলো myObj কখনোই কোনোভাবে পরিবর্তন করা যাবে না।'",
          correctMentalModelEn:
            "Better understanding: 'const prevents reassigning the binding myObj to another address. Mutating myObj.x = 2 modifies the heap object in-place without changing the binding reference.'",
          correctMentalModelBn:
            "সঠিক ধারণা: 'const কেবল myObj বাইন্ডিংটিকে অন্য কোনো অ্যাড্রেসে রি-অ্যাসাইন করা আটকায়। myObj.x = 2 করলে মেমোরিতে থাকা অবজেক্টের প্রোপার্টি পরিবর্তন হয়, রেফারেন্স বদলায় না।'",
          explanationEn:
            "The const keyword guards the pointer/slot in the Environment Record. It does not freeze heap memory allocations.",
          explanationBn:
            "const কিওয়ার্ডটি এনভায়রনমেন্ট রেকর্ডের স্লটটিকে পাহারা দেয়। এটি হিপ মেমোরির অবজেক্টকে লক করে না।",
        },
        {
          id: "s4-code-1",
          type: "code",
          title: "const Binding vs Mutation",
          language: "typescript",
          code: `const config = { maxRetries: 3 };

// ALLOWED: Mutating a property on the referenced object
config.maxRetries = 5;

// TYPE ERROR / RUNTIME ERROR: Cannot reassign a constant
// config = { maxRetries: 10 }; // TypeError: Assignment to constant variable.`,
          highlightedLines: [4, 7],
          lineExplanationsEn: {
            4: "Modifies the heap property in place. The binding still points to the same object.",
            7: "Reassigning the variable name to a new object fails immediately.",
          },
          lineExplanationsBn: {
            4: "হিপ অবজেক্টের প্রোপার্টি পরিবর্তন হয়েছে। বাইন্ডিং একই অবজেক্ট নির্দেশ করছে।",
            7: "ভ্যারিয়েবলটিকে নতুন অবজেক্টে রি-অ্যাসাইন করার চেষ্টা ব্যর্থ হবে।",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 5: var                                                         */
    /* ====================================================================== */
    {
      id: "section-5",
      order: 5,
      titleEn: "5. var: Legacy Scoping & Hoisting",
      titleBn: "৫. var: লেগাসি স্কোপিং এবং হোইস্টিং",
      blocks: [
        {
          id: "s5-exp-1",
          type: "explanation",
          titleEn: "Why var is Problematic in Modern Codebases",
          titleBn: "আধুনিক কোডবেসে var কেন ক্ষতিকর?",
          contentEn:
            "Before ES2015, 'var' was the only way to declare variables in JavaScript. 'var' declarations are function-scoped or globally-scoped — they completely ignore block statements ({ ... }). Furthermore, var declarations are hoisted and initialized to undefined at the top of their function, creating confusing bugs.",
          contentBn:
            "ES2015 এর পূর্বে জাভাস্ক্রিপ্টে ভ্যারিয়েবল ডিক্লেয়ার করার একমাত্র উপায় ছিল 'var'। 'var' ব্লক স্কোপ গ্রাহ্য করে না, এটি ফাংশন স্কোপড। এছাড়া var হোইস্টেড হয়ে স্বয়ংক্রিয়ভাবে undefined ইনিশিয়ালাইজ হয়, যা বিভ্রান্তিকর বাগের জন্ম দেয়।",
        },
        {
          id: "s5-comp-1",
          type: "comparison",
          titleEn: "Technical Comparison: let vs const vs var",
          titleBn: "কারিগরি তুলনা: let বনাম const বনাম var",
          headers: ["Feature", "let", "const", "var"],
          rows: [
            {
              featureEn: "Scope",
              featureBn: "স্কোপ",
              values: ["Block scoped", "Block scoped", "Function scoped"],
            },
            {
              featureEn: "Reassignable",
              featureBn: "রি-অ্যাসাইনযোগ্য",
              values: ["Yes", "No", "Yes"],
            },
            {
              featureEn: "Hoisted in Engine",
              featureBn: "হোইস্টিং",
              values: ["Yes (Uninitialized)", "Yes (Uninitialized)", "Yes (Initialized as undefined)"],
            },
            {
              featureEn: "Temporal Dead Zone",
              featureBn: "TDZ বিদ্যমান",
              values: ["Yes", "Yes", "No (Returns undefined)"],
            },
            {
              featureEn: "Pollutes Global Object",
              featureBn: "গ্লোবাল অবজেক্টে যোগ হয়",
              values: ["No", "No", "Yes (in browser window)"],
            },
          ],
          footnoteEn:
            "* Note: let and const ARE hoisted conceptually during scope creation, but remain uninitialized in the TDZ.",
          footnoteBn:
            "* দ্রষ্টব্য: let এবং const ও কম্পাইলেশন পর্যায়ে হোইস্টেড হয়, তবে ইনিশিয়ালাইজ না হওয়ায় TDZ-এ থাকে।",
        },
        {
          id: "s5-eng-1",
          type: "engineering-note",
          titleEn: "Kodara Engineering Rule: Variable Selection",
          titleBn: "কোডারার ইঞ্জিনিয়ারিং নিয়ম: ভ্যারিয়েবল নির্বাচন",
          contentEn:
            "1. Default to 'const' for 90% of declarations. When a variable does not require reassignment, const provides clarity and guarantees invariants for maintainers.\n2. Use 'let' when and only when reassignment is deliberate (e.g., accumulators, loops, or state updates).\n3. Ban 'var' in modern TypeScript via linter rule 'no-var'. It introduces no benefits and carries substantial scoping hazards.",
          contentBn:
            "১. ৯০% ক্ষেত্রে 'const' ব্যবহার করুন। এটি অনাকাঙ্ক্ষিত পরিবর্তন প্রতিহত করে কোডের নির্ভরযোগ্যতা বাড়ায়।\n২. কেবল তখনই 'let' ব্যবহার করুন যখন মান পরিবর্তন জরুরি (যেমন লুপ কাউন্টার বা স্টেট আপডেট)।\n৩. আধুনিক TypeScript প্রজেক্টে 'var' সম্পূর্ণ বর্জন করুন। লিন্টার রুল 'no-var' ব্যবহার নিশ্চিত করুন।",
          recommendationEn: "const by default. let when intentionally reassigning. Never var.",
          recommendationBn: "ডিফল্টভাবে const। প্রয়োজন সাপেক্ষে let। var কখনো নয়।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 6: Scope & Lexical Environments                                */
    /* ====================================================================== */
    {
      id: "section-6",
      order: 6,
      titleEn: "6. Scope & Lexical Environments",
      titleBn: "৬. স্কোপ ও লেক্সিক্যাল এনভায়রনমেন্ট",
      blocks: [
        {
          id: "s6-exp-1",
          type: "explanation",
          titleEn: "How the Runtime Resolves Names",
          titleBn: "রানটাইম কীভাবে নাম খুঁজে পায়?",
          contentEn:
            "JavaScript uses Lexical Scoping: an inner environment holds an implicit reference to its outer parent environment. When code reads an identifier, the engine searches the current environment record. If not found, it traverses up the parent chain until reaching the Global Environment.",
          contentBn:
            "জাভাস্ক্রিপ্ট লেক্সিক্যাল স্কোপিং অনুসরণ করে: ভেতরের প্রতিটি এনভায়রনমেন্ট তার বাইরের প্যারেন্ট এনভায়রনমেন্টের একটি রেফারেন্স ধারণ করে। যখন কোনো ভ্যারিয়েবল খোঁজা হয়, ইঞ্জিন প্রথমে বর্তমান ব্লকে খোঁজে, না পেলে ধাপে ধাপে বাইরের স্কোপে যায়।",
        },
        {
          id: "s6-code-1",
          type: "code",
          title: "Scope Chain & Variable Shadowing",
          language: "typescript",
          code: `const appVersion = "2.4.0"; // Global scope

function initModule() {
  const moduleName = "Auth"; // Function scope

  if (true) {
    const moduleName = "Auth-Internal"; // Shadows outer moduleName
    console.log(moduleName); // "Auth-Internal"
    console.log(appVersion); // "2.4.0" (resolved via outer scope)
  }

  console.log(moduleName); // "Auth" (outer binding preserved)
}`,
          highlightedLines: [7, 8, 12],
          lineExplanationsEn: {
            7: "Inner moduleName shadows outer moduleName inside this block.",
            8: "appVersion is resolved by walking up the scope chain to global.",
            12: "Inner shadow ends; outer moduleName 'Auth' is accessible again.",
          },
          lineExplanationsBn: {
            7: "ব্লকের ভেতরের moduleName বাইরেরটিকে শ্যাডো করেছে।",
            8: "appVersion খোঁজার জন্য স্কোপ চেইন বেয়ে গ্লোবাল স্কোপে যায়।",
            12: "ব্লক শেষ হওয়ায় ভেতরের শ্যাডো বিলুপ্ত; বাইরের 'Auth' অক্ষত আছে।",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 7: What Happens Under the Hood?                                */
    /* ====================================================================== */
    {
      id: "section-7",
      order: 7,
      titleEn: "7. What Happens Under the Hood?",
      titleBn: "৭. ব্যাকগ্রাউন্ডে কী ঘটে?",
      blocks: [
        {
          id: "s7-hood-1",
          type: "under-the-hood",
          titleEn: "V8 Engine: From Source Code to Memory Slot",
          titleBn: "V8 ইঞ্জিন: সোর্স কোড থেকে মেমোরি স্লট",
          explanationEn:
            "When JavaScript engines like V8 or JavaScriptCore execute 'let count = 10;', they do not merely perform string replacement. A structured sequence of compilation and memory allocation occurs.",
          explanationBn:
            "V8 ইঞ্জিনে যখন 'let count = 10;' চলে, তখন এটি একটি সুনির্দিষ্ট কম্পাইলেশন এবং মেমোরি অ্যালোকেশন পাইপলাইন পার করে।",
          pipelineSteps: [
            {
              titleEn: "1. Lexical Analysis & AST Parsing",
              titleBn: "১. লেক্সিক্যাল অ্যানালাইসিস ও AST পার্সিং",
              descEn: "Scanner tokenizes 'let', 'count', '=', '10'. Parser produces a VariableDeclaration AST node.",
              descBn: "স্ক্যানার টোকেন আলাদা করে এবং পার্সার একটি VariableDeclaration AST নোড তৈরি করে।",
            },
            {
              titleEn: "2. Scope Allocation & Bytecode Generation",
              titleBn: "২. স্কোপ অ্যালোকেশন ও বাইটকোড তৈরি",
              descEn: "Ignition compiler registers 'count' in the LexicalEnvironment Record. 'count' starts in uninitialized state.",
              descBn: "কম্পাইলার এনভায়রনমেন্ট রেকর্ডে 'count' এর স্লট রিজার্ভ করে uninitialized অবস্থায় রাখে।",
            },
            {
              titleEn: "3. Execution & Value Assignment",
              titleBn: "৩. এক্সিকিউশন ও ভ্যালু নির্ধারণ",
              descEn: "Runtime evaluates the initializer '10', writes the representation into the memory slot, and leaves the TDZ.",
              descBn: "রানটাইম ১০ মানটিকে মেমোরি স্লটে লেখে এবং TDZ এর সমাপ্তি ঘটে।",
            },
          ],
          technicalNoteEn:
            "In modern JIT compilers, primitive numbers may be stored directly as small integers (Smis) in registers without heap allocation.",
          technicalNoteBn:
            "আধুনিক JIT কম্পাইলারে ছোট পূর্ণসংখ্যাগুলো (Smis) সরাসরি রেজিস্টারে সংরক্ষিত হতে পারে, কোনো হিপ মেমোরি ছাড়াই।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 8: Interactive Visualization                                   */
    /* ====================================================================== */
    {
      id: "section-8",
      order: 8,
      titleEn: "8. Interactive Visualization: Runtime Binding Laboratory",
      titleBn: "৮. ইন্টারঅ্যাক্টিভ ভিজ্যুয়ালাইজেশন: রানটাইম ল্যাব",
      blocks: [
        {
          id: "s8-vis-1",
          type: "visualization",
          visualizationId: "typescript.variables.basic",
          titleEn: "Variable Environment Simulator",
          titleBn: "ভেরিয়েবল এনভায়রনমেন্ট সিমুলেটর",
          descriptionEn:
            "Interact with the JavaScript environment record below. Scrub values, reassign bindings, and toggle between let and const to witness how the runtime reacts.",
          descriptionBn:
            "নিচের সিমুলেটরে ভ্যারিয়েবলের মান পরিবর্তন করুন, স্লাইডার নাড়ুন এবং let বনাম const এর পার্থক্য সরাসরি প্রত্যক্ষ করুন।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 9: Practice Questions                                          */
    /* ====================================================================== */
    {
      id: "section-9",
      order: 9,
      titleEn: "9. Practice & Mental Model Check",
      titleBn: "৯. প্র্যাকটিস এবং যাচাইকরণ",
      blocks: [
        {
          id: "s9-prac-1",
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: "Which of the following statements about 'const' is technically correct?",
          questionBn: "'const' সম্পর্কে নিচের কোন বাক্যটি কারিগরিভাবে সঠিক?",
          options: [
            {
              id: "opt-1",
              textEn: "const makes any assigned object or array deeply immutable.",
              textBn: "const অবজেক্ট বা অ্যারেকে সম্পূর্ণভাবে ইমিউটেবল (অপরিবর্তনীয়) করে।",
              isCorrect: false,
              explanationEn: "Incorrect. const only protects the binding itself. Internal properties can still be modified.",
              explanationBn: "ভুল। const কেবল নাম ও অ্যাড্রেসের বাইন্ডিং সুরক্ষিত রাখে, ভেতরের প্রোপার্টি বদলানো যায়।",
            },
            {
              id: "opt-2",
              textEn: "const prevents reassignment of the identifier in the Environment Record.",
              textBn: "const এনভায়রনমেন্ট রেকর্ডে আইডেন্টিফায়ারের রি-অ্যাসাইনমেন্ট প্রতিহত করে।",
              isCorrect: true,
              explanationEn: "Correct! The binding slot is locked to its initial reference and cannot be reassigned.",
              explanationBn: "সঠিক! বাইন্ডিং স্লটটি তার প্রাথমিক রেফারেন্সে লক হয়ে যায় এবং পুনরায় মান বসানো যায় না।",
            },
            {
              id: "opt-3",
              textEn: "const is function-scoped like var.",
              textBn: "const ও var এর মতো ফাংশন স্কোপড।",
              isCorrect: false,
              explanationEn: "Incorrect. const is block-scoped to the nearest { ... } block.",
              explanationBn: "ভুল। const নিকটবর্তী { ... } ব্লকের ভেতরে সীমাবদ্ধ থাকে।",
            },
          ],
        },
        {
          id: "s9-prac-2",
          type: "practice",
          practiceType: "prediction",
          questionEn: "What will happen when the following code runs in modern JavaScript/TypeScript?",
          questionBn: "নিচের কোডটি রান করলে কী ঘটবে?",
          codeSnippet: `console.log(points);
let points = 50;`,
          options: [
            {
              id: "p2-opt-1",
              textEn: "It prints 'undefined'.",
              textBn: "এটি 'undefined' প্রিন্ট করবে।",
              isCorrect: false,
              explanationEn: "Incorrect. That would only happen with 'var'.",
              explanationBn: "ভুল। 'var' ব্যবহার করলে এমনটা ঘটত।",
            },
            {
              id: "p2-opt-2",
              textEn: "It throws a ReferenceError due to the Temporal Dead Zone (TDZ).",
              textBn: "এটি Temporal Dead Zone (TDZ) এর কারণে ReferenceError থ্রো করবে।",
              isCorrect: true,
              explanationEn: "Correct! 'points' is in the TDZ from block entry until 'let points = 50' executes.",
              explanationBn: "সঠিক! ডিক্লারেশনের আগের মুহূর্ত পর্যন্ত ভ্যারিয়েবলটি TDZ-এ থাকে।",
            },
            {
              id: "p2-opt-3",
              textEn: "It prints '50' due to hoisting.",
              textBn: "হোইস্টিংয়ের কারণে এটি '50' প্রিন্ট করবে।",
              isCorrect: false,
              explanationEn: "Incorrect. Initializers are never hoisted.",
              explanationBn: "ভুল। ইনিশিয়ালাইজেশন কখনো হোইস্টেড হয় না।",
            },
          ],
        },
      ],
    },

    /* ====================================================================== */
    /* Section 10: Summary & Key Takeaways                                    */
    /* ====================================================================== */
    {
      id: "section-10",
      order: 10,
      titleEn: "10. Summary & Next Steps",
      titleBn: "১০. সারাংশ এবং পরবর্তী পদক্ষেপ",
      blocks: [
        {
          id: "s10-sum-1",
          type: "summary",
          titleEn: "Lesson Recap: Key Takeaways",
          titleBn: "লেসনের সারসংক্ষেপ",
          takeawaysEn: [
            "A variable is a symbolic binding between an identifier in an Environment Record and a value in memory.",
            "let provides block-scoped mutable bindings with Temporal Dead Zone safety.",
            "const provides block-scoped immutable bindings; it protects the binding slot, not deep object mutability.",
            "var is function-scoped and hoists undefined, leading to unpredictable bugs in modern codebases.",
            "Lexical scoping resolves variables by traversing upward through parent Environment Records.",
          ],
          takeawaysBn: [
            "ভ্যারিয়েবল হলো এনভায়রনমেন্ট রেকর্ডের একটি আইডেন্টিফায়ার এবং মেমোরির একটি মানের মধ্যে আনুষ্ঠানিক বাইন্ডিং।",
            "let ব্লক-স্কোপড পরিবর্তনযোগ্য বাইন্ডিং প্রদান করে যা TDZ দ্বারা সুরক্ষিত।",
            "const ব্লক-স্কোপড অপরিবর্তনযোগ্য বাইন্ডিং তৈরি করে; এটি রেফারেন্স সুরক্ষিত রাখে, ডিপ অবজেক্ট নয়।",
            "var ফাংশন স্কোপড এবং এর অনাকাঙ্ক্ষিত হোইস্টিং আধুনিক কোডবেসে বিপজ্জনক।",
            "লেক্সিক্যাল স্কোপিং প্যারেন্ট এনভায়রনমেন্ট চেইনের মাধ্যমে ভ্যারিয়েবল লুকআপ সমাধান করে।",
          ],
          checklistEn: [
            "I understand the difference between identifiers, bindings, and values.",
            "I know when to choose const over let in production code.",
            "I can explain what causes a Temporal Dead Zone error.",
            "I can trace variable lookup through the scope chain.",
          ],
          checklistBn: [
            "আমি আইডেন্টিফায়ার, বাইন্ডিং এবং মানের পার্থক্য বুঝতে পেরেছি।",
            "প্রোডাকশন কোডে কখন const এবং কখন let বেছে নিতে হবে তা আমি জানি।",
            "Temporal Dead Zone কেন ঘটে তা আমি ব্যাখ্যা করতে পারি।",
            "স্কোপ চেইনের মাধ্যমে ভ্যারিয়েবল রেজোলিউশন আমি ট্রেস করতে পারি।",
          ],
        },
      ],
    },
  ],

  relatedLessons: [
    {
      id: "ts-types",
      titleEn: "The Type System: Primitives, Literals & Any",
      titleBn: "টাইপ সিস্টেম: প্রিমিটিভস, লিটারেলস এবং Any",
      slug: "/learn/typescript/types",
      trackId: "typescript",
      estimatedMinutes: 18,
    },
    {
      id: "ts-functions",
      titleEn: "Functions & Execution Contexts",
      titleBn: "ফাংশন এবং এক্সিকিউশন কনটেক্সট",
      slug: "/learn/typescript/functions",
      trackId: "typescript",
      estimatedMinutes: 22,
    },
  ],
};
