/**
 * Parameterized, controllable charts (ADR-008). Series are pure functions of
 * the tracked x value and the chosen parameters, so the same formulas can be
 * mirrored in a ManimGL scene and unit-tested.
 */

export type ChartTone = "accent" | "info" | "success" | "danger";

export interface BiText {
  en: string;
  bn: string;
}

export type ChartParams = Record<string, number>;

export interface ChartAxis {
  min: number;
  max: number;
  tickStep: number;
  label: BiText;
  /** Appended to tick labels, e.g. "%" */
  unit?: string;
}

export interface ChartChoiceParam {
  id: string;
  label: BiText;
  options: number[];
  defaultValue: number;
}

export interface ChartSeries {
  id: string;
  label: (params: ChartParams) => BiText;
  tone: ChartTone;
  dashed?: boolean;
  fn: (x: number, params: ChartParams) => number;
  /** Show a dot and value tag at the tracked x. */
  marker?: "tag" | "dot";
  /** Text after the value in the tag, e.g. "reads" */
  markerUnit?: BiText;
}

export interface ChartBarItem {
  label: string;
  tone: ChartTone;
  value: (x: number, params: ChartParams) => number;
}

export interface ChartBarGroup {
  label: BiText;
  /** Value that fills the whole bar. */
  scaleMax: number;
  format: "int" | "euro";
  items: ChartBarItem[];
}

export interface ChartDefinition {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  x: ChartAxis & { tracker: BiText; initial: number; step: number };
  y: ChartAxis;
  params: ChartChoiceParam[];
  series: ChartSeries[];
  barsTitle?: BiText;
  bars?: ChartBarGroup[];
  /** Plain-text formula shown under the chart. */
  formula: string;
  insight: (x: number, params: ChartParams) => BiText;
  modeledNote: BiText;
  manim?: { source: string; command: string; note: BiText };
}
