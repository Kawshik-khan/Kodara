import React from "react";
import clsx from "clsx";
import "./Badge.css";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "orange" | "neutral" | "success" | "warning" | "info" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({
  children,
  variant = "orange",
  size = "sm",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "kodara-badge",
        `kodara-badge--${variant}`,
        `kodara-badge--${size}`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
