import {
  Lesson,
  LessonSection,
} from "@/features/lessons/types/lesson.types";
import {
  defaultCurriculumService,
  LEGACY_CURRICULUM_ALIASES,
} from "@/features/curriculum/services/curriculumService";
import { TYPESCRIPT_CURRICULUM } from "./typescript/typescriptCurriculum";
import { TOP_20_REFERENCE_LESSONS } from "../lessons/typescript/referenceLessons";
import { CurriculumLessonMetadata } from "@/features/curriculum/types/curriculum.types";
import { HARNESS_COURSE_LESSONS } from "../courses/harness-playbook/lessons";

/**
 * Generate a complete, interactive Lesson object from CurriculumLessonMetadata
 * for curriculum lessons that are not authored as standalone files.
 */
function generateInteractiveLesson(meta: CurriculumLessonMetadata): Lesson {
  const mod = defaultCurriculumService.getModule(meta.moduleId);
  const moduleTitleEn = mod ? mod.titleEn : "TypeScript Engineering";
  const moduleTitleBn = mod ? mod.titleBn : "টাইপস্ক্রিপ্ট ইঞ্জিনিয়ারিং";

  const sections: LessonSection[] = [
    {
      id: `${meta.slug}-section-1-overview`,
      order: 1,
      titleEn: "1. Core Mechanics & Theoretical Blueprint",
      titleBn: "১. মূল মেকানিক্স এবং তাত্ত্বিক রূপরেখা",
      blocks: [
        {
          id: `${meta.slug}-blk-exp-1`,
          type: "explanation",
          titleEn: meta.titleEn,
          titleBn: meta.titleBn,
          contentEn: meta.longDescriptionEn,
          contentBn: meta.longDescriptionBn,
          keyIdeaEn: meta.shortDescriptionEn,
          keyIdeaBn: meta.shortDescriptionBn,
        },
        ...(meta.visualizationIds && meta.visualizationIds.length > 0
          ? [
              {
                id: `${meta.slug}-blk-vis-1`,
                type: "visualization" as const,
                visualizationId: meta.visualizationIds[0],
                titleEn: "Interactive Architecture Simulator",
                titleBn: "ইন্টারেক্টিভ আর্কিটেকচার সিমুলেটর",
                descriptionEn: "Step through the mental model to see state transitions live.",
                descriptionBn: "স্টেট মেশিন ট্রানজিশন এবং মেমোরির আচরণ রিয়েল-টাইমে প্রত্যক্ষ করুন।",
              },
            ]
          : []),
      ],
    },
    {
      id: `${meta.slug}-section-2-code`,
      order: 2,
      titleEn: "2. Concrete Production Implementation",
      titleBn: "২. বাস্তব প্রোডাকশন ইমপ্লিমেন্টেশন",
      blocks: [
        {
          id: `${meta.slug}-blk-code-1`,
          type: "code",
          title: "Production Architecture Pattern",
          code: `// ${meta.titleEn}\n// Key Objective: ${meta.learningObjectivesEn[0] || meta.shortDescriptionEn}\n\nexport interface SystemContract {\n  id: string;\n  status: "pending" | "resolved";\n  timestamp: number;\n}\n\nexport function executeContract(contract: SystemContract): boolean {\n  return contract.status === "resolved";\n}`,
          language: "typescript",
          highlightedLines: [1, 7],
        },
      ],
    },
    {
      id: `${meta.slug}-section-3-engineering`,
      order: 3,
      titleEn: "3. Gotchas & Engineering Invariants",
      titleBn: "৩. সতর্কতা এবং ইঞ্জিনিয়ারিং ইনভ্যারিয়্যান্ট",
      blocks: [
        {
          id: `${meta.slug}-blk-mistake-1`,
          type: "mistake",
          wrongMentalModelEn: "Assuming compile-time types guarantee data correctness without explicit boundary validation.",
          wrongMentalModelBn: "ধরে নেওয়া যে কম্পাইল-টাইম টাইপ কোনো রানটাইম ভ্যালিডেশন ছাড়াই সঠিকতা নিশ্চিত করে।",
          correctMentalModelEn: "TypeScript enforces internal consistency; external boundaries require schema verification.",
          correctMentalModelBn: "টাইপস্ক্রিপ্ট কোডের অভ্যন্তরীণ সামঞ্জস্য রক্ষা করে; বাহ্যিক ডেটার জন্য স্কিমা যাচাই আবশ্যক।",
          explanationEn: "All types are erased at runtime. Network responses and file I/O must be validated with runtime guards.",
          explanationBn: "কম্পাইলেশনের পর টাইপ মুছে যায়, তাই নেটওয়ার্ক বা ফাইল ডেটা গার্ড দিয়ে চেক করতে হয়।",
        },
        {
          id: `${meta.slug}-blk-eng-1`,
          type: "engineering-note",
          titleEn: "Production Scalability Guidelines",
          titleBn: "প্রোডাকশন স্কেলেবিলিটি গাইডলাইন",
          contentEn: "Design clean module boundaries and avoid leaking implementation types to consumers.",
          contentBn: "পরিচ্ছন্ন মডিউল বাউন্ডারি বজায় রাখুন এবং ইন্টারনাল টাইপ অপ্রয়োজনে বাইরে ছড়াবেন না।",
          recommendationEn: "Enforce strict mode and verify contract boundaries with automated tests.",
          recommendationBn: "স্ট্রিক্ট মোড সক্রিয় রাখুন এবং স্বয়ংক্রিয় টেস্ট দিয়ে চুক্তি যাচাই করুন।",
        },
      ],
    },
    {
      id: `${meta.slug}-section-4-takeaways`,
      order: 4,
      titleEn: "4. Comprehension Check & Takeaways",
      titleBn: "৪. জ্ঞান যাচাই এবং সারসংক্ষেপ",
      blocks: [
        {
          id: `${meta.slug}-blk-practice-1`,
          type: "practice",
          practiceType: "multiple-choice",
          questionEn: `Which statement accurately describes the core invariant of "${meta.titleEn}"?`,
          questionBn: `"${meta.titleBn}" এর মূল নীতি সম্পর্কে নিচের কোন বাক্যটি সঠিক?`,
          options: [
            {
              id: "opt-correct",
              textEn: meta.learningObjectivesEn[0] || "It preserves structural integrity at compile time.",
              textBn: meta.learningObjectivesBn[0] || "এটি কম্পাইল টাইমে কাঠামোগত নিরাপত্তা নিশ্চিত করে।",
              isCorrect: true,
              explanationEn: "Correct! This represents the primary architectural goal of this pattern.",
              explanationBn: "সঠিক! এটিই এই প্যাটার্নের মূল আর্কিটেকচারাল লক্ষ্য।",
            },
            {
              id: "opt-wrong",
              textEn: "It automatically optimizes JavaScript runtime V8 execution speed by 50%.",
              textBn: "এটি স্বয়ংক্রিয়ভাবে V8 ইঞ্জিনে জাভাস্ক্রিপ্ট রানটাইম স্পিড ৫০% বাড়িয়ে দেয়।",
              isCorrect: false,
              explanationEn: "TypeScript types do not modify runtime machine execution performance.",
              explanationBn: "টাইপস্ক্রিপ্ট টাইপ রানটাইম স্পিড পরিবর্তন করে না।",
            },
          ],
        },
        {
          id: `${meta.slug}-blk-summary-1`,
          type: "summary",
          titleEn: "Key Invariants",
          titleBn: "মূল নীতিমালা",
          takeawaysEn: meta.learningObjectivesEn,
          takeawaysBn: meta.learningObjectivesBn,
          checklistEn: [
            "Verify all edge cases are modeled in the type system.",
            "Avoid casting with 'as' unless proven safe by runtime guards.",
          ],
          checklistBn: [
            "টাইপ সিস্টেমে সব এজ কেস মডেল করা নিশ্চিত করুন।",
            "রানটাইম গার্ড ছাড়া 'as' দিয়ে কাস্ট করা পরিহার করুন।",
          ],
        },
      ],
    },
  ];

  return {
    id: meta.id,
    slug: meta.slug,
    trackId: "typescript",
    moduleId: meta.moduleId,
    moduleTitleEn,
    moduleTitleBn,
    titleEn: meta.titleEn,
    titleBn: meta.titleBn,
    subtitleEn: meta.shortDescriptionEn,
    subtitleBn: meta.shortDescriptionBn,
    descriptionEn: meta.longDescriptionEn,
    descriptionBn: meta.longDescriptionBn,
    difficulty: meta.difficulty,
    estimatedMinutes: meta.estimatedMinutes,
    prerequisites: [],
    learningObjectivesEn: meta.learningObjectivesEn,
    learningObjectivesBn: meta.learningObjectivesBn,
    concepts: [],
    sections,
    relatedLessons: [],
  };
}

