import React from "react";
import { SceneEdge, SceneNode } from "../types/scene.types";

export interface SvgLayerProps {
  edges: SceneEdge[];
  nodes: SceneNode[];
  width: number;
  height: number;
}

export const SvgLayer: React.FC<SvgLayerProps> = ({ edges, nodes }) => {
  const nodeMap = new Map<string, SceneNode>(nodes.map((n) => [n.id, n]));

  return (
    <g className="kodara-vis-svg-layer">
      <defs>
        {/* Arrowhead marker - precision orange */}
        <marker
          id="kd-arrow-orange"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FF5E1E" />
        </marker>

        {/* Arrowhead marker - muted / idle */}
        <marker
          id="kd-arrow-muted"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#999999" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const from = nodeMap.get(edge.fromNodeId);
        const to = nodeMap.get(edge.toNodeId);
        if (!from || !to) return null;

        // Calculate connection points
        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;

        const isHorizontal = Math.abs(from.x - to.x) > Math.abs(from.y - to.y);

        if (isHorizontal) {
          if (from.x < to.x) {
            startX = from.x + from.width;
            startY = from.y + from.height / 2;
            endX = to.x;
            endY = to.y + to.height / 2;
          } else {
            startX = from.x;
            startY = from.y + from.height / 2;
            endX = to.x + to.width;
            endY = to.y + to.height / 2;
          }
        } else {
          if (from.y < to.y) {
            startX = from.x + from.width / 2;
            startY = from.y + from.height;
            endX = to.x + to.width / 2;
            endY = to.y;
          } else {
            startX = from.x + from.width / 2;
            startY = from.y;
            endX = to.x + to.width / 2;
            endY = to.y + to.height;
          }
        }

        // Cubic bezier curvature
        const dx = endX - startX;
        const dy = endY - startY;
        const cx1 = isHorizontal ? startX + dx * 0.5 : startX;
        const cy1 = isHorizontal ? startY : startY + dy * 0.5;
        const cx2 = isHorizontal ? endX - dx * 0.5 : endX;
        const cy2 = isHorizontal ? endY : endY - dy * 0.5;

        const pathD = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        const isActive = edge.state === "active" || edge.state === "traversing" || edge.state === "highlighted";
        const strokeColor = isActive ? "#FF5E1E" : "#A3A3A3";
        const strokeWidth = isActive ? 2 : 1.5;
        const marker = isActive ? "url(#kd-arrow-orange)" : "url(#kd-arrow-muted)";

        return (
          <g key={edge.id} className={`kodara-vis-edge kodara-vis-edge--${edge.state || "idle"}`}>
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={edge.dashed ? "4,4" : undefined}
              markerEnd={marker}
              style={{
                transition: "stroke 0.25s ease, stroke-width 0.25s ease",
              }}
            />
            {edge.label && (
              <g transform={`translate(${midX}, ${midY - 8})`}>
                <rect
                  x={-edge.label.length * 3.5 - 6}
                  y={-9}
                  width={edge.label.length * 7 + 12}
                  height={18}
                  rx={4}
                  fill="#ffffff"
                  stroke={isActive ? "rgba(255, 94, 30, 0.4)" : "rgba(0, 0, 0, 0.1)"}
                  strokeWidth={1}
                />
                <text
                  textAnchor="middle"
                  y={4}
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fill: isActive ? "#FF5E1E" : "#666666",
                  }}
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
