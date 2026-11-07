import React from "react";
import clsx from "clsx";
import "./hairline.css";

export interface HairlineRingProps {
  filled: number;
  total: number;
  size?: number;
  className?: string;
}

const polar = (c: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [c + r * Math.cos(rad), c + r * Math.sin(rad)];
};

const arc = (c: number, r: number, from: number, to: number) => {
  const [x0, y0] = polar(c, r, from);
  const [x1, y1] = polar(c, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
};

/**
 * HairlineRing: a segmented hairline gauge — one arc per unit, filled
 * segments drawn in ink, the rest as a faint dashed track.
 */
export const HairlineRing: React.FC<HairlineRingProps> = ({
  filled,
  total,
  size = 56,
  className,
}) => {
  const c = size / 2;
  const r = c - 6;
  const count = Math.max(1, total);
  const step = 360 / count;
  const gap = count > 1 ? 7 : 0;

  return (
    <svg
      className={clsx("hl-svg", className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${filled} / ${total}`}
    >
      <circle cx={c} cy={c} r={r - 5} className="hl-guide" />
      {Array.from({ length: count }, (_, i) => {
        const from = i * step + gap / 2;
        const to = (i + 1) * step - gap / 2;
        const [tx0, ty0] = polar(c, r + 2, i * step);
        const [tx1, ty1] = polar(c, r + 5, i * step);
        return (
          <g key={i}>
            <path
              d={arc(c, r, from, to)}
              className={i < filled ? "hl-ink" : "hl-neutral hl-dashed"}
            />
            <line x1={tx0} y1={ty0} x2={tx1} y2={ty1} className="hl-neutral hl-fine" />
          </g>
        );
      })}
      <text
        x={c}
        y={c + 3.5}
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        className="hl-text-ink"
      >
        {filled}/{total}
      </text>
    </svg>
  );
};
