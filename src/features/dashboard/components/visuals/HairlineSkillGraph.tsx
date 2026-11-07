import React from "react";
import { useTranslation } from "@/i18n";
import "@/components/visual/hairline/hairline.css";
import { SkillMapPreviewData, SkillNode } from "../../types/dashboard.types";

export interface HairlineSkillGraphProps {
  data: SkillMapPreviewData;
}

const VIEW_W = 160;
const VIEW_H = 140;
const NODE_R = 5;

// Node coordinates in the fixture are percentages of the preview box.
const toView = (node: SkillNode) => ({
  x: 18 + (node.x / 100) * (VIEW_W - 36),
  y: 12 + (node.y / 100) * (VIEW_H - 34),
});

const isLit = (status: SkillNode["status"]) =>
  status === "mastered" || status === "in_progress";

/**
 * HairlineSkillGraph: data-driven concept graph drawn with hairline strokes.
 * Mastered nodes are ringed in ink, open nodes hollow, locked nodes dashed.
 */
export const HairlineSkillGraph: React.FC<HairlineSkillGraphProps> = ({ data }) => {
  const { locale } = useTranslation();
  const byId = new Map(data.nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="hl-svg skill-map-card__graph"
      role="img"
      aria-label="Skill map node graph"
    >
      {/* Dot lattice */}
      {Array.from({ length: 7 }, (_, col) =>
        Array.from({ length: 6 }, (_, row) => (
          <circle
            key={`${col}-${row}`}
            cx={8 + col * 24}
            cy={10 + row * 24}
            r="0.6"
            className="hl-dot"
            opacity="0.25"
          />
        ))
      )}

      {/* Edges, trimmed to stop at node rims */}
      {data.connections.map(({ from, to }) => {
        const a = byId.get(from);
        const b = byId.get(to);
        if (!a || !b) return null;
        const p = toView(a);
        const q = toView(b);
        const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
        const ux = (q.x - p.x) / len;
        const uy = (q.y - p.y) / len;
        const trim = NODE_R + 3;
        const solid = a.status === "mastered" && isLit(b.status);
        const open = a.status === "mastered";
        return (
          <line
            key={`${from}-${to}`}
            x1={p.x + ux * trim}
            y1={p.y + uy * trim}
            x2={q.x - ux * trim}
            y2={q.y - uy * trim}
            className={solid ? "hl-ink" : open ? "hl-soft hl-flow" : "hl-neutral hl-dashed"}
          />
        );
      })}

      {/* Nodes */}
      {data.nodes.map((node) => {
        const { x, y } = toView(node);
        const label = locale === "bn" ? node.labelBn : node.labelEn;
        const mastered = node.status === "mastered";
        const locked = node.status === "locked";
        return (
          <g key={node.id}>
            {mastered && <circle cx={x} cy={y} r={NODE_R + 3.5} className="hl-guide" />}
            <circle
              cx={x}
              cy={y}
              r={NODE_R}
              className={`hl-paper ${locked ? "hl-neutral hl-dashed" : mastered ? "hl-ink" : "hl-soft"}`}
            />
            {mastered && <circle cx={x} cy={y} r="2" className="hl-dot" />}
            {node.status === "in_progress" && (
              <path d={`M ${x} ${y - 2.2} A 2.2 2.2 0 0 1 ${x} ${y + 2.2} Z`} className="hl-dot" />
            )}
            <text
              x={x}
              y={y + NODE_R + 10}
              textAnchor="middle"
              fontSize="8"
              fontWeight={mastered ? 600 : 500}
              className={mastered ? "hl-halo hl-text-ink" : "hl-halo"}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
