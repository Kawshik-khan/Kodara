import {
  BiText,
  CodeTraceDefinition,
  TraceCondition,
  TraceNoteText,
  TraceStep,
  TraceValue,
} from "../types/trace.types";

export function noteKey(step: TraceStep): string {
  const suffix = step.event === "exception" ? "!" : step.event === "return" ? "^" : "";
  return `${step.line}${suffix}`;
}

function innermostLocals(step: TraceStep): Record<string, string> {
  return step.frames[step.frames.length - 1]?.locals ?? {};
}

function objectPath(step: TraceStep, path: string): TraceValue | undefined {
  const [name, ...rest] = path.split(".");
  let current: TraceValue | undefined = step.objects[name];
  for (const key of rest) {
    if (current && typeof current === "object" && !Array.isArray(current) && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export function formatValue(value: TraceValue | undefined): string {
  if (value === undefined) return "";
  if (value === null) return "None";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

/** Fill {local.x}, {object.a.b}, {detail} and {line} from the recorded step. */
export function fillTemplate(text: string, step: TraceStep): string {
  return text.replace(/\{([a-zA-Z_.]+)\}/g, (match, path: string) => {
    if (path === "detail") return step.detail ?? "";
    if (path === "line") return String(step.line);
    if (path.startsWith("local.")) {
      const value = innermostLocals(step)[path.slice(6)];
      return value ?? match;
    }
    if (path.startsWith("object.")) {
      const value = objectPath(step, path.slice(7));
      return value === undefined ? match : formatValue(value);
    }
    return match;
  });
}

export function conditionHolds(
  condition: TraceCondition,
  step: TraceStep,
  next: TraceStep | undefined
): boolean {
  if ("localPresent" in condition) {
    return condition.localPresent in innermostLocals(step);
  }
  if (!next) return false;
  return (
    JSON.stringify(objectPath(step, condition.changesNext)) !==
    JSON.stringify(objectPath(next, condition.changesNext))
  );
}

export interface ResolvedNote {
  what: BiText;
  why?: BiText;
  without?: BiText;
  ref?: string;
}

const fillBi = (text: BiText | undefined, step: TraceStep): BiText | undefined =>
  text && { en: fillTemplate(text.en, step), bn: fillTemplate(text.bn, step) };

/**
 * The note for one step: the first variant whose condition holds overrides
 * the base fields it defines. Returns undefined when the line has no note.
 */
export function resolveNote(
  definition: CodeTraceDefinition,
  steps: TraceStep[],
  index: number
): ResolvedNote | undefined {
  const step = steps[index];
  const note = definition.notes[noteKey(step)];
  if (!note) return undefined;
  const variant = note.variants?.find((v) => conditionHolds(v.when, step, steps[index + 1]));
  const merged: TraceNoteText = {
    what: variant?.what ?? note.what,
    why: variant?.why ?? note.why,
    without: variant?.without ?? note.without,
    ref: variant?.ref ?? note.ref,
  };
  return {
    what: fillBi(merged.what, step) as BiText,
    why: fillBi(merged.why, step),
    without: fillBi(merged.without, step),
    ref: merged.ref,
  };
}

/** Index a scenario opens on. */
export function initialStepIndex(
  steps: TraceStep[],
  initial: number | "firstCaughtException" | undefined
): number {
  if (typeof initial === "number") return Math.max(0, Math.min(initial, steps.length - 1));
  if (initial === "firstCaughtException") {
    const i = steps.findIndex((s) => s.event === "exception" && s.frames.length === 1);
    return i < 0 ? 0 : i;
  }
  return 0;
}

/** Every step key in a trace that has no note: used by content tests. */
export function missingNotes(definition: CodeTraceDefinition): string[] {
  const missing = new Set<string>();
  for (const [scenario, steps] of Object.entries(definition.trace.scenarios)) {
    for (const step of steps) {
      if (!definition.notes[noteKey(step)]) missing.add(`${scenario}:${noteKey(step)}`);
    }
  }
  return [...missing];
}
