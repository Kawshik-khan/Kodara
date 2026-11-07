import { PlaybackSpeed } from "../types/visualization.types";

export const BASE_STEP_DURATION_MS = 2500;

export function calculateStepDuration(speed: PlaybackSpeed): number {
  return Math.round(BASE_STEP_DURATION_MS / speed);
}

export function clampStepIndex(stepIndex: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  return Math.max(0, Math.min(stepIndex, totalSteps - 1));
}

export function getNextStepIndex(currentIndex: number, totalSteps: number): number {
  if (currentIndex >= totalSteps - 1) return currentIndex;
  return currentIndex + 1;
}

export function getPrevStepIndex(currentIndex: number): number {
  if (currentIndex <= 0) return 0;
  return currentIndex - 1;
}
