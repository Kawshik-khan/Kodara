
/**
 * Course outline for The Harness Engineering Playbook (Cohorte field guide
 * v1.0, 640 pp.). Chapters are listed in the book's reading order; Chapter 20
 * sits in Part II in the book. Page numbers are the book's own.
 *
 * This file is the lightweight outline only. Lesson content lives in
 * ./lessons.ts so the track page does not download every lesson.
 */

export interface CourseChapter {
  number: string;
  titleEn: string;
  titleBn: string;
  pages: [number, number];
  minutes: number;
  /** Slug of the authored lesson in ./lessons.ts, when the chapter is built. */
  slug?: string;
}

export interface CoursePart {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  chapters: CourseChapter[];
}

export const HARNESS_COURSE_ID = "harness-playbook";

export const HARNESS_COURSE_PARTS: CoursePart[] = [
  {
    id: "hp-start",
    number: 0,
    titleEn: "Start Here",
    titleBn: "শুরু",
    descriptionEn: "The mental model in ordinary language: the model proposes, the harness governs.",
    descriptionBn: "সহজ ভাষায় মূল ধারণা: মডেল প্রস্তাব দেয়, harness নিয়ন্ত্রণ করে।",
    chapters: [{ number: "In", titleEn: "The Clever Model Is the Easy Part", titleBn: "বুদ্ধিমান মডেলই সহজ অংশ", pages: [7, 14], minutes: 20 }],
  },
  {
    id: "hp-part-1",
    number: 1,
    titleEn: "Part I · Foundations",
    titleBn: "পার্ট I · ভিত্তি",
    descriptionEn: "What the system around the model must remember, control and prove before a suggestion becomes real work.",
    descriptionBn: "মডেলের প্রস্তাব আসল কাজ হওয়ার আগে চারপাশের সিস্টেমকে কী মনে রাখতে, নিয়ন্ত্রণ করতে আর প্রমাণ করতে হয়।",
    chapters: [
      { number: "00", titleEn: "Why Harness Engineering Matters", titleBn: "Harness Engineering কেন জরুরি", pages: [16, 29], minutes: 35, slug: "harness-00-why-harness-engineering" },
      { number: "01", titleEn: "Where Operational Truth Lives", titleBn: "কাজের আসল সত্য কোথায় থাকে", pages: [30, 54], minutes: 45, slug: "harness-01-where-operational-truth-lives" },
      { number: "02", titleEn: "From Tool Calls to Safe Actions", titleBn: "Tool Call থেকে নিরাপদ Action", pages: [55, 74], minutes: 40, slug: "harness-02-tool-calls-to-safe-actions" },
    ],
  },
  {
    id: "hp-part-2",
    number: 2,
    titleEn: "Part II · Runtime",
    titleBn: "পার্ট II · রানটাইম",
    descriptionEn: "Briefing the model, deciding when to continue, testing that earns trust, and reliable skills.",
    descriptionBn: "মডেলকে briefing, কখন চালিয়ে যাবে তা ঠিক করা, আস্থা অর্জনের testing আর নির্ভরযোগ্য skill।",
    chapters: [
      { number: "03", titleEn: "Building the Right Briefing", titleBn: "সঠিক briefing তৈরি", pages: [76, 94], minutes: 35, slug: "harness-03-building-the-right-briefing" },
      { number: "04", titleEn: "Knowing When to Continue, Wait, or Stop", titleBn: "কখন চালিয়ে যাবে, অপেক্ষা করবে, না থামবে", pages: [95, 111], minutes: 35, slug: "harness-04-knowing-when-to-continue-wait-or-stop" },
      { number: "05", titleEn: "Testing That Earns Trust", titleBn: "যে testing আস্থা অর্জন করে", pages: [112, 134], minutes: 40, slug: "harness-05-testing-that-earns-trust" },
      { number: "20", titleEn: "Turning Procedures into Reliable Agent Skills", titleBn: "Procedure থেকে নির্ভরযোগ্য agent skill", pages: [135, 152], minutes: 35, slug: "harness-20-turning-procedures-into-reliable-agent-skills" },
    ],
  },
  {
    id: "hp-part-3",
    number: 3,
    titleEn: "Part III · Optimization",
    titleBn: "পার্ট III · অপটিমাইজেশন",
    descriptionEn: "Improving the whole outcome without hiding the cost where the score does not look.",
    descriptionBn: "Score যেখানে দেখে না, সেখানে খরচ না লুকিয়ে পুরো ফলাফল উন্নত করা।",
    chapters: [
      { number: "06", titleEn: "What Are We Really Optimizing?", titleBn: "আমরা আসলে কী optimize করছি?", pages: [154, 175], minutes: 40 },
      { number: "07", titleEn: "Learning from What the System Did", titleBn: "সিস্টেম যা করেছে তা থেকে শেখা", pages: [176, 195], minutes: 35 },
      { number: "08", titleEn: "Knowing Where an Improvement Still Holds", titleBn: "উন্নতি কোথায় টিকে থাকে, তা জানা", pages: [196, 214], minutes: 35 },
    ],
  },
  {
    id: "hp-part-4",
    number: 4,
    titleEn: "Part IV · Coordination",
    titleBn: "পার্ট IV · সমন্বয়",
    descriptionEn: "When another agent adds useful difference rather than cost and noise.",
    descriptionBn: "আরেকটা agent কখন খরচ আর গোলমাল না বাড়িয়ে সত্যিকারের কাজে লাগে।",
    chapters: [
      { number: "09", titleEn: "When More Agents Actually Help", titleBn: "আরও agent কখন সত্যিই কাজে লাগে", pages: [216, 235], minutes: 35 },
      { number: "10", titleEn: "How Work Changes Hands", titleBn: "কাজ কীভাবে হাতবদল হয়", pages: [236, 252], minutes: 30 },
      { number: "11", titleEn: "The Hidden Cost of Agent Teams", titleBn: "Agent team-এর লুকানো খরচ", pages: [253, 272], minutes: 35 },
    ],
  },
  {
    id: "hp-part-5",
    number: 5,
    titleEn: "Part V · Adaptation",
    titleBn: "পার্ট V · অভিযোজন",
    descriptionEn: "Changing tactics without changing the rules, and improving without grading yourself.",
    descriptionBn: "নিয়ম না বদলে কৌশল বদলানো, আর নিজের খাতা নিজে না দেখে উন্নত হওয়া।",
    chapters: [
      { number: "12", titleEn: "Changing Tactics Without Changing the Rules", titleBn: "নিয়ম না বদলে কৌশল বদলানো", pages: [274, 293], minutes: 35 },
      { number: "13", titleEn: "How a System Improves Without Grading Itself", titleBn: "নিজের খাতা নিজে না দেখে সিস্টেম কীভাবে উন্নত হয়", pages: [294, 312], minutes: 35 },
    ],
  },
  {
    id: "hp-part-6",
    number: 6,
    titleEn: "Part VI · Warranted Trust",
    titleBn: "পার্ট VI · প্রমাণিত আস্থা",
    descriptionEn: "Permissions, reliability, security and turning trust into an operating decision.",
    descriptionBn: "অনুমতি, নির্ভরযোগ্যতা, নিরাপত্তা আর আস্থাকে কাজের সিদ্ধান্তে রূপ দেওয়া।",
    chapters: [
      { number: "14", titleEn: "Who Is Allowed to Do What?", titleBn: "কে কী করার অনুমতি পায়?", pages: [314, 330], minutes: 30 },
      { number: "15", titleEn: "From Good Components to a Dependable System", titleBn: "ভালো অংশ থেকে নির্ভরযোগ্য সিস্টেম", pages: [331, 351], minutes: 35 },
      { number: "16", titleEn: "Security Beyond Prompt Injection", titleBn: "Prompt injection-এর বাইরের নিরাপত্তা", pages: [352, 373], minutes: 40 },
      { number: "17", titleEn: "Turning Trust into an Operating Decision", titleBn: "আস্থাকে কাজের সিদ্ধান্তে রূপ দেওয়া", pages: [374, 396], minutes: 40 },
    ],
  },
  {
    id: "hp-part-7",
    number: 7,
    titleEn: "Part VII · Practice",
    titleBn: "পার্ট VII · অনুশীলন",
    descriptionEn: "A 90-day plan, lessons from leading teams, and the full Customer Resolution Agent case.",
    descriptionBn: "৯০ দিনের পরিকল্পনা, শীর্ষ টিমের অভিজ্ঞতা আর পুরো Customer Resolution Agent case।",
    chapters: [
      { number: "18", titleEn: "The 90-Day Field Playbook", titleBn: "৯০ দিনের field playbook", pages: [398, 415], minutes: 30 },
      { number: "19", titleEn: "What to Learn from Leading AI Teams", titleBn: "শীর্ষ AI টিমগুলো থেকে কী শেখার আছে", pages: [416, 437], minutes: 35 },
      { number: "FC", titleEn: "Field Case: The Customer Resolution Agent", titleBn: "Field case: Customer Resolution Agent", pages: [438, 442], minutes: 20 },
    ],
  },
  {
    id: "hp-part-8",
    number: 8,
    titleEn: "Part VIII · Field Artifacts",
    titleBn: "পার্ট VIII · ফিল্ড আর্টিফ্যাক্ট",
    descriptionEn: "Appendices A–V: glossary, reference architectures, templates and qualification cards.",
    descriptionBn: "পরিশিষ্ট A–V: glossary, reference architecture, template আর qualification card।",
    chapters: [{ number: "A–V", titleEn: "Appendices: Templates and Reference Cards", titleBn: "পরিশিষ্ট: template আর reference card", pages: [443, 636], minutes: 60 }],
  },
];

/** Slugs of authored lessons, in reading order. */
export const HARNESS_COURSE_SLUGS: string[] = HARNESS_COURSE_PARTS.flatMap((part) =>
  part.chapters.flatMap((ch) => (ch.slug ? [ch.slug] : []))
);
