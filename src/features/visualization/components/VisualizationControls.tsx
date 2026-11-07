import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { PlaybackSpeed, PlaybackState } from "../types/visualization.types";
import { useTranslation } from "@/i18n";
import "./VisualizationControls.css";

/** Above this many steps the timeline becomes a scrubber instead of dots. */
const MAX_TIMELINE_DOTS = 16;

export interface VisualizationControlsProps {
  playbackState: PlaybackState;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
  onSeek: (stepIndex: number) => void;
  onSetSpeed: (speed: PlaybackSpeed) => void;
}

export const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  playbackState,
  onNext,
  onPrev,
  onReset,
  onTogglePlay,
  onSeek,
  onSetSpeed,
}) => {
  const { locale } = useTranslation();
  const { currentStepIndex, isPlaying, speed, totalSteps } = playbackState;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  const speeds: PlaybackSpeed[] = [0.5, 1, 1.5, 2];

  return (
    <div className="kodara-vis-controls" data-testid="visualization-controls">
      <div className="kodara-vis-controls__main">
        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="kodara-vis-controls__btn"
          title={locale === "bn" ? "রিসেট করুন (r)" : "Reset to step 1 (r)"}
          aria-label="Reset visualization"
        >
          <RotateCcw size={14} />
          <span className="kodara-vis-controls__btn-text">
            {locale === "bn" ? "রিসেট" : "Reset"}
          </span>
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="kodara-vis-controls__btn"
          title={locale === "bn" ? "পূর্ববর্তী ধাপ (k / ←)" : "Previous step (k / ←)"}
          aria-label="Previous step"
        >
          <ChevronLeft size={16} />
          <span className="kodara-vis-controls__btn-text">
            {locale === "bn" ? "পূর্ববর্তী" : "Prev"}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="kodara-vis-controls__btn kodara-vis-controls__btn--play"
          title={
            isPlaying
              ? locale === "bn"
                ? "পজ করুন (Space)"
                : "Pause (Space)"
              : locale === "bn"
              ? "প্লে করুন (Space)"
              : "Play (Space)"
          }
          aria-label={isPlaying ? "Pause playback" : "Start playback"}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 1 }} />}
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="kodara-vis-controls__btn"
          title={locale === "bn" ? "পরবর্তী ধাপ (j / →)" : "Next step (j / →)"}
          aria-label="Next step"
        >
          <span className="kodara-vis-controls__btn-text">
            {locale === "bn" ? "পরবর্তী" : "Next"}
          </span>
          <ChevronRight size={16} />
        </button>

        {/* Speed Selector */}
        <div className="kodara-vis-controls__speed">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSpeed(s)}
              className={`kodara-vis-controls__speed-btn ${
                speed === s ? "kodara-vis-controls__speed-btn--active" : ""
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbable Timeline */}
      <div className="kodara-vis-controls__timeline">
        {totalSteps > MAX_TIMELINE_DOTS ? (
          <input
            type="range"
            className="kodara-vis-controls__scrubber"
            min={0}
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label={locale === "bn" ? "টাইমলাইন" : "Timeline"}
          />
        ) : (
        <div className="kodara-vis-controls__dots">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSeek(idx)}
                className={`kodara-vis-controls__dot ${
                  isCurrent
                    ? "kodara-vis-controls__dot--current"
                    : isCompleted
                    ? "kodara-vis-controls__dot--completed"
                    : ""
                }`}
                title={`${locale === "bn" ? "ধাপ" : "Step"} ${idx + 1}`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            );
          })}
        </div>
        )}

        <span className="kodara-vis-controls__counter">
          {locale === "bn"
            ? `ধাপ ${currentStepIndex + 1} / ${totalSteps}`
            : `Step ${currentStepIndex + 1} of ${totalSteps}`}
        </span>
      </div>
    </div>
  );
};
