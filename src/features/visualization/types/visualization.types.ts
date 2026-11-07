import { Scene } from "./scene.types";

export type VisualizationCategory =
  | "runtime"
  | "memory"
  | "scope"
  | "execution"
  | "async"
  | "data-structure"
  | "algorithm"
  | "type-system"
  | "react"
  | "system-design"
  | "ai-engineering";

export interface InspectorItemDetails {
  titleEn: string;
  titleBn: string;
  kind: string;
  detailsEn: string;
  detailsBn: string;
  memoryAddress?: string;
  scope?: string;
  value?: string;
}

export interface VisualizationStep {
  id: string;
  stepIndex: number;
  titleEn: string;
  titleBn: string;
  explanationEn: string;
  explanationBn: string;
  whyEn?: string;
  whyBn?: string;
  activeLines: number[];
  scene: Scene;
  inspectorDetails?: Record<string, InspectorItemDetails>;
}

export interface VisualizationDefinition {
  id: string;
  version: number;
  category: VisualizationCategory;
  titleEn: string;
  titleBn: string;
  subtitleEn?: string;
  subtitleBn?: string;
  codeSnippet: string;
  codeLanguage: "typescript" | "javascript" | "python";
  initialStepIndex?: number;
  steps: VisualizationStep[];
  concepts?: string[];
}

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

export interface PlaybackState {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  totalSteps: number;
  selectedNodeId: string | null;
}