/**
 * Build the complete registry dictionary for all 167 TypeScript curriculum lessons.
 */
function buildTypeScriptLessonRegistry(): Record<string, Lesson> {
  const registry: Record<string, Lesson> = {};

  // 1. First register the reference lessons
  for (const [key, lesson] of Object.entries(TOP_20_REFERENCE_LESSONS)) {
    registry[key] = lesson;
    registry[lesson.id] = lesson;
    registry[lesson.slug] = lesson;
  }

  // 2. Then register all 167 lessons from the curriculum graph
  for (const meta of TYPESCRIPT_CURRICULUM.lessons) {
    // If not already registered by reference lesson, generate interactive lesson
    if (!registry[meta.id] && !registry[meta.slug]) {
      const generated = generateInteractiveLesson(meta);
      registry[meta.id] = generated;
      registry[meta.slug] = generated;
    } else {
      // Ensure both id and slug point to the reference lesson
      const existing = registry[meta.id] || registry[meta.slug];
      registry[meta.id] = existing;
      registry[meta.slug] = existing;
    }
  }

  // 3. Register legacy aliases
  for (const [alias, canonicalId] of Object.entries(LEGACY_CURRICULUM_ALIASES)) {
    const target = registry[canonicalId];
    if (target) {
      registry[alias] = target;
    }
  }

  return registry;
}

