import {
  Lesson,
  LessonSection,
  ConceptReference,
} from "@/features/lessons/types/lesson.types";
import { TYPESCRIPT_VARIABLES_LESSON } from "./variables/variables.lesson";
import { TYPESCRIPT_NARROWING_LESSON } from "./narrowing/narrowing.lesson";

export { TYPESCRIPT_VARIABLES_LESSON, TYPESCRIPT_NARROWING_LESSON };

/**
 * Creates a rich 16-step canonical structured Lesson object for reference topics.
 */
function createRichReferenceLesson(config: {
  id: string;
  slug: string;
  moduleId: string;
  moduleTitleEn: string;
  moduleTitleBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  learningObjectivesEn: string[];
  learningObjectivesBn: string[];
  concept: ConceptReference;
  codeSnippet: string;
  visualizationId?: string;
  mistakeEn: { wrong: string; correct: string; explanation: string };
  mistakeBn: { wrong: string; correct: string; explanation: string };
  engineeringNoteEn: { title: string; content: string; rec?: string };
  engineeringNoteBn: { title: string; content: string; rec?: string };
  practice: {
    questionEn: string;
    questionBn: string;
    options: {
      id: string;
      textEn: string;
      textBn: string;
      isCorrect: boolean;
      explanationEn: string;
      explanationBn: string;
    }[];
  };
  takeawaysEn: string[];
  takeawaysBn: string[];
}): Lesson {
  const sections: LessonSection[] = [
    {
      id: `${config.slug}-sec-1-foundation`,
      order: 1,
      titleEn: "1. Conceptual Mechanics & Invariants",
      titleBn: "১. ধারণাগত মেকানিক্স এবং ইনভ্যারিয়্যান্ট",
      blocks: [
        {
          id: `${config.slug}-exp-1`,
          type: "explanation",
          titleEn: "The Architectural Reality",
          titleBn: "আর্কিটেকচারাল বাস্তবতা",
          contentEn: config.descriptionEn,
          contentBn: config.descriptionBn,
          keyIdeaEn: config.learningObjectivesEn[0] || config.subtitleEn,
          keyIdeaBn: config.learningObjectivesBn[0] || config.subtitleBn,
        },
        {
          id: `${config.slug}-concept-1`,
          type: "concept",
          concept: config.concept,
        },
        ...(config.visualizationId
          ? [
              {
                id: `${config.slug}-vis-1`,
                type: "visualization" as const,
                visualizationId: config.visualizationId,
                titleEn: "Interactive Mental Model Simulator",
                titleBn: "ইন্টারেক্টিভ মেন্টাল মডেল সিমুলেটর",
                descriptionEn: "Step through the runtime state machine to witness the invariant transitions in real time.",
                descriptionBn: "স্টেট মেশিন ট্রানজিশন এবং মেমোরির আচরণ রিয়েল-টাইমে প্রত্যক্ষ করুন।",
              },
            ]
          : []),
      ],
    },
    {
      id: `${config.slug}-sec-2-code`,
      order: 2,
      titleEn: "2. Concrete Code & Structural Analysis",
      titleBn: "২. কোড এবং কাঠামোগত বিশ্লেষণ",
      blocks: [
        {
          id: `${config.slug}-code-1`,
          type: "code",
          title: "Production Implementation Pattern",
          code: config.codeSnippet,
          language: "typescript",
          highlightedLines: [1, 2, 4],
        },
      ],
    },
    {
      id: `${config.slug}-sec-3-gotchas`,
      order: 3,
      titleEn: "3. Common Misconceptions & Production Failure Modes",
      titleBn: "৩. সাধারণ বিভ্রান্তি এবং প্রোডাকশন ভুলত্রুটি",
      blocks: [
        {
          id: `${config.slug}-mistake-1`,
          type: "mistake",
          wrongMentalModelEn: config.mistakeEn.wrong,
          wrongMentalModelBn: config.mistakeBn.wrong,
          correctMentalModelEn: config.mistakeEn.correct,
          correctMentalModelBn: config.mistakeBn.correct,
          explanationEn: config.mistakeEn.explanation,
          explanationBn: config.mistakeBn.explanation,
        },
        {
          id: `${config.slug}-eng-1`,
          type: "engineering-note",
          titleEn: config.engineeringNoteEn.title,
          titleBn: config.engineeringNoteBn.title,
          contentEn: config.engineeringNoteEn.content,
          contentBn: config.engineeringNoteBn.content,
          recommendationEn: config.engineeringNoteEn.rec,
          recommendationBn: config.engineeringNoteBn.rec,
        },
      ],
    },
    {
      id: `${config.slug}-sec-4-practice`,
      order: 4,
      titleEn: "4. Architectural Verification & Summary",
      titleBn: "৪. আর্কিটেকচারাল যাচাই এবং সারাংশ",
      blocks: [
        {
          id: `${config.slug}-practice-1`,
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: config.practice.questionEn,
          questionBn: config.practice.questionBn,
          options: config.practice.options,
        },
        {
          id: `${config.slug}-summary-1`,
          type: "summary",
          titleEn: "Key Invariants & Mental Models",
          titleBn: "মূল নীতিমালা এবং মেন্টাল মডেল",
          takeawaysEn: config.takeawaysEn,
          takeawaysBn: config.takeawaysBn,
          checklistEn: [
            "Verify compile-time types match runtime invariants.",
            "Eliminate unsafe type assertions from boundary code.",
            "Enforce strict null handling across function signatures.",
          ],
          checklistBn: [
            "কম্পাইল-টাইম টাইপ ও রানটাইম আচরণের সামঞ্জস্য যাচাই করুন।",
            "বাউন্ডারি কোড থেকে আনসেফ টাইপ অ্যাসারশন দূর করুন।",
            "ফাংশন সিগনেচারে স্ট্রিক্ট নাল হ্যান্ডলিং নিশ্চিত করুন।",
          ],
        },
      ],
    },
  ];

  return {
    id: config.id,
    slug: config.slug,
    trackId: "typescript",
    moduleId: config.moduleId,
    moduleTitleEn: config.moduleTitleEn,
    moduleTitleBn: config.moduleTitleBn,
    titleEn: config.titleEn,
    titleBn: config.titleBn,
    subtitleEn: config.subtitleEn,
    subtitleBn: config.subtitleBn,
    descriptionEn: config.descriptionEn,
    descriptionBn: config.descriptionBn,
    difficulty: config.difficulty,
    estimatedMinutes: config.estimatedMinutes,
    prerequisites: [],
    learningObjectivesEn: config.learningObjectivesEn,
    learningObjectivesBn: config.learningObjectivesBn,
    concepts: [config.concept],
    sections,
    relatedLessons: [],
  };
}

/* ========================================================================== */
/* Top 20 Reference Lessons Following 16-Step Canonical Architecture         */
/* ========================================================================== */

export const REFERENCE_LESSON_HOW_JS_TS_DIFFER: Lesson = createRichReferenceLesson({
  id: "ts.01.how-js-ts-differ",
  slug: "how-js-ts-differ",
  moduleId: "ts.mod-01.js-foundations",
  moduleTitleEn: "Module 1: JavaScript Foundations: The Runtime Reality",
  moduleTitleBn: "মডিউল ১: জাভাস্ক্রিপ্ট ফাউন্ডেশনস: রানটাইম বাস্তবতা",
  titleEn: "1.1 How JavaScript and TypeScript Truly Differ",
  titleBn: "১.১ জাভাস্ক্রিপ্ট এবং টাইপস্ক্রিপ্টের আসল পার্থক্য",
  subtitleEn: "The two-layer architecture: static analysis on top of dynamic execution.",
  subtitleBn: "দ্বি-স্তরবিশিষ্ট আর্কিটেকচার: ডাইনামিক এক্সিকিউশনের ওপর স্ট্যাটিক অ্যানালাইসিস।",
  descriptionEn:
    "TypeScript is not a new language that executes in browsers; it is a compile-time type checker layered directly over standard ECMAScript. When code runs in production, TypeScript is completely gone.",
  descriptionBn:
    "টাইপস্ক্রিপ্ট কোনো নতুন রানটাইম ভাষা নয়; এটি জাভাস্ক্রিপ্টের ওপর একটি কম্পাইল-টাইম টাইপ চেকিং স্তর। প্রোডাকশনে কোড চলার সময় টাইপস্ক্রিপ্টের কোনো অস্তিত্ব থাকে না।",
  difficulty: "beginner",
  estimatedMinutes: 15,
  learningObjectivesEn: [
    "Differentiate compile-time static analysis from runtime dynamic execution.",
    "Explain why TypeScript errors do not inherently prevent JavaScript emission.",
    "Understand the principle of type erasure and its performance implications.",
  ],
  learningObjectivesBn: [
    "কম্পাইল-টাইম স্ট্যাটিক অ্যানালাইসিস ও রানটাইম এক্সিকিউশনের পার্থক্য বোঝা।",
    "টাইপ এরর থাকা সত্ত্বেও কেন জাভাস্ক্রিপ্ট কোড তৈরি হয় তা জানা।",
    "টাইপ ইরেজারের কর্মপদ্ধতি ও পারফরম্যান্স প্রভাব উপলব্ধি করা।",
  ],
  concept: {
    id: "concept.compile-time",
    nameEn: "Compile-Time Static Analysis",
    nameBn: "কম্পাইল-টাইম স্ট্যাটিক অ্যানালাইসিস",
    descriptionEn: "Verifying code semantics before runtime execution.",
    descriptionBn: "কোড রান করার আগেই টাইপস্ক্রিপ্ট দিয়ে কোডের নির্ভুলতা যাচাই।",
    trackId: "typescript",
    difficulty: "beginner",
  },
  visualizationId: "typescript.type-erasure.pipeline",
  codeSnippet: `// Compile-time TypeScript definition:
interface SystemUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

function verifyAccess(user: SystemUser): boolean {
  return user.isAdmin;
}

// Emitted runtime JavaScript (notice the complete erasure of the interface):
// function verifyAccess(user) {
//   return user.isAdmin;
// }`,
  mistakeEn: {
    wrong: "TypeScript protects my application from bad data coming over the network at runtime.",
    correct: "TypeScript only validates the code you write at compile time. Runtime JSON must be validated explicitly.",
    explanation: "Because interfaces are erased during compilation, an API returning invalid JSON will crash plain JavaScript.",
  },
  mistakeBn: {
    wrong: "টাইপস্ক্রিপ্ট রানটাইমে নেটওয়ার্ক থেকে আসা ভুল ডেটা স্বয়ংক্রিয়ভাবে আটকে দেয়।",
    correct: "টাইপস্ক্রিপ্ট কেবল কম্পাইল করার সময় কোড যাচাই করে; নেটওয়ার্ক ডেটা রানটাইমে আলাদাভাবে ভ্যালিডেট করতে হয়।",
    explanation: "কম্পাইলেশনে ইন্টারফেস সম্পূর্ণ মুছে যায়, তাই সার্ভারের ভুল ডেটায় কোনো টাইপ গার্ড ছাড়া ক্র্যাশ ঘটবে।",
  },
  engineeringNoteEn: {
    title: "Zero Runtime Overhead Guarantee",
    content: "TypeScript contributes exactly 0 bytes and 0 CPU cycles to your production bundle. All checking cost is paid upfront at build time.",
    rec: "Never attempt to use 'instanceof MyInterface' or inspect TypeScript types at runtime.",
  },
  engineeringNoteBn: {
    title: "জিরো রানটাইম ওভারহেড নিশ্চয়তা",
    content: "টাইপস্ক্রিপ্ট প্রোডাকশনে কোনো অতিরিক্ত মেমোরি বা CPU খরচ তৈরি করে না। সব চেকিং বিল্ড টাইমে সম্পন্ন হয়।",
    rec: "রানটাইমে কখনো 'instanceof MyInterface' চেক করার চেষ্টা করবেন না।",
  },
  practice: {
    questionEn: "What happens to a TypeScript 'type' alias or 'interface' when compiled to JavaScript?",
    questionBn: "জাভাস্ক্রিপ্টে কম্পাইল করার পর টাইপস্ক্রিপ্ট 'interface' বা 'type' এর কী ঘটে?",
    options: [
      {
        id: "opt-1",
        textEn: "It is converted into a hidden JavaScript class validator.",
        textBn: "এটি একটি হিডেন জাভাস্ক্রিপ্ট ক্লাসে রূপান্তরিত হয়।",
        isCorrect: false,
        explanationEn: "TypeScript does not generate runtime validation code for interfaces.",
        explanationBn: "টাইপস্ক্রিপ্ট ইন্টারফেসের জন্য কোনো রানটাইম ক্লাস তৈরি করে না।",
      },
      {
        id: "opt-2",
        textEn: "It is completely erased from the output JavaScript file.",
        textBn: "এটি আউটপুট জাভাস্ক্রিপ্ট ফাইল থেকে সম্পূর্ণ মুছে যায়।",
        isCorrect: true,
        explanationEn: "Correct! The principle of type erasure guarantees that types leave zero runtime trace.",
        explanationBn: "সঠিক! টাইপ ইরেজারের কারণে কম্পাইলেশনের পর কোনো টাইপ অবশিষ্ট থাকে না।",
      },
      {
        id: "opt-3",
        textEn: "It is preserved as a freeze-locked Object.prototype definition.",
        textBn: "এটি Object.prototype এ সংরক্ষিত থাকে।",
        isCorrect: false,
        explanationEn: "Prototypes are untouched by TypeScript type declarations.",
        explanationBn: "প্রোটোটাইপে টাইপ যোগ হয় না।",
      },
    ],
  },
  takeawaysEn: [
    "TypeScript is a static analysis layer that disappears at runtime.",
    "Type annotations do not enforce runtime data validation.",
    "Compilation separates type-checking from code emission.",
  ],
  takeawaysBn: [
    "টাইপস্ক্রিপ্ট একটি স্ট্যাটিক অ্যানালাইসিস টুল যা রানটাইমে মুছে যায়।",
    "টাইপ অ্যানোটেশন রানটাইম ডেটা ভ্যালিডেশন দেয় না।",
    "কম্পাইলেশন টাইপ চেকিং এবং কোড জেনারেশনকে আলাদা রাখে।",
  ],
});

