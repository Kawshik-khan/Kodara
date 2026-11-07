import React from "react";
import clsx from "clsx";
import "./hairline.css";

export interface HairlineMeterProps {
  value: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const TICKS = [0, 25, 50, 75, 100];

/**
 * HairlineMeter: a 1px ruler with quarter ticks, a thin ink line for progress
 * and a hollow marker at the current value.
 */
export const HairlineMeter: React.FC<HairlineMeterProps> = ({
  value,
  size = "md",
  label,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div
      className={clsx("hl-meter", size === "sm" && "hl-meter--sm", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <span className="hl-meter__rail" />
      {TICKS.map((tick) => (
        <span
          key={tick}
          className={clsx(
            "hl-meter__tick",
            (tick === 0 || tick === 100) && "hl-meter__tick--end",
            tick <= pct && "hl-meter__tick--passed"
          )}
          style={{ left: `${tick}%` }}
        />
      ))}
      <span className="hl-meter__fill" style={{ width: `${pct}%` }} />
      <span className="hl-meter__head" style={{ left: `${pct}%` }} />
    </div>
  );
};
