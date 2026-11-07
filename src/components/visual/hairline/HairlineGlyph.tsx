import React from "react";
import clsx from "clsx";
import "./hairline.css";

export interface HairlineGlyphProps {
  variant: "plot" | "orbit" | "register";
  width?: number;
  height?: number;
  className?: string;
}

/** Small decorative hairline marks used as card corner accents. */
export const HairlineGlyph: React.FC<HairlineGlyphProps> = ({
  variant,
  width = 48,
  height = 40,
  className,
}) => (
  <svg
    className={clsx("hl-svg", className)}
    width={width}
    height={height}
    viewBox="0 0 48 40"
    aria-hidden="true"
  >
    {variant === "plot" && (
      <>
        <path d="M 6 4 L 6 34 L 44 34" className="hl-neutral" />
        {[14, 22, 30, 38].map((x) => (
          <line key={x} x1={x} y1="34" x2={x} y2="36.5" className="hl-neutral hl-fine" />
        ))}
        {[10, 18, 26].map((y) => (
          <line key={y} x1="6" y1={y} x2="44" y2={y} className="hl-guide" />
        ))}
        <path d="M 6 31 C 14 30, 18 24, 22 20 S 32 8, 42 6" className="hl-ink" />
        <circle cx="14" cy="28.4" r="2" className="hl-ink hl-paper" />
        <circle cx="22" cy="20" r="2" className="hl-ink hl-paper" />
        <circle cx="34" cy="9.6" r="2.4" className="hl-ink hl-paper" />
        <circle cx="34" cy="9.6" r="0.9" className="hl-dot" />
      </>
    )}

    {variant === "orbit" && (
      <>
        <ellipse cx="24" cy="20" rx="20" ry="8" className="hl-soft" />
        <ellipse cx="24" cy="20" rx="20" ry="8" className="hl-guide" transform="rotate(60 24 20)" />
        <ellipse cx="24" cy="20" rx="20" ry="8" className="hl-guide" transform="rotate(-60 24 20)" />
        <circle cx="24" cy="20" r="3.5" className="hl-ink hl-paper" />
        <circle cx="24" cy="20" r="1" className="hl-dot" />
        <circle cx="44" cy="20" r="1.6" className="hl-ink hl-paper" />
        <circle cx="14" cy="37.3" r="1.6" className="hl-ink hl-paper" />
        <circle cx="14" cy="2.7" r="1.6" className="hl-ink hl-paper" />
      </>
    )}

    {variant === "register" && (
      <>
        <circle cx="30" cy="20" r="11" className="hl-soft" />
        <circle cx="30" cy="20" r="5" className="hl-guide" />
        <line x1="30" y1="4" x2="30" y2="36" className="hl-ink hl-fine" />
        <line x1="14" y1="20" x2="46" y2="20" className="hl-ink hl-fine" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="30"
            y1="7.5"
            x2="30"
            y2={deg % 90 === 0 ? 10.5 : 9}
            className="hl-neutral hl-fine"
            transform={`rotate(${deg} 30 20)`}
          />
        ))}
        <circle cx="30" cy="20" r="1.2" className="hl-dot" />
        <path d="M 2 8 L 2 2 L 8 2" className="hl-neutral" />
        <path d="M 2 32 L 2 38 L 8 38" className="hl-neutral" />
      </>
    )}
  </svg>
);
