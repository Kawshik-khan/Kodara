import React from "react";
import clsx from "clsx";
import "./Skeleton.css";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({
  width,
  height,
  circle = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  const customStyles: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={clsx(
        "kodara-skeleton",
        { "kodara-skeleton--circle": circle },
        className
      )}
      style={customStyles}
      {...props}
    />
  );
}
