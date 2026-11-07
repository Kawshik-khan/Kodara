import { Lesson } from "@/features/lessons/types/lesson.types";

export const TYPESCRIPT_NARROWING_LESSON: Lesson = {
  id: "ts.type-narrowing",
  slug: "narrowing",
  trackId: "typescript",
  moduleId: "ts.mod-03.control-flow-narrowing",
  moduleTitleEn: "Control Flow + Type Narrowing",
  moduleTitleBn: "কন্ট্রোল ফ্লো এবং টাইপ ন্যারোয়িং",

  titleEn: "Type Narrowing & Control Flow Analysis",
  titleBn: "টাইপ ন্যারোয়িং এবং কন্ট্রোল ফ্লো অ্যানালাইসিস",
  subtitleEn: "Eliminate runtime uncertainty by providing the compiler with conditional evidence.",
  subtitleBn: "শর্ত সাপেক্ষে কম্পাইলারকে প্রমাণ দিয়ে রানটাইমের অনিশ্চয়তা দূর করুন।",
  descriptionEn:
    "Master the core mechanism of TypeScript's Control Flow Analysis. Understand how unions model uncertainty, how conditionals prune impossible branches, and how discriminated unions eliminate illegal runtime states.",
  descriptionBn:
    "টাইপস্ক্রিপ্টের কন্ট্রোল ফ্লো অ্যানালাইসিস আয়ত্ত করুন। ইউনিয়ন কীভাবে অনিশ্চয়তা প্রকাশ করে, শর্ত কীভাবে অসম্ভব ব্রাঞ্চ দূর করে এবং ডিসক্রিমিনেটেড ইউনিয়ন কীভাবে অবৈধ স্টেট প্রতিহত করে তা জানুন।",

  difficulty: "intermediate",
  estimatedMinutes: 30,

  prerequisites: [
    {
      id: "ts.2-5.union-types",
      titleEn: "Union Types",
      titleBn: "ইউনিয়ন টাইপস",
      slug: "/learn/typescript",
      completed: true,
    },
    {
      id: "ts.2-7.literal-types",
      titleEn: "Literal Types",
      titleBn: "লিটারেল টাইপস",
      slug: "/learn/typescript",
      completed: true,
    },
  ],

  learningObjectivesEn: [
    "Explain why narrowing is required before accessing properties exclusive to specific union branches.",
    "Trace how the TypeScript compiler's Control Flow Analysis (CFA) tracks variables across if/else and switch blocks.",
    "Apply typeof, in, instanceof, and equality discriminants to narrow types safely.",
    "Author custom user-defined type guards with 'is' predicates and assertion signatures.",
    "Utilize 'never' to implement 100% compile-time exhaustive pattern matching.",
  ],
  learningObjectivesBn: [
    "নির্দিষ্ট ব্রাঞ্চের মেম্বার অ্যাক্সেসের পূর্বে ইউনিয়ন টাইপ কেন ন্যারো করতে হয় তা ব্যাখ্যা করা।",
    "শর্ত সাপেক্ষে কম্পাইলার কীভাবে ভেরিয়েবলের টাইপ ট্র্যাক করে তা বোঝা।",
    "typeof, in, instanceof ও সমতা যাচাই করে নিরাপদে টাইপ ন্যারো করা।",
    "'is' প্রেডিকেট ও অ্যাসারশন সিগনেচার দিয়ে কাস্টম টাইপ গার্ড তৈরি করা।",
    "'never' ব্যবহার করে শতভাগ নিশ্চিত একহস্টিভ প্যাটার্ন ম্যাচিং নিশ্চিত করা।",
  ],

  concepts: [
    {
      id: "concept.control-flow-analysis",
      nameEn: "Control Flow Analysis (CFA)",
      nameBn: "কন্ট্রোল ফ্লো অ্যানালাইসিস (CFA)",
      descriptionEn: "Compiler algorithm analyzing code paths to refine variable types based on conditional evidence.",
      descriptionBn: "কোডের ব্রাঞ্চ পর্যবেক্ষণ করে শর্ত সাপেক্ষে ভ্যারিয়েবলের টাইপ নিখুঁত করার কম্পাইলার মেকানিজম।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
    {
      id: "concept.type-narrowing",
      nameEn: "Type Narrowing",
      nameBn: "টাইপ ন্যারোয়িং",
      descriptionEn: "Refining a broad union type to a more specific subtype along a particular execution path.",
      descriptionBn: "নির্দিষ্ট এক্সিকিউশন পাথে বড় টাইপ থেকে নির্দিষ্ট সাব-টাইপে নেমে আসার প্রক্রিয়া।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
    {
      id: "concept.discriminated-unions",
      nameEn: "Discriminated Unions",
      nameBn: "ডিসক্রিমিনেটেড ইউনিয়ন",
      descriptionEn: "Unions of objects sharing a common literal tag property enabling fast, unambiguous branching.",
      descriptionBn: "একই লিটারেল প্রোপার্টি শেয়ার করা অবজেক্টের ইউনিয়ন যা সুইচ দিয়ে নিরাপদ ব্রাঞ্চিং নিশ্চিত করে।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
    {
      id: "concept.exhaustiveness-checking",
      nameEn: "Exhaustiveness Checking with Never",
      nameBn: "Never দিয়ে সম্পূর্ণতা যাচাই",
      descriptionEn: "Assigning unhandled branches to the bottom type 'never' to catch missing cases at compile time.",
      descriptionBn: "অব্যবহৃত ব্রাঞ্চে never অ্যাসাইন করে নতুন ভ্যারিয়্যান্ট বাদ পড়লে কম্পাইল এরর নিশ্চিত করা।",
      trackId: "typescript",
      difficulty: "intermediate",
    },
  ],

  sections: [
    /* ====================================================================== */
    /* Section 1: The Hook: Why Narrowing Exists                              */
    /* ====================================================================== */
    {
      id: "section-1",
      order: 1,
      titleEn: "1. The Hook: Why Does Type Narrowing Exist?",
      titleBn: "১. সূচনা: টাইপ ন্যারোয়িং কেন প্রয়োজন?",
      blocks: [
        {
          id: "s1-exp-1",
          type: "explanation",
          titleEn: "Unions Represent Uncertainty",
          titleBn: "ইউনিয়ন মানেই অনিশ্চয়তা",
          contentEn:
            "When you declare a parameter as 'value: string | number', you are telling the TypeScript compiler that the value could be either a string OR a number. If you immediately attempt to call 'value.toUpperCase()', the compiler blocks you. Why? Because if the value happens to be a number at runtime, 'value.toUpperCase()' will trigger a fatal TypeError.",
          contentBn:
            "যখন আপনি একটি প্যারামিটার 'value: string | number' ঘোষণা করেন, তখন আপনি কম্পাইলারকে বলছেন যে মানটি স্ট্রিং অথবা নাম্বার যেকোনোটি হতে পারে। যদি আপনি সাথে সাথে 'value.toUpperCase()' কল করতে চান, তবে কম্পাইলার তা আটকে দেবে। কারণ রানটাইমে মানটি নাম্বার হলে কোডটি TypeError দিয়ে ক্র্যাশ করবে।",
          keyIdeaEn:
            "The compiler refuses assumptions. You must provide concrete runtime evidence before using branch-specific operations.",
          keyIdeaBn:
            "কম্পাইলার কোনো অনুমান করে না। নির্দিষ্ট ব্রাঞ্চের মেথড ব্যবহারের পূর্বে রানটাইম প্রমাণ দেওয়া বাধ্যতামূলক।",
        },
        {
          id: "s1-code-1",
          type: "code",
          title: "Compiler Refusal on Un-narrowed Union",
          language: "typescript",
          code: `function format(value: string | number) {
  // TYPE ERROR: Property 'toUpperCase' does not exist on type 'number'.
  // return value.toUpperCase();

  // SAFE: Narrow the type first!
  if (typeof value === "string") {
    return value.toUpperCase(); // Inferred as 'string'
  }

  return value.toFixed(2); // Inferred as 'number'
}`,
          highlightedLines: [3, 6, 7, 10],
          lineExplanationsEn: {
            3: "Blocked: 'number' does not have 'toUpperCase'.",
            6: "Evidence provided: typeof value === 'string'.",
            7: "Compiler narrows 'value' to string inside this block.",
            10: "Compiler knows 'value' can only be 'number' here.",
          },
          lineExplanationsBn: {
            3: "নিষিদ্ধ: 'number' এ 'toUpperCase' নেই।",
            6: "প্রমাণ দেওয়া হলো: typeof value === 'string'।",
            7: "ব্লকের ভেতরে 'value' কেবল স্ট্রিং হিসেবে ন্যারো হলো।",
            10: "কম্পাইলার জানে এখানে 'value' কেবল 'number' হতে পারে।",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 2: Mental Model: Eliminating Impossible Branches               */
    /* ====================================================================== */
    {
      id: "section-2",
      order: 2,
      titleEn: "2. The Mental Model: Eliminating Possibilities",
      titleBn: "২. মেন্টাল মডেল: অসম্ভব সম্ভাবনা ছাঁটাই",
      blocks: [
        {
          id: "s2-exp-1",
          type: "explanation",
          titleEn: "Control Flow Analysis as a Branch Pruner",
          titleBn: "কন্ট্রোল ফ্লো অ্যানালাইসিস কীভাবে ব্রাঞ্চ ছাঁটাই করে",
          contentEn:
            "Think of a union type as a set of open possibilities. Control Flow Analysis (CFA) is an engine inside the TypeScript type-checker that observes conditionals (if, switch, return, throw). Whenever it encounters a check that proves a branch cannot be taken, it prunes that type from the active set.",
          contentBn:
            "একটি ইউনিয়নকে সম্ভাব্য ব্রাঞ্চের একটি সেট হিসেবে ভাবুন। কন্ট্রোল ফ্লো অ্যানালাইসিস (CFA) হলো কম্পাইলারের ভেতরের একটি মেকানিজম যা if, switch, return বা throw পর্যবেক্ষণ করে। যখনই কোনো শর্ত একটি ব্রাঞ্চকে অসম্ভব প্রমাণ করে, কম্পাইলার সেট থেকে সেই টাইপটি ছাঁটাই করে দেয়।",
          keyIdeaEn: "Narrowing is not type conversion; it is the progressive elimination of impossible types.",
          keyIdeaBn: "ন্যারোয়িং মানে টাইপ রূপান্তর নয়; এটি হলো অসম্ভব টাইপগুলোকে ক্রমান্বয়ে বাদ দেওয়া।",
        },
        {
          id: "s2-step-1",
          type: "step-by-step",
          titleEn: "How CFA Prunes Types Across an If/Else",
          titleBn: "if/else এর মধ্য দিয়ে CFA যেভাবে টাইপ ছাঁটাই করে",
          steps: [
            {
              stepNumber: 1,
              titleEn: "Entry State",
              titleBn: "প্রবেশ মুহূর্ত",
              explanationEn: "value has type: string | number | boolean.",
              explanationBn: "value এর টাইপ: string | number | boolean।",
              code: "function process(value: string | number | boolean) {",
            },
            {
              stepNumber: 2,
              titleEn: "First Guard",
              titleBn: "প্রথম গার্ড",
              explanationEn: "typeof value === 'string' is tested. Inside the if, value is strictly 'string'.",
              explanationBn: "typeof value === 'string' পরীক্ষা হলো। if এর ভেতরে value নিশ্চিতভাবে 'string'।",
              code: "if (typeof value === 'string') { return value.trim(); }",
            },
            {
              stepNumber: 3,
              titleEn: "Remaining Set",
              titleBn: "অবশিষ্ট সেট",
              explanationEn: "Because the previous block returned, 'string' is eliminated! Remaining type: number | boolean.",
              explanationBn: "যেহেতু আগের ব্লক থেকে return হয়েছে, 'string' বাদ পড়ল! বাকি টাইপ: number | boolean।",
              code: "// Here, value is: number | boolean",
            },
            {
              stepNumber: 4,
              titleEn: "Second Guard & Final State",
              titleBn: "দ্বিতীয় গার্ড ও চূড়ান্ত অবস্থা",
              explanationEn: "typeof value === 'number' is tested. In the else, value can ONLY be 'boolean'.",
              explanationBn: "typeof value === 'number' পরীক্ষা হলো। else এ value কেবল 'boolean' হতে পারে।",
              code: "if (typeof value === 'number') { return value * 2; }\nreturn !value; // value is boolean",
            },
          ],
        },
      ],
    },

    /* ====================================================================== */
    /* Section 3: The 6 Narrowing Mechanisms                                  */
    /* ====================================================================== */
    {
      id: "section-3",
      order: 3,
      titleEn: "3. The 6 Built-in Narrowing Mechanisms",
      titleBn: "৩. টাইপস্ক্রিপ্টের ৬টি প্রধান ন্যারোয়িং মেকানিজম",
      blocks: [
        {
          id: "s3-comp-1",
          type: "comparison",
          titleEn: "Overview of Narrowing Guards",
          titleBn: "ন্যারোয়িং গার্ডসমূহের তুলনামূলক রূপরেখা",
          headers: ["Mechanism", "Runtime Syntax", "Target Types", "Limitations"],
          rows: [
            {
              featureEn: "typeof",
              featureBn: "typeof",
              values: [
                'typeof val === "string"',
                "Primitives (string, number, boolean, symbol, bigint, function)",
                'typeof null === "object" (historic JS quirk)',
              ],
            },
            {
              featureEn: "Equality",
              featureBn: "সমতা যাচাই",
              values: [
                'val.status === "success"',
                "Literal values & Discriminated unions",
                "Requires literal property match",
              ],
            },
            {
              featureEn: "in operator",
              featureBn: "'in' অপারেটর",
              values: [
                '"role" in user',
                "Object property presence",
                "Cannot narrow if property is optional (?) on multiple shapes",
              ],
            },
            {
              featureEn: "instanceof",
              featureBn: "instanceof",
              values: [
                "err instanceof CustomError",
                "Class instances & Prototypes",
                "Fails across iframes/worker realm boundaries",
              ],
            },
            {
              featureEn: "User-defined guard",
              featureBn: "কাস্টম গার্ড",
              values: [
                "isUser(val): val is User",
                "Arbitrary runtime validation",
                "Compiler trusts developer; bugs in check cause false safety",
              ],
            },
            {
              featureEn: "Assertion signature",
              featureBn: "অ্যাসারশন সিগনেচার",
              values: [
                "assertUser(val): asserts val is User",
                "Fail-fast system boundaries",
                "Throws exception on failure",
              ],
            },
          ],
        },
      ],
    },

    /* ====================================================================== */
    /* Section 4: Discriminated Unions: The Gold Standard                     */
    /* ====================================================================== */
    {
      id: "section-4",
      order: 4,
      titleEn: "4. Discriminated Unions: Making Impossible States Unrepresentable",
      titleBn: "৪. ডিসক্রিমিনেটেড ইউনিয়ন: অসম্ভব অবস্থা প্রতিরোধ",
      blocks: [
        {
          id: "s4-exp-1",
          type: "explanation",
          titleEn: "Why Discriminated Unions are the Core of Frontend Architecture",
          titleBn: "ডিসক্রিমিনেটেড ইউনিয়ন কেন ফ্রন্টএন্ড আর্কিটেকচারের মূল স্তম্ভ",
          contentEn:
            "In naive React applications, developers often model network state with separate booleans: { isLoading: boolean; error: string | null; data: User | null }. This creates 8 possible combinations, most of which are nonsensical (e.g., isLoading=true AND data is present AND error is present!). Discriminated unions eliminate this entirely.",
          contentBn:
            "অনভিজ্ঞ কোডে প্রায়ই আলাদা বুলিয়ান দিয়ে স্টেট লেখা হয়: { isLoading, error, data }। এতে ৮টি অদ্ভুত কম্বিনেশন তৈরি হয় (যেমন লোডিংও সত্য, আবার এরর ও ডেটাও উপস্থিত!)। ডিসক্রিমিনেটেড ইউনিয়ন অসম্ভব স্টেটকে কোডেই অসম্ভব করে তোলে।",
        },
        {
          id: "s4-code-1",
          type: "code",
          title: "The Canonical Discriminated Union Pattern",
          language: "typescript",
          code: `type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderUi(state: AsyncState<string>) {
  switch (state.status) {
    case "idle":
      return "Click submit to start";
    case "loading":
      return "Fetching data...";
    case "success":
      // state is narrowed to { status: "success"; data: string }
      return \`Data: \${state.data.toUpperCase()}\`;
    case "error":
      // state is narrowed to { status: "error"; error: Error }
      return \`Error: \${state.error.message}\`;
  }
}`,
          highlightedLines: [13, 14, 16, 17],
          lineExplanationsEn: {
            13: "TypeScript narrows state to the success variant.",
            14: "state.data is 100% guaranteed to exist; autocomplete is immediate.",
            16: "TypeScript narrows state to the error variant.",
            17: "state.error is guaranteed to be an Error object.",
          },
          lineExplanationsBn: {
            13: "টাইপস্ক্রিপ্ট নিশ্চিত জানে state কেবল success ভ্যারিয়্যান্ট।",
            14: "state.data নিশ্চিতভাবেই উপস্থিত; কোনো null চেকিং লাগবে না।",
            16: "state কেবল error ভ্যারিয়্যান্ট হিসেবে ন্যারো হয়েছে।",
            17: "state.error নিশ্চিত একটি Error অবজেক্ট।",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 5: Interactive Visualization                                   */
    /* ====================================================================== */
    {
      id: "section-5",
      order: 5,
      titleEn: "5. Interactive Visualization: Control Flow in Action",
      titleBn: "৫. ইন্টারঅ্যাক্টিভ ভিজ্যুয়ালাইজেশন: কন্ট্রোল ফ্লো ল্যাব",
      blocks: [
        {
          id: "s5-vis-1",
          type: "visualization",
          visualizationId: "typescript.type-narrowing",
          titleEn: "Control Flow Analysis & Union Pruning Simulator",
          titleBn: "কন্ট্রোল ফ্লো অ্যানালাইসিস ও ইউনিয়ন ছাঁটাই সিমুলেটর",
          descriptionEn:
            "Step through the execution frames below. Observe how evaluating the discriminant property prunes impossible branches until the variable is narrowed to a single guaranteed shape.",
          descriptionBn:
            "নিচের সিমুলেটরে স্টেপ করুন। ডিসক্রিমিন্যান্ট শর্ত কীভাবে অসম্ভব ব্রাঞ্চ দূর করে ভ্যারিয়েবলকে নিশ্চিত মডেলে নামিয়ে আনে তা প্রত্যক্ষ করুন।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 6: Exhaustiveness Checking with Never                          */
    /* ====================================================================== */
    {
      id: "section-6",
      order: 6,
      titleEn: "6. Exhaustiveness Checking with 'never'",
      titleBn: "৬. 'never' দিয়ে সম্পূর্ণতা নিশ্চিতকরণ (Exhaustiveness)",
      blocks: [
        {
          id: "s6-exp-1",
          type: "explanation",
          titleEn: "Mathematical Proof in Switch Statements",
          titleBn: "সুইচ স্টেটমেন্টে গাণিতিক প্রমাণের নিশ্চয়তা",
          contentEn:
            "When every possible member of a union has been handled in a switch or if-chain, the type of the variable in the default branch is 'never' (the empty set). If a developer later adds a new member to the union, TypeScript will raise an immediate compile error in the default branch!",
          contentBn:
            "যখন ইউনিয়নের প্রতিটি সদস্য সুইচ স্টেটমেন্টে হ্যান্ডেল করা শেষ হয়, তখন default ব্রাঞ্চে ভ্যারিয়েবলের টাইপ দাঁড়ায় 'never' (খালি সেট)। ভবিষ্যতে কেউ ইউনিয়নে নতুন মেম্বার যোগ করলে ডিফল্ট ব্রাঞ্চে সাথে সাথে কম্পাইল এরর ঘটবে!",
        },
        {
          id: "s6-code-1",
          type: "code",
          title: "The assertNever Pattern",
          language: "typescript",
          code: `function assertNever(x: never): never {
  throw new Error(\`Unexpected object: \${JSON.stringify(x)}\`);
}

type Theme = "light" | "dark" | "high-contrast";

function getThemeClass(theme: Theme): string {
  switch (theme) {
    case "light":
      return "theme-light";
    case "dark":
      return "theme-dark";
    case "high-contrast":
      return "theme-hc";
    default:
      // If any theme variant is forgotten, this line fails to compile!
      return assertNever(theme);
  }
}`,
          highlightedLines: [1, 2, 17, 18],
          lineExplanationsEn: {
            1: "assertNever accepts ONLY 'never'.",
            18: "If a new theme variant is added to Theme, 'theme' is NOT never here, triggering TS2345!",
          },
          lineExplanationsBn: {
            1: "assertNever কেবল 'never' টাইপই গ্রহণ করে।",
            18: "Theme এ নতুন মান যোগ করে এখানে হ্যান্ডেল না করলে কম্পাইল এরর (TS2345) ঘটবে!",
          },
        },
      ],
    },

    /* ====================================================================== */
    /* Section 7: Common Misconceptions                                       */
    /* ====================================================================== */
    {
      id: "section-7",
      order: 7,
      titleEn: "7. Common Misconceptions & Gotchas",
      titleBn: "৭. প্রচলিত ভুল ধারণা এবং ফাঁদ",
      blocks: [
        {
          id: "s7-mis-1",
          type: "mistake",
          wrongMentalModelEn:
            "Thinking: 'Writing (res as User) performs type narrowing and validates that res is actually a User.'",
          wrongMentalModelBn:
            "ভুল ধারণা: '(res as User) লিখলে টাইপ ন্যারোয়িং সম্পন্ন হয় এবং res যে আসলেই একটি User তা নিশ্চিত হয়।'",
          correctMentalModelEn:
            "Correct understanding: 'Type assertions (as Type) are compile-time overrides that tell the compiler to shut up. They do NOT perform any runtime validation or narrowing.'",
          correctMentalModelBn:
            "সঠিক ধারণা: 'টাইপ অ্যাসারশন (as Type) কেবল কম্পাইলারকে জোরপূর্বক চুপ করিয়ে দেয়। এটি কোনো রানটাইম ভ্যালিডেশন বা ন্যারোয়িং করে না।'",
          explanationEn:
            "If the server sends null and you write 'res as User', the app will compile cleanly but crash with a fatal error as soon as you access res.name.",
          explanationBn:
            "সার্ভার null পাঠালে 'res as User' লিখে কম্পাইল করা গেলেও res.name পড়ার সাথে সাথেই রানটাইমে অ্যাপ ক্র্যাশ করবে।",
        },
        {
          id: "s7-mis-2",
          type: "mistake",
          wrongMentalModelEn:
            "Thinking: 'typeof value === \"object\" is a safe way to check if value is a non-null object.'",
          wrongMentalModelBn:
            "ভুল ধারণা: 'typeof value === \"object\" দিয়ে নিশ্চিত হওয়া যায় যে মানটি একটি নন-নাল অবজেক্ট।'",
          correctMentalModelEn:
            "Correct understanding: 'In JavaScript, typeof null === \"object\"! You must always check (typeof value === \"object\" && value !== null).'",
          correctMentalModelBn:
            "সঠিক ধারণা: 'জাভাস্ক্রিপ্টে ঐতিহাসিক ত্রুটির কারণে typeof null === \"object\"! তাই সবসময় (typeof val === \"object\" && val !== null) চেক করতে হবে।'",
          explanationEn:
            "Null is an object in typeof; forgetting 'val !== null' causes the dreaded 'Cannot read properties of null' exception.",
          explanationBn:
            "typeof এ null কে অবজেক্ট হিসেবে দেখায়; 'val !== null' চেক না করলে 'Cannot read properties of null' এরর ঘটবে।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 8: Practice Questions                                          */
    /* ====================================================================== */
    {
      id: "section-8",
      order: 8,
      titleEn: "8. Practice: Test Your Mental Model",
      titleBn: "৮. প্র্যাকটিস: আপনার ধারণা যাচাই করুন",
      blocks: [
        {
          id: "s8-p1",
          type: "practice",
          practiceType: "prediction",
          questionEn: "What is the inferred type of 'val' inside the if block?",
          questionBn: "if ব্লকের ভেতরে 'val' এর ইনফার্ড টাইপ কী হবে?",
          codeSnippet: `function check(val: string | number | null) {
  if (val != null) {
    // What is val here?
    console.log(val);
  }
}`,
          options: [
            {
              id: "p1-opt-1",
              textEn: "string | number | null",
              textBn: "string | number | null",
              isCorrect: false,
              explanationEn: "Incorrect. The loose inequality check eliminates null.",
              explanationBn: "ভুল। != null শর্তটি null বাদ দিয়ে দেয়।",
            },
            {
              id: "p1-opt-2",
              textEn: "string | number",
              textBn: "string | number",
              isCorrect: true,
              explanationEn:
                "Correct! In JavaScript, 'val != null' uses loose inequality to check for BOTH null and undefined, narrowing 'val' to string | number.",
              explanationBn:
                "সঠিক! জাভাস্ক্রিপ্টে 'val != null' শর্তটি null এবং undefined উভয়কেই বাদ দেয়, ফলে val এর টাইপ string | number হয়।",
            },
            {
              id: "p1-opt-3",
              textEn: "string",
              textBn: "string",
              isCorrect: false,
              explanationEn: "Incorrect. 'number' is also non-null.",
              explanationBn: "ভুল। 'number' ও non-null হতে পারে।",
            },
          ],
        },
        {
          id: "s8-p2",
          type: "practice",
          practiceType: "code-reasoning",
          questionEn: "Why does TypeScript raise a compile error on line 6?",
          questionBn: "৬ নম্বর লাইনে টাইপস্ক্রিপ্ট কেন কম্পাইল এরর দেখাবে?",
          codeSnippet: `interface Bird { fly(): void; }
interface Fish { swim(): void; }

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly(); // Line 6
  }
}`,
          options: [
            {
              id: "p2-opt-1",
              textEn: "Line 6 compiles with NO error; '\"fly\" in animal' successfully narrows to Bird.",
              textBn: "৬ নম্বর লাইনে কোনো এরর নেই; '\"fly\" in animal' সফলভাবে Bird এ ন্যারো করে।",
              isCorrect: true,
              explanationEn:
                "Correct! The 'in' operator acts as a type guard: since 'fly' only exists on Bird, animal is narrowed to Bird.",
              explanationBn:
                "সঠিক! 'in' অপারেটর একটি টাইপ গার্ড: যেহেতু 'fly' কেবল Bird এ আছে, তাই animal সফলভাবে Bird এ ন্যারো হয়।",
            },
            {
              id: "p2-opt-2",
              textEn: "The 'in' operator cannot be used with TypeScript interfaces.",
              textBn: "'in' অপারেটর টাইপস্ক্রিপ্ট ইন্টারফেসে ব্যবহার করা যায় না।",
              isCorrect: false,
              explanationEn: "Incorrect. 'in' is completely valid and encouraged for structural narrowing.",
              explanationBn: "ভুল। 'in' অপারেটর ইন্টারফেস ন্যারোয়িংয়ে সম্পূর্ণ বৈধ ও প্রশংসিত।",
            },
          ],
        },
      ],
    },

    /* ====================================================================== */
    /* Section 9: Capstone Challenge                                          */
    /* ====================================================================== */
    {
      id: "section-9",
      order: 9,
      titleEn: "9. Challenge: The Safe State Reducer",
      titleBn: "৯. চ্যালেঞ্জ: নিরাপদ স্টেট রিডিউসার বাস্তবায়ন",
      blocks: [
        {
          id: "s9-eng-1",
          type: "engineering-note",
          titleEn: "Architecture Challenge: Zero Impossible States",
          titleBn: "আর্কিটেকচার চ্যালেঞ্জ: শূন্য অসম্ভব স্টেট",
          contentEn:
            "Design an authentication workflow using discriminated unions and exhaustive checking. The states are: 'unauthenticated', 'authenticating', 'authenticated' (with user profile and token), and 'rejected' (with error code). Ensure that trying to access the user profile while in 'authenticating' is a compile-time impossibility.",
          contentBn:
            "ডিসক্রিমিনেটেড ইউনিয়ন ও এক্সহস্টিভ চেকিং দিয়ে একটি অথেনটিকেশন ফ্লো তৈরি করুন। স্টেটগুলো হলো: unauthenticated, authenticating, authenticated এবং rejected। authenticating অবস্থায় প্রোফাইল অ্যাক্সেস করার চেষ্টা যেন কম্পাইল টাইমে অসম্ভব হয় তা নিশ্চিত করুন।",
          recommendationEn: "Use discriminated unions with a 'status' tag and assertNever in default switch cases.",
          recommendationBn: "'status' ট্যাগযুক্ত ডিসক্রিমিনেটেড ইউনিয়ন এবং ডিফল্ট কেসে assertNever ব্যবহার করুন।",
        },
      ],
    },

    /* ====================================================================== */
    /* Section 10: Summary & Next Concept                                     */
    /* ====================================================================== */
    {
      id: "section-10",
      order: 10,
      titleEn: "10. Summary & Next Steps",
      titleBn: "১০. সারসংক্ষেপ এবং পরবর্তী ধাপ",
      blocks: [
        {
          id: "s10-sum-1",
          type: "summary",
          titleEn: "Key Takeaways: The Narrowing Mental Model",
          titleBn: "মূল শিক্ষা: ন্যারোয়িংয়ের মূল দর্শন",
          takeawaysEn: [
            "Unions represent uncertainty; narrowing provides evidence to eliminate branches.",
            "Control Flow Analysis tracks branches across if/else, switch, and early returns.",
            "Discriminated unions are the gold standard for modeling state machines and API responses.",
            "The bottom type 'never' guarantees 100% compile-time exhaustiveness checking.",
            "Type assertions ('as Type') are compile-time overrides, NOT runtime validation.",
          ],
          takeawaysBn: [
            "ইউনিয়ন মানে অনিশ্চয়তা; ন্যারোয়িং প্রমাণ দিয়ে অসম্ভব ব্রাঞ্চ ছাঁটাই করে।",
            "কন্ট্রোল ফ্লো অ্যানালাইসিস if/else ও switch পর্যবেক্ষণ করে টাইপ নিখুঁত করে।",
            "স্টেট মেশিন ও API রেসপন্স মডেলিংয়ের সেরা কৌশল হলো ডিসক্রিমিনেটেড ইউনিয়ন।",
            "'never' টাইপ দিয়ে শতভাগ এক্সহস্টিভ প্যাটার্ন ম্যাচিং নিশ্চিত করা যায়।",
            "টাইপ অ্যাসারশন ('as Type') কোনো রানটাইম ভ্যালিডেশন নয়, কেবল কম্পাইলারকে নীরব করা।",
          ],
          checklistEn: [
            "I can explain why Control Flow Analysis narrows union branches.",
            "I know how to build discriminated unions with exhaustive switch checking.",
            "I understand the difference between boolean guards and type assertion signatures.",
            "I can safely handle untrusted union data without reaching for 'as'.",
          ],
          checklistBn: [
            "কন্ট্রোল ফ্লো অ্যানালাইসিস কীভাবে কাজ করে তা আমি ব্যাখ্যা করতে পারি।",
            "ডিসক্রিমিনেটেড ইউনিয়ন ও এক্সহস্টিভ সুইচ চেকিং আমি তৈরি করতে পারি।",
            "বুলিয়ান গার্ড এবং টাইপ অ্যাসারশন সিগনেচারের পার্থক্য আমি বুঝি।",
            "কোনো 'as' কাস্টিং ছাড়া অনিরাপদ ইউনিয়ন ডেটা আমি নিরাপদে ব্যবহার করতে পারি।",
          ],
        },
      ],
    },
  ],

  relatedLessons: [
    {
      id: "ts.2-5.union-types",
      titleEn: "Union Types",
      titleBn: "ইউনিয়ন টাইপস",
      slug: "/learn/typescript",
      trackId: "typescript",
      estimatedMinutes: 20,
    },
    {
      id: "ts.4-1.function-types",
      titleEn: "Function Types & Overloads",
      titleBn: "ফাংশন টাইপস এবং ওভারলোড",
      slug: "/learn/typescript",
      trackId: "typescript",
      estimatedMinutes: 20,
    },
  ],
};