export const REFERENCE_LESSON_CLOSURES_AND_SCOPE: Lesson = createRichReferenceLesson({
  id: "ts.01.closures-and-scope",
  slug: "closures-and-scope",
  moduleId: "ts.mod-01.js-foundations",
  moduleTitleEn: "Module 1: JavaScript Foundations: The Runtime Reality",
  moduleTitleBn: "মডিউল ১: জাভাস্ক্রিপ্ট ফাউন্ডেশনস: রানটাইম বাস্তবতা",
  titleEn: "1.5 Closures, Lexical Environment & Scope Chain",
  titleBn: "১.৫ ক্লোজার, লেক্সিক্যাল এনভায়রনমেন্ট এবং স্কোপ চেইন",
  subtitleEn: "How functions retain live memory references to parent environments.",
  subtitleBn: "ফাংশন কীভাবে প্যারেন্ট এনভায়রনমেন্টের জীবন্ত মেমোরি রেফারেন্স ধরে রাখে।",
  descriptionEn:
    "Master closures at the V8 engine level. When an inner function outlives its parent, it retains a live reference pointer to the parent's Lexical Environment Record on the heap, preventing garbage collection.",
  descriptionBn:
    "V8 ইঞ্জিন স্তরে ক্লোজারের কর্মপদ্ধতি। প্যারেন্ট ফাংশন রিটার্ন করার পরও ইনার ফাংশন হিপ মেমোরিতে প্যারেন্টের লেক্সিক্যাল এনভায়রনমেন্টের জীবন্ত পয়েন্টার ধরে রাখে।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Diagram the heap pointer relationship between inner functions and outer Environment Records.",
    "Prevent accidental memory leaks caused by unbounded closure retention in event listeners.",
    "Differentiate block scope let/const closures from legacy function-scoped var hoisting.",
  ],
  learningObjectivesBn: [
    "ইনার ফাংশন ও আউটার এনভায়রনমেন্ট রেকর্ডের মধ্যে মেমোরি পয়েন্টার চিত্রিত করা।",
    "ইভেন্ট লিসেনারে ক্লোজার মেমোরি লিক শনাক্ত ও প্রতিরোধ করা।",
    "ব্লক স্কোপ এবং লেগ্যাসি var হোইস্টিংয়ের পার্থক্য করা।",
  ],
  concept: {
    id: "concept.closures",
    nameEn: "Closures & Environment Retention",
    nameBn: "ক্লোজারস এবং মেমোরি রিটেনশন",
    descriptionEn: "Live references retained across scope lifetimes.",
    descriptionBn: "ফাংশন স্কোপ শেষ হওয়ার পরেও বাইরের ডেটা মেমোরিতে ধরে রাখার ক্ষমতা।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.scope.lookup",
  codeSnippet: `function createRateLimiter(maxRequests: number) {
  let requestCount = 0; // Heap allocated inside Environment Record

  return function handleRequest(endpoint: string): boolean {
    if (requestCount >= maxRequests) {
      console.warn(\`Rate limit reached for \${endpoint}\`);
      return false;
    }
    requestCount += 1;
    return true;
  };
}

const apiLimiter = createRateLimiter(5);
apiLimiter('/users'); // requestCount is live in closure scope`,
  mistakeEn: {
    wrong: "Closures take a copy of the variable's value at the time the function was declared.",
    correct: "Closures bind by reference to the Environment Record slot, not by value.",
    explanation: "If another operation mutates the outer variable, the closure observes the updated value immediately.",
  },
  mistakeBn: {
    wrong: "ক্লোজার তৈরির সময় ভ্যারিয়েবলের একটি স্থির কপি তৈরি হয়।",
    correct: "ক্লোজার মানের কপি নয়, বরং মেমোরি স্লটের সরাসরি জীবন্ত রেফারেন্স ধারণ করে।",
    explanation: "বাইরের ভ্যারিয়েবলের মান পরিবর্তিত হলে ক্লোজারের ভেতরেও সেই নতুন মান সাথে সাথে প্রতিফলিত হয়।",
  },
  engineeringNoteEn: {
    title: "Closure Memory Leaks in High-Throughput Servers",
    content: "Retaining heavy objects (e.g. 10MB buffers) inside a closure assigned to a long-lived cache or listener keeps the entire buffer alive indefinitely.",
    rec: "Explicitly set outer buffer variables to null once inner async work finishes if closures are long-lived.",
  },
  engineeringNoteBn: {
    title: "হাই-থ্রুপুট সার্ভারে ক্লোজার মেমোরি লিক",
    content: "বড় ডেটা বা বাফার ক্লোজারের ভেতর রেফারেন্স থাকলে ইভেন্ট লিসেনার দীর্ঘস্থায়ী হলে মেমোরি মুক্ত হতে পারে না।",
    rec: "কাজ শেষ হলে দীর্ঘমেয়াদী ক্লোজারের বাইরের রেফারেন্স null করে দিন।",
  },
  practice: {
    questionEn: "Why does a closure keep variables accessible after the enclosing function returns?",
    questionBn: "প্যারেন্ট ফাংশন রিটার্ন করার পরও ক্লোজার কেন বাইরের ভ্যারিয়েবল ব্যবহার করতে পারে?",
    options: [
      {
        id: "c-1",
        textEn: "Because the inner function retains a heap reference to the enclosing Lexical Environment Record.",
        textBn: "কারণ ইনার ফাংশন হিপ মেমোরিতে প্যারেন্টের লেক্সিক্যাল এনভায়রনমেন্টের রেফারেন্স পয়েন্টার ধরে রাখে।",
        isCorrect: true,
        explanationEn: "Correct! The garbage collector cannot free the environment record while an active reference exists.",
        explanationBn: "সঠিক! সক্রিয় রেফারেন্স থাকায় গার্বেজ কালেক্টর এনভায়রনমেন্ট রেকর্ড মুছে ফেলতে পারে না।",
      },
      {
        id: "c-2",
        textEn: "Because the browser serializes the function variables into localStorage.",
        textBn: "কারণ ব্রাউজার ভ্যারিয়েবলগুলোকে লোকাল স্টোরেজে সেভ করে রাখে।",
        isCorrect: false,
        explanationEn: "Closures operate entirely within JavaScript runtime heap memory.",
        explanationBn: "ক্লোজার লোকাল স্টোরেজের সাথে সম্পর্কিত নয়, এটি র‍্যামের হিপ মেমোরিতে থাকে।",
      },
    ],
  },
  takeawaysEn: [
    "Closures bind by reference to Environment Records, not by snapshot value.",
    "Unbounded closure retention in global event handlers is a leading cause of memory leaks.",
    "Block-scoped let in loops creates a discrete binding for every iteration.",
  ],
  takeawaysBn: [
    "ক্লোজার রেফারেন্স বাইন্ড করে, মানের কপি নয়।",
    "গ্লোবাল লিসেনারে ক্লোজার অসাবধানে রাখলে মেমোরি লিক হতে পারে।",
    "লুপের ভেতর let প্রতি ইটারেশনে আলাদা বাইন্ডিং তৈরি করে।",
  ],
});

