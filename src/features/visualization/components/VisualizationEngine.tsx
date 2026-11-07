import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { VisualizationDefinition } from "../types/visualization.types";
import { useVisualizationPlayback } from "../hooks/useVisualizationPlayback";
import { SynchronizedCodePanel } from "./SynchronizedCodePanel";
import { SceneRenderer } from "../renderers/SceneRenderer";
import { VisualizationControls } from "./VisualizationControls";
import { VisualizationExplanation } from "./VisualizationExplanation";
import { VisualizationInspector } from "./VisualizationInspector";
import { useTranslation } from "@/i18n";
import "./VisualizationEngine.css";

export interface VisualizationEngineProps {
  definition: VisualizationDefinition;
  enableKeyboardShortcuts?: boolean;
}

export const VisualizationEngine: React.FC<VisualizationEngineProps> = ({
  definition,
  enableKeyboardShortcuts = true,
}) => {
  const { locale } = useTranslation();
  const totalSteps = definition.steps.length;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const {
    playbackState,
    goToStep,
    nextStep,
    prevStep,
    reset,
    togglePlay,
    setSpeed,
    selectNode,
  } = useVisualizationPlayback({
    totalSteps,
    initialStepIndex: definition.initialStepIndex || 0,
    enableKeyboardShortcuts,
    scopeRef: rootRef,
  });

  const currentStep =
    definition.steps[playbackState.currentStepIndex] || definition.steps[0];

  const title = locale === "bn" ? definition.titleBn : definition.titleEn;
  const subtitle =
    locale === "bn" ? definition.subtitleBn : definition.subtitleEn;

  const isCompleted = playbackState.currentStepIndex === totalSteps - 1;

  // Selected node inspector details
  const selectedDetails =
    playbackState.selectedNodeId && currentStep.inspectorDetails
      ? currentStep.inspectorDetails[playbackState.selectedNodeId]
      : undefined;

  return (
    <div
      ref={rootRef}
      className="kodara-vis-engine"
      data-testid="visualization-engine"
      id={`vis-engine-${definition.id}`}
    >
      {/* Header */}
      <div className="kodara-vis-engine__header">
        <div className="kodara-vis-engine__header-left">
          <div className="kodara-vis-engine__title-row">
            <span className="kodara-vis-engine__category-badge">
              {definition.category}
            </span>
            <h3 className="kodara-vis-engine__title">{title}</h3>
          </div>
          {subtitle && (
            <p className="kodara-vis-engine__subtitle">{subtitle}</p>
          )}
        </div>

        {definition.concepts && definition.concepts.length > 0 && (
          <div className="kodara-vis-engine__concepts">
            {definition.concepts.map((concept) => (
              <span key={concept} className="kodara-vis-engine__concept-tag">
                <Sparkles size={11} />
                <span>{concept}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Dual Stage (Code + Visual Scene) */}
      <div className="kodara-vis-engine__stage">
        <div className="kodara-vis-engine__code-col">
          <SynchronizedCodePanel
            code={definition.codeSnippet}
            language={definition.codeLanguage}
            activeLines={currentStep.activeLines}
          />
        </div>

        <div className="kodara-vis-engine__scene-col">
          <SceneRenderer
            scene={currentStep.scene}
            selectedNodeId={playbackState.selectedNodeId}
            onSelectNode={selectNode}
          />

          {playbackState.selectedNodeId && (
            <div className="kodara-vis-engine__inspector-wrapper">
              <VisualizationInspector
                selectedNodeId={playbackState.selectedNodeId}
                details={selectedDetails}
                onClose={() => selectNode(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls & Timeline Toolbar */}
      <div className="kodara-vis-engine__controls-wrapper">
        <VisualizationControls
          playbackState={playbackState}
          onNext={nextStep}
          onPrev={prevStep}
          onReset={reset}
          onTogglePlay={togglePlay}
          onSeek={goToStep}
          onSetSpeed={setSpeed}
        />
      </div>

      {/* Step Explanation */}
      <div className="kodara-vis-engine__explanation-wrapper">
        <VisualizationExplanation step={currentStep} />
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="kodara-vis-engine__completion" data-testid="vis-completed-banner">
          <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
          <span>
            {locale === "bn"
              ? "সিমুলেশন সম্পন্ন হয়েছে! পুনরায় দেখতে 'রিসেট' চাপুন।"
              : "Visualization sequence complete! Click 'Reset' to replay from the beginning."}
          </span>
          <button
            type="button"
            onClick={reset}
            className="kodara-vis-engine__replay-btn"
          >
            {locale === "bn" ? "পুনরায় দেখুন" : "Replay"}
          </button>
        </div>
      )}
    </div>
  );
};
