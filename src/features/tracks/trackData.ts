import { TrackDetail, TrackModule } from "./types";
import { defaultCurriculumService } from "@/features/curriculum/services/curriculumService";
import { HARNESS_COURSE_PARTS } from "@/content/courses/harness-playbook/course";

function buildTypeScriptTrack(): TrackDetail {
  const graph = defaultCurriculumService.getCurriculum();
  const totalLessons = graph.lessons.length;
  // Progress baseline: Module 1 first lesson is available / in progress
  const completedLessons = 1;

  const modules: TrackModule[] = graph.modules.map((mod, modIdx) => {
    const modLessons = graph.lessons.filter((l) => l.moduleId === mod.id);
    return {
      id: mod.id,
      number: mod.order || modIdx + 1,
      titleEn: mod.titleEn,
      titleBn: mod.titleBn,
      descriptionEn: mod.descriptionEn,
      descriptionBn: mod.descriptionBn,
      lessons: modLessons.map((l) => {
        // Module 1 first lesson is completed/available by default
        const isUnlocked =
          l.id === "ts.01.how-js-ts-differ" ||
          l.id === "ts.01.variables-and-bindings" ||
          l.prerequisites.length === 0;

        return {
          id: l.id,
          slug: l.slug,
          number: l.order,
          titleEn: l.titleEn,
          titleBn: l.titleBn,
          duration: `${l.estimatedMinutes} min`,
          status: l.id === "ts.01.how-js-ts-differ"
            ? "completed"
            : isUnlocked
            ? "in_progress"
            : "locked",
        };
      }),
    };
  });

  return {
    id: "typescript",
    titleEn: graph.trackTitleEn,
    titleBn: graph.trackTitleBn,
    taglineEn: "Master structural typing, runtime mechanics, ASTs, and production systems.",
    taglineBn: "স্ট্রাকচারাল টাইপিং, রানটাইম মেকানিক্স, AST এবং প্রোডাকশন আর্কিটেকচার আয়ত্ত করুন।",
    descriptionEn: "Master all 14 modules of modern TypeScript: from runtime foundations to compiler AST analysis, production patterns, and full-stack distributed architectures.",
    descriptionBn: "টাইপস্ক্রিপ্টের ১৪টি মডিউল সম্পন্ন করুন: রানটাইম ফাউন্ডেশনস থেকে শুরু করে কম্পাইলার AST অ্যানালাইসিস এবং প্রোডাকশন আর্কিটেকচার।",
    progressPercent: Math.round((completedLessons / totalLessons) * 100),
    totalLessons,
    completedLessons,
    modules,
  };
}

/** Modules and counts for the Harness Engineering Playbook course (ADR-008). */
function harnessCourseTrackProgress(): Pick<
  TrackDetail,
  "modules" | "totalLessons" | "completedLessons" | "progressPercent"
> {
  let index = 0;
  const modules: TrackModule[] = HARNESS_COURSE_PARTS.map((part) => ({
    id: part.id,
    number: part.number,
    titleEn: part.titleEn,
    titleBn: part.titleBn,
    descriptionEn: part.descriptionEn,
    descriptionBn: part.descriptionBn,
    lessons: part.chapters.map((ch) => ({
      id: ch.slug ?? `${part.id}-${ch.number}`,
      slug: ch.slug,
      number: ++index,
      label: ch.number,
      titleEn: ch.titleEn,
      titleBn: ch.titleBn,
      duration: `${ch.minutes} min · pp. ${ch.pages[0]}–${ch.pages[1]}`,
      status: ch.slug ? "in_progress" : "planned",
    })),
  }));
  return { modules, totalLessons: index, completedLessons: 0, progressPercent: 0 };
}