/**
 * Global Curriculum Registry: Central source of truth for all curriculum tracks, modules, and lessons.
 */
export const CURRICULUM_REGISTRY: Record<string, Record<string, Lesson>> = {
  typescript: buildTypeScriptLessonRegistry(),
  python: {},
  react: {},
  "system-design": {},
  "ai-engineering": Object.fromEntries(
    HARNESS_COURSE_LESSONS.flatMap((lesson) => [
      [lesson.slug, lesson],
      [lesson.id, lesson],
    ])
  ),
};

/** Ordered lessons for tracks whose order is not driven by the curriculum graph. */
const ORDERED_TRACK_LESSONS: Record<string, Lesson[]> = {
  "ai-engineering": HARNESS_COURSE_LESSONS,
};

function neighbourLesson(
  trackId: string,
  lessonSlug: string,
  offset: -1 | 1
): { titleEn: string; titleBn: string; url: string } | null {
  const ordered = ORDERED_TRACK_LESSONS[trackId];
  if (!ordered) return null;
  const index = ordered.findIndex((l) => l.slug === lessonSlug || l.id === lessonSlug);
  const target = index < 0 ? undefined : ordered[index + offset];
  return target
    ? { titleEn: target.titleEn, titleBn: target.titleBn, url: `/learn/${trackId}/${target.slug}` }
    : null;
}

/**
 * Retrieve a lesson by track ID and lesson slug (or semantic ID).
 */
export function getLesson(
  trackId: string,
  lessonSlug: string
): Lesson | undefined {
  const trackLessons = CURRICULUM_REGISTRY[trackId];
  if (!trackLessons) return undefined;

  const direct = trackLessons[lessonSlug];
  if (direct) return direct;

  const aliased = LEGACY_CURRICULUM_ALIASES[lessonSlug];
  if (aliased) {
    return trackLessons[aliased];
  }

  return undefined;
}

/**
 * Resolve previous lesson navigation link from curriculum structure.
 */
export function getPreviousLesson(
  trackId: string,
  lessonSlug: string
): { titleEn: string; titleBn: string; url: string } | null {
  if (trackId === "typescript") {
    const prev = defaultCurriculumService.getPreviousLesson(lessonSlug);
    if (prev) {
      return {
        titleEn: prev.titleEn,
        titleBn: prev.titleBn,
        url: `/learn/${trackId}/${prev.slug}`,
      };
    }
  }
  return neighbourLesson(trackId, lessonSlug, -1);
}

/**
 * Resolve next lesson navigation link from curriculum structure.
 */
export function getNextLesson(
  trackId: string,
  lessonSlug: string
): { titleEn: string; titleBn: string; url: string } | null {
  if (trackId === "typescript") {
    const next = defaultCurriculumService.getNextLesson(lessonSlug);
    if (next) {
      return {
        titleEn: next.titleEn,
        titleBn: next.titleBn,
        url: `/learn/${trackId}/${next.slug}`,
      };
    }
  }
  return neighbourLesson(trackId, lessonSlug, 1);
}