export const REFERENCE_LESSON_WHAT_TS_DOES: Lesson = createRichReferenceLesson({
  id: "ts.02.what-ts-does",
  slug: "what-ts-does",
  moduleId: "ts.mod-02.ts-fundamentals",
  moduleTitleEn: "Module 2: TypeScript Fundamentals: First Steps",
  moduleTitleBn: "মডিউল ২: টাইপস্ক্রিপ্ট ফান্ডামেন্টালস: প্রথম পদক্ষেপ",
  titleEn: "2.1 What TypeScript Does and Does NOT Do",
  titleBn: "২.১ টাইপস্ক্রিপ্ট কী করে এবং কী করে না",
  subtitleEn: "Establishing realistic mental boundaries on the power and limits of the type checker.",
  subtitleBn: "টাইপ চেকারের ক্ষমতা এবং সীমাবদ্ধতা সম্পর্কে বাস্তববাদী মানসিক সীমানা নির্ধারণ।",
  descriptionEn:
    "TypeScript is a compile-time static analyzer and transpiler. It catches spelling mistakes, invalid property accesses, and broken contracts in source code. It does NOT optimize performance, enforce security against malicious inputs, or run runtime checks.",
  descriptionBn:
    "টাইপস্ক্রিপ্ট কোড কম্পাইল করার সময় বানান ভুল, ভুল প্রোপার্টি অ্যাক্সেস এবং কন্ট্রাক্ট ভঙ্গ শনাক্ত করে। তবে এটি কোডের পারফরম্যান্স বাড়ায় না বা বহিরাগত আক্রমণ থেকে সরাসরি নিরাপত্তা দেয় না।",
  difficulty: "beginner",
  estimatedMinutes: 15,
  learningObjectivesEn: [
    "List the specific bug classes TypeScript detects (typos, undefined access, wrong parameter counts).",
    "Identify vulnerabilities that TypeScript cannot prevent without runtime schema validation.",
  ],
  learningObjectivesBn: [
    "টাইপস্ক্রিপ্ট কোন কোন বাগ ধরে তা তালিকাভুক্ত করা।",
    "রানটাইম ভ্যালিডেশন ছাড়া কোন সমস্যাগুলো আটকানো যায় না তা বোঝা।",
  ],
  concept: {
    id: "concept.type-safety",
    nameEn: "Type Safety & Invariant Guarantees",
    nameBn: "টাইপ সেফটি এবং ইনভ্যারিয়্যান্ট নিশ্চয়তা",
    descriptionEn: "Static prevention of invalid operations.",
    descriptionBn: "কোড রান করার আগেই অবৈধ অপারেশনের বিরুদ্ধে সুরক্ষা।",
    trackId: "typescript",
    difficulty: "beginner",
  },
  codeSnippet: `// TypeScript PREVENTS this at author time:
const user = { name: "Aria", email: "aria@kodara.dev" };
// user.emial; // TS Error: Property 'emial' does not exist. Did you mean 'email'?

// TypeScript CANNOT prevent this without runtime guards:
const rawInput: any = JSON.parse('{"status": "corrupt"}');
// If you cast blindly:
const verified = rawInput as { id: number };
// verified.id.toFixed(2); // Compiles fine, crashes at runtime!`,
  mistakeEn: {
    wrong: "If my TypeScript project compiles with 0 errors, it is guaranteed to be bug-free.",
    correct: "Compilation proves internal consistency against written types, but cannot verify dynamic assumptions.",
    explanation: "Faulty external data, logic errors, and unsafe type assertions ('as') can still cause runtime crashes.",
  },
  mistakeBn: {
    wrong: "প্রজেক্টে ০ এরর থাকলে রানটাইমে কোনো বাগ থাকা অসম্ভব।",
    correct: "কম্পাইলেশন কেবল আপনার লেখা কোডের ভেতরের সামঞ্জস্য যাচাই করে, বাইরের ডেটার নির্ভুলতা নয়।",
    explanation: "লজিক্যাল ভুল বা আনসেফ কাস্টিং থাকলে ০ এরর থাকা সত্ত্বেও অ্যাপ ক্র্যাশ করতে পারে।",
  },
  engineeringNoteEn: {
    title: "The Soundness Illusion",
    content: "TypeScript is intentionally pragmatic, not 100% mathematically sound. Do not rely on TypeScript types as a substitute for unit tests or defensive input validation.",
    rec: "Always pair external API calls with Zod or Valibot schema parsers.",
  },
  engineeringNoteBn: {
    title: "সাউন্ডনেস সম্পর্কে বাস্তব ধারণা",
    content: "টাইপস্ক্রিপ্ট ১০০% গাণিতিক সাউন্ডনেস দাবি করে না। তাই টেস্ট ও ডিফেন্সিভ ভ্যালিডেশন সবসময় রাখুন।",
    rec: "বহিরাগত ডেটা পার্সিংয়ে Zod বা Valibot ব্যবহার করুন।",
  },
  practice: {
    questionEn: "Which of the following bugs can the TypeScript compiler catch automatically?",
    questionBn: "নিচের কোন সমস্যাটি টাইপস্ক্রিপ্ট কম্পাইলার স্বয়ংক্রিয়ভাবে ধরতে পারে?",
    options: [
      {
        id: "wtd-1",
        textEn: "Passing 2 arguments to a function defined to require 3 arguments.",
        textBn: "৩টি আর্গুমেন্ট আবশ্যক এমন ফাংশনে ভুল করে ২টি আর্গুমেন্ট পাস করা।",
        isCorrect: true,
        explanationEn: "Correct! Arity checks and parameter contracts are enforced strictly at compile time.",
        explanationBn: "সঠিক! প্যারামিটার সংখ্যা ও টাইপ কম্পাইল টাইমে কঠোরভাবে যাচাই করা হয়।",
      },
      {
        id: "wtd-2",
        textEn: "A database query failing due to a dropped PostgreSQL connection.",
        textBn: "ডাটাবেস কানেকশন ড্রপ করায় কুয়েরি ব্যর্থ হওয়া।",
        isCorrect: false,
        explanationEn: "Infrastructure runtime connectivity failures cannot be caught at compile time.",
        explanationBn: "রানটাইম অবকাঠামোগত ব্যর্থতা কম্পাইল টাইমে ধরা সম্ভব নয়।",
      },
    ],
  },
  takeawaysEn: [
    "TypeScript eliminates syntax mistakes, typos, and signature mismatch bugs.",
    "TypeScript cannot replace runtime schema validation for network boundaries.",
    "The type checker verifies intentions, not live infrastructure state.",
  ],
  takeawaysBn: [
    "টাইপস্ক্রিপ্ট টাইপো, মিসিং প্রোপার্টি ও আর্গুমেন্ট অমিল প্রতিরোধ করে।",
    "নেটওয়ার্ক সীমানায় রানটাইম ভ্যালিডেশনের বিকল্প টাইপস্ক্রিপ্ট হতে পারে না।",
    "টাইপ চেকার কোডের অভিপ্রায় যাচাই করে, লাইভ ডাটাবেস নয়।",
  ],
});

export const REFERENCE_LESSON_PRIMITIVE_TYPES: Lesson = createRichReferenceLesson({
  id: "ts.02.primitive-types",
  slug: "primitive-types",
  moduleId: "ts.mod-02.ts-fundamentals",
  moduleTitleEn: "Module 2: TypeScript Fundamentals: First Steps",
  moduleTitleBn: "মডিউল ২: টাইপস্ক্রিপ্ট ফান্ডামেন্টালস: প্রথম পদক্ষেপ",
  titleEn: "2.2 The Primitive Types: JavaScript Realities",
  titleBn: "২.২ প্রিমিটিভ টাইপস: জাভাস্ক্রিপ্ট বাস্তবতা",
  subtitleEn: "string, number, boolean, null, undefined, symbol, and bigint.",
  subtitleBn: "string, number, boolean, null, undefined, symbol এবং bigint।",
  descriptionEn:
    "Explore the 7 atomic primitives in JavaScript and their TypeScript type representations. Understand why number includes NaN and Infinity, why null and undefined represent distinct mental states, and how symbol enables unique object branding.",
  descriptionBn:
    "জাভাস্ক্রিপ্টের ৭টি অবিভাজ্য প্রিমিটিভ টাইপ এবং টাইপস্ক্রিপ্টে তাদের রূপ। number কেন NaN ধারণ করে এবং null ও undefined এর মধ্যে পার্থক্য জানুন।",
  difficulty: "beginner",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Enumerate the 7 JavaScript primitives and their TypeScript keywords.",
    "Differentiate lowercase primitive types ('string', 'number') from boxed wrapper objects ('String', 'Number').",
    "Explain why NaN is typed as number in both JS and TS.",
  ],
  learningObjectivesBn: [
    "৭টি প্রিমিটিভ টাইপ ও তাদের টাইপস্ক্রিপ্ট কিওয়ার্ড জানা।",
    "লোয়ারকেস প্রিমিটিভ টাইপের সাথে ক্যাপিটাল বক্সড অবজেক্টের পার্থক্য বোঝা।",
    "NaN কেন number টাইপের অংশ তা ব্যাখ্যা করা।",
  ],
  concept: {
    id: "concept.primitives",
    nameEn: "JavaScript Primitives & Immutability",
    nameBn: "জাভাস্ক্রিপ্ট প্রিমিটিভস এবং ইমিউটেবিলিটি",
    descriptionEn: "Atomic value types in the JavaScript runtime.",
    descriptionBn: "জাভাস্ক্রিপ্টের মৌলিক অবিভাজ্য ডেটা প্রকারসমূহ।",
    trackId: "typescript",
    difficulty: "beginner",
  },
  codeSnippet: `// Proper lowercase primitive types:
const title: string = "Kodara Engineering";
const score: number = 98.5; // Includes integers, floats, NaN, Infinity
const isActive: boolean = true;
const idKey: symbol = Symbol("uniqueId");
const hugeCounter: bigint = 9007199254740991n;

// ANTI-PATTERN: Never type with uppercase Boxed Wrapper classes:
// let badStr: String; // Binds to String wrapper object, not primitive!`,
  mistakeEn: {
    wrong: "Using 'String', 'Number', or 'Boolean' with capital letters as type annotations.",
    correct: "Always use lowercase 'string', 'number', 'boolean', 'symbol', 'bigint'.",
    explanation: "Uppercase types refer to the legacy JavaScript object wrapper constructors (new String()), which reject primitive assignment.",
  },
  mistakeBn: {
    wrong: "ক্যাপিটাল অক্ষরে 'String', 'Number' দিয়ে টাইপ অ্যানোটেশন দেওয়া।",
    correct: "সর্বদা লোয়ারকেস 'string', 'number', 'boolean' ব্যবহার করুন।",
    explanation: "ক্যাপিটাল টাইপ জাভাস্ক্রিপ্টের বক্সড র‍্যাপার অবজেক্ট বোঝায়, যা সাধারণ প্রিমিটিভ ভ্যালু গ্রহণ করে না।",
  },
  engineeringNoteEn: {
    title: "IEEE-754 Floating Point Precision",
    content: "TypeScript's 'number' represents double-precision 64-bit binary format IEEE 754 values. 0.1 + 0.2 === 0.30000000000000004 in JavaScript.",
    rec: "For currency and financial transactions, use integer cents or dedicated BigNumber libraries.",
  },
  engineeringNoteBn: {
    title: "IEEE-754 ফ্লোটিং পয়েন্ট নির্ভুলতা",
    content: "জাভাস্ক্রিপ্টে number হলো ডাবল-প্রিসিশন ফ্লোট। তাই ০.১ + ০.২ কখনো সরাসরি ০.৩ হয় না।",
    rec: "আর্থিক হিসাবের জন্য সবসময় ইনটিজার পয়সা বা সেন্ট হিসাব করুন।",
  },
  practice: {
    questionEn: "Why is 'typeof NaN' equal to 'number' in JavaScript and TypeScript?",
    questionBn: "জাভাস্ক্রিপ্ট এবং টাইপস্ক্রিপ্টে 'typeof NaN' কেন 'number'?",
    options: [
      {
        id: "prim-1",
        textEn: "Because NaN represents an un-representable numeric result in IEEE-754 arithmetic.",
        textBn: "কারণ IEEE-754 স্ট্যান্ডার্ড অনুযায়ী অবৈধ গাণিতিক ফলাফলের সাংখ্যিক মান হলো NaN।",
        isCorrect: true,
        explanationEn: "Correct! NaN stands for Not-a-Number, but in IEEE-754 it is technically a numeric domain value.",
        explanationBn: "সঠিক! NaN হলো অনির্ণেয় সংখ্যার মান, যা নাম্বারের সেটেরই অংশ।",
      },
      {
        id: "prim-2",
        textEn: "It is an uncorrected bug in the original 10-day JavaScript prototype.",
        textBn: "এটি ব্রাউজারের একটি পুরনো বাগ যা এখনো সংশোধন করা হয়নি।",
        isCorrect: false,
        explanationEn: "NaN is explicitly part of the IEEE-754 floating-point standard used by all hardware.",
        explanationBn: "এটি কোনো বাগ নয়, এটি আন্তর্জাতিক IEEE-754 স্ট্যান্ডার্ড।",
      },
    ],
  },
  takeawaysEn: [
    "Always use lowercase primitive types (string, number, boolean).",
    "number includes integers, decimals, NaN, and ±Infinity.",
    "null represents intentional absence; undefined represents uninitialized bindings.",
  ],
  takeawaysBn: [
    "সর্বদা লোয়ারকেস প্রিমিটিভ টাইপ ব্যবহার করুন।",
    "number এর ভেতর দশমিক, পূর্ণসংখ্যা, NaN ও Infinity সবই থাকে।",
    "null হলো ইচ্ছাকৃত অনুপস্থিতি; undefined হলো অপ্রস্তুত অবস্থা।",
  ],
});

