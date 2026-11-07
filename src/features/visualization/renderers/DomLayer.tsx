import React from "react";
import { SceneAnnotation, SceneNode } from "../types/scene.types";
import { useTranslation } from "@/i18n";
import "./DomLayer.css";

export interface DomLayerProps {
  nodes: SceneNode[];
  annotations?: SceneAnnotation[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

export const DomLayer: React.FC<DomLayerProps> = ({
  nodes,
  annotations = [],
  selectedNodeId,
  onSelectNode,
  viewBoxWidth,
  viewBoxHeight,
}) => {
  const { locale } = useTranslation();

  // Convert coordinate units to percentage of the viewBox for responsive fluid scaling
  const toPctX = (x: number) => `${(x / viewBoxWidth) * 100}%`;
  const toPctY = (y: number) => `${(y / viewBoxHeight) * 100}%`;
  const toPctW = (w: number) => `${(w / viewBoxWidth) * 100}%`;
  const toPctH = (h: number) => `${(h / viewBoxHeight) * 100}%`;

  return (
    <div className="kodara-vis-dom-layer">
      {nodes.map((node) => {
        const isSelected = selectedNodeId === node.id;
        const stateClass = node.state ? `kodara-vis-node--${node.state}` : "";
        const typeClass = `kodara-vis-node--type-${node.type}`;
        const selectedClass = isSelected ? "kodara-vis-node--selected" : "";

        return (
          <div
            key={node.id}
            id={`vis-node-${node.id}`}
            data-testid={`vis-node-${node.id}`}
            className={`kodara-vis-node ${typeClass} ${stateClass} ${selectedClass}`}
            style={{
              left: toPctX(node.x),
              top: toPctY(node.y),
              width: toPctW(node.width),
              height: toPctH(node.height),
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(node.id);
            }}
            role="button"
            tabIndex={0}
            aria-label={`${node.label} ${node.subLabel || ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectNode(node.id);
              }
            }}
          >
            <div className="kodara-vis-node__header">
              <span className="kodara-vis-node__label">{node.label}</span>
              {node.state === "created" && (
                <span className="kodara-vis-node__badge kodara-vis-node__badge--new">
                  {locale === "bn" ? "নতুন" : "NEW"}
                </span>
              )}
              {node.state === "changed" && (
                <span className="kodara-vis-node__badge kodara-vis-node__badge--mutated">
                  {locale === "bn" ? "পরিবর্তিত" : "UPDATED"}
                </span>
              )}
            </div>

            {node.subLabel && (
              <div className="kodara-vis-node__sublabel">{node.subLabel}</div>
            )}

            {/* Custom payloads for memory slot and heap object */}
            {node.data?.value !== undefined && (
              <div className="kodara-vis-node__value">
                <span className="kodara-vis-node__value-pill">
                  {String(node.data.value)}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Floating annotations */}
      {annotations.map((ann) => {
        const target = nodes.find((n) => n.id === ann.targetNodeId);
        if (!target) return null;

        const badgeType = ann.badgeType || "info";
        const text = locale === "bn" ? ann.textBn : ann.textEn;

        // Position annotation relative to target node
        let annX = target.x + target.width / 2;
        let annY = target.y + target.height + 10;

        if (ann.position === "top") {
          annY = target.y - 28;
        } else if (ann.position === "left") {
          annX = target.x - 70;
          annY = target.y + target.height / 2;
        } else if (ann.position === "right") {
          annX = target.x + target.width + 10;
          annY = target.y + target.height / 2;
        }

        return (
          <div
            key={ann.id}
            className={`kodara-vis-annotation kodara-vis-annotation--${badgeType}`}
            style={{
              left: toPctX(annX),
              top: toPctY(annY),
            }}
          >
            <span className="kodara-vis-annotation__dot" />
            <span className="kodara-vis-annotation__text">{text}</span>
          </div>
        );
      })}
    </div>
  );
};