export const TRACK_DATA: Record<string, TrackDetail> = {
  typescript: buildTypeScriptTrack(),
  python: {
    id: "python",
    titleEn: "Python: CPython Internals & Execution Model",
    titleBn: "Python: CPython ইন্টারনালস এবং এক্সিকিউশন মডেল",
    taglineEn: "Bytecode, GIL, frame objects, reference counting, and descriptor protocols.",
    taglineBn: "বাইটকোড, GIL, ফ্রেম অবজেক্ট, রেফারেন্স কাউন্টিং এবং ডেসক্রিপ্টর প্রোটোকল।",
    descriptionEn: "Master how Python actually executes: from AST compilation to ceval.c opcode dispatch, memory arenas, and the Global Interpreter Lock.",
    descriptionBn: "পাইথন কীভাবে কাজ করে তার গভীরে জানুন: AST কম্পাইলেশন থেকে ceval.c অপকোড ডিসপ্যাচ, মেমোরি অ্যারেনা এবং গ্লোবাল ইন্টারপ্রেটার লক।",
    progressPercent: 42,
    totalLessons: 14,
    completedLessons: 6,
    modules: [
      {
        id: "py-mod-01",
        number: 1,
        titleEn: "CPython Memory Architecture & Objects",
        titleBn: "CPython মেমোরি আর্কিটেকচার এবং অবজেক্টস",
        descriptionEn: "PyObject struct layout, ob_refcnt, ob_type pointers, and small integer cache mechanics.",
        descriptionBn: "PyObject স্ট্রাকট লেআউট, ob_refcnt, ob_type পয়েন্টার এবং স্মল ইন্টিজার ক্যাশ মেকানিক্স।",
        lessons: [
          {
            id: "py-01",
            number: 1,
            titleEn: "PyObject: The Universal C Struct Behind Every Python Value",
            titleBn: "PyObject: প্রতিটি পাইথন মানের পেছনের সার্বজনীন C স্ট্রাকট",
            duration: "25 min",
            status: "completed",
          },
          {
            id: "py-02",
            number: 2,
            titleEn: "Reference Counting Mechanics & Py_INCREF / Py_DECREF",
            titleBn: "রেফারেন্স কাউন্টিং মেকানিক্স এবং Py_INCREF / Py_DECREF",
            duration: "30 min",
            status: "completed",
          },
        ],
      },
    ],
  },
  react: {
    id: "react",
    titleEn: "React: Fiber Architecture & State Mechanics",
    titleBn: "React: ফাইবার আর্কিটেকচার এবং স্টেট মেকানিক্স",
    taglineEn: "Concurrent mode, reconciliation, scheduler work loops, and hooks linked lists.",
    taglineBn: "কনকারেন্ট মোড, রিকনসিলিয়েশন, শিডিউলার ওয়ার্ক লুপ এবং হুকস লিঙ্কড লিস্ট।",
    descriptionEn: "Understand how React renders UI: dive into the Fiber node tree, lane priority, work loop, and internal hooks dispatcher.",
    descriptionBn: "React কীভাবে UI রেন্ডার করে: ফাইবার নোড ট্রি, লেন প্রায়োরিটি, ওয়ার্ক লুপ এবং ইন্টারনাল হুকস ডিসপ্যাচার।",
    progressPercent: 20,
    totalLessons: 12,
    completedLessons: 2,
    modules: [
      {
        id: "react-mod-01",
        number: 1,
        titleEn: "Fiber Node Structure & Reconciliation",
        titleBn: "ফাইবার নোড স্ট্রাকচার এবং রিকনসিলিয়েশন",
        descriptionEn: "The double-buffering current/workInProgress trees and child/sibling/return pointers.",
        descriptionBn: "ডাবল-বাফারিং কারেন্ট/ওয়ার্ক-ইন-প্রগ্রেস ট্রি এবং চাইল্ড/সিবলিং/রিটার্ন পয়েন্টার।",
        lessons: [
          {
            id: "react-01",
            number: 1,
            titleEn: "Why Fiber? The Problem with Stack Reconciliation",
            titleBn: "কেন ফাইবার? স্ট্যাক রিকনসিলিয়েশনের সীমাবদ্ধতা",
            duration: "25 min",
            status: "completed",
          },
        ],
      },
    ],
  },
  "system-design": {
    id: "system-design",
    titleEn: "System Design: Distributed Architectures",
    titleBn: "System Design: ডিস্ট্রিবিউটেড সিস্টেম আর্কিটেকচার",
    taglineEn: "CAP theorem, consistency models, load balancing, caching, and partitioning.",
    taglineBn: "CAP থিওরেম, কনসিস্টেন্সি মডেল, লোড ব্যালেন্সিং, ক্যাশিং এবং ডেটাবেস পার্টিশনিং।",
    descriptionEn: "Architect resilient high-scale systems: master trade-offs in distributed transactions, replication lag, and event-driven backbones.",
    descriptionBn: "হাই-স্কেল সিস্টেম আর্কিটেকচার: ডিস্ট্রিবিউটেড ট্রানজ্যাকশন, রেপ্লিকেশন ল্যাগ এবং ইভেন্ট-ড্রিভেন ব্যাকবোনের ট্রেড-অফ।",
    progressPercent: 10,
    totalLessons: 15,
    completedLessons: 1,
    modules: [
      {
        id: "sys-mod-01",
        number: 1,
        titleEn: "Foundations of Distributed Systems",
        titleBn: "ডিস্ট্রিবিউটেড সিস্টেমের মূল ভিত্তি",
        descriptionEn: "Network latency, fallacies of distributed computing, and the CAP theorem.",
        descriptionBn: "নেটওয়ার্ক ল্যাটেন্সি, ডিস্ট্রিবিউটেড কম্পিউটিংয়ের ভুল ধারণা এবং CAP থিওরেম।",
        lessons: [
          {
            id: "sys-01",
            number: 1,
            titleEn: "Fallacies of Distributed Computing & RPC Latency",
            titleBn: "ডিস্ট্রিবিউটেড কম্পিউটিংয়ের ৮টি ভুল ধারণা ও RPC ল্যাটেন্সি",
            duration: "30 min",
            status: "completed",
          },
        ],
      },
    ],
  },
  "ai-engineering": {
    id: "ai-engineering",
    titleEn: "AI Engineering: The Harness Engineering Playbook",
    titleBn: "AI Engineering: Harness Engineering Playbook",
    taglineEn: "The model proposes. The harness governs. Evidence decides how much autonomy is earned.",
    taglineBn: "মডেল প্রস্তাব দেয়, harness নিয়ন্ত্রণ করে, আর evidence ঠিক করে কতটা স্বাধীনতা প্রাপ্য।",
    descriptionEn: "A course built from The Harness Engineering Playbook (Cohorte field guide v1.0): theory for every chapter with page references, controllable visuals and charts, Python written for the course with recorded line-by-line traces, and chapter Q&A.",
    descriptionBn: "The Harness Engineering Playbook (Cohorte field guide v1.0) থেকে তৈরি কোর্স: প্রতিটা অধ্যায়ের তত্ত্ব, বইয়ের পৃষ্ঠা নম্বরসহ; নিয়ন্ত্রণযোগ্য visual আর chart; কোর্সের জন্য লেখা Python, রেকর্ড করা line-by-line trace-সহ; আর অধ্যায়ভিত্তিক প্রশ্নোত্তর।",
    ...harnessCourseTrackProgress(),
  },
};
