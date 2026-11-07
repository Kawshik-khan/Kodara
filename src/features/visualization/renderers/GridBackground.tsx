import React from "react";
import "./GridBackground.css";

export interface GridBackgroundProps {
  width: number;
  height: number;
  gridSize?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  gridSize = 20,
}) => {
  return (
    <g className="kodara-vis-grid" pointerEvents="none">
      <defs>
        <pattern
          id="kodara-tech-grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="rgba(255, 94, 30, 0.07)"
            strokeWidth="0.75"
          />
          <circle cx="0" cy="0" r="0.8" fill="rgba(255, 94, 30, 0.18)" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#kodara-tech-grid)" />
    </g>
  );
};
