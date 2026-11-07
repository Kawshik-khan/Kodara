/**
 * Recorded execution traces (ADR-008). The JSON comes from
 * courses/harness-playbook/tools/record_trace.py, never from hand authoring.
 */

export type TraceEvent = "line" | "exception" | "return";

export type TraceValue =
  | string
  | number
  | boolean
  | null
  | TraceValue[]
  | { [key: string]: TraceValue };

export interface TraceFrame {
  fn: string;
  line: number;
  locals: Record<string, string>;
}

export interface TraceStep {
  line: number;
  event: TraceEvent;
  frames: TraceFrame[];
  objects: Record<string, Record<string, TraceValue>>;
  detail?: string;
}

export interface RecordedTrace {
  source: string;
  sourcePath: string;
  python: string;
  scenarios: Record<string, TraceStep[]>;
}

export interface BiText {
  en: string;
  bn: string;
}

/**
 * Conditions a note variant can test, kept generic so the player holds no
 * domain logic. `changesNext` compares an object path ("provider.ledger")
 * between this step and the next one.
 */
export type TraceCondition = { localPresent: string } | { changesNext: string };

export interface TraceNoteText {
  what: BiText;
  why?: BiText;
  without?: BiText;
  ref?: string;
}

export interface TraceNote extends TraceNoteText {
  variants?: Array<{ when: TraceCondition } & Partial<TraceNoteText>>;
}

export interface TraceScenarioMeta {
  id: string;
  title: BiText;
  /** Step to open on: an index, or the first exception caught in the outermost frame. */
  initialStep?: number | "firstCaughtException";
}

export interface CodeTraceDefinition {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  /** Path shown in the code panel header, e.g. harness/ch02/aci_refund.py */
  displayPath: string;
  trace: RecordedTrace;
  scenarios: TraceScenarioMeta[];
  /**
   * Notes keyed by line number, with "!" for an exception event and "^" for
   * a return event: "87", "87!", "53^". Text may use {local.name},
   * {object.name.attr}, {detail} and {line}.
   */
  notes: Record<string, TraceNote>;
  /** Type names shown next to watched objects, e.g. { op: "Operation" }. */
  objectTypes?: Record<string, string>;
}
