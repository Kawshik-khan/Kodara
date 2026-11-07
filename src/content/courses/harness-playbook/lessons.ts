import { Lesson } from "@/features/lessons/types/lesson.types";
import { HARNESS_COURSE_SLUGS } from "./course";
import { CH00_WHY_HARNESS_LESSON } from "./ch00/ch00.lesson";
import { CH01_OPERATIONAL_TRUTH_LESSON } from "./ch01/ch01.lesson";
import { CH02_TOOL_CALLS_LESSON } from "./ch02/ch02.lesson";
import { CH03_BUILDING_BRIEFING_LESSON } from "./ch03/ch03.lesson";
import { CH04_CONTINUE_WAIT_STOP_LESSON } from "./ch04/ch04.lesson";
import { CH05_TESTING_TRUST_LESSON } from "./ch05/ch05.lesson";
import { CH20_RELIABLE_SKILLS_LESSON } from "./ch20/ch20.lesson";

/**
 * Authored lesson content for the Harness Engineering Playbook course.
 * Only the lesson page imports this; the track page reads the light outline in ./course.ts.
 */
const AUTHORED: Lesson[] = [
  CH00_WHY_HARNESS_LESSON,
  CH01_OPERATIONAL_TRUTH_LESSON,
  CH02_TOOL_CALLS_LESSON,
  CH03_BUILDING_BRIEFING_LESSON,
  CH04_CONTINUE_WAIT_STOP_LESSON,
  CH05_TESTING_TRUST_LESSON,
  CH20_RELIABLE_SKILLS_LESSON,
];

const BY_SLUG = new Map(AUTHORED.map((lesson) => [lesson.slug, lesson]));

/** Authored lessons in the outline's reading order. */
export const HARNESS_COURSE_LESSONS: Lesson[] = HARNESS_COURSE_SLUGS.map((slug) => {
  const lesson = BY_SLUG.get(slug);
  if (!lesson) throw new Error(`Course outline lists "${slug}" but no lesson with that slug is registered.`);
  return lesson;
});
