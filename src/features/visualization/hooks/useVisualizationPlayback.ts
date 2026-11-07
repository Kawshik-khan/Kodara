import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import { PlaybackSpeed, PlaybackState } from "../types/visualization.types";
import {
  calculateStepDuration,
  clampStepIndex,
  getNextStepIndex,
  getPrevStepIndex,
} from "../core/playback";

export interface UseVisualizationPlaybackOptions {
  totalSteps: number;
  initialStepIndex?: number;
  enableKeyboardShortcuts?: boolean;
  /**
   * Root element of this visualizer. When several scoped visualizers share a
   * page, keyboard shortcuts go only to the one the learner last interacted
   * with (the first mounted one until then). Unscoped visualizers always
   * respond, as before.
   */
  scopeRef?: RefObject<HTMLElement | null>;
}

/** Scoped visualizers on the page, and the one that receives shortcuts. */
const scopedOwners: symbol[] = [];
let activeOwner: symbol | null = null;

export function useVisualizationPlayback({
  totalSteps,
  initialStepIndex = 0,
  enableKeyboardShortcuts = true,
  scopeRef,
}: UseVisualizationPlaybackOptions) {
  const ownerRef = useRef<symbol>(Symbol("visualizer"));

  useEffect(() => {
    const owner = ownerRef.current;
    const el = scopeRef?.current;
    if (!el) return;
    scopedOwners.push(owner);
    if (activeOwner === null) activeOwner = owner;
    const claim = () => {
      activeOwner = owner;
    };
    el.addEventListener("pointerdown", claim);
    el.addEventListener("focusin", claim);
    return () => {
      el.removeEventListener("pointerdown", claim);
      el.removeEventListener("focusin", claim);
      scopedOwners.splice(scopedOwners.indexOf(owner), 1);
      if (activeOwner === owner) activeOwner = scopedOwners[0] ?? null;
    };
  }, [scopeRef]);

  const [currentStepIndex, setCurrentStepIndex] = useState(() =>
    clampStepIndex(initialStepIndex, totalSteps)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sync with initialStepIndex if definition changes
  useEffect(() => {
    setCurrentStepIndex(clampStepIndex(initialStepIndex, totalSteps));
    setIsPlaying(false);
    setSelectedNodeId(null);
  }, [initialStepIndex, totalSteps]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      setCurrentStepIndex(clampStepIndex(stepIndex, totalSteps));
    },
    [totalSteps]
  );

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = getNextStepIndex(prev, totalSteps);
      if (next === prev) {
        setIsPlaying(false); // Stop playing when reaching end
      }
      return next;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => getPrevStepIndex(prev));
  }, []);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedNodeId(null);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentStepIndex >= totalSteps - 1) {
        // If restarting playback from end, jump to start
        setCurrentStepIndex(0);
      }
      return !prev;
    });
  }, [currentStepIndex, totalSteps]);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  // Timer loop for auto-play
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const duration = calculateStepDuration(speed);
    timerRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed, totalSteps]);

  // Keyboard controls
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (scopeRef && activeOwner !== ownerRef.current) return;

      if (e.key === "ArrowRight" || e.key.toLowerCase() === "j") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "k") {
        e.preventDefault();
        prevStep();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardShortcuts, nextStep, prevStep, togglePlay, reset, scopeRef]);

  const playbackState: PlaybackState = {
    currentStepIndex,
    isPlaying,
    speed,
    totalSteps,
    selectedNodeId,
  };

  return {
    playbackState,
    goToStep,
    nextStep,
    prevStep,
    reset,
    togglePlay,
    setSpeed,
    selectNode,
  };
}