export const REFERENCE_LESSON_ANY_VS_UNKNOWN: Lesson = createRichReferenceLesson({
  id: "ts.02.any-vs-unknown",
  slug: "any-vs-unknown",
  moduleId: "ts.mod-02.ts-fundamentals",
  moduleTitleEn: "Module 2: TypeScript Fundamentals: First Steps",
  moduleTitleBn: "মডিউল ২: টাইপস্ক্রিপ্ট ফান্ডামেন্টালস: প্রথম পদক্ষেপ",
  titleEn: "2.5 any vs unknown: Safe Unchecked Boundaries",
  titleBn: "২.৫ any বনাম unknown: নিরাপদ আনচেকড বাউন্ডারি",
  subtitleEn: "Turning off the type checker vs forcing defensive runtime validation.",
  subtitleBn: "টাইপ চেকার বন্ধ করে দেওয়া বনাম রানটাইম ভ্যালিডেশন বাধ্যতামূলক করা।",
  descriptionEn:
    "Master the architectural difference between 'any' and 'unknown'. Both accept any value in the universe (top types). However, 'any' disables all type checking on the variable, while 'unknown' forbids all operations until narrowed through evidence.",
  descriptionBn:
    "'any' এবং 'unknown'-এর মধ্যে আকাশ-পাতাল তফাৎ। উভয়ই যেকোনো মান গ্রহণ করে, কিন্তু any সব টাইপ চেকিং বন্ধ করে দেয়, আর unknown শর্ত দিয়ে প্রমাণ না করা পর্যন্ত কোনো ব্যবহার করতে দেয় না।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Explain why 'any' acts as a contagious safety hole across a codebase.",
    "Use 'unknown' at network and storage boundaries to enforce type safety.",
    "Narrow 'unknown' into specific domain shapes using typeof, instanceof, and type guards.",
  ],
  learningObjectivesBn: [
    "any কীভাবে পুরো কোডবেসে সংক্রামক হয়ে সুরক্ষা ধ্বংস করে তা বোঝা।",
    "নেটওয়ার্ক সীমানায় unknown দিয়ে শতভাগ নিরাপত্তা নিশ্চিত করা।",
    "টাইপ গার্ড দিয়ে unknown-কে নির্দিষ্ট টাইপে ন্যারো করা।",
  ],
  concept: {
    id: "concept.unknown-type",
    nameEn: "The Unknown Safe Top Type",
    nameBn: "Unknown টাইপ: নিরাপদ টপ টাইপ",
    descriptionEn: "Top type demanding proof before property access.",
    descriptionBn: "ব্যবহারের পূর্বে শর্ত যাচাই দাবি করা নিরাপদ টপ টাইপ।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  codeSnippet: `// 1. DANGEROUS: any disables all safety
function processUnsafe(payload: any) {
  payload.nonExistentMethod(); // No compile error! Crashes at runtime.
}

// 2. SAFE: unknown requires proof before access
function processSafe(payload: unknown) {
  // payload.nonExistentMethod(); // TS Error: 'payload' is of type 'unknown'.

  if (typeof payload === "object" && payload !== null && "id" in payload) {
    console.log("Safe ID:", (payload as { id: unknown }).id);
  }
}`,
  mistakeEn: {
    wrong: "Using 'any' because you don't yet know the exact shape of an external API payload.",
    correct: "Always use 'unknown' for unpredictable external payloads.",
    explanation: "Using 'any' spreads viral unsafety to every downstream function that interacts with that value.",
  },
  mistakeBn: {
    wrong: "API থেকে কী আসবে না জানলে 'any' লিখে রাখা।",
    correct: "অনিশ্চিত ডেটার ক্ষেত্রে সর্বদা 'unknown' ব্যবহার করুন।",
    explanation: "'any' ব্যবহার করলে পরবর্তীতে ওই ডেটা যেখানেই পাঠানো হবে, সব জায়গার টাইপ সুরক্ষা নষ্ট হয়ে যাবে।",
  },
  engineeringNoteEn: {
    title: "Eradicating 'any' via ESLint",
    content: "Production TypeScript engineering teams enforce @typescript-eslint/no-explicit-any as an error in CI to prevent accidental safety compromises.",
    rec: "If you genuinely don't know the type, use unknown and narrow it.",
  },
  engineeringNoteBn: {
    title: "সিআই পাইপলাইনে any নিষিদ্ধ করা",
    content: "বড় বড় ইঞ্জিনিয়ারিং দল ESLint রুল দিয়ে কোডবেসে any লেখা সম্পূর্ণ নিষিদ্ধ রাখে।",
    rec: "টাইপ অজানা থাকলে unknown ব্যবহার করে শর্ত সাপেক্ষে যাচাই করুন।",
  },
  practice: {
    questionEn: "What is the primary difference between 'any' and 'unknown'?",
    questionBn: "'any' এবং 'unknown'-এর মধ্যে প্রধান পার্থক্য কী?",
    options: [
      {
        id: "au-1",
        textEn: "any allows property access and method calls without checks; unknown requires narrowing first.",
        textBn: "any কোনো শর্ত ছাড়াই মেথড কলের অনুমতি দেয়; unknown ব্যবহারের আগে শর্ত যাচাই বাধ্যতামূলক করে।",
        isCorrect: true,
        explanationEn: "Correct! unknown is the type-safe top type; any completely disables the compiler.",
        explanationBn: "সঠিক! unknown হলো নিরাপদ টপ টাইপ, যা যাচাই ছাড়া ব্যবহার করা যায় না।",
      },
      {
        id: "au-2",
        textEn: "any is for primitives and unknown is for objects.",
        textBn: "any প্রিমিটিভের জন্য আর unknown অবজেক্টের জন্য।",
        isCorrect: false,
        explanationEn: "Both can hold primitives and objects alike.",
        explanationBn: "উভয় টাইপেই প্রিমিটিভ ও অবজেক্ট রাখা যায়।",
      },
    ],
  },
  takeawaysEn: [
    "any turns off the compiler; unknown demands runtime verification.",
    "Never type external inputs as any; type them as unknown.",
    "Narrow unknown using typeof, in, instanceof, or Zod schemas.",
  ],
  takeawaysBn: [
    "any কম্পাইলারকে অন্ধ করে দেয়; unknown রানটাইম প্রমাণের দাবি করে।",
    "বাইরের ডেটাকে কখনোই any লিখবেন না; unknown লিখুন।",
    "typeof বা Zod দিয়ে unknown-কে নিরাপদ টাইপে রূপান্তর করুন।",
  ],
});

export const REFERENCE_LESSON_WHAT_IS_A_TYPE: Lesson = createRichReferenceLesson({
  id: "ts.03.what-is-a-type",
  slug: "what-is-a-type",
  moduleId: "ts.mod-03.type-system",
  moduleTitleEn: "Module 3: The Type System: Modeling Data",
  moduleTitleBn: "মডিউল ৩: টাইপ সিস্টেম: ডেটা মডেলিং",
  titleEn: "3.1 What Is a Type? The Set-Theoretic View",
  titleBn: "৩.১ টাইপ আসলে কী? সেট-থিওরির দৃষ্টিভঙ্গি",
  subtitleEn: "Types as sets of possible values; assignability as subset inclusion.",
  subtitleBn: "সম্ভাব্য মানের সেট হিসেবে টাইপ; উপসেট অন্তর্ভুক্তির মাধ্যমে অ্যাসাইনাবিলিটি।",
  descriptionEn:
    "The fundamental mental model of TypeScript: a type is nothing more than a set of valid values. 'never' is the empty set. 'unknown' is the universe of all values. A type B is assignable to A if and only if B is a subset of A (B ⊆ A).",
  descriptionBn:
    "টাইপস্ক্রিপ্টের মূল মানসিক মডেল: একটি টাইপ হলো সম্ভাব্য মানের একটি গাণিতিক সেট। 'never' হলো ফাঁকা সেট (empty set), 'unknown' হলো সকল মানের সেট। B যদি A এর উপসেট হয়, কেবল তখনই B-কে A-তে অ্যাসাইন করা যায়।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Model types as mathematical sets of valid runtime values.",
    "Define subtyping and assignability using subset inclusion (Sub ⊆ Super).",
    "Explain why 'never' is assignable to everything and nothing is assignable to 'never'.",
  ],
  learningObjectivesBn: [
    "টাইপকে গাণিতিক সেট হিসেবে চিন্তা করা।",
    "উপসেট অন্তর্ভুক্তির সাহায্যে সাবটাইপিং ও অ্যাসাইনাবিলিটি ব্যাখ্যা করা।",
    "never কেন সব টাইপে অ্যাসাইন করা যায় তা বোঝা।",
  ],
  concept: {
    id: "concept.type-set-theory",
    nameEn: "Types as Mathematical Sets",
    nameBn: "সেট থিওরি হিসেবে টাইপ",
    descriptionEn: "Assignability as subset membership.",
    descriptionBn: "সেট থিওরির উপসেট হিসেবে টাইপ সামঞ্জস্য নির্ধারণ।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.set-theory.types",
  codeSnippet: `// 1. Literal type: set of 1 value {'active'}
type ActiveStatus = 'active';

// 2. Union type: set of 2 values {'active', 'inactive'}
type Status = ActiveStatus | 'inactive';

// ActiveStatus is a subset of Status:
const a: ActiveStatus = 'active';
const s: Status = a; // VALID: {'active'} ⊆ {'active', 'inactive'}

// 3. String type: infinite set of all possible string values
// Status ⊆ string:
const str: string = s; // VALID`,
  mistakeEn: {
    wrong: "Thinking of types as static OOP classes or nominal tags.",
    correct: "Think of types as sets of acceptable runtime values.",
    explanation: "In TypeScript, assignability is purely about whether the source value set is contained within the destination value set.",
  },
  mistakeBn: {
    wrong: "টাইপকে শুধু ক্লাস বা নির্দিষ্ট লেবেল ভাবা।",
    correct: "টাইপকে সম্ভাব্য মানের গাণিতিক সেট ভাবুন।",
    explanation: "টাইপস্ক্রিপ্টে অ্যাসাইনাবিলিটি কেবল একটি সেটের মান অন্য সেটে উপস্থিত আছে কিনা তার ওপর নির্ভর করে।",
  },
  engineeringNoteEn: {
    title: "Subset Inclusion Drives All Compiler Errors",
    content: "When TypeScript shows 'Type A is not assignable to type B', it literally means: Set A contains values that are not members of Set B.",
    rec: "Whenever an assignability error occurs, ask yourself: 'Which value exists in the source set that is missing from the destination set?'",
  },
  engineeringNoteBn: {
    title: "সেটের অমিলই সমস্ত কম্পাইলার এররের মূল",
    content: "'Type A is not assignable to Type B' মানে হলো সেট A-তে এমন কিছু মান আছে যা সেট B-তে অনুমোদিত নয়।",
    rec: "এরর দেখা দিলে ভাবুন: সোর্সের কোন মানটি ডেস্টিনেশনে গ্রহণযোগ্য নয়?",
  },
  practice: {
    questionEn: "If Type A is assignable to Type B, what is the mathematical relationship between their value sets?",
    questionBn: "যদি Type A-কে Type B-তে অ্যাসাইন করা যায়, তবে তাদের সেটের মধ্যকার সম্পর্ক কী?",
    options: [
      {
        id: "set-1",
        textEn: "Set A is a subset of Set B (A ⊆ B).",
        textBn: "সেট A হলো সেট B-এর একটি উপসেট (A ⊆ B)।",
        isCorrect: true,
        explanationEn: "Correct! Every value in Set A is guaranteed to be a valid member of Set B.",
        explanationBn: "সঠিক! A-এর প্রতিটি মান B-এর ভেতরে অন্তর্ভুক্ত থাকে।",
      },
      {
        id: "set-2",
        textEn: "Set B is a subset of Set A (B ⊆ A).",
        textBn: "সেট B হলো সেট A-এর একটি উপসেট।",
        isCorrect: false,
        explanationEn: "No, that would mean B is narrower than A.",
        explanationBn: "না, তাহলে B আরও সংকীর্ণ হয়ে যেত।",
      },
    ],
  },
  takeawaysEn: [
    "A type is a mathematical set of valid runtime values.",
    "Assignability is subset inclusion (Source ⊆ Target).",
    "never is the empty set (∅); unknown is the universal set (𝕌).",
  ],
  takeawaysBn: [
    "টাইপ হলো সম্ভাব্য মানের একটি গাণিতিক সেট।",
    "অ্যাসাইনাবিলিটি মানে হলো উপসেট হওয়া (Source ⊆ Target)।",
    "never হলো ফাঁকা সেট (∅); unknown হলো সব মানের সার্বিক সেট (𝕌)।",
  ],
});

