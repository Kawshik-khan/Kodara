import React from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { VisualizationBlock as VisualizationBlockType } from "../../types/lesson.types";
import { defaultVisualizationRegistry } from "@/features/visualization/core/registry";
import { VisualizationEngine } from "@/features/visualization/components/VisualizationEngine";
import { VariableRuntimeVisualizer } from "../visualizations/VariableRuntimeVisualizer";

export interface VisualizationBlockProps {
  data: VisualizationBlockType;
}

export const VisualizationBlock: React.FC<VisualizationBlockProps> = ({
  data,
}) => {
  const { locale } = useTranslation();

  // 1. Check if registered in the Visualization Engine
  const definition = defaultVisualizationRegistry.get(data.visualizationId);

  if (definition) {
    return (
      <div className="kodara-vis-block-wrapper" data-testid="visualization-block">
        <VisualizationEngine definition={definition} />
      </div>
    );
  }

  // 2. Fallback to specialized standalone visualizer if legacy ID is used
  if (data.visualizationId === "variable-runtime-visualizer") {
    return (
      <div className="kodara-vis-block-wrapper" data-testid="visualization-block">
        <VariableRuntimeVisualizer />
      </div>
    );
  }

  // 3. Graceful fallback if visualization is not found
  const title = locale === "bn" ? data.titleBn : data.titleEn;
  const description =
    locale === "bn"
      ? data.descriptionBn || data.descriptionEn
      : data.descriptionEn;

  return (
    <div className="kodara-vis-block-wrapper" data-testid="visualization-block">
      <div
        style={{
          padding: 24,
          background: "#ffffff",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-card)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AlertCircle size={24} style={{ color: "var(--accent-primary)" }} />
        <h4 style={{ margin: 0 }}>{title}</h4>
        {description && (
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            {description}
          </p>
        )}
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          ID: {data.visualizationId}
        </span>
      </div>
    </div>
  );
};
