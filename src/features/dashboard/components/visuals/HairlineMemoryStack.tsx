import React from "react";
import "@/components/visual/hairline/hairline.css";

export interface HairlineMemoryStackProps {
  caption: string;
}

interface StackLayer {
  keyword: string;
  note: string;
  active?: boolean;
}

const LAYERS: StackLayer[] = [
  { keyword: "let", note: "block · mutable", active: true },
  { keyword: "const", note: "block · fixed" },
  { keyword: "var", note: "function · hoisted" },
];

// Exploded isometric stack geometry (2:1 iso).
const CX = 70;
const W = 36;
const H = 18;
const D = 14;
const TOP = 30;
const SPACING = 42;

const pts = (...p: number[][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

const isoBox = (cy: number) => ({
  top: pts([CX, cy - H], [CX + W, cy], [CX, cy + H], [CX - W, cy]),
  left: pts([CX - W, cy], [CX, cy + H], [CX, cy + H + D], [CX - W, cy + D]),
  right: pts([CX, cy + H], [CX + W, cy], [CX + W, cy + D], [CX, cy + H + D]),
});

/** Hatch lines across the right face, parallel to its vertical edges. */
const rightFaceHatch = (cy: number) =>
  [0.25, 0.5, 0.75].map((t) => {
    const x = CX + W * t;
    const y = cy + H - H * t;
    return { x, y1: y + 2, y2: y + D - 2 };
  });

/**
 * HairlineMemoryStack: exploded axonometric drawing of let / const / var as
 * stacked memory slots, annotated like an engineering sheet.
 */
export const HairlineMemoryStack: React.FC<HairlineMemoryStackProps> = ({ caption }) => {
  const centers = LAYERS.map((_, i) => TOP + i * SPACING);
  const groundY = centers[centers.length - 1] + D;
  const stackTop = TOP - H;
  const stackBottom = centers[centers.length - 1] + H + D;

  return (
    <svg
      viewBox="0 0 240 180"
      className="hl-svg continue-learning-card__svg"
      aria-hidden="true"
    >
      {/* Sheet crop marks */}
      <path d="M 4 10 L 4 4 L 10 4" className="hl-neutral" />
      <path d="M 230 4 L 236 4 L 236 10" className="hl-neutral" />
      <path d="M 4 170 L 4 176 L 10 176" className="hl-neutral" />
      <path d="M 230 176 L 236 176 L 236 170" className="hl-neutral" />

      {/* Ground plane */}
      <polygon
        points={pts([CX, groundY - 27], [CX + 54, groundY], [CX, groundY + 27], [CX - 54, groundY])}
        className="hl-guide"
      />
      <line x1={CX - 54} y1={groundY} x2={CX + 54} y2={groundY} className="hl-guide" />
      <line x1={CX} y1={groundY - 27} x2={CX} y2={groundY + 27} className="hl-guide" />

      {/* Explosion guides between layers */}
      {centers.slice(0, -1).map((cy, i) => (
        <g key={`guide-${i}`}>
          <line x1={CX - W} y1={cy + D} x2={CX - W} y2={centers[i + 1]} className="hl-guide" />
          <line x1={CX + W} y1={cy + D} x2={CX + W} y2={centers[i + 1]} className="hl-guide" />
        </g>
      ))}

      {/* Boxes, painted bottom-up so upper layers occlude lower ones */}
      {[...LAYERS]
        .map((layer, i) => ({ layer, cy: centers[i] }))
        .reverse()
        .map(({ layer, cy }) => {
          const box = isoBox(cy);
          const stroke = layer.active ? "hl-ink" : "hl-soft";
          return (
            <g key={layer.keyword}>
              <polygon points={box.left} className={`${stroke} hl-paper`} />
              <polygon points={box.right} className={`${stroke} hl-paper`} />
              <polygon points={box.top} className={`${stroke} hl-paper`} />
              {layer.active &&
                rightFaceHatch(cy).map((h) => (
                  <line key={h.x} x1={h.x} y1={h.y1} x2={h.x} y2={h.y2} className="hl-soft hl-fine" />
                ))}
              <text
                x={CX}
                y={cy + 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                className="hl-text-ink"
                opacity={layer.active ? 1 : 0.7}
              >
                {layer.keyword}
              </text>
            </g>
          );
        })}

      {/* Leader lines + rule notes */}
      {LAYERS.map((layer, i) => {
        const cy = centers[i];
        return (
          <g key={`note-${layer.keyword}`}>
            <circle cx={CX + W} cy={cy} r="1.3" className="hl-dot" />
            <line
              x1={CX + W + 3}
              y1={cy}
              x2={CX + W + 18}
              y2={cy}
              className={layer.active ? "hl-ink hl-flow" : "hl-soft hl-dashed"}
            />
            <text x={CX + W + 22} y={cy + 2.5} fontSize="7">
              {layer.note}
            </text>
          </g>
        );
      })}

      {/* Overall height dimension */}
      <line x1="14" y1={stackTop} x2="14" y2={stackBottom} className="hl-neutral hl-fine" />
      <line x1="11" y1={stackTop} x2="17" y2={stackTop} className="hl-neutral" />
      <line x1="11" y1={stackBottom} x2="17" y2={stackBottom} className="hl-neutral" />
      <text
        x="10"
        y={(stackTop + stackBottom) / 2}
        fontSize="6.5"
        textAnchor="middle"
        transform={`rotate(-90 10 ${(stackTop + stackBottom) / 2})`}
      >
        scope
      </text>

      {/* Caption */}
      <line x1="128" y1="160" x2="228" y2="160" className="hl-neutral hl-fine" />
      <line x1="228" y1="157" x2="228" y2="163" className="hl-neutral" />
      <text
        x="228"
        y="172"
        textAnchor="end"
        fontSize="8.5"
        fontWeight="500"
        style={{ fontFamily: "var(--font-sans, sans-serif)" }}
      >
        {caption}
      </text>
    </svg>
  );
};