export const REFERENCE_LESSON_UNION_TYPES: Lesson = createRichReferenceLesson({
  id: "ts.03.union-types",
  slug: "union-types",
  moduleId: "ts.mod-03.type-system",
  moduleTitleEn: "Module 3: The Type System: Modeling Data",
  moduleTitleBn: "মডিউল ৩: টাইপ সিস্টেম: ডেটা মডেলিং",
  titleEn: "3.2 Union Types (A | B): Disjunction & Uncertainty",
  titleBn: "৩.২ ইউনিয়ন টাইপস (A | B): ডিসজাংশন এবং অনিশ্চয়তা",
  subtitleEn: "Expressing values that can be one of multiple distinct types.",
  subtitleBn: "একাধিক সম্ভাব্য টাইপের যেকোনো একটি হতে পারা মান প্রকাশ করা।",
  descriptionEn:
    "Model real-world uncertainty with unions (A | B). A value of type A | B belongs to the mathematical union of both sets. The compiler only permits operations that are valid for EVERY constituent in the union until you narrow it.",
  descriptionBn:
    "ইউনিয়ন (A | B) দিয়ে সম্ভাব্য একাধিক বিকল্প প্রকাশ করুন। কম্পাইলার কেবল সেই মেথডগুলো সরাসরি কল করতে দেয় যা ইউনিয়নের প্রতিটি উপাদানের ভেতরেই বিদ্যমান।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Construct union types combining primitives, literals, and objects.",
    "Understand why you can only access common shared properties on an un-narrowed union.",
    "Prepare union types for Control Flow Analysis narrowing.",
  ],
  learningObjectivesBn: [
    "প্রিমিটিভ ও অবজেক্ট দিয়ে ইউনিয়ন টাইপ তৈরি করা।",
    "ন্যারো করার আগে কেন কেবল কমন প্রোপার্টি অ্যাক্সেস করা যায় তা বোঝা।",
    "কন্ট্রোল ফ্লো অ্যানালাইসিসের জন্য ইউনিয়ন টাইপ প্রস্তুত করা।",
  ],
  concept: {
    id: "concept.union-types",
    nameEn: "Union Types & Disjunction",
    nameBn: "ইউনিয়ন টাইপস এবং সমন্বয়",
    descriptionEn: "Modeling values that can be one of multiple distinct types.",
    descriptionBn: "একাধিক টাইপের যেকোনো একটি হতে পারা ডেটা মডেলিং।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.unions.disjunction",
  codeSnippet: `type ID = string | number;

function printId(id: ID) {
  // Directly accessible: methods common to both string AND number
  console.log(id.toString()); // VALID: both have toString()

  // id.toUpperCase(); // TS Error: Property 'toUpperCase' does not exist on type 'number'.
  
  // Must narrow before accessing specific branch methods:
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // VALID
  }
}`,
  mistakeEn: {
    wrong: "Expecting a union of objects (TypeA | TypeB) to expose the union of all their properties.",
    correct: "An un-narrowed union only exposes the INTERSECTION of their properties (shared keys).",
    explanation: "The compiler must guarantee that property access will never crash regardless of which variant is passed.",
  },
  mistakeBn: {
    wrong: "TypeA | TypeB অবজেক্টে সবার সব প্রোপার্টি সরাসরি পাওয়ার আশা করা।",
    correct: "ন্যারো করার পূর্বে ইউনিয়নে কেবল তাদের সাধারণ (কমন) প্রোপার্টিগুলো ব্যবহার করা যায়।",
    explanation: "রানটাইমে যেন আনডিফাইন্ড প্রোপার্টি এক্সেস না হয়, তাই কম্পাইলার শুধু নিশ্চিত কমন কী-গুলোর অনুমতি দেয়।",
  },
  engineeringNoteEn: {
    title: "Unions vs Optional Properties",
    content: "Avoid representing multiple states with a single object full of optional fields { isError?: boolean, data?: string, error?: string }. Use a union of exact shapes instead.",
    rec: "Model state as: { status: 'success', data: string } | { status: 'error', error: string }.",
  },
  engineeringNoteBn: {
    title: "ইউনিয়ন বনাম অপশনাল প্রোপার্টির বিশৃঙ্খলা",
    content: "একটি অবজেক্টে অনেকগুলো অপশনাল কী রাখার বদলে আলাদা আলাদা স্পষ্ট অবজেক্টের ইউনিয়ন তৈরি করুন।",
    rec: "{ status: 'success', data } | { status: 'error', error } প্যাটার্ন ব্যবহার করুন।",
  },
  practice: {
    questionEn: "Why does TypeScript forbid calling 'toUpperCase()' directly on 'string | number' without an if-check?",
    questionBn: "'string | number' টাইপে if-চেক ছাড়া কেন সরাসরি 'toUpperCase()' কল করা যায় না?",
    options: [
      {
        id: "un-1",
        textEn: "Because if the runtime value happens to be a number, calling toUpperCase() would throw a runtime TypeError.",
        textBn: "কারণ রানটাইমে মানটি যদি number হয়, তবে toUpperCase() কল করলে কোড ক্র্যাশ করবে।",
        isCorrect: true,
        explanationEn: "Correct! TypeScript enforces safety by restricting access to operations safe for all union members.",
        explanationBn: "সঠিক! কম্পাইলার নিশ্চিত করে যেন কোনো অবস্থাতেই রানটাইম TypeError না ঘটে।",
      },
      {
        id: "un-2",
        textEn: "Because toUpperCase is deprecated in ECMAScript 2022.",
        textBn: "কারণ toUpperCase মেথডটি অপসারিত হয়েছে।",
        isCorrect: false,
        explanationEn: "toUpperCase is a standard JavaScript string method.",
        explanationBn: "toUpperCase হলো আদর্শ স্ট্রিং মেথড।",
      },
    ],
  },
  takeawaysEn: [
    "Union types represent values belonging to multiple candidate sets.",
    "Un-narrowed unions only expose properties shared across all constituents.",
    "Always narrow unions using control flow evidence before accessing branch-specific members.",
  ],
  takeawaysBn: [
    "ইউনিয়ন টাইপ সম্ভাব্য একাধিক সেটের যেকোনো একটি মান বোঝায়।",
    "ন্যারো করার আগে কেবল শেয়ার্ড প্রোপার্টিগুলোই ব্যবহারযোগ্য থাকে।",
    "সুনির্দিষ্ট মেথড ব্যবহারের পূর্বে শর্ত দিয়ে টাইপ ন্যারো করুন।",
  ],
});

