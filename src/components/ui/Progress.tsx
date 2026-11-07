import clsx from "clsx";
import "./Progress.css";

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentText?: boolean;
  size?: "sm" | "md";
  height?: number;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label = "Progress",
  showPercentText = false,
  size = "md",
  height,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={clsx("kodara-progress-container", className)}>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={clsx("kodara-progress", `kodara-progress--${size}`)}
        style={height ? { height: `${height}px` } : undefined}
      >
        <div
          className="kodara-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentText && (
        <span className="kodara-progress__text">{percentage}%</span>
      )}
    </div>
  );
}

export const ProgressBar = Progress;