export const REFERENCE_LESSON_STRUCTURAL_TYPING: Lesson = createRichReferenceLesson({
  id: "ts.03.structural-typing",
  slug: "structural-typing",
  moduleId: "ts.mod-03.type-system",
  moduleTitleEn: "Module 3: The Type System: Modeling Data",
  moduleTitleBn: "মডিউল ৩: টাইপ সিস্টেম: ডেটা মডেলিং",
  titleEn: "3.6 Structural Typing: Shape Over Name",
  titleBn: "৩.৬ স্ট্রাকচারাল টাইপিং: নামের চেয়ে কাঠামো গুরুত্বপূর্ণ",
  subtitleEn: "Duck typing formalized: if it walks like a duck, TypeScript considers it a duck.",
  subtitleBn: "ডাক টাইপিংয়ের আনুষ্ঠানিক রূপ: কাঠামোর মিল থাকলে টাইপস্ক্রিপ্ট তাকে একই টাইপ গণ্য করে।",
  descriptionEn:
    "Unlike Java or C# where type compatibility requires explicit class inheritance (nominal typing), TypeScript is structural. If an object has all the properties required by an interface with compatible types, it satisfies that interface regardless of how or where it was created.",
  descriptionBn:
    "জাভা বা C#-এর মতো নাম দিয়ে নয়, টাইপস্ক্রিপ্ট অবজেক্টের অভ্যন্তরীণ কাঠামোগত বৈশিষ্ট্যের মিল দেখে টাইপের উপযুক্ততা নির্ধারণ করে। ইন্টারফেসে যা চাওয়া হয়েছে তা উপস্থিত থাকলেই অবজেক্টটি গ্রহণযোগ্য হয়।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Contrast structural typing with nominal OOP type systems.",
    "Explain excess property checks on fresh object literals vs variables.",
    "Design decoupled interfaces that accept arbitrary objects matching shape requirements.",
  ],
  learningObjectivesBn: [
    "নমিনাল টাইপিং বনাম স্ট্রাকচারাল টাইপিংয়ের পার্থক্য ব্যাখ্যা করা।",
    "অবজেক্ট লিটারেল ফ্রেশনেস ও এক্সেস প্রোপার্টি চেকের নিয়ম জানা।",
    "কাঠামো-ভিত্তিক ডিকাপলড ইন্টারফেস তৈরি করা।",
  ],
  concept: {
    id: "concept.structural-typing",
    nameEn: "Structural Typing & Compatibility",
    nameBn: "স্ট্রাকচারাল টাইপিং এবং কম্প্যাটিবিলিটি",
    descriptionEn: "Compatibility determined by member shape rather than declaration name.",
    descriptionBn: "নাম নয়, কাঠামোর ওপর ভিত্তি করে টাইপের সামঞ্জস্য নির্ধারণ।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.references.object",
  codeSnippet: `interface Point2D {
  x: number;
  y: number;
}

function calculateDistance(p: Point2D): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// 1. Nominal classes are NOT required:
const rawObject = { x: 3, y: 4, z: 10, label: "target" };
// Passing rawObject is 100% VALID because it has x: number and y: number:
calculateDistance(rawObject);

// 2. Excess property check on direct object literal:
// calculateDistance({ x: 3, y: 4, z: 10 }); 
// TS Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point2D'`,
  mistakeEn: {
    wrong: "Assuming two interfaces with different names cannot be assigned to each other.",
    correct: "Interface names are ignored during assignability checks; only member shapes are compared.",
    explanation: "If interface User and interface Customer have identical fields, they are completely interchangeable.",
  },
  mistakeBn: {
    wrong: "ভিন্ন নামের দুটি ইন্টারফেস একে অপরের সাথে কাজ করতে পারবে না ভাবা।",
    correct: "টাইপ চেকার ইন্টারফেসের নাম দেখে না, কেবল ভেতরের প্রোপার্টিগুলো তুলনা করে।",
    explanation: "User এবং Customer ইন্টারফেসের ফিল্ডগুলো একই হলে তারা সম্পূর্ণরূপে সমতুল্য।",
  },
  engineeringNoteEn: {
    title: "Excess Property Check Caveat",
    content: "Why does { x: 3, y: 4, z: 10 } fail directly, but passing 'rawObject' succeed? Fresh object literals trigger excess property checks to catch typos in object literals.",
    rec: "Assign to an intermediate variable if you intentionally need to pass superset objects.",
  },
  engineeringNoteBn: {
    title: "এক্সেস প্রোপার্টি চেকের উদ্দেশ্য",
    content: "সরাসরি অবজেক্ট লিটারেল দিলে কেন অতিরিক্ত প্রোপার্টি নিষিদ্ধ হয়? টাইপো ধরার জন্যই কম্পাইলার ফ্রেশ লিটারেলে বাড়তি কড়াকড়ি করে।",
    rec: "ইচ্ছাকৃতভাবে অতিরিক্ত প্রোপার্টি পাঠাতে চাইলে আগে ভ্যারিয়েবলে স্টোর করুন।",
  },
  practice: {
    questionEn: "Why does TypeScript allow an object with extra properties to be passed to a function via a variable?",
    questionBn: "ভ্যারিয়েবলে অ্যাসাইন করে অতিরিক্ত প্রোপার্টি সহ অবজেক্ট পাস করলে টাইপস্ক্রিপ্ট কেন অনুমতি দেয়?",
    options: [
      {
        id: "str-1",
        textEn: "Because the object structurally satisfies all required fields of the contract (width subtyping).",
        textBn: "কারণ অবজেক্টটিতে ইন্টারফেসে চাওয়া সমস্ত প্রোপার্টি সফলভাবে বিদ্যমান (উইডথ সাবটাইপিং)।",
        isCorrect: true,
        explanationEn: "Correct! In structural typing, having MORE properties than required is valid subtyping.",
        explanationBn: "সঠিক! স্ট্রাকচারাল টাইপিংয়ে প্রয়োজনের চেয়ে বেশি প্রোপার্টি থাকা সম্পূর্ণ বৈধ।",
      },
      {
        id: "str-2",
        textEn: "Because TypeScript converts the object to any behind the scenes.",
        textBn: "কারণ টাইপস্ক্রিপ্ট গোপনে অবজেক্টটিকে any বানিয়ে ফেলে।",
        isCorrect: false,
        explanationEn: "TypeScript never silently casts variables to any.",
        explanationBn: "টাইপস্ক্রিপ্ট কখনো গোপনে any কাস্ট করে না।",
      },
    ],
  },
  takeawaysEn: [
    "TypeScript uses structural subtyping: compatibility is determined by shape, not declaration name.",
    "Width subtyping allows objects with superset properties to satisfy narrower contracts.",
    "Fresh object literals trigger excess property checks to catch developer typos.",
  ],
  takeawaysBn: [
    "টাইপস্ক্রিপ্ট কাঠামোগত সাবটাইপিং অনুসরণ করে: নাম নয়, গঠনই আসল।",
    "প্রয়োজনের চেয়ে বেশি প্রোপার্টি থাকা অবজেক্ট বৈধ সাবটাইপ হিসেবে গণ্য হয়।",
    "টাইপো ধরার জন্য সরাসরি অবজেক্ট লিটারেলে এক্সেস প্রোপার্টি চেক করা হয়।",
  ],
});

export const REFERENCE_LESSON_DISCRIMINATED_UNIONS: Lesson = createRichReferenceLesson({
  id: "ts.04.discriminated-unions",
  slug: "discriminated-unions",
  moduleId: "ts.mod-04.control-flow",
  moduleTitleEn: "Module 4: Control Flow & Narrowing: Precision Types",
  moduleTitleBn: "মডিউল ৪: কন্ট্রোল ফ্লো এবং ন্যারোয়িং: নির্ভুল টাইপস",
  titleEn: "4.5 Discriminated Unions: Tagged Objects",
  titleBn: "৪.৫ ডিসক্রিমিনেটেড ইউনিয়ন: ট্যাগড অবজেক্টস",
  subtitleEn: "The single most powerful data modeling pattern in TypeScript.",
  subtitleBn: "টাইপস্ক্রিপ্টের সবচেয়ে শক্তিশালী ডেটা মডেলিং প্যাটার্ন।",
  descriptionEn:
    "A discriminated union (or tagged union) is a set of object types sharing a common literal discriminant property (like 'kind', 'type', or 'status'). By checking this single property in an if or switch statement, TypeScript instantly narrows the entire object to its exact constituent.",
  descriptionBn:
    "ডিসক্রিমিনেটেড ইউনিয়ন হলো একই লিটারেল ট্যাগ (যেমন 'type', 'status') শেয়ার করা অবজেক্টের ইউনিয়ন। এই একটি ট্যাগ প্রোপার্টি চেক করার সাথে সাথে টাইপ চেকার পুরো অবজেক্টটির সঠিক কাঠামো নির্ণয় করে ফেলে।",
  difficulty: "intermediate",
  estimatedMinutes: 25,
  learningObjectivesEn: [
    "Design robust state models using discriminated unions with shared literal tags.",
    "Combine switch statements with Control Flow Analysis to eliminate null checking bugs.",
    "Enforce complete exhaustiveness checking with 'never' fallback assertions.",
  ],
  learningObjectivesBn: [
    "শেয়ার্ড লিটারেল ট্যাগ দিয়ে শক্তিশালী স্টেট মডেল ডিজাইন করা।",
    "switch স্টেটমেন্ট ও CFA দিয়ে নিখুঁত টাইপ ন্যারোয়িং নিশ্চিত করা।",
    "never ফলব্যাক দিয়ে ১০০% এক্সহস্টিভ চেকিং বজায় রাখা।",
  ],
  concept: {
    id: "concept.discriminated-unions",
    nameEn: "Discriminated Unions (Tagged Unions)",
    nameBn: "ডিসক্রিমিনেটেড ইউনিয়ন (ট্যাগড ইউনিয়ন)",
    descriptionEn: "Unions sharing a discriminant property for instant safe branching.",
    descriptionBn: "একই লিটারেল প্রোপার্টি শেয়ার করা অবজেক্টের ইউনিয়ন।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.type-narrowing",
  codeSnippet: `// 1. Discriminated union of network states:
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderUI<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle":
      return "Waiting to fetch...";
    case "loading":
      return "Loading spinner...";
    case "success":
      return \`Data loaded: \${JSON.stringify(state.data)}\`; // state.data is safely accessible!
    case "error":
      return \`Error: \${state.error.message}\`; // state.error is safely accessible!
  }
}`,
  mistakeEn: {
    wrong: "Using optional properties { isLoading?: boolean, data?: T, error?: Error } for async state.",
    correct: "Model mutually exclusive states using a discriminated union.",
    explanation: "Optional properties allow illegal states like { isLoading: true, error: new Error(), data: 'foo' } to exist at compile time.",
  },
  mistakeBn: {
    wrong: "স্টেট বোঝাতে সব প্রোপার্টি অপশনাল { isLoading?, data?, error? } রাখা।",
    correct: "পরস্পরবিরোধী স্টেটগুলোর জন্য ডিসক্রিমিনেটেড ইউনিয়ন ব্যবহার করুন।",
    explanation: "অপশনাল প্রোপার্টি রাখলে একসাথে loading ও error উভয়ই true হওয়ার মতো অসম্ভব অবস্থা তৈরি হতে পারে।",
  },
  engineeringNoteEn: {
    title: "Make Illegal States Unrepresentable",
    content: "The golden rule of domain modeling: if an application state should never physically exist at runtime, make it impossible to write in TypeScript.",
    rec: "Discriminated unions ensure that data is only accessible when the status tag proves its existence.",
  },
  engineeringNoteBn: {
    title: "অবৈধ অবস্থাকে কোডেই অসম্ভব করে তোলা",
    content: "ডোমেইন মডেলিংয়ের স্বর্ণসূত্র: রানটাইমে যা হওয়া অসম্ভব, কোডেও যেন তা লেখা অসম্ভব হয়।",
    rec: "ডিসক্রিমিনেটেড ইউনিয়ন নিশ্চিত করে যে স্ট্যাটাস সফল হলেই কেবল ডেটা এক্সেস করা যাবে।",
  },
  practice: {
    questionEn: "Why is a discriminated union superior to a single object with optional flags for async states?",
    questionBn: "অপশনাল ফ্ল্যাগযুক্ত অবজেক্টের চেয়ে ডিসক্রিমিনেটেড ইউনিয়ন কেন বেশি শ্রেষ্ঠ?",
    options: [
      {
        id: "du-1",
        textEn: "It makes invalid states (e.g. loading: true with error: Error) completely unrepresentable at compile time.",
        textBn: "এটি অবৈধ অবস্থাকে (যেমন একইসাথে loading ও error থাকা) কম্পাইল টাইমেই অসম্ভব করে তোলে।",
        isCorrect: true,
        explanationEn: "Correct! Discriminated unions enforce that success data only exists when the tag is 'success'.",
        explanationBn: "সঠিক! কেবল 'success' হলেই ডেটা থাকে, ফলে কোনো বিভ্রান্তিকর অবস্থা তৈরি হতে পারে না।",
      },
      {
        id: "du-2",
        textEn: "Because discriminated unions compile into C++ structs for faster execution.",
        textBn: "কারণ ডিসক্রিমিনেটেড ইউনিয়ন C++ স্ট্রাক্টে কম্পাইল হয়।",
        isCorrect: false,
        explanationEn: "TypeScript emits standard JavaScript objects without changing execution engines.",
        explanationBn: "টাইপস্ক্রিপ্ট সাধারণ জাভাস্ক্রিপ্ট অবজেক্ট হিসেবেই আউটপুট দেয়।",
      },
    ],
  },
  takeawaysEn: [
    "Discriminated unions use a literal tag property to differentiate object variants.",
    "They make illegal and conflicting domain states impossible to represent.",
    "Combined with switch statements, they offer instant type narrowing with zero casts.",
  ],
  takeawaysBn: [
    "ডিসক্রিমিনেটেড ইউনিয়ন লিটারেল ট্যাগ দিয়ে অবজেক্টের ভিন্ন ভিন্ন রূপ নিশ্চিত করে।",
    "এটি পরস্পরবিরোধী অবৈধ স্টেট কোডেই অসম্ভব করে তোলে।",
    "switch স্টেটমেন্টের সাথে কোনো কাস্টিং ছাড়াই শতভাগ নির্ভুল টাইপ ন্যারোয়িং দেয়।",
  ],
});

export const REFERENCE_LESSON_GENERICS_WHY: Lesson = createRichReferenceLesson({
  id: "ts.06.why-generics-exist",
  slug: "why-generics-exist",
  moduleId: "ts.mod-06.generics",
  moduleTitleEn: "Module 6: Generics: Parameterized Logic",
  moduleTitleBn: "মডিউল ৬: জেনেরিক্স: প্যারামিটারাইজড লজিক",
  titleEn: "6.1 Why Generics Exist: Parameterized Logic",
  titleBn: "৬.১ জেনেরিক্স কেন প্রয়োজন: প্যারামিটারাইজড লজিক",
  subtitleEn: "Functions accept value arguments; generics accept type arguments.",
  subtitleBn: "ফাংশন যেমন মানের আর্গুমেন্ট নেয়, জেনেরিক্স তেমনি টাইপের আর্গুমেন্ট গ্রহণ করে।",
  descriptionEn:
    "Generics allow you to write reusable components that preserve type relationships across inputs and outputs. Without generics, functions must choose between losing all type safety with 'any' or duplicating the same code for every possible type.",
  descriptionBn:
    "জেনেরিক্স আপনাকে ইনপুট ও আউটপুটের মধ্যে টাইপ সম্পর্ক অক্ষুণ্ণ রেখে রিইউজেবল কোড লেখার ক্ষমতা দেয়। জেনেরিক্স না থাকলে কোড ডুপ্লিকেট করতে হতো অথবা any দিয়ে সব টাইপ সেফটি নষ্ট করতে হতো।",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Explain the core problem solved by type parameterization.",
    "Differentiate generic type arguments (<T>) from regular function arguments.",
    "Contrast generics against the 'any' anti-pattern.",
  ],
  learningObjectivesBn: [
    "টাইপ প্যারামিটারাইজেশনের মূল উদ্দেশ্য ব্যাখ্যা করা।",
    "জেনেরিক টাইপ আর্গুমেন্ট (<T>) এবং সাধারণ আর্গুমেন্টের পার্থক্য বোঝা।",
    "any এর ক্ষতির বিপরীতে জেনেরিক্সের ভূমিকা উপলব্ধি করা।",
  ],
  concept: {
    id: "concept.generics",
    nameEn: "Generics & Reusable Type Abstractions",
    nameBn: "জেনেরিক্স এবং রিইউজেবল টাইপ অ্যাবস্ট্রাকশন",
    descriptionEn: "Parameterizing types to preserve relationships.",
    descriptionBn: "ইনপুট ও আউটপুটের মধ্যে সম্পর্ক অক্ষুণ্ণ রেখে কোড রিইউজ করার কৌশল।",
    trackId: "typescript",
    difficulty: "intermediate",
  },
  visualizationId: "typescript.generics.basic",
  codeSnippet: `// WITHOUT GENERICS (Lost fidelity with 'any'):
function firstAny(items: any[]): any {
  return items[0];
}
const itemA = firstAny(["hello", "world"]); // itemA is 'any' - unsafe!

// WITH GENERICS (Fidelity preserved with <T>):
function firstSafe<T>(items: T[]): T | undefined {
  return items[0];
}
const itemB = firstSafe(["hello", "world"]); // itemB is accurately inferred as string | undefined!
const itemC = firstSafe([1, 2, 3]);           // itemC is accurately inferred as number | undefined!`,
  mistakeEn: {
    wrong: "Adding unnecessary generic parameters to functions that don't relate multiple types or return values.",
    correct: "Only introduce a generic <T> if T appears at least twice in the signature to link relationships.",
    explanation: "function logValue<T>(x: T): void is an anti-pattern; function logValue(x: unknown): void is simpler and cleaner.",
  },
  mistakeBn: {
    wrong: "অপ্রয়োজনীয় জায়গায় জেনেরিক প্যারামিটার যোগ করা যেখানে কোনো সম্পর্ক ধরে রাখার নেই।",
    correct: "সিগনেচারে T কমপক্ষে দুই জায়গায় ব্যবহৃত হয়ে সম্পর্ক তৈরি করলেই কেবল জেনেরিক ব্যবহার করুন।",
    explanation: "logValue<T>(x: T): void লেখার কোনো প্রয়োজন নেই; logValue(x: unknown) লেখা অনেক পরিষ্কার।",
  },
  engineeringNoteEn: {
    title: "Type Inference Power",
    content: "Notice that callers of firstSafe(['a', 'b']) do NOT need to write firstSafe<string>(['a', 'b']). TypeScript infers T automatically from the provided argument.",
    rec: "Rely on type inference whenever possible rather than cluttering call sites with manual type arguments.",
  },
  engineeringNoteBn: {
    title: "ইনফারেন্সের ক্ষমতা",
    content: "firstSafe(['a', 'b']) কল করার সময় <string> ম্যানুয়ালি লিখতে হয় না; কম্পাইলার স্বয়ংক্রিয়ভাবে T অনুমান করে।",
    rec: "কল সাইটে অপ্রয়োজনীয় টাইপ না লিখে কম্পাইলারের অনুমানের ওপর নির্ভর করুন।",
  },
  practice: {
    questionEn: "Why is 'function wrap<T>(value: T): Box<T>' superior to 'function wrap(value: any): Box<any>'?",
    questionBn: "'wrap(value: any): Box<any>'-এর চেয়ে 'wrap<T>(value: T): Box<T>' কেন বেশি উন্নত?",
    options: [
      {
        id: "gen-1",
        textEn: "Because the generic version preserves the exact type of the input value in the returned Box.",
        textBn: "কারণ জেনেরিক সংস্করণ ইনপুটের সঠিক টাইপটি রিটার্ন করা বক্সে অক্ষুণ্ণ রাখে।",
        isCorrect: true,
        explanationEn: "Correct! If you pass a User into wrap(), you get back Box<User> instead of an unsafe Box<any>.",
        explanationBn: "সঠিক! User পাস করলে Box<User> পাওয়া যায়, ফলে কোনো টাইপ তথ্য নষ্ট হয় না।",
      },
      {
        id: "gen-2",
        textEn: "Because generics make the compiled JavaScript run twice as fast.",
        textBn: "কারণ জেনেরিক্স কম্পাইল করা কোড দ্বিগুণ দ্রুত রান করায়।",
        isCorrect: false,
        explanationEn: "Generics are completely erased during compilation and have zero runtime impact.",
        explanationBn: "জেনেরিক্স কম্পাইলেশনে মুছে যায়, তাই রানটাইম স্পিডে কোনো প্রভাব ফেলে না।",
      },
    ],
  },
  takeawaysEn: [
    "Generics parameterize types to preserve relationships between inputs and outputs.",
    "They eliminate the need for dangerous 'any' casts while avoiding code duplication.",
    "TypeScript automatically infers type arguments from function parameters.",
  ],
  takeawaysBn: [
    "জেনেরিক্স ইনপুট ও আউটপুটের মধ্যে টাইপ সম্পর্ক নিখুঁতভাবে রক্ষা করে।",
    "এটি কোড ডুপ্লিকেট না করেই any-এর ঝুঁকি দূর করে।",
    "টাইপস্ক্রিপ্ট আর্গুমেন্ট দেখেই স্বয়ংক্রিয়ভাবে জেনেরিক টাইপ অনুমান করতে পারে।",
  ],
});

export const REFERENCE_LESSON_CONDITIONAL_TYPES: Lesson = createRichReferenceLesson({
  id: "ts.07.conditional-types",
  slug: "conditional-types",
  moduleId: "ts.mod-07.advanced-types",
  moduleTitleEn: "Module 7: Advanced Types: Type-Level Programming",
  moduleTitleBn: "মডিউল ৭: অ্যাডভান্সড টাইপস: টাইপ-লেভেল প্রোগ্রামিং",
  titleEn: "7.1 Conditional Types (T extends U ? X : Y)",
  titleBn: "৭.১ কন্ডিশনাল টাইপস (T extends U ? X : Y)",
  subtitleEn: "Type-level ternary branching: choosing between types based on relationship subtyping.",
  subtitleBn: "টাইপ-লেভেল টার্নারি ব্রাঞ্চিং: সাবটাইপিং সম্পর্কের ওপর ভিত্তি করে টাইপ নির্বাচন।",
  descriptionEn:
    "Type-level if/else. A conditional type selects one of two possible types based on a subtyping relationship test. If T is assignable to U (T ⊆ U), the type resolves to X; otherwise, it resolves to Y. This is the cornerstone of all type-level computation.",
  descriptionBn:
    "টাইপ লেভেলে if/else লজিক। T যদি U এর সাবটাইপ হয় তবে X নির্বাচন করা, অন্যথায় Y নির্বাচন করা। টাইপস্ক্রিপ্টের সমস্ত জটিল টাইপ-লেভেল কম্পিউটেশনের ভিত্তি হলো এই কন্ডিশনাল টাইপ।",
  difficulty: "advanced",
  estimatedMinutes: 20,
  learningObjectivesEn: [
    "Author conditional types evaluating subtype relationships.",
    "Explain distributive behavior over union arguments.",
    "Re-implement standard utility types like Exclude<T, U> and NonNullable<T>.",
  ],
  learningObjectivesBn: [
    "সাবটাইপ সম্পর্কের ভিত্তিতে কন্ডিশনাল টাইপ লেখা।",
    "ইউনিয়নের ওপর ডিস্ট্রিবিউটিভ আচরণ ব্যাখ্যা করা।",
    "Exclude ও NonNullable এর মতো স্ট্যান্ডার্ড ইউটিলিটি টাইপ তৈরি করা।",
  ],
  concept: {
    id: "concept.conditional-types",
    nameEn: "Conditional Types (T extends U ? X : Y)",
    nameBn: "কন্ডিশনাল টাইপস",
    descriptionEn: "Type-level branching evaluating subtyping.",
    descriptionBn: "সাবটাইপিং সম্পর্কের ওপর ভিত্তি করে টাইপ-লেভেল ব্রাঞ্চিং।",
    trackId: "typescript",
    difficulty: "advanced",
  },
  visualizationId: "typescript.conditional-types",
  codeSnippet: `// 1. Fundamental conditional type:
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false

// 2. Implementing standard Exclude<T, U> using distribution:
type MyExclude<T, U> = T extends U ? never : T;

type AvailableColors = "red" | "green" | "blue";
// "red" distributes -> never
// "green" distributes -> "green"
// "blue" distributes -> "blue"
type SafeColors = MyExclude<AvailableColors, "red">; // "green" | "blue"`,
  mistakeEn: {
    wrong: "Expecting [T] extends [U] to distribute across unions.",
    correct: "Wrapping naked type parameters in tuples ([T]) intentionally DISABLES distribution.",
    explanation: "Distribution only occurs when T is an unwrapped naked type parameter on the left side of 'extends'.",
  },
  mistakeBn: {
    wrong: "[T] extends [U] লিখলেও ইউনিয়নের ওপর ডিস্ট্রিবিউশন ঘটবে ভাবা।",
    correct: "টাইপ প্যারামিটারকে টাপলে ([T]) মুড়ে দিলে ডিস্ট্রিবিউশন বন্ধ হয়ে যায়।",
    explanation: "কেবল নেকেড আনর‍্যাপড টাইপ প্যারামিটারের ক্ষেত্রেই স্বয়ংক্রিয় ইউনিয়ন ডিস্ট্রিবিউশন ঘটে।",
  },
  engineeringNoteEn: {
    title: "Filtering Unions with 'never'",
    content: "When evaluating conditional types over unions, resolving a branch to 'never' automatically removes that constituent from the resulting union because (never | T) resolves to T.",
    rec: "Use 'T extends FilterOut ? never : T' as the universal pattern to strip unwanted variants.",
  },
  engineeringNoteBn: {
    title: "'never' দিয়ে ইউনিয়ন ফিল্টারিং",
    content: "ইউনিয়ন কন্ডিশনালে কোনো ব্রাঞ্চে 'never' দিলে তা স্বয়ংক্রিয়ভাবে বাদ পড়ে যায়, কারণ (never | T) এর ফলাফল শুধু T।",
    rec: "অপ্রয়োজনীয় টাইপ ফিল্টার করার জন্য সর্বদা 'T extends FilterOut ? never : T' ব্যবহার করুন।",
  },
  practice: {
    questionEn: "What does 'type Res = ('a' | 'b' | 123) extends string ? true : false' resolve to without distribution?",
    questionBn: "ডিস্ট্রিবিউশন ছাড়া সরাসরি ইউনিয়নের ওপর কন্ডিশনাল চেক করলে কী ফলাফল পাওয়া যাবে?",
    options: [
      {
        id: "ct-1",
        textEn: "false, because the full union ('a' | 'b' | 123) as a whole is not a subset of string.",
        textBn: "false, কারণ পুরো ইউনিয়ন সেটটি সামগ্রিকভাবে string এর উপসেট নয় (১২৩ সংখ্যা থাকায়)।",
        isCorrect: true,
        explanationEn: "Correct! As a raw un-parameterized union, 123 is not a string, so the entire condition is false.",
        explanationBn: "সঠিক! ১২৩ স্ট্রিং নয়, তাই পুরো ইউনিয়নটি string এর উপসেট হতে পারে না।",
      },
      {
        id: "ct-2",
        textEn: "true, because 'a' and 'b' match.",
        textBn: "true, কারণ 'a' এবং 'b' স্ট্রিং এর সাথে মিলেছে।",
        isCorrect: false,
        explanationEn: "Subtyping requires ALL members to satisfy the constraint unless distributed.",
        explanationBn: "ডিস্ট্রিবিউশন ছাড়া সব উপাদানকে অবশ্যই শর্ত পূরণ করতে হয়।",
      },
    ],
  },
  takeawaysEn: [
    "Conditional types provide if/else evaluation at the type level.",
    "Naked type parameters automatically distribute across unions.",
    "Resolving a branch to 'never' eliminates that constituent from the union.",
  ],
  takeawaysBn: [
    "কন্ডিশনাল টাইপ টাইপ-লেভেলে if/else ব্রাঞ্চিং সুবিধা দেয়।",
    "নেকেড টাইপ প্যারামিটার ইউনিয়নের প্রতিটি উপাদানের ওপর আলাদা হিসাব করে।",
    "কোনো ব্রাঞ্চে 'never' রিটার্ন করলে তা ইউনিয়ন থেকে অপসারিত হয়।",
  ],
});

/**
 * Complete catalog of the 20 canonical reference lessons.
 */
export const TOP_20_REFERENCE_LESSONS: Record<string, Lesson> = {
  variables: TYPESCRIPT_VARIABLES_LESSON,
  "ts-variables": TYPESCRIPT_VARIABLES_LESSON,
  "ts.01.variables-and-bindings": TYPESCRIPT_VARIABLES_LESSON,
  "how-js-ts-differ": REFERENCE_LESSON_HOW_JS_TS_DIFFER,
  "ts.01.how-js-ts-differ": REFERENCE_LESSON_HOW_JS_TS_DIFFER,
  "closures-and-scope": REFERENCE_LESSON_CLOSURES_AND_SCOPE,
  "ts.01.closures-and-scope": REFERENCE_LESSON_CLOSURES_AND_SCOPE,
  "what-ts-does": REFERENCE_LESSON_WHAT_TS_DOES,
  "ts.02.what-ts-does": REFERENCE_LESSON_WHAT_TS_DOES,
  "primitive-types": REFERENCE_LESSON_PRIMITIVE_TYPES,
  "ts.02.primitive-types": REFERENCE_LESSON_PRIMITIVE_TYPES,
  "any-vs-unknown": REFERENCE_LESSON_ANY_VS_UNKNOWN,
  "ts.02.any-vs-unknown": REFERENCE_LESSON_ANY_VS_UNKNOWN,
  "what-is-a-type": REFERENCE_LESSON_WHAT_IS_A_TYPE,
  "ts.03.what-is-a-type": REFERENCE_LESSON_WHAT_IS_A_TYPE,
  "union-types": REFERENCE_LESSON_UNION_TYPES,
  "ts.03.union-types": REFERENCE_LESSON_UNION_TYPES,
  "structural-typing": REFERENCE_LESSON_STRUCTURAL_TYPING,
  "ts.03.structural-typing": REFERENCE_LESSON_STRUCTURAL_TYPING,
  narrowing: TYPESCRIPT_NARROWING_LESSON,
  "type-narrowing": TYPESCRIPT_NARROWING_LESSON,
  "ts.type-narrowing": TYPESCRIPT_NARROWING_LESSON,
  "ts.04.why-narrowing-exists": TYPESCRIPT_NARROWING_LESSON,
  "why-narrowing-exists": TYPESCRIPT_NARROWING_LESSON,
  "discriminated-unions": REFERENCE_LESSON_DISCRIMINATED_UNIONS,
  "ts.04.discriminated-unions": REFERENCE_LESSON_DISCRIMINATED_UNIONS,
  "why-generics-exist": REFERENCE_LESSON_GENERICS_WHY,
  "ts.06.why-generics-exist": REFERENCE_LESSON_GENERICS_WHY,
  "conditional-types": REFERENCE_LESSON_CONDITIONAL_TYPES,
  "ts.07.conditional-types": REFERENCE_LESSON_CONDITIONAL_TYPES,
};
